---
name: persona-bench-collaborator
description: Create, inspect, revise, validate, and explain Persona Bench personas and JSON files, including layered character design, distinctive voices, and high-quality sample dialogue. Use when an LLM or agent helps a human design a multidimensional character, develops or audits speech style, writes dialogue that must not sound generic or AI-generated, edits a Persona Bench Builder backup, explains persona sections or behavior modes, prepares TomoriBot or general-LLM exports, or guides a user through exporting and reimporting a Persona Bench project.
---

# Persona Bench Collaborator

Help a human turn a character idea into a coherent Persona Bench project. Preserve the application's JSON schema and return an importable Builder backup whenever the human wants to continue editing in Persona Bench.

## Choose the correct artifact

Identify the JSON by its top-level fields before editing it.

- `format: "tomori-persona-builder"`: editable Builder backup. Use this for collaboration and round trips.
- `format: "persona-bench-llm-persona"`: general-LLM runtime export. Use this to configure an LLM; do not promise that Persona Bench can reimport it.
- `type: "preset"` with `version: "1.0.0"`: TomoriBot preset. Persona Bench can import it, but Builder-only context and version history may be absent.

When the user wants to edit a persona with an agent and bring it back into the workbench, ask for a **Builder backup**, not an LLM Persona JSON.

## Collaboration workflow

1. Ask the human to open Persona Bench and select the intended persona.
2. Ask them to choose **Export → Builder backup** and provide the downloaded JSON.
3. Parse the JSON and verify `format`, `version`, `project`, and `versions` before changing it.
4. Discuss unclear creative choices instead of silently replacing intentional contradictions.
5. Edit only the requested character content. Preserve unknown fields for forward compatibility.
6. Keep the result valid JSON: no Markdown fences, JavaScript comments, trailing commas, or `undefined` values inside the file.
7. Validate required shapes and return a `.json` file.
8. Tell the human to choose **Export → Import project** in Persona Bench and select the edited file. Persona Bench imports it as a separate local project.

Persona Bench stores projects locally in the browser. Recommend exporting a fresh Builder backup after meaningful work.

## Live linked-file workflow

When the human uses **Linked workspace file**, Persona Bench and a local agent share one Builder-backup JSON file.

1. Ask the human to select the intended persona and click **Link file** in Persona Bench.
2. Ask for the exact linked file path or locate the `.json` file the human has placed in the agent's workspace.
3. Read the complete file immediately before editing it. Treat it as the current source of truth.
4. Prepare a complete, strictly valid Builder backup and write the whole JSON file. Never leave comments, Markdown fences, or a partial JSON document in place.
5. Preserve the project `id`, unknown fields, avatar data, and unrelated content. Update `updatedAt` and increment `revision` once.
6. Tell the human that the page normally detects the edit within a few seconds. Do not repeatedly touch or rewrite an unchanged file.

Persona Bench continues saving to IndexedDB and the linked file. If the human and agent edit from the same base at the same time, Persona Bench pauses synchronization and asks which complete version to keep. It records the other side as a named local version during conflict resolution. Do not attempt to bypass or pre-resolve that UI by overwriting the file again.

## Builder backup schema

Use this shape:

```json
{
  "format": "tomori-persona-builder",
  "version": 1,
  "exportedAt": "2026-08-17T12:00:00.000Z",
  "project": {},
  "versions": []
}
```

### Project fields

| Field | Type | Purpose |
| --- | --- | --- |
| `id` | string | Stable local project identifier. Preserve it while editing the backup. |
| `target` | `"tomori"` or `"llm"` | Selects TomoriBot-specific or general-LLM UI and export behavior. |
| `name` | string | Character name and primary identity label. |
| `concept` | string | One-sentence hook that compresses the character's central idea. |
| `archetype` | string | Starting role or narrative pattern; do not reduce the character to a stereotype. |
| `triggerWords` | string[] | TomoriBot activation names and aliases. Usually empty for `target: "llm"`. |
| `sections` | object | Standard character sections described below. |
| `customAttributes` | array | Additional canon not covered by a standard section. |
| `behaviorModes` | array | Conditional changes activated by events or context. |
| `sampleDialogues` | array | User/character exchanges demonstrating voice in action. |
| `visualPrompt` | string | Stable visual identity or image-generation description. |
| `appearanceTags` | string[] | TomoriBot image-generation tags; usually empty for general LLM projects. |
| `avatar` | object | Local image data and crop settings. Preserve it unless asked to replace it. |
| `createdAt`, `updatedAt` | ISO-8601 strings | Creation and most recent edit timestamps. Update `updatedAt` after editing. |
| `revision` | integer | Project revision counter. Increment once for a completed agent edit. |

