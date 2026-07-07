# Astro Migration Implementation Plan

## Overview

Migrate the Fusion website from a client-side React SPA (Vite + react-router) to a statically-generated Astro 5 site with React islands. This eliminates SEO issues (empty HTML, JS-dependent meta tags), adds proper SEO infrastructure (sitemap, robots.txt, OG tags), and dramatically reduces client-side JavaScript by rendering most content as static HTML at build time.

## Current State Analysis

### Architecture

- **Framework**: React 19 + Vite 8 + react-router v7 (client-side SPA)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`, 4 CSS files under `src/styles/`
- **Theme**: React context (`ThemeProvider`) consumed by 17 of 19 components
- **Routes**: 4 pages — `/`, `/brand-guidelines`, `/privacy-policy`, `/terms-of-use`
- **Deployment**: AWS Amplify via GitHub Actions
- **Build**: `tsc && vite build` → `dist/`

### SEO Problems

- `index.html` contains only `<div id="root"></div>` — crawlers see no content
- `<title>Fusion</title>` is the only meta tag; real title/description injected via `useEffect` at runtime
- No `robots.txt`, no `sitemap.xml`, no Open Graph tags, no canonical URLs
- No `public/` directory at all

### Key Discoveries

- Theme system uses `.dark` CSS class with CSS variables (`theme.css:1-79`) — already compatible with Astro's approach if moved to `<html>` element
- `@custom-variant dark (&:is(.dark *))` in `theme.css:1` means any `.dark` ancestor activates dark mode — works with `html.dark`
- Nav is embedded inside Hero (`hero.tsx:1` imports Nav) — needs separation for Astro layout
- Footer uses react-router `Link` for internal navigation + `onOpenCookieSettings` callback prop
- All images are ES module imports processed by Vite, no `public/` directory
- All SVG graphics are inline JSX components, no `.svg` files
- `fusion-icons.tsx` (motion-animated) imported by: benefits, solutions, comparison-table
- `transparency-icons.tsx` (SMIL-only, zero JS) imported by: transparency-features
- Fonts loaded via Google Fonts CDN `@import url(...)` in `fonts.css`
- `onMouseEnter`/`onMouseLeave` hover patterns in final-cta, security, nav are simple opacity changes replaceable with CSS `hover:`

### Component Interactivity Classification

| Component                   | Interactive Reason                                  | Astro Strategy                           |
| --------------------------- | --------------------------------------------------- | ---------------------------------------- |
| `nav.tsx`                   | useState ×2, useEffect ×2, scroll/menu/theme toggle | React island `client:load`               |
| `hero.tsx`                  | AnimatedGroup (motion), imports Nav                 | React island `client:load` (without Nav) |
| `benefits.tsx`              | GlowingEffect (pointer + motion), fusion-icons      | React island `client:visible`            |
| `how-it-works.tsx`          | FusionFlow (heavy motion animations)                | React island `client:visible`            |
| `solutions.tsx`             | fusion-icons (motion-animated)                      | React island `client:visible`            |
| `comparison-table.tsx`      | fusion-icons (motion-animated)                      | React island `client:visible`            |
| `cookie-banner.tsx`         | useState, sessionStorage, click handlers            | React island `client:idle`               |
| `testimonials.tsx`          | ImageWithFallback (useState)                        | React island `client:visible`            |
| `brand-guidelines-page.tsx` | useState ×3, clipboard API                          | React island `client:load`               |
| `trust-bar.tsx`             | useTheme only, CSS hover effects                    | **Astro template**                       |
| `transparency-features.tsx` | useTheme + SMIL SVG icons (zero JS)                 | **Astro template**                       |
| `security.tsx`              | useTheme + JS hover (→ CSS hover)                   | **Astro template**                       |
| `final-cta.tsx`             | useTheme + JS hover (→ CSS hover)                   | **Astro template**                       |
| `footer.tsx`                | useTheme + Link + cookie callback                   | **Astro template** + tiny inline JS      |
| `privacy-policy-page.tsx`   | useTheme + Link                                     | **Astro page**                           |
| `terms-of-use-page.tsx`     | useTheme + Link                                     | **Astro page**                           |

## Desired End State

- Astro 5 static site generating 4 HTML pages with full content baked in at build time
- React islands hydrate only interactive components (animations, menus, state)
- CSS-only dark/light theme with zero-flash inline script
- Proper SEO: per-page meta tags, OG tags, canonical URLs, `sitemap.xml`, `robots.txt`
- Same visual appearance and functionality as current SPA
- Deployed on AWS Amplify with same CI/CD pipeline
- Significantly reduced client-side JavaScript payload

### How to Verify

- View source of built HTML pages → content visible without JS
- Lighthouse SEO audit → 100 score
- `curl https://fusion.ipor.io/ | grep "<title>"` → proper title in HTML
- `curl https://fusion.ipor.io/sitemap-index.xml` → valid sitemap
- All animations and interactivity work identically to current site
- Theme toggle works without flash on page load

