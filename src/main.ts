import {
  Archive,
  ArrowRight,
  BookmarkPlus,
  Braces,
  Check,
  CircleAlert,
  CircleCheck,
  Copy,
  createIcons,
  Download,
  History,
  Image,
  ImageDown,
  ImagePlus,
  Lightbulb,
  MessagesSquare,
  Moon,
  PackageCheck,
  Plus,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide";
import "./styles.css";
import { importProject, listProjects, listVersions, removeProject, removeVersion, saveProject, saveVersion } from "./db";
import { buildBackup, buildLlmPersona, buildTomoriPng, buildTomoriPreset, downloadBlob, downloadJson, safeFileName, SECTION_LABELS } from "./export";
import type { BuilderBackup, PersonaProject, PersonaVersion, SectionKey, TomoriPresetExport } from "./types";
import { WorkspaceSync } from "./workspace-sync";

const logoUrl = new URL("../tomori_companion_logo.svg", import.meta.url).href;

type SectionDescriptor = {
  key: SectionKey;
  title: string;
  prompt: string;
  example: string;
  rows?: number;
};

type Palette = "lilya" | "aphel" | "nerine" | "tomori" | "zaya";

const sectionGroups: Array<{ id: string; eyebrow: string; title: string; copy: string; sections: SectionDescriptor[] }> = [
  {
    id: "core-character",
    eyebrow: "Character foundation",
    title: "Who are they?",
    copy: "Build the stable facts that should remain true across scenes and conversations.",
    sections: [
      { key: "generalDescription", title: "General description", prompt: "Who is this character in two or three clear sentences?", example: "A retired royal courier who now repairs radios in a coastal town." },
      { key: "personality", title: "Personality and temperament", prompt: "How do they usually react, connect, decide, and recover?", example: "Patient with strangers, fiercely competitive with friends, and quick to hide embarrassment behind dry humor." },
      { key: "history", title: "History and origin", prompt: "Which past events shaped the person they are now?", example: "They left the capital after delivering a letter that ended a lifelong friendship." },
      { key: "currentSituation", title: "Current situation", prompt: "Where are they now, and what pressure is currently acting on them?", example: "Their repair shop is failing just as coded broadcasts begin arriving from the abandoned lighthouse." },
      { key: "values", title: "Values and beliefs", prompt: "What do they consider sacred, unforgivable, or worth protecting?", example: "Promises matter more than rules. Competence deserves respect, regardless of rank." },
    ],
  },
  {
    id: "inner-world",
    eyebrow: "Inner world",
    title: "What moves them?",
    copy: "Contrast desire with resistance. Strong characters want something and pay a price for pursuing it.",
    sections: [
      { key: "likes", title: "Likes", prompt: "What reliably gives them energy, comfort, or delight?", example: "Stormy evenings, bitter coffee, elegant mechanisms, and people who keep up with their banter." },
      { key: "dislikes", title: "Dislikes", prompt: "What irritates, repels, or exhausts them?", example: "Performative politeness, wasted food, open-plan offices, and being thanked in public." },
      { key: "hopes", title: "Hopes", prompt: "What future do they quietly believe might still be possible?", example: "To build a home where nobody needs permission to stay." },
      { key: "fears", title: "Fears", prompt: "What outcome or truth do they avoid confronting?", example: "That every person they protect eventually becomes dependent on them." },
      { key: "motivations", title: "Motivations", prompt: "What makes them act now instead of later?", example: "They need to decode the broadcasts before an old rival reaches the transmitter." },
      { key: "lifeGoals", title: "Life goals", prompt: "What would a meaningful life look like to them?", example: "Restore the lighthouse, reconcile with their former partner, and train a successor." },
    ],
  },
  {
    id: "texture",
    eyebrow: "Character texture",
    title: "How do they feel specific?",
    copy: "Give the character useful friction, habits, connections, and limits instead of only positive traits.",
    sections: [
      { key: "strengths", title: "Strengths", prompt: "What can others depend on them to do well?", example: "Calm crisis leadership, precise recall, and reading the mood of a room." },
      { key: "weaknesses", title: "Weaknesses", prompt: "Which patterns create problems even when their intentions are good?", example: "Confuses being needed with being loved and refuses help until it is too late." },
      { key: "skills", title: "Skills", prompt: "What practical, social, creative, or unusual abilities have they earned?", example: "Radio engineering, coastal navigation, lockpicking, and ballroom dancing." },
      { key: "relationships", title: "Relationships", prompt: "Who matters to them, and what unresolved dynamic exists between them?", example: "Their younger brother idolizes them; their former partner believes they abandoned the cause." },
      { key: "quirks", title: "Habits and quirks", prompt: "What small recurring behavior makes them recognizable?", example: "Aligns objects while thinking, names every machine, and laughs once when genuinely furious." },
      { key: "secrets", title: "Secrets", prompt: "What fact would change how others understand them?", example: "They wrote the first lighthouse broadcast years ago and have pretended not to recognize it." },
      { key: "boundaries", title: "Boundaries", prompt: "What will they refuse, avoid, or stop tolerating?", example: "Will not threaten children, mock sincere grief, or surrender another person's private correspondence." },
      { key: "continuity", title: "Important continuity facts", prompt: "Which facts must the character consistently remember about themselves?", example: "Their left hand trembles after heavy exertion. They never learned to swim." },
    ],
  },
];

const voiceSections: SectionDescriptor[] = [
  { key: "speechStyle", title: "Speech style", prompt: "How long are their sentences, and how direct or expressive are they?", example: "Short, exact sentences. Questions are often answered with another question." },
  { key: "vocabulary", title: "Vocabulary", prompt: "Which words, metaphors, nicknames, or verbal habits recur?", example: "Uses radio metaphors and calls complicated problems 'bad signals'." },
  { key: "mannerisms", title: "Tone and mannerisms", prompt: "What emotional subtext should shape their replies?", example: "Warmly teasing when relaxed; unnervingly formal when hurt." },
  { key: "neverSays", title: "Things they would never say", prompt: "Which phrases or attitudes would break character?", example: "Never gives generic motivational speeches or calls someone 'bestie'." },
];

const allSectionKeys = [...sectionGroups.flatMap((group) => group.sections), ...voiceSections].map((section) => section.key);
const appIcons = {
  Archive,
  ArrowRight,
  BookmarkPlus,
  Braces,
  Check,
  CircleAlert,
  CircleCheck,
  Copy,
  Download,
  History,
  Image,
  ImageDown,
  ImagePlus,
  Lightbulb,
  MessagesSquare,
  Moon,
  PackageCheck,
  Plus,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  UserRound,
  X,
};
const appMount = document.querySelector<HTMLDivElement>("#app");
const toastMount = document.querySelector<HTMLDivElement>("#toast-region");
if (!appMount || !toastMount) throw new Error("Application mount point is missing.");
const app: HTMLDivElement = appMount;
const toastRegion: HTMLDivElement = toastMount;

const state: {
  projects: PersonaProject[];
  project: PersonaProject;
  versions: PersonaVersion[];
  saveTimer: number | null;
  guided: boolean;
  theme: "dark" | "light";
  palette: Palette;
} = {
  projects: [],
  project: createBlankProject(),
  versions: [],
  saveTimer: null,
  guided: localStorage.getItem("tomori-persona-creator.guided") !== "false",
  theme: localStorage.getItem("tomori-persona-creator.theme.v2") === "light" ? "light" : "dark",
  palette: (["lilya", "aphel", "nerine", "tomori", "zaya"] as Palette[]).includes(localStorage.getItem("tomori-persona-creator.palette") as Palette)
    ? localStorage.getItem("tomori-persona-creator.palette") as Palette
    : "lilya",
};

const workspaceSync = new WorkspaceSync(
  async () => buildBackup(state.project, await listVersions(state.project.id)),
  applyWorkspaceBackup,
  preserveRemoteWorkspaceBackup,
  updateWorkspaceSyncUi,
);

function id(): string {
  return crypto.randomUUID();
}

function isLlmProject(project = state.project): boolean {
  return project.target === "llm";
}

function createBlankProject(name = "Untitled Persona"): PersonaProject {
  const now = new Date().toISOString();
  const sections = Object.fromEntries(
    allSectionKeys.map((key) => [key, { value: "", isPublic: key === "generalDescription" }]),
  ) as PersonaProject["sections"];
  return {
    id: id(),
    target: "tomori",
    name,
    concept: "",
    archetype: "",
    triggerWords: [],
    sections,
    customAttributes: [],
    behaviorModes: [],
    sampleDialogues: [{ id: id(), input: "", output: "" }],
    visualPrompt: "",
    appearanceTags: [],
    avatar: { sourceDataUrl: null, fileName: null, zoom: 1, x: 0, y: 0 },
    createdAt: now,
    updatedAt: now,
    revision: 1,
  };
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message: string, kind: "success" | "error" = "success"): void {
  const item = document.createElement("div");
  item.className = `toast toast-${kind}`;
  item.textContent = message;
  toastRegion.append(item);
  setTimeout(() => item.remove(), 3_400);
}

function icon(name: string, label?: string): string {
  return `<i data-lucide="${name}" aria-hidden="true"></i>${label ? `<span>${label}</span>` : ""}`;
}

function enhanceIcons(): void {
  createIcons({ icons: appIcons, attrs: { "stroke-width": 1.8 } });
}

function splitList(value: string): string[] {
  return [...new Set(value.split(/[,\n]/).map((item) => item.trim()).filter(Boolean))];
}

function completion(): { percent: number; completed: Record<string, boolean>; filled: number; total: number } {
  const project = state.project;
  const checks: Record<string, boolean> = {
    identity: Boolean(project.name.trim() && project.concept.trim() && (isLlmProject(project) || project.triggerWords.length)),
    character: ["generalDescription", "personality", "history", "motivations", "fears"].filter(
      (key) => project.sections[key as SectionKey].value.trim(),
    ).length >= 3,
    voice: Boolean(project.sections.speechStyle.value.trim() && project.sampleDialogues.some((item) => item.input.trim() && item.output.trim())),
    appearance: Boolean(project.avatar.sourceDataUrl && project.visualPrompt.trim()),
    review: Boolean(project.name.trim() && buildTomoriPreset(project).data.attribute_list.length >= 3),
  };
  const completedCount = Object.values(checks).filter(Boolean).length;
  const fieldValues = allSectionKeys.map((key) => project.sections[key].value.trim());
  const filled = fieldValues.filter(Boolean).length + (project.name.trim() ? 1 : 0) + project.sampleDialogues.filter((d) => d.input.trim() && d.output.trim()).length;
  const total = allSectionKeys.length + 2;
  return { percent: Math.round((completedCount / Object.keys(checks).length) * 100), completed: checks, filled, total };
}

function avatarStyle(): string {
  const avatar = state.project.avatar;
  if (!avatar.sourceDataUrl) return "";
  const positionX = (avatar.x + 100) / 2;
  const positionY = (avatar.y + 100) / 2;
  return `background-image:url('${avatar.sourceDataUrl}');background-size:${avatar.zoom * 100}%;background-position:${positionX}% ${positionY}%`;
}

function renderSectionField(section: SectionDescriptor): string {
  const value = state.project.sections[section.key];
  const visibility = isLlmProject() ? "" : `<label class="visibility-check" title="Other active personas may see this attribute">
        <input type="checkbox" data-section-public="${section.key}"${value.isPublic ? " checked" : ""}>
        <span>Public</span>
      </label>`;
  return `<div class="builder-field" data-field-shell="${section.key}">
    <div class="field-heading">
      <label for="section-${section.key}">${escapeHtml(section.title)}</label>
      ${visibility}
    </div>
    <p>${escapeHtml(section.prompt)}</p>
    <textarea id="section-${section.key}" data-section="${section.key}" rows="${section.rows ?? 4}" maxlength="5000" placeholder="${escapeHtml(section.example)}">${escapeHtml(value.value)}</textarea>
    <div class="field-footer"><span>${value.value.length.toLocaleString()} / 5,000</span><button type="button" class="text-button" data-example="${section.key}">Use example</button></div>
  </div>`;
}

function renderGroup(group: (typeof sectionGroups)[number]): string {
  return `<section class="builder-panel reveal-section" id="${group.id}">
    <header class="panel-heading">
      <div><p class="eyebrow">${escapeHtml(group.eyebrow)}</p><h2>${escapeHtml(group.title)}</h2><p>${escapeHtml(group.copy)}</p></div>
      <span class="section-count">${group.sections.filter((section) => state.project.sections[section.key].value.trim()).length}/${group.sections.length}</span>
    </header>
    <div class="field-stack">${group.sections.map(renderSectionField).join("")}</div>
  </section>`;
}

function renderDialogue(dialogue: PersonaProject["sampleDialogues"][number], index: number): string {
  return `<article class="dialogue-row" data-dialogue="${dialogue.id}">
    <div class="dialogue-number"><span>${String(index + 1).padStart(2, "0")}</span><button class="icon-button danger-icon" type="button" data-remove-dialogue="${dialogue.id}" title="Remove example" aria-label="Remove example">${icon("trash-2")}</button></div>
    <div class="dialogue-fields">
      <label><span>User message</span><textarea rows="3" maxlength="5000" data-dialogue-field="input" placeholder="Write a situation that reveals personality...">${escapeHtml(dialogue.input)}</textarea></label>
      <label><span>${escapeHtml(state.project.name || "Character")} response</span><textarea rows="3" maxlength="5000" data-dialogue-field="output" placeholder="Show their voice instead of describing it...">${escapeHtml(dialogue.output)}</textarea></label>
    </div>
    <button class="icon-button" type="button" data-duplicate-dialogue="${dialogue.id}" title="Duplicate example" aria-label="Duplicate example">${icon("copy")}</button>
  </article>`;
}

function renderCustomAttribute(attribute: PersonaProject["customAttributes"][number]): string {
  const visibility = isLlmProject() ? "" : `<label class="visibility-check"><input type="checkbox" data-custom-public${attribute.isPublic ? " checked" : ""}><span>Public</span></label>`;
  return `<article class="custom-attribute" data-custom="${attribute.id}">
    <div class="custom-heading">
      <input data-custom-field="title" value="${escapeHtml(attribute.title)}" maxlength="120" placeholder="Attribute title">
      ${visibility}
      <button class="icon-button danger-icon" type="button" data-remove-custom="${attribute.id}" aria-label="Remove custom attribute" title="Remove attribute">${icon("trash-2")}</button>
    </div>
    <textarea data-custom-field="value" rows="4" maxlength="5000" placeholder="${isLlmProject() ? "What should an LLM know about this character?" : "What should Tomori know about this part of the character?"}">${escapeHtml(attribute.value)}</textarea>
  </article>`;
}

function renderBehaviorMode(mode: PersonaProject["behaviorModes"][number], index: number): string {
  return `<article class="behavior-mode" data-mode="${mode.id}">
    <div class="mode-heading"><span>${String(index + 1).padStart(2, "0")}</span><input data-mode-field="name" value="${escapeHtml(mode.name)}" maxlength="100" placeholder="Mode name, e.g. Money fixation"><button class="icon-button danger-icon" type="button" data-remove-mode="${mode.id}" title="Remove mode" aria-label="Remove mode">${icon("trash-2")}</button></div>
    <div class="mode-fields">
      <label><span>When this happens…</span><small>A concrete, observable condition in the scene or conversation.</small><textarea data-mode-field="condition" rows="3" maxlength="2000" placeholder="When ${escapeHtml(state.project.name || "the character")} sees physical money…">${escapeHtml(mode.condition)}</textarea></label>
      <label><span>Change their behavior like this…</span><small>Describe priorities, reactions, or impulses while the condition is active.</small><textarea data-mode-field="behavior" rows="3" maxlength="3000" placeholder="They lock onto it and will do almost anything to earn it.">${escapeHtml(mode.behavior)}</textarea></label>
    </div>
  </article>`;
}

function renderApp(): void {
  document.body.dataset.theme = state.theme;
  document.body.dataset.palette = state.palette;
  const progress = completion();
  const llmMode = isLlmProject();
  const sync = workspaceSync.state;
  app.innerHTML = `<div class="app-shell${state.guided ? " guided-mode" : ""}">
    <header class="topbar">
      <a class="brand" href="#identity" aria-label="Persona Bench">
        <img src="${logoUrl}" alt="TomoriBot">
        <span><strong>Persona Bench</strong><small>local character workshop</small></span>
      </a>
      <div class="project-switcher">
        <label for="project-select">Current persona</label>
        <select id="project-select">${state.projects.map((project) => `<option value="${project.id}"${project.id === state.project.id ? " selected" : ""}>${escapeHtml(project.name)}</option>`).join("")}</select>
        <button class="icon-button" id="new-project" type="button" title="New persona" aria-label="New persona">${icon("plus")}</button>
      </div>
      <div class="top-actions">
        <span class="save-state" id="save-state"><i></i><span>Saved locally</span></span>
        <button class="button quiet-button" id="duplicate-project" type="button">${icon("copy", "Duplicate")}</button>
        <button class="button quiet-button" id="versions-button" type="button">${icon("history", "Versions")}</button>
        <button class="button primary-button" id="export-button" type="button">${icon("download", "Export")}</button>
        <div class="palette-picker" aria-label="Color palette">
          ${(["lilya", "aphel", "nerine", "tomori", "zaya"] as Palette[]).map((palette) => `<button class="palette-swatch palette-${palette}${state.palette === palette ? " is-active" : ""}" type="button" data-palette="${palette}" title="${palette.charAt(0).toUpperCase() + palette.slice(1)} palette" aria-label="Use ${palette} palette"></button>`).join("")}
        </div>
        <button class="icon-button" id="theme-button" type="button" title="Toggle theme" aria-label="Toggle theme">${icon(state.theme === "dark" ? "sun" : "moon")}</button>
      </div>
    </header>

    <aside class="guide-sidebar">
      <div class="guide-intro"><p class="eyebrow">Character workshop</p><h1>Build someone memorable.</h1><p>Work from a clear idea toward a voice you can recognize without a name tag.</p></div>
      <div class="mobile-project-tools">
        <label><span>Current persona</span><select data-project-select>${state.projects.map((project) => `<option value="${project.id}"${project.id === state.project.id ? " selected" : ""}>${escapeHtml(project.name)}</option>`).join("")}</select></label>
        <div>
          <button class="icon-button" type="button" data-project-action="new" title="New persona" aria-label="New persona">${icon("plus")}</button>
          <button class="icon-button" type="button" data-project-action="duplicate" title="Duplicate persona" aria-label="Duplicate persona">${icon("copy")}</button>
          <button class="icon-button" type="button" data-project-action="versions" title="Versions" aria-label="Versions">${icon("history")}</button>
        </div>
      </div>
      <div class="progress-ring" style="--progress:${progress.percent}"><strong>${progress.percent}%</strong><span>ready</span></div>
      <nav class="guide-nav" aria-label="Builder sections">
        ${([
          ["identity", "sparkles", "Identity"],
          ["core-character", "user-round", "Character"],
          ["behavior-modes", "lightbulb", "Modes"],
          ["voice", "messages-square", "Voice"],
          ["appearance", "image", "Appearance"],
          ["review", "circle-check", "Review"],
        ] as const).map(([target, iconName, label]) => `<a href="#${target}" data-guide-link="${target}" class="${progress.completed[target === "core-character" ? "character" : target] ? "is-complete" : ""}">${icon(iconName)}<span>${label}</span><i data-lucide="check"></i></a>`).join("")}
      </nav>
      <label class="guide-toggle"><span><strong>Guided mode</strong><small>Show prompts and examples</small></span><input id="guided-toggle" type="checkbox"${state.guided ? " checked" : ""}><i></i></label>
      <div class="privacy-note">${icon("shield-check")}<p><strong>Private by design</strong><span>Everything stays in this browser unless you export or link a workspace file.</span></p></div>
      <div class="workspace-sync" id="workspace-sync" data-status="${sync.status}">
        <div class="workspace-sync-heading"><i></i><p><strong>Linked workspace file</strong><span id="workspace-sync-file">${escapeHtml(sync.fileName || "No file linked")}</span></p></div>
        <small id="workspace-sync-message">${escapeHtml(sync.message)}</small>
        <div class="workspace-sync-actions">
          <button class="button secondary-button" id="workspace-link" type="button"${sync.status === "unsupported" ? " disabled" : ""}>${sync.status === "unsupported" ? "Unavailable" : "Link file"}</button>
          <button class="button quiet-button" id="workspace-reconnect" type="button"${sync.status === "permission" ? "" : " hidden"}>Reconnect</button>
          <button class="icon-button" id="workspace-check" type="button" title="Check for agent changes" aria-label="Check for agent changes"${sync.fileName && sync.status !== "permission" ? "" : " hidden"}>${icon("history")}</button>
          <button class="icon-button danger-icon" id="workspace-disconnect" type="button" title="Disconnect workspace file" aria-label="Disconnect workspace file"${sync.fileName ? "" : " hidden"}>${icon("x")}</button>
        </div>
      </div>
    </aside>

    <main class="builder-main">
      <section class="builder-hero reveal-section" id="identity">
        <div class="hero-copy"><p class="eyebrow">Start with the purpose</p><h1 id="hero-name">${escapeHtml(state.project.name)}</h1><p>Persona Bench turns a character idea into structured guidance you can use in TomoriBot or any LLM.</p></div>
        <div class="target-picker" role="group" aria-label="Persona target">
          <button class="target-choice${llmMode ? "" : " is-active"}" type="button" data-target="tomori"><strong>For TomoriBot</strong><span>Tomori presets, trigger words, public attributes, and PNG export.</span></button>
          <button class="target-choice${llmMode ? " is-active" : ""}" type="button" data-target="llm"><strong>For any LLM</strong><span>A portable JSON persona with built-in instructions for each field.</span></button>
        </div>
        <div class="agent-skill-callout">
          <div>${icon("braces")}<p><strong>Build together with an LLM or agent</strong><span>Download the complete skill package and link a workspace file for live local collaboration—or exchange Builder backups manually.</span></p></div>
          <a class="button secondary-button" href="/persona-bench-collaborator-skill.zip" download="persona-bench-collaborator-skill.zip">Download skill (.zip)</a>
        </div>
        <div class="identity-grid">
          <label class="wide-field"><span>Character name</span><small>${llmMode ? "The name the LLM should use for this persona." : "The display name and primary Tomori trigger."}</small><input data-basic="name" value="${escapeHtml(state.project.name)}" maxlength="100" placeholder="Who are we creating?"></label>
          <label><span>Core concept</span><small>One sentence that captures the hook.</small><textarea data-basic="concept" rows="3" maxlength="500" placeholder="A disgraced oracle who can predict everything except her own choices.">${escapeHtml(state.project.concept)}</textarea></label>
          <label><span>Role or archetype</span><small>A useful starting point, not a cage.</small><input data-basic="archetype" value="${escapeHtml(state.project.archetype)}" maxlength="160" placeholder="Reluctant mentor, charming rival..."></label>
          ${llmMode ? "" : '<label><span>Trigger words</span><small>Comma-separated names or phrases that summon this persona.</small><input data-basic="triggerWords" value="' + escapeHtml(state.project.triggerWords.join(", ")) + '" maxlength="2000" placeholder="name, nickname, alias"></label>'}
        </div>
      </section>

      ${sectionGroups.map(renderGroup).join("")}

      <section class="builder-panel reveal-section" id="custom-attributes">
        <header class="panel-heading"><div><p class="eyebrow">Your structure</p><h2>Custom attributes</h2><p>Add anything this character needs that the guide did not ask.</p></div><button type="button" class="button secondary-button" id="add-custom">${icon("plus", "Add attribute")}</button></header>
        <div id="custom-list" class="custom-list">${state.project.customAttributes.map(renderCustomAttribute).join("") || '<div class="empty-line">No custom attributes yet.</div>'}</div>
      </section>

      <section class="builder-panel reveal-section" id="behavior-modes">
        <header class="panel-heading"><div><p class="eyebrow">Conditional behavior</p><h2>Give them modes and triggers.</h2><p>Define situations that temporarily shift the character's priorities or reactions without replacing their core identity.</p></div><button type="button" class="button secondary-button" id="add-mode">${icon("plus", "Add mode")}</button></header>
        <div id="mode-list" class="mode-list">${(state.project.behaviorModes ?? []).map(renderBehaviorMode).join("") || '<div class="empty-line">No conditional behavior modes yet.</div>'}</div>
      </section>

      <section class="builder-panel reveal-section" id="voice">
        <header class="panel-heading"><div><p class="eyebrow">Voice laboratory</p><h2>Make them sound like themselves.</h2><p>Describe the pattern, then prove it through examples. Sample dialogues are often more useful than another paragraph of adjectives.</p></div><span class="section-count">${state.project.sampleDialogues.filter((item) => item.input.trim() && item.output.trim()).length} examples</span></header>
        <div class="field-stack voice-fields">${voiceSections.map(renderSectionField).join("")}</div>
        <div class="subsection-heading"><div><p class="eyebrow">Show, do not tell</p><h3>Sample dialogues</h3><p>Order matters: place narrow or triggered examples first and a characterful, context-neutral baseline last so it hands off cleanly to a new conversation.</p></div><button class="button secondary-button" id="add-dialogue" type="button">${icon("plus", "Add example")}</button></div>
        <div id="dialogue-list" class="dialogue-list">${state.project.sampleDialogues.map(renderDialogue).join("")}</div>
      </section>

      <section class="builder-panel reveal-section" id="appearance">
        <header class="panel-heading"><div><p class="eyebrow">Appearance & image prompt</p><h2>Give the character a face.</h2><p>The visual prompt is for image generation. It is separate from conversational personality attributes.</p></div></header>
        <div class="appearance-layout">
          <div class="avatar-workbench">
            <button class="avatar-preview" id="avatar-choose" type="button" style="${avatarStyle()}" aria-label="Choose avatar">
              ${state.project.avatar.sourceDataUrl ? "" : `${icon("image-plus")}<span>Upload avatar</span><small>PNG, JPEG, GIF or WebP</small>`}
            </button>
            <input id="avatar-file" type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden>
            <div class="crop-controls${state.project.avatar.sourceDataUrl ? "" : " is-disabled"}">
              <label><span>Zoom</span><input type="range" data-avatar-control="zoom" min="1" max="3" step="0.01" value="${state.project.avatar.zoom}"></label>
              <label><span>Horizontal</span><input type="range" data-avatar-control="x" min="-100" max="100" step="1" value="${state.project.avatar.x}"></label>
              <label><span>Vertical</span><input type="range" data-avatar-control="y" min="-100" max="100" step="1" value="${state.project.avatar.y}"></label>
              <button class="text-button" id="remove-avatar" type="button">Remove image</button>
            </div>
          </div>
          <div class="appearance-fields">
            <label><span>Visual character prompt</span><small>Stable identity, body, face, hair, clothing, and distinctive visual details.</small><textarea data-basic="visualPrompt" rows="10" maxlength="5000" placeholder="1girl, short silver hair, mechanical horns, worn courier jacket...">${escapeHtml(state.project.visualPrompt)}</textarea></label>
            ${llmMode ? "" : '<label><span>Physical appearance tags</span><small>Comma-separated imageboard-style traits reused by Tomori image generation.</small><textarea data-basic="appearanceTags" rows="4" maxlength="5000" placeholder="silver hair, green eyes, freckles, mechanical horns">' + escapeHtml(state.project.appearanceTags.join(", ")) + "</textarea></label>"}
          </div>
        </div>
      </section>

      <section class="builder-panel review-panel reveal-section" id="review">
        <header class="panel-heading"><div><p class="eyebrow">Final pass</p><h2>Review the character signal.</h2><p>${llmMode ? "Your JSON will include the populated sections plus guidance for how an LLM should use them." : "Tomori will receive the populated sections below as separate attributes."}</p></div><button class="button primary-button" type="button" data-open-export>${icon("download", "Export persona")}</button></header>
        <div class="review-summary" id="review-summary"></div>
      </section>
    </main>

    <aside class="character-pulse">
      <div class="pulse-avatar" style="${avatarStyle()}">${state.project.avatar.sourceDataUrl ? "" : escapeHtml((state.project.name[0] || "?").toUpperCase())}</div>
      <p class="eyebrow">Character pulse</p><h2 id="pulse-name">${escapeHtml(state.project.name)}</h2><p id="pulse-concept">${escapeHtml(state.project.concept || "Your concept will appear here as the character takes shape.")}</p>
      <div class="pulse-metrics"><div><span>Attributes</span><strong id="pulse-attributes">${buildTomoriPreset(state.project).data.attribute_list.length}</strong></div><div><span>Dialogues</span><strong id="pulse-dialogues">${state.project.sampleDialogues.filter((d) => d.input.trim() && d.output.trim()).length}</strong></div></div>
      <div class="pulse-tip"><i data-lucide="lightbulb"></i><p><strong>Current suggestion</strong><span id="pulse-tip">${suggestion()}</span></p></div>
      <button class="button secondary-button full-button" type="button" data-open-export>${icon("package-check", "Check export")}</button>
    </aside>
  </div>

  <dialog id="versions-dialog" class="modal"><div class="modal-surface version-modal">
    <header><div><p class="eyebrow">Local history</p><h2>Versions</h2><p>Create checkpoints before making a major change.</p></div><button class="icon-button" data-close-dialog="versions-dialog" aria-label="Close">${icon("x")}</button></header>
    <form id="version-form" class="version-create"><input name="label" maxlength="80" placeholder="Version label, e.g. First complete draft" required><button class="button primary-button" type="submit">${icon("bookmark-plus", "Save version")}</button></form>
    <div id="version-list" class="version-list"></div>
    <footer><button class="button danger-button" id="delete-project" type="button">${icon("trash-2", "Delete persona")}</button><button class="button quiet-button" data-close-dialog="versions-dialog" type="button">Close</button></footer>
  </div></dialog>

  <dialog id="export-dialog" class="modal"><div class="modal-surface export-modal">
    <header><div><p class="eyebrow">Ready to travel</p><h2>Export persona</h2><p>${llmMode ? "Download portable JSON for your LLM, or save a complete builder backup." : "Choose a Tomori-ready file or a complete builder backup."}</p></div><button class="icon-button" data-close-dialog="export-dialog" aria-label="Close">${icon("x")}</button></header>
    <div class="export-readiness" id="export-readiness"></div>
    <div class="export-options">
      ${llmMode ? '<button class="export-choice" data-export="llm-json" type="button"><i data-lucide="braces"></i><span><strong>LLM Persona JSON</strong><small>Portable persona data with field-by-field prompt guidance.</small></span><i data-lucide="arrow-right"></i></button>' : '<button class="export-choice" data-export="png" type="button"><i data-lucide="image-down"></i><span><strong>Tomori PNG</strong><small>Avatar and import data in one shareable file.</small></span><i data-lucide="arrow-right"></i></button><button class="export-choice" data-export="json" type="button"><i data-lucide="braces"></i><span><strong>Tomori JSON</strong><small>Importable native preset without the avatar image.</small></span><i data-lucide="arrow-right"></i></button>'}
      <button class="export-choice" data-export="backup" type="button"><i data-lucide="archive"></i><span><strong>Builder backup</strong><small>Project, avatar, tutorial fields, and version history.</small></span><i data-lucide="arrow-right"></i></button>
    </div>
    <footer><label class="button quiet-button import-button">${icon("upload", "Import project")}<input id="project-import" type="file" accept="application/json,.json" hidden></label><button class="button quiet-button" data-close-dialog="export-dialog" type="button">Close</button></footer>
  </div></dialog>

  <dialog id="sync-conflict-dialog" class="modal"><div class="modal-surface sync-conflict-modal">
    <header><div><p class="eyebrow">Sync conflict</p><h2>Browser and agent both made changes.</h2><p>Choose which complete project should become the shared version. Persona Bench saves the other side as a named local version before resolving the conflict.</p></div></header>
    <div class="sync-conflict-versions">
      <article><span>Browser version</span><strong id="sync-local-revision">Revision —</strong><small id="sync-local-time">—</small></article>
      <article><span>Agent file</span><strong id="sync-remote-revision">Revision —</strong><small id="sync-remote-time">—</small></article>
    </div>
    <footer><button class="button quiet-button" id="sync-use-agent" type="button">Load agent version</button><button class="button primary-button" id="sync-keep-browser" type="button">Keep browser version</button></footer>
  </div></dialog>`;
  updateDerivedUi();
  updateWorkspaceSyncUi();
  bindIntersectionObserver();
  enhanceIcons();
}

async function applyWorkspaceBackup(backup: BuilderBackup): Promise<void> {
  const projectId = state.project.id;
  const checkpoint: PersonaVersion = {
    id: id(),
    projectId,
    label: "Before loading agent changes",
    createdAt: new Date().toISOString(),
    project: structuredClone(state.project),
  };
  const project = structuredClone(backup.project);
  project.id = projectId;
  project.target ??= "tomori";
  project.behaviorModes ??= [];
  const versions = [checkpoint, ...backup.versions.map((version) => ({
    ...structuredClone(version),
    projectId,
    project: {
      ...structuredClone(version.project),
      id: projectId,
      target: version.project.target ?? "tomori",
      behaviorModes: version.project.behaviorModes ?? [],
    },
  }))];
  await importProject(project, versions);
  state.project = project;
  state.versions = versions;
  const index = state.projects.findIndex((item) => item.id === projectId);
  if (index >= 0) state.projects[index] = structuredClone(project);
  renderApp();
  toast("Agent changes loaded from the linked file");
}

async function preserveRemoteWorkspaceBackup(backup: BuilderBackup): Promise<void> {
  const projectId = state.project.id;
  const remote = structuredClone(backup.project);
  remote.id = projectId;
  remote.target ??= "tomori";
  remote.behaviorModes ??= [];
  const version: PersonaVersion = {
    id: id(),
    projectId,
    label: "Agent file before conflict resolution",
    createdAt: new Date().toISOString(),
    project: remote,
  };
  await saveVersion(version);
  state.versions.unshift(version);
}

function updateWorkspaceSyncUi(): void {
  const sync = workspaceSync.state;
  const card = document.querySelector<HTMLElement>("#workspace-sync");
  if (card) card.dataset.status = sync.status;
  const file = document.querySelector<HTMLElement>("#workspace-sync-file");
  if (file) file.textContent = sync.fileName || "No file linked";
  const message = document.querySelector<HTMLElement>("#workspace-sync-message");
  if (message) message.textContent = sync.message;
  const link = document.querySelector<HTMLButtonElement>("#workspace-link");
  if (link) {
    link.hidden = Boolean(sync.fileName) && sync.status !== "unsupported";
    link.disabled = sync.status === "unsupported";
    link.textContent = sync.status === "unsupported" ? "Unavailable" : "Link file";
  }
  const reconnect = document.querySelector<HTMLButtonElement>("#workspace-reconnect");
  if (reconnect) reconnect.hidden = sync.status !== "permission";
  const check = document.querySelector<HTMLButtonElement>("#workspace-check");
  if (check) check.hidden = !sync.fileName || sync.status === "permission";
  const disconnect = document.querySelector<HTMLButtonElement>("#workspace-disconnect");
  if (disconnect) disconnect.hidden = !sync.fileName;

  const dialog = document.querySelector<HTMLDialogElement>("#sync-conflict-dialog");
  if (sync.status === "conflict" && sync.conflict && dialog) {
    const localRevision = document.querySelector<HTMLElement>("#sync-local-revision");
    const localTime = document.querySelector<HTMLElement>("#sync-local-time");
    const remoteRevision = document.querySelector<HTMLElement>("#sync-remote-revision");
    const remoteTime = document.querySelector<HTMLElement>("#sync-remote-time");
    if (localRevision) localRevision.textContent = `Revision ${sync.conflict.localRevision}`;
    if (localTime) localTime.textContent = new Date(sync.conflict.localUpdatedAt).toLocaleString();
    if (remoteRevision) remoteRevision.textContent = `Revision ${sync.conflict.remoteRevision}`;
    if (remoteTime) remoteTime.textContent = new Date(sync.conflict.remoteUpdatedAt).toLocaleString();
    if (!dialog.open) dialog.showModal();
  } else if (dialog?.open) {
    dialog.close();
  }
}

function suggestion(): string {
  const project = state.project;
  if (!project.concept.trim()) return "Write the one-sentence concept before adding detail.";
  if (!project.sections.motivations.value.trim()) return "Give them a reason to act now, not someday.";
  if (!project.sections.weaknesses.value.trim()) return "A useful weakness should create choices and consequences.";
  if (!project.sections.speechStyle.value.trim()) return "Describe sentence length, directness, and emotional rhythm.";
  if (!project.sampleDialogues.some((item) => item.input.trim() && item.output.trim())) return "Prove the voice with one short exchange.";
  if (!project.visualPrompt.trim()) return "Keep visual identity separate from conversational personality.";
  return "Read the attributes once and remove anything repetitive or generic.";
}

function updateDerivedUi(): void {
  const project = state.project;
  const preset = buildTomoriPreset(project);
  const llmMode = isLlmProject();
  const llmPersona = buildLlmPersona(project);
  const progress = completion();
  document.querySelector(".progress-ring")?.setAttribute("style", `--progress:${progress.percent}`);
  const progressNumber = document.querySelector<HTMLElement>(".progress-ring strong");
  if (progressNumber) progressNumber.textContent = `${progress.percent}%`;
  for (const [target, complete] of Object.entries(progress.completed)) {
    const normalized = target === "character" ? "core-character" : target;
    document.querySelector(`[data-guide-link="${normalized}"]`)?.classList.toggle("is-complete", complete);
  }
  for (const selector of ["#hero-name", "#pulse-name"]) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) element.textContent = project.name || "Untitled Persona";
  }
  const concept = document.querySelector<HTMLElement>("#pulse-concept");
  if (concept) concept.textContent = project.concept || "Your concept will appear here as the character takes shape.";
  const attr = document.querySelector<HTMLElement>("#pulse-attributes");
  if (attr) attr.textContent = String(llmMode ? Object.keys(llmPersona.persona.character_details as object).length + (llmPersona.persona.custom_attributes as unknown[]).length + ((llmPersona.persona.behavior_modes as { modes: unknown[] }).modes.length) : preset.data.attribute_list.length);
  const dialogue = document.querySelector<HTMLElement>("#pulse-dialogues");
  if (dialogue) dialogue.textContent = String(preset.data.sample_dialogues_in.length);
  const tip = document.querySelector<HTMLElement>("#pulse-tip");
  if (tip) tip.textContent = suggestion();
  const review = document.querySelector<HTMLElement>("#review-summary");
  if (review) {
    const attributes = preset.data.attribute_list;
    const llmAttributes = Object.entries(llmPersona.persona.character_details as Record<string, { _label: string; value: string }>);
    const llmModes = (llmPersona.persona.behavior_modes as { modes: Array<{ name: string; when: string; behavioral_shift: string }> }).modes;
    const count = llmMode ? llmAttributes.length + (llmPersona.persona.custom_attributes as unknown[]).length + llmModes.length : attributes.length;
    const cards = llmMode
      ? llmAttributes.map(([, item]) => `<div><span>LLM guidance included</span><p>${escapeHtml(`${item._label}:\n${item.value}`)}</p></div>`).join("") + llmModes.map((mode) => `<div><span>Conditional mode</span><p>${escapeHtml(`${mode.name}\nWhen: ${mode.when}\nThen: ${mode.behavioral_shift}`)}</p></div>`).join("")
      : attributes.map((text, index) => `<div><span>${preset.data.attribute_public_flags[index] ? "Public" : "Private"}</span><p>${escapeHtml(text)}</p></div>`).join("");
    review.innerHTML = `<div class="review-score"><strong>${progress.percent}%</strong><span>builder readiness</span><small>${count} attributes / ${preset.data.sample_dialogues_in.length} dialogues</small></div>
      <div class="review-attributes">${cards || '<div class="empty-line">Complete character sections to preview exported attributes.</div>'}</div>`;
  }
  const readiness = document.querySelector<HTMLElement>("#export-readiness");
  if (readiness) {
    const warnings = [
      !project.name.trim() ? "Add a character name." : "",
      attributesCount(project) < 3 ? "Add at least three meaningful character attributes." : "",
      !preset.data.sample_dialogues_in.length ? "A sample dialogue will make the voice more reliable." : "",
      !llmMode && !project.avatar.sourceDataUrl ? "No avatar uploaded. The PNG will use a generated placeholder." : "",
    ].filter(Boolean);
    readiness.innerHTML = warnings.length
      ? `<i data-lucide="circle-alert"></i><div><strong>${warnings.length} review note${warnings.length === 1 ? "" : "s"}</strong>${warnings.map((warning) => `<span>${escapeHtml(warning)}</span>`).join("")}</div>`
      : `<i data-lucide="circle-check"></i><div><strong>${llmMode ? "Ready for your LLM" : "Ready for Tomori"}</strong><span>${llmMode ? "The JSON includes persona data and short instructions for each field." : "The native preset has a name, attributes, dialogue, and avatar."}</span></div>`;
  }
}

