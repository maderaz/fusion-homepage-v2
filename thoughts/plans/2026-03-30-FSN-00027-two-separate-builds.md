# Two Separate Builds — Implementation Plan

## Overview

Restructure the repository to produce **two separate Astro builds** from one codebase, each deploying to a different domain:

- **fusion.ipor.io** — the existing Fusion landing page (unchanged)
- **ipor.io** — a new single-page site matching the [Figma design](https://fusionhome.figma.site/home)

Both sites share styles, assets, and components (footer, cookie banner, theme system, analytics). The approach uses **dual Astro config files** with separate `srcDir` / `outDir` / `site` values, avoiding a pnpm workspaces migration.

## Current State Analysis

### Fusion Website (this repo)

- Single `astro.config.mjs` with `site: "https://fusion.ipor.io"`, building to `dist/`
- Pages: `src/pages/index.astro`, `privacy-policy.astro`, `terms-of-use.astro`
- Shared infra: `src/components/` (Astro), `src/app/components/` (React islands), `src/styles/`, `src/layouts/`
- CSP: custom `csp-style-fix.ts` integration post-processes both `<meta>` tags and `customHttp.yml`
- Deployment: AWS Amplify via GitHub Actions (`deploy-amplify.yml` reusable workflow)
- Amplify apps: `ipor-dev-fusion-website` (dev) and `ipor-mainnet-fusion-website` (mainnet)

### Existing ipor-website (separate repo at `/Users/kuba/ipor-labs/ipor-website/`)

- Next.js 13 app with `output: 'export'` (static HTML) — will be **fully replaced**
- Amplify apps: `ipor-dev-main-website` (dev) and `ipor-mainnet-main-website` (mainnet)
- These Amplify apps are currently configured in the AWS console to build from the ipor-website repo
- Uses `customHttp.yml.tpl` with `${VAR}` interpolation (RPC URLs, Sentry) — processed in Amplify's pre-step
- Deploy workflow pattern is identical to fusion-website (trigger RELEASE via AWS CLI)
- **Migration required**: The Amplify apps must be reconfigured in the AWS console to point to the fusion-website repo, with updated build command (`npm run build:ipor`) and artifact directory (`dist/ipor/`)

### Key Discoveries

- `customHttp.yml:1-25` — single CSP header YAML, rewritten by post-build integration
- `src/integrations/csp-style-fix.ts:142` — hardcoded path `resolve(process.cwd(), "customHttp.yml")`
- `src/styles/tailwind.css:2` — `@source '../**/*.{js,ts,jsx,tsx,astro}'` uses relative glob from `src/styles/`
- `src/components/base-head.astro:9` — canonical URL computed from `Astro.site` + `Astro.url.pathname`
- The `deploy-amplify.yml` workflow is already parameterized by `app-name` and `branch`
- The test workflow (`test-webapp.yml:60`) runs `npm run build` — needs to build both sites

### Figma Design for ipor.io

The new site is a minimal single page with:

- **Nav**: Logo + "Discover Fusion" link + "Launch App" CTA (no section anchors, no theme toggle, no Build button)
- **Hero ("Meet Fusion")**: h1 headline + subtitle, two side-by-side cards:
  - Left: "Vault infrastructure for institutional-grade yield" → links to fusion.ipor.io
  - Right: "The Live App" with app screenshot → links to app.ipor.io/fusion
- **Footer**: Identical to current fusion site (same link columns, branding, legal links)
- **Cookie banner**: Same as current
- **Legal pages**: Privacy Policy, Cookie Policy, Terms of Use (same content, different titles)

## Desired End State

```
fusion-website/
├── src/
│   ├── shared/                          ← shared across both sites
│   │   ├── components/                  ← footer, cookie-banner, base-head, theme-script, analytics-script, use-theme
│   │   ├── data/                        ← footer-links.ts
│   │   ├── layouts/                     ← base-layout.astro
│   │   └── styles/                      ← index.css, tailwind.css, theme.css, fonts.css
│   ├── sites/
│   │   ├── fusion/                      ← srcDir for fusion.ipor.io
│   │   │   ├── pages/                   ← index.astro, privacy-policy.astro, terms-of-use.astro
│   │   │   ├── components/              ← fusion-specific: nav, hero, benefits, solutions, etc.
│   │   │   └── app/                     ← React islands (hero.tsx, benefits.tsx, ui/*)
│   │   └── ipor/                        ← srcDir for ipor.io
│   │       ├── pages/                   ← index.astro, privacy-policy.astro, terms-of-use.astro
│   │       └── components/              ← ipor-specific: nav, hero section
│   └── integrations/                    ← csp-style-fix.ts (shared, parameterized)
├── public/                              ← shared static assets (both sites use same publicDir)
├── astro.config.fusion.mjs             ← site: "https://fusion.ipor.io", srcDir: "./src/sites/fusion", outDir: "./dist/fusion"
├── astro.config.ipor.mjs              ← site: "https://ipor.io", srcDir: "./src/sites/ipor", outDir: "./dist/ipor"
├── customHttp.fusion.yml              ← CSP headers for fusion.ipor.io
├── customHttp.ipor.yml                ← CSP headers for ipor.io
└── package.json                        ← build:fusion, build:ipor, dev:fusion, dev:ipor
```

### Verification

After implementation:

- `npm run build:fusion` produces `dist/fusion/` with the existing 3-page site
- `npm run build:ipor` produces `dist/ipor/` with the new 3-page site
- `npm run build` runs both builds sequentially
- `npm run dev:fusion` serves the fusion site on port 4321
- `npm run dev:ipor` serves the ipor site on port 4322
- All existing tests pass
- CI builds both sites
- CD deploys each site to its respective Amplify app

## What We're NOT Doing

- **Not migrating to pnpm workspaces** — dual config files are simpler for two closely-related sites
- **Not creating the ipor.io Amplify app** — already exists per user confirmation
- **Not changing the content of fusion.ipor.io** — existing site remains identical
- **Not implementing dark mode for ipor.io** — Figma design shows light-only, but we keep the theme system for consistency (the shared footer/cookie-banner depend on it)
- **Not adding new CI secrets** — assuming ipor.io Amplify app uses the same AWS credentials (or secrets are already configured)

## Implementation Approach

Use Astro's `--config` CLI flag to run separate builds with different config files. Each config sets its own `srcDir`, `outDir`, and `site`. Shared code lives in `src/shared/` and is imported via the `@/` alias (adjusted to point to `src/` root). Site-specific code lives in `src/sites/{fusion,ipor}/`.

The key insight: Astro's `srcDir` controls where pages and layouts are resolved from, but imports can still reach outside it via relative paths or aliases. So `src/sites/fusion/pages/index.astro` can `import Footer from "@/shared/components/footer.astro"`.

---

## Phase 1: Restructure Directories

### Overview

Move existing files into the new directory structure without changing any functionality. The existing build must still work after this phase (using a renamed config).

### Changes Required:

#### 1. Create directory structure

```bash
mkdir -p src/shared/components
mkdir -p src/shared/data
mkdir -p src/shared/layouts
mkdir -p src/shared/styles
mkdir -p src/sites/fusion/pages
mkdir -p src/sites/fusion/components
mkdir -p src/sites/fusion/app/components/ui
mkdir -p src/sites/fusion/app/lib
mkdir -p src/sites/ipor/pages
mkdir -p src/sites/ipor/components
```

#### 2. Move shared components

Move these files from `src/components/` to `src/shared/components/`:

- `footer.astro`
- `cookie-banner.astro`
- `base-head.astro`
- `theme-script.astro`
- `analytics-script.astro`
- `use-theme.ts`
- `use-theme.test.ts`
- `privacy-policy-content.astro`
- `terms-of-use-content.astro`

Move `src/data/footer-links.ts` to `src/shared/data/footer-links.ts`.

Move `src/layouts/base-layout.astro` to `src/shared/layouts/base-layout.astro`.

Move all files from `src/styles/` to `src/shared/styles/`.

#### 3. Move fusion-specific components

Move these files from `src/components/` to `src/sites/fusion/components/`:

- `nav.astro`
- `trust-bar.astro`
- `testimonials.astro`
- `how-it-works.astro`
- `solutions.astro`
- `comparison-table.astro`
- `final-cta.astro`
- `transparency-features.astro`
- `security.astro`

Move all files from `src/app/` to `src/sites/fusion/app/`.

Move all files from `src/pages/` to `src/sites/fusion/pages/`.

Move `src/integrations/csp-style-fix.ts` to `src/integrations/csp-style-fix.ts` (stays in place — shared).

#### 4. Update all import paths

Every moved file needs its imports updated. The strategy:

- Shared code uses `@/shared/...` imports
- Site-specific code uses relative imports for same-site files, `@/shared/...` for shared code
- The `@` alias remains pointing to `./src`

Key files that need import updates:

**`src/shared/layouts/base-layout.astro`** — update imports:

```astro
---
import BaseHead from "@/shared/components/base-head.astro";
import ThemeScript from "@/shared/components/theme-script.astro";
import AnalyticsScript from "@/shared/components/analytics-script.astro";
import "@/shared/styles/index.css";

interface Props {
  title: string;
  description: string;
  image?: string;
  hideNav?: boolean;
  navComponent?: any;
}

const { title, description, image, hideNav = false, navComponent: Nav } = Astro.props;
---
```

Note: The layout now accepts `navComponent` as a prop instead of importing Nav directly, since each site has its own nav. When `hideNav` is true or no nav component is provided, no nav renders.

**`src/shared/components/footer.astro`** — update import:

```astro
import { linkColumns } from "@/shared/data/footer-links";
```

**`src/shared/styles/tailwind.css`** — update source glob:

```css
@import "tailwindcss" source(none);
@source '../../**/*.{js,ts,jsx,tsx,astro}';
```

The glob must reach all files in both `src/shared/` and `src/sites/` from `src/shared/styles/`.

**`src/sites/fusion/pages/index.astro`** — update imports:

```astro
---
import BaseLayout from "@/shared/layouts/base-layout.astro";
import Nav from "../components/nav.astro";
import { Hero } from "../app/components/hero.tsx";
import { fetchTvm } from "../app/lib/fetch-tvm";
import TransparencyFeatures from "../components/transparency-features.astro";
import Testimonials from "../components/testimonials.astro";
import { Benefits } from "../app/components/benefits.tsx";
import HowItWorks from "../components/how-it-works.astro";
import Solutions from "../components/solutions.astro";
import TrustBar from "../components/trust-bar.astro";
import ComparisonTable from "../components/comparison-table.astro";
import Security from "../components/security.astro";
import FinalCTA from "../components/final-cta.astro";
import Footer from "@/shared/components/footer.astro";
import CookieBanner from "@/shared/components/cookie-banner.astro";
---
```

**`src/sites/fusion/pages/privacy-policy.astro`** and **`terms-of-use.astro`** — update imports:

```astro
---
import BaseLayout from "@/shared/layouts/base-layout.astro";
import Nav from "../components/nav.astro";
import PrivacyPolicyContent from "@/shared/components/privacy-policy-content.astro";
import Footer from "@/shared/components/footer.astro";
import CookieBanner from "@/shared/components/cookie-banner.astro";
---
```

**`src/sites/fusion/app/components/ui/fusion-flow.tsx`** — update `useTheme` import:

```ts
import { useTheme } from "@/shared/components/use-theme";
```

All other fusion-specific component imports that reference other fusion components use relative paths (e.g., `../components/nav.astro`) and don't need changes since they moved together.

#### 5. Handle the Nav component in base-layout

The current `base-layout.astro` imports `Nav` directly from `../components/nav.astro`. Since each site has a different nav, we have two options:

**Option A (recommended)**: Remove the Nav from base-layout entirely. Each page imports and renders its own Nav before the layout slot content. This is simpler and more explicit.

**Updated `src/shared/layouts/base-layout.astro`**:

```astro
---
import BaseHead from "@/shared/components/base-head.astro";
import ThemeScript from "@/shared/components/theme-script.astro";
import AnalyticsScript from "@/shared/components/analytics-script.astro";
import "@/shared/styles/index.css";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image } = Astro.props;
---

<html lang="en">
  <head>
    <BaseHead title={title} description={description} image={image} />
    <ThemeScript />
    <AnalyticsScript />
  </head>
  <body>
    <slot />
  </body>
</html>
```

Each page then handles its own nav:

```astro
<BaseLayout title="..." description="...">
  <Nav />
  <main>...</main>
  <Footer />
  <CookieBanner />
</BaseLayout>
```

This removes the `hideNav` prop too, since pages simply don't include `<Nav />` when they don't want it.

### Success Criteria:

#### Automated Verification:

- [ ] `npx astro check --config astro.config.fusion.mjs` passes with zero errors
- [ ] `npx astro build --config astro.config.fusion.mjs` produces `dist/fusion/` with `index.html`, `privacy-policy/index.html`, `terms-of-use/index.html`
- [ ] `npm test` — all existing unit tests pass
- [ ] `npm run lint` — no linting errors
- [ ] `npm run knip` — no dead code detected
- [ ] Diff the HTML output of `dist/fusion/index.html` against the previous `dist/index.html` — content should be identical (ignoring asset hashes)

#### Manual Verification:

- [ ] `npx astro dev --config astro.config.fusion.mjs` serves the fusion site — navigate all pages, verify no broken links/images
- [ ] Theme toggle works
- [ ] Mobile nav works
- [ ] Cookie banner works

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 2.

---

## Phase 2: Create Dual Astro Configs

### Overview

Create two separate Astro config files and update package.json scripts.

### Changes Required:

#### 1. Rename and update config files

**Rename** `astro.config.mjs` → `astro.config.fusion.mjs` and update:

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cspStyleFix from "./src/integrations/csp-style-fix";

export default defineConfig({
  site: "https://fusion.ipor.io",
  srcDir: "./src/sites/fusion",
  outDir: "./dist/fusion",
  output: "static",
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
        "connect-src 'self' https://api.ipor.io https://*.google-analytics.com https://*.analytics.google.com",
        "frame-src 'none'",
        "object-src 'none'",
      ],
      styleDirective: {
        resources: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
      },
    },
  },
  integrations: [
    react(),
    sitemap(),
    cspStyleFix({ yamlFile: "customHttp.fusion.yml" }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { "@": new URL("./src", import.meta.url).pathname },
    },
    assetsInclude: ["**/*.svg"],
  },
});
```

**Create** `astro.config.ipor.mjs`:

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cspStyleFix from "./src/integrations/csp-style-fix";

export default defineConfig({
  site: "https://ipor.io",
  srcDir: "./src/sites/ipor",
  outDir: "./dist/ipor",
  output: "static",
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
        "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com",
        "frame-src 'none'",
        "object-src 'none'",
      ],
      styleDirective: {
        resources: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
      },
    },
  },
  integrations: [
    react(),
    sitemap(),
    cspStyleFix({ yamlFile: "customHttp.ipor.yml" }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { "@": new URL("./src", import.meta.url).pathname },
    },
    assetsInclude: ["**/*.svg"],
  },
});
```