## What We're NOT Doing

- Changing visual design or content — pixel-for-pixel match with current site
- Adding SSR (server-side rendering) — purely static output, no server needed
- Splitting React islands further (e.g., extracting individual motion icons from solutions) — optimize later if needed
- Migrating to Astro Content Collections for policy pages — hardcoded content stays hardcoded
- Changing the AWS Amplify deployment platform
- Adding internationalization or any new features

## Implementation Approach

**Core insight**: The theme system is the biggest architectural blocker. Currently `useTheme()` forces 17 components to be React islands. By moving theme to a CSS class on `<html>` with an inline `<script>`, most components become pure Astro templates with zero JavaScript.

**Migration strategy**: Bottom-up. Fix the foundation (theme, layout, config) first, then migrate pages one at a time. Keep the existing SPA working until the migration is complete, then swap.

---

## Phase 1: Astro Project Scaffold & Theme System

### Overview

Initialize Astro 5 alongside the existing code. Set up all configuration, the CSS-only theme system, the base layout with SEO head, and static SEO files. After this phase, the Astro build produces a working (but empty) site skeleton.

### Changes Required:

#### 1. Install Astro and integrations

**Action**: Update `package.json` dependencies

```bash
npm install astro @astrojs/react @astrojs/sitemap
```

Remove after migration is complete (Phase 5):

- `react-router` (replaced by Astro file-based routing)

Keep:

- `react`, `react-dom` (used by React islands)
- `@tailwindcss/vite`, `tailwindcss` (used via Astro's vite config)
- `motion` (used by animated React islands)
- `lucide-react` (used by both Astro templates and React islands)
- All other existing dependencies

#### 2. Create Astro config

**File**: `astro.config.mjs` (new)

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://fusion.ipor.io",
  output: "static",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
    assetsInclude: ["**/*.svg", "**/*.csv"],
  },
});
```

#### 3. Update TypeScript config

**File**: `tsconfig.json`

Replace with Astro-compatible config:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### 4. Create CSS-only theme system

**File**: `src/styles/theme.css`

Change the `@custom-variant` and `.dark` selector to target `html.dark`:

```css
/* Line 1 — no change needed, (&:is(.dark *)) already matches html.dark descendants */
@custom-variant dark (&:is(.dark *));

/* Line 44 — change .dark to html.dark for specificity clarity */
html.dark {
  /* ... same variable overrides ... */
}
```

**Note**: The existing `.dark { ... }` selector already works with `html.dark` since `.dark` matches any element with that class. The `@custom-variant dark (&:is(.dark *))` also works because `html.dark` is an ancestor. No actual CSS changes are needed — the theme system is already compatible.

#### 5. Create inline theme script

**File**: `src/components/theme-script.astro` (new)

This script runs synchronously in `<head>` before first paint to prevent flash of wrong theme:

```astro
<script is:inline>
(function() {
  var stored = null;
  try { stored = localStorage.getItem('fusion-theme'); } catch(e) {}
  var theme = stored === 'light' || stored === 'dark'
    ? stored
    : (window.innerWidth < 768 ? 'light' : 'dark');
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
})();
</script>
```

#### 6. Create SEO head component

**File**: `src/components/base-head.astro` (new)

```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image = '/og-default.png' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.site)} />
<meta property="og:site_name" content="Fusion by IPOR" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL(image, Astro.site)} />

<!-- Fonts (moved from fonts.css @import to <link> for better performance) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

#### 7. Create base layout

**File**: `src/layouts/base-layout.astro` (new)

```astro
---
import BaseHead from '../components/base-head.astro';
import ThemeScript from '../components/theme-script.astro';
import Nav from '../components/nav.tsx';
import '../styles/index.css';

interface Props {
  title: string;
  description: string;
  image?: string;
  hideNav?: boolean;
}

const { title, description, image, hideNav = false } = Astro.props;
---

<html lang="en" class="dark">
  <head>
    <BaseHead title={title} description={description} image={image} />
    <ThemeScript />
  </head>
  <body style="font-family: 'Poppins', sans-serif;">
    {!hideNav && <Nav client:load />}
    <slot />
  </body>
</html>
```

The `class="dark"` default on `<html>` matches the current default (dark on desktop). The inline script immediately corrects it if needed, before paint.

#### 8. Update CSS files

**File**: `src/styles/fonts.css`

Remove the Google Fonts `@import url(...)` lines — fonts are now loaded via `<link>` tags in `base-head.astro` for better performance (non-render-blocking with `display=swap`).