function attributesCount(project: PersonaProject): number {
  if (isLlmProject(project)) {
    const persona = buildLlmPersona(project).persona;
    return Object.keys(persona.character_details as object).length + (persona.custom_attributes as unknown[]).length + ((persona.behavior_modes as { modes: unknown[] }).modes.length);
  }
  return buildTomoriPreset(project).data.attribute_list.length;
}

function markDirty(): void {
  const saveState = document.querySelector<HTMLElement>("#save-state");
  if (saveState) {
    saveState.classList.add("is-saving");
    const text = saveState.querySelector("span");
    if (text) text.textContent = "Saving...";
  }
  if (state.saveTimer) clearTimeout(state.saveTimer);
  state.saveTimer = window.setTimeout(async () => {
    state.project.updatedAt = new Date().toISOString();
    state.project.revision += 1;
    await saveProject(state.project);
    const index = state.projects.findIndex((project) => project.id === state.project.id);
    if (index >= 0) state.projects[index] = structuredClone(state.project);
    const item = document.querySelector<HTMLOptionElement>(`#project-select option[value="${state.project.id}"]`);
    if (item) item.textContent = state.project.name || "Untitled Persona";
    if (saveState) {
      saveState.classList.remove("is-saving");
      const text = saveState.querySelector("span");
      if (text) text.textContent = "Saved locally";
    }
    workspaceSync.syncLocalChanges();
  }, 500);
}

