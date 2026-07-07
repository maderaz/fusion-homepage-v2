## Unify Duplicate Footer Implementations

**Priority:** Medium
**Source:** FSN-0006 code review

### Problem

Two separate footer implementations with copy-pasted data:

- `src/components/footer.astro` — used on index page (static, zero JS)
- `src/app/components/footer.tsx` — used inside `privacy-policy-page.tsx` and `terms-of-use-page.tsx`

Issues:

- `linkColumns` data duplicated verbatim in both files
- Cookie settings behavior diverges: Astro footer dispatches DOM event, React footer has unused callback prop
- `as unknown as { soon?: boolean }` type hack in `footer.tsx:93` to access `soon` property
- Placeholder `href="#"` for "Python SDK" link renders as clickable anchor to nowhere (both files)
- Any link/content change must be made in two places

### Approach Options

1. **Extract shared data** — Move `linkColumns` to a shared module, keep both component implementations
2. **Single React footer** — Replace Astro footer with the React one everywhere (adds JS to index page)
3. **Single Astro footer** — Move legal pages to use Astro footer via layout slot (requires restructuring how legal pages work)

### Also Fix

- Add `soon: true` to Python SDK link or provide a real URL
- Fix the `as unknown as` type hack by properly typing `linkColumns`
- Ensure cookie settings link works on all pages
