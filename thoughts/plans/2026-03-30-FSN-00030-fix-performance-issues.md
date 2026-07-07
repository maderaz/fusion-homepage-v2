# Fix Performance Issues — Implementation Plan

## Overview

Fix performance issues identified in the audit across both sites (fusion.ipor.io and develop.ipor.io). The primary goals are:

1. Bring Fusion LCP below 2,500ms (currently 2,964ms)
2. Reduce CLS on IPOR site (currently 0.042)
3. Cut total transfer size by optimizing images (~2.34 MB on Fusion, ~1.7 MB on IPOR)

## Current State Analysis

### Fonts

- 3 Google Fonts families loaded as render-blocking `<link rel="stylesheet">` tags in `base-head.astro:37-48`
- Preconnect hints at lines 35-36, but no `<link rel="preload">` for font files
- `font-display: swap` set via Google Fonts URL query parameter
- CSS custom properties in `theme.css:4-6`: `--font-sans` (Poppins), `--font-mono` (JetBrains Mono), `--font-data` (Source Sans Pro)
- No `@font-face` declarations — `fonts.css` is just a comment
- CSP in `astro.config.mjs:34,44` allows `fonts.googleapis.com` and `fonts.gstatic.com`

### Images

- Every image uses plain `<img>` tags — Astro's `<Image>` component is never used
- Sharp is explicitly **disabled** via lavamoat (`package.json:78`)
- Zero `loading` attributes (no lazy loading anywhere)
- Zero `width`/`height` HTML attributes on any `<img>` tag
- Zero `fetchpriority` attributes
- `vault-overview.png`: 2880x3254 PNG, 1.6 MB — displayed at max 560px wide (Fusion) / ~45% of card (IPOR)
- Total image weight on Fusion: 2.34 MB across 28 images

### Key Discoveries

- Fusion LCP element is the hero `<h1>` (`hero.tsx:68-78`) — delayed by font loading + bandwidth competition from images
- IPOR CLS (0.041) is primarily font-swap reflow in the hero area
- IPOR nav CLS: `DIV.flex.items-center.gap-3` (`ipor/nav.astro:24`) shifts ~4px from font-swap
- Fusion nav: `DIV.hidden.lg:block` shifts ~104px — font-swap affecting link text widths

## Desired End State

- Fusion LCP < 2,000ms (from 2,964ms)
- IPOR CLS < 0.01 (from 0.042)
- Fusion CLS stays < 0.005
- Total image transfer < 500 KB on Fusion, < 300 KB on IPOR
- Zero render-blocking cross-origin font requests
- All below-fold images lazy loaded with explicit width/height

### Verification

Run Playwright performance audit against both sites after deployment and confirm metrics meet targets above.

## What We're NOT Doing

- Converting brand logos (fusion-light.png, fusion-dark.png) to SVG — requires original vector source files, and at 12KB each they're not a meaningful bottleneck
- Enabling Sharp / using Astro's `<Image>` component — lavamoat security policy has Sharp disabled deliberately
- Changing the animation approach in `hero.tsx` (AnimatedGroup with 0.75s delay)
- Optimizing JS bundle size (110 KB total, already small)
- Changing the OG image (`fusion-og-default.png`) — not user-facing page load

## Implementation Approach

Pre-optimize images manually (since Sharp is disabled) using `cwebp` CLI. Self-host fonts by downloading WOFF2 files and writing `@font-face` rules. Add lazy loading + dimensions to all below-fold images.

---

## Phase 1: Self-Host Fonts

### Overview

Eliminate 3 render-blocking cross-origin Google Fonts requests by downloading WOFF2 files and serving them locally. This directly improves LCP on Fusion (the LCP element is a text heading) and reduces CLS on IPOR (font-swap reflow).

### Changes Required

#### 1. Download font files

Download WOFF2 files to `public/fonts/`:

```
public/fonts/
  poppins-400.woff2
  poppins-500.woff2
  poppins-600.woff2
  source-sans-pro-400.woff2
  source-sans-pro-600.woff2
  jetbrains-mono-400.woff2
  jetbrains-mono-500.woff2
```

To download, use the Google Fonts CSS API with a WOFF2 user-agent to get direct URLs:

