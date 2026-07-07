# Fix Fusion Flow Diagram Dark Mode Issues — Implementation Plan

## Overview

Fix 3 dark-mode-only visual bugs in the Fusion Flow diagram (`src/app/components/ui/fusion-flow.tsx`) to match the Figma reference at `fusionhome.figma.site/#how-it-works`. All changes are scoped to dark mode; light mode must have no regressions.

## Current State Analysis

The component renders a flow: Deposit → Fusion Vault → Alpha Engine (with action pills) → branching SVG → Protocol Fuse cards. It uses the `useTheme()` hook for dark/light conditional styling.

### Key Discoveries:

- Alpha Engine box uses `bg-background` (line 176), which is the same color as the page bg in dark mode (`#090E14`), causing no visual separation — Figma shows a distinct card-like background
- "Add" pill (line 219-242) and "Add New" card (line 353-378) use `rgba(255,255,255,0.1)` for `borderColor` in dark mode — nearly invisible dashed borders vs clearly visible in Figma
- Protocol fuse cards (line 308-349) use `border-border` with `bg-card` — on iOS WebKit, this can produce an unwanted white border artifact in dark mode

## Desired End State

The dark-mode rendering of the Fusion Flow diagram matches the Figma reference:

1. Alpha Engine box has a visually distinct darker background
2. "Add" and "Add New" dashed borders are clearly visible
3. No white border artifact on protocol fuse cards on iOS
4. Light mode rendering is unchanged

### Verification:

- Playwright screenshots comparing localhost dark mode vs Figma reference
- Playwright screenshots of light mode before/after confirming no regression
- Manual check on iOS Safari (or WebKit browser via Playwright)

## What We're NOT Doing

- Changing any animations, layout, or sizing
- Modifying light mode styling
- Changing the theme CSS variables
- Refactoring component structure

## Implementation Approach

All fixes are isolated to `src/app/components/ui/fusion-flow.tsx`. Each fix targets a specific element's className or inline style, conditioned on dark mode only.

## Phase 1: Fix Alpha Engine Box Background

### Overview

Change the Alpha Engine box background from `bg-background` to `bg-card` in dark mode to create visual separation from the page, matching the Figma reference.

### Changes Required:

#### 1. Alpha Engine box

**File**: `src/app/components/ui/fusion-flow.tsx`
**Line**: 176
**Current**:

```tsx
className =
  "relative w-full max-w-[420px] rounded-xl border border-border bg-background p-5";
```

**Change to**:

```tsx
className =
  "relative w-full max-w-[420px] rounded-xl border border-border bg-card p-5";
```

**Rationale**: In dark mode, `bg-card` resolves to `#161A20` (slightly lighter than `bg-background` at `#090E14`), creating the visual card-like separation visible in the Figma reference. In light mode, `bg-card` is `#FFFFFF` vs `bg-background` at `#F5F5FA` — the box will appear white (same as Figma light mode).

### Success Criteria:

#### Automated Verification:

- [ ] Build passes: `npm run build`
- [ ] No type errors: `npx astro check`

#### Manual Verification:

- [ ] Alpha Engine box background is visually distinct from page bg in dark mode
- [ ] Matches Figma reference at `fusionhome.figma.site/#how-it-works`
- [ ] Light mode appearance unchanged or improved

---

## Phase 2: Fix Dashed Border Visibility on "Add" and "Add New"

### Overview

Increase the border opacity on the "Add" pill and "Add New" card so dashed borders are clearly visible in dark mode, matching the Figma reference.

### Changes Required:

#### 1. "Add" action pill

**File**: `src/app/components/ui/fusion-flow.tsx`
**Lines**: 220-222
**Current**:

```tsx
style={{
  borderColor: isDark
    ? "rgba(255,255,255,0.1)"
    : "rgba(0,0,0,0.12)",
}}
```

**Change to**:

```tsx
style={{
  borderColor: isDark
    ? "rgba(255,255,255,0.2)"
    : "rgba(0,0,0,0.12)",
}}
```

#### 2. "Add New" fuse card

**File**: `src/app/components/ui/fusion-flow.tsx`
**Lines**: 358-360
**Current**:

```tsx
style={{
  borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
}}
```

**Change to**:

```tsx
style={{
  borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)",
}}
```

**Rationale**: Doubling the opacity from 0.1 to 0.2 makes the dashed borders clearly visible on the dark card/page backgrounds without being overly prominent. This matches the visibility level in the Figma reference.

### Success Criteria:

#### Automated Verification:

- [ ] Build passes: `npm run build`

#### Manual Verification:

- [ ] "Add" pill dashed border is visible in dark mode
- [ ] "Add New" card dashed border is visible in dark mode
- [ ] Both match Figma reference visibility
- [ ] Light mode borders unchanged