function setValue(target: HTMLInputElement | HTMLTextAreaElement): void {
  const basic = target.dataset.basic;
  if (basic === "name" || basic === "concept" || basic === "archetype" || basic === "visualPrompt") {
    state.project[basic] = target.value;
  } else if (basic === "triggerWords") {
    state.project.triggerWords = splitList(target.value).filter((word) => word.toLowerCase() !== state.project.name.toLowerCase());
  } else if (basic === "appearanceTags") {
    state.project.appearanceTags = splitList(target.value);
  }
  const section = target.dataset.section as SectionKey | undefined;
  if (section) state.project.sections[section].value = target.value;
  const dialogueField = target.dataset.dialogueField as "input" | "output" | undefined;
  if (dialogueField) {
    const row = target.closest<HTMLElement>("[data-dialogue]");
    const dialogue = state.project.sampleDialogues.find((item) => item.id === row?.dataset.dialogue);
    if (dialogue) dialogue[dialogueField] = target.value;
  }
  const customField = target.dataset.customField as "title" | "value" | undefined;
  if (customField) {
    const row = target.closest<HTMLElement>("[data-custom]");
    const custom = state.project.customAttributes.find((item) => item.id === row?.dataset.custom);
    if (custom) custom[customField] = target.value;
  }
  const modeField = target.dataset.modeField as "name" | "condition" | "behavior" | undefined;
  if (modeField) {
    const row = target.closest<HTMLElement>("[data-mode]");
    const mode = (state.project.behaviorModes ?? []).find((item) => item.id === row?.dataset.mode);
    if (mode) mode[modeField] = target.value;
  }
  markDirty();
  updateDerivedUi();
  enhanceIcons();
}

