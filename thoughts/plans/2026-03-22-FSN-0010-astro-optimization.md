# Astro Optimization — React-to-Astro Conversion + OG Image + Visual Regression Tests

## Overview

Convert 6 static React island sections to zero-JS Astro components, create the missing OG image, fix the broken cookie settings link, and add Playwright-based visual regression tests. This eliminates unnecessary client-side JavaScript for sections that have no runtime interactivity beyond theme-dependent styling — which is now handled entirely via CSS `dark:` variants.

## Current State Analysis

- **12 React islands** on the index page, all hydrated via `client:load` or `client:visible`
- **6 of these** (`final-cta`, `trust-bar`, `transparency-features`, `security`, `footer`, `testimonials`) use `useTheme()` only for `isDark` branching — no real interactivity
- Theme system is already CSS-only (`html.dark` class + `dark:` Tailwind variants in `theme.css`)
- `public/og-default.png` is referenced in `base-head.astro:8` but does not exist
- **Cookie settings link is broken**: Footer calls `onOpenCookieSettings?.()` but index.astro never passes the prop; CookieBannerIsland listens for `"open-cookie-settings"` CustomEvent but nothing dispatches it
- Footer is also used in `terms-of-use-page.tsx` and `privacy-policy-page.tsx` (React islands) — these will keep using the React footer
- `public/fusion.png` exists (1381x724px) and can be resized for OG image (1200x630px)
- Testing: Vitest + Testing Library only — no Playwright or visual regression testing

### Key Discoveries:

- Many `isDark` branches resolve to identical values on both sides (e.g., `isDark ? "text-[#8429FF]" : "text-[#8429FF]"`) — these simplify to a single class
- `transparency-icons.tsx` icons are pure SVG with SMIL animation — no React hooks or state — can be inlined as raw SVG
- `ImageWithFallback` in testimonials uses `useState` for error handling — replaceable with `<img onerror="...">`
- `AnimatedEye` blink eyelid has `className="text-[#161A20] dark:text-[#161A20]"` (both identical) — preserve existing behavior
- CodeBlock in `security.tsx` has ~10 theme-dependent color variables that need CSS custom properties

## Desired End State

After this plan is complete:

- 6 sections render as static HTML with zero client-side JavaScript
- `public/og-default.png` exists at 1200x630px for social sharing
- Cookie settings link in footer dispatches CustomEvent, CookieBannerIsland responds
- Visual regression tests cover all converted sections in both light/dark themes
- Bundle size is measurably reduced (fewer React islands = less JS shipped)

### Verification:

- `npm run build` succeeds
- `npm run test` passes (unit tests)
- `npx playwright test` passes (visual regression)
- Manual: all sections render identically to current state in both themes
- Manual: cookie settings link opens the cookie banner

## What We're NOT Doing

- Converting sections that need real interactivity (`hero`, `benefits`, `how-it-works`, `solutions`, `comparison-table`, `nav`, `cookie-banner-island`)
- Refactoring `terms-of-use-page.tsx` or `privacy-policy-page.tsx` to use Astro footer (they embed Footer inside React islands — separate task)
- Deleting `footer.tsx` (still needed by subpages above)
- Redesigning or improving visual appearance of any section
- Fixing the `AnimatedEye` blink color issue (both theme values are identical — existing behavior)

## Implementation Approach

Convert components in order of increasing complexity. Batch the 3 simplest together. Each phase produces a verifiable intermediate state. The React `.tsx` files for components only used on index.astro can be deleted after conversion (except `footer.tsx` which is shared).

---

## Phase 1: OG Image

### Overview

Create the missing `public/og-default.png` from the existing `public/fusion.png`.

### Changes Required:

#### 1. Generate OG image

Use `sips` (macOS built-in) to resize `public/fusion.png` (1381x724) to 1200x630:

```bash
sips -z 630 1200 public/fusion.png --out public/og-default.png
```

Note: `sips -z` stretches to exact dimensions. If aspect ratio must be preserved, crop first:

```bash
# Crop to 1200x630 from center (if needed)
sips --cropToHeightWidth 630 1200 public/fusion.png --out public/og-default.png
```

