# CSS, Tailwind & shadcn Theme Overhaul — Implementation Plan

## Overview

Overhaul the Fusion website's styling to follow shadcn/Tailwind v4 best practices: initialize shadcn properly, convert all colors to OKLCH with semantic tokens, eliminate 253 inline `style=` attributes and 300+ arbitrary hex color values, set Poppins as the default font, and add a copyable shadcn theme snippet to the brand guidelines page. This unblocks FSN-0003 (CSP) by removing the need for `'unsafe-inline'` in `style-src`.

## Current State Analysis

### What Exists

- Tailwind CSS v4 with CSS-first config (no `tailwind.config.js`)
- Theme variables in `src/styles/theme.css` already follow shadcn naming (`--background`, `--foreground`, `--primary`, etc.)
- Hand-rolled `cn()` utility at `src/app/components/ui/utils.ts`
- `tw-animate-css` installed
- `@custom-variant dark (&:is(.dark *))` already configured
- `@theme inline` block already maps CSS vars to Tailwind tokens
- No `components.json` — shadcn is not officially initialized

### What's Wrong

- **`--primary` is wrong**: Light mode `--primary: #030213` (near-black) — should be brand purple `#8429FF`
- **253 inline `style=` attributes** across 21 files — blocks CSP, most are `fontFamily: "'Poppins', sans-serif"` which should be the body default
- **300+ arbitrary hex color values** in Tailwind classes (`text-[#8429FF]`, `bg-[#090E14]`, etc.) — should be semantic tokens
- **Mixed color formats**: some OKLCH, some hex, some rgba — inconsistent
- **No font CSS variables**: fonts are applied per-element via inline styles instead of CSS `--font-sans`
- **`csp-style-fix.ts` workaround**: strips style hashes from CSP meta tag because inline styles need `'unsafe-inline'`
- **React components use `isDark ?` ternaries** for every color — semantic tokens with `dark:` variants eliminate all of these

### Key Discoveries

- `body` already has `style="font-family: 'Poppins', sans-serif;"` at `base-layout.astro:22` — moving this to CSS as `--font-sans` removes ~60% of inline style occurrences
- The brand purple `#8429FF` and gradient endpoint `#6C00FF` appear in 8+ files as hardcoded hex in both inline styles and arbitrary Tailwind values
- `brand-guidelines-page.tsx` alone has 87 inline style occurrences — largest single file
- React components using `isDark ? "text-[#9BA3AF]" : "text-[#70747A]"` can become just `text-muted-foreground` — massive simplification
- Current `csp-style-fix.ts` (`src/integrations/csp-style-fix.ts`) exists solely because of inline styles — removable after migration

## Desired End State

- shadcn properly initialized with `components.json`
- All CSS variables use OKLCH with hex comments for readability
- All 22 design system colors are semantic tokens (no arbitrary hex in classes)
- Zero inline `style=` attributes for font-family, font-weight, or colors
- `clamp()` fluid typography uses `text-[clamp(...)]` arbitrary value syntax (acceptable)
- SVG `width`/`height` from props remain as inline styles (acceptable)
- Brand guidelines page includes a copyable shadcn theme CSS snippet
- `csp-style-fix.ts` removed, `'unsafe-inline'` removed from CSP `style-src`
- Build passes with no regressions

### Verification

1. `npm run build` succeeds
2. `npm test` passes
3. `npm run lint` passes
4. `grep -r 'style=' src/ | grep -v 'node_modules'` returns only acceptable cases (SVG size, CSS custom properties, clamp values, dynamic computed values)
5. No `text-[#`, `bg-[#`, `border-[#` patterns remain for the 22 design system colors
6. All 4 pages render correctly in both dark and light modes
7. `csp-style-fix.ts` is removed and CSP works without `'unsafe-inline'` in `style-src`

## What We're NOT Doing

- Adding shadcn component primitives (Button, Card, Dialog, etc.) — just initializing the system
- Changing visual appearance — all colors, spacing, and typography should look identical
- Self-hosting Google Fonts
- Restructuring component architecture or file organization
- Adding new pages or sections
- Touching `csp/*.customHttp.yml` Amplify headers

## OKLCH Color Conversion Reference

All conversions performed deterministically via Node.js sRGB→linearRGB→OKLab→OKLCH math.

### Design System Palette

