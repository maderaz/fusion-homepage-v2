# FSN-00028: Reflect Figma Designs for IPOR Site

## Overview

Align the IPOR site (`ipor.io`) with the Figma benchmark at `fusionhome.figma.site/home`. Changes are scoped exclusively to IPOR site files to avoid regression on the Fusion site.

## Current State Analysis

The IPOR site structure is close to the Figma design but has several styling differences discovered via Playwright-based comparison of computed styles.

### Key Discoveries:

- Background color differs: current uses shared `--background` (#F5F5FA), Figma uses pure white (`src/shared/styles/theme.css:11`)
- h1 has `tracking-tight` (-1.5px letter-spacing) and lineHeight 1.0, Figma uses normal spacing and 1.25 lineHeight (`src/sites/ipor/pages/index.astro:16`)
- Paragraph text uses `text-body-foreground` (#374151), Figma uses lighter `text-muted-foreground` (#70747A) (`src/sites/ipor/pages/index.astro:19`)
- Cards use `rounded-2xl` (16px) and `p-8` (32px), Figma uses 18px radius and 36px padding (`src/sites/ipor/pages/index.astro:28-29`)
- Card 2 ("The Live App") image is full-width in flow, Figma positions it absolutely at bottom-right at ~253x286px (`src/sites/ipor/pages/index.astro:113-117`)

## Desired End State

The IPOR site visually matches the Figma benchmark for all elements: background, typography, card layout, and image positioning. The Fusion site remains completely unaffected.

### Verification:

- Run `npm run dev:ipor` and compare against `fusionhome.figma.site/home`
- Run `npm run build` to ensure both sites build without errors
- Visually confirm Fusion site is unchanged via `npm run dev:fusion`

## What We're NOT Doing

- Changing shared theme variables (would affect Fusion)
- Adding a Cookie Policy page or link (no page exists)
- Modifying shared components (footer, layout, nav)
- Dark mode alignment (ticket focuses on light mode Figma benchmark)

## Implementation Approach

All changes are in `src/sites/ipor/pages/index.astro` only. We override shared styles with inline Tailwind classes scoped to the IPOR page.

## Phase 1: Background & Typography Fixes

### Overview

Fix background color, heading typography, and paragraph text color.

### Changes Required:

#### 1. IPOR page background override

**File**: `src/sites/ipor/pages/index.astro`
**Changes**: Override the background on `<main>` from shared theme (#F5F5FA) to white.

```astro
<!-- Before -->
<main class="min-h-screen overflow-x-hidden transition-colors duration-500 bg-background text-black dark:text-white">

<!-- After -->
<main class="min-h-screen overflow-x-hidden transition-colors duration-500 bg-white dark:bg-[#090E14] text-black dark:text-white">
```

#### 2. h1 typography

**File**: `src/sites/ipor/pages/index.astro`
**Changes**: Remove `tracking-tight` and add proper line-height to match Figma (lineHeight 75px = 1.25 at 60px).

```astro
<!-- Before -->
<h1 class="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">

<!-- After -->
<h1 class="text-4xl font-medium md:text-5xl lg:text-6xl leading-[1.25]">
```

#### 3. Hero paragraph color

**File**: `src/sites/ipor/pages/index.astro`
**Changes**: Change from `text-body-foreground` (darker) to `text-muted-foreground` (lighter, matches Figma #70747A).

```astro
<!-- Before -->
<p class="mt-4 max-w-2xl text-lg text-body-foreground">

<!-- After -->
<p class="mt-4 max-w-2xl text-lg text-muted-foreground">
```

#### 4. Card paragraph colors

**File**: `src/sites/ipor/pages/index.astro`
**Changes**: Change both card description paragraphs from `text-body-foreground` to `text-muted-foreground`.

```astro
<!-- Card 1 paragraph - Before -->
<p class="mt-4 text-body-foreground">

<!-- Card 1 paragraph - After -->
<p class="mt-4 text-muted-foreground">
```

```astro
<!-- Card 2 paragraph - Before -->
<p class="mt-4 text-body-foreground">

<!-- Card 2 paragraph - After -->
<p class="mt-4 text-muted-foreground">
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` passes (both sites)
- [ ] No type/lint errors

#### Manual Verification:

- [ ] IPOR background is white (not purple-gray)
- [ ] h1 "Meet Fusion" has normal letter-spacing and 1.25 line-height
- [ ] Paragraph text is lighter gray (#70747A) matching Figma
- [ ] Fusion site is unchanged

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 2.

---

## Phase 2: Card Styling Fixes

### Overview

Fix card border-radius and padding to match Figma's 18px radius and 36px padding.

### Changes Required:

#### 1. Card border-radius and padding

**File**: `src/sites/ipor/pages/index.astro`
**Changes**: Update both cards from `rounded-2xl p-8` to `rounded-[18px] p-9`.

```astro
<!-- Card 1 - Before -->
<div class="rounded-2xl border p-8 transition-colors border-border bg-card">

<!-- Card 1 - After -->
<div class="rounded-[18px] border p-9 transition-colors border-border bg-card">
```

```astro
<!-- Card 2 - Before -->
<div class="rounded-2xl border p-8 transition-colors border-border bg-card">

<!-- Card 2 - After (note: p-0 and overflow-hidden for image positioning in Phase 3) -->
<div class="relative rounded-[18px] border overflow-hidden transition-colors border-border bg-card">
```

Note: Card 2 gets `p-0` and `overflow-hidden` because the Figma design uses an inner wrapper for padding and an absolutely-positioned image. This will be completed in Phase 3.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` passes

#### Manual Verification:

- [ ] Card corners are slightly more rounded (18px vs 16px)
- [ ] Card 1 padding is slightly larger (36px)

**Implementation Note**: Pause for manual confirmation before Phase 3.

---

## Phase 3: Card 2 Image Layout

### Overview

Restructure Card 2 ("The Live App") to position the vault-overview image absolutely at bottom-right, matching the Figma design where the image overlaps into the card corner.

### Changes Required:

#### 1. Card 2 restructure

**File**: `src/sites/ipor/pages/index.astro`
**Changes**: Wrap card 2 text content in an inner div with padding, position the image absolutely at bottom-right.

```astro
<!-- Card 2 - Before -->
<div class="rounded-2xl border p-8 transition-colors border-border bg-card">
  <div class="mb-6 flex items-center gap-3">
    <img src="/brand/fusion-light.png" ... class="h-6 w-auto block dark:hidden" />
    <img src="/brand/fusion-dark.png" ... class="h-6 w-auto hidden dark:block" />
  </div>
  <h2 class="text-2xl font-medium tracking-tight md:text-3xl">
    The <span ...>Live</span> App
  </h2>
  <p class="mt-4 text-body-foreground">
    Discover existing yield strategies powered by Fusion. Get started in one-click.
  </p>
  <a href="https://app.ipor.io/fusion" ... class="mt-6 brand-gradient ...">
    Launch App
  </a>
  <img src="/vault-overview.png" alt="Fusion App" class="mt-6 w-full rounded-lg" />
</div>

<!-- Card 2 - After -->
<div class="relative rounded-[18px] border overflow-hidden transition-colors border-border bg-card">
  <div class="p-9">
    <div class="mb-6 flex items-center gap-3">
      <img src="/brand/fusion-light.png" ... class="h-6 w-auto block dark:hidden" />
      <img src="/brand/fusion-dark.png" ... class="h-6 w-auto hidden dark:block" />
    </div>
    <h2 class="text-2xl font-medium tracking-tight md:text-3xl">
      The <span ...>Live</span> App
    </h2>
    <p class="mt-4 text-muted-foreground">
      Discover existing yield strategies powered by Fusion. Get started in one-click.
    </p>
    <a href="https://app.ipor.io/fusion" ... class="mt-6 brand-gradient ...">
      Launch App
    </a>
  </div>
  <img
    src="/vault-overview.png"
    alt="Fusion App"
    class="absolute bottom-0 right-0 w-[45%] rounded-tl-[17px] rounded-bl-[17px] rounded-br-[17px] object-cover"
  />
</div>
```

Key styling for the image:

- `absolute bottom-0 right-0` — positions at bottom-right corner
- `w-[45%]` — roughly 253/565 ≈ 45% of card width
- `rounded-tl-[17px] rounded-bl-[17px] rounded-br-[17px]` — rounded on 3 corners (not top-right, which is flush with card edge)
- `object-cover` — maintain aspect ratio while filling space

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` passes
- [ ] No visual regression on Fusion site

#### Manual Verification:

- [ ] Card 2 vault-overview image is positioned at bottom-right
- [ ] Image is ~45% of card width with rounded corners on 3 sides
- [ ] Card heights are roughly equal between card 1 and card 2
- [ ] Text content in card 2 is not overlapped by the image
- [ ] Compare side-by-side with Figma benchmark

**Implementation Note**: This is the most visually impactful change. Pause for manual comparison with Figma before finalizing.

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
   - Background color (white)
   - h1 typography (spacing, line-height)
   - Paragraph text color (lighter gray)
   - Card border-radius and padding
   - Card 2 image positioning
4. Run `npm run dev:fusion` and verify no regressions
5. Test both light and dark modes on IPOR site
6. Test responsive behavior (mobile, tablet)

## Performance Considerations

None — all changes are CSS/markup only within a single file.

## References

- Ticket: `thoughts/tickets/fsn_00028-reflect-figma-designs.md`
- Figma benchmark: `https://fusionhome.figma.site/home`
- Main file to modify: `src/sites/ipor/pages/index.astro`
