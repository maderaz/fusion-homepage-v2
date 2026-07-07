## Fix CSP & CORS Production Headers

**Priority:** High
**Source:** FSN-0006 code review

### Problems

All issues are in `csp/mainnet-customHttp.yml`:

1. **Missing `font-src`** (line 6) — No `font-src` directive in the HTTP header CSP. Browser falls back to `default-src 'self'`, blocking Google Fonts from `fonts.gstatic.com`. The build-time meta-tag CSP in `astro.config.mjs:14` includes `font-src 'self' https://fonts.gstatic.com` but the HTTP header takes precedence.

2. **`'unsafe-inline'` in `script-src`** (line 6) — Negates XSS protection entirely. Present to support `<script is:inline>` blocks in `theme-script.astro`, `testimonials.astro`, and `footer.astro`. Investigate replacing with SHA-256 hashes (the build-time `csp-style-fix.ts` integration already computes script hashes).

3. **CORS misconfiguration** (lines 11-25) — `Access-Control-Allow-Credentials: true` combined with wildcard `Access-Control-Allow-Headers: *` / `Access-Control-Expose-Headers: *`. This is a known misconfiguration pattern. For a static site, these CORS headers may not be needed at all.

### Investigation Needed

- Verify whether fonts are actually blocked in production (check browser devtools)
- Determine if inline scripts can be replaced with hashed scripts in the HTTP header CSP
- Confirm whether any CORS headers are needed for a static landing page
- Align `astro.config.mjs` CSP with `mainnet-customHttp.yml` — currently they diverge
