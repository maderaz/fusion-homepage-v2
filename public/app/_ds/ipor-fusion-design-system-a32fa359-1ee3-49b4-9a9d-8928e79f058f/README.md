# IPOR Fusion — Design System

> Vault infrastructure for institutional‑grade yield.

## What is Fusion?

**IPOR Fusion** (by IPOR) is a vault-infrastructure protocol for DeFi. It lets builders deploy modular, transparent, onchain vault strategies — and lets liquidity providers earn yield through professionally curated vaults. Strategies are composed from "fuse modules" that plug into leading DeFi protocols (Aave, Morpho, SparkLend, Euler, and others).

Three audiences, one product:

- **Builders & Curators ("Atomists")** — assemble vaults from a fuse library, deploy via Factory, earn curator fees.
- **Liquidity Providers** — one-click deposit into curated, auto-optimized strategies.
- **Protocols & Distributors** — embed Fusion vaults as a yield primitive inside their own product (wallets, CEXs, fintechs).

Headline numbers used on the marketing site: **$128.0M TVM · 81 vaults · $10B+ volume processed**.

## What's in this design system

This folder is the source of truth for everything brand-related: colors, typography, foundation rules, brand assets, and a reusable UI kit that recreates the marketing site.

### Index

| File / folder | Purpose |
|---|---|
| `README.md` | this document |
| `SKILL.md` | Agent SKILL entry point — read first if you're an AI assistant |
| `colors_and_type.css` | CSS variables for color, type, radii, shadows, motion |
| `assets/` | logos (purple / black / white), background plates, avatars, partner logos, vault dashboard screenshot |
| `preview/` | small HTML cards that populate the Design System review tab |
| `ui_kits/website/` | high-fidelity recreation of fusion.ipor.io — components + index.html |
| `brand_guidelines_text.md` | raw text extracted from the 6 supplied Brand Guidelines PDFs |

### Sources used

- **Figma (mounted virtual filesystem):** `Fusion website.fig` — 1 page, 2 frames (`1440w default` desktop site + a sticker-sheet of 89 component variants). Used as the primary source of truth for color, type, spacing and layout values.
- **Brand Guidelines (uploaded PDFs):**
  - 01 Logo Variations (Primary, Vault Highlight, Powered by)
  - 02 Color Variations (logo on different backgrounds)
  - 03 Don't‑dos (logo misuse)
  - 04 Brand Colors (primary, neutrals, DAO/derivatives blue)
  - 05 Typography (Poppins / Source Sans Pro)
  - 06 Backgrounds (purple glow plates)
- **Uploaded raster assets:** `Fusion logo.png` (white master), `BG_01–04.png` (four purple-grid background plates).
- **Live site:** https://fusion.ipor.io — the Figma file is a `html.to.design` capture of this URL.

> The reader is **not assumed to have access** to the Figma or PDFs; every value used by this system has been extracted into `colors_and_type.css` and the preview cards.

---

## Content fundamentals

Copy on Fusion is **terse, technical, and confident**. It reads like a B2B infrastructure product, not a consumer app — closer to Vercel or Stripe than to Coinbase.

**Tone & voice.** Authoritative and matter-of-fact. No hype, no exclamation marks, no slogans. Sentences are short, capabilities are stated as facts ("Modular infrastructure across Aave, Morpho, SparkLend, Euler"). The brand earns trust by sounding precise.

**Person.** Mostly impersonal / second-person ("you always know exactly what's happening with your capital"). Never "we"/"us" outside testimonials. The product is the subject.

**Casing.** Sentence case for headlines; Title Case for product names and proper nouns ("Fusion Vaults", "Atomist", "Factory", "Liquidity Providers"). Buttons use Title Case ("Launch App", "Start Building", "View Vaults").

**Numbers.** Always live, always precise: `$128.0M`, `81`, `$10B+`, `100%` (no rounding to "120M+" or "many"). Stats sit in Source Sans 3, slightly tighter tracking than the body Poppins.

**Headlines pattern.** "[Noun phrase] for [audience/outcome]." or "[Verb] [object]."
Examples lifted verbatim:
- "Vault infrastructure for institutional‑grade yield."
- "See everything. Trust nothing blindly."
- "Built for every participant in the vault stack."
- "How Fusion Vaults outperform the alternative."
- "The Vault layer is ready."

**Sub-heads pattern.** One sentence, explanatory, plain English, names the protocols by name when relevant. "Deploy and manage onchain vault strategies or earn through professionally curated vaults. Modular infrastructure across Aave, Morpho, SparkLend, Euler, and more."

**Feature labels.** Title Case noun phrases, ~3–5 words. "Historical Allocation Breakdown", "Protocol-Level Credit Markets", "Live Yield Metrics", "Transaction-Level Auditability".

