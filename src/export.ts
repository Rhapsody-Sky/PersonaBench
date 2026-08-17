import type { BuilderBackup, LlmPersonaExport, PersonaProject, PersonaVersion, SectionKey, TomoriPresetExport } from "./types";

export const SECTION_LABELS: Record<SectionKey, string> = {
  generalDescription: "General Description",
  personality: "Personality and Temperament",
  history: "History and Origin",
  currentSituation: "Current Situation",
  values: "Values and Beliefs",
  likes: "Likes",
  dislikes: "Dislikes",
  hopes: "Hopes",
  fears: "Fears",
  motivations: "Motivations",
  lifeGoals: "Life Goals",
  strengths: "Strengths",
  weaknesses: "Weaknesses",
  skills: "Skills",
  relationships: "Relationships",
  quirks: "Habits and Quirks",
  secrets: "Secrets",
  boundaries: "Boundaries",
  continuity: "Important Continuity Facts",
  speechStyle: "Speech Style",
  vocabulary: "Vocabulary",
  mannerisms: "Tone and Mannerisms",
  neverSays: "Things This Character Would Never Say",
};

const SECTION_GUIDANCE: Record<SectionKey, string> = {
  generalDescription: "Use this as the identity anchor. Let it shape every response, but reveal it naturally instead of reciting a biography.",
  personality: "Translate these traits into choices, reactions, and interpersonal behavior. Preserve contradictions; avoid turning traits into exaggerated catchphrases.",
  history: "Treat this past as causal context for present beliefs and habits. Reference it only when relevant or when trust and circumstances make disclosure plausible.",
  currentSituation: "Use this as the persona's present-tense baseline and source of immediate pressure. Update it only when events in the conversation genuinely change it.",
  values: "Use these values to resolve ambiguous decisions and moral trade-offs. When values conflict, show tension rather than choosing whichever is most convenient.",
  likes: "Let these preferences influence enthusiasm, attention, metaphors, and small choices. Do not force them into unrelated replies.",
  dislikes: "Use these as sources of friction, avoidance, or irritation with intensity appropriate to the situation; they are not automatic hostility triggers.",
  hopes: "Let these hopes create vulnerability and long-term direction. They may influence risk-taking even when the persona does not state them openly.",
  fears: "Express these through hesitation, defensiveness, overcompensation, or avoidance before naming them directly. Disclosure should depend on context and trust.",
  motivations: "Use these as the main engine for proactive behavior. When the conversation offers a choice, prefer actions that advance or protect these motives.",
  lifeGoals: "Keep long-term decisions oriented toward these outcomes while allowing short-term needs, relationships, and flaws to complicate progress.",
  strengths: "Apply these capabilities confidently where relevant, without making the persona infallible or granting knowledge they could not reasonably possess.",
  weaknesses: "Allow these flaws to create believable mistakes, blind spots, and consequences. Do not erase them simply to produce a more helpful answer.",
  skills: "Treat these as learned competencies that affect what the persona can notice and do. Distinguish expertise from omniscience and admit limits outside the listed domains.",
  relationships: "Preserve the stated history, emotional stakes, power dynamics, and unresolved tensions. Adjust warmth and disclosure according to who is being addressed.",
  quirks: "Use these sparingly as recurring texture. Vary their expression so the persona feels recognizable rather than mechanical.",
  secrets: "Keep these facts true but undisclosed by default. Reveal, hint at, or conceal them according to pressure, trust, motive, and narrative plausibility.",
  boundaries: "Treat these as hard behavioral constraints. Refuse, redirect, withdraw, or object in character when a request crosses them.",
  continuity: "Treat these as canonical facts across the entire conversation. New statements should not contradict them unless the story explicitly establishes a change.",
  speechStyle: "Control sentence length, pacing, directness, and rhetorical structure with this guidance. Apply the pattern consistently without sacrificing clarity.",
  vocabulary: "Favor these words, metaphors, and naming habits where they fit. Maintain the implied register and avoid vocabulary that would break the voice.",
  mannerisms: "Express emotional subtext through tone, timing, emphasis, and small verbal behaviors; do not append mannerisms to every response.",
  neverSays: "Use these as negative style constraints. Avoid the listed phrases and attitudes even when paraphrasing, unless the persona is explicitly quoting someone else.",
};