```css
/* Empty — fonts loaded via <link> in base-head.astro */
```

**File**: `src/styles/tailwind.css`

Update the `@source` directive to include `.astro` files:

```css
@import "tailwindcss" source(none);
@source '../**/*.{js,ts,jsx,tsx,astro}';

@import "tw-animate-css";
```

**File**: `src/styles/index.css` — no changes needed (scrollbar styles and keyframes are fine as-is).

#### 9. Add robots.txt

**File**: `public/robots.txt` (new)

```
User-agent: *
Allow: /

Sitemap: https://fusion.ipor.io/sitemap-index.xml
```

#### 10. Create OG image placeholder

**File**: `public/og-default.png`

Create or copy an OG image (1200x630px recommended) for social sharing previews. This can be the Fusion logo on a branded background. For now, create a placeholder; replace with a designed asset later.

#### 11. Move static assets to public/

Move image assets that are currently imported as ES modules to `public/` so they can be referenced by both Astro templates and React islands without import:

```
public/
  robots.txt
  og-default.png
  brand/
    fusion.png
    fusion-dark.png
    fusion-light.png
  logos/
    aave.png, morpho.png, uniswap.png, compound.png, pendle.png,
    blocksec.png, ackee.png, zokyo.png, protofire.png,
    llamarisk.png, tesseract.png, tau-labs.png, k3-capital.png,
    navigator.png, clearstar.png, reservoir.png, more-protocols.png
  icons/
    pendle.png, aave.png, euler.png, morpho-dark.png,
    morpho-light.png, usdc.png, fusion-light.png
  avatars/
    james.png, nick.png, vlad.png
  vault-overview.png
```

**Note**: In Astro templates, reference as `/brand/fusion-dark.png`. In React islands, reference as `/brand/fusion-dark.png` (string path, not ES module import). This is a significant change from the current `import logo from "@/assets/brand/fusion.png"` pattern — all image imports in React components must be updated to string paths.

Alternatively, keep images in `src/assets/` and use Astro's `<Image>` component for optimization. However, since these are already optimized PNGs and React islands can't use Astro's `<Image>`, using `public/` is simpler for consistency.

#### 12. Update build scripts

**File**: `package.json` scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Note: `astro check` replaces `tsc` for type-checking `.astro` files. Install it:

```bash
npm install @astrojs/check
```

#### 13. Vitest config

Move Vitest config from `vite.config.ts` to a standalone `vitest.config.ts` since Astro now owns the Vite config:

