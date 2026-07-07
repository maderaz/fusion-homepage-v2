# Cookie Consent Fix Implementation Plan

## Overview

Fix cookie consent persistence (`sessionStorage` → `localStorage`), introduce consent-gated GA4 analytics, and fix the "Cookie Policy" link on legal pages.

## Current State Analysis

- Cookie banner (`cookie-banner-island.tsx:12`) uses `sessionStorage` — consent is lost on every session close
- No analytics scripts exist anywhere; the stored consent value is never read by anything
- "Cookie Policy" link is broken on `/privacy-policy` and `/terms-of-use` — React `Footer` receives no `onOpenCookieSettings` prop, and `CookieBannerIsland` is not mounted on those pages
- CSP uses hash-based `script-src` via `csp-style-fix` integration that auto-syncs to YAML on build

### Key Discoveries:

- `footer.astro:196-199` uses DOM event pattern (`CustomEvent("open-cookie-settings")`) — works on index page
- `footer.tsx:175-177` uses optional callback prop — silently no-ops when prop is missing
- `CookieBannerIsland` is only mounted in `index.astro:40` (`client:idle`)
- `csp-style-fix.ts:131` hardcodes `'self' <hashes>` for YAML `script-src` — external domains are lost on build

## Desired End State

- Consent persists in `localStorage` across browser sessions
- GA4 (`G-0SYFZYJGJY`) loads **only** when the user has accepted cookies
- Accepting cookies mid-session loads GA4 immediately (no page reload needed)
- "Cookie Policy" link opens the cookie banner on all pages
- CSP allows GA4 domains in both meta tags and HTTP headers

### Verification:

- `npm run build` succeeds with no CSP violations
- `npm test` passes (updated tests)
- Banner shows on first visit, persists choice across sessions
- GA4 network requests appear in DevTools only after accepting
- "Cookie Policy" link works on `/privacy-policy` and `/terms-of-use`

## What We're NOT Doing

- Unifying the two footer implementations (covered by FSN-0014)
- Google Consent Mode v2 (overkill — we simply don't load GA4 until consent is given)
- Revoking GA4 mid-session on decline (standard practice: takes effect on next page load)

## Implementation Approach

Four phases, each independently testable. The consent-gated analytics pattern: an inline `<script is:inline>` in the head checks `localStorage` on page load and listens for a custom event for mid-session acceptance. The cookie banner dispatches this event when the user clicks Accept.

---

## Phase 1: Switch to `localStorage`

### Overview

Replace all `sessionStorage` usage with `localStorage` in the cookie banner and its tests.

### Changes Required:

#### 1. Cookie Banner Component

**File**: `src/components/cookie-banner-island.tsx`
**Changes**: Replace `sessionStorage` → `localStorage` (3 call sites + 2 comments)

```tsx
// Line 12: read
return !localStorage.getItem(STORAGE_KEY);

// Line 20: write (accept)
localStorage.setItem(STORAGE_KEY, "accepted");

// Line 22: comment
/* localStorage unavailable */

// Line 29: write (decline)
localStorage.setItem(STORAGE_KEY, "declined");

// Line 31: comment
/* localStorage unavailable */
```

#### 2. Tests

**File**: `src/components/cookie-banner-island.test.tsx`
**Changes**: Replace `sessionStorage` → `localStorage` (6 call sites)

```tsx
// Line 7
localStorage.clear();

// Line 16
localStorage.setItem("cookie_consent", "accepted");

// Line 24
localStorage.getItem("cookie_consent");

// Line 30
localStorage.getItem("cookie_consent");

// Line 44
localStorage.getItem("cookie_consent");

// Line 49
localStorage.setItem("cookie_consent", "accepted");
```

### Success Criteria:

#### Automated Verification:

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] Accept cookies, close browser, reopen — banner stays hidden
- [ ] Decline cookies, close browser, reopen — banner stays hidden

---

## Phase 2: Add Consent-Gated GA4

### Overview

Introduce GA4 analytics that only loads when the user has accepted cookies. Uses a small inline script in the `<head>` that checks `localStorage` and listens for a custom event.

### Changes Required:

#### 1. Analytics Script Component

**File**: `src/components/analytics-script.astro` (new)
**Changes**: Create consent-gated GA4 loader

```astro
---
// Consent-gated Google Analytics 4.
// Loads GA4 only when cookie_consent === "accepted" in localStorage.
// Listens for 'cookie-consent-accepted' custom event for mid-session consent.
---

<script is:inline>
(function(){
  var id='G-0SYFZYJGJY',loaded=false;
  function load(){
    if(loaded)return;loaded=true;
    var s=document.createElement('script');
    s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+id;
    document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    function g(){dataLayer.push(arguments);}
    window.gtag=g;g('js',new Date());g('config',id);
  }
  try{if(localStorage.getItem('cookie_consent')==='accepted')load();}catch(e){}
  window.addEventListener('cookie-consent-accepted',load);
})();
</script>
```

