# Code Quality Fixes Implementation Plan

## Overview

Address code quality issues identified in FSN-0006 code review: misleading constant names, duplicated patterns, unnecessary hook calls, missing error handling, and misplaced component files.

## Current State Analysis

- `fusion-icons.tsx` has three constants (`P`, `P2`, `DIM`) that are all `"currentColor"` with misleading names
- `hero.tsx` has `logoFirst`/`logoThird` variable names that don't describe the actual logos
- `hero.tsx` and `nav.tsx` share identical inline `onMouseEnter`/`onMouseLeave` hover opacity handlers
- `FuseIcon` in `fusion-flow.tsx` calls `useTheme()` redundantly when parent already has `isDark`
- `brand-guidelines-page.tsx` calls `navigator.clipboard.writeText()` without error handling
- `cookie-banner-island.tsx` (React) lives in `src/components/` (Astro directory)
- Footer type safety issue already resolved by FSN-0014 (footer unified into Astro component)

## What We're NOT Doing

- Footer type safety fix (already resolved by FSN-0014)
- Hardcoded hero stats — needs product decision
- `THEME_SNIPPET` duplication — needs product decision
- `max-w-[1200px]` / `clamp()` extraction — consistent patterns, not worth abstracting

## Implementation

### Phase 1: Naming Fixes

**File**: `src/app/components/ui/fusion-icons.tsx`

- Remove `P`, `P2`, `DIM` constants (all identical `"currentColor"`)
- Inline `"currentColor"` at all usage sites

**File**: `src/app/components/hero.tsx`

- Rename `logoFirst` → `logoClearstar`
- Rename `logoThird` → `logoReservoir`

### Phase 2: Deduplication

**File**: `src/app/components/hero.tsx`

- Replace `onMouseEnter`/`onMouseLeave` opacity handlers with Tailwind `transition-opacity duration-300 hover:opacity-70`

**File**: `src/app/components/nav.tsx`

- Same hover handler replacement

**File**: `src/app/components/ui/fusion-flow.tsx`

- Change `FuseIcon` to accept `isDark` prop instead of calling `useTheme()`
- Pass `isDark` from parent `FusionFlow` component

### Phase 3: Minor Fixes

**File**: `src/app/components/brand-guidelines-page.tsx`

- Add `.catch(() => {})` to both `navigator.clipboard.writeText()` calls

**File**: `src/components/cookie-banner-island.tsx` → `src/app/components/cookie-banner-island.tsx`

- Move component and test file to `src/app/components/`
- Update imports in `index.astro`, `terms-of-use.astro`, `privacy-policy.astro`
- Update CLAUDE.md reference

## Success Criteria

### Automated Verification

- [ ] `astro check` passes
- [ ] `astro build` succeeds
- [ ] `vitest run` passes (cookie-banner-island tests)
- [ ] No TypeScript errors

### Manual Verification

- [ ] Hover opacity on "Launch App" buttons works in both hero and nav
- [ ] Fusion flow icons display correctly in both dark/light modes
- [ ] Cookie banner still appears and functions correctly
- [ ] Brand guidelines page copy buttons work

## References

- Original ticket: `thoughts/tickets/fsn_0016-code-quality-fixes.md`
- Related: FSN-0014 (footer unification, resolved the type safety item)
