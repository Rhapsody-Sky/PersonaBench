export type SectionKey =
  | "generalDescription"
  | "personality"
  | "history"
  | "currentSituation"
  | "values"
  | "likes"
  | "dislikes"
  | "hopes"
  | "fears"
  | "motivations"
  | "lifeGoals"
  | "strengths"
  | "weaknesses"
  | "skills"
  | "relationships"
  | "quirks"
  | "secrets"
  | "boundaries"
  | "continuity"
  | "speechStyle"
  | "vocabulary"
  | "mannerisms"
  | "neverSays";

export interface CharacterSection {
  value: string;
  isPublic: boolean;
}

export interface SampleDialogue {
  id: string;
  input: string;
  output: string;
}

export interface CustomAttribute {
  id: string;
  title: string;
  value: string;
  isPublic: boolean;
}

export interface AvatarState {
  sourceDataUrl: string | null;
  fileName: string | null;
  zoom: number;
  x: number;
  y: number;
}

export interface PersonaProject {
  id: string;
  name: string;
  concept: string;
  archetype: string;
  triggerWords: string[];
  sections: Record<SectionKey, CharacterSection>;
  customAttributes: CustomAttribute[];
  sampleDialogues: SampleDialogue[];
  visualPrompt: string;
  appearanceTags: string[];
  avatar: AvatarState;
  createdAt: string;
  updatedAt: string;
  revision: number;
}

export interface PersonaVersion {
  id: string;
  projectId: string;
  label: string;
  createdAt: string;
  project: PersonaProject;
}

export interface BuilderBackup {
  format: "tomori-persona-builder";
  version: 1;
  exportedAt: string;
  project: PersonaProject;
  versions: PersonaVersion[];
}

export interface TomoriPresetData {
  tomori_nickname: string;
  attribute_list: string[];
  attribute_public_flags: boolean[];
  sample_dialogues_in: string[];
  sample_dialogues_out: string[];
  trigger_words: string[];
  persona_prompt: string | null;
  physical_appearance_tags: string[];
}

export interface TomoriPresetExport {
  version: "1.0.0";
  type: "preset";
  exported_at: string;
  data: TomoriPresetData;
}
