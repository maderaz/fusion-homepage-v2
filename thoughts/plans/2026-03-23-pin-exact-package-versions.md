# Pin All Packages to Latest Exact Versions

## Overview

Pin all npm dependencies to exact versions (remove `^` prefixes) and upgrade packages to their latest versions within the current major version lines. This ensures deterministic installs and prevents unintended version drift.

## Current State Analysis

All 32 packages used caret (`^`) ranges, allowing minor/patch drift between installs. Two packages had newer versions available: `jsdom` (29.0.0 → 29.0.1). ESLint 10 was available but skipped due to ecosystem compatibility concerns (eslint-plugin-react-hooks peer dep not yet published for v10).

## Desired End State

All dependencies in `package.json` use exact version specifiers (no `^`, `~`, or `*`). All packages are at their latest available version within the current major lines.

### Key Discoveries:

- ESLint 10 requires `@eslint/js` as a separate package and has peer dep issues with `eslint-plugin-react-hooks@7.0.1` — staying on ESLint 9.x avoids both issues
- `jsdom` had a patch update (29.0.0 → 29.0.1)
- `vite` downgraded from 8.0.1 → 7.3.1: `astro@6.0.8` depends on `vite@^7.3.1` and Vite 8 at top level caused `@vitejs/plugin-react` to break in dev mode (`Missing field 'moduleType'` from rolldown)
- All other packages were already at their latest within caret ranges

## What We're NOT Doing

- ESLint 9 → 10 major upgrade (peer dep ecosystem not ready)
- Any config changes — only version pinning

## Implementation Approach

Single phase: update `package.json` versions, clean install, verify.

## Phase 1: Pin Versions and Verify

### Changes Required:

#### 1. `package.json`

- Remove all `^` prefixes from every dependency and devDependency
- Bump `jsdom` from `29.0.0` to `29.0.1`
- Downgrade `vite` from `8.0.1` to `7.3.1` (align with astro@6.0.8 requirement)
- Keep `eslint` at `9.39.4` (latest 9.x)

### Success Criteria:

#### Automated Verification:

- [x] `npm install` succeeds with 0 vulnerabilities
- [x] `npm run build` passes (astro check + astro build)
- [x] `npm run lint` passes (ESLint 9.39.4)
- [x] `npm run test` passes (21 tests, 4 test files)

#### Manual Verification:

- [x] `npm run dev` — site loads and functions correctly
- [x] Visual spot-check of all 4 pages (homepage, privacy-policy, terms-of-use, brand-guidelines)

## Package Version Summary

### Dependencies (pinned, no changes except format):

| Package           | Version |
| ----------------- | ------- |
| @astrojs/check    | 0.9.8   |
| @astrojs/react    | 5.0.1   |
| @astrojs/sitemap  | 3.7.1   |
| @tailwindcss/vite | 4.2.2   |
| astro             | 6.0.8   |
| clsx              | 2.1.1   |
| lucide-react      | 0.577.0 |
| motion            | 12.38.0 |
| react             | 19.2.4  |
| react-dom         | 19.2.4  |
| tailwind-merge    | 3.5.0   |
| tailwindcss       | 4.2.2   |
| tw-animate-css    | 1.4.0   |

### DevDependencies (pinned, jsdom bumped):

| Package                   | Old      | New        |
| ------------------------- | -------- | ---------- |
| @playwright/test          | ^1.58.2  | 1.58.2     |
| @testing-library/dom      | ^10.4.1  | 10.4.1     |
| @testing-library/jest-dom | ^6.9.1   | 6.9.1      |
| @testing-library/react    | ^16.3.2  | 16.3.2     |
| @types/node               | ^25.5.0  | 25.5.0     |
| @types/react              | ^19.2.14 | 19.2.14    |
| @types/react-dom          | ^19.2.3  | 19.2.3     |
| eslint                    | ^9.39.4  | 9.39.4     |
| eslint-plugin-astro       | ^1.6.0   | 1.6.0      |
| eslint-plugin-react-hooks | ^7.0.1   | 7.0.1      |
| globals                   | ^17.4.0  | 17.4.0     |
| husky                     | ^9.1.7   | 9.1.7      |
| jsdom                     | ^29.0.0  | **29.0.1** |
| knip                      | ^6.0.2   | 6.0.2      |
| lint-staged               | ^16.4.0  | 16.4.0     |
| prettier                  | ^3.8.1   | 3.8.1      |
| serve                     | ^14.2.6  | 14.2.6     |
| typescript                | ^5.9.3   | 5.9.3      |
| typescript-eslint         | ^8.57.1  | 8.57.1     |
| vite                      | ^8.0.1   | **7.3.1**  |
| vitest                    | ^4.1.0   | 4.1.0      |

## Future Considerations

- ESLint 10 upgrade: revisit once `eslint-plugin-react-hooks` publishes v7.0.2 with ESLint 10 peer dep support (tracking: facebook/react#35758)
- Vite 8 upgrade: revisit once `astro` releases a version with Vite 8 support