function renderVersions(): void {
  const list = document.querySelector<HTMLElement>("#version-list");
  if (!list) return;
  list.innerHTML = state.versions.length
    ? state.versions.map((version) => `<article class="version-row"><div><strong>${escapeHtml(version.label)}</strong><span>${new Date(version.createdAt).toLocaleString()}</span><small>${attributesCount(version.project)} attributes / revision ${version.project.revision}</small></div><div><button class="button quiet-button" data-restore-version="${version.id}" type="button">Restore</button><button class="icon-button danger-icon" data-delete-version="${version.id}" type="button" aria-label="Delete version">${icon("trash-2")}</button></div></article>`).join("")
    : `<div class="empty-state"><i data-lucide="history"></i><strong>No saved versions yet.</strong><span>Autosave protects the current draft. Versions are named checkpoints.</span></div>`;
  enhanceIcons();
}

async function switchProject(projectId: string): Promise<void> {
  const project = state.projects.find((entry) => entry.id === projectId);
  if (!project) return;
  if (state.saveTimer) {
    clearTimeout(state.saveTimer);
    state.saveTimer = null;
    await saveProject(state.project);
    if (!await workspaceSync.flushLocalChanges()) {
      renderApp();
      return;
    }
  }
  state.project = structuredClone(project);
  state.versions = await listVersions(project.id);
  localStorage.setItem("tomori-persona-creator.current", project.id);
  renderApp();
  await workspaceSync.activate(project.id);
  window.scrollTo({ top: 0 });
}

