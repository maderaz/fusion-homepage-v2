# Align Website Content to Figma — Implementation Plan

## Overview

Compare the live Figma site (`https://fusionhome.figma.site/`) against the current codebase and align all differences. The Figma project is the source of truth. This covers text content, missing images, missing UI elements, and dead code cleanup.

## Current State Analysis

A full comparison was performed by browsing the Figma site with Playwright and reading all source components. The cookie banner already matches. Most sections (Hero, Benefits, HowItWorks, Solutions, TrustBar, ComparisonTable, Security, FinalCTA, Footer) are aligned.

### Key Discoveries:

- `src/app/components/testimonials.tsx:111-120` — heading text diverges from Figma
- `src/app/components/testimonials.tsx:132-133` — subheading text diverges
- `src/app/components/testimonials.tsx:231` — role display format missing company name
- `src/app/components/testimonials.tsx:31,41,51` — badge values differ
- `src/app/components/transparency-features.tsx:43-44` — TODO comment, dashboard image missing
- `src/app/components/transparency-features.tsx` — no disclaimer text
- `src/app/components/hero.tsx:28-1016` — DashboardMock component (~990 lines) defined but never rendered

## Desired End State

All website text and layout matches the Figma source of truth exactly. The vault overview dashboard image is displayed in the TransparencyFeatures section. Dead code is removed.

### Verification:

- Run `npm run dev` and visually compare each section against `https://fusionhome.figma.site/`
- Run `npm run build` to confirm no build errors
- Run `npx vitest run` to confirm no test regressions

## What We're NOT Doing

- Styling/CSS alignment (spacing, colors, font sizes) — deferred to FSN-0005
- Adding new sections or restructuring page layout
- Changing links, URLs, or navigation behavior

## Implementation Approach

Three phases: content fixes (text), structural additions (image + disclaimer), then cleanup (dead code removal). Each phase is independently testable.

---

## Phase 1: Fix Testimonials Text Content

### Overview

Update all text differences in the Testimonials section to match Figma.

### Changes Required:

#### 1. Testimonials heading

**File**: `src/app/components/testimonials.tsx`
**Lines**: 111-120

Change heading from:

```
Trusted by the teams building onchain asset management.
```

To (Figma source of truth):

```
Trusted by the teams building the future of onchain capital.
```

The italic purple span on "building" should remain. The rest of the text changes.

**Current code:**

```tsx
Trusted by the teams{" "}
<span className={cn("italic", isDark ? "text-[#8429FF]" : "text-[#8429FF]")}>
  building
</span>{" "}
onchain asset management.
```

**New code:**

```tsx
Trusted by the teams building the{" "}
<span className={cn("italic", isDark ? "text-[#8429FF]" : "text-[#8429FF]")}>
  future
</span>{" "}
of onchain capital.
```

Note: The italic word changes from "building" to "future".

#### 2. Testimonials subheading

**File**: `src/app/components/testimonials.tsx`
**Lines**: 132-133

Change from:

```
Leading protocols and asset managers rely on Fusion to power their onchain strategies.
```

To:

```
Leading curators, asset managers and projects rely on Fusion to power their onchain strategies.
```

#### 3. Testimonials role display format

**File**: `src/app/components/testimonials.tsx`
**Line**: 231

Change the role display from just `{t.role}` to `{t.role} • {t.company}`.

Current:

```tsx
{
  t.role;
}
```

New:

```tsx
{t.role} &bull; {t.company}
```

#### 4. Badge values

**File**: `src/app/components/testimonials.tsx`

