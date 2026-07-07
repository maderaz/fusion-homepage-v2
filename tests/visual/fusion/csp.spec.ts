import { test, expect } from "@playwright/test";

const pages = ["/", "/privacy-policy/", "/terms-of-use/"];

for (const path of pages) {
  test(`no CSP violations on ${path}`, async ({ page }) => {
    const cspViolations: string[] = [];

    page.on("console", (msg) => {
      if (
        msg.type() === "error" &&
        msg.text().includes("Content Security Policy")
      ) {
        cspViolations.push(msg.text());
      }
    });

    await page.goto(path, { waitUntil: "networkidle" });

    expect(cspViolations).toEqual([]);
  });
}

test("CSP meta tag is present with hashed scripts", async ({ page }) => {
  await page.goto("/");
  const cspMeta = page.locator('meta[http-equiv="content-security-policy"]');
  await expect(cspMeta).toHaveCount(1);
  const content = await cspMeta.getAttribute("content");
  expect(content).toContain("script-src");
  expect(content).toContain("style-src");

  // script-src must use hashes, not unsafe-inline
  const scriptSrc = content!.match(/script-src\s([^;]+)/)?.[1] ?? "";
  expect(scriptSrc).toContain("sha256-");
  expect(scriptSrc).not.toContain("unsafe-inline");

  // style-src uses unsafe-inline (required for 300+ style= attributes)
  const styleSrc = content!.match(/style-src\s([^;]+)/)?.[1] ?? "";
  expect(styleSrc).toContain("unsafe-inline");
});
