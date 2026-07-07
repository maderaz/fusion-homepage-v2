# Update README.md & Outdated Files — Implementation Plan

## Overview

The README.md still describes the pre-Astro SPA setup (Vite 8 / React 19 / TypeScript 5.9). It needs a full rewrite to reflect the current Astro 5 + React islands architecture and follow README best practices. Additionally, `.nvmrc` contains the wrong Node version.

## Current State Analysis

- **README.md** — Outdated tech stack, no architecture section, no theme system docs.
- **.nvmrc** — Says `24.14.0`; should be `22.14.0` (matching `package.json` engines and `run.sh`).
- **All other config/CI files** — Already up-to-date with Astro 5 setup. No changes needed.

## Desired End State

- README.md accurately describes the project: tech stack, getting started, scripts, architecture, theme system, deployment.
- `.nvmrc` contains `22.14.0`.
- Verified by reading both files and confirming consistency with `package.json`, `run.sh`, and CLAUDE.md.

## What We're NOT Doing

- Changing CLAUDE.md (already accurate)
- Modifying CI/CD workflows (already up-to-date)
- Updating `run.sh` (already correct)
- Adding contributing guidelines or code of conduct (not requested)

## Phase 1: Fix .nvmrc

**File**: `.nvmrc`
**Change**: Replace `24.14.0` with `22.14.0`

### Success Criteria

#### Automated Verification:

- [ ] `.nvmrc` contains exactly `22.14.0`
- [ ] Value matches `package.json` engines.node (`22.14.0`)
- [ ] Value matches `run.sh` NODE_VERSION (`22.14.0`)

## Phase 2: Rewrite README.md

**File**: `README.md`

Replace entire contents with a README following best practices:

````markdown
# Fusion Website

IPOR Fusion landing page — [fusion.ipor.io](https://fusion.ipor.io)

## Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (static site generation) with React 19 islands
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Testing**: [Vitest](https://vitest.dev/) + Testing Library
- **Language**: TypeScript 5.9

## Getting Started

Prerequisites: [nvm](https://github.com/nvm-sh/nvm) (or Node.js 22.14.0)

Quick start:

```bash
./run.sh
```
````

Or manually:

```bash
nvm use
npm install
npm run dev
```

## Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start Astro dev server         |
| `npm run build`      | Type-check and build (`dist/`) |
| `npm run preview`    | Preview production build       |
| `npm test`           | Run tests (Vitest)             |
| `npm run test:watch` | Run tests in watch mode        |
| `npm run lint`       | Run ESLint                     |
| `npm run format`     | Format code with Prettier      |

## Architecture

```
src/
├── pages/          # Astro file-based routing (index, privacy-policy, terms-of-use, brand-guidelines)
├── layouts/        # Astro layouts (base-layout with SEO head, theme script, nav)
├── components/     # Astro components and shared utilities
├── app/components/ # React components used as Astro islands
└── styles/         # CSS (theme.css, tailwind.css, index.css)
public/             # Static assets (images, robots.txt)
```

## Theme System

Dark/light mode uses a `dark` class on `<html>`. An inline script in the head reads `localStorage` before first paint to prevent flash. React islands use the `useTheme()` hook to toggle the theme.

## Deployment

Deployed on AWS Amplify via GitHub Actions. Build command: `astro check && astro build`, output directory: `dist/`.

## License

See [LICENSE](LICENSE).

```

### Success Criteria

#### Automated Verification:
- [ ] README.md exists and is non-empty
- [ ] Contains "Astro" (correct framework)
- [ ] Does not contain "Vite 8" (old tech stack reference)
- [ ] Contains link to fusion.ipor.io

#### Manual Verification:
- [ ] README renders correctly on GitHub
- [ ] All sections are accurate and complete
- [ ] No outdated information remains

## References

- CLAUDE.md — project overview (source of truth for architecture)
- package.json — scripts and dependencies
- run.sh — local dev script
```
