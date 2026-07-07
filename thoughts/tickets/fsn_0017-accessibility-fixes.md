## Accessibility Fixes

**Priority:** Medium
**Source:** FSN-0006 code review

### Tasks

- [ ] Add `aria-label="Close"` to cookie banner close button — `cookie-banner-island.tsx:57`
- [ ] Add `aria-expanded={menuState}` to hamburger toggle button — `nav.tsx:75`
- [ ] Add `aria-hidden="true"` to decorative SVGs in `transparency-features.astro:54-191`
- [ ] Add meaningful `alt` text to partner logos in `hero.tsx:163-276` (e.g., `alt="Aave"`) — currently `alt=""` under a "Trusted by" heading, so screen readers hear nothing
- [ ] Add `<link rel="icon" href="/brand/fusion.png">` (or proper favicon) to `base-head.astro`
- [ ] Consider adding semantic table markup (`role="table"`, `role="row"`, `role="columnheader"`) to comparison table `div` grid in `comparison-table.tsx:133-231`, or refactor to use `<table>` elements