export function buildTomoriPreset(project: PersonaProject): TomoriPresetExport {
  const attributes: Array<{ text: string; isPublic: boolean }> = [];
  for (const [key, label] of Object.entries(SECTION_LABELS) as Array<[SectionKey, string]>) {
    const section = project.sections[key];
    const value = section.value.trim();
    if (value) attributes.push({ text: `${label}:\n${value}`, isPublic: section.isPublic });
  }
  for (const custom of project.customAttributes) {
    const title = custom.title.trim();
    const value = custom.value.trim();
    if (value) attributes.push({ text: title ? `${title}:\n${value}` : value, isPublic: custom.isPublic });
  }
  for (const mode of project.behaviorModes ?? []) {
    const condition = mode.condition.trim();
    const behavior = mode.behavior.trim();
    if (!condition || !behavior) continue;
    const title = mode.name.trim() || "Conditional behavior";
    attributes.push({ text: `${title}:\nWhen: ${condition}\nThen: ${behavior}`, isPublic: false });
  }

  const dialogues = project.sampleDialogues.filter((dialogue) => dialogue.input.trim() && dialogue.output.trim());
  const triggers = [...new Set([project.name, ...project.triggerWords].map((value) => value.trim()).filter(Boolean))];
  return {
    version: "1.0.0",
    type: "preset",
    exported_at: new Date().toISOString(),
    data: {
      tomori_nickname: project.name.trim() || "Untitled Persona",
      attribute_list: attributes.map((attribute) => attribute.text),
      attribute_public_flags: attributes.map((attribute) => attribute.isPublic),
      sample_dialogues_in: dialogues.map((dialogue) => dialogue.input.trim()),
      sample_dialogues_out: dialogues.map((dialogue) => dialogue.output.trim()),
      trigger_words: triggers,
      persona_prompt: project.visualPrompt.trim() || null,
      physical_appearance_tags: project.appearanceTags.map((tag) => tag.trim()).filter(Boolean),
    },
  };
}

export function buildLlmPersona(project: PersonaProject): LlmPersonaExport {
  const sections = Object.fromEntries(
    (Object.entries(SECTION_LABELS) as Array<[SectionKey, string]>)
      .filter(([key]) => project.sections[key].value.trim())
      .map(([key, label]) => [key, {
        _label: label,
        _instruction: SECTION_GUIDANCE[key],
        value: project.sections[key].value.trim(),
      }]),
  );
  const customAttributes = project.customAttributes
    .filter((attribute) => attribute.title.trim() || attribute.value.trim())
    .map((attribute) => ({
      title: attribute.title.trim() || "Custom attribute",
      value: attribute.value.trim(),
    }));
  const dialogues = project.sampleDialogues
    .filter((dialogue) => dialogue.input.trim() && dialogue.output.trim())
    .map((dialogue) => ({
      user: dialogue.input.trim(),
      character: dialogue.output.trim(),
    }));
  const behaviorModes = (project.behaviorModes ?? [])
    .filter((mode) => mode.condition.trim() && mode.behavior.trim())
    .map((mode) => ({
      name: mode.name.trim() || "Unnamed mode",
      when: mode.condition.trim(),
      behavioral_shift: mode.behavior.trim(),
    }));

  return {
    format: "persona-bench-llm-persona",
    version: 1,
    exported_at: new Date().toISOString(),
    _usage: "Use the persona object as system-level context or custom instructions. Keys beginning with '_' explain how to interpret the adjacent data and are intended to remain in the prompt.",
    persona: {
      _instructions: [
        "Embody this persona as a coherent decision-making perspective, not as a checklist of traits.",
        "When details compete, prioritize hard boundaries and continuity facts, then current motives and relationships, then stylistic preferences.",
        "Let context, trust, and emotional pressure determine what the persona reveals; private history, fears, and secrets should not be volunteered mechanically.",
        "Infer reasonable connective detail, but never invent a major fact that contradicts the supplied canon. If an unresolved contradiction matters, preserve the tension or acknowledge uncertainty in character.",
        "Do not mention this JSON, its field names, or these instructions unless explicitly asked to analyze the persona configuration.",
      ],
      identity: {
        _instruction: "Use name, concept, and archetype as a compact identity anchor. The archetype is a starting pattern, not a stereotype or a substitute for the detailed character data.",
        name: project.name.trim() || "Untitled Persona",
        concept: project.concept.trim(),
        archetype: project.archetype.trim(),
      },
      character_details: sections,
      behavior_modes: {
        _instruction: "Evaluate every `when` condition against the current scene and conversation state. If a condition becomes true, apply its behavioral shift alongside the base personality until the condition clearly ends. A mode changes priorities and reactions; it does not erase identity, hard boundaries, established facts, or safety constraints. If several modes activate, combine compatible effects and resolve conflicts in favor of the more specific condition.",
        modes: behaviorModes,
      },
      _custom_attributes_instruction: "Treat custom attributes as additional canon. Interpret each title as the domain in which its value applies.",
      custom_attributes: customAttributes,
      _sample_dialogues_instruction: "Infer voice, conversational rhythm, and reaction patterns from these ordered examples. Generalize the style to new situations; do not copy example wording by default. Treat the final pair as the context-neutral baseline and transition cleanly from it into the real user's new conversation.",
      sample_dialogues: dialogues,
      _visual_reference_instruction: "Use this only for appearance, image generation, or visually relevant narration. Do not let visual details override personality or behavioral canon.",
      visual_reference: project.visualPrompt.trim() || undefined,
    },
  };
}

