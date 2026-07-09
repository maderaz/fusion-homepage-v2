import type { AstroIntegration } from "astro";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * Post-build Astro integration that fixes CSP in the generated HTML.
 *
 * The site is served as static files on Vercel, so the browser reads its CSP
 * from the `<meta http-equiv="Content-Security-Policy">` tag Astro injects
 * into every page. This integration rewrites that tag after build.
 *
 * ## 1. Strips style hashes from meta tags
 *
 * When you write `style="font-family: 'Poppins'"` on an HTML element, the
 * browser needs CSP permission to apply it. There are two ways to allow this:
 *
 *   - `'unsafe-inline'` — blanket-allow all inline styles
 *   - hashes — allow only specific style content by its SHA-256 hash
 *
 * The CSP spec says: if any hash is present in `style-src`, the browser
 * ignores `'unsafe-inline'` entirely. This is intentional — hashes are meant
 * to be a stricter replacement, not a supplement.
 *
 * Astro's `security.csp` automatically computes hashes for `<style>` blocks
 * it generates and adds them to `style-src`. The moment those hashes appear,
 * the browser switches to "hash mode" and ignores `'unsafe-inline'`.
 *
 * But hashes only work for `<style>` blocks, not for `style=` attributes on
 * elements. This site has 300+ `style=` attributes plus Motion animations
 * that set `element.style` at runtime, all of which need `'unsafe-inline'`.
 * This integration removes the style hashes from the CSP meta tag after build
 * so `'unsafe-inline'` is respected again.
 *
 * ## 2. Adds missing script hashes to meta tags
 *
 * Astro's `security.csp` does not hash `is:inline` scripts (e.g. the theme
 * script and image fallback handlers). This integration computes SHA-256
 * hashes for ALL inline scripts in each HTML file and ensures they're present
 * in the `script-src` directive.
 */
// External script domains needed for analytics (GA4)
const EXTERNAL_SCRIPT_DOMAINS = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
];

export default function cspStyleFix(): AstroIntegration {
  return {
    name: "csp-style-fix",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const distPath = fileURLToPath(dir);
        const htmlFiles: string[] = [];

        for await (const entry of glob("**/*.html", { cwd: distPath })) {
          htmlFiles.push(`${distPath}${entry}`);
        }

        for (const file of htmlFiles) {
          const html = await readFile(file, "utf-8");

          // Collect SHA-256 hashes of ALL inline scripts in the page
          const scriptHashes = new Set<string>();
          const scriptRegex =
            /<script(?:\s[^>]*)?>(?!\s*$)([\s\S]*?)<\/script>/gi;
          let scriptMatch;
          while ((scriptMatch = scriptRegex.exec(html)) !== null) {
            const content = scriptMatch[1];
            if (content.trim()) {
              const hash = createHash("sha256")
                .update(content)
                .digest("base64");
              scriptHashes.add(`'sha256-${hash}'`);
            }
          }

          let updated = html;

          // Strip style hashes so 'unsafe-inline' is respected
          updated = updated.replace(
            /(<meta\s+http-equiv="content-security-policy"\s+content="[^"]*)(style-src\s)([^;]*)(;[^"]*")/g,
            (_match, before, directive, value, after) => {
              const cleaned = value
                .replace(/'sha(256|384|512)-[A-Za-z0-9+/=]+'/g, "")
                .replace(/\s+/g, " ")
                .trim();
              return `${before}${directive}${cleaned}${after}`;
            },
          );

          // Ensure all script hashes and external domains are in script-src
          updated = updated.replace(
            /(<meta\s+http-equiv="content-security-policy"\s+content="[^"]*)(script-src\s)([^;]*)(;[^"]*")/g,
            (_match, before, directive, value, after) => {
              const existingHashes = new Set(
                value.match(/'sha256-[A-Za-z0-9+/=]+'/g) || [],
              );
              const missingHashes: string[] = [];
              for (const hash of scriptHashes) {
                if (!existingHashes.has(hash)) {
                  missingHashes.push(hash);
                }
              }
              const missingDomains = EXTERNAL_SCRIPT_DOMAINS.filter(
                (d) => !value.includes(d),
              );
              const additions = [...missingDomains, ...missingHashes];
              if (additions.length > 0) {
                return `${before}${directive}${value} ${additions.join(" ")}${after}`;
              }
              return `${before}${directive}${value}${after}`;
            },
          );

          if (updated !== html) {
            await writeFile(file, updated);
          }
        }
      },
    },
  };
}
