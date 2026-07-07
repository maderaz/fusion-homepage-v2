# Two separate build

- I want to have separate build process for separate website
- Both pages - current one and that another one - shares:
  - styles
  - assets
  - some components like buttons, footer
- I want to have separate build command for both
- The websites are stored on two domains:
  - https://fusion.ipor.io/ - that's for current one, already launched
  - https://ipor.io/ - don't read current content under this domain, we're gonna clear it completaly and deploy the new website (from the second buiold script) instead
- The second page figma project is available here: https://fusionhome.figma.site/home
  - this is one page only
  - no other subpages, except the formal ones: ToU, Privacy Policy
- Find the bast practices to develop and maintain two separate websites in one repo with shared assets, styles etc - just separate content
- Create that second page from the source - https://fusionhome.figma.site/home - in figma project this is just subpage, but that should be main root for the second website build.
