## Astro Migration — Optimization Follow-ups

### 1. Create OG Image

- `public/og-default.png` is referenced in `src/components/base-head.astro` but the file does not exist yet
- Design a 1200x630px image with Fusion branding for social sharing previews (Slack, Twitter/X, Discord, LinkedIn)
- This is what people see when pasting a `fusion.ipor.io` link

### 2. Convert Static Sections from React Islands to Astro Templates

Currently all landing page sections are React islands (`client:load` / `client:visible`). Several sections have zero runtime interactivity — they only used React's `useTheme()` for conditional dark/light classes. Now that theme is CSS-only (`html.dark` + Tailwind `dark:` variants), these can become pure `.astro` files that ship zero JavaScript.

**What "converting" means concretely:**

- Create a new `src/components/<name>.astro` file
- Translate the JSX to Astro template syntax (almost identical, but `className` → `class`, no hooks, no imports from React)
- Replace every `isDark ? "classA" : "classB"` pattern with `class="classB dark:classA"`
- Replace every `isDark ? inlineStyleA : inlineStyleB` pattern with CSS custom properties (add to `src/styles/theme.css` under `:root` and `html.dark`)
- Replace JS hover effects (`onMouseEnter`/`onMouseLeave` setting opacity) with `class="hover:opacity-70"`
- Replace logo switching (`src={isDark ? dark : light}`) with two `<img>` tags: `class="block dark:hidden"` / `class="hidden dark:block"`
- Replace `cn()` calls with plain `class` strings using `dark:` variants
- Update `src/pages/index.astro` to import the `.astro` component instead of the React one (and remove the `client:` directive)

**Sections to convert** (ordered by simplicity):

1. **final-cta** (`src/app/components/final-cta.tsx`, 97 lines) — Simplest. Only `useTheme` + one `hover:opacity-70` replacement. No data, no child components.

2. **trust-bar** (`src/app/components/trust-bar.tsx`, 100 lines) — Only `useTheme` + image paths. Grid of protocol logo links with CSS hover effects. No JS behavior.

3. **transparency-features** (`src/app/components/transparency-features.tsx`, 145 lines) — Only `useTheme` + SMIL SVG icons from `transparency-icons.tsx`. The SMIL icons are pure SVG animation (no React/JS), so they can be inlined directly into the Astro template as raw SVG.

4. **security** (`src/app/components/security.tsx`, 525 lines) — Larger file due to CodeBlock rendering. The `onMouseEnter`/`onMouseLeave` on "View on GitHub" link becomes `hover:border-[#8429FF] hover:text-[#8429FF]`. The CodeBlock has ~10 theme-dependent color variables that need to become CSS custom properties in `theme.css`. More work but still no runtime JS needed.

5. **footer** (`src/app/components/footer.tsx`, 310 lines) — Uses `useTheme` + several gradient inline styles that need CSS variables. Has a "Cookie Policy" `onClick` that dispatches a `CustomEvent` (tiny inline `<script>` in Astro). Has a "Fusion Vaults" `#top` link with smooth scroll (also a tiny inline script or `onclick` attribute). Most of the component is static link columns.

6. **testimonials** (`src/app/components/testimonials.tsx`) — Uses `ImageWithFallback` which has a `useState` for image error handling. Could replace with a plain `<img>` + CSS fallback or `onerror` attribute. Low priority since the JS overhead is minimal.

**Sections that must stay as React islands** (real runtime interactivity):

- `hero` — AnimatedGroup (motion library)
- `benefits` — GlowingEffect (pointer tracking + motion)
- `how-it-works` — FusionFlow (motion animations)
- `solutions` — fusion-icons (motion-animated SVGs)
- `comparison-table` — fusion-icons (motion-animated SVGs)
- `nav` — scroll detection, mobile menu state, theme toggle
- `cookie-banner-island` — sessionStorage state
