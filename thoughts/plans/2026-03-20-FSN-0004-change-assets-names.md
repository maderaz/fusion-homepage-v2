# Change Asset Names Implementation Plan

## Overview

Rename 31 hash-named PNG assets to human-readable, SEO-friendly names, organize them into subdirectories (`brand/`, `logos/`, `icons/`, `avatars/`), delete 8 unused assets, and update all import paths across the codebase.

## Current State Analysis

- 39 PNG files in `src/assets/`, all with SHA-1 hash filenames (e.g., `7431d75d5eb1f7dad9a8e4c69ac6b39fb194e6f1.png`)
- 31 files are actively imported across 8 component files
- 8 files are unused (no imports found anywhere)
- All imports use the `@/assets/` Vite alias
- No CSS `url()` references, no HTML/JSON references — only ES module imports in `.tsx` files

## Desired End State

All assets have human-readable names organized in subdirectories:

```
src/assets/
├── brand/          # 3 files - Fusion brand logos
├── logos/          # 16 files - Partner/protocol logos
├── icons/          # 7 files - Protocol icons & tokens
└── avatars/        # 3 files - Person avatars
```

All imports updated. 8 unused files deleted. Build passes cleanly.

## What We're NOT Doing

- Changing image formats (keeping PNG)
- Optimizing image sizes/compression
- Changing import variable names in components
- Changing alt text or other JSX attributes

## Complete File Mapping

### brand/ (Fusion brand logos)

| Old Hash                                       | New Path                 | Import Variable     | Used In                                       |
| ---------------------------------------------- | ------------------------ | ------------------- | --------------------------------------------- |
| `7431d75d5eb1f7dad9a8e4c69ac6b39fb194e6f1.png` | `brand/fusion-dark.png`  | `fusionLogoDarkPng` | Nav, Footer, ComparisonTable                  |
| `467f3a5bb0abc2e066223b5d4eea80797d5b7ccd.png` | `brand/fusion-light.png` | `fusionLogoLight`   | Nav, Footer, ComparisonTable, BrandGuidelines |
| `5b737a276a6908088595e5b6530fff074f67123a.png` | `brand/fusion.png`       | `fusionLogo`        | BrandGuidelines                               |

### logos/ (Partner/protocol logos)

| Old Hash                                       | New Path                   | Import Variable               | Used In            |
| ---------------------------------------------- | -------------------------- | ----------------------------- | ------------------ |
| `27eaf7f1d8e15adbda2e40a7dbbaa37a9148005c.png` | `logos/llamarisk.png`      | `logoLlamaRisk`               | Hero               |
| `fd498d5ef6a552323a756611801a96fe869f9ea1.png` | `logos/tesseract.png`      | `logoTesseract`               | Hero, Testimonials |
| `81ccb8b1566153507476e23d831196aa8f65e806.png` | `logos/tau-labs.png`       | `logoTauLabs`                 | Hero, Testimonials |
| `2034cdb69d7661904524abe1ebf8c3dfff4baa40.png` | `logos/k3-capital.png`     | `logoK3Capital`               | Hero               |
| `930a5b1472d3933af2c64ea76a3a4497aeae82a0.png` | `logos/navigator.png`      | `logoNavigator`               | Hero               |
| `b43b4e3d049276b94a1eab36badf095c0f199d5f.png` | `logos/clearstar.png`      | `logoFirst` / `logoClearstar` | Hero               |
| `5825e1e8d3ef806ec41edbf7133c10d197490b21.png` | `logos/reservoir.png`      | `logoThird` / `logoReservoir` | Hero, Testimonials |
| `f2fc5301bfcaff717b0aee084068e1db50944de6.png` | `logos/aave.png`           | `logoAave`                    | TrustBar           |
| `5abd3a0d07e4eb4ace015cd76f2b7f7357384721.png` | `logos/morpho.png`         | `logoMorpho`                  | TrustBar           |
| `347e59f899e9dc45af6f2abaae6ce391c90035bb.png` | `logos/uniswap.png`        | `logoUniswap`                 | TrustBar           |
| `cda8f2f7ff473512091beef88e2e41c652f763df.png` | `logos/compound.png`       | `logoCompound`                | TrustBar           |
| `d71d24730cbfa537a4357336d19da1db84099ba1.png` | `logos/pendle.png`         | `logoPendle`                  | TrustBar           |
| `6f16f1ad63b9e471be03efda4ed95dd7cf5b24f4.png` | `logos/more-protocols.png` | `logoExtra`                   | TrustBar           |
| `fcb629b2417a54cc4378fef5fba8d657b6bc2fea.png` | `logos/blocksec.png`       | `logoBlocksec`                | Security           |
| `197135718ab7bba66535b2f9b1c097882c33a8ae.png` | `logos/ackee.png`          | `logoAckee`                   | Security           |
| `0984a67ec59a9da72994528d8b570f1c2e55d251.png` | `logos/zokyo.png`          | `logoZokyo`                   | Security           |
| `7818a7d6ab1078dc24277a513e078db13a765fae.png` | `logos/protofire.png`      | `logoProtofire`               | Security           |

