# Unify Footer Implementation Plan

## Overview

Eliminate the duplicate React footer by making all pages use the single Astro footer. Extract `linkColumns` data to a shared module, fix the Python SDK link, and ensure cookie settings work on every page.

## Current State Analysis

- **Astro footer** (`src/components/footer.astro`) — used on index page. Cookie settings dispatches `CustomEvent('open-cookie-settings')` which `CookieBannerIsland` listens for. Works correctly.
- **React footer** (`src/app/components/footer.tsx`) — embedded inside `PrivacyPolicyPage` and `TermsOfUsePage` React islands. Has unused `onOpenCookieSettings` prop (never passed). Has `as unknown as { soon?: boolean }` type hack at line 93.
- `linkColumns` data is copy-pasted verbatim in both files.
- Python SDK link uses `href="#"` with no `soon` flag — renders as clickable dead link.
- Legal pages have **no** `CookieBannerIsland`, so cookie settings link does nothing.
- Brand guidelines page has no footer at all.

### Key Discoveries:

- `CookieBannerIsland` (`src/components/cookie-banner-island.tsx:37-41`) listens for `window` event `open-cookie-settings` — this is the mechanism both Astro pages and legal pages should use
- Legal pages are Astro pages that render a single React island for content: `privacy-policy.astro:10`, `terms-of-use.astro:10`
- The Astro footer's inline `<script>` handles both scroll-to-top and cookie settings via data attributes

## Desired End State

- **One footer implementation** — the Astro footer in `src/components/footer.astro`
- **One data source** — `linkColumns` lives in `src/data/footer-links.ts`, imported by the Astro footer
- **Python SDK** — links to `https://github.com/IPOR-Labs/ipor-fusion.py` (no longer a dead link or "soon")
- **Cookie settings works on all pages** — legal pages include `CookieBannerIsland`
- **React footer deleted** — `src/app/components/footer.tsx` removed
- All pages render the footer outside of React islands (zero JS footprint)

### Verification:

- `npm run build` succeeds with no errors
- All 4 pages render the footer correctly
- Cookie settings link opens the banner on index, privacy-policy, and terms-of-use pages
- Python SDK link navigates to the GitHub repo
- No references to the deleted React footer remain
- "FUSN Token" still shows the "Soon" badge

## What We're NOT Doing

- Redesigning the footer layout or styles
- Adding a footer to the brand-guidelines page (it intentionally has none)
- Changing the `CookieBannerIsland` implementation
- Modifying the base layout to include the footer globally (pages opt in)

## Implementation Approach

Three phases: extract shared data, migrate pages to Astro footer, delete the React footer.

---

## Phase 1: Extract `linkColumns` to a Shared Module

### Overview

Create a typed shared data file so both footers (temporarily) and later just the Astro footer can import the link data from one place.

### Changes Required:

#### 1. Create `src/data/footer-links.ts`

**File**: `src/data/footer-links.ts` (new)

```ts
export interface FooterLink {
  label: string;
  href: string;
  soon?: boolean;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

export const linkColumns: FooterLinkColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Fusion Vaults", href: "#top" },
      {
        label: "Interest Rate Swaps",
        href: "https://app.ipor.io/swaps/ethereum",
      },
    ],
  },
  {
    title: "Governance",
    links: [
      { label: "Snapshot", href: "https://snapshot.org/#/s:ipordao.eth" },
      { label: "FUSN Token", href: "#", soon: true },
    ],
  },
  {
    title: "Security",
    links: [
      {
        label: "Audits",
        href: "https://docs.ipor.io/build-on-fusion/developer-guide/audits",
      },
      {
        label: "Bug Bounty",
        href: "https://immunefi.com/bug-bounty/ipor/information/",
      },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "https://docs.ipor.io/" },
      { label: "GitHub", href: "https://github.com/IPOR-Labs" },
      {
        label: "Python SDK",
        href: "https://github.com/IPOR-Labs/ipor-fusion.py",
      },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "X / Twitter", href: "https://x.com/ipor_io" },
      { label: "Discord", href: "https://discord.com/invite/bSKzq6UMJ3" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/73049136/" },
      { label: "Medium Blog", href: "https://blog.ipor.io/" },
    ],
  },
];
```

**Key changes from the original data:**

- Python SDK gets the real URL: `https://github.com/IPOR-Labs/ipor-fusion.py`
- `soon` is properly typed in the `FooterLink` interface (eliminates the `as unknown as` hack)

#### 2. Update `src/components/footer.astro`

**File**: `src/components/footer.astro`