Note: `is:inline` ensures Astro includes it verbatim. `csp-style-fix` will auto-hash it and add the hash to `script-src` in both meta tags and YAML.

#### 2. Include in Base Layout

**File**: `src/layouts/base-layout.astro`
**Changes**: Import and render `AnalyticsScript` in `<head>`

```astro
---
import AnalyticsScript from "../components/analytics-script.astro";
---

<head>
  <BaseHead title={title} description={description} image={image} />
  <ThemeScript />
  <AnalyticsScript />
</head>
```

#### 3. Dispatch Event on Accept

**File**: `src/components/cookie-banner-island.tsx`
**Changes**: Add `CustomEvent` dispatch in the `accept` callback

```tsx
const accept = useCallback(() => {
  try {
    localStorage.setItem(STORAGE_KEY, "accepted");
  } catch {
    /* localStorage unavailable */
  }
  window.dispatchEvent(new CustomEvent("cookie-consent-accepted"));
  setVisible(false);
}, []);
```

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] Built HTML contains the analytics inline script

#### Manual Verification:

- [ ] With no consent: no GA4 network requests in DevTools Network tab
- [ ] Click Accept: GA4 script loads immediately (check for `googletagmanager.com` request)
- [ ] Reload page after accepting: GA4 loads on page load
- [ ] Decline cookies, reload: no GA4 requests

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation that GA4 loads/doesn't load correctly before proceeding.

---

## Phase 3: CSP Updates for GA4

### Overview

Allow GA4 external script and data collection domains in CSP — both in the Astro meta tag config and the AWS Amplify HTTP header YAML files.

### Changes Required:

#### 1. Astro Config — Meta Tag CSP

**File**: `astro.config.mjs`
**Changes**: Add GA4 domains to `connect-src` and `img-src` directives

```js
directives: [
  "default-src 'self'",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src 'none'",
  "object-src 'none'",
],
```

Note: `script-src` is not in `directives` — Astro auto-generates it from hashes. External script domains are added by `csp-style-fix` (see below).

#### 2. CSP Integration — Script-src External Domains

**File**: `src/integrations/csp-style-fix.ts`
**Changes**: Add GA4 domains to `script-src` in both meta tags and YAML

Add constant at top of the integration function (after the `return` opening):

```ts
// External script domains needed for analytics (GA4)
const EXTERNAL_SCRIPT_DOMAINS = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
];
```

Update meta tag patching (~line 104-122) to also add external domains:

```ts
// Ensure all script hashes and external domains are in script-src
updated = updated.replace(
  /(<meta\s+http-equiv="content-security-policy"\s+content="[^"]*)(script-src\s)([^;]*)(;[^"]*")/g,
  (_match, before, directive, value, after) => {
    const existingHashes = new Set(
      value.match(/'sha256-[A-Za-z0-9+/=]+'/g) || [],
    );
    const missingHashes: string[] = [];
    for (const hash of scriptHashes) {
      if (!existingHashes.has(hash)) {
        missingHashes.push(hash);
      }
    }
    const missingDomains = EXTERNAL_SCRIPT_DOMAINS.filter(
      (d) => !value.includes(d),
    );
    const additions = [...missingDomains, ...missingHashes];
    if (additions.length > 0) {
      return `${before}${directive}${value} ${additions.join(" ")}${after}`;
    }
    return `${before}${directive}${value}${after}`;
  },
);
```

Update YAML generation (~line 131):

```ts
const scriptSrcValue = `'self' ${EXTERNAL_SCRIPT_DOMAINS.join(" ")} ${sortedHashes.join(" ")}`;
```

#### 3. YAML Files — connect-src and img-src

**File**: `csp/dev-customHttp.yml` and `csp/mainnet-customHttp.yml`
**Changes**: Add GA4 domains to `connect-src` and `img-src` in the CSP value string

In the CSP value, update:

- `connect-src 'self'` → `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com`
- `img-src 'self' data:` → `img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com`

Note: `script-src` in YAML is auto-generated by `csp-style-fix` on build — no manual edit needed.

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Built HTML meta tag CSP includes GA4 domains in `script-src`, `connect-src`, `img-src`
- [ ] YAML files include GA4 domains in all three directives after build

#### Manual Verification:

- [ ] No CSP errors in browser console when GA4 loads (after accepting cookies)
- [ ] GA4 data collection requests succeed (no `connect-src` blocks)

**Implementation Note**: After completing this phase, pause for manual CSP verification before proceeding.

