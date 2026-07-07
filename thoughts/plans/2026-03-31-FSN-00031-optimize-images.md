# Optimize Images Implementation Plan

## Overview

Fix low-resolution images across both fusion.ipor.io and ipor.io sites, rename brand files to kebab-case, move public/ images under Astro optimization, and fix SEO metadata gaps. The primary issue is that Astro's `<Image>` generates 1x output by default, appearing blurry on Retina displays (2x/3x).

## Current State Analysis

### Root Cause: 1x-only Image Output

Every `<Image>` component generates a single-density image. On Retina displays:

- Nav logo at `height={32}` → 32px image → needs 64px for 2x Retina → **blurry**
- Vault overview at `width={560}` → 560px image → needs 1120px for 2x → **blurry**
- Protocol/auditor logos at `height={20-28}` → same problem

No component uses `densities`, `widths`, or `srcset`/`sizes`.

### Brand SVGs Exist But Are Unused

7 SVGs in `public/brand/` are never referenced in code. All use non-kebab-case names (e.g., `01_Fusion_full-logo_white text.svg`). Code uses PNG files from `src/shared/assets/brand/` (501x154px) instead.

### Images in `public/` Bypass Astro Optimization

- `public/logos/` (7 PNGs) — used in `hero.tsx` (React island) and `testimonials.astro` via raw `<img>` tags
- `public/icons/` (7 PNGs) — used in `fusion-flow.tsx` (React island) via raw `<img>` tags
- No build-time optimization, no format conversion, no responsive variants

### SEO Gaps

- IPOR site uses `fusion-og-default.png` as OG image (should use `ipor-app-meta.png`)
- Missing `og:image:width`, `og:image:height`, `og:image:alt`
- `robots.txt` hardcodes `fusion.ipor.io` sitemap URL (wrong for ipor.io build)
- Footer brand kit link points to wrong Google Drive URL

### Key Discoveries

- `src/sites/fusion/components/nav.astro:27-38` — Fusion logos at `height={32}`, no `densities`
- `src/shared/components/footer.astro:78-92` — Footer logos at `height={28}`, no `densities`
- `src/sites/fusion/components/transparency-features.astro:17-23` — vault-overview at `width={560}`, no `densities`
- `src/sites/fusion/app/components/hero.tsx:7-15` — 7 logos from `public/logos/` as raw `<img>`
- `src/sites/fusion/app/components/ui/fusion-flow.tsx:5-10` — 6 icons from `public/icons/` as raw `<img>`
- `src/shared/components/base-head.astro:8` — OG image defaults to `fusion-og-default.png` for both sites
- `src/shared/components/footer.astro:126` — Brand kit link `1RNoJP4LpfhV3G8p9Eq9xFoorq4RyW29_` (should be `1uZ0nfbzsIaburx7C2xR-JAcedNtQQIsH`)
- `public/robots.txt:4` — Hardcoded `https://fusion.ipor.io/sitemap-index.xml`

## Desired End State

- All Fusion logos use SVGs from `public/brand/` (resolution-independent, sharp on any display)
- All remaining `<Image>` components use `densities={[1, 2]}` for Retina-quality output
- All images currently in `public/logos/` and `public/icons/` moved to `src/shared/assets/` and rendered via Astro `<Image>` or `getImage()`
- Brand files in `public/brand/` renamed to kebab-case
- IPOR site uses its own OG image (`ipor-app-meta.png`)
- `robots.txt` is site-aware (correct sitemap URL per build)
- Brand kit link updated to correct Google Drive URL
- OG image tags include width, height, and alt

### Verification

- `npm run build:fusion && npm run build:ipor` both succeed
- No broken image references in built output
- Visual inspection on Retina confirms sharp logos and images
- OG meta tags validated via social preview tools

## What We're NOT Doing

- Converting PNGs to WebP/AVIF format (separate optimization task)
- Adding `sizes` attribute for art-direction responsive images
- Replacing protocol/auditor PNGs with SVGs (only Fusion brand logos get SVGs)
- Downloading new assets from the brand kit Google Drive
- Changing the favicon (stays as `fusion-light.png`)
- Changing `og:site_name` (stays as "Fusion by IPOR" for both sites)

## Implementation Approach

SVGs first (biggest visual win, simplest change), then Retina densities, then asset migration, then SEO fixes. Each phase is independently deployable.

---