Note: The ipor config omits `connect-src https://api.ipor.io` since the ipor.io site doesn't fetch TVM data.

#### 2. Parameterize csp-style-fix integration

**File**: `src/integrations/csp-style-fix.ts`

Update to accept a `yamlFile` option:

```ts
interface CspStyleFixOptions {
  yamlFile?: string;
}

export default function cspStyleFix(
  options: CspStyleFixOptions = {},
): AstroIntegration {
  const { yamlFile = "customHttp.yml" } = options;
  // ... existing code ...
  // Change line 142:
  const yamlFiles = [resolve(process.cwd(), yamlFile)];
  // ... rest unchanged ...
}
```

#### 3. Create per-site HTTP header files

**Copy** `customHttp.yml` → `customHttp.fusion.yml` (identical content).

**Create** `customHttp.ipor.yml` (same structure, but `connect-src` without `https://api.ipor.io`):

```yaml
customHeaders:
  - pattern: "**"
    headers:
      - key: "Content-Security-Policy"
        value: "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com; frame-src 'none'; object-src 'none'"
      - key: "Strict-Transport-Security"
        value: "max-age=31536000 ; includeSubDomains"
      - key: "X-Content-Type-Options"
        value: "nosniff"
      - key: "Access-Control-Allow-Credentials"
        value: "true"
      - key: "Access-Control-Allow-Headers"
        value: "*"
      - key: "Access-Control-Allow-Methods"
        value: "GET,OPTIONS"
      - key: "Access-Control-Max-Age"
        value: "600"
      - key: "Access-Control-Expose-Headers"
        value: "*"
      - key: "Access-Control-Request-Headers"
        value: "*"
      - key: "Access-Control-Request-Method"
        value: "GET,OPTIONS"
```

