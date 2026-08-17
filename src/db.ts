import type { PersonaProject, PersonaVersion } from "./types";

const DB_NAME = "tomori-persona-creator";
const DB_VERSION = 1;
const PROJECT_STORE = "projects";
const VERSION_STORE = "versions";

let databasePromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise;
  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(PROJECT_STORE)) {
        database.createObjectStore(PROJECT_STORE, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(VERSION_STORE)) {
        const versions = database.createObjectStore(VERSION_STORE, { keyPath: "id" });
        versions.createIndex("projectId", "projectId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
  return databasePromise;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listProjects(): Promise<PersonaProject[]> {
  const database = await openDatabase();
  const values = await requestResult(database.transaction(PROJECT_STORE).objectStore(PROJECT_STORE).getAll());
  return (values as PersonaProject[]).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function saveProject(project: PersonaProject): Promise<void> {
  const database = await openDatabase();
  await requestResult(database.transaction(PROJECT_STORE, "readwrite").objectStore(PROJECT_STORE).put(project));
}

export async function removeProject(projectId: string): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction([PROJECT_STORE, VERSION_STORE], "readwrite");
  transaction.objectStore(PROJECT_STORE).delete(projectId);
  const versionStore = transaction.objectStore(VERSION_STORE);
  const index = versionStore.index("projectId");
  const keys = await requestResult(index.getAllKeys(projectId));
  for (const key of keys) versionStore.delete(key);
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function listVersions(projectId: string): Promise<PersonaVersion[]> {
  const database = await openDatabase();
  const index = database.transaction(VERSION_STORE).objectStore(VERSION_STORE).index("projectId");
  const values = await requestResult(index.getAll(projectId));
  return (values as PersonaVersion[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveVersion(version: PersonaVersion): Promise<void> {
  const database = await openDatabase();
  await requestResult(database.transaction(VERSION_STORE, "readwrite").objectStore(VERSION_STORE).put(version));
}

export async function removeVersion(versionId: string): Promise<void> {
  const database = await openDatabase();
  await requestResult(database.transaction(VERSION_STORE, "readwrite").objectStore(VERSION_STORE).delete(versionId));
}

export async function importProject(project: PersonaProject, versions: PersonaVersion[]): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction([PROJECT_STORE, VERSION_STORE], "readwrite");
  transaction.objectStore(PROJECT_STORE).put(project);
  const versionStore = transaction.objectStore(VERSION_STORE);
  for (const version of versions) versionStore.put(version);
  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
