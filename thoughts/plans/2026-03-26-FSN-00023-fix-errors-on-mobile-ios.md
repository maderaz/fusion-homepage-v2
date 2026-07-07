# Fix Errors on Mobile iOS — Implementation Plan

## Overview

Fix three mobile iOS issues: cookie banner buttons not responding to taps (hydration gap), cookie consent not persisting (consequence of the first issue), and navbar being transparent until scroll.

## Current State Analysis

### Cookie Banner Hydration Gap

The `CookieBannerIsland` (`src/app/components/cookie-banner-island.tsx`) is mounted with `client:idle` in all three pages (`index.astro:40`, `privacy-policy.astro:14`, `terms-of-use.astro:14`).

During SSG build, `localStorage` is unavailable, so the `catch` block in the `useState` initializer returns `true` — the banner HTML is baked into the static page. On the client, React only hydrates when `requestIdleCallback` fires. On slower mobile iOS devices, this delay is significant — users see the banner but taps do nothing because event handlers aren't attached yet.

Additionally, if a user has previously accepted/declined cookies, the client-side `useState` initializer returns `false` while the SSG HTML has the banner visible — causing a React hydration mismatch (brief flash of banner before it disappears).

### Cookie Consent Persistence

Already works correctly via `localStorage`. The real problem is that taps don't register (hydration gap above), so consent is never saved.

### Navbar Transparency

In `nav.tsx:52-55`, the background classes are conditional on a `scrolled` state (set when `window.scrollY > 50`):

```tsx
scrolled && "bg-background/80 backdrop-blur-2xl",
```

The navbar starts fully transparent and only gets a background after scrolling 50px.

### Key Discoveries:

- `cookie-banner-island.tsx:10-16` — `useState` initializer accesses `localStorage` which throws during SSG, causing server render with `visible = true`
- `index.astro:40` — `client:idle` delays hydration until browser idle, creating the tap gap on mobile
- `nav.tsx:19-27` — `scrolled` state and scroll listener control navbar background
- `nav.tsx:53-55` — Background classes only applied when `scrolled` is true
- `index.astro:23-26` — Noise overlay at `z-[100]` has `pointer-events-none`, so it does NOT block taps

## Desired End State

- Cookie banner buttons respond to taps immediately on mobile iOS
- No hydration mismatch (banner never flash-renders then disappears)
- Cookie consent persists across sessions (already works, unblocked by fix above)
- Navbar has solid `bg-background/80 backdrop-blur-2xl` background at all times, regardless of scroll position

### Verification:

- `npm run build` succeeds
- `npm test` passes
- On mobile iOS: cookie banner buttons respond immediately to first tap
- Accept/decline persists across browser sessions
- Navbar background is visible immediately on page load (no transparency at top)

## What We're NOT Doing

- Making the cookie banner responsive/full-width on mobile (separate concern)
- Changing the navbar border behavior (still scroll-dependent)
- Removing the scroll listener entirely (still used for border)

## Implementation Approach

Two independent fixes plus test updates. The cookie banner fix changes from eager server-side rendering to a hydration-safe pattern where the banner only appears after React is mounted and interactive. The navbar fix removes the scroll condition from background classes.

---

## Phase 1: Fix Cookie Banner Hydration Gap

### Overview

Change the cookie banner to never render during SSG, and only show after React hydration is complete. This ensures taps always work because the banner is only visible when event handlers are attached.

### Changes Required:

#### 1. Cookie Banner Component

**File**: `src/app/components/cookie-banner-island.tsx`
**Changes**: Initialize `visible` as `false`, move localStorage check into a `useEffect`

```tsx
export default function CookieBannerIsland() {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  // Check consent status after hydration — ensures banner is never
  // visible without event handlers (fixes iOS mobile tap issue)
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  // ... rest unchanged
}
```

This eliminates:

- The hydration gap (banner only renders after React is mounted)
- The hydration mismatch (server and client both start with `visible = false`)

