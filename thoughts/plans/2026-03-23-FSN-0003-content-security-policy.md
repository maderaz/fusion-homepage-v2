# Content Security Policy Implementation Plan

## Overview

Add Astro-native Content Security Policy (CSP) using `security.csp` (stable in Astro 6.0+) so that CSP is enforced during local development and preview builds. The existing AWS Amplify `customHttp.yml` files remain unchanged for production deployment.

## Current State Analysis

### Existing CSP Implementation

- **`csp/dev-customHttp.yml`**: Minimal CSP (`default-src 'self'; style-src 'self' 'unsafe-inline'`) + HSTS + `X-Content-Type-Options`
- **`csp/mainnet-customHttp.yml`**: Expanded CSP with Google Analytics/GTM rules (stale — site has no analytics), CORS headers, and security headers
- These files are consumed by AWS Amplify during deployment and set HTTP response headers
- **No CSP enforcement exists during local development** — `astro dev` and `astro preview` serve pages without any CSP

### Astro 6.0 `security.csp`

- Uses a **hash-based approach** (not nonces) — computes SHA-256 hashes of all inline scripts and styles at build time
- Injects a `<meta http-equiv="content-security-policy">` tag into every HTML page's `<head>`
- Hashes automatically supersede `'unsafe-inline'` in browsers — no need for `'unsafe-inline'` in `script-src` or `style-src`
- **Dev mode does not enforce CSP** — must test via `astro build && astro preview`
- No `ClientRouter` / view transitions in use, so no compatibility issues

### External Resources Requiring Whitelisting

| Resource                                         | Directive   | Origin                         |
| ------------------------------------------------ | ----------- | ------------------------------ |
| Google Fonts CSS                                 | `style-src` | `https://fonts.googleapis.com` |
| Google Fonts files                               | `font-src`  | `https://fonts.gstatic.com`    |
| Data URI images (noise texture, avatar fallback) | `img-src`   | `data:`                        |

### CSP-Incompatible Code

- **`src/components/testimonials.astro:132`**: Inline `onerror` event handler on avatar `<img>` — CSP blocks inline event handlers. Must be refactored to a script-based approach.

## Desired End State

- `security.csp` enabled in `astro.config.mjs` with strictest possible policy
- All pages render without CSP violations when served via `astro build && astro preview`
- Inline event handlers removed and replaced with CSP-compatible alternatives
- Existing `csp/*.customHttp.yml` files unchanged (production deployment unaffected)
- Playwright tests verify no CSP errors occur

### Verification

1. `npm run build` succeeds
2. `npx astro preview` serves pages with `<meta http-equiv="content-security-policy">` in every HTML page
3. No CSP violations in browser console when navigating all 4 pages
4. Playwright tests pass with no console errors

## What We're NOT Doing

- Not modifying `csp/dev-customHttp.yml` or `csp/mainnet-customHttp.yml`
- Not self-hosting Google Fonts
- Not adding analytics or any new external resources
- Not switching to nonce-based CSP
- Not adding SSR or middleware

## Implementation Approach

Start with the strictest possible CSP (just `security.csp: true` which defaults to `script-src 'self'` + `style-src 'self'` with hashes). Build, identify violations, and progressively add the minimum necessary directives. Fix any code that is inherently CSP-incompatible before enabling CSP.

---

## Phase 1: Fix CSP-Incompatible Code

### Overview

Remove inline event handlers that CSP will block. The only instance is the `onerror` fallback on avatar images in testimonials.

### Changes Required:

#### 1. Refactor `onerror` handler in testimonials

**File**: `src/components/testimonials.astro`
**Changes**: Remove the inline `onerror` attribute and replace with a `<script is:inline>` block that attaches error handlers via JavaScript. Astro will auto-hash this script.

**Current code** (line 128-133):

```astro
<img
  src={t.avatar}
  alt={t.name}
  class="h-10 w-10 rounded-full object-cover"
  onerror={`this.onerror=null;this.src='${fallbackSvg}';`}
/>
```