async function addProject(): Promise<void> {
  const project = createBlankProject(`New Persona ${state.projects.length + 1}`);
  await saveProject(project);
  state.projects.unshift(project);
  state.project = project;
  state.versions = [];
  localStorage.setItem("tomori-persona-creator.current", project.id);
  renderApp();
  await workspaceSync.activate(project.id);
  document.querySelector<HTMLInputElement>('[data-basic="name"]')?.select();
  toast("New local persona created");
}

async function duplicateCurrent(): Promise<void> {
  const now = new Date().toISOString();
  const copy = structuredClone(state.project);
  copy.id = id();
  copy.name = `${copy.name || "Untitled Persona"} Copy`;
  copy.createdAt = now;
  copy.updatedAt = now;
  copy.revision = 1;
  copy.sampleDialogues = copy.sampleDialogues.map((dialogue) => ({ ...dialogue, id: id() }));
  copy.customAttributes = copy.customAttributes.map((attribute) => ({ ...attribute, id: id() }));
  copy.behaviorModes = (copy.behaviorModes ?? []).map((mode) => ({ ...mode, id: id() }));
  await saveProject(copy);
  state.projects.unshift(copy);
  state.project = copy;
  state.versions = [];
  localStorage.setItem("tomori-persona-creator.current", copy.id);
  renderApp();
  await workspaceSync.activate(copy.id);
  toast("Persona duplicated");
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function isBuilderBackup(value: unknown): value is BuilderBackup {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<BuilderBackup>;
  return candidate.format === "tomori-persona-builder" && candidate.version === 1 && Boolean(candidate.project?.id);
}

function isTomoriPreset(value: unknown): value is TomoriPresetExport {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<TomoriPresetExport>;
  return candidate.type === "preset" && Boolean(candidate.data?.tomori_nickname) && Array.isArray(candidate.data?.attribute_list);
}

function projectFromPreset(preset: TomoriPresetExport): PersonaProject {
  const project = createBlankProject(preset.data.tomori_nickname);
  project.triggerWords = preset.data.trigger_words.filter((word) => word.toLowerCase() !== project.name.toLowerCase());
  project.visualPrompt = preset.data.persona_prompt ?? "";
  project.appearanceTags = preset.data.physical_appearance_tags ?? [];
  preset.data.attribute_list.forEach((text, index) => {
    const known = (Object.entries(SECTION_LABELS) as Array<[SectionKey, string]>).find(([, label]) => text.startsWith(`${label}:\n`));
    if (known) {
      project.sections[known[0]] = { value: text.slice(known[1].length + 2), isPublic: preset.data.attribute_public_flags?.[index] ?? false };
    } else {
      const [first, ...rest] = text.split("\n");
      project.customAttributes.push({ id: id(), title: first?.replace(/:$/, "") ?? "Imported attribute", value: rest.join("\n") || text, isPublic: preset.data.attribute_public_flags?.[index] ?? false });
    }
  });
  project.sampleDialogues = preset.data.sample_dialogues_in.map((input, index) => ({ id: id(), input, output: preset.data.sample_dialogues_out[index] ?? "" }));
  if (!project.sampleDialogues.length) project.sampleDialogues = [{ id: id(), input: "", output: "" }];
  return project;
}

function bindIntersectionObserver(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-guide-link]")];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.classList.toggle("is-active", link.dataset.guideLink === visible.target.id));
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.2, 0.6] },
  );
  for (const link of links) {
    const target = document.getElementById(link.dataset.guideLink || "");
    if (target) observer.observe(target);
  }
}

