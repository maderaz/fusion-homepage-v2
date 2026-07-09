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

Quick start — installs dependencies, lints, tests, builds, and starts the preview server:

```bash
./run.sh
```

Or for development only:

```bash
nvm use
npm run setup
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

Deployed on Vercel. Build command: `npm run build:fusion` (`astro check && astro build`), output directory: `dist/`. The Content-Security-Policy is emitted as a `<meta>` tag on every page (see `src/integrations/csp-style-fix.ts`).

## License

See [LICENSE](LICENSE).