**New code**:

```astro
<img
  src={t.avatar}
  alt={t.name}
  class="h-10 w-10 rounded-full object-cover"
  data-fallback={fallbackSvg}
/>
```

Add a script at the bottom of the component (before closing `</section>`):

```astro
<script is:inline>
document.querySelectorAll('#testimonials img[data-fallback]').forEach(function(img) {
  img.addEventListener('error', function() {
    if (this.dataset.fallback) {
      this.src = this.dataset.fallback;
      delete this.dataset.fallback;
    }
  });
});
</script>
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] No `onerror=` attributes remain in source: `grep -r 'onerror=' src/` returns nothing

#### Manual Verification:

- [ ] Avatar images still display correctly on the testimonials section
- [ ] If an avatar fails to load, the fallback SVG placeholder appears

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to the next phase.

---

## Phase 2: Enable Astro `security.csp` with Strict Policy

### Overview

Enable `security.csp` in `astro.config.mjs` starting with the most strict configuration, then progressively add directives for Google Fonts and data URIs.

### Changes Required:

#### 1. Update Astro configuration

**File**: `astro.config.mjs`
**Changes**: Add `security.csp` configuration.

**Start with strictest policy:**

```js
export default defineConfig({
  site: "https://fusion.ipor.io",
  output: "static",
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data:",
        "connect-src 'self'",
        "frame-src 'none'",
        "object-src 'none'",
      ],
      styleDirective: {
        resources: ["'self'", "https://fonts.googleapis.com"],
      },
    },
  },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
    assetsInclude: ["**/*.svg"],
  },
});
```

**Key decisions:**

- `default-src 'self'` — strictest baseline, only same-origin by default
- `font-src 'self' https://fonts.gstatic.com` — allows Google Font binary files
- `img-src 'self' data:` — allows same-origin images + data URIs (noise texture, avatar fallback)
- `connect-src 'self'` — no external API calls exist
- `frame-src 'none'` — no iframes used
- `object-src 'none'` — no plugins/embeds
- `styleDirective.resources` includes `https://fonts.googleapis.com` — allows Google Fonts CSS stylesheets
- `script-src` and `style-src` hashes are auto-computed by Astro — no `'unsafe-inline'` needed

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] Built HTML files contain `<meta http-equiv="content-security-policy">` tags: `grep -r 'content-security-policy' dist/`
- [ ] CSP meta tag includes SHA-256 hashes (not `'unsafe-inline'`)
- [ ] `npm test` passes

#### Manual Verification:

- [ ] Run `npx astro preview` and open all 4 pages in Chrome with DevTools Console open
- [ ] No CSP violation errors in console on any page
- [ ] Google Fonts load correctly (text renders in Poppins, Source Sans Pro, JetBrains Mono)
- [ ] All images render (including noise texture overlay, logos, avatars)
- [ ] Theme toggle (dark/light) works without CSP errors
- [ ] All animations work (Motion/Framer Motion components)

**Implementation Note**: After completing this phase, pause for manual verification. If CSP violations appear, progressively adjust directives in the config. Document any additional directives needed.

---

## Phase 3: Build, Test, and Iterate

### Overview

Build the site, inspect CSP violations, and iteratively adjust the policy until all pages work without violations.

### Process:

1. Run `npm run build`
2. Run `npx astro preview`
3. Open each page in Chrome DevTools and check Console for CSP violations
4. For each violation:
   - Identify the blocked resource
   - Determine the minimum directive change needed
   - Update `astro.config.mjs`
   - Rebuild and retest
5. Repeat until all 4 pages are violation-free

### Pages to test:

- `/` (index — hero, benefits, solutions, testimonials, security sections)
- `/privacy-policy/`
- `/terms-of-use/`
- `/brand-guidelines/`

### Common issues to watch for:

