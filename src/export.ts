import type { BuilderBackup, PersonaProject, PersonaVersion, SectionKey, TomoriPresetExport } from "./types";

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
