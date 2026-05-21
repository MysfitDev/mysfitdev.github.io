---
name: author-dnd-homebrew
description: Create or update Dungeons & Dragons homebrew content in this repository, including JSON files under `public/data/dnd/homebrew`, corresponding Next.js routes under `app/`, and related README references. Use when Codex needs to add or revise races, classes, items, spells, monsters, or new homebrew category pages while following the repo's existing data, slug, metadata, and navigation patterns.
---

# Author D&D Homebrew

## Overview

Use this skill to add or revise repo-backed D&D homebrew content without drifting from the patterns already present in `public/data/dnd` and `app/`.

Read `references/repo-patterns.md` before editing an unfamiliar category. It captures the current file layout, slug conventions, JSON shape, page wiring, and README touch points in this repository.

## Workflow

1. Inspect the target category in `public/data/dnd/homebrew/` and copy the nearest existing pattern instead of inventing a new one.
2. Check for repo-local guidance such as `.github/agents/homebrew.agent.md` and align with it when present.
3. Add or update the content file using the repo's established slug style, metadata, and top-level structure.
4. Wire the content into the Next.js site when the category has pages already or when the new content introduces a page that users should be able to navigate to.
5. Update every impacted README so the data folders, category pages, and site navigation stay in sync.
6. Run targeted validation before finishing.

## Author Content Files

- Keep filenames slug-based and consistent with the surrounding folder. In this repo, homebrew race slugs use lowercase snake_case such as `pipe_fox`.
- Preserve the existing JSON style in the target folder. Reuse the closest sibling file as the template for keys, nesting, and metadata.
- Preserve `_meta.sources` and related metadata conventions. If source details are missing from the request, use a sensible project-local default and say what you assumed.
- Avoid broad normalization passes. Do not reorder unrelated entries, rename existing slugs, or restyle whole files unless the task requires it.

## Update The Site

- Check `app/` for an existing pattern before adding pages. Today, races are the strongest example in this repo.
- When a content type already has a list page or per-entry pages, update those routes as part of the same task.
- When a new browsable page is needed, create the smallest route structure that matches existing app conventions. Reuse shared renderers when appropriate, but do not force other categories into race-specific components.
- When a new route changes how users discover content, update any parent navigation pages that should expose it.

## Update READMEs

- Treat README updates as part of the feature, not optional cleanup.
- Update the most specific README first, then any parent indexes affected by the change.
- At minimum, consider:
  - `public/data/dnd/homebrew/<category>/README.md` when that folder has or should have a category landing page
  - `public/data/dnd/homebrew/README.md`
  - `public/data/dnd/README.md`
  - `README.md` when top-level navigation or project summaries change
- Keep README language aligned with the actual state of the repo. If a section stops being a placeholder, remove the "Work in Progress" framing instead of adding contradictory text.

## Validation

- Re-read the touched files for naming drift, broken links, and route/data mismatches.
- Run focused checks that match the edit surface. Prefer project-native validation such as `npm run build` when route structure changes or TypeScript files are added.
- If you cannot run a useful validation step, say so clearly and call out the residual risk.

## Decision Rules

- Prefer extending an established pattern over introducing a new abstraction.
- Prefer minimal, additive edits over cross-repo cleanup.
- Ask before making substantial UI or information-architecture changes that go beyond wiring the new homebrew content into the site.
- State assumptions when the user does not provide enough source or rules data to produce a faithful entry.

## Example Requests

- "Use $author-dnd-homebrew to add a new race JSON file, create its page under `app/races/`, add it to the race index, and update the relevant READMEs."
- "Use $author-dnd-homebrew to replace the placeholder spells docs with a real page and wire in new spell data."
- "Use $author-dnd-homebrew to add a new homebrew category and update all parent navigation and README references accordingly."
