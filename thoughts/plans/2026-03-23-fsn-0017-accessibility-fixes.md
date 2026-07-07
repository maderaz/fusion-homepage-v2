# Accessibility Fixes Implementation Plan

## Overview

Address six accessibility issues identified in the FSN-0006 code review. These range from quick one-line ARIA attribute additions to semantic table role improvements.

## Current State Analysis

All six files exist and the issues are confirmed by code inspection. No existing accessibility infrastructure (e.g., shared a11y utilities) to leverage — each fix is a localized change.

### Key Discoveries:

- Cookie banner close button has no `aria-label` — `cookie-banner-island.tsx:58`
- Hamburger button has `aria-label` but no `aria-expanded` — `nav.tsx:75-77`
- Six decorative SVGs lack `aria-hidden` — `transparency-features.astro:54,79,107,131,153,177`
- All partner logos (7 desktop + 14 mobile marquee) use `alt=""` — `hero.tsx:163-276,306-309`
- No favicon `<link>` in `<head>` — `base-head.astro`
- Comparison table uses `div` grid with no ARIA roles — `comparison-table.tsx:133-231`

## Desired End State

All six issues resolved. Screen readers correctly identify interactive controls, skip decorative content, announce partner names, and navigate the comparison table as a structured table.

### Verification:

- `astro check && astro build` passes
- Manual screen reader testing confirms correct announcements

## What We're NOT Doing

- Full WCAG 2.1 AA audit — only the six issues from FSN-0017
- Refactoring comparison table to `<table>` elements — ARIA roles on divs suffice
- Adding ARIA roles to the mobile card layout of the comparison table (lines 234-303) — it's a card pattern, not tabular

## Phase 1: Quick ARIA Attributes + Favicon

### Overview

Four small, independent changes: aria-label, aria-expanded, aria-hidden, and favicon link.

### Changes Required:

#### 1. Cookie banner close button

**File**: `src/components/cookie-banner-island.tsx`
**Line**: 58

Add `aria-label="Close"` to the close button:

```tsx
<button
  onClick={decline}
  aria-label="Close"
  className="rounded-lg p-1 transition-colors text-muted-foreground hover:text-foreground"
>
```

#### 2. Hamburger toggle button

**File**: `src/app/components/nav.tsx`
**Line**: 75-76

Add `aria-expanded={menuState}` to the hamburger button:

```tsx
<button
  onClick={() => setMenuState(!menuState)}
  aria-label={menuState ? "Close Menu" : "Open Menu"}
  aria-expanded={menuState}
  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
>
```

#### 3. Decorative SVGs in transparency features

**File**: `src/components/transparency-features.astro`

Add `aria-hidden="true"` to all six `<svg>` elements (lines 54, 79, 107, 131, 153, 177):

```html
<svg
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="none"
  aria-hidden="true"
></svg>
```

#### 4. Favicon link

**File**: `src/components/base-head.astro`

Add after the canonical link (line 17):

```html
<link rel="icon" type="image/png" href="/brand/fusion.png" />
```

### Success Criteria:

#### Automated Verification:

- [ ] Build passes: `astro check && astro build`
- [ ] No new lint errors

#### Manual Verification:

- [ ] Cookie banner close button announces "Close" in screen reader
- [ ] Hamburger button announces expanded/collapsed state
- [ ] Decorative SVGs are skipped by screen reader
- [ ] Favicon appears in browser tab

---

## Phase 2: Partner Logo Alt Text

### Overview

Add meaningful `alt` text to partner logos so screen readers announce brand names under "Trusted by".

### Changes Required:

#### 1. Desktop logo row

**File**: `src/app/components/hero.tsx`
**Lines**: 163-276

Update each `<img>` tag's `alt` attribute:

| Variable        | File                    | Alt text       |
| --------------- | ----------------------- | -------------- |
| `logoTesseract` | `/logos/tesseract.png`  | `"Tesseract"`  |
| `logoFirst`     | `/logos/clearstar.png`  | `"ClearStar"`  |
| `logoThird`     | `/logos/reservoir.png`  | `"Reservoir"`  |
| `logoTauLabs`   | `/logos/tau-labs.png`   | `"Tau Labs"`   |
| `logoK3Capital` | `/logos/k3-capital.png` | `"K3 Capital"` |
| `logoNavigator` | `/logos/navigator.png`  | `"Navigator"`  |
| `logoLlamaRisk` | `/logos/llamarisk.png`  | `"LlamaRisk"`  |