### Standard section value

Every key in `sections` contains:

```json
{
  "value": "Character information",
  "isPublic": false
}
```

`isPublic` is meaningful to TomoriBot: it controls whether other active personas may see the attribute. Preserve it. For general LLM projects, leave existing values unchanged unless the user gives a policy.

### Section meanings

| Key | What to capture |
| --- | --- |
| `generalDescription` | Identity anchor: who the character is in a few clear sentences. |
| `personality` | Temperament, decision patterns, social behavior, and internal contradictions. |
| `history` | Past events that causally shaped present beliefs and behavior. |
| `currentSituation` | Present location, role, pressures, obligations, and unresolved immediate problem. |
| `values` | Principles from several life domains used to resolve moral choices and trade-offs. |
| `likes` | Varied sources of comfort, energy, attention, delight, or fascination. |
| `dislikes` | Varied sources of friction, irritation, aversion, threat, or exhaustion. |
| `hopes` | Desired futures across different timescales and life domains that create direction and vulnerability. |
| `fears` | Concrete, relational, personal, moral, or existential outcomes that drive avoidance, defensiveness, or overcompensation. |
| `motivations` | Reasons to act now; the engine behind proactive choices. |
| `lifeGoals` | Long-term outcomes that define a meaningful life for the character. |
| `strengths` | Dependable capabilities and constructive traits without implying infallibility. |
| `weaknesses` | Flaws and blind spots capable of causing mistakes and consequences. |
| `skills` | Learned practical, social, intellectual, creative, or unusual competencies. |
| `relationships` | Important people plus history, emotional stakes, power, and unresolved tension. |
| `quirks` | Recurring habits and recognizable texture; keep them sparse enough to feel natural. |
| `secrets` | True but normally undisclosed facts whose revelation depends on trust and pressure. |
| `boundaries` | Hard limits that cause refusal, redirection, objection, or withdrawal. |
| `continuity` | Canonical facts that must remain consistent across interactions. |
| `speechStyle` | Sentence length, pacing, directness, rhetorical structure, and expressive range. |
| `vocabulary` | Register, recurring metaphors, preferred terms, nicknames, and avoided language. |
| `mannerisms` | Emotional subtext conveyed through tone, timing, emphasis, or verbal behavior. |
| `neverSays` | Negative voice constraints: phrases, attitudes, or registers that break character. |

Write information in the most specific applicable section. Avoid repeating the same sentence across multiple sections. Preserve useful tension—for example, a stated value may conflict with a fear or weakness.

## Layered character construction

When creating, revising, or auditing `values`, `likes`, `dislikes`, `hopes`, `fears`, or the character's overall dimensionality, read [references/layered-character-design.md](references/layered-character-design.md) completely and follow its construction workflow and depth audit.

Require at least three genuinely distinct thematic domains in each of those five fields and aim for five for a major character. Count independent concerns, not synonymous phrasings or consequences of the same premise. Treat the archetype as an organizing lens rather than the explanation for the entire sheet. If a single obsession is intentionally the whole design, document that choice and its costs explicitly; otherwise revise a sheet whose facts are almost all predictable from one base archetype.

## Custom attributes

Use custom attributes for canon that does not fit a standard key:

```json
{
  "id": "a-unique-id",
  "title": "Magical limitation",
  "value": "She can read memories only while holding an object the owner cherished.",
  "isPublic": false
}
```

Give each item a unique string `id`, a precise title, and one coherent domain of information. Do not use custom attributes as a dumping ground for duplicated sections.

## Behavior modes and triggers

Use behavior modes for temporary or conditional shifts, not permanent personality facts:

```json
{
  "id": "a-unique-id",
  "name": "Money fixation",
  "condition": "When NAME sees physical money",
  "behavior": "They lock onto it and will do almost anything to earn it."
}
```

- Make `condition` observable and testable from the scene or conversation.
- Describe the behavioral shift in concrete priorities, impulses, decisions, or speech changes.
- State an ending condition in `behavior` when persistence would otherwise be ambiguous.
- Keep the core identity, boundaries, continuity, and established facts intact while a mode is active.
- Avoid modes that are always true; move permanent behavior into `personality`, `motivations`, or another standard section.
- Give each mode a unique string `id`. `name` may be empty, but a descriptive name is preferable.

## Sample dialogues

When creating, revising, or judging dialogue or the `speechStyle`, `vocabulary`, `mannerisms`, or `neverSays` sections, read [references/dialogue-and-voice.md](references/dialogue-and-voice.md) completely and follow its workflow and quality gate.

