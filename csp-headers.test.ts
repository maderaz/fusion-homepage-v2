import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = __dirname;

/** Extract the CSP header value from a customHttp YAML file. */
function extractCspFromYaml(filePath: string): string {
  const content = readFileSync(filePath, "utf-8");
  const match = content.match(
    /key:\s*'Content-Security-Policy'\s*\n\s*value:\s*"([^"]+)"/,
  );
  if (!match) throw new Error(`No CSP header found in ${filePath}`);
  return match[1];
}

/**
 * Extract CSP directives from astro.config.mjs.
 *
 * Parses the `directives` array and `styleDirective.resources` array.
 * Note: Astro manages `script-src` internally (auto-generates hashes),
 * so it cannot be declared in the config. The build step in
 * `csp-style-fix.ts` syncs the generated hashes to the YAML files.
 */
function extractDirectivesFromAstroConfig(
  filePath: string,
): Map<string, string[]> {
  const content = readFileSync(filePath, "utf-8");

  const directivesBlock = content.match(/directives:\s*\[([\s\S]*?)\]/);
  if (!directivesBlock)
    throw new Error("No directives array found in astro config");

  const directives = new Map<string, string[]>();
  for (const m of directivesBlock[1].matchAll(/"([^"]+)"/g)) {
    const [name, ...values] = m[1].split(/\s+/);
    directives.set(name, values.sort());
  }

  const styleBlock = content.match(
    /styleDirective:\s*\{[\s\S]*?resources:\s*\[([\s\S]*?)\]/,
  );
  if (!styleBlock)
    throw new Error("No styleDirective.resources found in astro config");

  const styleResources: string[] = [];
  for (const m of styleBlock[1].matchAll(/"([^"]+)"/g)) {
    styleResources.push(m[1]);
  }
  directives.set("style-src", styleResources.sort());

  return directives;
}

/** Parse a CSP string into a Map of directive → sorted values. */
function parseCsp(csp: string): Map<string, string[]> {
  const directives = new Map<string, string[]>();
  for (const part of csp.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [name, ...values] = trimmed.split(/\s+/);
    directives.set(name, values.sort());
  }
  return directives;
}

const csp = extractCspFromYaml(resolve(root, "customHttp.yml"));
const astroDirectives = extractDirectivesFromAstroConfig(
  resolve(root, "astro.config.mjs"),
);

const directives = parseCsp(csp);

describe("CSP alignment across all sources", () => {
  it("YAML directives match astro config (excluding script-src)", () => {
    // Astro manages script-src internally — hashes are generated at build
    // time and synced to YAML by csp-style-fix.ts. Compare all other
    // directives for exact equality.
    for (const [name, astroValues] of astroDirectives) {
      expect(directives.get(name), `${name}`).toEqual(astroValues);
    }
    for (const [name] of directives) {
      if (name === "script-src") continue;
      expect(astroDirectives.has(name), `astro config missing ${name}`).toBe(
        true,
      );
    }
  });
});

describe("script-src uses hashes, not unsafe-inline", () => {
  it("script-src has SHA-256 hashes", () => {
    const values = directives.get("script-src") ?? [];
    const hashes = values.filter((v) => v.startsWith("'sha256-"));
    expect(hashes.length).toBeGreaterThan(0);
  });

  it("script-src does not use unsafe-inline", () => {
    const values = directives.get("script-src") ?? [];
    expect(values).not.toContain("'unsafe-inline'");
  });

  it("script-src includes 'self'", () => {
    const values = directives.get("script-src") ?? [];
    expect(values).toContain("'self'");
  });
});

describe("CSP content correctness", () => {
  it("has font-src allowing self-hosted fonts", () => {
    expect(directives.get("font-src")).toContain("'self'");
  });

  it("has img-src allowing data: URIs", () => {
    expect(directives.get("img-src")).toContain("data:");
  });

  it("restricts frame-src to trusted embed hosts", () => {
    // Embedded tweets render inside a platform.twitter.com iframe; no other
    // framing is allowed.
    expect(directives.get("frame-src")).toEqual([
      "https://platform.twitter.com",
      "https://twitter.com",
    ]);
  });

  it("blocks plugins with object-src 'none'", () => {
    expect(directives.get("object-src")).toEqual(["'none'"]);
  });

  it("has default-src 'self'", () => {
    expect(directives.get("default-src")).toEqual(["'self'"]);
  });

  it("does not reference stale origins", () => {
    expect(csp).not.toContain("ipregistry.co");
    expect(csp).not.toContain("assets.mainnet.ipor.io");
  });

  it("allows GA4 analytics domains", () => {
    expect(directives.get("script-src")).toContain(
      "https://www.googletagmanager.com",
    );
    expect(directives.get("script-src")).toContain(
      "https://www.google-analytics.com",
    );
    expect(directives.get("connect-src")).toContain(
      "https://*.google-analytics.com",
    );
    expect(directives.get("img-src")).toContain(
      "https://www.google-analytics.com",
    );
  });
});