#### 2. Mobile marquee logos

**File**: `src/app/components/hero.tsx`
**Lines**: 289-324

The marquee contains 14 images (7 logos duplicated for infinite scroll). To avoid screen readers announcing each name twice, introduce a `logoNames` array and only set `alt` on the first 7 items (indices 0-6); the duplicate set (indices 7-13) keeps `alt=""`.

```tsx
const logoEntries = [
  { src: logoTesseract, alt: "Tesseract" },
  { src: logoFirst, alt: "ClearStar" },
  { src: logoThird, alt: "Reservoir" },
  { src: logoTauLabs, alt: "Tau Labs" },
  { src: logoK3Capital, alt: "K3 Capital" },
  { src: logoNavigator, alt: "Navigator" },
  { src: logoLlamaRisk, alt: "LlamaRisk" },
];
```

Then in the marquee map:

```tsx
{[...logoEntries, ...logoEntries].map((logo, i) => (
  <img
    key={i}
    src={logo.src}
    alt={i < logoEntries.length ? logo.alt : ""}
    ...
  />
))}
```

### Success Criteria:

#### Automated Verification:

- [ ] Build passes: `astro check && astro build`

#### Manual Verification:

- [ ] Screen reader announces "Trusted by: Tesseract, ClearStar, Reservoir, Tau Labs, K3 Capital, Navigator, LlamaRisk"
- [ ] No duplicate announcements from mobile marquee

---

## Phase 3: Comparison Table Semantics

### Overview

Add ARIA table roles to the desktop comparison table div grid so screen readers navigate it as a structured table. The mobile card layout (lines 234-303) is left as-is since its card pattern is already semantically reasonable.

### Changes Required:

**File**: `src/app/components/comparison-table.tsx`
**Lines**: 133-231

#### 1. Outer container — `role="table"` + accessible label

```tsx
<div
  role="table"
  aria-label="Fusion vs Merkle Proof Vaults comparison"
  className={cn(
    "hidden md:block rounded-2xl border overflow-hidden bg-card",
    border,
  )}
>
```

#### 2. Header row — `role="row"`

```tsx
<div
  role="row"
  className={cn(
    "grid grid-cols-[240px_1fr_1fr]",
    `border-b ${border}`,
  )}
>
```

#### 3. Header cells — `role="columnheader"`

Empty first cell:

```tsx
<div role="columnheader" className={cn("p-5", headerBg)} />
```

Fusion header cell:

```tsx
<div
  role="columnheader"
  className={cn("flex items-center justify-center gap-3 p-5 border-l", headerBg, border)}
>
```

Merkle header cell:

```tsx
<div
  role="columnheader"
  className={cn("flex items-center justify-center p-5 border-l", headerBg, border)}
>
```

#### 4. Data rows — `role="row"`

```tsx
<div
  key={row.feature}
  role="row"
  className={cn(...)}
>
```

#### 5. Data cells — `role="cell"`

Feature name cell:

```tsx
<div role="cell" className="flex items-center gap-3 p-5">
```

Fusion value cell:

```tsx
<div role="cell" className={cn("flex items-center gap-3 p-5 border-l bg-primary/[0.03]", border)}>
```

Merkle value cell:

```tsx
<div role="cell" className={cn("flex items-center gap-3 p-5 border-l", border)}>
```

### Success Criteria:

#### Automated Verification:

- [ ] Build passes: `astro check && astro build`
- [ ] No new lint errors

#### Manual Verification:

- [ ] Screen reader announces table structure (e.g., "Table with 11 rows and 3 columns")
- [ ] Arrow key navigation works between cells in screen reader table mode
- [ ] Column headers are announced when navigating cells

---

## Testing Strategy

### Automated:

- `astro check && astro build` confirms no type/build errors after all changes

### Manual Testing Steps:

1. Open site with VoiceOver (macOS) or NVDA (Windows)
2. Navigate to cookie banner — verify "Close" button is announced
3. Open mobile nav — verify "Open Menu, expanded" / "Close Menu, collapsed" announcements
4. Navigate transparency features section — verify SVG icons are skipped
5. Navigate "Trusted by" section — verify partner names are read aloud
6. Check browser tab for favicon
7. Navigate comparison table with table navigation commands — verify structured navigation works

## References

- Original ticket: `thoughts/tickets/fsn_0017-accessibility-fixes.md`
- Source review: FSN-0006
