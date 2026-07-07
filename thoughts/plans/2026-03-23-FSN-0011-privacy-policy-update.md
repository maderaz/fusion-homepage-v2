# FSN-0011: Privacy Policy & Terms of Use — Critical Fixes

## Overview

Fix critical issues in the privacy policy and terms of use pages: update domain references to include `fusion.ipor.io` alongside `app.ipor.io`, and update the last-updated date on the privacy policy.

## Current State Analysis

- **Privacy policy** (`src/app/components/privacy-policy-page.tsx`): References only `app.ipor.io` (line 78), but the policy covers both the app and this landing page (`fusion.ipor.io`). Last-updated date is `2022-03-31` — over 4 years old.
- **Terms of use** (`src/app/components/terms-of-use-page.tsx`): Also references only `app.ipor.io` (line 92). Same issue — should mention both domains. Date is `2024-09-30` which is more recent but may also need updating after this change.

## Desired End State

Both legal pages reference both `app.ipor.io` and `fusion.ipor.io` as covered services. The privacy policy last-updated date reflects the date of the change.

## What We're NOT Doing

- Full legal content review or rewrite of the privacy policy
- Adding analytics/tracking disclosures (none are currently in use)
- Changing cookie banner behavior (tracked in FSN-0013)

## Phase 1: Fix Domain References and Dates

### Changes Required:

#### 1. Privacy Policy Page

**File**: `src/app/components/privacy-policy-page.tsx`

**Change 1 — Update domain reference (line 74–81):**

Replace the intro paragraph to reference both domains:

```tsx
<p className="mb-10 max-w-[800px] text-[15px] text-muted-foreground leading-[1.8]">
  This Privacy Policy (&ldquo;Policy&rdquo;) sets out how IPOR Labs AG
  (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) may collect, use
  and disclose information, and your choices when you use our services hosted at
  app.ipor.io, fusion.ipor.io, or any other sites or services we own or operate
  (collectively, the &ldquo;Services&rdquo;). If you do not agree with the terms
  of this Policy, please do not access or use the Services.
</p>
```

**Change 2 — Update last-updated date (line 69–71):**

```tsx
<p className="mb-12 text-[14px] text-muted-foreground">
  Last updated: 2026-03-23
</p>
```

#### 2. Terms of Use Page

**File**: `src/app/components/terms-of-use-page.tsx`

**Change 1 — Update last-updated date (line 85–87):**

```tsx
<p className="mb-12 text-[14px] text-muted-foreground">
  Last updated: 2026-03-23
</p>
```

**Change 2 — Update domain reference (line 90–105):**

Replace the intro paragraph to reference both domains:

```tsx
<p className="mb-10 max-w-[800px] text-[15px] text-muted-foreground leading-[1.8]">
  These Terms of Use (&ldquo;Terms&rdquo;) apply to the applications hosted at
  app.ipor.io and fusion.ipor.io, hosted user interfaces (the
  &ldquo;Interface&rdquo;) provided by IPOR Labs AG (&ldquo;we&rdquo;,
  &ldquo;our&rdquo;, or &ldquo;us&rdquo;). The Interface provides data regarding
  and access to a decentralized protocol (the &ldquo;Protocol&rdquo;) on the
  Ethereum blockchain that allows users to participate in digital asset interest
  rate and yield markets. The Protocol includes IPOR Fusion, a yield
  optimization framework for automated execution of smart asset management
  on-chain. These Terms explain the terms and conditions by which you may access
  and use the Interface. You must read these Terms carefully. By accessing or
  using the Interface, you signify that you have read, understand, and agree to
  be bound by these Terms in its entirety. If you do not agree, you are not
  authorized to access or use the Interface.
</p>
```

### Success Criteria:

#### Automated Verification:

- [ ] Type check passes: `npx astro check`
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npx vitest run`
- [ ] Grep confirms no remaining solo `app.ipor.io` references in legal page intros: check that both `privacy-policy-page.tsx` and `terms-of-use-page.tsx` intro paragraphs contain `fusion.ipor.io`

#### Manual Verification:

- [ ] Visit `/privacy-policy` — intro paragraph mentions both `app.ipor.io` and `fusion.ipor.io`
- [ ] Visit `/privacy-policy` — last-updated date shows current date
- [ ] Visit `/terms-of-use` — intro paragraph mentions both `app.ipor.io` and `fusion.ipor.io`

## References

- Original ticket: `thoughts/tickets/fsn_0011-privacy-policy-update.md`
