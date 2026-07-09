import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = __dirname;

/**
 * The site's CSP lives in astro.config.mjs (`security.csp`) and is emitted as
 * a `<meta http-equiv>` tag on every page — the enforcement layer for the
 * static site on Vercel. `script-src` is managed by Astro internally
 * (hashes generated at build time from `scriptDirective`), so we assert
 * against the config, the single source of truth.
 */
const config = readFileSync(resolve(root, "astro.config.mjs"), "utf-8");

/** Values of a directive in the `directives: [...]` array. */
function directive(name: string): string[] {
  const block = config.match(/directives:\s*\[([\s\S]*?)\]/);
  if (!block) throw new Error("No directives array found in astro config");
  for (const m of block[1].matchAll(/"([^"]+)"/g)) {
    const [n, ...values] = m[1].split(/\s+/);
    if (n === name) return values;
  }
  return [];
}

/** Resources of scriptDirective / styleDirective. */
function resources(key: "scriptDirective" | "styleDirective"): string[] {
  const block = config.match(
    new RegExp(`${key}\\s*:\\s*\\{[\\s\\S]*?resources:\\s*\\[([\\s\\S]*?)\\]`),
  );
  if (!block) throw new Error(`No ${key}.resources found in astro config`);
  return [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

describe("CSP base directives", () => {
  it("has default-src 'self'", () => {
    expect(directive("default-src")).toEqual(["'self'"]);
  });

  it("has font-src allowing self-hosted fonts", () => {
    expect(directive("font-src")).toEqual(["'self'"]);
  });

  it("blocks plugins with object-src 'none'", () => {
    expect(directive("object-src")).toEqual(["'none'"]);
  });

  it("has img-src allowing self and data: URIs", () => {
    expect(directive("img-src")).toContain("'self'");
    expect(directive("img-src")).toContain("data:");
  });

  it("restricts frame-src to trusted embed hosts", () => {
    // Embedded tweets render inside a platform.twitter.com iframe; no other
    // framing is allowed.
    expect(directive("frame-src")).toEqual([
      "https://platform.twitter.com",
      "https://twitter.com",
    ]);
  });

  it("does not reference stale origins", () => {
    expect(config).not.toContain("ipregistry.co");
    expect(config).not.toContain("assets.mainnet.ipor.io");
  });
});

describe("script-src hardening", () => {
  it("script resources include 'self'", () => {
    expect(resources("scriptDirective")).toContain("'self'");
  });

  it("script resources never use 'unsafe-inline'", () => {
    // Astro adds per-script SHA-256 hashes; unsafe-inline would defeat them.
    expect(resources("scriptDirective")).not.toContain("'unsafe-inline'");
  });

  it("allows GA4 analytics script domains", () => {
    const script = resources("scriptDirective");
    expect(script).toContain("https://www.googletagmanager.com");
    expect(script).toContain("https://www.google-analytics.com");
  });
});

describe("style-src", () => {
  it("allows inline styles for the 300+ style= attributes", () => {
    const style = resources("styleDirective");
    expect(style).toContain("'self'");
    expect(style).toContain("'unsafe-inline'");
  });
});

describe("analytics connectivity", () => {
  it("allows GA4 connect + img endpoints", () => {
    expect(directive("connect-src")).toContain(
      "https://*.google-analytics.com",
    );
    expect(directive("img-src")).toContain("https://www.google-analytics.com");
  });
});