**Delete** the old `customHttp.yml`.

#### 4. Update package.json scripts

```json
{
  "scripts": {
    "setup": "npm install && npm exec allow-scripts && npx husky",
    "dev": "npm run dev:fusion",
    "dev:fusion": "astro dev --config astro.config.fusion.mjs",
    "dev:ipor": "astro dev --config astro.config.ipor.mjs --port 4322",
    "build": "npm run build:fusion && npm run build:ipor",
    "build:fusion": "astro check --config astro.config.fusion.mjs && astro build --config astro.config.fusion.mjs",
    "build:ipor": "astro check --config astro.config.ipor.mjs && astro build --config astro.config.ipor.mjs",
    "preview": "npm run preview:fusion",
    "preview:fusion": "astro preview --config astro.config.fusion.mjs",
    "preview:ipor": "astro preview --config astro.config.ipor.mjs --port 4322",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "format": "prettier --write \"src/**/*.{ts,tsx,html,css,astro}\"",
    "test:visual": "npx playwright test",
    "test:visual:update": "npx playwright test --update-snapshots",
    "knip": "knip",
    "prepare": "husky"
  }
}
```

#### 5. Update vitest.config.ts

No changes needed — tests import from `src/` which is still the root, and the `@` alias still points to `./src`.

#### 6. Update playwright.config.ts

