# Fix Performance Issues

Performance audit conducted on 2026-03-30 via Playwright on both sites.

---

## Site 1: develop.ipor.io (IPOR site -- develop branch)

### Metrics

| Metric         | Value   | Rating            |
| -------------- | ------- | ----------------- |
| LCP            | 1,332ms | Good              |
| CLS            | 0.042   | Needs Improvement |
| FCP            | 1,064ms | Good              |
| TTFB           | 458ms   | OK                |
| Full Page Load | 1,286ms | Good              |

8 resources loaded, zero JS bundles. HTML: 4.5 KB transfer / 16 KB decompressed.

---

## Site 2: fusion.ipor.io (Fusion site -- production)

### Metrics

| Metric         | Value   | Rating                                 |
| -------------- | ------- | -------------------------------------- |
| LCP            | 2,964ms | Needs Improvement (threshold: 2,500ms) |
| CLS            | 0.004   | Good                                   |
| FCP            | 516ms   | Good                                   |
| TTFB           | 178ms   | Good                                   |
| Full Page Load | 781ms   | Good                                   |

37 resources loaded. HTML: 22 KB transfer / 194 KB decompressed.

### Resource Breakdown

| Type                           | Count | Total Transfer Size |
| ------------------------------ | ----- | ------------------- |
| Images                         | 28    | 2.34 MB             |
| JavaScript                     | 4     | 110 KB              |
| CSS                            | 1     | 8.4 KB              |
| Google Fonts (render-blocking) | 3     | 2.9 KB              |
| API (fetch)                    | 1     | 0 (cached)          |

### LCP Element

`H1.mt-8.md:mt-18.max-w-3xl` -- the main hero heading. LCP at 2,964ms is above the 2,500ms "good" threshold, likely delayed by font loading (Poppins render-blocking) + large image downloads competing for bandwidth.

---

## Issues to Fix (Priority Order) -- Both Sites

### 1. vault-overview.png is 1.6 MB (Critical)

- Path: `/vault-overview.png`
- Transfer size: 1,678,592 bytes -- largest single resource on both sites
- Load duration: ~550-600ms
- **Fix**: Convert to WebP or AVIF with responsive `srcset` sizes. Target ~200-300 KB. Consider lazy loading if below the fold.

### 2. Three render-blocking Google Fonts requests

- Poppins, JetBrains Mono, Source Sans Pro loaded as render-blocking `<link>` tags from fonts.googleapis.com
- Each takes ~225-270ms and blocks first paint
- On Fusion, this directly impacts LCP since the LCP element is a text heading styled with these fonts
- **Fix**: Self-host the fonts to eliminate cross-origin blocking requests. Alternatively use `<link rel="preload">` with `as="style"` and load async.

### 3. 28 images on Fusion -- all PNGs, no lazy loading (Critical for Fusion)

Total image weight: **2.34 MB** across 28 images. The heaviest after vault-overview:

| Image                | Transfer Size |
| -------------------- | ------------- |
| vault-overview.png   | 1,678 KB      |
| vlad.png (avatar)    | 72 KB         |
| compound.png (logo)  | 63 KB         |
| usdc.png (icon)      | 62 KB         |
| nick.png (avatar)    | 60 KB         |
| protofire.png (logo) | 46 KB         |
| tesseract.png (logo) | 39 KB         |

- **Fix**: Convert all PNGs to WebP/AVIF. Lazy-load images below the fold. Use `width`/`height` attributes to prevent layout shifts. Consider using Astro's `<Image>` component for automatic optimization.

### 4. Layout Shifts on develop.ipor.io (CLS: 0.042)

Three shift events detected:

1. **Main shift (0.041)**: Elements in the hero area (~y:147) shift 8px, content blocks at ~y:436-472 shift 3-4px. Likely caused by font-swap reflow changing text dimensions.
2. **Header nav shift**: `DIV.flex.items-center.gap-3` shifts ~4px in width -- font-swap related.
3. **Minor content shift (0.0005)**: Small movements in content blocks below hero.

- **Fix**: Reserve explicit dimensions for hero section elements. Consider using `font-display: optional` or `size-adjust` descriptors for self-hosted fonts to minimize reflow.

### 5. Layout Shifts on fusion.ipor.io (CLS: 0.004 -- minor)

Two shift events:

1. **Nav shift (0.001)**: `DIV.hidden.lg:block` nav container shifts ~104px horizontally -- likely font-swap.
2. **Section shift (0.003)**: `SECTION.relative.py-20.md:py-28` (partners section) height changes from 76px to 48px, nav items shift slightly.

- CLS is within "good" range but could be eliminated entirely by self-hosting fonts.

### 6. Logo/brand images are PNGs

- `fusion-light.png` (10.5 KB) and `fusion-dark.png` (10.9 KB) are raster PNGs
- **Fix**: Convert to SVG for crisper rendering at all resolutions and smaller file size.

### 7. Fusion LCP is above 2,500ms threshold

- LCP element: Hero `<h1>` heading
- The combination of render-blocking fonts + heavy image downloads delays text rendering
- **Fix**: Fixing issues #2 (self-host fonts) and #3 (optimize images) should bring LCP well under 2,500ms

---

## Comparison Summary

| Metric         | develop.ipor.io | fusion.ipor.io |
| -------------- | --------------- | -------------- |
| TTFB           | 458ms           | 178ms          |
| FCP            | 1,064ms         | 516ms          |
| LCP            | 1,332ms         | 2,964ms        |
| CLS            | 0.042           | 0.004          |
| Page Load      | 1,286ms         | 781ms          |
| Resources      | 8               | 37             |
| Total Transfer | ~1.7 MB         | ~2.5 MB        |
| JS Bundles     | 0               | 4 (110 KB)     |

Key takeaway: Fusion loads faster initially (better TTFB/FCP) but has worse LCP due to heavier page with 28 images. IPOR site is leaner but has higher CLS from font-swap reflow.