app.addEventListener("input", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    if (target.matches("[data-basic], [data-section], [data-dialogue-field], [data-custom-field], [data-mode-field]")) setValue(target);
    if (target instanceof HTMLInputElement) {
      const sectionPublic = target.dataset.sectionPublic as SectionKey | undefined;
      if (sectionPublic) {
        state.project.sections[sectionPublic].isPublic = target.checked;
        markDirty();
        updateDerivedUi();
      }
      if (target.matches("[data-custom-public]")) {
        const row = target.closest<HTMLElement>("[data-custom]");
        const custom = state.project.customAttributes.find((item) => item.id === row?.dataset.custom);
        if (custom) custom.isPublic = target.checked;
        markDirty();
        updateDerivedUi();
      }
      if (target.dataset.avatarControl) {
        const key = target.dataset.avatarControl as "zoom" | "x" | "y";
        state.project.avatar[key] = Number(target.value);
        const style = avatarStyle();
        document.querySelector<HTMLElement>("#avatar-choose")?.setAttribute("style", style);
        document.querySelector<HTMLElement>(".pulse-avatar")?.setAttribute("style", style);
        markDirty();
      }
    }
  }
});

app.addEventListener("change", async (event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement && (target.id === "project-select" || target.matches("[data-project-select]"))) await switchProject(target.value);
  if (target instanceof HTMLInputElement && target.id === "guided-toggle") {
    state.guided = target.checked;
    localStorage.setItem("tomori-persona-creator.guided", String(state.guided));
    document.querySelector(".app-shell")?.classList.toggle("guided-mode", state.guided);
  }
  if (target instanceof HTMLInputElement && target.id === "avatar-file" && target.files?.[0]) {
    const file = target.files[0];
    if (file.size > 12 * 1024 * 1024) return toast("Use an image smaller than 12 MB.", "error");
    state.project.avatar = { sourceDataUrl: await readFileAsDataUrl(file), fileName: file.name, zoom: 1, x: 0, y: 0 };
    markDirty();
    renderApp();
    document.getElementById("appearance")?.scrollIntoView();
  }
  if (target instanceof HTMLInputElement && target.id === "project-import" && target.files?.[0]) {
    try {
      const parsed: unknown = JSON.parse(await target.files[0].text());
      let project: PersonaProject;
      let versions: PersonaVersion[] = [];
      if (isBuilderBackup(parsed)) {
        project = structuredClone(parsed.project);
        project.id = id();
        project.target ??= "tomori";
        project.behaviorModes ??= [];
        project.name = `${project.name} (Imported)`;
        versions = parsed.versions.map((version) => ({ ...structuredClone(version), id: id(), projectId: project.id, project: { ...structuredClone(version.project), id: project.id } }));
      } else if (isTomoriPreset(parsed)) {
        project = projectFromPreset(parsed);
      } else {
        throw new Error("This is not a Tomori preset or Persona Creator backup.");
      }
      await importProject(project, versions);
      state.projects.unshift(project);
      state.project = project;
      state.versions = versions;
      localStorage.setItem("tomori-persona-creator.current", project.id);
      renderApp();
      toast("Persona imported locally");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Import failed.", "error");
    }
  }
});