Replace the inline `linkColumns` definition in the frontmatter with an import:

```astro
---
import { linkColumns } from "../data/footer-links";
---
```

Remove the entire `const linkColumns = [...]` block (lines 4–43). No other changes — the template already handles `link.soon` correctly.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npx astro check` passes
- [ ] No TypeScript errors

#### Manual Verification:

- [ ] Index page footer renders identically to before
- [ ] Python SDK link now navigates to GitHub repo

---

## Phase 2: Migrate Legal Pages to Astro Footer

### Overview

Remove the React footer from `PrivacyPolicyPage` and `TermsOfUsePage`, and instead render the Astro footer + `CookieBannerIsland` in the `.astro` page files.

### Changes Required:

#### 1. Update `src/app/components/privacy-policy-page.tsx`

**File**: `src/app/components/privacy-policy-page.tsx`

- Remove the `import { Footer }` line (line 2)
- Remove `<Footer />` from the JSX (line 133)

The component's return should end with:

```tsx
      </main>
    </div>
  );
```

#### 2. Update `src/app/components/terms-of-use-page.tsx`

**File**: `src/app/components/terms-of-use-page.tsx`

- Remove the `import { Footer }` line (line 2)
- Remove `<Footer />` from the JSX (line 137)

Same pattern as privacy-policy.

#### 3. Update `src/pages/privacy-policy.astro`

**File**: `src/pages/privacy-policy.astro`

```astro
---
import BaseLayout from "../layouts/base-layout.astro";
import { PrivacyPolicyPage } from "../app/components/privacy-policy-page.tsx";
import Footer from "../components/footer.astro";
import CookieBannerIsland from "../components/cookie-banner-island.tsx";
---

<BaseLayout
  title="Privacy Policy | Fusion by IPOR"
  description="Privacy Policy for Fusion by IPOR - Onchain Vault Infrastructure"
>
  <PrivacyPolicyPage client:load />
  <Footer />
  <CookieBannerIsland client:idle />
</BaseLayout>
```

#### 4. Update `src/pages/terms-of-use.astro`

**File**: `src/pages/terms-of-use.astro`

```astro
---
import BaseLayout from "../layouts/base-layout.astro";
import { TermsOfUsePage } from "../app/components/terms-of-use-page.tsx";
import Footer from "../components/footer.astro";
import CookieBannerIsland from "../components/cookie-banner-island.tsx";
---

<BaseLayout
  title="Terms of Use | Fusion by IPOR"
  description="Terms of Use for Fusion by IPOR - Onchain Vault Infrastructure"
>
  <TermsOfUsePage client:load />
  <Footer />
  <CookieBannerIsland client:idle />
</BaseLayout>
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npx astro check` passes

#### Manual Verification:

- [ ] Privacy policy page renders footer correctly
- [ ] Terms of use page renders footer correctly
- [ ] Cookie settings link opens the cookie banner on both legal pages
- [ ] Footer links, styles, and gradients are identical to the index page
- [ ] Scroll-to-top ("Fusion Vaults") link works on legal pages

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation that the footer renders correctly on legal pages before proceeding.

---

## Phase 3: Delete React Footer

### Overview

Remove the now-unused React footer component.

### Changes Required:

#### 1. Delete `src/app/components/footer.tsx`

Remove the file entirely.

#### 2. Verify no remaining references

Search for any imports of `@/app/components/footer` or `../footer` from the app components directory. There should be none after Phase 2.

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npx astro check` passes
- [ ] `grep -r "app/components/footer" src/` returns no results
- [ ] No TypeScript errors

#### Manual Verification:

- [ ] All pages still render correctly

---

## Testing Strategy

### Automated:

- Full build (`npm run build`) confirms no broken imports or type errors
- `npx astro check` validates Astro templates

### Manual Testing Steps:

1. Visit index page — footer renders with all links, "FUSN Token" shows "Soon" badge
2. Click "Python SDK" — opens `https://github.com/IPOR-Labs/ipor-fusion.py` in new tab
3. Click "Cookie Policy" on index — cookie banner appears
4. Visit `/privacy-policy` — footer renders, cookie settings link works
5. Visit `/terms-of-use` — footer renders, cookie settings link works
6. Click "Fusion Vaults" in footer — scrolls to top smoothly
7. Toggle dark/light mode — footer logo switches correctly on all pages

## References

- Original ticket: `thoughts/tickets/fsn_0014-unify-footer.md`
- Astro footer: `src/components/footer.astro`
- React footer (to delete): `src/app/components/footer.tsx`
- Cookie banner: `src/components/cookie-banner-island.tsx`