**File**: `vitest.config.ts` (new)

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./test-setup.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm install` completes without errors
- [ ] `npm run build` (astro build) produces `dist/` with HTML files
- [ ] `npm run dev` starts Astro dev server
- [ ] `npm test` still passes existing tests
- [ ] `npm run lint` passes
- [ ] `dist/robots.txt` exists with correct content
- [ ] `dist/sitemap-index.xml` is generated

#### Manual Verification:

- [ ] Dev server shows empty page with working Nav (React island)
- [ ] No flash of wrong theme on page load (inline script works)
- [ ] Theme toggle changes `<html>` class
- [ ] View page source shows full HTML content in `<head>` (meta tags, OG tags)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding.

---

## Phase 2: Refactor React Components for Astro Compatibility

### Overview

Refactor existing React components to remove the `useTheme()` / `ThemeProvider` dependency for components that will become Astro templates, and create a lightweight theme hook for React islands. Also separate Nav from Hero.

### Changes Required:

#### 1. Create lightweight theme hook for React islands

**File**: `src/components/use-theme.ts` (new)

React islands can't use the old `ThemeContext` (it's not provided by an Astro layout). Instead, they read/write the `<html>` class directly:

```ts
import { useState, useCallback, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = useCallback(() => {
    const next = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("fusion-theme", next);
    } catch {}
    setIsDark(!isDark);
  }, [isDark]);

  // Sync with external changes (e.g., another island toggling theme)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return {
    isDark,
    toggleTheme,
    theme: isDark ? ("dark" as const) : ("light" as const),
  };
}
```

#### 2. Update React island components to use new hook

For every React component that remains an island, replace:

```ts
import { useTheme } from "@/app/components/ui/theme-context";
```

with:

```ts
import { useTheme } from "@/components/use-theme";
```

Affected files (React islands):

- `src/app/components/nav.tsx`
- `src/app/components/hero.tsx`
- `src/app/components/benefits.tsx`
- `src/app/components/how-it-works.tsx`
- `src/app/components/solutions.tsx`
- `src/app/components/comparison-table.tsx`
- `src/app/components/cookie-banner.tsx`
- `src/app/components/testimonials.tsx`
- `src/app/components/brand-guidelines-page.tsx`
- `src/app/components/ui/fusion-flow.tsx`

#### 3. Remove ThemeProvider wrapper

React islands no longer need `ThemeProvider`. The `App` component and `ThemeProvider` become unnecessary. Islands are mounted directly by Astro.

#### 4. Separate Nav from Hero

Currently `hero.tsx:1` imports and renders `Nav`. For Astro, Nav lives in the base layout, not inside Hero.

**File**: `src/app/components/hero.tsx`

Remove:

```tsx
import Nav from "@/app/components/nav";
```

And remove the `<Nav />` JSX from the Hero component's render output (it's rendered at the top of the Hero section). Nav will be provided by the Astro layout instead.

#### 5. Update image references in React islands

All React island components that import images as ES modules need to switch to string paths (since images are now in `public/`):

**Before** (in each component):

```tsx
import fusionLogoDarkPng from "@/assets/brand/fusion-dark.png";
<img src={fusionLogoDarkPng} />;
```

**After**:

```tsx
<img src="/brand/fusion-dark.png" />
```

Affected files:

- `nav.tsx` — `fusion-dark.png`, `fusion-light.png`
- `hero.tsx` — 7 logo imports (llamarisk, tesseract, tau-labs, k3-capital, navigator, clearstar, reservoir)
- `footer.tsx` (if kept as React) — `fusion-dark.png`, `fusion-light.png`
- `comparison-table.tsx` — `fusion-dark.png`, `fusion-light.png`
- `security.tsx` — 4 auditor logos
- `trust-bar.tsx` — protocol logos
- `testimonials.tsx` — 3 logos + 3 avatars
- `transparency-features.tsx` — `vault-overview.png`
- `brand-guidelines-page.tsx` — `fusion.png`, `fusion-light.png`
- `solutions.tsx` — no image imports (uses fusion-icons only)

#### 6. Replace react-router Link with `<a>` tags

In components that will become Astro templates OR React islands, replace:

```tsx
import { Link } from "react-router";
<Link to="/privacy-policy">...</Link>;
```

with plain:

```tsx
<a href="/privacy-policy">...</a>
```

Affected files:

- `nav.tsx` — `<Link to="/">` → `<a href="/">`
- `footer.tsx` — `<Link to="/privacy-policy">`, `<Link to="/terms-of-use">`, conditional `<Link to={...}>`
- `hero.tsx` — no Link usage (Nav was the only user)
- `privacy-policy-page.tsx` — `<Link to="/">` (will become Astro page)
- `terms-of-use-page.tsx` — `<Link to="/">` (will become Astro page)
- `brand-guidelines-page.tsx` — `<Link to="/">` (will become Astro page)

### Success Criteria:

#### Automated Verification:

- [ ] TypeScript compilation passes (`npx astro check`)
- [ ] No imports of `react-router` remain in any component
- [ ] No imports of `theme-context` remain (replaced by `use-theme`)
- [ ] `npm run build` succeeds
- [ ] `npm test` passes (update tests that rely on ThemeProvider/RouterProvider wrappers)

#### Manual Verification:

- [ ] React islands render correctly with theme hook
- [ ] Theme toggle in Nav still works, syncs across islands
- [ ] No FOUC (flash of unstyled/wrong-theme content)

**Implementation Note**: After completing this phase, pause for manual confirmation before proceeding.

---

## Phase 3: Landing Page Migration

### Overview

Create the landing page as an Astro page (`src/pages/index.astro`), assembling section components — some as Astro templates, others as React islands. This is the largest phase.

### Changes Required:

#### 1. Create landing page

**File**: `src/pages/index.astro` (new)

```astro
---
import BaseLayout from '../layouts/base-layout.astro';
import TrustBar from '../components/trust-bar.astro';
import TransparencyFeatures from '../components/transparency-features.astro';
import Security from '../components/security.astro';
import FinalCTA from '../components/final-cta.astro';
import FooterSection from '../components/footer.astro';

// React islands
import Hero from '../app/components/hero.tsx';
import Testimonials from '../app/components/testimonials.tsx';
import Benefits from '../app/components/benefits.tsx';
import HowItWorks from '../app/components/how-it-works.tsx';
import Solutions from '../app/components/solutions.tsx';
import ComparisonTable from '../app/components/comparison-table.tsx';
import CookieBanner from '../components/cookie-banner-island.tsx';
---

<BaseLayout
  title="Fusion by IPOR | Onchain Vault Infrastructure"
  description="Deploy and manage onchain vault strategies or earn through professionally curated vaults. Modular infrastructure across Aave, Morpho, SparkLend, Euler, and more."
