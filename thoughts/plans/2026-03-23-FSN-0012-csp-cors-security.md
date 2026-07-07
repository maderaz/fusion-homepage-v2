# Fix CSP & CORS Production Headers — Implementation Plan

## Overview

Fix the HTTP header CSP in both `customHttp.yml` files to align with the Astro build-time meta tag CSP. Unify dev and mainnet (they diverged for legacy reasons). The HTTP header CSP is kept complementary to the meta tag — it uses `'unsafe-inline'` for `script-src` and `style-src` since HTTP headers can't include per-build SHA-256 hashes. The meta tag's hash-based policy provides the strict enforcement layer; both policies must be satisfied independently by the browser.

## Current State Analysis

### Two CSP layers

1. **Meta tag** (`astro.config.mjs` → `csp-style-fix.ts`) — Strict, hash-based CSP injected into every HTML page at build time. Scripts use SHA-256 hashes (no `'unsafe-inline'`). Style hashes are stripped by `csp-style-fix.ts` so `'unsafe-inline'` works for 300+ `style=` attributes.
2. **HTTP header** (`csp/mainnet-customHttp.yml`) — Set by AWS Amplify. Applied globally to all responses.

When both exist, the browser enforces each independently. A resource must pass **both** policies.

### Problems in `mainnet-customHttp.yml`

| #   | Problem                                                 | Impact                                                                                |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1   | Missing `font-src` directive                            | Google Fonts from `fonts.gstatic.com` blocked — falls back to `default-src 'self'`    |
| 2   | Stale origins in `script-src`, `img-src`, `connect-src` | References to Google Analytics, GTM, ipregistry, `assets.mainnet.ipor.io` — none used |
| 3   | Missing `frame-src 'none'` and `object-src 'none'`      | Less restrictive than meta tag                                                        |
| 4   | Missing `style-src` font origin                         | `https://fonts.googleapis.com` not whitelisted in HTTP header                         |

### `dev-customHttp.yml` divergence

Dev had a minimal CSP (`default-src 'self'; style-src 'self' 'unsafe-inline'`) with no CORS headers. This diverged from mainnet for no good reason — both environments should behave identically.

### Key Discoveries

- `astro.config.mjs:10-28` — Meta tag CSP config with `font-src`, `img-src data:`, `frame-src 'none'`, `object-src 'none'`
- `src/integrations/csp-style-fix.ts` — Post-build integration that strips style hashes and adds script hashes
- `tests/visual/csp.spec.ts` — Playwright tests verifying meta tag CSP (hashes present, no `unsafe-inline` in `script-src`)
- No Google Analytics, GTM, ipregistry, or `assets.mainnet.ipor.io` references in source code
- No `fetch()` or external API calls — `connect-src 'self'` is sufficient

## Desired End State

- Both `dev-customHttp.yml` and `mainnet-customHttp.yml` have identical content
- HTTP header CSP mirrors the meta tag's directives, using `'unsafe-inline'` where the meta tag uses hashes
- Stale origins removed, missing directives added
- Unit test prevents future drift between dev/mainnet and catches directive regressions

### Verification

1. `npm test` passes (includes new CSP alignment tests)
2. All 4 pages render without CSP console errors after deployment
3. Google Fonts load correctly in production

## What We're NOT Doing

- Not modifying `astro.config.mjs` or `csp-style-fix.ts` (already correct)
- Not removing CORS headers (out of scope — separate ticket)
- Not adding script hashes to HTTP headers (impossible — hashes change per build)
- Not modifying Playwright visual tests (they test the meta tag, not HTTP headers)

## Implementation Approach

Straightforward config update: fix the CSP string in mainnet, copy to dev, add a unit test.

---

## Phase 1: Update `mainnet-customHttp.yml` CSP

### Overview

Replace the stale CSP string with one that mirrors the Astro meta tag directives.

### Changes Required:

#### 1. Update CSP header value