Update to serve the fusion site for visual tests:

```ts
webServer: {
  command: "npx serve dist/fusion -l 4322 -s",
  // ... rest unchanged
}
```

#### 7. Update .gitignore

Ensure `dist/` is already ignored (it should be). Both `dist/fusion/` and `dist/ipor/` will be covered.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build:fusion` produces `dist/fusion/` successfully
- [ ] `npm run build:ipor` fails gracefully (ipor pages don't exist yet — expected; or create a placeholder index.astro first)
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `customHttp.fusion.yml` gets script hashes written after fusion build

#### Manual Verification:

- [ ] `npm run dev:fusion` serves fusion site correctly on port 4321
- [ ] All fusion pages work identically to before the restructure

**Implementation Note**: After completing this phase, pause for manual confirmation before proceeding to Phase 3.

---

## Phase 3: Build the ipor.io Site

### Overview

Create the new ipor.io landing page matching the Figma design, plus legal pages.

### Changes Required:

#### 1. Create ipor nav component

**File**: `src/sites/ipor/components/nav.astro`

A simplified nav with just Logo + "Discover Fusion" + "Launch App":

```astro
---
---
<header>
  <nav
    id="main-nav"
    class="group fixed z-20 w-full transition-all duration-300 bg-background/80 backdrop-blur-2xl"
  >
    <div class="mx-auto max-w-[1200px] px-6 transition-all duration-300">
      <div
        id="nav-inner"
        class="relative flex items-center justify-between border-b border-transparent py-4 transition-all duration-300"
      >
        <!-- Logo -->
        <a href="/" aria-label="home" class="flex items-center">
          <img
            src="/brand/fusion-light.png"
            alt="Fusion by IPOR"
            class="h-8 w-auto object-contain block dark:hidden"
          />
          <img
            src="/brand/fusion-dark.png"
            alt="Fusion by IPOR"
            class="h-8 w-auto object-contain hidden dark:block"
          />
        </a>

        <!-- Right: CTAs -->
        <div class="flex items-center gap-3">
          <a
            href="https://fusion.ipor.io"
            class="inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm transition-all duration-300 border-[#9BA3AF] text-black hover:bg-[#EFEFEF] dark:border-[#45484D] dark:text-muted-foreground dark:hover:bg-[#22272C] dark:hover:text-foreground"
          >
            Discover Fusion
          </a>
          <a
            href="https://app.ipor.io/fusion"
            target="_blank"
            rel="noopener noreferrer"
            class="brand-gradient inline-flex items-center justify-center gap-2 rounded-full border border-primary px-5 py-2 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-70"
          >
            <span>Launch App</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </nav>