---

## Phase 3: Fix iOS White Border on Protocol Fuse Cards

### Overview

Remove the unwanted white border artifact that appears on protocol fuse cards on iOS mobile devices in dark mode.

### Changes Required:

#### 1. Protocol fuse cards

**File**: `src/app/components/ui/fusion-flow.tsx`
**Lines**: 343 (the className on the fuse card `motion.div`)
**Current**:

```tsx
className =
  "flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3";
```

**Change to**:

```tsx
className =
  "flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 [-webkit-appearance:none]";
```

If the above doesn't resolve it, an alternative approach — use explicit `borderColor` via inline style in dark mode to avoid any WebKit color resolution issues:

**Alternative — add inline style override**:

```tsx
style={{
  ...(isDark && { borderColor: "var(--border)" }),
  // existing animation styles remain
}}
```

**Note**: The animated `borderColor` keyframes (lines 314-319) cycle through `var(--border)` → purple highlight → back. On iOS, the initial render before animation kicks in may flash a default white border. Adding an explicit initial `borderColor` via the `className` should prevent this.

**Most likely fix**: The issue is in the `motion.div` animation. The `borderColor` animation (lines 314-319) starts with `"var(--border)"` as the first keyframe, but Motion may not resolve CSS variables correctly on iOS Safari's initial paint. Fix by using the resolved color value:

```tsx
borderColor: [
  "oklch(0.313 0.012 264.395)",  // --border dark value
  "oklch(0.313 0.012 264.395)",
  `oklch(${PRIMARY_OKLCH} / 0.5)`,
  "oklch(0.313 0.012 264.395)",
],
```

However, this would break light mode. Better approach — use the `isDark` conditional:

```tsx
borderColor: isDark
  ? [
      "oklch(0.313 0.012 264.395)",
      "oklch(0.313 0.012 264.395)",
      `oklch(${PRIMARY_OKLCH} / 0.5)`,
      "oklch(0.313 0.012 264.395)",
    ]
  : [
      "var(--border)",
      "var(--border)",
      `oklch(${PRIMARY_OKLCH} / 0.5)`,
      "var(--border)",
    ],
```

**Implementation Note**: Start with the simplest fix first. If the `-webkit-appearance:none` utility doesn't resolve the iOS issue, try the resolved color approach. This phase may require iterative testing on an actual iOS device.

### Success Criteria:

#### Automated Verification:

- [ ] Build passes: `npm run build`
- [ ] No type errors: `npx astro check`

#### Manual Verification:

- [ ] No white border visible on protocol fuse cards on iOS Safari (dark mode)
- [ ] Border highlight animation still works correctly
- [ ] Light mode fuse cards unchanged
- [ ] Desktop browsers unaffected

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the iOS testing was successful before proceeding to the next phase.

---

## Phase 4: Verification

### Overview

Full comparison of localhost vs Figma reference, plus light mode regression check.

### Steps:

1. Use Playwright to capture dark mode screenshots of localhost `#how-it-works` section
2. Compare side-by-side with Figma reference screenshots (already captured at `/tmp/figma-alpha-fuses.png` and `/tmp/figma-flow-full.png`)
3. Capture light mode screenshots of localhost before/after
4. Run Playwright with WebKit engine to simulate iOS rendering

### Success Criteria:

#### Automated Verification:

- [ ] Build passes: `npm run build`
- [ ] Astro check passes: `npx astro check`
- [ ] All existing tests pass: `npm test`

#### Manual Verification:

- [ ] Dark mode flow diagram matches Figma reference
- [ ] Light mode flow diagram has no regressions
- [ ] iOS Safari shows no white borders on fuse cards
- [ ] All animations still work correctly

## Testing Strategy

### Visual Testing (Playwright):

- Dark mode: Compare Alpha Engine bg, dashed borders, fuse card borders vs Figma
- Light mode: Before/after comparison to confirm no regression
- WebKit engine: Simulate iOS rendering for border artifact check

### Manual Testing Steps:

1. Open `http://localhost:4321/#how-it-works` in dark mode
2. Verify Alpha Engine box has distinct background
3. Verify "Add" pill and "Add New" card show visible dashed borders
4. Open on iOS device (or Safari responsive mode) — verify no white borders on fuse cards
5. Switch to light mode — verify all elements look correct

## References

- Original ticket: `thoughts/tickets/fsn_00025-fusion-flow-diagram.md`
- Figma reference: `https://fusionhome.figma.site/#how-it-works`
- Component: `src/app/components/ui/fusion-flow.tsx`
- Theme CSS: `src/styles/theme.css`
- Figma screenshot (dark mode, zoomed): `/tmp/figma-alpha-fuses.png`
- Localhost screenshot (dark mode, zoomed): `/tmp/local-alpha-fuses.png`
