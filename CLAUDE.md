## Project Overview

This repository contains two websites sharing a common codebase:

- **fusion.ipor.io** — Fusion product landing page
- **ipor.io** — IPOR main website (single-page)

## Tech Stack

- **Framework**: Astro 5 (static site generation) with React islands for interactive components
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Animations**: Motion (formerly Framer Motion) in React islands
- **Build**: Dual Astro configs with separate `srcDir`/`outDir` per site
- **Deployment**: AWS Amplify via GitHub Actions
- **Testing**: Vitest + Testing Library

## Architecture

- `src/shared/` — Code shared across both sites (components, layouts, styles, data)
- `src/sites/fusion/` — Fusion site (fusion.ipor.io) pages, components, React islands
- `src/sites/ipor/` — IPOR site (ipor.io) pages and components
- `src/integrations/` — Custom Astro integrations (CSP fix)
- `public/` — Static assets shared by both sites

### Build Commands

- `npm run build:fusion` — Build fusion.ipor.io → `dist/`
- `npm run build:ipor` — Build ipor.io → `dist/`
- `npm run build` — Build both sites
- `npm run dev:fusion` — Dev server for fusion (port 4321)
- `npm run dev:ipor` — Dev server for ipor (port 4322)

## Theme System

Dark/light mode is CSS-only via a `dark` class on `<html>`. An inline `<script>` in the head reads `localStorage` before first paint. React islands use the `useTheme()` hook from `src/shared/components/use-theme.ts` which reads/writes `document.documentElement.classList`.