</header>

<script>
  const navInner = document.getElementById("nav-inner")!;
  window.addEventListener(
    "scroll",
    () => {
      navInner.classList.toggle("border-border/50", window.scrollY > 50);
    },
    { passive: true },
  );
</script>
```

#### 2. Create ipor index page

**File**: `src/sites/ipor/pages/index.astro`

The main landing page with the hero section from the Figma design:

```astro
---
import BaseLayout from "@/shared/layouts/base-layout.astro";
import Nav from "../components/nav.astro";
import Footer from "@/shared/components/footer.astro";
import CookieBanner from "@/shared/components/cookie-banner.astro";
---

<BaseLayout
  title="Fusion by IPOR | Onchain Vault Infrastructure"
  description="Build your own institutional-grade yield strategies or explore existing ones via the Fusion App."
>
  <Nav />
  <main class="min-h-screen overflow-x-hidden transition-colors duration-500 bg-background text-black dark:text-white">
    <!-- Hero section -->
    <section class="mx-auto max-w-[1200px] px-6 pt-28 pb-20 md:pt-36 md:pb-28">
      <h1 class="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
        Meet Fusion
      </h1>
      <p class="mt-4 max-w-2xl text-lg text-body-foreground">
        Build your own institutional-grade yield strategies or explore existing ones via the Fusion App.
      </p>

      <!-- Two cards -->
      <div class="mt-12 grid gap-6 md:grid-cols-2">
        <!-- Card 1: Discover Fusion -->
        <div class="rounded-2xl border p-8 transition-colors border-border bg-card">
          <div class="mb-6 flex items-center gap-3">
            <img src="/brand/fusion-light.png" alt="Fusion by IPOR" class="h-6 w-auto block dark:hidden" />
            <img src="/brand/fusion-dark.png" alt="Fusion by IPOR" class="h-6 w-auto hidden dark:block" />
          </div>
          <h2 class="text-2xl font-medium tracking-tight md:text-3xl">
            Vault infrastructure for
            <span class="bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end bg-clip-text text-transparent">institutional-grade</span>
            yield.
          </h2>
          <p class="mt-4 text-body-foreground">
            Create and manage onchain vaults within a battle-tested risk framework.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="https://fusion.ipor.io"
              class="brand-gradient inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-70"
            >
              Discover Fusion
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
            <span class="text-sm text-muted-foreground">fusion.ipor.io</span>
          </div>
        </div>

        <!-- Card 2: The Live App -->
        <div class="rounded-2xl border p-8 transition-colors border-border bg-card">
          <div class="flex flex-col gap-6">
            <div>
              <div class="mb-6 flex items-center gap-3">
                <img src="/brand/fusion-light.png" alt="Fusion by IPOR" class="h-6 w-auto block dark:hidden" />
                <img src="/brand/fusion-dark.png" alt="Fusion by IPOR" class="h-6 w-auto hidden dark:block" />
              </div>
              <h2 class="text-2xl font-medium tracking-tight md:text-3xl">
                The <span class="bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end bg-clip-text text-transparent">Live</span> App
              </h2>
              <p class="mt-4 text-body-foreground">
                Discover existing yield strategies powered by Fusion. Get started in one-click.
              </p>
              <a
                href="https://app.ipor.io/fusion"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-6 brand-gradient inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-70"
              >
                Launch App
              </a>
            </div>
            <img
              src="/fusion-app-screenshot.png"
              alt="Fusion App"
              class="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
  <Footer />
  <CookieBanner />
