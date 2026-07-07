# FSN-00029: Reflect Figma Designs — Remaining Fixes

## Overview

Fix 6 remaining visual differences between the IPOR site and the Figma benchmark at `fusionhome.figma.site/home`. All changes scoped to `src/sites/ipor/pages/index.astro` only to avoid Fusion site regression.

## Current State Analysis

FSN-00028 aligned typography, card border-radius, card padding, and card 2 image positioning. Playwright comparison reveals these remaining gaps:

| Property                     | Benchmark                | Current                | Delta                           |
| ---------------------------- | ------------------------ | ---------------------- | ------------------------------- |
| Main background              | `#ECE9F7` (light purple) | `#FFFFFF` (white)      | Wrong color                     |
| Card min-height              | 420px                    | 332px (auto)           | Cards too short                 |
| Card brand logos             | 36px tall                | 24px tall (`h-6`)      | Logos too small                 |
| "Discover Fusion" btn bottom | 718.6px                  | 634px                  | Not bottom-aligned              |
| "Launch App" btn bottom      | 718.6px                  | 590px                  | Not bottom-aligned              |
| Main min-height              | none                     | 900px (`min-h-screen`) | Excess whitespace before footer |

### Key Discoveries:

- Benchmark wrapper bg is `rgb(236, 233, 247)` = `#ECE9F7`, not white — FSN-00028 incorrectly set it to white (`src/sites/ipor/pages/index.astro:13`)
- Card logos render at 36px in benchmark but current uses `h-6` (24px) (`src/sites/ipor/pages/index.astro:31-39, 85-93`)
- Both benchmark buttons share the same bottom edge (718.6px), meaning cards use flex-column with CTAs pushed to bottom
- Both benchmark cards have `minHeight: 420px` — current cards are content-height only (332px)
- `min-h-screen` on `<main>` creates a full viewport gap between hero content and footer (`src/sites/ipor/pages/index.astro:13`)
- Card 2 paragraph text can visually overlap the absolutely-positioned image on narrow viewports

## Desired End State

The IPOR site visually matches the Figma benchmark for: background color, card heights, logo sizes, button alignment, and spacing to footer. The Fusion site remains completely unaffected.

### Verification:

- Run `npm run dev:ipor` and compare against `fusionhome.figma.site/home`
- Run `npm run build` to ensure both sites build without errors
- Visually confirm Fusion site is unchanged via `npm run dev:fusion`

## What We're NOT Doing

- Changing shared theme variables or shared components (would affect Fusion)
- Dark mode alignment (ticket focuses on light mode Figma benchmark)
- Footer or nav modifications
- Adding Cookie Policy page

## Implementation Approach

All changes are CSS/markup adjustments in `src/sites/ipor/pages/index.astro`. Each phase is independently verifiable.

---

## Phase 1: Background Color & Remove min-h-screen

### Overview

Fix the main background from white to the light purple used in the Figma benchmark, and remove `min-h-screen` to eliminate excess space before the footer.

### Changes Required:

#### 1. Main element classes

**File**: `src/sites/ipor/pages/index.astro`
**Line**: 13

```astro
<!-- Before -->
<main class="min-h-screen overflow-x-hidden transition-colors duration-500 bg-white dark:bg-[#090E14] text-black dark:text-white">

<!-- After -->
<main class="overflow-x-hidden transition-colors duration-500 bg-[#ECE9F7] dark:bg-[#090E14] text-black dark:text-white">
```

Changes:

- `bg-white` → `bg-[#ECE9F7]` (matches benchmark `rgb(236, 233, 247)`)
- Remove `min-h-screen` (eliminates 900px min-height that creates excess space)

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` passes (both sites)

#### Manual Verification:

- [ ] IPOR background is light purple (#ECE9F7), not white
- [ ] Cards (white) are visually distinct against the purple background
- [ ] No large gap between hero section and footer
- [ ] Dark mode still uses #090E14 background
- [ ] Fusion site is unchanged

**Implementation Note**: Pause for manual confirmation before Phase 2.

---

## Phase 2: Card Brand Logos

### Overview

Increase brand logo images inside both cards from 24px to 36px to match the benchmark.

### Changes Required:

#### 1. Card 1 logos

**File**: `src/sites/ipor/pages/index.astro`
**Lines**: 32, 37

```astro
<!-- Before -->
<img src="/brand/fusion-light.png" alt="Fusion by IPOR" class="h-6 w-auto block dark:hidden" />
<img src="/brand/fusion-dark.png" alt="Fusion by IPOR" class="h-6 w-auto hidden dark:block" />

<!-- After -->
<img src="/brand/fusion-light.png" alt="Fusion by IPOR" class="h-9 w-auto block dark:hidden" />
<img src="/brand/fusion-dark.png" alt="Fusion by IPOR" class="h-9 w-auto hidden dark:block" />
```

#### 2. Card 2 logos

**File**: `src/sites/ipor/pages/index.astro`
**Lines**: 87, 92

Same change: `h-6` → `h-9` for both light and dark logo variants.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` passes