### Success Criteria:

#### Automated Verification:

- [ ] `public/og-default.png` exists
- [ ] Image dimensions are 1200x630: `sips -g pixelWidth -g pixelHeight public/og-default.png`
- [ ] `npm run build` succeeds

#### Manual Verification:

- [ ] OG image looks acceptable (not distorted or cropped badly)
- [ ] Test with a social sharing preview tool (e.g., paste URL in Slack/Discord)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Batch Conversion — `final-cta`, `trust-bar`, `transparency-features`

### Overview

Convert the 3 simplest sections. All have zero JS beyond `useTheme()` (except `final-cta` which has one `onMouseEnter`/`onMouseLeave` → `hover:opacity-70`).

### Changes Required:

#### 1. `src/components/final-cta.astro` (from `src/app/components/final-cta.tsx`, 97 lines)

**Conversion rules applied:**

- Remove `useTheme()`, `cn()`, `ArrowUpRight` imports
- `isDark ? "text-white" : "text-[#000000]"` → `class="text-[#000000] dark:text-white"`
- `isDark ? "text-[#9BA3AF]" : "text-[#70747A]"` → `class="text-[#70747A] dark:text-[#9BA3AF]"`
- `isDark ? "bg-[#8429FF]" : "bg-[#8429FF]"` → `class="bg-[#8429FF]"` (identical branches)
- `isDark ? "text-[#8429FF]" : "text-[#8429FF]"` → `class="text-[#8429FF]"` (identical branches)
- `isDark ? "border-[#8429FF]" : "border-[#8429FF]"` → `class="border-[#8429FF]"` (identical branches)
- `isDark ? gradient : gradient` → single `style` (identical branches)
- `onMouseEnter`/`onMouseLeave` setting opacity → `class="hover:opacity-70"` + `transition-opacity duration-300`
- `isDark ? "border-[#2E3137] ..." : "border-[#9BA3AF] ..."` → `class="border-[#9BA3AF] dark:border-[#2E3137] ..."`
- `ArrowUpRight` SVG → inline `<svg>` (lucide arrow-up-right: `<path d="M7 7h10v10M7 17L17 7"/>`)
- `className` → `class`

```astro
---
// No imports needed — pure static template
---

<section class="relative py-20 md:py-40">
  <!-- Purple glow -->
  <div
    class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full opacity-[0.10] blur-[120px] bg-[#8429FF]"
  ></div>

  <div class="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
    <h2
      class="mb-6 text-balance text-[#000000] dark:text-white"
      style="font-family: 'Poppins', sans-serif; font-weight: 500; font-size: clamp(25px, 5vw, 45px); line-height: clamp(38px, 5vw, 60px);"
    >
      The <span class="text-[#8429FF]">Vault</span> layer is ready.
    </h2>
    <p
      class="mx-auto mb-10 max-w-[560px] text-pretty text-base sm:text-lg text-[#70747A] dark:text-[#9BA3AF]"
    >
      Deploy your first vault, deposit into a curated strategy, or embed
      Fusion into your product.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4">
      <a
        href="https://app.ipor.io/fusion"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-3 rounded-full border border-[#8429FF] px-7 py-3 text-[16px] tracking-wide text-white transition-opacity duration-300 hover:opacity-70"
        style="font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: 0.04em; background: linear-gradient(90deg, #8429FF 0%, #6C00FF 100%);"
      >
        <span>Launch App</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
      </a>
      <a
        href="https://docs.ipor.io/build-on-fusion/developer-guide/quick-start-guide"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-[16px] tracking-wide transition-colors duration-300 border-[#9BA3AF] text-black hover:bg-[#EFEFEF] dark:border-[#2E3137] dark:text-[#9BA3AF] dark:hover:border-[#9BA3AF]/40 dark:hover:bg-white/5 dark:hover:text-white"
        style="font-family: 'Poppins', sans-serif; font-weight: 400; letter-spacing: 0.04em;"
      >
        <span>Start Building</span>
      </a>
    </div>
  </div>
</section>
```

#### 2. `src/components/trust-bar.astro` (from `src/app/components/trust-bar.tsx`, 100 lines)