</BaseLayout>
```

Note: We need a screenshot of the Fusion app (`/fusion-app-screenshot.png`) for the right card. This image needs to be added to `public/`.

#### 3. Create ipor legal pages

**File**: `src/sites/ipor/pages/privacy-policy.astro`

```astro
---
import BaseLayout from "@/shared/layouts/base-layout.astro";
import Nav from "../components/nav.astro";
import PrivacyPolicyContent from "@/shared/components/privacy-policy-content.astro";
import Footer from "@/shared/components/footer.astro";
import CookieBanner from "@/shared/components/cookie-banner.astro";
---

<BaseLayout
  title="Privacy Policy | IPOR"
  description="Privacy Policy for IPOR - Onchain Vault Infrastructure"
>
  <Nav />
  <PrivacyPolicyContent />
  <Footer />
  <CookieBanner />
</BaseLayout>
```

**File**: `src/sites/ipor/pages/terms-of-use.astro`

```astro
---
import BaseLayout from "@/shared/layouts/base-layout.astro";
import Nav from "../components/nav.astro";
import TermsOfUseContent from "@/shared/components/terms-of-use-content.astro";
import Footer from "@/shared/components/footer.astro";
import CookieBanner from "@/shared/components/cookie-banner.astro";
---

<BaseLayout
  title="Terms of Use | IPOR"
  description="Terms of Use for IPOR - Onchain Vault Infrastructure"
>
  <Nav />
  <TermsOfUseContent />
  <Footer />
  <CookieBanner />
</BaseLayout>
```

#### 4. Add the Fusion App screenshot

Extract or screenshot the app UI from `https://app.ipor.io/fusion` and save as `public/fusion-app-screenshot.png`. This is the dark-themed app dashboard shown in the Figma design's right card.

#### 5. Handle the Cookie Policy page

The Figma footer links to `/cookie-policy` which doesn't currently exist. Two options:

- **Option A**: Add a `cookie-policy.astro` page to both sites (requires content)
- **Option B**: Update footer links to point to `/privacy-policy` instead (the privacy policy typically covers cookies)

Decision needed from user — for now, omit `/cookie-policy` and keep footer links as-is (they already point to `/privacy-policy` and `/terms-of-use` in the current implementation). The Figma footer links differ slightly from the current implementation — we keep the current footer unchanged since it's shared.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build:ipor` produces `dist/ipor/` with `index.html`, `privacy-policy/index.html`, `terms-of-use/index.html`
- [ ] `npm run build` (both sites) succeeds
- [ ] `npm test` passes
- [ ] `npm run lint` passes

#### Manual Verification:

- [ ] `npm run dev:ipor` serves the ipor site on port 4322
- [ ] Hero section matches the Figma design (two cards layout, gradient text, correct links)
- [ ] Footer renders correctly with all link columns
- [ ] Cookie banner appears and functions
- [ ] Legal pages render correctly
- [ ] All links work (Discover Fusion → fusion.ipor.io, Launch App → app.ipor.io/fusion)
- [ ] Responsive layout works on mobile (cards stack vertically)

**Implementation Note**: After completing this phase, pause for manual confirmation (especially visual comparison with Figma) before proceeding to Phase 4.

---

## Phase 4: Update CI/CD for Dual Deployment

### Overview

Update GitHub Actions workflows to build and deploy both sites.

### Changes Required:

#### 1. Update test-webapp.yml

The build step currently runs `npm run build`. Since the `build` script in package.json now runs both builds, no change is needed — both sites are built and verified in CI.

However, if we want to be explicit or run builds in parallel:

```yaml
- name: Build Fusion
  if: inputs.build-enabled
  run: npm run build:fusion
  env:
    CI: ${{ inputs.ci-env-var }}

- name: Build IPOR
  if: inputs.build-enabled
  run: npm run build:ipor
  env:
    CI: ${{ inputs.ci-env-var }}
```

#### 2. Update cd.yml for dual deploy

The CD workflow needs to deploy both sites. The fusion site goes to `ipor-dev-fusion-website` (existing), the ipor site goes to a new Amplify app name.