```bash
# Get WOFF2 URLs (set user-agent to get woff2 format)
curl -s -H "User-Agent: Mozilla/5.0 (Macintosh)" \
  "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
# Download each .woff2 URL from the response and save to public/fonts/
```

#### 2. Write `@font-face` declarations

**File**: `src/shared/styles/fonts.css`
**Changes**: Replace the comment with `@font-face` rules

```css
/* Poppins */
@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/poppins-400.woff2") format("woff2");
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
    U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/poppins-500.woff2") format("woff2");
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
    U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/poppins-600.woff2") format("woff2");
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
    U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}

/* Source Sans Pro */
@font-face {
  font-family: "Source Sans Pro";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/source-sans-pro-400.woff2") format("woff2");
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
    U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "Source Sans Pro";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/source-sans-pro-600.woff2") format("woff2");
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
    U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}

/* JetBrains Mono */
@font-face {
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/jetbrains-mono-400.woff2") format("woff2");
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
    U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: "JetBrains Mono";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/jetbrains-mono-500.woff2") format("woff2");
  unicode-range:
    U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
    U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}
```

#### 3. Remove Google Fonts links from `<head>`

**File**: `src/shared/components/base-head.astro`
**Changes**: Remove lines 34-48 (the `<!-- Fonts -->` comment, preconnect hints, and all 3 `<link rel="stylesheet">` tags). Replace with preload for the critical font (Poppins 500, used by the hero h1):

```astro
<!-- Fonts: preload critical weight used by hero heading -->
<link rel="preload" href="/fonts/poppins-500.woff2" as="font" type="font/woff2" crossorigin />
```

#### 4. Update CSP configuration

**File**: `astro.config.mjs`
**Changes**:

- Line 34: Remove `https://fonts.gstatic.com` from `font-src` directive
- Line 44: Remove `https://fonts.googleapis.com` from `styleDirective.resources`

```js
"font-src 'self'",
// ...
resources: ["'self'", "'unsafe-inline'"],
```

### Success Criteria

#### Automated Verification:

- [ ] Build succeeds: `npm run build:fusion && npm run build:ipor`
- [ ] All tests pass: `npm run test`
- [ ] Lint passes: `npm run lint`
- [ ] Font files exist in `public/fonts/` (7 .woff2 files)
- [ ] No remaining references to `fonts.googleapis.com` in source: `grep -r "fonts.googleapis" src/`
- [ ] No remaining references to `fonts.gstatic` in source: `grep -r "fonts.gstatic" src/`

#### Manual Verification:

- [ ] Both sites render with correct fonts (Poppins body, JetBrains Mono code blocks, Source Sans Pro data)
- [ ] Dark mode fonts render correctly
- [ ] No FOUT (flash of unstyled text) longer than with Google Fonts
- [ ] Network tab shows font files loading from same origin (no cross-origin requests to Google)
- [ ] LCP improved on Fusion (target: < 2,500ms)
- [ ] CLS improved on IPOR (font-swap reflow reduced)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Optimize vault-overview.png

### Overview

Convert the 1.6 MB vault-overview.png (2880x3254) to WebP at appropriate display sizes. This is the single largest resource on both sites.

### Changes Required

#### 1. Install `cwebp` and convert images

```bash
brew install webp  # if not already installed

# Fusion: displayed at max-w-[560px] → need 560w and 1120w (2x retina)
# IPOR: displayed at ~45% of card width → similar range

# Create optimized WebP versions
cwebp -resize 1120 0 -q 80 public/vault-overview.png -o public/vault-overview-1120w.webp
cwebp -resize 560 0 -q 80 public/vault-overview.png -o public/vault-overview-560w.webp
```

Expected sizes: ~80-150 KB per file (down from 1.6 MB).

#### 2. Update Fusion transparency-features.astro

**File**: `src/sites/fusion/components/transparency-features.astro`
**Changes**: Replace `<img>` at lines 15-19 with `<picture>` element with responsive sources and lazy loading (this section is below the fold):

```astro
<picture>
  <source
    srcset="/vault-overview-560w.webp 560w, /vault-overview-1120w.webp 1120w"
    sizes="(max-width: 1023px) 100vw, 560px"
    type="image/webp"
  />
  <img
    src="/vault-overview-560w.webp"
    alt="Fusion vault overview dashboard showing IPOR USDC Prime vault with performance reports, historical allocation, and credit markets"
    class="w-full max-w-[560px] rounded-2xl border border-border"
    width="560"
    height="633"
    loading="lazy"
  />
</picture>
```