**Conversion rules applied:**

- Data arrays (`topRow`, `bottomRow`) move to frontmatter `const`s
- `isDark` card classes → combined `dark:` variants
- `ArrowUpRight` → inline SVG
- `isDark ? "brightness-0 invert" : "brightness-0"` → `class="brightness-0 dark:invert"`
- Dynamic `style={{ height: ... }}` → per-item inline style in Astro `{...}` loop
- `.map()` → Astro `{items.map(item => (...))}` template

```astro
---
const topRow = [
  { name: "Aave V3", logo: "/logos/aave.png", scale: 0.8 },
  { name: "Morpho", logo: "/logos/morpho.png", scale: 0.9 },
  { name: "Uniswap", logo: "/logos/uniswap.png", scale: 0.99 },
];
const bottomRow = [
  { name: "Compound", logo: "/logos/compound.png", scale: 1 },
  { name: "Pendle", logo: "/logos/pendle.png", scale: 1 },
  { name: "More Protocols", logo: "/logos/more-protocols.png", scale: 1 },
];
const protocols = [...topRow, ...bottomRow];
---

<!-- Template uses dark: variants for all theme-dependent styles -->
<!-- cardClass: border-[#E5E5E5] bg-white hover:... dark:border-[#2E3137] dark:bg-[#161A20] dark:hover:... -->
```

#### 3. `src/components/transparency-features.astro` (from `src/app/components/transparency-features.tsx`, 145 lines)

**Conversion rules applied:**

- SVG icon components from `transparency-icons.tsx` → inline raw SVG in Astro template (no imports needed, they're pure SMIL SVG)
- `features` array with `Icon` component references → array with inline SVG strings or use Astro components
- `mobileTitle` JSX → Astro template with `<span class="sm:hidden">` / `<span class="hidden sm:inline">`
- All `isDark` branches → `dark:` variants

**Approach for icons**: Since the 6 icon components are pure SVG (no React, no hooks), create a small Astro partial or just inline each SVG directly. The cleanest approach: keep `transparency-icons.tsx` export signatures but use them as Astro components (Astro can render `.tsx` without hydration if they export JSX without hooks). **However**, since they import from React implicitly via JSX, the safest approach is to create `src/components/transparency-icons.astro` fragments or inline the SVG directly.

**Recommended**: Inline the SVGs directly since there are only 6, each is ~20-40 lines, and they are only used in this one section.

#### 4. Update `src/pages/index.astro`

Replace React imports with Astro imports for the 3 converted components:

```astro
---
// Remove these:
// import { TransparencyFeatures } from "../app/components/transparency-features.tsx";
// import { TrustBar } from "../app/components/trust-bar.tsx";
// import { FinalCTA } from "../app/components/final-cta.tsx";

// Add these:
import TransparencyFeatures from "../components/transparency-features.astro";
import TrustBar from "../components/trust-bar.astro";
import FinalCTA from "../components/final-cta.astro";
---

<!-- Remove client:visible directives from these three: -->
<TransparencyFeatures />
<TrustBar />
<FinalCTA />
```

#### 5. Delete unused React source files

- Delete `src/app/components/final-cta.tsx`
- Delete `src/app/components/trust-bar.tsx`
- Delete `src/app/components/transparency-features.tsx`
- Keep `src/app/components/ui/transparency-icons.tsx` if used elsewhere; delete if only used by transparency-features

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] No `client:visible` directive on `TransparencyFeatures`, `TrustBar`, or `FinalCTA` in `index.astro`

#### Manual Verification:

- [ ] All 3 sections render identically in light mode
- [ ] All 3 sections render identically in dark mode
- [ ] Hover effects work on "Launch App" button (opacity), "Start Building" button (bg/border), trust bar cards (border/bg), transparency feature boxes (border)
- [ ] SMIL SVG animations play in transparency-features section
- [ ] No console errors in browser DevTools
- [ ] Page loads faster (fewer JS bundles)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Convert `security` Section

### Overview

Convert the largest component (525 lines). The main complexity is the CodeBlock sub-component which uses ~10 theme-dependent color variables for syntax highlighting. These become CSS custom properties in `theme.css`.

