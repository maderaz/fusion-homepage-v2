## Dead Code Cleanup

**Priority:** Medium
**Source:** FSN-0006 code review

### Tasks

#### Remove unused files

- [ ] Delete entire `src/assets/` directory (30 files) — never imported, `public/` serves all assets

#### Remove dead CSS

- [ ] Remove `.database`, `.db-light-1` through `.db-light-4`, and `@keyframes database-animation-path` from `src/styles/index.css:47-79`

#### Remove unused dependency

- [ ] Remove `tw-animate-css` from `package.json` and its `@import "tw-animate-css"` from `src/styles/tailwind.css:4` — zero animate utility classes used anywhere

#### Remove unreachable code

- [ ] Remove `const iconPendle` and `Pendle: iconPendle` map entry from `src/app/components/ui/fusion-flow.tsx:5,450` — "Pendle" is never in `FUSES` array
- [ ] Remove unused `textColor` prop from `ColorSwatch` in `brand-guidelines-page.tsx:48`
- [ ] Remove unused `emphasized` prop from `SolutionCard` in `solutions.tsx:14,28`
- [ ] Remove dead `onOpenCookieSettings` prop from `footer.tsx:57-59` (unless FSN-0013 decides to use it)

#### Remove stale comments

- [ ] Remove `{/* removed protocol text grid */}` from `hero.tsx:337`
- [ ] Remove `{/* removed */}` from `fusion-icons.tsx:823`
- [ ] Remove `{/* App mock moved to TransparencyFeatures section */}` from `hero.tsx:332`