## Phase 1: Rename Brand SVGs & Replace PNG Logos with SVGs

### Overview

Rename all 7 SVGs in `public/brand/` to kebab-case, then replace PNG logo imports across 6 components with SVG `<img>` tags. SVGs are resolution-independent — this fixes the most visible blurriness issue.

### Changes Required

#### 1. Rename SVG Files

Rename files in `public/brand/`:

| Old name                                       | New name                                    |
| ---------------------------------------------- | ------------------------------------------- |
| `full-logo/01_Fusion_full-logo_white text.svg` | `full-logo/fusion-full-logo-white-text.svg` |
| `full-logo/02_Fusion_full-logo_black text.svg` | `full-logo/fusion-full-logo-black-text.svg` |
| `full-logo/03_Fusion_full-logo_full white.svg` | `full-logo/fusion-full-logo-full-white.svg` |
| `full-logo/04_Fusion_full-logo_full black.svg` | `full-logo/fusion-full-logo-full-black.svg` |
| `icon-logo/01_Fusion_logo-icon_purple.svg`     | `icon-logo/fusion-icon-purple.svg`          |
| `icon-logo/02_Fusion_logo-icon_white.svg`      | `icon-logo/fusion-icon-white.svg`           |
| `icon-logo/03_Fusion_logo-icon_black.svg`      | `icon-logo/fusion-icon-black.svg`           |

#### 2. Replace PNG Logos with SVG in Components

The mapping for dark/light mode:

- **Light mode** (dark text on light bg): `fusion-full-logo-black-text.svg`
- **Dark mode** (white text on dark bg): `fusion-full-logo-white-text.svg`

Components to update (6 total):

**File**: `src/sites/fusion/components/nav.astro`
**Changes**: Remove `Image` import and PNG imports. Replace `<Image>` tags with `<img>` pointing to SVGs.

```astro
---
const menuItems = [
  { name: "How It Works", href: "#how-it-works" },
  { name: "Solutions", href: "#solutions" },
  { name: "Security", href: "#security" },
  { name: "Docs", href: "https://docs.ipor.io/" },
];
---

<!-- Replace lines 27-38 -->
<img
  src="/brand/full-logo/fusion-full-logo-black-text.svg"
  alt="Fusion by IPOR"
  class="h-8 w-auto object-contain block dark:hidden"
  width="176"
  height="32"
/>
<img
  src="/brand/full-logo/fusion-full-logo-white-text.svg"
  alt="Fusion by IPOR"
  class="h-8 w-auto object-contain hidden dark:block"
  width="176"
  height="32"
/>
```

Note: `width="176"` is calculated from the SVG's aspect ratio (the original PNG is 501x154, so at h=32: w = 32 _ 501/154 ≈ 104). The actual width should be derived from the SVG viewBox. Check each SVG's `viewBox` attribute and compute: `width = height _ (viewBoxWidth / viewBoxHeight)`. This prevents layout shift.

**File**: `src/sites/ipor/components/nav.astro`
**Changes**: Same pattern. Only light mode variant needed (IPOR site has no dark mode).

```astro
---
<!-- Remove Image import and fusionLight import -->
---

<!-- Replace lines 18-23 -->
<img
  src="/brand/full-logo/fusion-full-logo-black-text.svg"
  alt="Fusion by IPOR"
  class="h-8 w-auto object-contain"
  width="176"
  height="32"
/>
```

**File**: `src/shared/components/footer.astro`
**Changes**: Remove `Image` import and PNG imports. Replace lines 78-92.

```astro
<img
  src="/brand/full-logo/fusion-full-logo-black-text.svg"
  alt="Fusion by IPOR"
  class="h-7 w-auto shrink-0 object-contain block dark:hidden"
  loading="lazy"
  width="154"
  height="28"
/>
<img
  src="/brand/full-logo/fusion-full-logo-white-text.svg"
  alt="Fusion by IPOR"
  class="h-7 w-auto shrink-0 object-contain hidden dark:block"
  loading="lazy"
  width="154"
  height="28"
/>
```

**File**: `src/sites/fusion/components/comparison-table.astro`
**Changes**: Remove `Image` import and PNG imports. Replace lines 59-72.

