import { getWorkspaceHandle, removeWorkspaceHandle, saveWorkspaceHandle } from "./db";
import type { BuilderBackup } from "./types";

type SyncStatus = "unsupported" | "disconnected" | "permission" | "connecting" | "connected" | "syncing" | "conflict" | "error";

export interface WorkspaceSyncSnapshot {
  status: SyncStatus;
  fileName: string | null;
  message: string;
  conflict: {
    localRevision: number;
    localUpdatedAt: string;
    remoteRevision: number;
    remoteUpdatedAt: string;
  } | null;
}

type PermissionFileHandle = FileSystemFileHandle & {
  queryPermission(options: { mode: "readwrite" }): Promise<PermissionState>;
  requestPermission(options: { mode: "readwrite" }): Promise<PermissionState>;
  createWritable(): Promise<FileSystemWritableFileStream>;
};

type FilePickerWindow = Window & {
  showSaveFilePicker?: (options: {
    suggestedName?: string;
    types?: Array<{ description: string; accept: Record<string, string[]> }>;
  }) => Promise<FileSystemFileHandle>;
};

function isBuilderBackup(value: unknown): value is BuilderBackup {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<BuilderBackup>;
  return candidate.format === "tomori-persona-builder" && candidate.version === 1 && Boolean(candidate.project?.id) && Array.isArray(candidate.versions);
}

function backupKey(backup: BuilderBackup): string {
  return JSON.stringify({ project: backup.project, versions: backup.versions });
}

export class WorkspaceSync {
  private activeProjectId: string | null = null;
  private handle: PermissionFileHandle | null = null;
  private knownKey: string | null = null;
  private remoteConflict: BuilderBackup | null = null;
  private pollTimer: number | null = null;
  private writeQueue: Promise<void> = Promise.resolve();
  private snapshot: WorkspaceSyncSnapshot = {
    status: "disconnected",
    fileName: null,
    message: "Browser storage only",
    conflict: null,
  };

  constructor(
    private readonly getLocalBackup: () => Promise<BuilderBackup>,
    private readonly applyRemoteBackup: (backup: BuilderBackup) => Promise<void>,
    private readonly preserveRemoteBackup: (backup: BuilderBackup) => Promise<void>,
    private readonly onChange: () => void,
  ) {}

  get state(): WorkspaceSyncSnapshot {
    return this.snapshot;
  }

  get supported(): boolean {
    return typeof (window as FilePickerWindow).showSaveFilePicker === "function";
  }

  async activate(projectId: string): Promise<void> {
    this.stopPolling();
    this.activeProjectId = projectId;
    this.handle = null;
    this.knownKey = null;
    this.remoteConflict = null;
    if (!this.supported) {
      this.update("unsupported", "Linked files require Chrome or Edge", null);
      return;
    }
    const stored = await getWorkspaceHandle(projectId);
    if (!stored) {
      this.update("disconnected", "Browser storage only", null);
      return;
    }
    this.handle = stored as PermissionFileHandle;
    const permission = await this.handle.queryPermission({ mode: "readwrite" });
    if (permission !== "granted") {
      this.update("permission", "Click reconnect to allow file access", null);
      return;
    }
    await this.compareInitialState();
  }

  async connect(suggestedName: string): Promise<void> {
    if (!this.supported || !this.activeProjectId) return;
    try {
      const picker = (window as FilePickerWindow).showSaveFilePicker!;
      const picked = await picker({
        suggestedName,
        types: [{ description: "Persona Bench Builder backup", accept: { "application/json": [".json"] } }],
      });
      this.handle = picked as PermissionFileHandle;
      await saveWorkspaceHandle(this.activeProjectId, picked);
      this.knownKey = null;
      this.remoteConflict = null;
      this.update("connecting", "Linking workspace file…", null);
      await this.compareInitialState();
    } catch (error) {
      if ((error as DOMException)?.name === "AbortError") return;
      this.fail(error, "Could not link the workspace file");
    }
  }

  async reconnect(): Promise<void> {
    if (!this.handle) return;
    try {
      const permission = await this.handle.requestPermission({ mode: "readwrite" });
      if (permission !== "granted") {
        this.update("permission", "File access was not granted", null);
        return;
      }
      await this.compareInitialState();
    } catch (error) {
      this.fail(error, "Could not restore file access");
    }
  }

  async disconnect(): Promise<void> {
    const projectId = this.activeProjectId;
    this.stopPolling();
    this.handle = null;
    this.knownKey = null;
    this.remoteConflict = null;
    if (projectId) await removeWorkspaceHandle(projectId);
    this.update("disconnected", "Browser storage only", null);
  }

  syncLocalChanges(): void {
    if (!this.handle || this.snapshot.status === "permission" || this.snapshot.status === "conflict") return;
    this.writeQueue = this.writeQueue.then(() => this.writeLocal(false)).catch((error) => this.fail(error, "File sync failed"));
  }

