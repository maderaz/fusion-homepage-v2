# Optimize images

- For all images across the both apps fusion and ipor
- Esure images have right resolutions
- Now I see very low resolution images
  - generally all logos, especially fusion logos
  - app preview image - the largest one
  - Plug & Play section protocols logos
  - auditors logos in Audited by
- Identify why resolution is to low
- tested on iOS and Macbook with retina
- Use logos:
  - public/brand/full-logo
  - public/brand/icon-logo
- all images in `public/brand` files should be kebab-case
- Check if all metadata follows the best SEO standards and is agent friendly

## Dev logs

- Analyze logs I get during development
- Identify issues and prepar fix plan

```
dev:fusion
> SITE=fusion astro dev

00:47:16 [WARN] [config] Astro's Content Security Policy (CSP) does not work in development mode. To verify your CSP implementation, build the project and run the preview server.
00:47:16 [WARN] [config] Shiki syntax highlighting uses inline styles that are not compatible with Content Security Policy (CSP). Consider using Prism syntax highlighting instead, or disable CSP if Shiki is required.
[vite] connected.
00:47:17 [types] Generated 0ms
00:47:17 [WARN] [content] Content config not loaded
00:47:17 [WARN] [vite] [plugin:astro:scripts] context method emitFile() is not supported in serve mode. This plugin is likely not vite-compatible.
00:47:17 [vite] Re-optimizing dependencies because vite config has changed
 astro  v6.0.8 ready in 523 ms
┃ Local    http://localhost:4321/
┃ Network  use --host to expose
00:47:17 watching for file changes...
```

## Brand guide

- Verify if all lins to brand kit are https://drive.google.com/drive/folders/1uZ0nfbzsIaburx7C2xR-JAcedNtQQIsH

## App meta image for ipor site

- public/brand/ipor-app-meta.png
- use it as preview image for sharing platforms like x or telegram
- When I post the link it should display this image as preview in chat