#### 3. Update IPOR index.astro

**File**: `src/sites/ipor/pages/index.astro`
**Changes**: Replace `<img>` at lines 106-110. This image is above the fold on desktop (inside the hero card), so do NOT lazy load:

```astro
<picture>
  <source
    srcset="/vault-overview-560w.webp 560w, /vault-overview-1120w.webp 1120w"
    sizes="(max-width: 767px) 100vw, 45vw"
    type="image/webp"
  />
  <img
    src="/vault-overview-560w.webp"
    alt="Fusion App"
    class="w-full rounded-lg md:absolute md:bottom-0 md:right-0 md:w-[45%] md:rounded-tl-[17px] md:rounded-bl-[17px] md:rounded-br-[17px] md:rounded-tr-none object-cover"
    width="560"
    height="633"
  />
</picture>
```

#### 4. Remove original PNG (optional — after verifying)

After confirming the WebP versions work, delete `public/vault-overview.png` to prevent it from being included in the build output.

### Success Criteria

#### Automated Verification:

- [ ] WebP files exist: `ls public/vault-overview-*w.webp`
- [ ] WebP file sizes < 200 KB each: `du -sh public/vault-overview-*w.webp`
- [ ] Build succeeds: `npm run build:fusion && npm run build:ipor`
- [ ] No broken image references: `grep -r "vault-overview.png" src/` returns 0 results (after PNG removal)

#### Manual Verification:

- [ ] Images render correctly on Fusion transparency section
- [ ] Images render correctly on IPOR hero card (both mobile and desktop)
- [ ] Image quality is acceptable (no visible compression artifacts)
- [ ] Network tab confirms WebP files are loaded instead of PNG
- [ ] Total transfer size for vault-overview reduced from 1.6 MB to < 300 KB

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Optimize All Remaining Images

### Overview

Add `loading="lazy"` and `width`/`height` attributes to all below-fold images. Add `width`/`height` to above-fold images (nav logos) without lazy loading.

### Changes Required

#### Above-fold images (NO lazy loading, add width/height only)

##### 1. Fusion nav logos

**File**: `src/sites/fusion/components/nav.astro`
**Changes**: Add `width` and `height` to both logo `<img>` tags (lines 23-32):

```astro
<img
  src="/brand/fusion-light.png"
  alt="Fusion by IPOR"
  class="h-8 w-auto object-contain block dark:hidden"
  width="116"
  height="32"
/>
<img
  src="/brand/fusion-dark.png"
  alt="Fusion by IPOR"
  class="h-8 w-auto object-contain hidden dark:block"
  width="116"
  height="32"
/>
```

##### 2. IPOR nav logo

**File**: `src/sites/ipor/components/nav.astro`
**Changes**: Add `width` and `height` to logo `<img>` (lines 16-20):

```astro
<img
  src="/brand/fusion-light.png"
  alt="Fusion by IPOR"
  class="h-8 w-auto object-contain"
  width="116"
  height="32"
/>
```

##### 3. IPOR hero card brand logos

**File**: `src/sites/ipor/pages/index.astro`
**Changes**: Add `width` and `height` to both brand logo `<img>` tags (lines 31-35, 80-84):

```astro
<img
  src="/brand/fusion-light.png"
  alt="Fusion by IPOR"
  class="h-9 w-auto"
  width="131"
  height="36"
/>
```

#### Below-fold images (add lazy loading + width/height)

##### 4. Fusion transparency section (vault-overview)

Already handled in Phase 2.

##### 5. Fusion testimonials — avatars and logos

**File**: `src/sites/fusion/components/testimonials.astro`
**Changes**: Add `loading="lazy"` and `width`/`height` to avatar images (lines 99 and 128) and logo images (lines 91 and 120):

For avatar `<img>` tags:

```astro
<img src={t.avatar} alt={t.name} class="h-10 w-10 rounded-full object-cover" data-fallback={fallbackSvg} loading="lazy" width="40" height="40" />
```

For logo `<img>` tags:

```astro
<img src={t.logo} alt={t.company} class:list={["w-auto object-contain brightness-0 opacity-30 dark:invert", logoHeight(t.company)]} loading="lazy" />
```

