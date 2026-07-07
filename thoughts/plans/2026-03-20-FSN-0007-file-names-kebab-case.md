# Rename All Source Files to kebab-case — Implementation Plan

## Overview

Rename all 18 PascalCase `.tsx` files in `src/` to kebab-case and update every import reference. This enforces a consistent naming convention across the codebase, matching the pattern already used in `src/app/components/ui/`.

## Current State Analysis

- 18 files use PascalCase names (e.g., `HowItWorks.tsx`, `BrandGuidelinesPage.tsx`)
- All files in `src/app/components/ui/` and `src/styles/` already use kebab-case
- All imports are static relative paths — no barrel `index.ts` files, no dynamic `import()`, no `React.lazy`
- The `@/` alias (defined in `vite.config.ts:11`) is only used for asset imports, all already kebab-case
- No CSS modules exist; all styling is Tailwind utility classes
- Route path strings in `src/app/routes.tsx` are independent of filenames
- macOS default filesystem is case-insensitive, requiring two-step `git mv` (file → temp → target)

## Desired End State

Every `.ts`/`.tsx` source file in `src/` follows kebab-case naming. All import paths match the new filenames. The project builds, lints, and tests cleanly.

### Verification:

- `npm run build` succeeds
- `npm run lint` passes
- `npx vitest run` passes
- `git diff --name-only` shows only renames and import path updates

## What We're NOT Doing

- Renaming exported component names (e.g., `HowItWorks` component stays `HowItWorks`)
- Renaming asset files (already kebab-case)
- Renaming config files in the project root
- Changing directory names
- Modifying any component logic or markup

## Implementation Approach

Single atomic phase: rename all files via `git mv` with two-step process for case-insensitive FS, then update all imports. Everything must happen together since partial renames break the build.

## Phase 1: Rename Files and Update Imports

### Overview

Rename all 18 files and update all ~25 import statements that reference them.

### File Renames (via `git mv`):

Each rename requires two steps due to macOS case-insensitive FS:

```bash
git mv src/path/File.tsx src/path/file-tmp.tsx
git mv src/path/file-tmp.tsx src/path/file.tsx
```

| #   | Current Path                                     | New Path                                           |
| --- | ------------------------------------------------ | -------------------------------------------------- |
| 1   | `src/App.test.tsx`                               | `src/app.test.tsx`                                 |
| 2   | `src/app/App.tsx`                                | `src/app/app.tsx`                                  |
| 3   | `src/app/Landing.tsx`                            | `src/app/landing.tsx`                              |
| 4   | `src/app/components/Benefits.tsx`                | `src/app/components/benefits.tsx`                  |
| 5   | `src/app/components/BrandGuidelinesPage.tsx`     | `src/app/components/brand-guidelines-page.tsx`     |
| 6   | `src/app/components/ComparisonTable.tsx`         | `src/app/components/comparison-table.tsx`          |
| 7   | `src/app/components/CookieBanner.tsx`            | `src/app/components/cookie-banner.tsx`             |
| 8   | `src/app/components/FinalCTA.tsx`                | `src/app/components/final-cta.tsx`                 |
| 9   | `src/app/components/Footer.tsx`                  | `src/app/components/footer.tsx`                    |
| 10  | `src/app/components/Hero.tsx`                    | `src/app/components/hero.tsx`                      |
| 11  | `src/app/components/HowItWorks.tsx`              | `src/app/components/how-it-works.tsx`              |
| 12  | `src/app/components/Nav.tsx`                     | `src/app/components/nav.tsx`                       |
| 13  | `src/app/components/PrivacyPolicyPage.tsx`       | `src/app/components/privacy-policy-page.tsx`       |
| 14  | `src/app/components/Security.tsx`                | `src/app/components/security.tsx`                  |
| 15  | `src/app/components/Solutions.tsx`               | `src/app/components/solutions.tsx`                 |
| 16  | `src/app/components/TermsOfUsePage.tsx`          | `src/app/components/terms-of-use-page.tsx`         |
| 17  | `src/app/components/Testimonials.tsx`            | `src/app/components/testimonials.tsx`              |
| 18  | `src/app/components/TransparencyFeatures.tsx`    | `src/app/components/transparency-features.tsx`     |
| 19  | `src/app/components/TrustBar.tsx`                | `src/app/components/trust-bar.tsx`                 |
| 20  | `src/app/components/figma/ImageWithFallback.tsx` | `src/app/components/figma/image-with-fallback.tsx` |

