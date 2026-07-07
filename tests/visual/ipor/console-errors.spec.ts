import { test, expect } from "@playwright/test";

const pages = [
  "/",
  "/privacy-policy/",
  "/terms-of-use/",
  "/this-page-does-not-exist",
];

const themes = ["light"] as const;

for (const path of pages) {
  for (const theme of themes) {
    test(`no console errors or warnings on ${path} (${theme} mode)`, async ({
      page,
    }) => {
      const issues: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error" || msg.type() === "warning") {
          const text = msg.text();
          // 404 status is expected on the 404 page
          if (text.includes("status of 404")) return;
          issues.push(`[${msg.type()}] ${text}`);
        }
      });

      page.on("pageerror", (error) => {
        issues.push(`[pageerror] ${error.message}`);
      });

      await page.goto(path, { waitUntil: "networkidle" });

      if (theme === "dark") {
        await page.evaluate(() =>
          document.documentElement.classList.add("dark"),
        );
      } else {
        await page.evaluate(() =>
          document.documentElement.classList.remove("dark"),
        );
      }

      await page.waitForTimeout(500);

      expect(issues).toEqual([]);
    });
  }
}
