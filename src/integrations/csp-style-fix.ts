import type { AstroIntegration } from "astro";
import { createHash } from "node:crypto";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

/**
 * Post-build Astro integration that fixes CSP across meta tags and HTTP headers.
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
 * it generates (the CSS bundled from .astro and .css files) and adds them to
 * `style-src`. The moment those hashes appear, the browser switches to "hash
 * mode" and ignores `'unsafe-inline'`.
 *
 * But hashes only work for `<style>` blocks, not for `style=` attributes on
 * elements. There's no way to hash `style="font-family: 'Poppins'"` on a
 * `<div>` — the browser simply blocks it.
 *
 * This site has 300+ `style=` attributes plus Motion animations that set
 * `element.style` at runtime. These all need `'unsafe-inline'` to work. But
 * Astro's auto-generated hashes cause the browser to ignore it.
 *
 * The fix: this integration removes the style hashes from the CSP meta tag
 * after build. Without hashes, `'unsafe-inline'` is respected again, and both
 * `<style>` blocks and `style=` attributes work.
 *
 * ## 2. Adds missing script hashes to meta tags
 *
 * Astro's `security.csp` does not hash `is:inline` scripts (e.g. theme
 * script, image fallback handlers). This integration computes SHA-256 hashes
 * for ALL inline scripts in each HTML file and ensures they're present in the
 * `script-src` directive.
 *
 * ## 3. Syncs script hashes to HTTP header YAML files
 *
 * The `customHttp.yml` file defines CSP HTTP headers for AWS Amplify.
 * These can't use `'unsafe-inline'` for script-src because the meta tag's
 * hash-based CSP is the strict layer and both must pass. Instead, this
 * integration collects ALL unique script hashes across all pages and writes
 * them into the YAML file's `script-src`.
 * The hashes are deterministic from source code, so the YAML stays stable.
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

        // Collect ALL unique script hashes across all pages (for HTTP headers)
        const allScriptHashes = new Set<string>();

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
              allScriptHashes.add(`'sha256-${hash}'`);
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

        // Persist this site's hashes, then rebuild YAML from all sites' hashes
        const site = process.env.SITE || "fusion";
        const root = process.cwd();
        await writeFile(
          resolve(root, `.csp-hashes-${site}.json`),
          JSON.stringify([...allScriptHashes].sort()),
        );

        // Read all per-site hash files and union them
        const files = await readdir(root);
        const unionHashes = new Set<string>();
        for (const f of files) {
          if (f.startsWith(".csp-hashes-") && f.endsWith(".json")) {
            const hashes: string[] = JSON.parse(
              await readFile(resolve(root, f), "utf-8"),
            );
            for (const h of hashes) unionHashes.add(h);
          }
        }

        const sortedHashes = [...unionHashes].sort();
        const scriptSrcValue = `'self' ${EXTERNAL_SCRIPT_DOMAINS.join(" ")} ${sortedHashes.join(" ")}`;
        const yamlFile = resolve(root, "customHttp.yml");
        const yaml = await readFile(yamlFile, "utf-8");
        const updated = yaml.replace(
          /(script-src\s)[^;"]*/,
          `$1${scriptSrcValue}`,
        );
        if (updated !== yaml) {
          await writeFile(yamlFile, updated);
        }
      },
    },
  };
}
