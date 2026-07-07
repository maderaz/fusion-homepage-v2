# Fix Fusion flow diagram issues

- src/app/components/ui/fusion-flow.tsx
- Go to https://fusionhome.figma.site/#how-it-works section with playwright and compare to http://localhost:4321/#how-it-works
- In `Alpha Engine` box background shouldb be darker
- I don't see dashed borders on `add` and `Add new` button-like boxes
- Also on iOS mobile devices I see some unwanted white border
- All mentioned issues occurs only in dark mode
- Ensure there is no regression on light mode
- Fix all issues
