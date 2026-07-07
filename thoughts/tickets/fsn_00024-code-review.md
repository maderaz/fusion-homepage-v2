# Code review

- Do a code review accross all the code in this repo
- Identify all issues and fix
- I don't want any serversite rendering features - this is simple static page
- Avoid javascript, if we can do something with no java script - refactor it
- Avoid react - if anything can be a atatic astro template - make it static astro
- For features that really needs JavaScript - extract the minimal part - everyting elese extract to astro templates
- Identify any overkill features for static website
- Test against runtime errors
- Test in browser using Playwright
- For TVM and vaults number read the placeholder value in build time - update in runtime to actaul value as it is now
- Fusion Vaults link in the footer should redirect to `https://app.ipor.io/fusion`
- Remove cookie policy link in the footer
