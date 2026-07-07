# LavaMoat allow-scripts Implementation Plan

## Overview

Install `@lavamoat/allow-scripts` to protect against supply chain attacks via malicious npm lifecycle scripts. This tool disables all dependency lifecycle scripts by default and only runs explicitly allowlisted ones.

## Current State Analysis

- npm is the package manager (`package-lock.json`, lockfileVersion 3)
- Node 22.14.0 pinned in `engines`
- No `.npmrc` file exists
- `setup` script is `npm install`
- `prepare` script runs `husky` for git hooks
- Packages with `hasInstallScript: true` in lock file: `esbuild`, `fsevents` (x2), `msw`, `sharp`
- No existing LavaMoat or supply chain security tooling

## Desired End State

- `.npmrc` contains `ignore-scripts=true` (committed to repo)
- `@lavamoat/allow-scripts` and `@lavamoat/preinstall-always-fail` in devDependencies
- `package.json` contains a `lavamoat.allowScripts` config with reviewed allowlist
- `setup` script runs `npm install && npm exec allow-scripts && npx husky`
- All team members and CI use `npm run setup` instead of raw `npm install`
- Only `esbuild` is allowed to run install scripts (needs its binary)

### Verification

- `npm run setup` completes successfully
- `esbuild` binary is available after setup
- `husky` git hooks are installed after setup
- `npm run build` succeeds
- `npm run test` passes

## What We're NOT Doing

- Experimental `--experimental-bins` flag
- `sharp` install scripts (not used at build time)
- Any runtime LavaMoat sandboxing (just the allow-scripts gate)

## Implementation Approach

Single phase — this is a small, self-contained change.

## Phase 1: Install and Configure allow-scripts

### Overview

Install the package, generate the allowlist, configure it, and update the setup script.

### Steps:

#### 1. Install @lavamoat/allow-scripts

```bash
npm install --save-dev @lavamoat/allow-scripts
```

#### 2. Run setup command

```bash
npm exec allow-scripts setup
```

This will:

- Create `.npmrc` with `ignore-scripts=true`
- Add `@lavamoat/preinstall-always-fail` to devDependencies

#### 3. Run auto to generate allowlist

```bash
npm exec allow-scripts auto
```

This scans the dependency tree and writes a `lavamoat.allowScripts` section to `package.json` with all entries defaulting to `false`.

#### 4. Configure the allowlist

In `package.json`, set the `lavamoat.allowScripts` entries:

- `esbuild` → `true` (needs to install its platform-specific binary)
- `@lavamoat/preinstall-always-fail` → `false` (tripwire — must stay false)
- Everything else → `false` (fsevents, msw, sharp are optional/unused)

#### 5. Update the setup script

**File**: `package.json`

Change:

```json
"setup": "npm install"
```

To:

```json
"setup": "npm install && npm exec allow-scripts && npx husky"
```

This ensures:

1. `npm install` runs with scripts disabled
2. `allow-scripts` runs only the allowlisted install scripts (esbuild)
3. `husky` sets up git hooks (since `prepare` won't auto-run with `ignore-scripts=true`)

#### 6. Commit `.npmrc`

Ensure `.npmrc` is tracked in git (not in `.gitignore`). This is critical — if someone clones without it, the protection is gone. The `@lavamoat/preinstall-always-fail` tripwire provides a safety net, but `.npmrc` should still be committed.

#### 7. Verify the setup works

```bash
rm -rf node_modules
npm run setup
npm run build
npm run test
```

### Success Criteria:

#### Automated Verification:

- [ ] `npm run setup` completes without errors
- [ ] `npx esbuild --version` returns a version (binary installed correctly)
- [ ] `npm run build` succeeds
- [ ] `npm run test` passes
- [ ] `npm run lint` passes
- [ ] `.npmrc` contains `ignore-scripts=true`
- [ ] `package.json` contains `lavamoat.allowScripts` section
- [ ] `@lavamoat/preinstall-always-fail` is in devDependencies

#### Manual Verification:

- [ ] Git hooks work (make a test commit to verify lint-staged runs)
- [ ] `npm run dev` starts the dev server correctly

## References

- Original ticket: `thoughts/tickets/fsn_0018-lavamoat-allow-scripts.md`
- LavaMoat GitHub: https://github.com/LavaMoat/LavaMoat
- allow-scripts guide: https://lavamoat.github.io/guides/allow-scripts/
