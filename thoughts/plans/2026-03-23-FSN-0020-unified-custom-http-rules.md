# Unified Custom HTTP Rules Implementation Plan

## Overview

Replace the two identical AWS Amplify custom header files (`csp/dev-customHttp.yml` and `csp/mainnet-customHttp.yml`) with a single `csp/customHttp.yml`. Both files are byte-for-byte identical and serve no distinct purpose — the split is legacy.

## Current State Analysis

- `csp/dev-customHttp.yml` and `csp/mainnet-customHttp.yml` contain identical content (25 lines each)
- `src/integrations/csp-style-fix.ts` writes script hashes to both files identically (lines 143-156)
- `csp/csp-headers.test.ts` reads both files and asserts they're identical (line 79-81)
- `.gitignore` has `/customHttp.yml` rule (line 40) — no longer needed since the file lives in `csp/`
- Both Amplify apps have prebuild steps copying their respective file to root

## Desired End State

- Single file: `csp/customHttp.yml`
- Build integration writes to one file
- Tests reference one file
- No stale gitignore rule
- Both Amplify apps copy from the same `csp/customHttp.yml`

### Verification:

- `npm test` passes
- `npm run build` succeeds and `csp/customHttp.yml` gets updated script hashes
- No references to `dev-customHttp.yml` or `mainnet-customHttp.yml` remain in the codebase

## What We're NOT Doing

- Changing the CSP content itself
- Modifying the Amplify build specs (that's done manually in AWS Console)
- Moving the file to the project root

## Implementation Approach

Single phase — all changes are small and interdependent.

## Phase 1: Unify to Single File

### Changes Required:

#### 1. Rename the YAML file

Delete `csp/dev-customHttp.yml` and rename `csp/mainnet-customHttp.yml` to `csp/customHttp.yml`. Content stays identical.

#### 2. Update build integration

**File**: `src/integrations/csp-style-fix.ts`
**Changes**: Replace the two-file array with a single file reference.

Lines 143-145, change from:

```ts
const yamlFiles = [
  resolve(cspDir, "dev-customHttp.yml"),
  resolve(cspDir, "mainnet-customHttp.yml"),
];
```

To:

```ts
const yamlFiles = [resolve(cspDir, "customHttp.yml")];
```

Update the JSDoc comment (lines 47-53) to reference the single file:

```ts
 * The `csp/customHttp.yml` file defines CSP HTTP headers for AWS Amplify.
```

#### 3. Update tests

**File**: `csp/csp-headers.test.ts`
**Changes**:

- Remove the `devCsp` variable (line 70)
- Remove the "dev and mainnet YAML are identical" test (lines 79-81)
- Update `mainnetCsp` variable name to just `csp` and update the file path to `csp/customHttp.yml`
- Update all references from `mainnetDirectives` to just `directives`

#### 4. Remove gitignore rule

**File**: `.gitignore`
**Changes**: Remove line 40 (`/customHttp.yml`) and the comment on line 39 (`# AWS custom headers`).

### Success Criteria:

#### Automated Verification:

- [ ] `npm test` passes (CSP header tests work with single file)
- [ ] `npm run build` succeeds and updates `csp/customHttp.yml` with script hashes
- [ ] No references to `dev-customHttp.yml` or `mainnet-customHttp.yml` in source: `grep -r "dev-customHttp\|mainnet-customHttp" --include="*.ts" --include="*.yml" --include="*.md" src/ csp/ .github/`
- [ ] `npx astro check` passes

#### Manual Verification:

- [ ] Update both Amplify app build specs in AWS Console to `cp csp/customHttp.yml customHttp.yml`
- [ ] Deploy to dev environment and verify HTTP headers are served correctly
- [ ] Deploy to mainnet and verify HTTP headers are served correctly

## References

- Original ticket: `thoughts/tickets/fsn_00020-on-unified-custom-http-rules.md`
- Related plan: `thoughts/plans/2026-03-23-FSN-0012-csp-cors-security.md`