app.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLElement>("button, [data-open-export], label.import-button");
  if (!button) return;
  const palette = button.dataset.palette as Palette | undefined;
  if (palette) {
    state.palette = palette;
    localStorage.setItem("tomori-persona-creator.palette", palette);
    renderApp();
  }
  if (button.id === "new-project" || button.dataset.projectAction === "new") await addProject();
  if (button.id === "duplicate-project" || button.dataset.projectAction === "duplicate") await duplicateCurrent();
  if (button.id === "theme-button") {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("tomori-persona-creator.theme.v2", state.theme);
    renderApp();
  }
  if (button.id === "workspace-link") {
    await workspaceSync.connect(`persona-bench-${safeFileName(state.project.name)}.json`);
  }
  if (button.id === "workspace-reconnect") await workspaceSync.reconnect();
  if (button.id === "workspace-check") {
    if (workspaceSync.state.status === "conflict") updateWorkspaceSyncUi();
    else await workspaceSync.checkNow();
  }
  if (button.id === "workspace-disconnect") {
    await workspaceSync.disconnect();
    toast("Workspace file disconnected; browser storage remains intact");
  }
  if (button.id === "sync-use-agent") await workspaceSync.useAgentVersion();
  if (button.id === "sync-keep-browser") await workspaceSync.keepBrowserVersion();
  const targetMode = button.dataset.target as PersonaProject["target"] | undefined;
  if (targetMode) {
    state.project.target = targetMode;
    markDirty();
    renderApp();
    toast(targetMode === "llm" ? "General LLM mode enabled" : "TomoriBot mode enabled");
  }
  if (button.id === "avatar-choose") document.querySelector<HTMLInputElement>("#avatar-file")?.click();
  if (button.id === "remove-avatar") {
    state.project.avatar = { sourceDataUrl: null, fileName: null, zoom: 1, x: 0, y: 0 };
    markDirty();
    renderApp();
    document.getElementById("appearance")?.scrollIntoView();
  }
  const exampleKey = button.dataset.example as SectionKey | undefined;
  if (exampleKey) {
    const descriptor = [...sectionGroups.flatMap((group) => group.sections), ...voiceSections].find((item) => item.key === exampleKey);
    const input = document.querySelector<HTMLTextAreaElement>(`[data-section="${exampleKey}"]`);
    if (descriptor && input && !input.value.trim()) {
      input.value = descriptor.example;
      setValue(input);
    } else if (input?.value.trim()) toast("Clear the field before inserting the example.", "error");
  }
  if (button.id === "add-custom") {
    state.project.customAttributes.push({ id: id(), title: "", value: "", isPublic: false });
    markDirty();
    renderApp();
    document.getElementById("custom-attributes")?.scrollIntoView();
    document.querySelector<HTMLInputElement>("[data-custom]:last-child [data-custom-field=title]")?.focus();
  }
  if (button.id === "add-mode") {
    state.project.behaviorModes ??= [];
    state.project.behaviorModes.push({ id: id(), name: "", condition: "", behavior: "" });
    markDirty();
    renderApp();
    document.getElementById("behavior-modes")?.scrollIntoView();
    document.querySelector<HTMLInputElement>("[data-mode]:last-child [data-mode-field=name]")?.focus();
  }
  const removeMode = button.dataset.removeMode;
  if (removeMode) {
    state.project.behaviorModes = (state.project.behaviorModes ?? []).filter((item) => item.id !== removeMode);
    markDirty();
    renderApp();
    document.getElementById("behavior-modes")?.scrollIntoView();
  }
  const removeCustom = button.dataset.removeCustom;
  if (removeCustom) {
    state.project.customAttributes = state.project.customAttributes.filter((item) => item.id !== removeCustom);
    markDirty();
    renderApp();
    document.getElementById("custom-attributes")?.scrollIntoView();
  }
  if (button.id === "add-dialogue") {
    state.project.sampleDialogues.push({ id: id(), input: "", output: "" });
    markDirty();
    renderApp();
    document.getElementById("voice")?.scrollIntoView();
    document.querySelector<HTMLTextAreaElement>("[data-dialogue]:last-child [data-dialogue-field=input]")?.focus();
  }
  const removeDialogueId = button.dataset.removeDialogue;
  if (removeDialogueId) {
    state.project.sampleDialogues = state.project.sampleDialogues.filter((item) => item.id !== removeDialogueId);
    if (!state.project.sampleDialogues.length) state.project.sampleDialogues.push({ id: id(), input: "", output: "" });
    markDirty();
    renderApp();
    document.getElementById("voice")?.scrollIntoView();
  }
  const duplicateDialogueId = button.dataset.duplicateDialogue;
  if (duplicateDialogueId) {
    const index = state.project.sampleDialogues.findIndex((item) => item.id === duplicateDialogueId);
    const source = state.project.sampleDialogues[index];
    if (source) state.project.sampleDialogues.splice(index + 1, 0, { ...source, id: id() });
    markDirty();
    renderApp();
    document.getElementById("voice")?.scrollIntoView();
  }
  if (button.id === "versions-button" || button.dataset.projectAction === "versions") {
    state.versions = await listVersions(state.project.id);
    renderVersions();
    document.querySelector<HTMLDialogElement>("#versions-dialog")?.showModal();
  }
  if (button.id === "export-button" || button.matches("[data-open-export]")) {
    updateDerivedUi();
    enhanceIcons();
    document.querySelector<HTMLDialogElement>("#export-dialog")?.showModal();
  }
  const closeId = button.dataset.closeDialog;
  if (closeId) document.querySelector<HTMLDialogElement>(`#${closeId}`)?.close();
  const restoreId = button.dataset.restoreVersion;
  if (restoreId) {
    const version = state.versions.find((item) => item.id === restoreId);
    if (version) {
      const restored = structuredClone(version.project);
      restored.behaviorModes ??= [];
      restored.id = state.project.id;
      restored.updatedAt = new Date().toISOString();
      restored.revision = state.project.revision + 1;
      state.project = restored;
      await saveProject(restored);
      workspaceSync.syncLocalChanges();
      const index = state.projects.findIndex((item) => item.id === restored.id);
      if (index >= 0) state.projects[index] = structuredClone(restored);
      document.querySelector<HTMLDialogElement>("#versions-dialog")?.close();
      renderApp();
      toast(`Restored “${version.label}” as the current draft`);
    }
  }
  const deleteVersionId = button.dataset.deleteVersion;
  if (deleteVersionId) {
    await removeVersion(deleteVersionId);
    state.versions = state.versions.filter((item) => item.id !== deleteVersionId);
    workspaceSync.syncLocalChanges();
    renderVersions();
    toast("Version deleted");
  }
  if (button.id === "delete-project") {
    if (state.projects.length <= 1) return toast("Create another persona before deleting this one.", "error");
    if (!confirm(`Delete “${state.project.name}” and all of its local versions?`)) return;
    await workspaceSync.disconnect();
    await removeProject(state.project.id);
    state.projects = state.projects.filter((item) => item.id !== state.project.id);
    document.querySelector<HTMLDialogElement>("#versions-dialog")?.close();
    await switchProject(state.projects[0]?.id ?? "");
    toast("Local persona deleted");
  }
  const exportKind = button.dataset.export;
  if (exportKind) {
    const filename = safeFileName(state.project.name);
    try {
      if (exportKind === "json") downloadJson(`tomori-preset-${filename}.json`, buildTomoriPreset(state.project));
      if (exportKind === "llm-json") downloadJson(`llm-persona-${filename}.json`, buildLlmPersona(state.project));
      if (exportKind === "backup") downloadJson(`persona-builder-${filename}.json`, buildBackup(state.project, await listVersions(state.project.id)));
      if (exportKind === "png") downloadBlob(`tomori-preset-${filename}.png`, await buildTomoriPng(state.project));
      toast(`${exportKind === "backup" ? "Builder backup" : exportKind === "llm-json" ? "LLM persona JSON" : `Tomori ${exportKind.toUpperCase()}`} exported`);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Export failed.", "error");
    }
  }
});