##### 6. Fusion trust-bar — protocol logos

**File**: `src/sites/fusion/components/trust-bar.astro`
**Changes**: Add `loading="lazy"` to protocol logo `<img>` (line 56-60):

```astro
<img
  src={p.logo}
  alt={p.name}
  class="w-auto object-contain transition-all duration-300 brightness-0 opacity-60 group-hover:opacity-90 dark:invert"
  style={`height: ${28 * p.scale}px;`}
  loading="lazy"
/>
```

##### 7. Fusion security — auditor logos

**File**: `src/sites/fusion/components/security.astro`
**Changes**: Add `loading="lazy"` to auditor logo `<img>` (lines 302-305):

```astro
<img
  src={a.logo}
  alt={a.name}
  class="h-5 w-auto object-contain brightness-0 opacity-50 dark:invert"
  loading="lazy"
/>
```

##### 8. Fusion comparison-table — brand logos

**File**: `src/sites/fusion/components/comparison-table.astro`
**Changes**: Add `loading="lazy"` and `width`/`height` to brand logo `<img>` tags (lines 56-65):

```astro
<img
  src="/brand/fusion-light.png"
  alt="Fusion by IPOR"
  class="h-7 w-auto object-contain block dark:hidden"
  loading="lazy"
  width="102"
  height="28"
/>
<img
  src="/brand/fusion-dark.png"
  alt="Fusion by IPOR"
  class="h-7 w-auto object-contain hidden dark:block"
  loading="lazy"
  width="102"
  height="28"
/>
```

##### 9. Footer — brand logos

**File**: `src/shared/components/footer.astro`
**Changes**: Add `loading="lazy"` and `width`/`height` to brand logos (lines 75-85):

```astro
<img
  src="/brand/fusion-light.png"
  alt="Fusion by IPOR"
  class="h-7 w-auto shrink-0 object-contain block dark:hidden"
  loading="lazy"
  width="102"
  height="28"
/>
<img
  src="/brand/fusion-dark.png"
  alt="Fusion by IPOR"
  class="h-7 w-auto shrink-0 object-contain hidden dark:block"
  loading="lazy"
  width="102"
  height="28"
/>
```

##### 10. Hero trusted-by logos (React)

**File**: `src/sites/fusion/app/components/hero.tsx`
**Changes**: Add `loading="lazy"` to all logo `<img>` tags in the trusted-by section. These are at the bottom of the hero and typically below the fold.

For the desktop logos (line 155-164):

```tsx
<img
  key={logo.alt}
  src={logo.src}
  alt={logo.alt}
  loading="lazy"
  className={cn(logo.h, "brightness-0 opacity-50 dark:invert dark:opacity-60")}
/>
```

For the mobile marquee logos (lines 179-188):

```tsx
<img
  key={i}
  src={logo.src}
  alt={i < logoEntries.length ? logo.alt : ""}
  loading="lazy"
  className={cn(
    "h-5 shrink-0",
    logo.alt === "Reservoir" && "h-3",
    "brightness-0 opacity-50 dark:invert dark:opacity-60",
  )}
/>
```

##### 11. FusionFlow icons (React)

**File**: `src/sites/fusion/app/components/ui/fusion-flow.tsx`
**Changes**: Add `loading="lazy"` to all icon `<img>` tags:

USDC icon (line 74):

```tsx
<img src={imgUsdc} alt="USDC" className="h-4 w-4 rounded-full" loading="lazy" />
```

Fusion icon (lines 139-143):

```tsx
<img
  src={iconFusionLight}
  alt="Fusion"
  className="h-full w-full object-contain"
  loading="lazy"
/>
```

FuseIcon (line 452-457):

```tsx
<img
  src={src}
  alt={protocol}
  className="h-[22px] w-[22px] object-contain"
  loading="lazy"
/>
```

### Success Criteria

#### Automated Verification:

- [ ] Build succeeds: `npm run build:fusion && npm run build:ipor`
- [ ] All tests pass: `npm run test`
- [ ] All below-fold `<img>` tags have `loading="lazy"`: verify via built HTML
- [ ] Nav logo `<img>` tags have `width`/`height` but NOT `loading="lazy"`

#### Manual Verification:

