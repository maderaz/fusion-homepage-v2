# Align Website Content to Figma — Implementation Plan

## Overview

Align the Fusion website to the Figma source of truth at `https://fusionhome.figma.site/`. Two differences were identified: an updated James Harris testimonial (with layout change) and a missing disclaimer in the transparency section.

## Current State Analysis

- **Testimonials** (`src/components/testimonials.astro`): 3-column equal grid with short quotes for all three testimonials.
- **Transparency Features** (`src/components/transparency-features.astro`): No disclaimer text at the bottom of the section.

### Key Discoveries:

- James Harris quote in Figma is significantly longer than the current website version (lines 16-17 of `testimonials.astro`)
- Figma layout uses full-width card for James Harris on first row, then 2 half-width cards for Vlad and Nick on second row
- Figma has a disclaimer paragraph at the bottom of the transparency features section (line 697 of snapshot YAML)
- All other sections (Hero, Benefits, How It Works, Solutions, Trust Bar, Comparison Table, Security, Final CTA, Footer) match between Figma and website

## Desired End State

1. James Harris testimonial matches Figma — new quote text, full-width card layout
2. Transparency section includes the illustrative disclaimer
3. All visual tests pass, site builds cleanly

### Verification:

- `npm run build` succeeds
- `npm run test` passes
- Visual inspection in browser matches Figma reference

## What We're NOT Doing

- Changing any other section content (all others match)
- Modifying styling/theme beyond the testimonial layout change
- Changing navigation, footer, or any other structural elements

## Implementation Approach

Two targeted edits to Astro components. No new files needed.

## Phase 1: Update James Harris Testimonial

### Overview

Replace the James Harris quote and change the testimonial grid layout from 3 equal columns to a full-width first card + 2 half-width cards below.

### Changes Required:

#### 1. Update quote text

**File**: `src/components/testimonials.astro`
**Lines**: 16-17

Replace:

```
"Fusion gave us the infrastructure to deploy institutional strategies onchain without compromising on security or transparency. It's exactly what was missing in DeFi."
```

With:

```
"Working with the IPOR Fusion team has been an exceptional experience. They bring a deep level of technical expertise and market understanding, but just as importantly, they are highly collaborative and really great to work with. Throughout our vault build, they have partnered closely with us, showing real commitment to getting the details right and helping us solve complex challenges as they arise. What stands out is their ability to combine strong infrastructure with a practical, delivery-focused mindset. The result is a solution that is not only truly institutional-grade, but also at the forefront of where the market is heading. They have been a key partner in helping us bring our vault vision to life, and couldn't recommend them more highly."
```

#### 2. Change testimonial grid layout

**File**: `src/components/testimonials.astro`
**Lines**: 83-155

Change from a flat `grid-cols-3` with `.map()` over all testimonials to:

- First card (James Harris) rendered separately as full-width
- Second row as `grid-cols-2` for Vlad and Nick

The James Harris card keeps the same card styling but spans the full container width. The quote text naturally fills the wider space (matching the Figma two-column text flow).

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] No type errors: `npx astro check`

#### Manual Verification:

- [ ] James Harris card spans full width on desktop
- [ ] Vlad and Nick cards appear side-by-side below
- [ ] Quote text readable and well-formatted
- [ ] Mobile layout stacks all cards vertically
- [ ] Dark/light mode both look correct

---

## Phase 2: Add Transparency Disclaimer

### Overview

Add the illustrative disclaimer text inside the transparency features section.

### Changes Required:

#### 1. Add disclaimer paragraph

**File**: `src/components/transparency-features.astro`

Add a disclaimer paragraph at the bottom of the section, inside the `max-w-[1200px]` container, after the flex layout div:

```html
<p class="mt-8 text-center text-xs text-muted-foreground/60 lg:text-left">
  *Product interface shown for illustrative purposes only. Displayed values are
  simulated and do not represent actual portfolio performance, balances, or
  guaranteed returns.
</p>
```

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm run test`

#### Manual Verification:

- [ ] Disclaimer text visible below the transparency feature tiles
- [ ] Text is subtle/muted and doesn't distract from the section content
- [ ] Renders correctly in both dark and light mode

---

## Testing Strategy

### Automated:

- `npm run build` — full static build
- `npm run test` — existing test suite
- `npx astro check` — type checking

### Manual:

1. Open site in browser at localhost
2. Compare testimonials section with Figma screenshot
3. Verify transparency disclaimer is present and styled correctly
4. Check responsive behavior at mobile/tablet/desktop breakpoints
5. Toggle dark/light mode

## References

- Ticket: `thoughts/tickets/fsn_00019-align-to-figma.md`
- Figma source of truth: `https://fusionhome.figma.site/`
- Screenshots captured: `figma-testimonials.png`, `figma-testimonials-2.png`