```astro
<img
  src="/brand/full-logo/fusion-full-logo-black-text.svg"
  alt="Fusion by IPOR"
  class="h-7 w-auto object-contain block dark:hidden"
  loading="lazy"
  width="154"
  height="28"
/>
<img
  src="/brand/full-logo/fusion-full-logo-white-text.svg"
  alt="Fusion by IPOR"
  class="h-7 w-auto object-contain hidden dark:block"
  loading="lazy"
  width="154"
  height="28"
/>
```

**File**: `src/sites/ipor/pages/index.astro`
**Changes**: Remove `fusionLight` import (keep `vaultOverview` import). Replace `<Image src={fusionLight} ...>` at lines 34-39 and 84-89 with SVG `<img>` tags.

```astro
<!-- Lines 34-39 and 84-89: both card logos -->
<img
  src="/brand/full-logo/fusion-full-logo-black-text.svg"
  alt="Fusion by IPOR"
  class="h-9 w-auto"
  width="198"
  height="36"
/>
```

#### 3. Clean Up Unused PNG Assets

After replacing all references, `src/shared/assets/brand/fusion-light.png` and `src/shared/assets/brand/fusion-dark.png` are no longer imported by any component. Delete them:

- `src/shared/assets/brand/fusion-light.png`
- `src/shared/assets/brand/fusion-dark.png`

Also delete the unused `public/brand/fusion.png` (704x240, never referenced in any component).

#### 4. Remove `.DS_Store`

Delete `public/brand/.DS_Store`.

### Success Criteria

#### Automated Verification

- [ ] `npm run build:fusion` succeeds with no broken image warnings
- [ ] `npm run build:ipor` succeeds with no broken image warnings
- [ ] `grep -r "fusion-light.png\|fusion-dark.png" src/` returns no results (PNG refs removed)
- [ ] No files in `public/brand/` contain underscores or spaces in filename
- [ ] `npx astro check` passes (if available)

#### Manual Verification

- [ ] Fusion nav logo is sharp on Retina in both light and dark mode
- [ ] IPOR nav logo is sharp on Retina
- [ ] Footer logo is sharp in both modes
- [ ] Comparison table header logo is sharp in both modes
- [ ] IPOR index card logos are sharp
- [ ] No layout shift when logos load (width/height attributes set correctly)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Add Retina Support to Remaining `<Image>` Components

### Overview

Add `densities={[1, 2]}` to all remaining `<Image>` components that render PNGs. This generates `srcset` with 1x and 2x density descriptors, so Retina displays get 2x resolution images automatically.

### Changes Required

#### 1. Trust Bar Protocol Logos

**File**: `src/sites/fusion/components/trust-bar.astro`
**Lines**: 64-70

Add `densities={[1, 2]}` to the `<Image>` tag:

```astro
<Image
  src={p.logo}
  alt={p.name}
  class="w-auto object-contain transition-all duration-300 brightness-0 opacity-60 group-hover:opacity-90 dark:invert"
  height={Math.round(28 * p.scale)}
  loading="lazy"
  densities={[1, 2]}
/>
```

Source image verification (all have enough pixels for 2x at max display height of 28px = 56px needed):

- aave.png: 2065x345 — adequate
- morpho.png: 2143x433 — adequate
- uniswap.png: 1424x354 — adequate
- compound.png: 900x206 — adequate
- pendle.png: 880x180 — adequate
- more-protocols.png: 2003x550 — adequate

#### 2. Auditor Logos (Security Section)

**File**: `src/sites/fusion/components/security.astro`
**Lines**: 306-312

Add `densities={[1, 2]}`:

```astro
<Image
  src={a.logo}
  alt={a.name}
  class="h-5 w-auto object-contain brightness-0 opacity-50 dark:invert"
  loading="lazy"
  height={20}
  densities={[1, 2]}
/>
```

Source verification (need 40px for 2x):

- blocksec.png: 531x102 — adequate
- ackee.png: 450x186 — adequate
- protofire.png: 813x219 — adequate

#### 3. Vault Overview (Transparency Features)

**File**: `src/sites/fusion/components/transparency-features.astro`
**Lines**: 17-23

Add `densities={[1, 2]}`:

```astro
<Image
  src={vaultOverview}
  alt="Fusion vault overview dashboard showing IPOR USDC Prime vault with performance reports, historical allocation, and credit markets"
  class="w-full max-w-[560px] rounded-2xl border border-border"
  width={560}
  loading="lazy"
  densities={[1, 2]}
/>
```