### icons/ (Protocol icons for fusion-flow + tokens)

| Old Hash                                       | New Path                 | Import Variable   | Used In           |
| ---------------------------------------------- | ------------------------ | ----------------- | ----------------- |
| `2b48695444595169b19e5f1a3e0e29241ec3cfdc.png` | `icons/usdc.png`         | `imgUsdc`         | Hero, fusion-flow |
| `31a31f4afd53e870520818624bd81035c1b581c3.png` | `icons/pendle.png`       | `iconPendle`      | fusion-flow       |
| `4f300b59a8c93ba11b8d9147b36d7d2721cf7676.png` | `icons/aave.png`         | `iconAave`        | fusion-flow       |
| `907d2affec3bc22e657c42e3b02c7e2be5697a05.png` | `icons/euler.png`        | `iconEuler`       | fusion-flow       |
| `a887d9da2d23aa089f30d7595069a61e8f58c159.png` | `icons/morpho-dark.png`  | `iconMorphoDark`  | fusion-flow       |
| `de08afe022365333d838bf2246d10c9d83189fa4.png` | `icons/morpho-light.png` | `iconMorphoLight` | fusion-flow       |
| `b069a3fd88f019705814056dac00fe24cd91fa59.png` | `icons/fusion-light.png` | `iconFusionLight` | fusion-flow       |

### avatars/

| Old Hash                                       | New Path            | Import Variable | Used In      |
| ---------------------------------------------- | ------------------- | --------------- | ------------ |
| `ca3146c1c32b55a909080989e7aafdcf61056c47.png` | `avatars/james.png` | `avatarJames`   | Testimonials |
| `a328cf41a25f44e21a01ae9247972989a67cc5ee.png` | `avatars/vlad.png`  | `avatarVlad`    | Testimonials |
| `c002c878caf2b41f608a354bd2e30dd223e5d165.png` | `avatars/nick.png`  | `avatarNick`    | Testimonials |

### Files to DELETE (unused)

| Hash                                           | Description                           |
| ---------------------------------------------- | ------------------------------------- |
| `e350fb54d0e73d25185031ab80ff2e8c71682776.png` | Fusion atom icon (purple gradient)    |
| `36a9570a0686de5a2b47028f3a36fbdabc2ad3dd.png` | Dark purple abstract background       |
| `ac20e2f4201491730bb781b7a17e2986a441f5c4.png` | Fusion app icon ($ with rings)        |
| `6a1c323810bdf0b78497049d09196d7b3d86cad2.png` | Purple striped decorative bar         |
| `90b83974d2123539b809133e1b82cc97423f08bf.png` | Purple striped decorative bar (small) |
| `94e828befbd9536f38323a42f629bc4b54892652.png` | Small logo with blue accent           |
| `a9073594780db5dacab78106288d3f10d07e1b2d.png` | Purple protocol icon                  |
| `893bb5d85d5234af690fb6cad16f261d83a94015.png` | IPOR Fusion logo (purple)             |

## Phase 1: Create directories, move & rename files

Create subdirectories and move/rename all 31 used files using `git mv`.

### Success Criteria:

#### Automated Verification:

- [ ] All 4 subdirectories exist: `brand/`, `logos/`, `icons/`, `avatars/`
- [ ] All 31 files renamed and in correct locations
- [ ] No hash-named files remain in `src/assets/` root

## Phase 2: Update all imports

Update import paths in these 8 files:

- `src/app/components/Nav.tsx` (2 imports)
- `src/app/components/Footer.tsx` (2 imports)
- `src/app/components/ComparisonTable.tsx` (2 imports)
- `src/app/components/BrandGuidelinesPage.tsx` (2 imports)
- `src/app/components/Hero.tsx` (8 imports)
- `src/app/components/TrustBar.tsx` (6 imports)
- `src/app/components/Security.tsx` (4 imports)
- `src/app/components/Testimonials.tsx` (6 imports)
- `src/app/components/ui/fusion-flow.tsx` (7 imports)

### Success Criteria:

#### Automated Verification:

- [ ] No remaining references to hash filenames: `grep -r "assets/[a-f0-9]\{40\}" src/`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`

## Phase 3: Delete unused assets

Remove 8 unused files via `git rm`.

### Success Criteria:

#### Automated Verification:

- [ ] Only subdirectories remain in `src/assets/` (no root-level PNGs)
- [ ] Build still succeeds: `npm run build`

#### Manual Verification:

- [ ] Site loads correctly in browser
- [ ] All images render on all sections (Hero, TrustBar, Security, Testimonials, etc.)
- [ ] Dark/light mode logo switching works

**Implementation Note**: After completing Phase 3 and all automated verification passes, pause for manual confirmation.

## References

- Original ticket: `thoughts/tickets/fsn_0004-change-assets-names.md`
