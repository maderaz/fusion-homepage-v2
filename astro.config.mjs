import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cspStyleFix from "./src/integrations/csp-style-fix";

export default defineConfig({
  site: "https://fusion.ipor.io",
  srcDir: "./src/sites/fusion",
  outDir: "./dist",
  output: "static",
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "font-src 'self'",
        "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
        "connect-src 'self' https://api.ipor.io https://*.google-analytics.com https://*.analytics.google.com",
        "frame-src 'none'",
        "object-src 'none'",
      ],
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
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