### Changes Required:

#### 1. Add CodeBlock CSS custom properties to `src/styles/theme.css`

Add under `:root` (light mode values):

```css
:root {
  /* ... existing vars ... */
  --code-bg: #fafafa;
  --code-border: #e5e5e5;
  --code-comment: #9ca3af;
  --code-keyword: #7c3aed;
  --code-string: #16a34a;
  --code-type: #2563eb;
  --code-text: #374151;
  --code-punct: #9ca3af;
  --code-event: #d97706;
  --code-header-bg: rgba(132, 41, 255, 0.05);
  --code-dot-1: rgba(132, 41, 255, 0.2);
  --code-dot-2: rgba(132, 41, 255, 0.12);
  --code-dot-3: rgba(132, 41, 255, 0.06);
  --code-link-color: #70747a;
  --code-link-border: #e5e5e5;
}
```

Add under `.dark` (dark mode values):

```css
.dark {
  /* ... existing vars ... */
  --code-bg: #161a20;
  --code-border: #2e3137;
  --code-comment: #4a5568;
  --code-keyword: #c084fc;
  --code-string: #86efac;
  --code-type: #93c5fd;
  --code-text: #d4d4d8;
  --code-punct: #9ba3af;
  --code-event: #fde68a;
  --code-header-bg: rgba(139, 92, 246, 0.06);
  --code-dot-1: rgba(132, 41, 255, 0.25);
  --code-dot-2: rgba(132, 41, 255, 0.15);
  --code-dot-3: rgba(132, 41, 255, 0.08);
  --code-link-color: #9ba3af;
  --code-link-border: #2e3137;
}
```

#### 2. Create `src/components/security.astro`

**Conversion approach for CodeBlock:**

- The `codeLines` data array and rendering logic (line numbers, syntax highlighting) becomes static HTML generated at build time in Astro frontmatter
- All `style={{ color: keyword }}` etc. become `style="color: var(--code-keyword)"`
- `onMouseEnter`/`onMouseLeave` on "View on GitHub" link → `class="hover:border-[#8429FF] hover:text-[#8429FF]"` + `transition-all duration-300`
- `ExternalLink` icon → inline SVG
- The `lineNum` counter and render functions execute in Astro frontmatter (server-side) to generate static HTML
- `maxHeight: "258px"` scrollable code area → same, with CSS only

**Key pattern**: All the `renderLine`, `renderImport`, `renderEventMulti`, `renderEventSingle` functions become Astro template helpers in the frontmatter that return HTML strings, or we use Astro's template syntax directly.

```astro
---
// Data arrays (stats, auditors, codeLines) defined here
// Build-time rendering of code block HTML
---

<section id="security" class="py-12 md:py-24">
  <!-- All color references use var(--code-*) -->
  <!-- "View on GitHub" link uses hover: classes instead of JS -->
</section>
```

#### 3. Update `src/pages/index.astro`

```diff
-import { Security } from "../app/components/security.tsx";
+import Security from "../components/security.astro";

-<Security client:visible />
+<Security />
```

#### 4. Delete `src/app/components/security.tsx`

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] No `client:visible` on `Security` in `index.astro`

#### Manual Verification:

- [ ] Code block renders with correct syntax highlighting in both themes
- [ ] Code block scrolls vertically with max-height constraint
- [ ] Bottom fade gradient displays correctly
- [ ] "View on GitHub" link hover changes border and text to purple
- [ ] Stats grid (10+, 100%, 0) renders correctly with separator borders
- [ ] Auditor logos display with correct brightness/invert filters
- [ ] Header dot indicators show correct opacity levels per theme

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Convert `footer` Section + Fix Cookie Settings

### Overview

Convert footer to Astro. This fixes the broken cookie settings link by dispatching the `"open-cookie-settings"` CustomEvent that `CookieBannerIsland` already listens for. Two JS behaviors need tiny inline `<script>` tags: scroll-to-top and cookie settings dispatch.

**Important**: `footer.tsx` is also imported by `terms-of-use-page.tsx` and `privacy-policy-page.tsx` (React islands). We keep `footer.tsx` for those pages and create a separate `footer.astro` for the index page.