### Import Updates:

#### File: `src/main.tsx`

```diff
-import App from "./app/App"
+import App from "./app/app"
```

#### File: `src/app.test.tsx` (renamed from `src/App.test.tsx`)

```diff
-import Landing from "./app/Landing"
+import Landing from "./app/landing"
```

#### File: `src/app/app.tsx` (renamed from `src/app/App.tsx`)

No import changes needed — imports `./routes` (already kebab) and `./components/ui/theme-context` (already kebab).

#### File: `src/app/routes.tsx`

```diff
-import Landing from "./Landing"
-import BrandGuidelinesPage from "./components/BrandGuidelinesPage"
-import PrivacyPolicyPage from "./components/PrivacyPolicyPage"
-import TermsOfUsePage from "./components/TermsOfUsePage"
+import Landing from "./landing"
+import BrandGuidelinesPage from "./components/brand-guidelines-page"
+import PrivacyPolicyPage from "./components/privacy-policy-page"
+import TermsOfUsePage from "./components/terms-of-use-page"
```

#### File: `src/app/components/landing.tsx` (renamed from `Landing.tsx`)

```diff
-import Hero from "./components/Hero"
-import TrustBar from "./components/TrustBar"
-import TransparencyFeatures from "./components/TransparencyFeatures"
-import Benefits from "./components/Benefits"
-import HowItWorks from "./components/HowItWorks"
-import Solutions from "./components/Solutions"
-import Testimonials from "./components/Testimonials"
-import ComparisonTable from "./components/ComparisonTable"
-import Security from "./components/Security"
-import FinalCTA from "./components/FinalCTA"
-import Footer from "./components/Footer"
-import CookieBanner from "./components/CookieBanner"
+import Hero from "./components/hero"
+import TrustBar from "./components/trust-bar"
+import TransparencyFeatures from "./components/transparency-features"
+import Benefits from "./components/benefits"
+import HowItWorks from "./components/how-it-works"
+import Solutions from "./components/solutions"
+import Testimonials from "./components/testimonials"
+import ComparisonTable from "./components/comparison-table"
+import Security from "./components/security"
+import FinalCTA from "./components/final-cta"
+import Footer from "./components/footer"
+import CookieBanner from "./components/cookie-banner"
```

#### File: `src/app/components/hero.tsx` (renamed from `Hero.tsx`)

```diff
-import Nav from "./Nav"
+import Nav from "./nav"
```

#### File: `src/app/components/terms-of-use-page.tsx` (renamed from `TermsOfUsePage.tsx`)

```diff
-import Footer from "./Footer"
-import Nav from "./Nav"
+import Footer from "./footer"
+import Nav from "./nav"
```

#### File: `src/app/components/privacy-policy-page.tsx` (renamed from `PrivacyPolicyPage.tsx`)

```diff
-import Footer from "./Footer"
-import Nav from "./Nav"
+import Footer from "./footer"
+import Nav from "./nav"
```

#### File: `src/app/components/testimonials.tsx` (renamed from `Testimonials.tsx`)

```diff
-import ImageWithFallback from "./figma/ImageWithFallback"
+import ImageWithFallback from "./figma/image-with-fallback"
```

### Success Criteria:

#### Automated Verification:

- [ ] All files renamed: no PascalCase `.tsx` files remain in `src/` (`find src -name '*.tsx' | grep '[A-Z]'` returns empty)
- [ ] Build succeeds: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass: `npx vitest run`
- [ ] Git tracks all changes as renames: `git diff --cached --name-status` shows `R` (rename) entries

#### Manual Verification:

- [ ] `npm run dev` — site loads correctly at localhost
- [ ] All pages render: landing, brand guidelines, privacy policy, terms of use
- [ ] No console errors in browser dev tools

## Testing Strategy

### Automated:

- Existing test in `src/app.test.tsx` covers Landing component render
- Vite build will catch any broken import paths at compile time
- TypeScript type checking will catch any missing module references

### Manual:

- Navigate all routes to confirm no runtime errors
- Verify all components render visually

## Performance Considerations

None — this is a pure rename refactor with zero runtime impact.

## References

- Original ticket: `thoughts/tickets/fsn_0007-file-names-kebab-case.md`
