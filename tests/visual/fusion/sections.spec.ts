import { test, expect } from "@playwright/test";

test.setTimeout(60_000);

// Dismiss cookie banner so it doesn't appear in screenshots
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("cookie_consent", "declined");
  });
});

const sections = [
  { name: "hero", selector: "#hero" },
  { name: "transparency-features", selector: "#transparency" },
  { name: "testimonials", selector: "#testimonials" },
  { name: "benefits", selector: "#benefits" },
  { name: "how-it-works", selector: "#how-it-works" },
  { name: "solutions", selector: "#solutions" },
  { name: "trust-bar", selector: "#trust-bar" },
  { name: "comparison-table", selector: "#comparison-table" },
  { name: "security", selector: "#security" },
  { name: "final-cta", selector: "#final-cta" },
  { name: "footer", selector: "footer" },
];

async function hideNav(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: "#main-nav, #menu-backdrop { display: none !important; }",
  });
}

for (const section of sections) {
  test(`${section.name} - light mode`, async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await hideNav(page);
    await page.evaluate(() =>
      document.documentElement.classList.remove("dark"),
    );
    const element = page.locator(section.selector).first();
    await expect(element).toBeVisible({ timeout: 15_000 });
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(element).toHaveScreenshot(`${section.name}-light.png`, {
      maxDiffPixelRatio: 0.01,
    });
  });

  test(`${section.name} - dark mode`, async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await hideNav(page);
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    const element = page.locator(section.selector).first();
    await expect(element).toBeVisible({ timeout: 15_000 });
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(element).toHaveScreenshot(`${section.name}-dark.png`, {
      maxDiffPixelRatio: 0.01,
    });
  });
}