---

## Phase 4: Fix Cookie Policy Link on Legal Pages

### Overview

Make the "Cookie Policy" footer link work on `/privacy-policy` and `/terms-of-use` by passing the event dispatch callback and mounting `CookieBannerIsland`.

### Changes Required:

#### 1. Privacy Policy Page

**File**: `src/app/components/privacy-policy-page.tsx`
**Changes**: Pass `onOpenCookieSettings` prop to `Footer` (line 133)

```tsx
<Footer
  onOpenCookieSettings={() =>
    window.dispatchEvent(new CustomEvent("open-cookie-settings"))
  }
/>
```

#### 2. Terms of Use Page

**File**: `src/app/components/terms-of-use-page.tsx`
**Changes**: Pass `onOpenCookieSettings` prop to `Footer` (line 137)

```tsx
<Footer
  onOpenCookieSettings={() =>
    window.dispatchEvent(new CustomEvent("open-cookie-settings"))
  }
/>
```

#### 3. Mount CookieBannerIsland on Legal Pages

**File**: `src/pages/privacy-policy.astro`
**Changes**: Import and render `CookieBannerIsland`

```astro
---
import BaseLayout from "../layouts/base-layout.astro";
import { PrivacyPolicyPage } from "../app/components/privacy-policy-page.tsx";
import CookieBannerIsland from "../components/cookie-banner-island.tsx";
---

<BaseLayout
  title="Privacy Policy | Fusion by IPOR"
  description="Privacy Policy for Fusion by IPOR - Onchain Vault Infrastructure"
>
  <PrivacyPolicyPage client:load />
  <CookieBannerIsland client:idle />
</BaseLayout>
```

**File**: `src/pages/terms-of-use.astro`
**Changes**: Import and render `CookieBannerIsland`

```astro
---
import BaseLayout from "../layouts/base-layout.astro";
import { TermsOfUsePage } from "../app/components/terms-of-use-page.tsx";
import CookieBannerIsland from "../components/cookie-banner-island.tsx";
---

<BaseLayout
  title="Terms of Use | Fusion by IPOR"
  description="Terms of Use for Fusion by IPOR - Onchain Vault Infrastructure"
>
  <TermsOfUsePage client:load />
  <CookieBannerIsland client:idle />
</BaseLayout>
```

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm test`

#### Manual Verification:

- [ ] On `/privacy-policy`: click "Cookie Policy" in footer → banner appears
- [ ] On `/terms-of-use`: click "Cookie Policy" in footer → banner appears
- [ ] Accept/decline from legal pages persists consent correctly

---

## Phase 5: Update Tests

### Overview

Add test coverage for the new consent-accepted event dispatch.

### Changes Required:

#### 1. New Test Cases

**File**: `src/components/cookie-banner-island.test.tsx`
**Changes**: Add two new tests

```tsx
it("dispatches cookie-consent-accepted event on accept", () => {
  const handler = vi.fn();
  window.addEventListener("cookie-consent-accepted", handler);
  render(<CookieBannerIsland />);
  fireEvent.click(screen.getByText("Accept"));
  expect(handler).toHaveBeenCalledTimes(1);
  window.removeEventListener("cookie-consent-accepted", handler);
});

it("does not dispatch cookie-consent-accepted event on decline", () => {
  const handler = vi.fn();
  window.addEventListener("cookie-consent-accepted", handler);
  render(<CookieBannerIsland />);
  fireEvent.click(screen.getByText("Decline"));
  expect(handler).not.toHaveBeenCalled();
  window.removeEventListener("cookie-consent-accepted", handler);
});
```

### Success Criteria:

#### Automated Verification:

- [ ] All tests pass: `npm test`
- [ ] No regressions in existing tests

---

## Testing Strategy

### Unit Tests:

- Cookie banner: localStorage persistence, event dispatch on accept, no event on decline
- All existing tests updated for localStorage

### Manual Testing Steps:

1. Fresh visit (clear localStorage) → banner appears
2. Accept → banner hides, GA4 loads (check Network tab)
3. Reload → banner stays hidden, GA4 loads on page load
4. Clear localStorage, reload → banner appears, no GA4
5. Decline → banner hides, no GA4
6. Reload after decline → banner stays hidden, no GA4
7. Navigate to `/privacy-policy` → click "Cookie Policy" → banner appears
8. Navigate to `/terms-of-use` → click "Cookie Policy" → banner appears
9. Check browser console for CSP violations — should be none

## References

- Original ticket: `thoughts/tickets/fsn_0013-cookie-consent-fix.md`
- Related: `thoughts/tickets/fsn_0014-unify-footer.md` (footer unification — separate scope)
- GA4 Measurement ID: `G-0SYFZYJGJY`
