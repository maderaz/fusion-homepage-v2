# Apply fixes ater QA session

- For any issue mentioned here use Playwright to test it in browser
- Some issues may not be visible as I see them only using mobile devices with iOS
  - Try to figure out them anyway
- Identify these issues and fix

## Default theme always light

- Make light theme default
- User can change theme using controls

## Adjust favicon

- Now favicon takes wrong image - it's too large and it's not square
- Use some square icon which fits well for favicon shown in browser tab etc

## Adjust brand colors

### 1

- Adjust styling for secondary buttons ("Build" at the top & "Start Building" under header and at the bottom of the page)
- Light mode: Stroke color #9BA3AF + Hover Fill color #EFEFEF + Text #000000
  Dark mode: Stroke color #45484D + Hover Fill color #22272C + Text #FFFFFF
- Apply to any other buttons like these
- adjust shadcn theme colors
- Compare these buttons on figma site https://fusionhome.figma.site/

### 2

- Adjust styling for Light / Dark mode switcher (the circle)
- Light mode: Stroke color #9BA3AF + Hover Fill color #EFEFEF
- Dark mode: Stroke color #45484D + Hover Fill color #22272C
- adjust to shadcn theme colors

## Mobile color isses

These issues are present on mobile iOS devices.
Both are related to SVGs in src/app/components/ui/fusion-flow.tsx

### 3

- stroke color issue only in dark mode for Morpho, Aave, Euler boxes
- These container boxes should have the same default stroke color as "Deposit" and "Swap" "Loop" etc. which is #2E3137
- src/app/components/ui/fusion-flow.tsx
- I mean the part staring from Line 312: `{FUSES.map((fuse, i) => {`

### 4

- fusion icon shows up pink inside this illustration (both light and dark mode). It should be #8429FF
- src/app/components/ui/fusion-flow.tsx

## Other

- Remove zokyo logo
- Change `Audited by` to `Audited & security reviewed by`
- Mobile view: Footer text under the logo is not fully visible
  - sticks out of the screen on mobile
  - src/components/footer.astro
  - text: `Onchain vault infrastructure for asset managers, institutions, and builders. Create, white-label and earn.`
- Link build button to https://docs.ipor.io/build-on-fusion