  async flushLocalChanges(): Promise<boolean> {
    if (!this.handle || this.snapshot.status === "permission") return true;
    if (this.snapshot.status === "conflict") return false;
    await this.writeQueue;
    await this.writeLocal(false);
    return this.remoteConflict === null;
  }

  async useAgentVersion(): Promise<void> {
    const remote = this.remoteConflict;
    if (!remote) return;
    this.remoteConflict = null;
    await this.applyRemoteBackup(remote);
    this.knownKey = backupKey(remote);
    await this.writeLocal(true);
    this.startPolling();
  }

  async keepBrowserVersion(): Promise<void> {
    if (!this.handle) return;
    const remote = this.remoteConflict;
    if (remote) await this.preserveRemoteBackup(remote);
    this.remoteConflict = null;
    await this.writeLocal(true);
    this.startPolling();
  }

  async checkNow(): Promise<void> {
    await this.poll();
  }

  private async compareInitialState(): Promise<void> {
    if (!this.handle) return;
    try {
      const file = await this.handle.getFile();
      if (!file.size) {
        await this.writeLocal(true);
        this.startPolling();
        return;
      }
      const remote = this.parseBackup(await file.text());
      const local = await this.getLocalBackup();
      const remoteKey = backupKey(remote);
      const localKey = backupKey(local);
      if (remoteKey === localKey) {
        this.knownKey = remoteKey;
        this.update("connected", "Workspace file linked", null);
        this.startPolling();
      } else {
        this.openConflict(local, remote);
      }
    } catch (error) {
      this.fail(error, "Could not read the linked file");
    }
  }

  private async writeLocal(force: boolean): Promise<void> {
    const handle = this.handle;
    const projectId = this.activeProjectId;
    if (!handle || !projectId) return;
    const local = await this.getLocalBackup();
    if (projectId !== this.activeProjectId || handle !== this.handle) return;
    const localKey = backupKey(local);
    if (!force) {
      const file = await handle.getFile();
      if (file.size) {
        const remote = this.parseBackup(await file.text());
        const remoteKey = backupKey(remote);
        if (this.knownKey && remoteKey !== this.knownKey && remoteKey !== localKey) {
          this.openConflict(local, remote);
          return;
        }
      }
    }
    this.update("syncing", "Writing workspace file…", null);
    const writable = await handle.createWritable();
    await writable.write(`${JSON.stringify(local, null, 2)}\n`);
    await writable.close();
    this.knownKey = localKey;
    this.update("connected", "Workspace file up to date", null);
  }

  private async poll(): Promise<void> {
    if (!this.handle || !this.knownKey || this.snapshot.status === "syncing" || this.snapshot.status === "conflict") return;
    try {
      const file = await this.handle.getFile();
      if (!file.size) return;
      const remote = this.parseBackup(await file.text());
      const remoteKey = backupKey(remote);
      if (remoteKey === this.knownKey) return;
      const local = await this.getLocalBackup();
      const localKey = backupKey(local);
      if (localKey === this.knownKey) {
        this.knownKey = remoteKey;
        await this.applyRemoteBackup(remote);
        this.update("connected", "Agent changes loaded", null);
      } else if (localKey === remoteKey) {
        this.knownKey = remoteKey;
        this.update("connected", "Workspace file up to date", null);
      } else {
        this.openConflict(local, remote);
      }
    } catch (error) {
      this.fail(error, "Linked file could not be read");
    }
  }

  private parseBackup(text: string): BuilderBackup {
    const parsed: unknown = JSON.parse(text);
    if (!isBuilderBackup(parsed)) throw new Error("The linked file is not a Persona Bench Builder backup.");
    return parsed;
  }

  private openConflict(local: BuilderBackup, remote: BuilderBackup): void {
    this.remoteConflict = remote;
    this.stopPolling();
    this.update("conflict", "Browser and agent both changed this persona", {
      localRevision: local.project.revision,
      localUpdatedAt: local.project.updatedAt,
      remoteRevision: remote.project.revision,
      remoteUpdatedAt: remote.project.updatedAt,
    });
  }

  private startPolling(): void {
    this.stopPolling();
    if (!this.handle || this.snapshot.status === "conflict") return;
    this.pollTimer = window.setInterval(() => void this.poll(), 2_000);
  }

  private stopPolling(): void {
    if (this.pollTimer !== null) window.clearInterval(this.pollTimer);
    this.pollTimer = null;
  }

  private update(status: SyncStatus, message: string, conflict: WorkspaceSyncSnapshot["conflict"]): void {
    this.snapshot = { status, fileName: this.handle?.name ?? null, message, conflict };
    this.onChange();
  }

  private fail(error: unknown, fallback: string): void {
    const message = error instanceof Error ? error.message : fallback;
    this.update("error", message || fallback, null);
  }
}
