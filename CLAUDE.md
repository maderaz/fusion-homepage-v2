## Project Overview

This repository contains the **fusion.ipor.io** landing page — the Fusion by IPOR product homepage.

## Tech Stack

- **Framework**: Astro 5 (static site generation) with React islands for interactive components
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Animations**: Motion (formerly Framer Motion) in React islands
- **Build**: Astro static build → `dist/`
- **Deployment**: Vercel
- **Testing**: Vitest + Testing Library

## Architecture

- `src/shared/` — Shared code (components, layouts, styles, data)
- `src/sites/fusion/` — Fusion site (fusion.ipor.io) pages, components, React islands
- `src/integrations/` — Custom Astro integrations (CSP fix)
- `public/` — Static assets

### Build Commands

- `npm run build` — Build fusion.ipor.io → `dist/`
- `npm run dev` — Dev server (port 4321)
- `npm run preview` — Preview the built site

## Theme System

Dark/light mode is CSS-only via a `dark` class on `<html>`. An inline `<script>` in the head reads `localStorage` before first paint. React islands use the `useTheme()` hook from `src/shared/components/use-theme.ts` which reads/writes `document.documentElement.classList`.