```yaml
name: CD

on:
  push:
    branches:
      - main
      - develop

jobs:
  notify:
    uses: ./.github/workflows/notify-slack.yml
    secrets:
      SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}

  test:
    needs:
      - notify
    uses: ./.github/workflows/test-webapp.yml
    with:
      build-enabled: true
      tests-enabled: true

  deploy-dev-fusion:
    if: ${{ needs.notify.outputs.branch-name == 'develop' }}
    needs:
      - notify
      - test
    uses: ./.github/workflows/deploy-amplify.yml
    with:
      aws-region: eu-central-1
      app-name: ipor-dev-fusion-website
      branch: develop
    secrets:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

  deploy-dev-ipor:
    if: ${{ needs.notify.outputs.branch-name == 'develop' }}
    needs:
      - notify
      - test
    uses: ./.github/workflows/deploy-amplify.yml
    with:
      aws-region: eu-central-1
      app-name: ipor-dev-main-website
      branch: develop
    secrets:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

  report:
    if: ${{ always() }}
    needs:
      - notify
      - test
      - deploy-dev-fusion
      - deploy-dev-ipor
    uses: ./.github/workflows/report-slack.yml
    secrets:
      SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
    with:
      success: ${{ (needs.notify.outputs.branch-name == 'develop' && needs.test.result == 'success' && needs.deploy-dev-fusion.result == 'success' && needs.deploy-dev-ipor.result == 'success') || (needs.notify.outputs.branch-name == 'main' && needs.test.result == 'success') }}
      slack-status-msg-id: ${{ needs.notify.outputs.slack-status-msg-id }}
```

Note: `ipor-dev-main-website` is a placeholder — the actual Amplify app name needs to match what's configured in AWS. Ask the user for the correct name.

#### 3. Update deploy-mainnet.yml for dual deploy

```yaml
name: Deploy mainnet

on: workflow_dispatch

jobs:
  notify:
    uses: ./.github/workflows/notify-slack.yml
    secrets:
      SLACK_BOT_TOKEN: ${{ secrets.MAINNET_SLACK_BOT_TOKEN }}
    with:
      status-slack-channel-name: github-mainnet-ci

  deploy-mainnet-fusion:
    needs:
      - notify
    uses: ./.github/workflows/deploy-amplify.yml
    with:
      aws-region: eu-central-1
      app-name: ipor-mainnet-fusion-website
      branch: main
    secrets:
      AWS_ACCESS_KEY_ID: ${{ secrets.MAINNET_AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.MAINNET_AWS_SECRET_ACCESS_KEY }}

  deploy-mainnet-ipor:
    needs:
      - notify
    uses: ./.github/workflows/deploy-amplify.yml
    with:
      aws-region: eu-central-1
      app-name: ipor-mainnet-main-website
      branch: main
    secrets:
      AWS_ACCESS_KEY_ID: ${{ secrets.MAINNET_AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.MAINNET_AWS_SECRET_ACCESS_KEY }}

  report:
    if: ${{ always() }}
    needs:
      - notify
      - deploy-mainnet-fusion
      - deploy-mainnet-ipor
    uses: ./.github/workflows/report-slack.yml
    secrets:
      SLACK_BOT_TOKEN: ${{ secrets.MAINNET_SLACK_BOT_TOKEN }}
    with:
      success: ${{ needs.deploy-mainnet-fusion.result == 'success' && needs.deploy-mainnet-ipor.result == 'success' }}
      slack-status-msg-id: ${{ needs.notify.outputs.slack-status-msg-id }}
      status-slack-channel-name: github-mainnet-ci
      alarms-slack-channel-name: alarms-mainnet-github
```

#### 4. Amplify build configuration (AWS Console — manual step)

The `deploy-amplify.yml` workflow triggers Amplify's own build via `aws amplify start-job --job-type RELEASE`. The Amplify app's build settings (commands, env vars, artifact directory) are configured **in the AWS Amplify console**, not in the repo. This is confirmed by the existing ipor-website repo which uses the same pattern.

Each Amplify app must be configured with the correct build command and artifact path:

| Amplify App                   | Repo                                                          | Build Command          | Artifact Dir  |
| ----------------------------- | ------------------------------------------------------------- | ---------------------- | ------------- |
| `ipor-dev-fusion-website`     | fusion-website                                                | `npm run build:fusion` | `dist/fusion` |
| `ipor-mainnet-fusion-website` | fusion-website                                                | `npm run build:fusion` | `dist/fusion` |
| `ipor-dev-main-website`       | fusion-website (currently ipor-website — **must be changed**) | `npm run build:ipor`   | `dist/ipor`   |
| `ipor-mainnet-main-website`   | fusion-website (currently ipor-website — **must be changed**) | `npm run build:ipor`   | `dist/ipor`   |

**`customHttp.yml` handling**: Amplify looks for `customHttp.yml` at the repo root. Since each Amplify app only builds one site, the `csp-style-fix.ts` integration will **also copy** the site-specific YAML to the root `customHttp.yml` after writing hashes:

```ts
// At the end of the hook, after writing hashes:
import { copyFile } from "node:fs/promises";
const rootYaml = resolve(process.cwd(), "customHttp.yml");
const siteYaml = resolve(process.cwd(), yamlFile);
if (rootYaml !== siteYaml) {
  await copyFile(siteYaml, rootYaml);
}
```

This ensures whichever site Amplify builds, the correct headers end up in the canonical `customHttp.yml` location.

