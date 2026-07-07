# Improve CSS, Tailwind and shadcn

- Install shadcn skills for Claude Code: https://ui.shadcn.com/docs/skills
- Ensure that themes and variables are used correctly
- Check if everything is correct according the versions of Tailwind and shadcn
- Migrate all inline `style=` attributes to Tailwind classes (300+ occurrences across 23 files). This is a prerequisite for removing the `csp-style-fix` integration — once no inline styles remain, `'unsafe-inline'` is no longer needed in `style-src` and Astro's native CSP hashing works without workarounds. See `src/integrations/csp-style-fix.ts` for details.
- Avoid using arbitrary values - especially for colors - take colors from variables
- Tak the best from shadcn and Tailwind theming and follow best practices for creating themes
- I want to have consistent shadcn themes that I can export and reuse in other files
- Attach that shad cn theme code snippet in brand guidelines page like it's done in https://tweakcn.com/editor/theme - I want users and developers can easily copy that theme from brand guidline page and it should match all the best practices of CSS, Tailwind and shadcn
