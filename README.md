# PersonaBench

PersonaBench is a standalone, local-first character workshop for designing TomoriBot personas. It guides creators from a compact character concept through attributes, voice, sample dialogue, appearance, and an import-ready preset.

## Features

- Guided one-page character design workflow
- Browser-local projects stored in IndexedDB
- Project duplication and named version checkpoints
- Avatar upload with framing controls
- Character attributes with Tomori visibility flags
- Repeatable sample dialogues
- Five Companion color palettes plus light and dark themes
- Native Tomori PNG and JSON exports
- Complete PersonaBench backup export with project history

PersonaBench has no backend. Drafts, avatars, and versions stay in the current browser until they are exported. Clearing the browser's site data also removes local projects, so create a **Builder backup** for durable storage.

## Local development

Install [Bun](https://bun.sh/), then run:

```powershell
bun install
bun run dev
```

Open the local address printed by Vite. PersonaBench does not require a TomoriBot server, Discord account, or database.

For a production build:

```powershell
bun run build
```

## Exports

### Tomori PNG

Creates a shareable avatar PNG with a native `TomoriPreset` JSON payload embedded in its `TomoriPreset` metadata field.

### Tomori JSON

Exports the native Tomori preset without avatar image data.

### Builder backup

Preserves the complete editable project, avatar, tutorial fields, and named version history. Builder backups can be imported into PersonaBench later.

TomoriBot can import the PNG or JSON through `/persona import` or the dashboard persona importer.

## License

PersonaBench is available under the [GNU General Public License v3.0](LICENSE).