### Changes Required:

#### 1. Create `src/components/footer.astro`

**Conversion rules:**

- Logo switching (`isDark ? dark : light`) → two `<img>` tags: `class="block dark:hidden"` / `class="hidden dark:block"`
- Gradient inline styles → CSS custom properties (add `--footer-gradient-*` to `theme.css`)
- All `isDark` text/border classes → `dark:` variants
- `onClick` scroll-to-top → inline `<script>` with event delegation
- `onClick` cookie settings → inline `<script>` dispatching `window.dispatchEvent(new CustomEvent("open-cookie-settings"))`
- `ArrowUpRight` → inline SVG
- `onOpenCookieSettings` prop → removed (using CustomEvent instead)
- `linkColumns` data → Astro frontmatter constant
- Internal links (`/privacy-policy`, `/terms-of-use`) → plain `<a href>` (no target/rel needed)
- External links → `target="_blank" rel="noopener noreferrer"`
- "soon" badge links → `<span>` with `cursor-default`

#### 2. Add footer gradient CSS custom properties to `src/styles/theme.css`

```css
:root {
  /* ... existing vars ... */
  --footer-gradient-1: radial-gradient(
    ellipse 80% 60% at 50% 100%,
    rgba(132, 41, 255, 0.06) 0%,
    transparent 70%
  );
  --footer-gradient-2: radial-gradient(
    ellipse 50% 40% at 30% 80%,
    rgba(132, 41, 255, 0.04) 0%,
    transparent 60%
  );
}

.dark {
  /* ... existing vars ... */
  --footer-gradient-1: radial-gradient(
    ellipse 80% 60% at 50% 100%,
    rgba(139, 92, 246, 0.08) 0%,
    transparent 70%
  );
  --footer-gradient-2: radial-gradient(
    ellipse 50% 40% at 30% 80%,
    rgba(139, 92, 246, 0.05) 0%,
    transparent 60%
  );
}
```

#### 3. Inline scripts for interactivity

```astro
<script>
  // Scroll-to-top for "Fusion Vaults" link
  document.querySelector('[data-scroll-top]')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Cookie settings — dispatch event that CookieBannerIsland listens for
  document.querySelector('[data-cookie-settings]')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  });
</script>
```

#### 4. Update `src/pages/index.astro`

```diff
-import { Footer } from "../app/components/footer.tsx";
+import Footer from "../components/footer.astro";

-<Footer client:load />
+<Footer />
```

#### 5. Do NOT delete `src/app/components/footer.tsx`

It's still used by `terms-of-use-page.tsx` and `privacy-policy-page.tsx`. However, the React footer's cookie settings link remains broken on those pages (same as before) — this is a known limitation noted in "What We're NOT Doing".

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] No `client:load` on `Footer` in `index.astro`
- [ ] `grep -r "open-cookie-settings" src/` shows both dispatch (footer.astro) and listener (cookie-banner-island.tsx)

#### Manual Verification:

- [ ] Footer renders identically in both themes
- [ ] All external links open in new tab
- [ ] Internal links (`/privacy-policy`, `/terms-of-use`) navigate correctly
- [ ] "Fusion Vaults" link scrolls to top smoothly
- [ ] **Cookie Policy link opens the cookie banner** (this was broken before!)
- [ ] Logo switches correctly between dark/light variants
- [ ] "FUSN Token" shows "Soon" badge with reduced opacity
- [ ] Brand Assets link shows ArrowUpRight icon

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: Convert `testimonials` Section

### Overview

Convert testimonials to Astro. Replace `ImageWithFallback` (React `useState`) with a plain `<img>` using `onerror` attribute for fallback.

### Changes Required:

#### 1. Create `src/components/testimonials.astro`

**Conversion rules:**

- `ImageWithFallback` → plain `<img>` with `onerror` attribute:
  ```html
  <img
    src="{t.avatar}"
    alt="{t.name}"
    class="h-10 w-10 rounded-full object-cover"
    onerror="this.onerror=null;this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';"
  />
  ```
