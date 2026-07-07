# Reflect Figma designs

- use playwright-cli skill `.claude/skills/playwright-cli` to compare both actual ipor SITE and fusion benchmark project
- Visit https://fusionhome.figma.site/home - this is you benchmark
- Everything in src/sites/ipor/pages/index.astro should look exactly the same as on benchmark
- run `npm run dev:ipor` and visit the website in browser to test against benchmark
- Avoid regression to fusion website

## Known issues

- Back ground color of whole website does not match
- `<img src="/brand/fusion-light.png" alt="Fusion by IPOR" class="h-6 w-auto block dark:hidden">` Both images are too small
- Discover Fusion and Launch App in these two boxes should stick to the bottom of the page with some box padding - both should be aligned on the same height
- These two boxes height does not match - make these choice boxes taller - equal to the benchmark
- main content has height `min-h-screen` whichch affects in too much space between main content and the footer
- Content in the second box - The live App - `Discover existing yield strategies powered by Fusion. Get started in one-click.` it overlaps on the image