No changes needed to `accept`, `decline` callbacks, or the `open-cookie-settings` listener.

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm test`

#### Manual Verification:

- [ ] On mobile iOS: cookie banner appears after brief delay (hydration), buttons respond to first tap
- [ ] Accept cookies → banner hides → reload → banner stays hidden
- [ ] Decline cookies → banner hides → reload → banner stays hidden
- [ ] No hydration mismatch warnings in console

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation on iOS device before proceeding.

---

## Phase 2: Fix Navbar Background

### Overview

Remove the scroll-dependent transparency. Apply `bg-background/80 backdrop-blur-2xl` at all times.

### Changes Required:

#### 1. Nav Component

**File**: `src/app/components/nav.tsx`
**Changes**: Move background classes out of the `scrolled` conditional

Current (line 52-55):

```tsx
className={cn(
  "group fixed z-20 w-full transition-all duration-300",
  scrolled && "bg-background/80 backdrop-blur-2xl",
)}
```

New:

```tsx
className={cn(
  "group fixed z-20 w-full transition-all duration-300",
  "bg-background/80 backdrop-blur-2xl",
)}
```

The `scrolled` state is still used for the border (`border-border/50` on line 61), so the scroll listener and `scrolled` state remain.

### Success Criteria:

#### Automated Verification:

- [ ] Build succeeds: `npm run build`

#### Manual Verification:

- [ ] Navbar has solid background immediately on page load (no transparency)
- [ ] Border still appears after scrolling 50px
- [ ] Background looks correct in both dark and light modes

---

## Phase 3: Update Tests

### Overview

Adjust cookie banner tests for the new `useEffect`-based visibility pattern. Since visibility is now set in an effect (async), tests need to await the banner appearing.

### Changes Required:

#### 1. Cookie Banner Tests

**File**: `src/app/components/cookie-banner-island.test.tsx`
**Changes**: Use `waitFor` or `findBy` queries instead of synchronous `getBy` for initial visibility checks

Tests that need updating:

1. **"shows banner when no consent stored"** — use `findByText` (async) instead of `getByText`
2. **"hides banner when consent already stored"** — needs a small wait to confirm banner doesn't appear
3. **"accept button stores consent and hides banner"** — find banner async first, then click
4. **"decline button stores decline and hides banner"** — find banner async first, then click
5. **"X button declines and hides banner"** — find banner async first, then click
6. **"dispatches cookie-consent-accepted event on accept"** — find banner async first
7. **"does not dispatch cookie-consent-accepted event on decline"** — find banner async first
8. **"reopens when open-cookie-settings event is dispatched"** — no change needed (already uses `act`)

```tsx
// Example pattern for updated tests:
it("shows banner when no consent stored", async () => {
  render(<CookieBannerIsland />);
  expect(await screen.findByText("Cookie Preferences")).toBeInTheDocument();
});

it("accept button stores consent and hides banner", async () => {
  render(<CookieBannerIsland />);
  fireEvent.click(await screen.findByText("Accept"));
  expect(localStorage.getItem("cookie_consent")).toBe("accepted");
  expect(screen.queryByText("Cookie Preferences")).not.toBeInTheDocument();
});
```

### Success Criteria:

#### Automated Verification:

- [ ] All tests pass: `npm test`
- [ ] No regressions in existing tests

---

## Testing Strategy

### Unit Tests:

- Cookie banner: visibility after hydration, accept/decline persistence, event dispatch
- All existing test behaviors preserved, updated for async pattern

### Manual Testing Steps:

1. Open site on mobile iOS Safari
2. Clear localStorage (or use private browsing)
3. Cookie banner appears → tap Accept → banner hides immediately
4. Reload → banner does not appear
5. Clear localStorage → reload → tap Decline → banner hides
6. Reload → banner does not appear
7. Navigate to `/privacy-policy` → click "Cookie Policy" in footer → banner appears → buttons work
8. Check navbar has solid background at top of page (no scroll needed)
9. Scroll down and back up — navbar background stays consistent
10. Test in both dark and light modes

## References

- Original ticket: `thoughts/tickets/fsn_00023-fix-errors-on-mobile-ios.md`
- Previous cookie fix plan: `thoughts/plans/2026-03-23-FSN-0013-cookie-consent-fix.md`
- Cookie banner: `src/app/components/cookie-banner-island.tsx`
- Nav component: `src/app/components/nav.tsx`