Source: 2880x3254 — at 2x (1120px wide), source is 2880px wide — adequate.

#### 4. Vault Overview (IPOR Index)

**File**: `src/sites/ipor/pages/index.astro`
**Lines**: 111-116

Add `densities={[1, 2]}`:

```astro
<Image
  src={vaultOverview}
  alt="Fusion App"
  class="w-full rounded-lg md:absolute md:bottom-0 md:right-0 md:w-[45%] md:rounded-tl-[17px] md:rounded-bl-[17px] md:rounded-br-[17px] md:rounded-tr-none object-cover"
  width={560}
  densities={[1, 2]}
/>
```

#### 5. Testimonial Avatars

**File**: `src/sites/fusion/components/testimonials.astro`
**Lines**: 102 and 131

Add `densities={[1, 2]}` to both avatar `<Image>` usages:

```astro
<Image src={t.avatar} alt={t.name} class="h-10 w-10 rounded-full object-cover" loading="lazy" width={40} height={40} densities={[1, 2]} />
```

Source verification (need 80px for 2x):

- james.png: 400x400 — adequate
- vlad.png: 227x227 — adequate
- nick.png: 227x227 — adequate

### Success Criteria

#### Automated Verification

- [ ] `npm run build:fusion` succeeds
- [ ] `npm run build:ipor` succeeds
- [ ] Built HTML contains `srcset` attributes with `1x` and `2x` descriptors for all `<Image>` outputs
- [ ] Verify with: `grep -r "srcset.*2x" dist/` returns matches for vault-overview, protocol logos, auditor logos, avatars

#### Manual Verification

- [ ] Vault overview image is sharp on Retina (fusion site transparency section)
- [ ] Vault overview image is sharp on Retina (IPOR site hero card)
- [ ] Trust bar protocol logos (Aave, Morpho, Uniswap, Compound, Pendle, More Protocols) are sharp on Retina
- [ ] Auditor logos (BlockSec, Ackee, Protofire) are sharp on Retina
- [ ] Testimonial avatars are sharp on Retina
- [ ] Page load performance is acceptable (2x images are larger but appropriately sized)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Move Public Images to `src/shared/assets/` for Astro Optimization

### Overview

Move `public/logos/` and `public/icons/` images to `src/shared/assets/` so they go through Astro's build-time optimization pipeline. For `.astro` components, use `<Image>` directly. For React islands (`hero.tsx`, `fusion-flow.tsx`), use `getImage()` in the parent `.astro` file and pass optimized URLs as props.

### Changes Required

#### 1. Move Image Files

Move files (merge with existing `src/shared/assets/logos/`):

```
public/logos/tesseract.png   → src/shared/assets/logos/tesseract.png
public/logos/clearstar.png   → src/shared/assets/logos/clearstar.png
public/logos/reservoir.png   → src/shared/assets/logos/reservoir.png
public/logos/tau-labs.png    → src/shared/assets/logos/tau-labs.png
public/logos/k3-capital.png  → src/shared/assets/logos/k3-capital.png
public/logos/navigator.png   → src/shared/assets/logos/navigator.png
public/logos/llamarisk.png   → src/shared/assets/logos/llamarisk.png
public/logos/zokyo.png       → src/shared/assets/logos/zokyo.png

public/icons/aave.png        → src/shared/assets/icons/aave.png
public/icons/euler.png        → src/shared/assets/icons/euler.png
public/icons/morpho-dark.png  → src/shared/assets/icons/morpho-dark.png
public/icons/morpho-light.png → src/shared/assets/icons/morpho-light.png
public/icons/usdc.png         → src/shared/assets/icons/usdc.png
public/icons/fusion-light.png → src/shared/assets/icons/fusion-light.png
public/icons/pendle.png       → src/shared/assets/icons/pendle.png (already exists in logos/ at different resolution — this is the icons/ version used in fusion-flow)
```

After moving, delete the now-empty `public/logos/` and `public/icons/` directories.