>
  <main>
    <!-- Light mode noise overlay (CSS only, no JS) -->
    <div
      class="pointer-events-none fixed inset-0 z-[100] opacity-[0.03] dark:hidden"
      style="background-image: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\"); background-repeat: repeat;"
    ></div>

    <Hero client:load />
    <TransparencyFeatures />
    <Testimonials client:visible />
    <Benefits client:visible />
    <HowItWorks client:visible />
    <Solutions client:visible />
    <TrustBar />
    <ComparisonTable client:visible />
    <Security />
    <FinalCTA />
    <FooterSection />
  </main>
  <CookieBanner client:idle />
</BaseLayout>
```

#### 2. Convert static sections to Astro templates

For each component classified as "Astro template", create a new `.astro` file that replaces `useTheme()`/`isDark` with Tailwind `dark:` variants and CSS variables.

**Pattern for converting `isDark ? classA : classB`**:

```tsx
// Before (React)
className={isDark ? "text-white" : "text-[#000000]"}

// After (Astro/Tailwind)
class="text-[#000000] dark:text-white"
```

**Pattern for converting `isDark ? inlineStyleA : inlineStyleB`**:

For inline styles that differ by theme (e.g., gradient backgrounds in footer), add CSS custom properties to `theme.css`:

```css
:root {
  --footer-glow-1: rgba(132, 41, 255, 0.06);
  --footer-glow-2: rgba(132, 41, 255, 0.04);
}
html.dark {
  --footer-glow-1: rgba(139, 92, 246, 0.08);
  --footer-glow-2: rgba(139, 92, 246, 0.05);
}
```

Then use `var(--footer-glow-1)` in the Astro template's inline style.

**Pattern for logo switching**:

```astro
<!-- Before (React): src={isDark ? darkLogo : lightLogo} -->
<!-- After (Astro): two <img> tags with dark: visibility -->
<img src="/brand/fusion-dark.png" alt="Fusion by IPOR" class="hidden dark:block h-8 w-auto object-contain" />
<img src="/brand/fusion-light.png" alt="Fusion by IPOR" class="block dark:hidden h-8 w-auto object-contain" />
```

**Pattern for replacing JS hover effects with CSS**:

```tsx
// Before (React)
onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}

// After (Astro/CSS) — just add hover:opacity-70 class
class="... hover:opacity-70 transition-opacity duration-300"
```

**Components to convert**:

##### a. `src/components/trust-bar.astro` (new)

Convert from `src/app/components/trust-bar.tsx`. Replace all `isDark ? x : y` className patterns with `dark:` variants. Replace image imports with `/logos/...` paths. Remove `useTheme` import.

##### b. `src/components/transparency-features.astro` (new)

Convert from `src/app/components/transparency-features.tsx`. The SMIL-animated SVG icons from `transparency-icons.tsx` can be inlined directly as raw SVG in the Astro template (they require zero JavaScript). Replace theme conditionals with `dark:` variants. Replace vault-overview image import with `/vault-overview.png`.

##### c. `src/components/security.astro` (new)

Convert from `src/app/components/security.tsx`. Replace `onMouseEnter`/`onMouseLeave` hover effects on the "View on GitHub" link with CSS `hover:border-[color] hover:text-[color]`. Replace auditor logo imports with `/logos/...` paths.

##### d. `src/components/final-cta.astro` (new)

Convert from `src/app/components/final-cta.tsx`. Replace Launch App button's JS hover with `hover:opacity-70`. Convert all `isDark ? x : y` to `dark:` variants.

##### e. `src/components/footer.astro` (new)

Convert from `src/app/components/footer.tsx`.

Key changes:

- Replace `Link` with `<a>` tags
- Replace `isDark ? x : y` with `dark:` variants
- For gradient inline styles, add CSS variables to `theme.css`
- The `onOpenCookieSettings` callback: replace with a DOM event. The "Cookie Policy" link dispatches a custom event:

```astro
<a
  href="#"
  id="open-cookie-settings"
  class="text-[13px] transition-colors text-[#70747A] dark:text-[#9BA3AF] hover:text-[#000000] dark:hover:text-white"
  style="font-family: 'Poppins', sans-serif;"
>
  Cookie Policy
</a>
<script>
  document.getElementById('open-cookie-settings')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  });
</script>
```

The `CookieBanner` React island listens for this event.

- The "Fusion Vaults" (`#top`) link: replace JS `onClick` with:

```astro
<a
  href="#"
  class="..."
  onclick="event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' })"
>
  Fusion Vaults
</a>
```

#### 3. Create CookieBanner island adapter

**File**: `src/components/cookie-banner-island.tsx` (new)

A thin wrapper that integrates the existing `CookieBanner` with the DOM event from footer:

