# Fix Dark/Light Mode Errors — Implementation Plan

## Overview

The "Start Building" button and "Trusted by" logos in the Hero React island are invisible on dark-mode first load. This is caused by a SSR/hydration mismatch: Astro server-renders the component with light-mode JS-conditional classes, but the inline theme script sets the dark CSS class before paint — resulting in dark background + light-mode element styles until React hydrates.

## Current State Analysis

The Hero component (`src/app/components/hero.tsx`) uses `useTheme()` to get an `isDark` boolean and applies styles via `isDark ? darkClasses : lightClasses`. During SSR, `isDark` is always `false` (document is undefined), so the server-rendered HTML always has light-mode classes baked in.

Meanwhile, static Astro components (`trust-bar.astro`, `testimonials.astro`) use CSS `dark:` variants (e.g., `dark:invert`) which work immediately because they're resolved by the `.dark` class on `<html>` set before first paint.

### Key Discoveries:

- `hero.tsx:98-103` — "Start Building" button uses `isDark ? "text-white" : "text-black"` (JS conditional)
- `hero.tsx:170-181, 202-214` — Logo images use `isDark` for opacity/filter (JS conditional + inline style)
- `hero.tsx:113-116, 127-130, 141-144` — Stat dividers use `isDark ? "bg-white/10" : "bg-black/10"`
- `trust-bar.astro:59` — Uses `brightness-0 opacity-60 dark:invert` (CSS-only, works correctly)
- `use-theme.ts:5` — SSR guard returns `false`, causing all React islands to SSR as light mode

## Desired End State

All dark/light styling in `hero.tsx` uses CSS `dark:` variants instead of JS conditionals. The component renders correctly on first paint in both themes without waiting for React hydration. The `useTheme()` hook is removed from `hero.tsx` since it's no longer needed.

### Verification:

- Visual: dark mode first load shows white button text and visible logos
- Playwright: hero section screenshot tests pass in both modes
- No console errors in either mode

## What We're NOT Doing

- Changing the default theme (it's already `light`, working correctly)
- Changing localStorage behavior (returning users keep their stored preference)
- Refactoring other components (trust-bar.astro, testimonials.astro already use CSS-only approach)
- Changing the visual appearance — only the rendering mechanism changes

## Implementation Approach

Replace all `isDark`-conditional styling with Tailwind `dark:` variant classes, matching the pattern already established in `trust-bar.astro`. Remove the `useTheme()` dependency from `hero.tsx`.

## Phase 1: Convert Hero Styling to CSS-Only

### Overview

Replace all JS-conditional class/style logic with CSS `dark:` variants.

### Changes Required:

#### 1. "Start Building" Button

**File**: `src/app/components/hero.tsx:98-103`
**Change**: Replace `cn()` with `isDark` ternary → static classes with `dark:` variants

```tsx
// Before
className={cn(
  "inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm tracking-wide transition-colors duration-300",
  isDark
    ? "border-[#45484D] text-white hover:bg-[#22272C]"
    : "border-[#9BA3AF] text-black hover:bg-[#EFEFEF]",
)}

// After
className="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm tracking-wide transition-colors duration-300 border-[#9BA3AF] text-black hover:bg-[#EFEFEF] dark:border-[#45484D] dark:text-white dark:hover:bg-[#22272C]"
```

#### 2. Stat Dividers (3 instances)

**File**: `src/app/components/hero.tsx:113-116, 127-130, 141-144`
**Change**: Replace `isDark` ternary → `dark:` variants

```tsx
// Before
className={cn("hidden h-10 w-px lg:block", isDark ? "bg-white/10" : "bg-black/10")}

// After
className="hidden h-10 w-px lg:block bg-black/10 dark:bg-white/10"
```

Same pattern for the other two dividers (h-8 variants).

#### 3. Desktop Logos

**File**: `src/app/components/hero.tsx:170-181`
**Change**: Replace `isDark` conditional classes + inline style → CSS-only `dark:invert` pattern (matching `trust-bar.astro`)

```tsx
// Before
className={cn(
  logo.h,
  isDark ? "opacity-60" : "opacity-50 brightness-0",
)}
style={isDark ? { filter: "grayscale(1) brightness(0) invert(0.65)" } : undefined}

// After
className={cn(logo.h, "brightness-0 opacity-50 dark:invert dark:opacity-60")}
// No inline style needed
```

#### 4. Mobile Marquee Logos

**File**: `src/app/components/hero.tsx:202-214`
**Change**: Same pattern as desktop logos

```tsx
// Before
className={cn(
  "h-5 shrink-0",
  logo.alt === "Reservoir" && "h-3",
  isDark ? "opacity-60" : "opacity-50 brightness-0",
)}
style={isDark ? { filter: "grayscale(1) brightness(0) invert(0.65)" } : undefined}

// After
className={cn(
  "h-5 shrink-0 brightness-0 opacity-50 dark:invert dark:opacity-60",
  logo.alt === "Reservoir" && "h-3",
)}
// No inline style needed
```

#### 5. Remove useTheme from Hero

**File**: `src/app/components/hero.tsx`
**Change**: Remove `useTheme` import and usage

```tsx
// Remove these:
import { useTheme } from "@/components/use-theme";
import { cn } from "@/app/components/ui/utils";
const { isDark } = useTheme();
```

Note: `cn` import can also be removed if no other usage remains (the logo `cn()` calls with just static classes can be replaced with template literals or kept with `cn` — keeping `cn` is fine for readability).

### Success Criteria:

#### Automated Verification:

- [ ] Build passes: `npm run build`
- [ ] Type checking passes: `npx astro check`
- [ ] Playwright visual tests pass: `npm run test:visual` (after updating snapshots)
- [ ] Console error tests pass (no new errors in dark/light mode)

#### Manual Verification:

- [ ] Clear localStorage, load page → light mode, "Start Building" button has black text
- [ ] Set localStorage `fusion-theme` to `dark`, reload → dark mode, button has white text immediately (no flash)
- [ ] "Trusted by" logos visible in both modes on first load
- [ ] Toggle theme via nav — all elements transition correctly
- [ ] Mobile marquee logos visible in both modes

**Implementation Note**: After completing this phase and all automated verification passes, pause for manual confirmation before proceeding.

---

## Phase 2: Update Playwright Tests

### Overview

Add hero section to the visual regression tests to prevent this class of bug from recurring. Update snapshots.

### Changes Required:

#### 1. Add Hero Section to Visual Tests

**File**: `tests/visual/sections.spec.ts`
**Change**: Add hero to the sections array. The hero needs an `id` attribute on its `<section>` or use `main` as the selector.

First, add `id="hero"` to the hero's `<section>` element in `hero.tsx`, then add to the test:

```ts
const sections = [
  { name: "hero", selector: "#hero" }, // ADD
  { name: "transparency-features", selector: "#transparency" },
  // ... existing sections
];
```

#### 2. Regenerate Snapshots

Run `npm run test:visual:update` to regenerate all baseline snapshots with the new styling.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run test:visual` passes with updated snapshots
- [ ] Hero section has both light and dark mode snapshots

#### Manual Verification:

- [ ] Review generated snapshot images — button text and logos are visible in both modes

## References

- Original ticket: `thoughts/tickets/fsn_00023-dark-light-mode-errors.md`
- Pattern reference: `src/components/trust-bar.astro:59` — CSS-only dark mode with `brightness-0 dark:invert`