**Action required by user**: Reconfigure `ipor-dev-main-website` and `ipor-mainnet-main-website` in the AWS Amplify console to:

1. Point to the `fusion-website` GitHub repo (instead of `ipor-website`)
2. Set build command to `npm run build:ipor`
3. Set artifact base directory to `dist/ipor`
4. Update Node.js version to `22.14.0`
5. Remove the old Next.js-related env vars (`NEXT_PUBLIC_RPC_URL_*`, `NEXT_PUBLIC_API_URL`, `ENV_PROFILE`)

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds (builds both sites)
- [ ] `customHttp.fusion.yml` has correct script hashes after build
- [ ] `customHttp.ipor.yml` has correct script hashes after build
- [ ] CI workflow (on PR) builds both sites without errors

#### Manual Verification:

- [ ] Deploy fusion site to dev Amplify app — verify site works
- [ ] Deploy ipor site to dev Amplify app — verify site works
- [ ] Verify CSP headers are correct for each domain

**Implementation Note**: After completing this phase, pause for manual confirmation. The Amplify app names and AWS console settings need to be verified with the user.

---

## Phase 5: Cleanup and Polish

### Overview

Remove old files, update documentation, ensure everything is consistent.

### Changes Required:

#### 1. Remove old files

- Delete `astro.config.mjs` (replaced by `astro.config.fusion.mjs`)
- Delete `customHttp.yml` (replaced by per-site YAML files)
- Delete empty directories: `src/components/`, `src/app/`, `src/pages/`, `src/layouts/`, `src/styles/`, `src/data/`

#### 2. Update CLAUDE.md

Update the Architecture section to reflect the new structure:

```markdown
## Architecture

- `src/shared/` — Code shared across both sites (components, layouts, styles, data)
- `src/sites/fusion/` — Fusion site (fusion.ipor.io) pages, components, React islands
- `src/sites/ipor/` — IPOR site (ipor.io) pages and components
- `src/integrations/` — Custom Astro integrations (CSP fix)
- `public/` — Static assets shared by both sites

### Build Commands

- `npm run build:fusion` — Build fusion.ipor.io → `dist/fusion/`
- `npm run build:ipor` — Build ipor.io → `dist/ipor/`
- `npm run build` — Build both sites
- `npm run dev:fusion` — Dev server for fusion (port 4321)
- `npm run dev:ipor` — Dev server for ipor (port 4322)
```

#### 3. Update knip config (if needed)

Knip may need to be told about the two entry points. Check if `knip.json` or `knip` config in `package.json` exists and update entry patterns to include both `src/sites/*/pages/**`.

#### 4. Update visual tests

Update Playwright config and any snapshot tests to work with `dist/fusion/` path. Update snapshot baselines if needed.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] `npm run knip` passes (no false positives from restructure)
- [ ] No orphaned files in old directories

#### Manual Verification:

- [ ] Both sites render correctly in dev mode
- [ ] CLAUDE.md accurately describes the new structure

---

## Testing Strategy

### Unit Tests

- Existing `use-theme.test.ts` and `utils.test.ts` should continue to pass (imports updated)
- No new unit tests needed for the restructure itself

### Integration / Build Tests

- Both `npm run build:fusion` and `npm run build:ipor` must succeed
- CSP meta tags must be present and correct in both sites' HTML
- Script hashes must be written to respective YAML files

### Visual Regression Tests

- Update Playwright to test both sites (or at minimum, the fusion site to catch regressions)
- Consider adding a basic visual test for ipor.io

### Manual Testing

1. Fusion site: full navigation, theme toggle, mobile nav, cookie banner, all sections
2. IPOR site: hero section, card links, footer, cookie banner, legal pages
3. Both sites: responsive on mobile, CSP headers correct (check via browser DevTools)

## Performance Considerations

- Both builds share the same `node_modules` — no duplicate dependency installation
- Building sequentially (`build:fusion && build:ipor`) adds build time but is simpler than parallel builds
- The ipor.io site is much simpler (1 content page, no React islands, no API calls) — its build will be fast
- `public/` assets are duplicated in both `dist/` directories — this is expected with static builds

## Open Items Requiring User Input

None — all resolved.

## Resolved Decisions

- **Fusion App screenshot**: Captured from `https://app.ipor.io/fusion` → saved to `public/fusion-app-screenshot.png`
- **Cookie Policy page**: Skipped — no `/cookie-policy` page will be created. Footer links remain as-is.
- **OG image for ipor.io**: Reuse existing `fusion-og-default.png`

## References

- Original ticket: `thoughts/tickets/fsn_00027-two-separate-builds.md`
- Figma design: https://fusionhome.figma.site/home
- Astro `--config` flag: https://docs.astro.build/en/reference/cli-reference/
- Astro `srcDir`/`outDir` config: https://docs.astro.build/en/reference/configuration-reference/
