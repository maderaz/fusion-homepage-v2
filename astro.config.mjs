import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cspStyleFix from "./src/integrations/csp-style-fix";

export default defineConfig({
  site: "https://ipor.io",
  srcDir: "./src/sites/fusion",
  outDir: "./dist",
  output: "static",
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "font-src 'self'",
        // twimg hosts: X embedded-tweet media / avatars.
        "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://pbs.twimg.com https://*.twimg.com",
        // syndication: the X widget fetches tweet data client-side.
        "connect-src 'self' https://api.ipor.io https://*.google-analytics.com https://*.analytics.google.com https://cdn.syndication.twimg.com https://syndication.twitter.com",
        // platform.twitter.com renders each embedded tweet in an iframe.
        "frame-src https://platform.twitter.com https://twitter.com",
        "object-src 'none'",
      ],
      // Astro augments this with the auto-generated hashes for our own inline
      // scripts; we add the X widget host so widgets.js can load.
      scriptDirective: {
        resources: [
          "'self'",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://platform.twitter.com",
        ],
      },
      styleDirective: {
        resources: [
          "'self'",
          "'unsafe-inline'",
          "https://platform.twitter.com",
          "https://ton.twimg.com",
        ],
      },
    },
  },
  integrations: [react(), sitemap(), cspStyleFix()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
    assetsInclude: ["**/*.svg"],
  },
});