app.addEventListener("submit", async (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "version-form") return;
  event.preventDefault();
  const data = new FormData(event.target);
  const label = String(data.get("label") || "").trim();
  if (!label) return;
  const version: PersonaVersion = { id: id(), projectId: state.project.id, label, createdAt: new Date().toISOString(), project: structuredClone(state.project) };
  await saveVersion(version);
  state.versions.unshift(version);
  workspaceSync.syncLocalChanges();
  event.target.reset();
  renderVersions();
  toast("Version saved");
});

async function boot(): Promise<void> {
  document.body.dataset.theme = state.theme;
  const projects = await listProjects();
  for (const project of projects) {
    project.target ??= "tomori";
    project.behaviorModes ??= [];
  }
  if (!projects.length) {
    const first = createBlankProject();
    await saveProject(first);
    projects.push(first);
  }
  state.projects = projects;
  const selected = localStorage.getItem("tomori-persona-creator.current");
  state.project = structuredClone(projects.find((project) => project.id === selected) ?? projects[0]!);
  state.versions = await listVersions(state.project.id);
  localStorage.setItem("tomori-persona-creator.current", state.project.id);
  renderApp();
  await workspaceSync.activate(state.project.id);
}

boot().catch((error) => {
  app.innerHTML = `<main class="fatal-error"><img src="${logoUrl}" alt="TomoriBot"><h1>The local workshop could not start.</h1><p>${escapeHtml(error instanceof Error ? error.message : error)}</p><button onclick="location.reload()">Try again</button></main>`;
});
