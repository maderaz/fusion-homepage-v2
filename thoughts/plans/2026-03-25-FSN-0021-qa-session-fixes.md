# QA Session Fixes Implementation Plan

## Overview

Apply fixes identified during QA testing: default light theme, favicon fix, secondary button/toggle color adjustments, fusion-flow illustration fixes, remove Zokyo logo, update audit text, fix footer mobile overflow, and update Build button links.

## Current State Analysis

- **Theme**: Default is viewport-dependent (desktop: dark, mobile: light) via `theme-script.astro:7`. HTML starts with `class="dark"` in `base-layout.astro:18`.
- **Favicon**: Uses wide lockup `/brand/fusion.png` (not square) via `base-head.astro:18`.
- **Secondary buttons**: 3 locations (`nav.tsx:154-166`, `hero.tsx:87-100`, `final-cta.astro:36-43`) with colors that don't match Figma specs.
- **Theme toggle**: `nav.tsx:141-151` uses `border-border` and `hover:bg-foreground/[0.06]`.
- **Fusion icon**: `fusion-flow.tsx:139-151` uses CSS filter in dark mode that may render pink on iOS.
- **Fuse boxes**: `fusion-flow.tsx:312-358` use `border-border` (#2E3137 dark) — matches spec, likely iOS rendering issue.
- **Security section**: `security.astro:14` includes Zokyo, text says "Audited by" at line 299.
- **Footer**: `footer.astro:95` has `whitespace-nowrap` causing horizontal overflow on mobile.
- **Build button links**: All 3 point to `.../quick-start-guide`, ticket wants `https://docs.ipor.io/build-on-fusion`.

## Desired End State

- Light theme is the default for all viewports (user can still toggle)
- Favicon shows a square icon in browser tabs
- Secondary buttons and theme toggle match Figma specs exactly
- Fusion icon displays correctly (purple, not pink) in both themes
- Zokyo logo removed, audit text updated
- Footer text wraps properly on mobile
- Build buttons link to correct URL

### Key Discoveries

- Button colors use CSS custom properties from `theme.css` — but we'll update button classes only, not global tokens
- The fusion icon in light mode renders fine — dark mode just needs to display the same PNG without the CSS filter
- Fuse box borders are already #2E3137 in dark mode via `border-border` — the iOS issue may not need a code fix
- Three "Start Building"/"Build" button instances exist: two in React islands (using `useTheme()`), one in Astro static component (using `dark:` variant)

## What We're NOT Doing

- Not changing global CSS custom properties in `theme.css`
- Not adding `.ico` or `apple-touch-icon` variants
- Not refactoring button styling into a shared component
- Not fixing fuse box borders (already correct, likely iOS rendering artifact)

## Implementation Approach

Four phases, each independently testable. Changes are small and surgical — class/attribute edits only, no new files.

---

## Phase 1: Theme Default & Favicon

### Overview

Make light the default theme and fix the favicon to use a square icon.

### Changes Required

#### 1. Default to light theme

**File**: `src/layouts/base-layout.astro`
**Change**: Remove `dark` from the static HTML class (line 18)

```diff
- <html lang="en" class="dark">
+ <html lang="en">
```

**File**: `src/components/theme-script.astro`
**Change**: Change fallback from viewport-based to always `'light'` (line 7)

```diff
- : (window.innerWidth < 768 ? 'light' : 'dark');
+ : 'light';
```

**File**: `src/components/use-theme.ts`
**Change**: Update SSR default from `true` (dark) to `false` (light) (line 5 area)

```diff
- typeof document === "undefined" ? true : document.documentElement.classList.contains("dark")
+ typeof document === "undefined" ? false : document.documentElement.classList.contains("dark")
```

#### 2. Fix favicon

**File**: `src/components/base-head.astro`
**Change**: Point to square icon (line 18)

```diff
- <link rel="icon" type="image/png" href="/brand/fusion.png" />
+ <link rel="icon" type="image/png" href="/icons/fusion-light.png" />
```

### Success Criteria

#### Automated Verification

- [ ] Build passes: `npm run build`
- [ ] Type checking passes: `npx astro check`

#### Manual Verification

- [ ] Fresh visit (clear localStorage) loads in light mode on desktop AND mobile
- [ ] Theme toggle still works and persists preference via localStorage
- [ ] Browser tab shows square purple icon instead of wide lockup
- [ ] No flash of dark theme before light appears

**Implementation Note**: After completing this phase, pause for manual confirmation before proceeding.

---

## Phase 2: Secondary Button & Toggle Styling

### Overview

Update the secondary "Build"/"Start Building" buttons and the theme toggle circle to match Figma specs.

### Target Colors

| Element          | Light Mode | Dark Mode |
| ---------------- | ---------- | --------- |
| Border (resting) | #9BA3AF    | #45484D   |
| Hover fill       | #EFEFEF    | #22272C   |
| Text (resting)   | #000000    | #FFFFFF   |

### Changes Required

#### 1. Nav "Build" button

**File**: `src/app/components/nav.tsx` (lines 158-162)

Replace the conditional class logic:

```tsx
isDark
  ? "border-[#45484D] text-white hover:bg-[#22272C]"
  : "border-[#9BA3AF] text-black hover:bg-[#EFEFEF]",
```

#### 2. Hero "Start Building" button

**File**: `src/app/components/hero.tsx` (lines 91-95)

Same pattern:

```tsx
isDark
  ? "border-[#45484D] text-white hover:bg-[#22272C]"
  : "border-[#9BA3AF] text-black hover:bg-[#EFEFEF]",
```

#### 3. Final CTA "Start Building" button

**File**: `src/components/final-cta.astro` (line 40)

This uses Tailwind `dark:` variant (no useTheme):

```diff
- border-muted-foreground text-black hover:bg-accent
- dark:border-border dark:text-muted-foreground dark:hover:border-muted-foreground/40 dark:hover:bg-white/5 dark:hover:text-white
+ border-[#9BA3AF] text-black hover:bg-[#EFEFEF]
+ dark:border-[#45484D] dark:text-white dark:hover:bg-[#22272C]
```

#### 4. Theme toggle button

**File**: `src/app/components/nav.tsx` (line 144)

Current: `border-border ... hover:bg-foreground/[0.06]`

The toggle is a `<button>` not an `<a>`, so it needs the `isDark` conditional approach. Currently it doesn't branch on `isDark`. Change to:

```tsx
className={cn(
  "flex items-center justify-center rounded-full border p-2 transition-all duration-300",
  isDark
    ? "border-[#45484D] text-white hover:bg-[#22272C]"
    : "border-[#9BA3AF] text-muted-foreground hover:bg-[#EFEFEF] hover:text-foreground",
)}
```

### Success Criteria

#### Automated Verification

- [ ] Build passes: `npm run build`
- [ ] Type checking passes: `npx astro check`

#### Manual Verification

- [ ] In light mode: secondary buttons show #9BA3AF border, #EFEFEF hover fill, black text
- [ ] In dark mode: secondary buttons show #45484D border, #22272C hover fill, white text
- [ ] Theme toggle has matching border/hover behavior
- [ ] Compare against Figma at https://fusionhome.figma.site/

**Implementation Note**: After completing this phase, pause for manual confirmation before proceeding.

---

## Phase 3: Fusion Flow Icon Fix

### Overview

Fix the fusion icon rendering to display the same way in dark mode as in light mode (remove the CSS filter that causes pink on iOS).

### Changes Required

#### 1. Remove dark mode CSS filter from fusion icon

**File**: `src/app/components/ui/fusion-flow.tsx` (lines 139-151)

The light mode renders the PNG as-is, which looks correct. In dark mode, a CSS filter chain attempts to recolor but renders pink on iOS. Since the user confirmed light mode is good, just remove the filter:

```diff
  <img
    src={iconFusionLight}
    alt="Fusion"
    className="h-full w-full object-contain"
-   style={
-     isDark
-       ? {
-           filter:
-             "brightness(0) saturate(100%) invert(22%) sepia(95%) saturate(5693%) hue-rotate(263deg) brightness(93%) contrast(107%)",
-         }
-       : undefined
-   }
  />
```

**Note on fuse box borders (#3 from ticket)**: The Morpho/Aave/Euler boxes already use `border-border` which resolves to #2E3137 in dark mode — the exact color requested. This is likely an iOS-specific rendering issue and requires no code change. Will verify via Playwright.

### Success Criteria

#### Automated Verification

- [ ] Build passes: `npm run build`
- [ ] Type checking passes: `npx astro check`

#### Manual Verification

- [ ] Fusion icon appears purple (#8429FF) in both light and dark modes
- [ ] Icon is visible and has sufficient contrast against the dark background
- [ ] Fuse box borders (Morpho, Aave, Euler) render correctly in dark mode on desktop

**Implementation Note**: After completing this phase, pause for manual confirmation before proceeding.

---

## Phase 4: Other Fixes

### Overview

Remove Zokyo, update audit text, fix footer mobile overflow, and update Build button links.

### Changes Required

#### 1. Remove Zokyo logo

**File**: `src/components/security.astro` (line 14)

Remove the array entry:

```diff
  const auditors = [
    { name: "BlockSec", logo: "/logos/blocksec.png" },
    { name: "Ackee Blockchain", logo: "/logos/ackee.png" },
-   { name: "Zokyo", logo: "/logos/zokyo.png" },
    { name: "Protofire", logo: "/logos/protofire.png" },
  ];
```

#### 2. Update audit text

**File**: `src/components/security.astro` (line 299)

```diff
- Audited by
+ Audited & security reviewed by
```

#### 3. Fix footer text overflow on mobile

**File**: `src/components/footer.astro` (line 95)

Remove `whitespace-nowrap` so text wraps on narrow viewports:

```diff
- class="text-[14px] whitespace-nowrap text-muted-foreground"
+ class="text-[14px] text-muted-foreground"
```

#### 4. Update Build button links

Three locations all currently point to `https://docs.ipor.io/build-on-fusion/developer-guide/quick-start-guide`. Change to `https://docs.ipor.io/build-on-fusion`.

**File**: `src/app/components/nav.tsx` (line 155)

```diff
- href="https://docs.ipor.io/build-on-fusion/developer-guide/quick-start-guide"
+ href="https://docs.ipor.io/build-on-fusion"
```

**File**: `src/app/components/hero.tsx` (line 88)

```diff
- href="https://docs.ipor.io/build-on-fusion/developer-guide/quick-start-guide"
+ href="https://docs.ipor.io/build-on-fusion"
```

**File**: `src/components/final-cta.astro` (line 37)

```diff
- href="https://docs.ipor.io/build-on-fusion/developer-guide/quick-start-guide"
+ href="https://docs.ipor.io/build-on-fusion"
```

### Success Criteria

#### Automated Verification

- [ ] Build passes: `npm run build`
- [ ] Type checking passes: `npx astro check`

#### Manual Verification

- [ ] Zokyo logo no longer appears in security section
- [ ] Text reads "Audited & security reviewed by"
- [ ] Footer tagline text wraps nicely on mobile (does not overflow horizontally)
- [ ] All "Build"/"Start Building" buttons navigate to `https://docs.ipor.io/build-on-fusion`

**Implementation Note**: After completing this phase, pause for manual confirmation.

---

## Testing Strategy

### Automated

- `npm run build` — ensures no compile/type errors
- `npx astro check` — Astro-specific diagnostics
- Playwright tests per the ticket instruction — test each fix in browser

### Manual Testing Steps

1. Clear localStorage, load site — should be light mode
2. Toggle to dark, reload — should persist dark
3. Check favicon in browser tab (square purple icon)
4. Hover over "Build" and "Start Building" buttons in both themes — verify border/fill colors
5. Hover over theme toggle — verify border/fill colors
6. Scroll to fusion-flow illustration — verify icon is purple (not pink) in both themes
7. Check fuse box borders in dark mode
8. Scroll to security section — no Zokyo, text says "Audited & security reviewed by"
9. Resize to mobile width — footer text wraps, doesn't overflow
10. Click all Build buttons — navigate to correct URL

## References

- Original ticket: `thoughts/tickets/fsn_00021-qa-session-and-fixes.md`
- Figma reference: https://fusionhome.figma.site/
