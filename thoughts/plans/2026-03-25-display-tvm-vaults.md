# Display Live TVM and Vault Count — Implementation Plan

## Overview

Replace the hardcoded TVM (`$250M`) and Vaults (`103`) stats in the Hero section with live data fetched client-side from the IPOR API. TVM is displayed in compact format (e.g., `$250M`). On loading or error, a placeholder (`—`) is shown. "Volume processed" remains hardcoded.

## Current State Analysis

- **Hero stats** are hardcoded in `src/app/components/hero.tsx:111-146`
- **No data fetching** exists anywhere in the codebase — all values are static
- **CSP `connect-src`** in `astro.config.mjs:16` does not include `api.ipor.io`
- **Reference script**: `/Users/ipor/ipor-labs/ipor-webapp/scripts/fetch-tvm.ts` fetches from `https://api.ipor.io/dapp/plasma-vaults-list`, sums `tvmUsd_18` (BigInt with 18 decimals), returns formatted TVM and vault count

### API Response Shape

```ts
interface PlasmaVaultsListResponse {
  timestamp: string;
  plasmaVaults: {
    address: string;
    chainId: number;
    tvmUsd_18: string; // BigInt as string, 18 decimals
    assetSymbol: string;
  }[];
}
```

## Desired End State

- Hero displays live TVM in compact format (`$250M`, `$1.2B`) and vault count fetched from the API
- Placeholder `—` shown during loading and on fetch error
- No layout shift — placeholder and data occupy the same space
- Volume processed remains hardcoded at `$10B+`

## What We're NOT Doing

- No build-time / SSR data fetching
- No caching layer or SWR/react-query
- No changes to "Volume processed" stat
- No loading skeleton or spinner — just a simple `—` placeholder

## Implementation Approach

Client-side fetch via `useEffect` in the Hero React island. A small utility handles the API call and compact number formatting. CSP is updated to permit the API connection.

---

## Phase 1: CSP Update

### Overview

Allow the browser to connect to `api.ipor.io` for the client-side fetch.

### Changes Required

**File**: `astro.config.mjs`
**Line 16**: Add `https://api.ipor.io` to `connect-src`

```js
// Before
"connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com",

// After
"connect-src 'self' https://api.ipor.io https://*.google-analytics.com https://*.analytics.google.com",
```

### Success Criteria

#### Automated Verification

- [ ] Build passes: `npm run build`

#### Manual Verification

- [ ] Generated HTML contains `api.ipor.io` in the CSP `connect-src` directive
- [ ] No CSP violation in browser console when fetching from the API

---

## Phase 2: Fetch Utility

### Overview

Create a standalone fetch + format utility that the Hero component will consume.

### Changes Required

**New file**: `src/app/lib/fetch-tvm.ts`

```ts
const API_URL = "https://api.ipor.io/dapp/plasma-vaults-list";

interface PlasmaVault {
  address: string;
  chainId: number;
  tvmUsd_18: string;
  assetSymbol: string;
}

interface PlasmaVaultsListResponse {
  timestamp: string;
  plasmaVaults: PlasmaVault[];
}

export interface TvmData {
  tvmFormatted: string;
  vaultCount: number;
}

export async function fetchTvm(): Promise<TvmData> {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data: PlasmaVaultsListResponse = await response.json();

  const vaults = data.plasmaVaults;
  const totalTvmUsd18 = vaults.reduce(
    (sum, vault) => sum + BigInt(vault.tvmUsd_18),
    0n,
  );
  const whole = Number(totalTvmUsd18 / 10n ** 18n);

  return {
    tvmFormatted: formatCompactUsd(whole),
    vaultCount: vaults.length,
  };
}

function formatCompactUsd(value: number): string {
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000;
    return `$${b % 1 === 0 ? b.toFixed(0) : b.toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `$${value}`;
}
```

### Success Criteria

#### Automated Verification

- [ ] TypeScript compiles: `npx astro check`
- [ ] Lint passes: `npm run lint`

---

## Phase 3: Hero Integration

### Overview

Wire the fetch utility into the Hero component with `useEffect`/`useState`. Show `—` as placeholder during loading and on error.

### Changes Required

**File**: `src/app/components/hero.tsx`

1. Add imports at top:

```tsx
import { useState, useEffect } from "react";
import { fetchTvm, type TvmData } from "@/app/lib/fetch-tvm";
```

2. Add state and effect inside `Hero()`, after the `useTheme()` call:

```tsx
const [tvmData, setTvmData] = useState<TvmData | null>(null);

useEffect(() => {
  fetchTvm()
    .then(setTvmData)
    .catch(() => {});
}, []);
```

3. Replace hardcoded TVM value `$250M` (line 116) with:

```tsx
{
  tvmData?.tvmFormatted ?? "—";
}
```

4. Replace hardcoded Vaults value `103` (line 130) with:

```tsx
{
  tvmData?.vaultCount ?? "—";
}
```

### Success Criteria

#### Automated Verification

- [ ] Build passes: `npm run build`
- [ ] TypeScript compiles: `npx astro check`
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass: `npm test`

#### Manual Verification

- [ ] On page load, TVM and Vaults briefly show `—` then populate with live data
- [ ] If API is blocked (e.g., devtools network block), `—` remains displayed
- [ ] No layout shift when data loads
- [ ] Values match what the IPOR app shows
- [ ] Works in both dark and light mode

---

## References

- Reference fetch script: `/Users/ipor/ipor-labs/ipor-webapp/scripts/fetch-tvm.ts`
- API endpoint: `https://api.ipor.io/dapp/plasma-vaults-list`
- Hero component: `src/app/components/hero.tsx:103-147`
- CSP config: `astro.config.mjs:16`
