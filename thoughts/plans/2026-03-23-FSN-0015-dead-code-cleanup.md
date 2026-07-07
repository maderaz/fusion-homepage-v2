# Dead Code Cleanup Implementation Plan

## Overview

Remove unused files, dead CSS, an unused dependency, unreachable code paths, and stale comments identified in the FSN-0006 code review. Single-phase cleanup — all changes are independent deletions with no behavioral impact.

## Current State Analysis

All items verified against the current codebase:

| Item                                            | Location                                          | Status                                                   |
| ----------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| `src/assets/` directory                         | 31 files across 4 subdirs                         | Zero imports anywhere                                    |
| Dead CSS (`.database`, `.db-light-*`, keyframe) | `src/styles/index.css:47-79`                      | Zero class references                                    |
| `tw-animate-css` dependency                     | `package.json:36`, `src/styles/tailwind.css:4`    | Zero utility classes used                                |
| `iconPendle` + map entry                        | `src/app/components/ui/fusion-flow.tsx:5,450`     | "Pendle" not in `FUSES` array                            |
| `textColor` prop                                | `src/app/components/brand-guidelines-page.tsx:48` | Never passed or used                                     |
| `emphasized` prop                               | `src/app/components/solutions.tsx:14,28`          | Never read in rendering                                  |
| Stale comment                                   | `src/app/components/hero.tsx:332`                 | `{/* App mock moved to TransparencyFeatures section */}` |
| Stale comment                                   | `src/app/components/hero.tsx:337`                 | `{/* removed protocol text grid */}`                     |
| Stale comment                                   | `src/app/components/ui/fusion-icons.tsx:823`      | `{/* removed */}`                                        |

**Skipped:** `onOpenCookieSettings` in `footer.tsx` — does not exist. The footer is an Astro component using `CustomEvent` dispatch; no prop-based callback exists.

## Desired End State

- `src/assets/` directory no longer exists
- `src/styles/index.css` contains only scrollbar styles, the `brand-gradient` utility, and the `marquee` keyframe
- `tw-animate-css` removed from `package.json` and `tailwind.css`
- No dead props, unreachable map entries, or stale comments in component files
- All existing tests pass, build succeeds, no visual regressions

## What We're NOT Doing

- Removing the `marquee` keyframe (it IS used by `hero.tsx:289`)
- Removing `public/icons/pendle.png` (out of scope — the file in `public/` may be used elsewhere or kept for future use)
- Refactoring or improving any surrounding code
- Adding new tests for this cleanup

## Implementation — Single Phase

### 1. Delete `src/assets/` directory

```bash
rm -rf src/assets/
```

### 2. Remove dead CSS from `src/styles/index.css`

**File**: `src/styles/index.css`
**Change**: Delete lines 46-79 (the blank line before `.database` through the closing `}` of `@keyframes database-animation-path`).

The file should go from the `.dark .custom-scrollbar` block directly to the `@keyframes marquee` block.

### 3. Remove `tw-animate-css` dependency

**File**: `src/styles/tailwind.css`
**Change**: Delete line 4 (`@import "tw-animate-css";`) and the trailing blank line, leaving:

```css
@import "tailwindcss" source(none);
@source '../**/*.{js,ts,jsx,tsx,astro}';
```

**File**: `package.json`
**Change**: Remove `"tw-animate-css": "1.4.0"` from `dependencies`.

Then run `npm install` to update the lockfile.

### 4. Remove `iconPendle` from `fusion-flow.tsx`

**File**: `src/app/components/ui/fusion-flow.tsx`
**Changes**:

- Delete line 5: `const iconPendle = "/icons/pendle.png";`
- Delete line 450: `Pendle: iconPendle,`

### 5. Remove unused `textColor` prop from `brand-guidelines-page.tsx`

**File**: `src/app/components/brand-guidelines-page.tsx`
**Change**: Delete line 48 (`textColor?: string;`) from the `ColorSwatch` type annotation.

### 6. Remove unused `emphasized` prop from `solutions.tsx`

**File**: `src/app/components/solutions.tsx`
**Changes**:

- Delete line 14: `emphasized?: boolean;` from `SolutionCard` interface
- Delete line 28: `emphasized: true,` from the first card object

### 7. Remove stale comments

**File**: `src/app/components/hero.tsx`

- Delete line 332: `{/* App mock moved to TransparencyFeatures section */}`
- Delete line 337: `{/* removed protocol text grid */}`

**File**: `src/app/components/ui/fusion-icons.tsx`

- Delete line 823: `{/* removed */}`
- Keep line 822: `{/* Center highlight dot */}` — this label describes the removed element's slot and still provides context for the SVG structure.

### Success Criteria

#### Automated Verification

- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Unit tests pass: `npm run test`
- [ ] `src/assets/` does not exist: `! test -d src/assets`
- [ ] No references to `tw-animate-css`: `grep -r "tw-animate-css" src/ package.json` returns nothing
- [ ] No references to dead CSS classes: `grep -r "database\|db-light" src/` returns nothing (except this plan)
- [ ] No `iconPendle` reference: `grep -r "iconPendle\|Pendle" src/` returns nothing
- [ ] Visual tests pass: `npm run test:visual`

#### Manual Verification

- [ ] Site renders correctly in dev mode (`npm run dev`)
- [ ] No visual differences on any page

## References

- Original ticket: `thoughts/tickets/fsn_0015-dead-code-cleanup.md`
- Source: FSN-0006 code review (`thoughts/tickets/fsn_0006-code-review.md`)
