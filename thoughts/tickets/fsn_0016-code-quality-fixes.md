## Code Quality Fixes

**Priority:** Low
**Source:** FSN-0006 code review

### Naming

- [ ] Rename `P`, `P2`, `DIM` constants in `fusion-icons.tsx:9-11` — all three are `"currentColor"`, names are misleading (suggest single `ICON_COLOR` constant or inline `"currentColor"` directly)
- [ ] Rename `logoFirst`/`logoThird` to descriptive names in `hero.tsx:11-12` (e.g., `logoClearstar`/`logoReservoir`)

### Deduplication

- [ ] Extract `onMouseEnter`/`onMouseLeave` hover opacity pattern shared between `hero.tsx:82-87` and `nav.tsx:175-180` (or replace with Tailwind `hover:opacity-70`)
- [ ] `FuseIcon` in `fusion-flow.tsx:446` re-calls `useTheme()` — pass `isDark` as prop from parent instead

### Type safety

- [ ] Fix `as unknown as { soon?: boolean }` cast in `footer.tsx:93` — properly type `linkColumns` with explicit interface (addressed by FSN-0014 if footer is unified)

### Minor

- [ ] `navigator.clipboard.writeText` in `brand-guidelines-page.tsx:16,198` — add `.catch()` or `await` with try/catch
- [ ] Move `cookie-banner-island.tsx` from `src/components/` to `src/app/components/` — it's a React component in the Astro components directory

### Not actionable (noted for awareness)

- Hardcoded hero stats (`$250M`, `103 Vaults`, `$10B+`) — static values that degrade over time, needs product decision on whether to connect to live data
- `THEME_SNIPPET` in `brand-guidelines-page.tsx:95-170` duplicates `theme.css` — no sync mechanism, needs product decision
- `max-w-[1200px]` repeated 10+ times across sections — consistent pattern, extracting may not be worth the abstraction
- `clamp()` heading styles duplicated 8+ times — same consideration