- Inline styles set by Motion/Framer Motion at runtime (may need style hashes)
- CSS custom properties set via JavaScript (`style.setProperty()` in glowing-effect.tsx)
- Dynamic style attributes in React components
- Recharts rendering (may inject inline styles)

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds with zero warnings related to CSP
- [ ] `npm test` passes

#### Manual Verification:

- [ ] All 4 pages load without any CSP console errors
- [ ] All interactive elements work (nav, theme toggle, animations, hover effects)

---

## Phase 4: Playwright Tests for CSP Verification

### Overview

Use Playwright to verify no CSP violations occur across all pages. This provides automated regression testing for CSP compliance.

### Changes Required:

#### 1. Create CSP test file

**File**: `tests/csp.spec.ts` (or appropriate test directory based on existing Playwright config)

**Test approach**: Navigate to each page, listen for console errors containing "Content Security Policy", and assert none occur.

```typescript
import { test, expect } from "@playwright/test";

const pages = ["/", "/privacy-policy/", "/terms-of-use/", "/brand-guidelines/"];

for (const path of pages) {
  test(`no CSP violations on ${path}`, async ({ page }) => {
    const cspViolations: string[] = [];

    page.on("console", (msg) => {
      if (
        msg.type() === "error" &&
        msg.text().includes("Content Security Policy")
      ) {
        cspViolations.push(msg.text());
      }
    });

    await page.goto(path);
    await page.waitForLoadState("networkidle");

    expect(cspViolations).toEqual([]);
  });
}

test("CSP meta tag is present on index page", async ({ page }) => {
  await page.goto("/");
  const cspMeta = await page.locator(
    'meta[http-equiv="content-security-policy"]',
  );
  await expect(cspMeta).toHaveCount(1);
  const content = await cspMeta.getAttribute("content");
  expect(content).toContain("script-src");
  expect(content).toContain("style-src");
  expect(content).not.toContain("'unsafe-inline'");
});
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm run build` succeeds
- [ ] `npm run test:visual` passes (existing Playwright tests still work)
- [ ] CSP-specific Playwright tests pass
- [ ] `npm test` passes (unit tests)

#### Manual Verification:

- [ ] Review Playwright test output to confirm all pages were tested

**Implementation Note**: After completing this phase and all automated verification passes, the implementation is complete.

---

## Testing Strategy

### Unit Tests:

- Verify no inline event handlers exist in source (static analysis)

### Integration Tests (Playwright):

- Navigate all 4 pages, assert zero CSP console errors
- Verify `<meta http-equiv="content-security-policy">` tag exists
- Verify tag contains hashes, not `'unsafe-inline'`

### Manual Testing Steps:

1. Run `npm run build && npx astro preview`
2. Open `http://localhost:4321` in Chrome
3. Open DevTools → Console
4. Navigate to each page, check for CSP errors
5. Test theme toggle on each page
6. Test all interactive elements (nav dropdown, hover animations, scroll animations)
7. Verify fonts render correctly (not falling back to system fonts)

## Performance Considerations

- Hash-based CSP adds a small amount to build time (SHA-256 computation) — negligible
- The `<meta>` tag adds a few hundred bytes to each HTML page — negligible
- No runtime performance impact — CSP is browser-enforced, not app-enforced
- Google Fonts continue to load from CDN — no change in font loading performance

## References

- Original ticket: `thoughts/tickets/fsn_0003-content-security-policy.md`
- Astro CSP docs: https://docs.astro.build/en/reference/configuration-reference/#securitycsp
- Astro experimental CSP guide: https://docs.astro.build/en/reference/experimental-flags/csp/
- Current Amplify headers: `csp/dev-customHttp.yml`, `csp/mainnet-customHttp.yml`
- CSP-incompatible code: `src/components/testimonials.astro:132` (onerror handler)
- Theme inline script: `src/components/theme-script.astro:1-14` (auto-hashed by Astro)
- Google Fonts: `src/components/base-head.astro:34-47`