**File**: `csp/mainnet-customHttp.yml`
**Changes**: Replace the `Content-Security-Policy` value.

**Before:**

```
default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.ipregistry.co https://*.google-analytics.com; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; img-src 'self' blob: https://assets.mainnet.ipor.io https://www.googletagmanager.com https://www.google-analytics.com;
```

**After:**

```
default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'
```

**What changed:**

- **Added** `font-src 'self' https://fonts.gstatic.com` — Google Fonts binary files
- **Added** `https://fonts.googleapis.com` to `style-src` — Google Fonts CSS
- **Added** `frame-src 'none'` and `object-src 'none'` — defense-in-depth
- **Changed** `img-src` from `blob:` + stale origins to `data:` (for SVG fallback)
- **Removed** stale origins: `api.ipregistry.co`, `*.google-analytics.com`, `googletagmanager.com`, `assets.mainnet.ipor.io`
- **Kept** `'unsafe-inline'` in `script-src` and `style-src` (complementary to meta tag hashes)

### Success Criteria:

#### Automated Verification:

- [ ] `npm test` passes

#### Manual Verification:

- [ ] After deployment, open fusion.ipor.io in Chrome DevTools Console — no CSP errors
- [ ] Google Fonts render correctly (Poppins, Source Sans Pro, JetBrains Mono)
- [ ] All images load (logos, avatars, noise texture)

---

## Phase 2: Unify `dev-customHttp.yml` with Mainnet

### Overview

Replace `dev-customHttp.yml` with identical content to mainnet so both environments behave the same.

### Changes Required:

**File**: `csp/dev-customHttp.yml`
**Changes**: Replace entire file content with `mainnet-customHttp.yml` content (byte-for-byte identical).

### Success Criteria:

#### Automated Verification:

- [ ] `npm test` passes (the alignment test verifies both files have identical CSP)
- [ ] `diff csp/dev-customHttp.yml csp/mainnet-customHttp.yml` returns no differences

---

## Phase 3: Add Unit Test for CSP Alignment

### Overview

Add a Vitest test that reads both YAML files, extracts the CSP string, and verifies:

1. Dev and mainnet CSP are identical
2. Required directives are present (font-src, frame-src, object-src, etc.)
3. Stale origins are absent (Google Analytics, ipregistry, etc.)

### Changes Required:

**File**: `csp/csp-headers.test.ts`

The test:

- Extracts CSP values from both YAML files via regex
- Parses CSP strings into directive maps
- Asserts identity between dev/mainnet
- Asserts presence of required directives with correct values
- Asserts absence of stale origins

### Success Criteria:

#### Automated Verification:

- [ ] `npm test` passes — all 10 CSP alignment tests green
- [ ] If someone adds `google-analytics.com` back, the test fails
- [ ] If dev and mainnet CSP diverge, the test fails

---

## Testing Strategy

### Unit Tests (Vitest):

- `csp/csp-headers.test.ts` — 10 tests covering identity, required directives, stale origins

### Integration Tests (Playwright, existing):

- `tests/visual/csp.spec.ts` — Verifies meta tag CSP on all 4 pages (hashes present, no `unsafe-inline` in script-src)

### Manual Testing Steps:

1. Deploy to dev environment
2. Open all 4 pages in Chrome with DevTools Console
3. Verify no CSP errors in console
4. Verify Google Fonts render (not system fallback)
5. Verify avatar images load and fallback works (disconnect network for avatar URLs)

## References

- Original ticket: `thoughts/tickets/fsn_0012-csp-cors-security.md`
- Prior CSP plan: `thoughts/plans/2026-03-23-FSN-0003-content-security-policy.md`
- Astro CSP config: `astro.config.mjs:10-28`
- CSP style fix integration: `src/integrations/csp-style-fix.ts`
- Existing CSP Playwright tests: `tests/visual/csp.spec.ts`
- New CSP alignment tests: `csp/csp-headers.test.ts`