```tsx
import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/components/use-theme";

const STORAGE_KEY = "cookie_consent";

export default function CookieBannerIsland() {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return true;
    }
  });

  const accept = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "accepted");
    } catch {}
    setVisible(false);
  }, []);

  const decline = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "declined");
    } catch {}
    setVisible(false);
  }, []);

  // Listen for footer's "open cookie settings" event
  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("open-cookie-settings", handler);
    return () => window.removeEventListener("open-cookie-settings", handler);
  }, []);

  if (!visible) return null;

  // ... render same CookieBanner UI ...
}
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` produces `dist/index.html` with full section content visible in HTML source
- [ ] `npx astro check` passes
- [ ] `npm run lint` passes
- [ ] Built HTML contains proper `<title>`, `<meta name="description">`, OG tags
- [ ] `grep -c "div" dist/index.html` shows substantial HTML content (not just `<div id="root">`)

#### Manual Verification:

- [ ] Landing page looks identical to current SPA at desktop and mobile breakpoints
- [ ] All animations play (hero entrance, benefits glow, fusion flow, motion icons)
- [ ] Theme toggle works, all sections respond correctly
- [ ] Mobile nav menu opens/closes
- [ ] Cookie banner appears on first visit, dismisses on accept/decline
- [ ] Cookie Policy link in footer reopens cookie banner
- [ ] Smooth scroll to top works on "Fusion Vaults" footer link
- [ ] All external links open in new tabs
- [ ] Anchor links (#how-it-works, #solutions, #security) scroll to correct sections

**Implementation Note**: This is the most critical phase. After completing and verifying, pause for manual confirmation before proceeding.

---

## Phase 4: Secondary Pages

### Overview

Migrate the three secondary pages (Privacy Policy, Terms of Use, Brand Guidelines) to Astro pages. The first two are straightforward Astro templates; Brand Guidelines has interactive elements requiring a React island.

### Changes Required:

#### 1. Privacy Policy page

**File**: `src/pages/privacy-policy.astro` (new)

```astro
---
import BaseLayout from '../layouts/base-layout.astro';
import FooterSection from '../components/footer.astro';
import { ArrowLeft } from 'lucide-react';

const sections = [
  // ... copy sections array from privacy-policy-page.tsx lines 8-48 ...
];
---

<BaseLayout
  title="Privacy Policy | Fusion by IPOR"
  description="Privacy Policy for Fusion by IPOR - Onchain Vault Infrastructure"
>
  <div class="min-h-screen bg-[#F5F5FA] dark:bg-[#090E14] transition-colors duration-500"
       style="font-family: 'Poppins', sans-serif;">
    <div class="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <a href="/" class="group mb-10 inline-flex items-center gap-2 text-sm transition-colors text-[#70747A] dark:text-[#9BA3AF] hover:text-[#000000] dark:hover:text-white">
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Home
      </a>
      <h1 class="mb-2 text-[#000000] dark:text-white" style="font-weight:600; font-size:clamp(28px,5vw,40px); line-height:1.2;">
        Privacy Policy
      </h1>
      <p class="mb-12 text-sm text-[#70747A] dark:text-[#9BA3AF]">Last updated: 2022-03-31</p>
      <!-- ... render sections ... -->
    </div>
  </div>
  <FooterSection />
</BaseLayout>
```

Convert all `isDark ? x : y` patterns to `dark:` variants. Replace `Link` with `<a>`. All content is hardcoded — straight copy from the React component.

**Note**: `lucide-react` icons (ArrowLeft) can be imported and used in `.astro` files since they're simple React components. They render as static SVG at build time without needing `client:` directives.

#### 2. Terms of Use page

**File**: `src/pages/terms-of-use.astro` (new)

Same pattern as Privacy Policy. Copy `sections` array from `terms-of-use-page.tsx`. Convert theme conditionals to `dark:` variants.

#### 3. Brand Guidelines page

**File**: `src/pages/brand-guidelines.astro` (new)

This page has interactive elements (tab switching, copy-to-clipboard), so it uses the base layout with `hideNav` and renders the brand guidelines content as a React island:

```astro
---
import BaseLayout from '../layouts/base-layout.astro';
import BrandGuidelinesContent from '../app/components/brand-guidelines-page.tsx';
---

<BaseLayout
  title="Brand Guidelines | Fusion by IPOR"
  description="Brand guidelines and design system for Fusion by IPOR"
  hideNav={true}
>
  <BrandGuidelinesContent client:load />
</BaseLayout>
```

The `BrandGuidelinesPage` component stays as React but with these changes:

- Import `useTheme` from the new `@/components/use-theme`
- Replace `Link` with `<a>`
- Replace image imports with `/brand/...` string paths

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` produces `dist/privacy-policy/index.html`, `dist/terms-of-use/index.html`, `dist/brand-guidelines/index.html`
- [ ] Each HTML file contains full page content in source
- [ ] Each page has correct `<title>` and `<meta name="description">`
- [ ] `npx astro check` passes

#### Manual Verification:

- [ ] Privacy Policy page renders correctly with all sections
- [ ] Terms of Use page renders correctly with all sections
- [ ] Brand Guidelines tabs switch correctly, copy-to-clipboard works
- [ ] "Back to Home" links navigate to `/`
- [ ] Theme toggle works on all pages
- [ ] Footer links between pages work correctly

**Implementation Note**: After completing this phase, pause for manual confirmation before proceeding.

---

## Phase 5: SEO, Cleanup & Deployment

### Overview

Finalize SEO configuration, remove all old SPA infrastructure, update CI/CD, and verify the complete build.

### Changes Required:

#### 1. Remove old SPA files

Delete these files (no longer needed):

- `src/main.tsx` — old React entry point
- `src/app/app.tsx` — old App wrapper with RouterProvider
- `src/app/routes.tsx` — old react-router config
- `src/app/landing.tsx` — replaced by `src/pages/index.astro`
- `src/app/components/ui/theme-context.tsx` — replaced by CSS + `use-theme.ts`
- `src/app/components/privacy-policy-page.tsx` — replaced by Astro page
- `src/app/components/terms-of-use-page.tsx` — replaced by Astro page
- `index.html` — Astro generates its own HTML
- `vite.config.ts` — Astro owns the Vite config now

**Keep** (still used by React islands):

- `src/app/components/nav.tsx`
- `src/app/components/hero.tsx`
- `src/app/components/benefits.tsx`
- `src/app/components/how-it-works.tsx`
- `src/app/components/solutions.tsx`
- `src/app/components/comparison-table.tsx`
- `src/app/components/testimonials.tsx`
- `src/app/components/brand-guidelines-page.tsx`
- `src/app/components/ui/fusion-flow.tsx`
- `src/app/components/ui/fusion-icons.tsx`
- `src/app/components/ui/animated-group.tsx`
- `src/app/components/ui/glowing-effect.tsx`
- `src/app/components/figma/image-with-fallback.tsx`
- `src/app/components/ui/utils.ts`

#### 2. Remove unused dependencies

```bash
npm uninstall react-router
```

#### 3. Update CI/CD for Astro build

**File**: `.github/workflows/test-webapp.yml`

Update the build command if it references `tsc && vite build`. Since `package.json` scripts are already updated (Phase 1), no workflow change should be needed — it calls `npm run build` which now runs `astro check && astro build`.

Verify the workflow still works by checking that:

- `npm ci` installs Astro dependencies
- `npm test` runs Vitest
- `npm run build` runs Astro build

#### 4. AWS Amplify build configuration

If the Amplify app uses a custom `amplify.yml` or build settings in the console, ensure:

- Build command: `npm run build`
- Output directory: `dist`
- Base directory: `/` (or as configured)

Since the build output is still `dist/` and the entry point is still `npm run build`, no Amplify configuration changes should be needed. Amplify serves static files from `dist/` with its built-in SPA rewrite rules. For Astro's static output, each route has its own `index.html`, so SPA rewrites are not needed — but they don't interfere either.

**Important**: Ensure Amplify's custom rewrite rules (if any) don't conflict with Astro's directory-based output. For example, if Amplify has a catch-all redirect `/* → /index.html`, it should be removed or updated since each page now has its own HTML file.

#### 5. Verify sitemap output

After build, check that `dist/sitemap-index.xml` contains all 4 pages:

- `https://fusion.ipor.io/`
- `https://fusion.ipor.io/privacy-policy/`
- `https://fusion.ipor.io/terms-of-use/`
- `https://fusion.ipor.io/brand-guidelines/`

#### 6. Add anchor IDs for section navigation

Ensure the landing page sections have proper `id` attributes for anchor navigation from the Nav (`#how-it-works`, `#solutions`, `#security`):

In `src/pages/index.astro`, wrap React islands with an anchor:

```astro
<div id="how-it-works">
  <HowItWorks client:visible />
</div>
<div id="solutions">
  <Solutions client:visible />
</div>
```

For Astro template sections, add `id` directly to the `<section>` element:

```astro
<!-- In security.astro -->
<section id="security" class="...">
```

Verify that the current components have these IDs already in their root elements, or add them.

#### 7. Update existing tests

Tests that import from old entry points or use `ThemeProvider`/`RouterProvider` wrappers need updating:

- Remove `RouterProvider` wrappers from test renders
- Replace `ThemeProvider` wrappers with direct renders (components no longer need context)
- For islands using `useTheme`, mock `document.documentElement.classList` if needed

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds with zero warnings
- [ ] `npx astro check` passes
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] No imports of `react-router` anywhere in codebase: `grep -r "react-router" src/`
- [ ] No imports of old `theme-context` anywhere: `grep -r "theme-context" src/`
- [ ] `dist/` contains: `index.html`, `privacy-policy/index.html`, `terms-of-use/index.html`, `brand-guidelines/index.html`, `robots.txt`, `sitemap-index.xml`
- [ ] Each HTML page contains full content (not just `<div id="root">`)
- [ ] Each HTML page has `<title>`, `<meta name="description">`, OG tags

#### Manual Verification:

- [ ] All 4 pages render correctly in browser
- [ ] View source shows full HTML content for every page
- [ ] Lighthouse SEO audit scores 100 on all pages
- [ ] Theme toggle works across all pages without flash
- [ ] All animations play correctly
- [ ] Mobile responsiveness matches current site
- [ ] Nav anchor links scroll to correct sections
- [ ] All external links work
- [ ] Cookie banner works end-to-end
- [ ] Deploy to dev environment via Amplify succeeds
- [ ] Social sharing preview (paste URL in Slack/Twitter) shows correct OG image and description

**Implementation Note**: After completing and verifying this phase, the migration is complete. Deploy to production.

---

## Testing Strategy

### Unit Tests

- Test `useTheme` hook: verify it reads/writes `document.documentElement.classList` and `localStorage`
- Test CookieBanner island: verify sessionStorage integration and event listener
- Keep existing component unit tests, updated for new import paths

### Integration Tests

- Build verification: `astro build` produces correct output structure
- HTML content verification: built pages contain expected text content
- Sitemap verification: all routes present

### Manual Testing Steps

1. Cold load each page — verify no FOUC
2. Toggle theme — verify all sections update
3. Navigate between all 4 pages — verify smooth transitions
4. Test mobile breakpoints — verify responsive layout
5. Run Lighthouse on each page — target 90+ performance, 100 SEO
6. Test with JS disabled — verify content is visible (core value of this migration)
7. Paste each URL into social media composer — verify OG preview renders

## Performance Considerations

- **JS bundle reduction**: Static Astro templates ship zero JS. Only React islands load their JS bundles. `client:visible` defers loading until the component scrolls into view.
- **Font loading**: Moving from CSS `@import url()` to `<link>` with `preconnect` improves font loading performance.
- **Image optimization**: Consider migrating images to Astro's `<Image>` component in a future iteration for automatic WebP/AVIF conversion and responsive `srcset`. This is out of scope for this migration.
- **Build time**: Astro build is fast for 4 static pages. No significant build time impact expected.

## Migration Notes

### File structure after migration

```
src/
  components/           # NEW — Astro components & shared utilities
    base-head.astro
    theme-script.astro
    trust-bar.astro
    transparency-features.astro
    security.astro
    final-cta.astro
    footer.astro
    cookie-banner-island.tsx
    use-theme.ts
  layouts/              # NEW — Astro layouts
    base-layout.astro
  pages/                # NEW — Astro file-based routes
    index.astro
    privacy-policy.astro
    terms-of-use.astro
    brand-guidelines.astro
  app/components/       # EXISTING — React islands (kept)
    nav.tsx
    hero.tsx
    benefits.tsx
    how-it-works.tsx
    solutions.tsx
    comparison-table.tsx
    testimonials.tsx
    brand-guidelines-page.tsx
    cookie-banner.tsx    # may be replaced by cookie-banner-island.tsx
    ui/
      animated-group.tsx
      fusion-flow.tsx
      fusion-icons.tsx
      glowing-effect.tsx
      transparency-icons.tsx  # could be inlined into Astro template
      utils.ts
    figma/
      image-with-fallback.tsx
  styles/               # EXISTING — CSS files (minor updates)
    index.css
    fonts.css            # emptied, fonts in <link>
    tailwind.css         # updated @source to include .astro
    theme.css            # minor additions for inline-style CSS vars
  assets/               # REMOVED — images moved to public/
public/                 # NEW — static assets
  robots.txt
  og-default.png
  brand/
  logos/
  icons/
  avatars/
  vault-overview.png
```

### Rollback plan

If the migration needs to be rolled back:

1. The old SPA code exists in git history
2. Revert to the commit before the migration branch was merged
3. `npm install` and `npm run build` will restore the original SPA

## References

- Original ticket: `thoughts/tickets/fsn_0008-static-page-instead-of-spa.md`
- Astro 5 docs: https://docs.astro.build/
- @astrojs/react docs: https://docs.astro.build/en/guides/integrations-guide/react/
- Astro + Tailwind v4: https://tailwindcss.com/docs/installation/framework-guides/astro
- Astro + AWS Amplify: https://docs.astro.build/en/guides/deploy/aws/
- @astrojs/sitemap: https://docs.astro.build/en/guides/integrations-guide/sitemap/