Write sample dialogues only after reading the complete character sheet. Treat them as the final synthesis and stress test of the persona, not as early brainstorming or isolated clever lines.

Use paired examples. For a proud logistics-minded character who converts fear into planning:

```json
{
  "id": "a-unique-id",
  "input": "Are you worried she'll leave?",
  "output": "Her train is at six. I moved the meeting to five-thirty."
}
```

Treat each pair as executable evidence of how this particular character perceives, chooses, evades, attacks, comforts, jokes, or changes register. Select conversation fragments that are plausible and especially revealing for this character because of their biography, relationships, work, values, flaws, pressures, and behavior modes. Derive the line from that context before styling the prose. Vary counterpart, stakes, emotional temperature, active behavior mode, conversational function, and response length. Let concise reactions remain concise and reserve longer turns for situations and voice patterns that genuinely earn them.

Keep reusable voice mechanics in `speechStyle`, `vocabulary`, `mannerisms`, and `neverSays`. Use sample dialogues to demonstrate those rules in action, not to replace weak rules with more examples or more words.

Before accepting a set, use the reference's positive scorecard and revision loop. Require clear character causality, recognition, behavioral teaching, relationship-aware variation, speakability, transfer to unseen prompts, and a clean final handoff.

Preserve intentional dialogue order. Put narrow, triggered, relationship-specific, or emotionally intense examples earlier and the most broadly applicable baseline example last. Assume a runtime may place the real user's first message immediately after that last character output.

## Avatar structure

Preserve this object during text-only edits:

```json
{
  "sourceDataUrl": null,
  "fileName": null,
  "zoom": 1,
  "x": 0,
  "y": 0
}
```

`sourceDataUrl` may contain a large base64 data URL. Never truncate, rewrap, or summarize it. Crop controls use `zoom` from 1 to 3 and `x`/`y` from -100 to 100.

## Version history

`versions` contains named snapshots:

```json
{
  "id": "a-unique-version-id",
  "projectId": "matching-project-id",
  "label": "Before agent revision",
  "createdAt": "2026-08-17T12:00:00.000Z",
  "project": {}
}
```

Preserve existing versions by default. When intentionally adding a checkpoint, deep-copy the pre-edit project, give the version and snapshot consistent project IDs, and use a new unique version ID.

## Runtime exports

### General LLM JSON

`format: "persona-bench-llm-persona"` is optimized for inference rather than editing. It contains:

- `_usage`: placement guidance for system or custom instructions.
- `persona._instructions`: global interpretation, priority, disclosure, and consistency rules.
- `identity`: name, concept, and archetype.
- `character_details`: populated standard sections with `_label`, `_instruction`, and `value`.
- `behavior_modes`: condition/effect rules plus activation and conflict guidance.
- `custom_attributes`: additional canon.
- `sample_dialogues`: ordered voice-and-behavior demonstrations for likely character-specific interactions; the final pair should hand off cleanly to a fresh conversation.
- `visual_reference`: optional visual description.

Preserve underscore-prefixed instruction fields when preparing an LLM configuration. They are valid JSON data, not comments, and explain how adjacent values should influence behavior.

### TomoriBot preset

The TomoriBot preset contains `data.tomori_nickname`, parallel attribute and visibility arrays, paired dialogue arrays, `trigger_words`, `persona_prompt`, and `physical_appearance_tags`. Keep parallel arrays aligned by index. Prefer editing a Builder backup when the user expects a lossless round trip.

## Validation checklist

Before returning an edited Builder backup, verify:

- Top-level `format` is `tomori-persona-builder` and `version` is `1`.
- `project.target` is exactly `tomori` or `llm`.
- Every standard section key exists and has string `value` plus boolean `isPublic`.
- Custom attributes, behavior modes, dialogues, and versions are arrays.
- IDs are non-empty and unique within their collection.
- Every behavior mode has `condition` and `behavior` strings.
- Every dialogue has `input` and `output` strings.
- `values`, `likes`, `dislikes`, `hopes`, and `fears` each cover at least three distinct thematic domains, or the sheet explicitly documents an intentional single-minded design.
- The overall sheet contains important axes that are not predictable from one base archetype.
- Sample outputs vary in length according to situation and conversational function; longer turns are exceptional and purposeful.
- Voice fields state reusable rules, while sample dialogues demonstrate those rules without becoming explanatory walls of text.
- Timestamps are valid ISO-8601 strings and `revision` is a positive integer.
- Avatar base64 data, unknown fields, and unrelated user content remain intact.
- The result parses as strict JSON.