Note: `public/icons/fusion-light.png` is also used as the favicon (`base-head.astro:18`). The favicon must remain in `public/`. Either keep a copy at `public/icons/fusion-light.png` for the favicon, or move the favicon reference to `public/brand/icon-logo/fusion-icon-purple.svg` (which is a better favicon anyway as it's an SVG). Decision: keep `public/icons/fusion-light.png` for the favicon only and add the icon copy to `src/shared/assets/icons/` for the FusionFlow component.

#### 2. Update `testimonials.astro` — Use `<Image>` for Company Logos

**File**: `src/sites/fusion/components/testimonials.astro`

Add imports for company logos and convert raw `<img>` tags to `<Image>`:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import jamesAvatar from "@/shared/assets/avatars/james.png";
import vladAvatar from "@/shared/assets/avatars/vlad.png";
import nickAvatar from "@/shared/assets/avatars/nick.png";
import tesseractLogo from "@/shared/assets/logos/tesseract.png";
import tauLabsLogo from "@/shared/assets/logos/tau-labs.png";
import reservoirLogo from "@/shared/assets/logos/reservoir.png";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  logo: ImageMetadata;  // Changed from string to ImageMetadata
  avatar: ImageMetadata;
  badge: string;
}

const testimonials: Testimonial[] = [
  {
    // ...existing fields...
    logo: tesseractLogo,
    avatar: jamesAvatar,
    // ...
  },
  {
    // ...existing fields...
    logo: tauLabsLogo,
    avatar: vladAvatar,
    // ...
  },
  {
    // ...existing fields...
    logo: reservoirLogo,
    avatar: nickAvatar,
    // ...
  },
];
---
```

Replace `<img src={t.logo} ...>` at lines 94 and 123 with:

```astro
<Image
  src={t.logo}
  alt={t.company}
  class:list={["w-auto object-contain brightness-0 opacity-30 dark:invert", logoHeight(t.company)]}
  loading="lazy"
  height={logoHeight(t.company) === "h-3" ? 12 : logoHeight(t.company) === "h-[23px]" ? 23 : 20}
  densities={[1, 2]}
/>
```

Note: The `logoHeight` function returns CSS classes. For `<Image>`, we need numeric heights. Create a `logoHeightPx` helper:

```typescript
function logoHeightPx(company: string): number {
  if (company === "Reservoir") return 12;
  if (company === "TAU Labs") return 23;
  return 20;
}
```

#### 3. Update `hero.tsx` — Accept Optimized Image URLs as Props

Since `hero.tsx` is a React island, it cannot use `astro:assets`. Instead, generate optimized images in the parent `.astro` file and pass URLs as props.

**File**: `src/sites/fusion/app/components/hero.tsx`

Update the component interface and logo entries to accept image URLs as props:

```tsx
interface LogoEntry {
  src: string;
  alt: string;
  h: string;
}

interface HeroProps {
  initialTvmFormatted?: string;
  initialVaultCount?: number;
  logos: LogoEntry[];
}

export function Hero({
  initialTvmFormatted,
  initialVaultCount,
  logos,
}: HeroProps) {
  // Remove the hardcoded logoEntries array
  // Use `logos` prop instead of `logoEntries` throughout
  // ...
}
```

**File**: `src/sites/fusion/pages/index.astro`

Import images and use `getImage()` to generate optimized URLs:

```astro
---
import { getImage } from "astro:assets";
import tesseractLogo from "@/shared/assets/logos/tesseract.png";
import clearstarLogo from "@/shared/assets/logos/clearstar.png";
import reservoirLogo from "@/shared/assets/logos/reservoir.png";
import tauLabsLogo from "@/shared/assets/logos/tau-labs.png";
import k3CapitalLogo from "@/shared/assets/logos/k3-capital.png";
import navigatorLogo from "@/shared/assets/logos/navigator.png";
import llamariskLogo from "@/shared/assets/logos/llamarisk.png";

const heroLogos = await Promise.all([
  { img: tesseractLogo, alt: "Tesseract", h: "h-6", height: 24 },
  { img: clearstarLogo, alt: "ClearStar", h: "h-[19px]", height: 19 },
  { img: reservoirLogo, alt: "Reservoir", h: "h-3", height: 12 },
  { img: tauLabsLogo, alt: "Tau Labs", h: "h-6", height: 24 },
  { img: k3CapitalLogo, alt: "K3 Capital", h: "h-6", height: 24 },
  { img: navigatorLogo, alt: "Navigator", h: "h-6", height: 24 },
  { img: llamariskLogo, alt: "LlamaRisk", h: "h-[20px]", height: 20 },
].map(async (entry) => {
  const optimized = await getImage({ src: entry.img, height: entry.height * 2 });
  return { src: optimized.src, alt: entry.alt, h: entry.h };
}));
---