**Disclaimers.** Footnotes are lowercase, italic-feeling (actually just lighter), prefixed with `*`. Example: *"\*Product interface shown for illustrative purposes only. Displayed values are simulated and do not represent actual portfolio performance, balances, or guaranteed returns."*

**Vocabulary cheatsheet.** Use: *vault, fuse module, atomist, curator, allocation, yield, onchain, modular, composable, transparent, institutional-grade*. Avoid: *web3, crypto, DeFi-bro lingo, "to the moon", emoji-as-decoration*.

**Emoji.** Never. The brand uses outline icons (Lucide-style) and no emoji whatsoever — not even in headings, marketing, or social copy.

**Naming.** "Fusion" is the primary brand. During the transition period, the lockup is **"Fusion by IPOR"** — never "IPOR Fusion". When promoting a specific vault, the "by IPOR" can be omitted in favor of a "Vault Highlight" lockup.

---

## Visual foundations

The Fusion aesthetic is **clean, white, geometric, with a single saturated purple as the brand spike.** Think enterprise-fintech precision with a faint sci-fi undertone from the isometric grid backgrounds.

### Color system

One brand color — **Fusion Purple `#8429FF`** — used as fill, gradient, and ambient glow. Everything else is grayscale.

- Primary: `#8429FF` → gradient end `#6C00FF` (most CTAs are this gradient, top-to-bottom)
- Lighter accent: `#A37FFF` (hover tints, secondary fills)
- Tint background: `#F3F0FF` (page wash behind hero)
- Alpha glows: `rgba(132,41,255, 0.03/0.04/0.06/0.07)` — used as enormous soft blobs behind sections
- Neutrals: `#FFFFFF` surface, `#F5F5FA` page, `#E9E9F3` alt section, `#E5E5E5` strokes, `#000` heading text, `#70747A` body, `#9BA3AF` muted
- Dark mode: `#090E14` canvas, `#161A20` cards, `#2E3137` strokes, `#9BA3AF` body, `#FFFFFF` heading
- Reserved (do not use on Fusion surfaces): IPOR Blue `#006EF2` is for the *Derivatives / DAO* sibling product only.

### Typography

- **Poppins** runs everything — headings (Medium 500), card titles (SemiBold 600), body (Regular 400), buttons (Bold 700 with 0.04em tracking).
- **Source Sans 3** (the modern name for Source Sans Pro) is reserved for *numerals* — TVM, AUM, vault stats. Numerals get -0.025em tracking and need height-tuning when sitting next to Poppins.
- **Inter Light 12px** appears inside the product dashboard (UI numerics).
- **JetBrains Mono 12.5px** appears inside the product dashboard (addresses, hashes, code).
- The hero is **60px / 75px line height, weight 500**, never bigger. Section openers ("Plug & Play", "The Vault layer is ready.") are **45px / 60px line height, weight 500**.

### Spacing & layout

- Site grid: **1152px content max, centered, with ~136px gutter on a 1425px viewport.**
- Section vertical padding: typically **112px–160px top/bottom** for major sections; **64px** between header and grid.
- Cards: **32px** internal padding, **16px** border-radius (universally — every card, screenshot, image), **1px solid `#E5E5E5`** border.
- Feature grids are typically **3-up** at desktop with **24–40px gaps**; comparison/audience grids are **2x2**.
- Nav: 71px tall, semi-transparent `rgba(245,245,250,0.8)` with **40px backdrop-blur**.

### Backgrounds

Two distinct background languages, used in sequence as the page scrolls:

1. **White / tinted-purple plates** — the default. A nearly-white canvas (`#F5F5FA`) with one or two enormous soft purple blobs (`rgba(132,41,255,0.07)` at ~400×500 radius) behind sections like the comparison table and final CTA. Light, airy, mostly empty space.
2. **Isometric grid plates** — supplied as `BG_01–04.png`. Diamond grid lines fading into a purple radial glow, rendered top, bottom, side, or corner. Used full-bleed behind hero / final-CTA / final transition moments. They feel like a stylized 3D floor — a "vault" metaphor without ever showing a vault.

There is also a **3%-opacity noise overlay** layered over the hero (a 756×756 noise SVG) — important detail; the page is not flat-flat.

### Animation & motion

The marketing site is **very subtle**: there are no scroll-driven animations, no parallax, no auto-rotating carousels. Motion is reserved for:

- Button hover/press: short (≤220ms) opacity / gradient brightness change
- Smooth scroll for in-page anchors
- Cards lift on hover with a small `translateY(-2px)` and shadow gain
- Subtle "noise" + grid plates feel ambient/static
- Easing: prefer `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out`) for everything

No bounces, no spring physics, no Lottie. Motion supports utility — it doesn't decorate.

### Hover / press states

- **Primary buttons** (purple gradient): on hover, brightness lifts ~5%; press = brightness drops + 1px translateY
- **Secondary buttons** (outline gray): hover = border darkens to `#000`, text stays
- **Cards**: hover = `translateY(-2px)` + `--shadow-lift`
- **Links / nav items**: hover = text color slides toward `#000` from `#70747A`; active route is `#000` bold
- Never use color *changes* (red→green) for hover — only tone/elevation