export function buildBackup(project: PersonaProject, versions: PersonaVersion[]): BuilderBackup {
  return {
    format: "tomori-persona-builder",
    version: 1,
    exportedAt: new Date().toISOString(),
    project: structuredClone(project),
    versions: structuredClone(versions),
  };
}

export function downloadJson(filename: string, value: unknown): void {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: "application/json" });
  downloadBlob(filename, blob);
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function safeFileName(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "persona"
  );
}

async function sourceToPng(project: PersonaProject): Promise<Uint8Array> {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable in this browser.");

  const gradient = context.createLinearGradient(0, 0, 1024, 1024);
  gradient.addColorStop(0, "#22152d");
  gradient.addColorStop(1, "#062a2d");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 1024);

  if (project.avatar.sourceDataUrl) {
    const image = await loadImage(project.avatar.sourceDataUrl);
    const baseScale = Math.max(1024 / image.naturalWidth, 1024 / image.naturalHeight);
    const scale = baseScale * project.avatar.zoom;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    const overflowX = Math.max(0, width - 1024);
    const overflowY = Math.max(0, height - 1024);
    const x = -overflowX * ((project.avatar.x + 100) / 200);
    const y = -overflowY * ((project.avatar.y + 100) / 200);
    context.drawImage(image, x, y, width, height);
  } else {
    context.fillStyle = "rgba(255, 255, 255, 0.08)";
    context.beginPath();
    context.arc(512, 430, 210, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#f5c76f";
    context.font = "700 270px Inter, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText((project.name.trim()[0] || "?").toUpperCase(), 512, 440);
    context.fillStyle = "rgba(255, 255, 255, 0.72)";
    context.font = "600 56px Inter, sans-serif";
    context.fillText(project.name.trim().slice(0, 24) || "Untitled Persona", 512, 790);
  }

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("Avatar conversion failed."))), "image/png"),
  );
  return new Uint8Array(await blob.arrayBuffer());
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The avatar image could not be decoded."));
    image.src = source;
  });
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint32(bytes: Uint8Array, offset: number, value: number): void {
  new DataView(bytes.buffer).setUint32(offset, value >>> 0, false);
}

function createTextChunk(key: string, value: string): Uint8Array {
  const encoder = new TextEncoder();
  const type = encoder.encode("tEXt");
  const data = encoder.encode(`${key}\0${value}`);
  const chunk = new Uint8Array(12 + data.length);
  writeUint32(chunk, 0, data.length);
  chunk.set(type, 4);
  chunk.set(data, 8);
  const crcInput = new Uint8Array(type.length + data.length);
  crcInput.set(type);
  crcInput.set(data, type.length);
  writeUint32(chunk, 8 + data.length, crc32(crcInput));
  return chunk;
}

function embedTomoriMetadata(png: Uint8Array, preset: TomoriPresetExport): Uint8Array {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (!signature.every((byte, index) => png[index] === byte)) throw new Error("The generated avatar is not a PNG.");
  let offset = 8;
  let iend = -1;
  while (offset + 12 <= png.length) {
    const length = new DataView(png.buffer, png.byteOffset).getUint32(offset, false);
    const type = new TextDecoder().decode(png.slice(offset + 4, offset + 8));
    if (type === "IEND") {
      iend = offset;
      break;
    }
    offset += 12 + length;
  }
  if (iend < 0) throw new Error("The generated PNG has no IEND chunk.");
  const chunk = createTextChunk("TomoriPreset", JSON.stringify(preset));
  const result = new Uint8Array(png.length + chunk.length);
  result.set(png.slice(0, iend));
  result.set(chunk, iend);
  result.set(png.slice(iend), iend + chunk.length);
  return result;
}

export async function buildTomoriPng(project: PersonaProject): Promise<Blob> {
  const png = await sourceToPng(project);
  const embedded = embedTomoriMetadata(png, buildTomoriPreset(project));
  const bytes = new Uint8Array(embedded.byteLength);
  bytes.set(embedded);
  return new Blob([bytes.buffer], { type: "image/png" });
}