<Hero
  client:load
  initialTvmFormatted={initialTvmFormatted}
  initialVaultCount={initialVaultCount}
  logos={heroLogos}
/>
```

#### 4. Update `fusion-flow.tsx` — Accept Optimized Icon URLs as Props

**File**: `src/sites/fusion/app/components/ui/fusion-flow.tsx`

Update to accept icon URLs as props instead of hardcoding public/ paths:

```tsx
interface FusionFlowProps {
  className?: string;
  icons: {
    aave: string;
    euler: string;
    morphoDark: string;
    morphoLight: string;
    usdc: string;
    fusionLight: string;
  };
}
```

Remove the hardcoded `const iconAave = "/icons/aave.png"` etc. (lines 5-10) and use `icons` prop throughout.

**File**: `src/sites/fusion/components/how-it-works.astro`

Import images and use `getImage()`:

```astro
---
import { getImage } from "astro:assets";
import FusionFlow from "../app/components/ui/fusion-flow";
import iconAaveSrc from "@/shared/assets/icons/aave.png";
import iconEulerSrc from "@/shared/assets/icons/euler.png";
import iconMorphoDarkSrc from "@/shared/assets/icons/morpho-dark.png";
import iconMorphoLightSrc from "@/shared/assets/icons/morpho-light.png";
import imgUsdcSrc from "@/shared/assets/icons/usdc.png";
import iconFusionLightSrc from "@/shared/assets/icons/fusion-light.png";

const [iconAave, iconEuler, iconMorphoDark, iconMorphoLight, imgUsdc, iconFusionLight] = await Promise.all([
  getImage({ src: iconAaveSrc, height: 44 }),
  getImage({ src: iconEulerSrc, height: 44 }),
  getImage({ src: iconMorphoDarkSrc, height: 44 }),
  getImage({ src: iconMorphoLightSrc, height: 44 }),
  getImage({ src: imgUsdcSrc, width: 32 }),
  getImage({ src: iconFusionLightSrc, width: 84 }),
]);

const flowIcons = {
  aave: iconAave.src,
  euler: iconEuler.src,
  morphoDark: iconMorphoDark.src,
  morphoLight: iconMorphoLight.src,
  usdc: imgUsdc.src,
  fusionLight: iconFusionLight.src,
};
---

<FusionFlow client:visible className="w-full max-w-135" icons={flowIcons} />
```

### Success Criteria

#### Automated Verification

- [ ] `npm run build:fusion` succeeds
- [ ] `npm run build:ipor` succeeds
- [ ] `public/logos/` directory no longer exists (or is empty)
- [ ] `public/icons/` contains only `fusion-light.png` (favicon)
- [ ] `grep -r '"/logos/' src/` returns no results
- [ ] `grep -r '"/icons/' src/` returns no results except `base-head.astro` favicon reference
- [ ] All tests pass: `npm test`

#### Manual Verification

- [ ] Hero "Trusted by" logos render correctly in both light and dark mode
- [ ] Hero marquee on mobile works correctly
- [ ] FusionFlow diagram icons (Aave, Euler, Morpho, USDC, Fusion) render correctly
- [ ] FusionFlow morpho icon switches between dark/light variants on theme toggle
- [ ] Testimonial company logos render correctly
- [ ] Favicon still works
- [ ] All images are sharp on Retina

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: Fix SEO Metadata

### Overview

Wire up `ipor-app-meta.png` as IPOR's OG image, add missing OG image dimensions and alt, make `robots.txt` site-aware, and fix the brand kit link.

### Changes Required

#### 1. Use `ipor-app-meta.png` as IPOR's OG Image

**File**: `src/sites/ipor/pages/index.astro`

Pass the `image` prop to `BaseLayout`:

```astro
<BaseLayout
  title="Fusion by IPOR | Onchain Vault Infrastructure"
  description="Build your own institutional-grade yield strategies or explore existing ones via the Fusion App."
  image="/brand/ipor-app-meta.png"
>
```

#### 2. Add Missing OG Image Tags

**File**: `src/shared/components/base-head.astro`

Add `og:image:width`, `og:image:height`, and `og:image:alt` after the existing `og:image` tag (line 25):

```astro
---
interface Props {
  title: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
}

