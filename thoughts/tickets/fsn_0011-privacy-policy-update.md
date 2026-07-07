## Update Privacy Policy Content

**Priority:** Critical
**Source:** FSN-0006 code review

### Problem

The privacy policy page has outdated and incorrect content:

1. **Wrong domain** — `privacy-policy-page.tsx:79` references `app.ipor.io` instead of `fusion.ipor.io`
2. **Outdated date** — `privacy-policy-page.tsx:70` shows `Last updated: 2022-03-31` (4 years old)
3. The policy text appears to be carried over from the original IPOR app without updating for the Fusion product

### Requires

- Legal review of the entire privacy policy text for Fusion context
- Confirm correct domain references (`fusion.ipor.io`)
- Update the last-updated date after review
- Verify the policy accurately describes current data practices (analytics, cookies, IP geolocation via ipregistry.co)