- `QuoteIcon` (file-local SVG component) → inline `<svg>` in template
- `isDark ? "bg-[#000000]" : "bg-[#E9E9F3]"` → `class="bg-[#E9E9F3] dark:bg-[#000000]"`
- All other `isDark` branches → `dark:` variants
- `testimonials` data array → Astro frontmatter constant
- Company-specific logo heights (`t.company === "Reservoir" ? "h-3" : ...`) → conditional class in Astro template

#### 2. Update `src/pages/index.astro`

```diff
-import { Testimonials } from "../app/components/testimonials.tsx";
+import Testimonials from "../components/testimonials.astro";

-<Testimonials client:visible />
+<Testimonials />
```

#### 3. Delete unused files

- Delete `src/app/components/testimonials.tsx`
- Delete `src/app/components/figma/image-with-fallback.tsx` (only used by testimonials — verify no other imports first)

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] No `client:visible` on `Testimonials` in `index.astro`
- [ ] `grep -r "image-with-fallback" src/` returns no results (confirming cleanup)

#### Manual Verification:

- [ ] Testimonial cards render identically in both themes
- [ ] Avatar images load correctly
- [ ] If an avatar fails to load, fallback SVG placeholder displays
- [ ] Quote icons render with correct opacity per theme
- [ ] Company logos display with correct brightness/invert filters
- [ ] Hover effect on cards (border color change) works

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 6: Visual Regression Tests

### Overview

Add Playwright with screenshot comparison tests for all converted sections in both light and dark themes. This provides automated visual regression detection for future changes.

### Changes Required:

#### 1. Install Playwright

```bash
npm install -D @playwright/test
npx playwright install chromium
```

#### 2. Create `playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4321",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run preview",
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
```

#### 3. Create `tests/visual/sections.spec.ts`

Test each converted section in both light and dark mode:

```typescript
import { test, expect } from "@playwright/test";

const sections = [
  { name: "transparency-features", selector: "#transparency" },
  { name: "testimonials", selector: "section:has(.testimonials-grid)" }, // adjust selector
  { name: "trust-bar", selector: "section:has(h2)" }, // adjust selector
  { name: "security", selector: "#security" },
  { name: "final-cta", selector: "section.relative.py-20" }, // adjust selector
  { name: "footer", selector: "footer" },
];

for (const section of sections) {
  test(`${section.name} - light mode`, async ({ page }) => {
    await page.goto("/");
    // Ensure light mode
    await page.evaluate(() =>
      document.documentElement.classList.remove("dark"),
    );
    const element = page.locator(section.selector).first();
    await element.scrollIntoViewIfNeeded();
    await expect(element).toHaveScreenshot(`${section.name}-light.png`, {
      maxDiffPixelRatio: 0.01,
    });
  });

  test(`${section.name} - dark mode`, async ({ page }) => {
    await page.goto("/");
    // Ensure dark mode
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    const element = page.locator(section.selector).first();
    await element.scrollIntoViewIfNeeded();
    await expect(element).toHaveScreenshot(`${section.name}-dark.png`, {
      maxDiffPixelRatio: 0.01,
    });
  });
}
```

**Note**: The selectors above are illustrative. During implementation, add `id` attributes to sections that lack them (e.g., `trust-bar`, `testimonials`, `final-cta`) to make selectors reliable. Alternatively use `data-testid` attributes.

#### 4. Add test IDs to converted Astro components

Add `id` or `data-testid` attributes to each section root:

- `transparency-features.astro`: already has `id="transparency"`
- `testimonials.astro`: add `id="testimonials"`
- `trust-bar.astro`: add `id="trust-bar"`
- `security.astro`: already has `id="security"`
- `final-cta.astro`: add `id="final-cta"`
- `footer.astro`: already is `<footer>` element

#### 5. Add npm scripts

```json
{
  "scripts": {
    "test:visual": "npx playwright test",
    "test:visual:update": "npx playwright test --update-snapshots"
  }
}
```

#### 6. Add to `.gitignore`

```
# Playwright
test-results/
playwright-report/
```

#### 7. Generate baseline screenshots

```bash
npm run build
npm run test:visual:update
```

Commit the baseline screenshots in `tests/visual/sections.spec.ts-snapshots/`.

### Success Criteria:

#### Automated Verification:

- [ ] `npx playwright test` passes with all 12 screenshot comparisons (6 sections x 2 themes)
- [ ] `npm run build` still succeeds
- [ ] Baseline screenshots exist in `tests/visual/`

#### Manual Verification:

- [ ] Review baseline screenshots to confirm they look correct
- [ ] Intentionally break a section's styling, verify the visual test fails

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 7: Cleanup & Verification

### Overview

Remove unused dependencies and verify bundle size reduction.

### Changes Required:

#### 1. Verify no remaining imports of deleted files

```bash
grep -r "final-cta\|trust-bar\|transparency-features\|security\.tsx\|testimonials" src/pages/ src/components/
grep -r "image-with-fallback" src/
```

#### 2. Check if `transparency-icons.tsx` can be deleted

```bash
grep -r "transparency-icons" src/
```

If only referenced by the deleted `transparency-features.tsx`, delete `src/app/components/ui/transparency-icons.tsx`.

#### 3. Check if `lucide-react` can be removed from dependencies

```bash
grep -r "lucide-react" src/
```

Likely still used by `nav.tsx`, `cookie-banner-island.tsx`, and the React footer — keep it.

#### 4. Measure bundle size reduction

```bash
# Before (record from git main/develop)
npm run build 2>&1 | tail -20

