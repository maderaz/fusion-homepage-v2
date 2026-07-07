# Fix dark/light mode errors

- Page default mode is still dark - it should be light as I requested in recent tickets
- In dark mode:
  - `Start building` button has dark text - it's not visible on dark background
  - `Trusted by` logos are dark so they are also not visible
- Test using Playwright
- However when I switch to light and then to dark again - everything is good
- Identify issue and fix
