# Persona Bench

Persona Bench is a private, local-first workbench for designing reusable characters and personas for TomoriBot or any other LLM. It turns character ideas into structured persona data that humans, language models, and coding agents can understand and continue editing.

[Open Persona Bench](https://personabench.rhapsody.me/)

## What you can build

- Identity, appearance, personality, background, relationships, voice, knowledge, and boundaries
- Conditional behavior modes such as “When NAME sees physical money…”
- Example conversations that demonstrate tone and reactions
- Custom attributes for project-specific details
- Avatar images and visual-generation prompts
- TomoriBot-specific trigger words when TomoriBot is selected as the target

Persona Bench offers two output targets:

- **Any LLM** keeps the character platform-neutral and exports explanatory `_instruction` fields alongside the persona data. These act as compact prompts that tell an LLM how to interpret and apply each section.
- **TomoriBot** enables Tomori-specific fields and export formats, including trigger words and character-card PNG export.

## Local-first workflow

Persona data remains in the browser unless you explicitly export it or link a workspace file. Persona Bench uses IndexedDB for automatic local persistence and keeps recoverable local versions while you edit.

A typical workflow is:

1. Choose TomoriBot or a general LLM as the target.
2. Build the persona section by section.
3. Add behavior modes and example dialogue to make the character more consistent.
4. Preview and validate the result.
5. Export the persona or link it to a workspace file for ongoing collaboration.

## Linked workspace file

The linked-file mode lets Persona Bench and a local agent work on the same JSON file:

- Browser edits are saved to IndexedDB and the linked file.
- External file changes are detected and can be reloaded into the workbench.
- Conflicting browser and file changes are surfaced instead of silently overwriting work.
- Local version history provides an additional recovery layer.

This feature requires a browser with the File System Access API, such as a current Chromium-based browser, and a secure context such as HTTPS or localhost. The browser may ask you to grant file access again after a restart.

## Agent skill

The repository includes an agent-readable skill at:

`Skills/persona-bench-collaborator/SKILL.md`

It explains the project JSON structure, the purpose of every section, safe editing rules, behavior modes, and the export/import workflow. Give an LLM or local coding agent access to that skill together with the linked persona JSON so it can collaborate without guessing the schema.

The production build automatically copies the skill into `dist/Skills/persona-bench-collaborator/` and creates `dist/persona-bench-collaborator-skill.zip`. The website download uses the ZIP so `SKILL.md`, agent metadata, and all referenced guidance remain together.

## Export formats

- **General LLM JSON** — portable persona data with detailed `_instruction` guidance for each section
- **TomoriBot JSON** — Tomori-compatible structured character data
- **TomoriBot PNG** — a character card containing the Tomori persona payload
- **Builder backup JSON** — a lossless Persona Bench project file intended for later reimport and continued editing

Use the Builder backup when you want to preserve every workbench field. Runtime-oriented exports may intentionally omit editor-only state.

## Development

Requirements: [Bun](https://bun.sh/) or a compatible Node.js package manager.

```bash
bun install
bun run dev
```

Create a production build with:

```bash
bun run build
```

The deployable static site is written to `dist/`. Upload the contents of that directory to the web root behind Nginx or another static web server. Persona Bench does not require PM2 or a backend service for normal use.

For browser routing, configure the server to fall back to `index.html`. Serve the site over HTTPS so secure browser APIs such as `crypto.randomUUID()` and linked-file access are available.

## Privacy

Persona Bench has no application backend. Browser storage, imported files, linked files, and downloads remain under the user's control. Hosting providers can still receive ordinary static-site access logs.

## License

Released under the [GNU General Public License v3.0](LICENSE).
