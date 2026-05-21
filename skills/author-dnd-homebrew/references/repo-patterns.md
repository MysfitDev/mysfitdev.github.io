# Repository Patterns

Use this file when you need the current repo layout and examples before editing homebrew content.

## Current Layout

- Root D&D docs live in `public/data/dnd/`.
- Homebrew docs and data live in `public/data/dnd/homebrew/`.
- Current homebrew categories are `races`, `classes`, `items`, `spells`, and `monsters`.
- Only `races` currently contains concrete JSON entries.
- The other category READMEs are mostly placeholders, so category-specific structure may need to be created as part of the work.
- A repo-local customization draft currently exists at `.github/agents/homebrew.agent.md`; read it when present so skill-driven edits stay aligned with local expectations.

## Content File Patterns

- Race files currently live at `public/data/dnd/homebrew/races/<slug>.json`.
- Existing slugs use lowercase snake_case, not kebab-case.
- Each race file includes `_meta`, then a top-level `race` array.
- `_meta.sources` entries currently use fields such as:
  - `json`
  - `full`
  - `abbreviation`
  - `authors`
  - `version`
  - `url`
- Start from an existing sibling file rather than inventing a fresh schema.

## Route Patterns

- The live app currently uses the Next.js `app/` router.
- The main implemented homebrew section today is `app/races/`.
- `app/races/page.tsx` defines a manual list of race entries and links to `/races/<slug>`.
- Each race detail page lives at `app/races/<slug>/page.tsx`.
- Race detail pages currently delegate to `components/RacePageJsonRenderer.tsx`.
- `RacePageJsonRenderer` fetches `/data/dnd/homebrew/races/<slug>.json` client-side and displays the JSON plus a copyable URL.

## README Touch Points

Check these files whenever the content surface changes:

- `README.md`
  - Top-level resource links and repo summary.
- `public/data/dnd/README.md`
  - D&D section overview and category list.
- `public/data/dnd/homebrew/README.md`
  - Homebrew category index.
- `public/data/dnd/homebrew/<category>/README.md`
  - Category landing copy.

If a category page moves from placeholder to real content, update the surrounding READMEs to describe the real destination instead of leaving stale "Work in Progress" text.

## Practical Rules

- Reuse existing naming and file placement even if it is slightly inconsistent.
- Avoid editing unrelated content just to normalize style.
- When creating a new category page under `app/`, mirror the existing route style and add only the minimum new components needed.
- When extending a category that already has a manual index list, update that list in the same change.
- When no page exists yet for a category, decide whether the task needs:
  - only data and README updates, or
  - a new browsable route in `app/`

## Helpful Starting Files

- `public/data/dnd/homebrew/races/avilus.json`
- `app/races/page.tsx`
- `app/races/kemonomimi/page.tsx`
- `components/RacePageJsonRenderer.tsx`
- `public/data/dnd/README.md`
- `public/data/dnd/homebrew/README.md`
