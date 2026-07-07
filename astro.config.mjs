import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cspStyleFix from "./src/integrations/csp-style-fix";

const site = process.env.SITE || "fusion";

const sites = {
  fusion: {
    url: "https://fusion.ipor.io",
    integrations: [react(), sitemap(), cspStyleFix()],
  },
  ipor: {
    url: "https://ipor.io",
    integrations: [sitemap(), cspStyleFix()],
  },
};

const current = sites[site];
if (!current) {
  throw new Error(`Unknown SITE="${site}". Use "fusion" or "ipor".`);
}

export default defineConfig({
  site: current.url,
  srcDir: `./src/sites/${site}`,
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
  integrations: current.integrations,
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