### Borders, corners, shadows

- **Corner radius** is consistently **16px** for cards & screenshots, **8–12px** for inputs/icon-containers, **9999px** for buttons (pills) and avatars. The product UI inside the dashboard image uses tighter **8px** corners.
- **Borders are heavily used** — every card has `1px solid #E5E5E5` (light) or `#2E3137` (dark). Border-only cards are common; this is *the* card aesthetic.
- **Shadows are rare and low-alpha.** The only shadow in the Figma capture is `rgba(0,0,0,0.06)`. Big drop shadows are not part of the brand. When a card lifts on hover, it lifts via translation more than via shadow.
- **No inner shadows / no "glassy" highlights.** Stay flat.

### Transparency & blur

- The fixed top nav is `rgba(245,245,250,0.8)` with `backdrop-filter: blur(40px)` — this is the *only* place blur is used.
- Section backgrounds use translucent purple blobs but not blur.
- Avoid macOS-style "frosted" panels elsewhere.

### Imagery vibe

- Product screenshots: dark-mode UI captured at 16:9-ish, rounded 16px, 1px stroke. The dashboard captures show purple highlights against `#161A20` — same brand colors at work.
- Avatars: round, neutral, no decorative frame.
- Partner logos: rendered at **30% opacity** in monochrome inside testimonial cards — they are credentials, not adverts.
- No illustrations, no 3D renders, no marketing photography of people.

### Layout rules

- Fixed top nav at all viewports.
- Hero is left-aligned, sub-head sits at ~672px max-width, CTA row plus stats row.
- Section headers can be **left-aligned** (in 50/50 layouts like "See everything. Trust nothing blindly.") or **centered** (in centered-grid sections like "Plug & Play").
- Testimonial cards: one large hero-testimonial row on top, then a 2-column grid below.
- Comparison table is a real table — left column = feature, two right columns = "Fusion" vs "Alternative".

---

## Iconography

Fusion's icon style is **outline, 1.5–2px stroke, rounded line caps**, monochrome (currently black or purple-on-light, white-on-dark). They look like **Lucide / Heroicons (outline)** — single-color, geometric, no fill.

In the Figma capture, all icons are inline SVG vectors (rebuilt from a Lucide-style set during the html.to.design import). Inside the product dashboard they're used at **16–18px**, in feature cards at **20–32px**, in section headers at **48px**.

Specific icon usage observed in the marketing page:

- Hero CTA arrow: → (chevron-right)
- Feature list checkmarks/bullets: small 12px geometric markers
- Dashboard: line-graph, table, dollar, eye (transparency), shield (security), grid (allocation)
- Toggle theme: sun / moon swap
- External link indicator: 12px arrow-up-right
- Social (footer): X/Twitter, GitHub, Discord — monochrome `#70747A`, hover = `#000`

**Recommendation for this design system:** use **[Lucide](https://lucide.dev)** at 1.5px stroke. Load via CDN (`unpkg.com/lucide-static@latest`) or `lucide-react`. Substitution flagged — see *Caveats* at the end.

**Emoji:** never. Even in social copy, the brand uses outline icons, not 🎉.
**Unicode glyphs:** rarely — `•` for inline separators is acceptable. No ✓ ✗ ★. Use SVG.
**Logos:** the Fusion glyph (purple "atom" mark with diagonal slash) is itself a frequent micro-icon — `assets/fusion-logo-purple.png` and `-white.png` and `-black.png`.

---

## Caveats & open questions

- **Font substitution.** The brand calls for **Source Sans Pro**; the modern Adobe-blessed equivalent on Google Fonts is **Source Sans 3** (renamed in 2022). This system uses Source Sans 3. If the brand owns Source Sans Pro license files, drop the `.woff2` into `fonts/` and update `--font-numeric`.
- **Icon set.** No icon font/sprite was supplied. This system standardizes on **Lucide** (CDN-loaded) — substitution flagged. If Fusion has a custom icon kit, drop the SVGs into `assets/icons/` and update the UI kit's `<Icon>` component.
- **Logo recolors.** A white logo was supplied; this system algorithmically tinted it to produce purple and black variants. They look correct but were not signed off by the brand team.
- **Mobile.** The Figma capture is desktop-only (1440w). Mobile breakpoints in the UI kit are inferred — verify with the brand team or supply mobile Figma frames.
- **Component library.** The Figma file has 89 "Variant N" components but no labels — they're an html.to.design dump rather than a curated kit. The UI kit recreates the components seen in actual page layouts, not all 89 variants.

---

If you're an agent picking this up: read `SKILL.md` first, then `colors_and_type.css`, then `ui_kits/website/index.html` as a working reference for how the system clicks together.