# After
npm run build 2>&1 | tail -20
```

Compare the output sizes, particularly the JS bundle sizes.

#### 5. Run full test suite

```bash
npm run lint
npm run test
npx playwright test
npm run build
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] `npx playwright test` passes
- [ ] No dead imports referencing deleted files
- [ ] JS bundle size is measurably smaller

#### Manual Verification:

- [ ] Full page walkthrough in light mode — all sections render correctly
- [ ] Full page walkthrough in dark mode — all sections render correctly
- [ ] Theme toggle works smoothly (no flash or layout shift)
- [ ] All links work (internal navigation, external links, scroll-to-top)
- [ ] Cookie Policy link opens cookie banner
- [ ] OG image appears in social sharing previews
- [ ] Page load feels faster (subjective, but fewer JS bundles)

---

## Testing Strategy

### Unit Tests (Vitest):

- Existing tests continue to pass (`npm run test`)
- No new unit tests needed — the converted components are pure HTML templates with no logic to test

### Visual Regression Tests (Playwright):

- 12 screenshot tests (6 sections x 2 themes)
- Run against built site via `astro preview`
- Baseline snapshots committed to repo
- `maxDiffPixelRatio: 0.01` tolerance for minor rendering differences

### Manual Testing:

1. Full page scroll-through in both themes
2. All hover effects on buttons, cards, links
3. Cookie Policy → cookie banner flow
4. Scroll-to-top link in footer
5. External links open in new tab
6. OG image preview in Slack/Discord
7. Mobile viewport (responsive layout)

## Performance Considerations

- **JS bundle reduction**: 6 fewer React islands = 6 fewer JS chunks downloaded + hydrated
- **Footer `client:load` → static**: Footer was one of only 2 components using `client:load` (immediate hydration). Removing this is significant.
- **No runtime `useTheme()` calls**: Theme changes are instant via CSS, no React re-renders
- **SMIL animations continue to work**: SVG animations are browser-native, unaffected by removing React

## Migration Notes

- `footer.tsx` is intentionally kept for `terms-of-use-page.tsx` and `privacy-policy-page.tsx`. Future optimization: refactor those pages to use Astro footer separately (separate ticket).
- The cookie settings fix only works on the index page (Astro footer). The React footer on subpages still has the broken `onOpenCookieSettings?.()` pattern — but those pages don't have a `CookieBannerIsland` anyway.
- CSS custom properties added to `theme.css` for CodeBlock are scoped to the security section but could be reused if other code displays are added later.

## References

- Original ticket: `thoughts/tickets/fsn_0010-astro-optimization.md`
- Astro migration plan: `thoughts/plans/2026-03-20-FSN-0008-astro-migration.md`
- Theme system: `src/styles/theme.css`, `src/components/use-theme.ts`