#### Manual Verification:

- [ ] Card logos are visibly larger (36px vs 24px), matching benchmark
- [ ] Logo aspect ratio preserved (w-auto)

**Implementation Note**: Pause for manual confirmation before Phase 3.

---

## Phase 3: Card Height & Button Alignment

### Overview

Set card min-height to 420px and restructure both cards to use flex-column layout so CTAs are pushed to the bottom, aligning "Discover Fusion" and "Launch App" at the same vertical position.

### Changes Required:

#### 1. Card 1 — flex layout with bottom-aligned CTA

**File**: `src/sites/ipor/pages/index.astro`
**Line**: 28

```astro
<!-- Before -->
<div class="rounded-[18px] border p-9 transition-colors border-border bg-card">

<!-- After -->
<div class="rounded-[18px] border p-9 transition-colors border-border bg-card flex flex-col min-h-[420px]">
```

Then add `mt-auto` to the CTA wrapper (the `<div>` containing the "Discover Fusion" button) so it sticks to the bottom:

**Line**: 54

```astro
<!-- Before -->
<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">

<!-- After -->
<div class="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center pt-8">
```

Change: `mt-8` → `mt-auto pt-8` — `mt-auto` pushes to bottom, `pt-8` preserves the visual spacing above.

#### 2. Card 2 — flex layout with bottom-aligned CTA

**File**: `src/sites/ipor/pages/index.astro`
**Line**: 81

```astro
<!-- Before -->
<div class="relative rounded-[18px] border overflow-hidden transition-colors border-border bg-card">

<!-- After -->
<div class="relative rounded-[18px] border overflow-hidden transition-colors border-border bg-card min-h-[420px]">
```

The inner `<div class="p-9">` wrapper needs flex-column layout too:

**Line**: 83

```astro
<!-- Before -->
<div class="p-9">

<!-- After -->
<div class="p-9 flex flex-col h-full">
```

Then the Launch App link gets `mt-auto`:

**Line**: 106

```astro
<!-- Before -->
<a href="https://app.ipor.io/fusion" ... class="mt-6 brand-gradient ...">

<!-- After -->
<a href="https://app.ipor.io/fusion" ... class="mt-auto pt-6 brand-gradient ...">
```

Change: `mt-6` → `mt-auto pt-6`.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` passes

#### Manual Verification:

- [ ] Both cards are 420px tall (or taller if content overflows)
- [ ] "Discover Fusion" and "Launch App" buttons are aligned at the same vertical position
- [ ] Button alignment matches the benchmark (both at card bottom with padding)
- [ ] Cards look correct at different viewport widths

**Implementation Note**: Pause for manual confirmation before Phase 4.

---

## Phase 4: Card 2 Text Overlap Fix

### Overview

Constrain the text content width in card 2 so it doesn't visually overlap the absolutely-positioned vault-overview image at bottom-right.

### Changes Required:

#### 1. Constrain paragraph and heading width

**File**: `src/sites/ipor/pages/index.astro`

The paragraph in card 2 (line 102) can overlap the image on some viewport widths. Add a max-width to the text content area:

```astro
<!-- Before -->
<p class="mt-4 text-muted-foreground">

<!-- After -->
<p class="mt-4 text-muted-foreground max-w-[55%]">
```

This ensures text stays in the left ~55% of the card, leaving room for the ~45% wide image.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` passes
- [ ] `npm run build:fusion` — Fusion site unaffected

#### Manual Verification:

- [ ] Card 2 text does not overlap the vault-overview image
- [ ] Text reads naturally without being too narrow on desktop
- [ ] Responsive: on mobile (stacked layout), text should still be readable
- [ ] Compare side-by-side with Figma benchmark

**Implementation Note**: This is the final phase. Do a full side-by-side comparison with the Figma benchmark after this phase.

---

## Testing Strategy

### Automated:

- `npm run build` — both sites build successfully
- `npm run build:fusion` — Fusion site unaffected
- `npm run build:ipor` — IPOR site builds

### Manual Testing Steps:

1. Run `npm run dev:ipor` and open `http://localhost:4322`
2. Open `https://fusionhome.figma.site/home` in adjacent tab
3. Compare side-by-side:
   - Background color (light purple #ECE9F7)
   - Card logos (36px height)
   - Card heights (420px)
   - Button alignment (both at same bottom position)
   - No excess space before footer
   - Card 2 text does not overlap image
4. Run `npm run dev:fusion` and verify no regressions
5. Test both light and dark modes on IPOR site
6. Test responsive behavior (mobile, tablet)

## Performance Considerations

None — all changes are CSS/markup only within a single file.

## References

- Ticket: `thoughts/tickets/fsn_00029-reflect-figma-designs.md`
- Previous plan: `thoughts/plans/2026-03-30-FSN-00028-reflect-figma-designs.md`
- Figma benchmark: `https://fusionhome.figma.site/home`
- Main file to modify: `src/sites/ipor/pages/index.astro`