| Hex       | OKLCH                        | Role                        |
| --------- | ---------------------------- | --------------------------- |
| `#8429FF` | `oklch(0.551 0.278 293.978)` | Brand purple / primary      |
| `#6C00FF` | `oklch(0.51 0.293 287.347)`  | Purple gradient endpoint    |
| `#A37FFF` | `oklch(0.688 0.183 294.018)` | Light purple                |
| `#6D28D9` | `oklch(0.491 0.241 292.581)` | Dark purple (glow)          |
| `#a78bfa` | `oklch(0.709 0.159 293.541)` | Lighter purple (glow)       |
| `#090E14` | `oklch(0.161 0.015 253.142)` | Dark page background        |
| `#0C0C0F` | `oklch(0.156 0.006 285.642)` | Dark subtle bg              |
| `#161A20` | `oklch(0.216 0.013 258.369)` | Dark card/surface           |
| `#1A1F26` | `oklch(0.237 0.015 256.809)` | Dark hover surface          |
| `#22272C` | `oklch(0.27 0.012 248.263)`  | Dark nav hover bg           |
| `#2E3137` | `oklch(0.313 0.012 264.395)` | Dark border                 |
| `#45484D` | `oklch(0.401 0.009 260.724)` | Dark secondary border       |
| `#000000` | `oklch(0 0 0)`               | Pure black                  |
| `#F5F5FA` | `oklch(0.972 0.007 286.276)` | Light page background       |
| `#E9E9F3` | `oklch(0.937 0.013 286.138)` | Light section background    |
| `#E5E5E5` | `oklch(0.922 0 0)`           | Light border                |
| `#EFEFEF` | `oklch(0.952 0 0)`           | Light hover bg              |
| `#F5F5F7` | `oklch(0.971 0.003 286.35)`  | Light header bg             |
| `#F3F0FF` | `oklch(0.962 0.02 295.191)`  | Light purple icon bg        |
| `#FFFFFF` | `oklch(1 0 0)`               | Pure white                  |
| `#9BA3AF` | `oklch(0.713 0.02 258.363)`  | Muted text dark             |
| `#70747A` | `oklch(0.558 0.01 258.352)`  | Muted text light            |
| `#374151` | `oklch(0.373 0.031 259.733)` | Card body text light        |
| `#D4D4D8` | `oklch(0.871 0.005 286.286)` | Card body text dark         |
| `#52525B` | `oklch(0.442 0.015 285.786)` | Subtle text dark            |
| `#E5E7EB` | `oklch(0.928 0.006 264.531)` | Gray divider                |
| `#F0F0F5` | `oklch(0.957 0.007 286.273)` | Light hover bg (trust-bar)  |
| `#F9F9FB` | `oklch(0.983 0.003 286.351)` | Light hover bg (comparison) |
| `#006EF2` | `oklch(0.568 0.216 258.546)` | IPOR DAO blue               |
| `#0023E3` | `oklch(0.434 0.273 264.202)` | IPOR DAO blue gradient      |
| `#3D88FF` | `oklch(0.642 0.192 259.427)` | IPOR DAO light blue         |
| `#2675CA` | `oklch(0.56 0.151 253.633)`  | Chainlink blue              |
| `#d4183d` | `oklch(0.558 0.214 19.4)`    | Destructive red             |

### Code Block Colors

| Hex       | OKLCH                        | Token                  |
| --------- | ---------------------------- | ---------------------- |
| `#fafafa` | `oklch(0.985 0 0)`           | `--code-bg` light      |
| `#9ca3af` | `oklch(0.714 0.019 261.325)` | `--code-comment` light |
| `#7c3aed` | `oklch(0.541 0.247 293.009)` | `--code-keyword` light |
| `#16a34a` | `oklch(0.627 0.17 149.214)`  | `--code-string` light  |
| `#2563eb` | `oklch(0.546 0.215 262.881)` | `--code-type` light    |
| `#d97706` | `oklch(0.666 0.157 58.318)`  | `--code-event` light   |
| `#4a5568` | `oklch(0.447 0.034 261.324)` | `--code-comment` dark  |
| `#c084fc` | `oklch(0.722 0.177 305.504)` | `--code-keyword` dark  |
| `#86efac` | `oklch(0.871 0.136 154.449)` | `--code-string` dark   |
| `#93c5fd` | `oklch(0.809 0.096 251.813)` | `--code-type` dark     |
| `#fde68a` | `oklch(0.924 0.115 95.746)`  | `--code-event` dark    |

## Implementation Approach

Six phases, each independently testable. The critical insight: replacing `isDark ? "text-[#9BA3AF]" : "text-[#70747A]"` with `text-muted-foreground` (and similar) massively simplifies React components by eliminating the `useTheme()` dependency for styling in many cases.

---

## Phase 1: Install shadcn Tooling

### Overview

Install the shadcn Claude Code skill for AI-assisted development and initialize shadcn in the project to create `components.json`.

### Changes Required:

#### 1. Install shadcn skill for Claude Code

Run:

```bash
pnpm dlx skills add shadcn/ui
```

This creates `.claude/skills/shadcn/SKILL.md` — commit to git.

#### 2. Add shadcn MCP server (optional, for component browsing)

```bash
claude mcp add shadcn -- npx shadcn@latest mcp
```

#### 3. Initialize shadcn

Run:

```bash
npx shadcn@latest init
```

Configuration answers:

- Style: `new-york`
- Base color: `neutral` (we override everything in theme.css)
- CSS file: `src/styles/theme.css`
- Tailwind config: (empty — Tailwind v4, no config file)
- Components alias: `@/app/components/ui`
- Utils alias: `@/app/components/ui` (we already have `utils.ts` there)
- React Server Components: `no` (Astro)
- Icon library: `lucide` (already installed)

**Expected output**: Creates `components.json` in project root. May modify `theme.css` — if so, revert those changes and keep our manual restructuring in Phase 2.

#### 4. Verify components.json

The generated `components.json` should look like:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/theme.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/app/components",
    "utils": "@/app/components/ui",
    "ui": "@/app/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Success Criteria:

#### Automated Verification:

- [ ] `components.json` exists in project root
- [ ] `.claude/skills/shadcn/SKILL.md` exists
- [ ] `npm run build` succeeds
- [ ] `npm test` passes

#### Manual Verification:

- [ ] Site renders identically (no visual changes from this phase)

**Implementation Note**: After completing this phase, pause for manual verification. If `shadcn init` modifies `theme.css`, revert those CSS changes — Phase 2 does the theme restructuring.

---

## Phase 2: Restructure theme.css

### Overview

Convert all theme variables to OKLCH, remap `--primary` to brand purple, add font system variables, and add missing design tokens. Every OKLCH value gets a hex comment for readability.

### Changes Required:

#### 1. Rewrite `src/styles/theme.css`

Replace the entire file content. The new version:

- Converts all values to OKLCH with `/* hex */` comments
- Maps `--primary` to brand purple (`#8429FF`)
- Adds `--font-sans`, `--font-mono`, `--font-data` CSS variables
- Adds custom tokens: `--brand-gradient-start`, `--brand-gradient-end`, `--body-foreground`
- Keeps all existing code-_ and footer-gradient-_ tokens (converted to OKLCH where applicable)
- Sets `body { font-family: var(--font-sans); }` in `@layer base`

**New `:root` block** (key changes from current):