| Person                 | Current                      | Figma (correct)               |
| ---------------------- | ---------------------------- | ----------------------------- |
| James Harris (line 31) | `$500M AUM, MiCA-Authorized` | `$500M+ AUM, MiCA-Authorized` |
| Vlad Totia (line 41)   | `$50M+ AUM`                  | `$100M+ TVM`                  |
| Nick Garcia (line 51)  | `$100M+ AUM`                 | `$100M+ TVM`                  |

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npx vitest run`

#### Manual Verification:

- [ ] Testimonials heading matches Figma exactly
- [ ] Testimonials subheading matches Figma exactly
- [ ] Each testimonial card shows "Role • Company" format
- [ ] Badge values match Figma for all three cards

**Implementation Note**: After completing this phase, pause for manual verification before proceeding.

---

## Phase 2: Add Dashboard Image & Disclaimer to TransparencyFeatures

### Overview

Add the vault overview dashboard image to the left side of the TransparencyFeatures section, and add the disclaimer text below.

### Changes Required:

#### 1. Dashboard mock image asset

**File**: `src/assets/vault-overview.png`

The image has been captured from the Figma site and saved to `src/assets/vault-overview.png`. This is a screenshot of the vault overview dashboard showing the IPOR USDC Prime vault with performance reports, historical allocation, credit markets, and deposit/withdraw UI.

#### 2. Add image to TransparencyFeatures left column

**File**: `src/app/components/transparency-features.tsx`

Replace the TODO comments (lines 43-44):

```tsx
{
  /* Left: TODO: app mock */
}
{
  /* Put vault overview page image here */
}
```

With an image element:

```tsx
{
  /* Left: Vault overview dashboard */
}
<div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center">
  <img
    src={vaultOverviewImg}
    alt="Fusion vault overview dashboard showing IPOR USDC Prime vault with performance reports, historical allocation, and credit markets"
    className="w-full max-w-[560px] rounded-2xl"
  />
</div>;
```

Add the import at the top:

```tsx
import vaultOverviewImg from "@/assets/vault-overview.png";
```

#### 3. Add disclaimer text

**File**: `src/app/components/transparency-features.tsx`

After the closing `</div>` of the flex container (line 133), add the disclaimer text:

```tsx
{
  /* Disclaimer */
}
<p
  className={cn(
    "mt-8 text-center text-[11px]",
    isDark ? "text-[#9BA3AF]/50" : "text-[#70747A]/50",
  )}
  style={{ fontFamily: "'Poppins', sans-serif" }}
>
  *Product interface shown for illustrative purposes only. Displayed values are
  simulated and do not represent actual portfolio performance, balances, or
  guaranteed returns.
</p>;
```

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npx vitest run`

#### Manual Verification:

- [ ] Dashboard image appears on the left side of TransparencyFeatures on desktop (lg+)
- [ ] Dashboard image is hidden on mobile (below lg breakpoint)
- [ ] Feature grid appears on the right side
- [ ] Disclaimer text appears below the section, centered, in small muted text
- [ ] Layout matches Figma's 50/50 split

**Implementation Note**: After completing this phase, pause for manual verification before proceeding.

---

## Phase 3: Remove DashboardMock Dead Code

### Overview

Remove the ~990-line `DashboardMock` component from `hero.tsx` and its unused imports.

### Changes Required:

#### 1. Remove DashboardMock component and unused imports

**File**: `src/app/components/hero.tsx`

- Delete lines 28-1016 (the entire `export function DashboardMock()` component)
- Remove the unused import `import imgUsdc from "@/assets/icons/usdc.png"` (line 14) — only used by DashboardMock
- Verify no other file imports `DashboardMock` before removing

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npx vitest run`
- [ ] No import errors for DashboardMock anywhere: `grep -r "DashboardMock" src/`

#### Manual Verification:

- [ ] Hero section renders identically (DashboardMock was not rendered anyway)
- [ ] File size of hero.tsx reduced by ~990 lines

---

## Testing Strategy

### Automated:

- `npm run build` — ensures no broken imports or TypeScript errors
- `npx vitest run` — ensures no test regressions

### Manual Testing Steps:

1. Run `npm run dev` and open the local site
2. Compare Testimonials section against Figma (heading, subheading, role format, badges)
3. Compare TransparencyFeatures section against Figma (dashboard image on left, features on right, disclaimer below)
4. Verify Hero section still renders correctly after DashboardMock removal
5. Check both dark and light themes
6. Check mobile responsive layout (dashboard image should hide below lg)

## References

- Original ticket: `thoughts/tickets/fsn_0004-align-to-figma.md`
- Figma source of truth: `https://fusionhome.figma.site/`
- Captured dashboard image: `src/assets/vault-overview.png`
