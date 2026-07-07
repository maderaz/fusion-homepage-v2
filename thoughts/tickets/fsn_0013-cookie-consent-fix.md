## Fix Cookie Consent Implementation

**Priority:** High
**Source:** FSN-0006 code review

### Problems

1. **`sessionStorage` instead of `localStorage`** — `cookie-banner-island.tsx:10` stores consent under `sessionStorage` key `"cookie_consent"`. Consent is forgotten on every browser session close, causing the banner to reappear.

2. **Consent doesn't gate anything** — Accept/decline flow stores a value but no code reads it to conditionally load analytics. The CSP already allows Google Analytics and ipregistry.co endpoints unconditionally.

3. **"Cookie Policy" link broken on legal pages** — `footer.tsx` accepts `onOpenCookieSettings?` prop (line 57-59) but `privacy-policy-page.tsx:133` and `terms-of-use-page.tsx:137` render `<Footer />` with no props. Clicking "Cookie Policy" on those pages does nothing.

### Requires

- Product decision: should consent actually gate analytics loading?
- Switch to `localStorage` for persistence
- Fix the cookie settings link on legal pages (either pass the prop or use the DOM event pattern from `footer.astro`)