```css
:root {
  --font-sans: "Poppins", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-data: "Source Sans Pro", sans-serif;
  --font-size: 16px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;

  --background: oklch(0.972 0.007 286.276); /* #F5F5FA */
  --foreground: oklch(0 0 0); /* #000000 */
  --card: oklch(1 0 0); /* #FFFFFF */
  --card-foreground: oklch(0 0 0); /* #000000 */
  --popover: oklch(1 0 0); /* #FFFFFF */
  --popover-foreground: oklch(0 0 0); /* #000000 */
  --primary: oklch(0.551 0.278 293.978); /* #8429FF */
  --primary-foreground: oklch(1 0 0); /* #FFFFFF */
  --secondary: oklch(0.962 0.02 295.191); /* #F3F0FF */
  --secondary-foreground: oklch(0.551 0.278 293.978); /* #8429FF */
  --muted: oklch(0.937 0.013 286.138); /* #E9E9F3 */
  --muted-foreground: oklch(0.558 0.01 258.352); /* #70747A */
  --accent: oklch(0.952 0 0); /* #EFEFEF */
  --accent-foreground: oklch(0 0 0); /* #000000 */
  --destructive: oklch(0.558 0.214 19.4); /* #d4183d */
  --destructive-foreground: oklch(1 0 0); /* #FFFFFF */
  --border: oklch(0.922 0 0); /* #E5E5E5 */
  --input: transparent;
  --ring: oklch(0.551 0.278 293.978); /* #8429FF */
  --radius: 0.625rem;

  /* Brand gradient endpoints */
  --brand-gradient-start: oklch(0.551 0.278 293.978); /* #8429FF */
  --brand-gradient-end: oklch(0.51 0.293 287.347); /* #6C00FF */

  /* Body text (between foreground and muted-foreground) */
  --body-foreground: oklch(0.373 0.031 259.733); /* #374151 */

  /* Chart colors (unchanged) */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);

  /* Sidebar (unchanged) */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.551 0.278 293.978); /* #8429FF */
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);

  /* Code block colors */
  --code-bg: oklch(0.985 0 0); /* #fafafa */
  --code-border: oklch(0.922 0 0); /* #e5e5e5 */
  --code-comment: oklch(0.714 0.019 261.325); /* #9ca3af */
  --code-keyword: oklch(0.541 0.247 293.009); /* #7c3aed */
  --code-string: oklch(0.627 0.17 149.214); /* #16a34a */
  --code-type: oklch(0.546 0.215 262.881); /* #2563eb */
  --code-text: oklch(0.373 0.031 259.733); /* #374151 */
  --code-punct: oklch(0.714 0.019 261.325); /* #9ca3af */
  --code-event: oklch(0.666 0.157 58.318); /* #d97706 */
  --code-header-bg: oklch(0.551 0.278 293.978 / 0.05); /* #8429FF at 5% */
  --code-dot-1: oklch(0.551 0.278 293.978 / 0.2); /* #8429FF at 20% */
  --code-dot-2: oklch(0.551 0.278 293.978 / 0.12); /* #8429FF at 12% */
  --code-dot-3: oklch(0.551 0.278 293.978 / 0.06); /* #8429FF at 6% */
  --code-link-color: oklch(0.558 0.01 258.352); /* #70747a */
  --code-link-border: oklch(0.922 0 0); /* #e5e5e5 */

  /* Footer gradients (keep as-is, use oklch for the color stops) */
  --footer-gradient-1: radial-gradient(
    ellipse 80% 60% at 50% 100%,
    oklch(0.551 0.278 293.978 / 0.06) 0%,
    transparent 70%
  );
  --footer-gradient-2: radial-gradient(
    ellipse 50% 40% at 30% 80%,
    oklch(0.551 0.278 293.978 / 0.04) 0%,
    transparent 60%
  );
}
```

**New `.dark` block**:

```css
.dark {
  --background: oklch(0.161 0.015 253.142); /* #090E14 */
  --foreground: oklch(1 0 0); /* #FFFFFF */
  --card: oklch(0.216 0.013 258.369); /* #161A20 */
  --card-foreground: oklch(1 0 0); /* #FFFFFF */
  --popover: oklch(0.216 0.013 258.369); /* #161A20 */
  --popover-foreground: oklch(1 0 0); /* #FFFFFF */
  --primary: oklch(0.551 0.278 293.978); /* #8429FF */
  --primary-foreground: oklch(1 0 0); /* #FFFFFF */
  --secondary: oklch(0.551 0.278 293.978 / 0.15); /* #8429FF at 15% */
  --secondary-foreground: oklch(0.551 0.278 293.978); /* #8429FF */
  --muted: oklch(0 0 0); /* #000000 */
  --muted-foreground: oklch(0.713 0.02 258.363); /* #9BA3AF */
  --accent: oklch(0.237 0.015 256.809); /* #1A1F26 */
  --accent-foreground: oklch(1 0 0); /* #FFFFFF */
  --destructive: oklch(0.558 0.214 19.4); /* #d4183d */
  --destructive-foreground: oklch(1 0 0); /* #FFFFFF */
  --border: oklch(0.313 0.012 264.395); /* #2E3137 */
  --input: oklch(0.313 0.012 264.395); /* #2E3137 */
  --ring: oklch(0.551 0.278 293.978); /* #8429FF */

  --brand-gradient-start: oklch(0.551 0.278 293.978); /* #8429FF */
  --brand-gradient-end: oklch(0.51 0.293 287.347); /* #6C00FF */

  --body-foreground: oklch(0.871 0.005 286.286); /* #D4D4D8 */

  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);

  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.551 0.278 293.978); /* #8429FF */
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);

  --code-bg: oklch(0.216 0.013 258.369); /* #161a20 */
  --code-border: oklch(0.313 0.012 264.395); /* #2e3137 */
  --code-comment: oklch(0.447 0.034 261.324); /* #4a5568 */
  --code-keyword: oklch(0.722 0.177 305.504); /* #c084fc */
  --code-string: oklch(0.871 0.136 154.449); /* #86efac */
  --code-type: oklch(0.809 0.096 251.813); /* #93c5fd */
  --code-text: oklch(0.871 0.005 286.286); /* #d4d4d8 */
  --code-punct: oklch(0.713 0.02 258.363); /* #9ba3af */
  --code-event: oklch(0.924 0.115 95.746); /* #fde68a */
  --code-header-bg: oklch(0.709 0.159 293.541 / 0.06); /* #a78bfa at 6% */
  --code-dot-1: oklch(0.551 0.278 293.978 / 0.25); /* #8429FF at 25% */
  --code-dot-2: oklch(0.551 0.278 293.978 / 0.15); /* #8429FF at 15% */
  --code-dot-3: oklch(0.551 0.278 293.978 / 0.08); /* #8429FF at 8% */
  --code-link-color: oklch(0.713 0.02 258.363); /* #9ba3af */
  --code-link-border: oklch(0.313 0.012 264.395); /* #2e3137 */

  --footer-gradient-1: radial-gradient(
    ellipse 80% 60% at 50% 100%,
    oklch(0.709 0.159 293.541 / 0.08) 0%,
    transparent 70%
  );
  --footer-gradient-2: radial-gradient(
    ellipse 50% 40% at 30% 80%,
    oklch(0.709 0.159 293.541 / 0.05) 0%,
    transparent 60%
  );
}
```