- [ ] All images render correctly on both sites
- [ ] Lazy-loaded images load when scrolled into view
- [ ] No visible layout shifts when images load (CLS check)
- [ ] Nav logos appear immediately on page load (not delayed by lazy loading)
- [ ] Mobile marquee in hero still works correctly with lazy-loaded images

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Fix CLS on develop.ipor.io

### Overview

The remaining CLS on IPOR (after font self-hosting in Phase 1) is addressed by adding explicit dimensions to elements that shift during font-swap. Phase 1 should eliminate most of the CLS (0.041 main shift from font-swap reflow). This phase handles any residual shifts.

### Changes Required

#### 1. Reserve nav height

**File**: `src/sites/ipor/components/nav.astro`
**Changes**: Add explicit `min-height` to prevent nav reflow during font-swap. Add `min-h-[60px]` to the `#nav-inner` div (line 10-12):

```astro
<div
  id="nav-inner"
  class="relative flex items-center justify-between border-b border-transparent py-4 transition-all duration-300 min-h-[60px]"
>
```

#### 2. Reserve CTA container width

The `DIV.flex.items-center.gap-3` shifts ~4px when font loads. The "Discover Fusion" link (`hidden sm:inline-flex`) appearing at `sm:` breakpoint isn't CLS — it's a responsive change. The shift is from font metrics changing the button text width.

This should be resolved by Phase 1 (self-hosted fonts load faster from same origin). If CLS persists after Phase 1, add `min-w-fit` to the CTA container.

#### 3. Reserve Fusion nav dimensions similarly

**File**: `src/sites/fusion/components/nav.astro`
**Changes**: Add `min-h-[60px]` to `#nav-inner` (line 17-19):

```astro
<div
  id="nav-inner"
  class="relative flex flex-wrap items-center justify-between gap-6 border-b border-transparent py-4 transition-all duration-300 lg:gap-0 min-h-[60px]"
>
```

### Success Criteria

#### Automated Verification:

- [ ] Build succeeds: `npm run build:fusion && npm run build:ipor`
- [ ] Visual tests pass: `npm run test:visual`

#### Manual Verification:

- [ ] IPOR site CLS < 0.01 (measure with Lighthouse or Playwright)
- [ ] Fusion site CLS stays < 0.005
- [ ] Nav layout doesn't shift on page load
- [ ] Nav still collapses correctly on mobile

**Implementation Note**: After completing this phase, run the full Playwright performance audit again on both sites to confirm all metrics meet the targets.

---

## Testing Strategy

### Automated Tests:

- Build both sites: `npm run build`
- Run unit tests: `npm run test`
- Run lint: `npm run lint`
- Run visual tests: `npm run test:visual`

### Manual Testing Steps:

1. Run `npm run dev:fusion` and `npm run dev:ipor`
2. Open Chrome DevTools → Lighthouse → run Performance audit on both sites
3. Verify LCP < 2,500ms on Fusion
4. Verify CLS < 0.01 on IPOR
5. Check Network tab: no Google Fonts requests, fonts loading from same origin
6. Check Network tab: WebP images loading, no 1.6 MB PNG
7. Scroll through all sections — verify lazy images load on scroll
8. Test dark mode on both sites — verify fonts and images render correctly
9. Test mobile viewport — verify responsive images and nav

### Playwright Performance Test:

Re-run the same Playwright performance audit from the ticket to get before/after comparison.

## Performance Considerations

- Preloading Poppins 500 (hero heading font weight) ensures the LCP text renders ASAP
- Using `font-display: swap` means text is visible immediately with fallback font, then swaps — this is the right tradeoff for LCP
- WebP format is supported by all modern browsers (>97% global support)
- `<picture>` with WebP source and fallback `<img>` is unnecessary since we don't need IE11 support — can use WebP directly in `<img src>` if preferred
- Lazy loading the trusted-by logos in the hero is safe because they're at the bottom of the hero section and typically below the initial viewport

## References

- Original ticket: `thoughts/tickets/fsn_00030-fix-performance-issues.md`
- Font loading: `src/shared/components/base-head.astro:35-48`
- Theme CSS: `src/shared/styles/theme.css:4-6`
- Astro config: `astro.config.mjs:31-48`
- Fusion hero: `src/sites/fusion/app/components/hero.tsx:68-78`
- IPOR hero: `src/sites/ipor/pages/index.astro:15-113`
