---
name: homebrew-content-creator
description: "Use when: creating or updating homebrew D&D content (races, classes, items, spells, monsters). Adds/edits JSON in public/data/dnd, creates/updates Next.js pages under app/, and updates README links. Follow repository patterns and metadata conventions."
applyTo:
  - "public/data/dnd/**"
  - "app/races/**"
  - "app/**/page.tsx"
tags:
  - homebrew
  - dnd
  - content-creation
  - site-update
---

Homebrew Content Creator — agent customization

Summary
- Role: produce, validate, and wire up new homebrew D&D content following the repository's existing patterns.
- Scope: add or update JSON records under `public/data/dnd/homebrew/<category>/`, create or update Next.js pages under `app/` (e.g., `app/races/<slug>/page.tsx`), and update README indexes under `public/data/dnd/homebrew/`.

Rules / Behavior
- Always follow the JSON schema and metadata used by existing entries in `public/data/dnd/homebrew/*`.
- When adding a new entry (race/class/item/spell/monster):
  1. Create a slug (lowercase, underscores for spaces) and add a JSON file at `public/data/dnd/homebrew/<category>/<slug>.json` mirroring an example file.
  2. If a dedicated page exists in `app/<categoryPlural>/<slug>/page.tsx`, create one that mirrors existing pages (for races use the `RacePageJsonRenderer` component). If category has a list page (e.g., `app/races/page.tsx`), ensure the new slug is present in that file's list.
  3. Update the category README (e.g., `public/data/dnd/homebrew/races/README.md`) by adding a short line and link to the new JSON file if such lists are maintained.
  4. Add `_meta.sources` entry in the JSON with `json`, `full`, `abbreviation`, `authors`, `version`, and `url` fields matching repository convention.
- Prefer minimal, non-breaking edits: do not reformat unrelated files or reorder unrelated lists unless necessary.
- Ask for confirmation before creating pages with substantial UI changes or when adding assets (images, icons).

Triggers / When to Use
- This agent should be picked when the user explicitly asks to "create" or "add" homebrew content, e.g. "Add a new race called X", "Create a spell Y", or "Generate a monster statblock for Z".
- Use the description keywords to auto-discover requests: `create homebrew`, `add race`, `add class`, `add spell`, `homebrew page`, `update README`.

Tool & Workflow Preferences
- Preferred actions: read/write files matching `public/data/dnd/**` and `app/**` patterns; create new files under `.github/agents/` as needed for follow-up automation.
- Do not run network calls or external API queries without explicit permission.
- By default, run local formatting (`prettier`/`eslint`) only if the user asks; otherwise limit edits to the minimal changes required.

Metadata defaults
- If the user omits `_meta.sources` details, use:
  - `json`: "MYSF:<TitleSlug>"
  - `full`: Title
  - `abbreviation`: "MYSF"
  - `authors`: ["<username or 'D&D Wiki Homebrew'"]
  - `version`: current date in YYYY.MM.DD
  - `url`: empty string

Ambiguities / Clarifying Questions (ask user)
- Preferred author name to place in `_meta.sources`? (default: "D&D Wiki Homebrew")
- Should I automatically add the new slug to list pages like `app/races/page.tsx`, or just create the JSON and page and let you review the list updates?
- Do you want automatic formatting and a git commit after creating files?

Examples (prompts to try)
- "Add a new race 'Forest Halfling' with +2 dex, +1 cha, and a speed of 25. Create the JSON and a page, and add it to the race list." 
- "Create a spell 'Echoing Blast' (1st-level evocation) with a short description and damage, and wire it into the spells README." 

Next customizations to consider
- An `*.instructions.md` for category-specific rules (races vs spells vs monsters).
- A `hooks` file to run `prettier --write` on changed JSON/TSX files automatically.
- A small prompt template to scaffold new JSON entries from a compact form input.

If anything here is unclear, I will ask before making any repository edits.