**Updated `@theme inline` block** — add new tokens:

```css
@theme inline {
  /* Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-body-foreground: var(--body-foreground);
  --color-brand-gradient-start: var(--brand-gradient-start);
  --color-brand-gradient-end: var(--brand-gradient-end);

  /* Fonts */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-data: var(--font-data);

  /* Radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Sidebar */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
```

**Updated `@layer base` block**:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground font-sans;
  }

  html {
    font-size: var(--font-size);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h2 {
    font-size: var(--text-xl);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h3 {
    font-size: var(--text-lg);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h4 {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  label {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  button {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  input {
    font-size: var(--text-base);
    font-weight: var(--font-weight-normal);
    line-height: 1.5;
  }
}
```

#### 2. Remove inline font-family from base-layout

**File**: `src/layouts/base-layout.astro`
**Change**: Remove `style="font-family: 'Poppins', sans-serif;"` from `<body>` tag (now handled by `font-sans` in `@layer base`).

```diff
- <body style="font-family: 'Poppins', sans-serif;">
+ <body>
```

#### 3. Update scrollbar colors in index.css

**File**: `src/styles/index.css`
**Change**: Replace `rgba()` scrollbar colors with OKLCH equivalents using primary token.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] All CSS variables are defined in OKLCH format with hex comments: `grep -c 'oklch' src/styles/theme.css` shows increased count
- [ ] No raw hex values remain in `:root` or `.dark` blocks (except inside comments)

#### Manual Verification:

- [ ] Site renders identically in both dark and light modes on all 4 pages
- [ ] Fonts render correctly (Poppins body, Source Sans Pro numbers, JetBrains Mono code)
- [ ] Colors are visually identical to before (OKLCH conversion is lossless for sRGB gamut)
- [ ] Code blocks in security section render with correct syntax highlighting colors

**Implementation Note**: After this phase, the visual appearance should be identical. If any colors shift perceptibly, adjust the OKLCH values. Pause for manual verification before proceeding.

---

## Phase 3: Migrate Components to Semantic Tokens

### Overview

Replace all arbitrary hex color values (`text-[#8429FF]`, `bg-[#090E14]`, etc.) with semantic token classes (`text-primary`, `bg-background`, etc.), and remove inline `style=` attributes for font-family, font-weight, colors, and other properties that can be Tailwind classes. This is the largest phase — 300+ arbitrary color replacements and 253 inline style removals across 21 files.

### Token Mapping

Every arbitrary hex color maps to a semantic token. The key insight: where components currently use `isDark ? "text-[#9BA3AF]" : "text-[#70747A]"`, this becomes simply `text-muted-foreground` because the CSS variable already handles dark/light switching.

| Current Pattern                                         | Replacement                                       | Notes                      |
| ------------------------------------------------------- | ------------------------------------------------- | -------------------------- |
| `text-[#8429FF]`                                        | `text-primary`                                    |                            |
| `bg-[#8429FF]`                                          | `bg-primary`                                      |                            |
| `border-[#8429FF]`                                      | `border-primary`                                  |                            |
| `bg-[#8429FF]/10`, `bg-[#8429FF]/15`, `bg-[#8429FF]/20` | `bg-primary/10`, `bg-primary/15`, `bg-primary/20` | Opacity modifier preserved |
| `hover:border-[#8429FF]/30`, `/40`                      | `hover:border-primary/30`, `/40`                  |                            |
| `isDark ? "text-[#9BA3AF]" : "text-[#70747A]"`          | `text-muted-foreground`                           | Eliminates ternary         |
| `isDark ? "bg-[#090E14]" : "bg-[#F5F5FA]"`              | `bg-background`                                   | Eliminates ternary         |
| `isDark ? "bg-[#161A20]" : "bg-white"`                  | `bg-card`                                         | Eliminates ternary         |
| `isDark ? "border-[#2E3137]" : "border-[#E5E5E5]"`      | `border-border`                                   | Eliminates ternary         |
| `text-[#000000]` (light heading)                        | `text-foreground`                                 | With dark: already handled |
| `isDark ? "bg-[#000000]" : "bg-[#E9E9F3]"`              | `bg-muted`                                        |                            |
| `isDark ? "hover:bg-[#1A1F26]" : "hover:bg-[#EFEFEF]"`  | `hover:bg-accent`                                 |                            |
| `isDark ? "text-[#374151]" : "text-[#D4D4D8]"`          | `text-body-foreground`                            | Custom token               |
| `bg-[#F3F0FF]` (light) / `bg-[#8429FF]/15` (dark)       | `bg-secondary`                                    |                            |
| `bg-[#8429FF]/[0.03]`, `bg-[#8429FF]/[0.07]`            | `bg-primary/[0.03]`, `bg-primary/[0.07]`          |                            |

**Inline style removals:**

| Current                                                                      | Replacement                                                                                                             | Notes                            |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `style={{ fontFamily: "'Poppins', sans-serif" }}`                            | Remove entirely                                                                                                         | Inherited from body              |
| `style="font-family: 'Poppins', sans-serif;"`                                | Remove entirely                                                                                                         | Inherited from body              |
| `style={{ fontFamily: "'Source Sans Pro', sans-serif" }}`                    | `className="font-data"`                                                                                                 |                                  |
| `style={{ fontFamily: "'JetBrains Mono', ..." }}`                            | `className="font-mono"`                                                                                                 |                                  |
| `style={{ fontWeight: 500 }}`                                                | `className="font-medium"`                                                                                               |                                  |
| `style={{ fontWeight: 600 }}`                                                | `className="font-semibold"`                                                                                             |                                  |
| `style={{ fontWeight: 400 }}`                                                | Remove (default) or `className="font-normal"`                                                                           |                                  |
| `style={{ lineHeight: 1.5 }}`                                                | `className="leading-normal"`                                                                                            |                                  |
| `style={{ lineHeight: 1.6 }}`                                                | `className="leading-relaxed"`                                                                                           |                                  |
| `style={{ lineHeight: 1.7 }}`                                                | `className="leading-relaxed"`                                                                                           | Close enough, or `leading-[1.7]` |
| `style={{ lineHeight: 1.8 }}`                                                | `className="leading-[1.8]"`                                                                                             | Arbitrary value (acceptable)     |
| `style={{ letterSpacing: "0.04em" }}`                                        | `className="tracking-wide"` or `tracking-[0.04em]`                                                                      |                                  |
| `style={{ fontSize: "clamp(30px, 5vw, 60px)" }}`                             | `className="text-[clamp(30px,5vw,60px)]"`                                                                               | Arbitrary value (acceptable)     |
| `style={{ background: "linear-gradient(90deg, #8429FF 0%, #6C00FF 100%)" }}` | `className="bg-linear-to-r from-brand-gradient-start to-brand-gradient-end"` or keep as `style` with `var()` references | See gradient strategy below      |

**Gradient strategy**: The brand gradient `linear-gradient(90deg, #8429FF 0%, #6C00FF 100%)` appears in 6+ files. Options:

1. Use Tailwind v4's `bg-linear-to-r from-brand-gradient-start to-brand-gradient-end`
2. Define a CSS utility class `.brand-gradient { background: linear-gradient(90deg, var(--brand-gradient-start), var(--brand-gradient-end)); }`
3. Keep as inline style but reference CSS variables

**Recommended**: Option 2 — add `.brand-gradient` utility class in `@layer utilities` in `index.css`. Used via `className="brand-gradient"`.

**Items that remain as inline styles** (acceptable):

- `style={{ width: size, height: size }}` on SVG icons in `fusion-icons.tsx` — dynamic from props
- `style={{ transformOrigin: "24px 24px" }}` on SVG elements — no Tailwind equivalent
- `style={{ fontSize: "clamp(...)" }}` → moved to `className="text-[clamp(...)]"` where possible
- `style={{ height: "${computed}px" }}` in `trust-bar.astro` — dynamic computed value
- CSS custom properties in `glowing-effect.tsx` — these are CSS custom properties, not standard styles
- `style={{ background: gradient || color }}` in `brand-guidelines-page.tsx` color swatches — dynamic values from props
- Dynamic `element.style.opacity` mutations from `onMouseEnter`/`onMouseLeave` handlers

### File-by-File Migration Guide

Process each file: (1) replace arbitrary hex colors with tokens, (2) remove inline styles, (3) simplify `isDark` ternaries. After each file, verify `npm run build` still passes.

#### Tier 1 — Quick wins (7 files, ~30 changes total)

| File                       | Inline styles | Arbitrary colors | Key changes                                                                                             |
| -------------------------- | ------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| `base-layout.astro`        | 1→0           | 0                | Remove body font-family (done in Phase 2)                                                               |
| `index.astro`              | 1→1           | 1→0              | Replace `bg-[#F5F5FA]`/`dark:bg-[#090E14]` → `bg-background`. Keep SVG data URI background (acceptable) |
| `trust-bar.astro`          | 3→0           | ~8→0             | Remove font-family, replace hex colors, simplify borders                                                |
| `final-cta.astro`          | 3→0           | ~8→0             | Remove font-family, gradient → `brand-gradient` class, replace colors                                   |
| `cookie-banner-island.tsx` | 5→0           | ~12→0            | Remove font-family/weight, gradient → `brand-gradient`, replace colors, eliminate `isDark` ternaries    |
| `terms-of-use-page.tsx`    | 6→1           | ~8→0             | Remove font-family/weight, keep clamp fontSize. Replace `isDark` ternaries                              |
| `privacy-policy-page.tsx`  | 6→1           | ~8→0             | Same pattern as terms-of-use                                                                            |

#### Tier 2 — Medium components (6 files, ~80 changes total)

| File                          | Inline styles | Arbitrary colors | Key changes                                                                                                                                     |
| ----------------------------- | ------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `how-it-works.tsx`            | 4→1           | ~15→0            | Remove font-family/weight, keep clamp. Replace colors                                                                                           |
| `benefits.tsx`                | 5→1           | ~15→0            | Same pattern. Replace `bg-[#F3F0FF]` → `bg-secondary`                                                                                           |
| `solutions.tsx`               | 5→1           | ~15→0            | Same pattern                                                                                                                                    |
| `nav.tsx`                     | 5→0           | ~20→0            | Remove font-family/weight, gradient → `brand-gradient`. Eliminate most `isDark` ternaries. Keep `onMouseEnter`/`onMouseLeave` opacity mutations |
| `testimonials.astro`          | 7→2           | ~20→0            | Remove font-family, keep clamp. Replace all hex colors                                                                                          |
| `transparency-features.astro` | 10→2          | ~20→0            | Remove font-family/weight, keep clamp. Replace colors                                                                                           |

#### Tier 3 — Large components (5 files, ~100 changes total)

| File                   | Inline styles | Arbitrary colors | Key changes                                                                                                                            |
| ---------------------- | ------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `security.astro`       | 11→3          | ~15→0            | Remove font-family, keep code block special fonts (JetBrains Mono). Code colors already use `var(--code-*)` — those inline styles stay |
| `comparison-table.tsx` | 12→1          | ~40→0            | Remove font-family/weight, keep clamp. Replace all hex colors — this file has the most arbitrary color values                          |
| `footer.astro`         | 15→0          | ~20→0            | Remove font-family/weight. Footer gradients already use `var()`                                                                        |
| `footer.tsx`           | 14→0          | ~20→0            | Remove font-family/weight, replace radial-gradient hardcoded rgba with CSS vars. Eliminate `isDark` ternaries                          |
| `hero.tsx`             | 15→2          | ~20→0            | Remove font-family/weight, gradient → `brand-gradient`, keep clamp and mask/filter. Replace all hex colors                             |

#### Tier 4 — UI primitives (3 files, ~44 changes total)

| File                 | Inline styles | Arbitrary colors | Key changes                                                                                                                                                                                                                                        |
| -------------------- | ------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fusion-icons.tsx`   | 20→20         | 0                | **No changes** — all 20 styles are `{ width: size, height: size }` from props + SVG `transformOrigin`. These must stay as inline styles                                                                                                            |
| `fusion-flow.tsx`    | 23→~10        | 0                | Replace hardcoded hex color variables (lines 51-58) with CSS variable reads: `getComputedStyle(document.documentElement).getPropertyValue('--background')` or use Tailwind classes where possible. Some inline styles for dynamic layout must stay |
| `glowing-effect.tsx` | 1→1           | 0                | **Keep** — the single style sets CSS custom properties (`--blur`, `--gradient`, etc.). But replace hardcoded hex colors in the `--gradient` value (`#a78bfa`, `#8429FF`, `#6C00FF`, `#6D28D9`) with `var(--primary)` and related tokens            |

#### Tier 5 — Brand guidelines page (1 file, ~87 inline + ~100 arbitrary)

| File                        | Inline styles | Arbitrary colors | Key changes                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------- | ------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `brand-guidelines-page.tsx` | 87→~15        | ~100→0           | Remove Poppins font-family spreads (all `...poppins` spreads become unnecessary). Replace `...sourceSans` with `font-data` class, `...jetbrains` with `font-mono` class. Replace all hex colors with tokens. Keep dynamic swatch colors from props. The 3 font constant objects (`poppins`, `sourceSans`, `jetbrains`) at line 144-146 can be removed. Many `isDark` ternaries eliminated |

**Note on brand-guidelines-page.tsx**: This file is ~1656 lines with 87 inline style occurrences and the heaviest arbitrary color usage. It will be the most labor-intensive file. It also needs Phase 4 changes (adding the theme snippet section), so those should be done together.

### Brand Gradient Utility Class

**File**: `src/styles/index.css`
**Add** after the imports:

```css
@utility brand-gradient {
  background: linear-gradient(
    90deg,
    var(--brand-gradient-start),
    var(--brand-gradient-end)
  );
}
```

This enables `className="brand-gradient"` across all components.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] Zero `text-[#`, `bg-[#`, `border-[#` patterns for the 22 design system hex colors: verify with `grep -rn 'text-\[#\|bg-\[#\|border-\[#' src/ | grep -v node_modules | grep -v '.md'` — should return zero matches for design system colors
- [ ] Inline style count reduced: `grep -rn 'style=' src/ --include='*.tsx' --include='*.astro' | wc -l` shows significant reduction from 253

#### Manual Verification:

- [ ] All 4 pages render identically in both dark and light modes
- [ ] Theme toggle works correctly on all pages
- [ ] Hover effects work (buttons, cards, links)
- [ ] Animations still work (Motion components, fusion-flow, marquee)
- [ ] Code block in security section renders correctly
- [ ] Cookie banner renders correctly in both themes

**Implementation Note**: This is the largest phase. Migrate tier by tier, running `npm run build` after each file. Pause for manual verification after completing all tiers.

---

## Phase 4: Add Theme Code Snippet to Brand Guidelines Page

### Overview

Add a new section to the brand guidelines page that displays a copyable shadcn/Tailwind v4 theme CSS snippet. This lets external developers copy-paste the Fusion theme into their own projects, similar to [tweakcn.com/editor/theme](https://tweakcn.com/editor/theme).

### Changes Required:

#### 1. Create theme snippet data

The snippet should be the actual CSS that makes a shadcn/Tailwind v4 project use the Fusion theme. It should include:

- `@custom-variant dark` declaration
- `:root {}` block with all semantic color tokens in OKLCH
- `.dark {}` block with dark mode overrides
- `@theme inline {}` block mapping variables to Tailwind tokens
- `@layer base {}` block with base styles

**The snippet is derived from the actual `theme.css`** — strip the project-specific tokens (code-_, footer-gradient-_, sidebar-\*) and keep only the standard shadcn tokens + brand tokens + font configuration.

The exportable theme snippet (what developers copy):

```css
@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.972 0.007 286.276); /* #F5F5FA */
  --foreground: oklch(0 0 0); /* #000000 */
  --card: oklch(1 0 0); /* #FFFFFF */
  --card-foreground: oklch(0 0 0); /* #000000 */
  --popover: oklch(1 0 0); /* #FFFFFF */
  --popover-foreground: oklch(0 0 0); /* #000000 */
  --primary: oklch(0.551 0.278 293.978); /* #8429FF */
  --primary-foreground: oklch(1 0 0); /* #FFFFFF */
  --secondary: oklch(0.962 0.02 295.191); /* #F3F0FF */
  --secondary-foreground: oklch(0.551 0.278 293.978); /* #8429FF */
  --muted: oklch(0.937 0.013 286.138); /* #E9E9F3 */
  --muted-foreground: oklch(0.558 0.01 258.352); /* #70747A */
  --accent: oklch(0.952 0 0); /* #EFEFEF */
  --accent-foreground: oklch(0 0 0); /* #000000 */
  --destructive: oklch(0.558 0.214 19.4); /* #d4183d */
  --destructive-foreground: oklch(1 0 0); /* #FFFFFF */
  --border: oklch(0.922 0 0); /* #E5E5E5 */
  --input: transparent;
  --ring: oklch(0.551 0.278 293.978); /* #8429FF */
  --radius: 0.625rem;
  --font-sans: "Poppins", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

.dark {
  --background: oklch(0.161 0.015 253.142); /* #090E14 */
  --foreground: oklch(1 0 0); /* #FFFFFF */
  --card: oklch(0.216 0.013 258.369); /* #161A20 */
  --card-foreground: oklch(1 0 0); /* #FFFFFF */
  --popover: oklch(0.216 0.013 258.369); /* #161A20 */
  --popover-foreground: oklch(1 0 0); /* #FFFFFF */
  --primary: oklch(0.551 0.278 293.978); /* #8429FF */
  --primary-foreground: oklch(1 0 0); /* #FFFFFF */
  --secondary: oklch(0.551 0.278 293.978 / 0.15); /* #8429FF at 15% */
  --secondary-foreground: oklch(0.551 0.278 293.978); /* #8429FF */
  --muted: oklch(0 0 0); /* #000000 */
  --muted-foreground: oklch(0.713 0.02 258.363); /* #9BA3AF */
  --accent: oklch(0.237 0.015 256.809); /* #1A1F26 */
  --accent-foreground: oklch(1 0 0); /* #FFFFFF */
  --destructive: oklch(0.558 0.214 19.4); /* #d4183d */
  --destructive-foreground: oklch(1 0 0); /* #FFFFFF */
  --border: oklch(0.313 0.012 264.395); /* #2E3137 */
  --input: oklch(0.313 0.012 264.395); /* #2E3137 */
  --ring: oklch(0.551 0.278 293.978); /* #8429FF */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-sans;
  }
}
```

#### 2. Add "Theme" section to brand-guidelines-page.tsx

**File**: `src/app/components/brand-guidelines-page.tsx`

Add a new section after the "Theme Mode Summary" section (Section 6). The section should include:

1. **Section title**: "shadcn Theme" with the same `SectionTitle` component
2. **Description paragraph**: Explaining that this is a copy-pasteable theme for shadcn/Tailwind v4 projects
3. **A tabbed code block** with:
   - Tab for "theme.css" (the full theme snippet above)
   - A "Copy" button that copies the entire snippet to clipboard
4. **Visual styling**: Match the existing code block styling from the security section — dark background, monospace font, syntax highlighting for CSS
5. **Usage instructions**: Brief note: "Paste into your `globals.css` or `theme.css`. Requires Tailwind CSS v4 and the shadcn/ui CSS variable convention."

**Component structure**:

```tsx
{
  /* Section: shadcn Theme */
}
<section className="mb-20">
  <SectionTitle isDark={isDark}>shadcn Theme</SectionTitle>
  <p
    className={cn(
      "mt-4 mb-8 max-w-xl text-[15px] leading-relaxed",
      "text-muted-foreground",
    )}
  >
    Copy this theme into your Tailwind CSS v4 project to use the Fusion design
    system with shadcn/ui components.
  </p>
  <div
    className={cn(
      "rounded-2xl border overflow-hidden",
      "border-border bg-card",
    )}
  >
    {/* Header with "theme.css" label and Copy button */}
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 border-b",
        "border-border",
      )}
    >
      <span className="font-mono text-[13px] text-muted-foreground">
        theme.css
      </span>
      <button
        onClick={handleCopyTheme}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px]",
          "border border-border text-muted-foreground",
          "hover:border-primary/40 hover:text-primary transition-colors",
        )}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
    {/* Code block */}
    <pre
      className={cn(
        "p-6 overflow-x-auto font-mono text-[13px] leading-relaxed",
        "text-muted-foreground",
      )}
    >
      <code>{THEME_SNIPPET}</code>
    </pre>
  </div>
</section>;
```

The `THEME_SNIPPET` constant should be defined at the top of the file as a template literal containing the complete theme CSS. The `handleCopyTheme` function copies it to clipboard with the same pattern used by `CopyHex`.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm test` passes

#### Manual Verification:

- [ ] Theme snippet section appears on brand guidelines page after the Theme Mode Summary
- [ ] Code block renders with monospace font, proper line breaks, and CSS formatting
- [ ] Copy button copies the full theme CSS to clipboard
- [ ] Copied text is valid CSS that can be pasted into a fresh shadcn/Tailwind v4 project
- [ ] Section looks correct in both dark and light modes

**Implementation Note**: After completing this phase, pause for manual verification.

---

## Phase 5: Remove CSP Style-Fix Workaround

### Overview

With all design-system inline styles migrated to Tailwind classes, the `csp-style-fix.ts` integration is no longer needed. Remove it and drop `'unsafe-inline'` from the CSP `style-src` directive.

### Prerequisites

Before starting this phase, verify that the remaining inline styles are CSP-compatible:

- `style={{ width: size, height: size }}` on SVG icons → these set individual style properties, which CSP treats as inline styles. If any remain, `'unsafe-inline'` must stay
- Motion animations setting `element.style.*` at runtime → same issue
- CSS custom property `style` objects in `glowing-effect.tsx` → same issue

**If ANY inline styles remain**, this phase must wait until FSN-0003 CSP is fully addressed. The FSN-0003 plan should be updated to account for the reduced (but non-zero) inline style count.

### Changes Required (if all inline styles are eliminated):

#### 1. Remove CSP style-fix integration

**File**: `astro.config.mjs`

- Remove `import cspStyleFix from "./src/integrations/csp-style-fix";` (line 5)
- Remove `cspStyleFix()` from `integrations` array (line 29)
- Remove `'unsafe-inline'` from `styleDirective.resources` (line 23)

```diff
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data:",
        "connect-src 'self'",
        "frame-src 'none'",
        "object-src 'none'",
      ],
      styleDirective: {
-       resources: [
-         "'self'",
-         "'unsafe-inline'",
-         "https://fonts.googleapis.com",
-       ],
+       resources: ["'self'", "https://fonts.googleapis.com"],
      },
    },
  },
- integrations: [react(), sitemap(), cspStyleFix()],
+ integrations: [react(), sitemap()],
```

#### 2. Delete the integration file

**File**: `src/integrations/csp-style-fix.ts` — delete entirely.

### Changes Required (if inline styles remain):

If Motion animations or dynamic style props still require `'unsafe-inline'`, then:

1. Keep `csp-style-fix.ts` but document which inline styles remain and why
2. Keep `'unsafe-inline'` in `styleDirective.resources`
3. Update the FSN-0003 plan to note that full CSP compliance for `style-src` requires either:
   - Migrating Motion animations to CSS animations/Tailwind classes
   - Using Astro's nonce-based CSP (not currently available for static output)

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] `grep -r 'csp-style-fix' src/ astro.config.mjs` returns no matches (if removed)
- [ ] Built HTML files contain `<meta http-equiv="content-security-policy">` without `'unsafe-inline'` in `style-src` (if removed)

#### Manual Verification:

- [ ] All 4 pages load without CSP violations in browser console
- [ ] All animations and interactive elements work correctly
- [ ] Theme toggle works without CSP errors
- [ ] Fonts load correctly

---

## Testing Strategy

### Unit Tests:

- Existing Vitest tests should pass without modification (they test component behavior, not styles)
- No new unit tests needed — styling changes are visual

### Integration Tests (Playwright):

- Existing visual regression tests (`npm run test:visual`) will catch unintended visual changes
- If visual regression tests fail due to minor sub-pixel differences from OKLCH conversion, update snapshots

### Manual Testing Steps:

1. Run `npm run dev` and open all 4 pages
2. Toggle dark/light mode on each page
3. Verify every section visually matches the current site
4. Test hover effects on all interactive elements (buttons, cards, nav links)
5. Verify gradient buttons render correctly (Launch App, cookie banner accept)
6. Check code block rendering in Security section
7. Check brand guidelines page — all color swatches, typography samples, button demos, and the new theme snippet
8. Test mobile responsive layout
9. Verify no browser console errors

### Regression Checklist:

- [ ] Hero section: heading, stats, CTA buttons, partner logos, marquee
- [ ] Benefits section: feature cards with icon badges
- [ ] Solutions section: solution cards with hover effects
- [ ] How It Works section: numbered steps with borders
- [ ] Trust Bar: protocol logos with hover effects
- [ ] Testimonials: cards with avatars and badges
- [ ] Comparison Table: header row, data rows, feature checks
- [ ] Security section: code block with syntax highlighting
- [ ] Transparency Features: feature grid with icon badges
- [ ] Final CTA: gradient glow, buttons
- [ ] Footer: gradient backgrounds, link sections
- [ ] Nav: desktop + mobile, theme toggle, active states
- [ ] Cookie Banner: both themes, gradient accept button
- [ ] Brand Guidelines: all 7+ sections including new theme snippet
- [ ] Privacy Policy / Terms of Use: heading, body text

## Performance Considerations

- OKLCH is computed at CSS parse time — no runtime cost difference from hex
- Removing inline styles slightly improves first paint (fewer style calculations)
- Semantic tokens via CSS variables have negligible overhead (one variable lookup per use)
- Font loading unchanged (still Google Fonts CDN via `<link>`)
- Bundle size may decrease slightly (fewer characters in class attributes with semantic tokens vs long hex strings)

## Dependencies

- **FSN-0003 (CSP)**: Phase 5 directly enables CSP compliance. If Phase 5 can't fully remove `'unsafe-inline'` (due to Motion or dynamic styles), update FSN-0003 plan
- **FSN-0004 (Figma alignment)**: Note that FSN-0004 deferred styling to this ticket: "Styling/CSS alignment (spacing, colors, font sizes) — deferred to FSN-0005"

## References

- Original ticket: `thoughts/tickets/fsn_0005-css-tailwind-shadcn.md`
- CSP plan: `thoughts/plans/2026-03-23-FSN-0003-content-security-policy.md`
- Figma alignment plan: `thoughts/plans/2026-03-20-FSN-0004-align-to-figma.md`
- shadcn/ui theming docs: https://ui.shadcn.com/docs/theming
- shadcn/ui Tailwind v4 guide: https://ui.shadcn.com/docs/tailwind-v4
- shadcn/ui Astro installation: https://ui.shadcn.com/docs/installation/astro
- shadcn/ui skills: https://ui.shadcn.com/docs/skills
- tweakcn theme editor: https://tweakcn.com/editor/theme
- Tailwind v4 CSS-first config: https://tailwindcss.com/docs/v4
- CSP style-fix integration: `src/integrations/csp-style-fix.ts`
- Current theme CSS: `src/styles/theme.css`