const {
  title,
  description,
  image = "/fusion-og-default.png",
  imageWidth = 2400,
  imageHeight = 1350,
} = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!-- After og:image -->
<meta property="og:image" content={new URL(image, Astro.site)} />
<meta property="og:image:width" content={String(imageWidth)} />
<meta property="og:image:height" content={String(imageHeight)} />
<meta property="og:image:alt" content={title} />
```

Update `base-layout.astro` to pass through the new props.

Note: Both `fusion-og-default.png` and `ipor-app-meta.png` are 2400x1350, so the default values work for both.

#### 3. Make `robots.txt` Site-Aware

Replace the static `public/robots.txt` with a dynamic endpoint that uses the correct site URL.

**Delete**: `public/robots.txt`

**Create**: `src/shared/pages/robots.txt.ts` (and symlink/re-export from each site's `pages/` directory)

```typescript
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL("/sitemap-index.xml", site).href;
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
```

**Create**: `src/sites/fusion/pages/robots.txt.ts`

```typescript
export { GET } from "@/shared/pages/robots.txt";
```

**Create**: `src/sites/ipor/pages/robots.txt.ts`

```typescript
export { GET } from "@/shared/pages/robots.txt";
```

This ensures `https://ipor.io/robots.txt` references `https://ipor.io/sitemap-index.xml` and `https://fusion.ipor.io/robots.txt` references `https://fusion.ipor.io/sitemap-index.xml`.

#### 4. Fix Brand Kit Link

**File**: `src/shared/components/footer.astro`
**Line**: 126

Change:

```
href="https://drive.google.com/drive/folders/1RNoJP4LpfhV3G8p9Eq9xFoorq4RyW29_"
```

To:

```
href="https://drive.google.com/drive/folders/1uZ0nfbzsIaburx7C2xR-JAcedNtQQIsH"
```

### Success Criteria

#### Automated Verification

- [ ] `npm run build:fusion` succeeds
- [ ] `npm run build:ipor` succeeds
- [ ] Fusion `dist/robots.txt` contains `https://fusion.ipor.io/sitemap-index.xml`
- [ ] IPOR `dist/robots.txt` contains `https://ipor.io/sitemap-index.xml`
- [ ] `grep "og:image:width" dist/index.html` returns a match
- [ ] `grep "og:image:height" dist/index.html` returns a match
- [ ] `grep "og:image:alt" dist/index.html` returns a match
- [ ] IPOR build: `grep "ipor-app-meta" dist/index.html` returns a match for og:image

#### Manual Verification

- [ ] Share fusion.ipor.io link on X/Telegram — preview shows correct image
- [ ] Share ipor.io link on X/Telegram — preview shows `ipor-app-meta.png`
- [ ] Footer "Brand Assets" link opens the correct Google Drive folder
- [ ] Validate OG tags via https://www.opengraph.xyz/ or similar tool

---

## Testing Strategy

### Unit Tests

No new unit tests needed — changes are primarily template/config level.

### Integration Tests

- Build both sites: `npm run build:fusion && npm run build:ipor`
- Verify no broken image references in built HTML
- Verify `srcset` attributes present in built HTML for `<Image>` outputs

### Manual Testing Steps

1. Run `npm run dev:fusion` and `npm run dev:ipor`
2. Open both on a Retina display (MacBook or iOS device)
3. Verify every logo and image is sharp:
   - Fusion nav logo (light + dark mode)
   - Footer logo (light + dark mode)
   - Comparison table header logo
   - Trust bar protocol logos (6 logos)
   - Auditor logos (3 logos)
   - Vault overview screenshot
   - Hero "Trusted by" logos (7 logos)
   - FusionFlow diagram icons
   - Testimonial avatars and company logos
   - IPOR site card logos
4. Test on mobile (responsive marquee, layout)
5. Validate OG/Twitter meta using social preview tools

## Performance Considerations

- SVGs for brand logos are typically smaller than PNGs — net file size improvement
- `densities={[1, 2]}` doubles the number of image variants generated at build time. However, browsers only download the variant matching their display density, so runtime performance is unchanged
- `getImage()` generates optimized images at build time — no runtime cost
- Total build time may increase slightly due to more image processing

## References

- Original ticket: `thoughts/tickets/fsn_00031-optimize-images.md`
- Astro Image docs: https://docs.astro.build/en/guides/images/
- Astro `getImage()` API: https://docs.astro.build/en/reference/modules/astro-assets/#getimage
