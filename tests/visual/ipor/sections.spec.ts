import { test, expect } from "@playwright/test";

test.setTimeout(60_000);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("cookie_consent", "declined");
  });
});

const sections = [
  { name: "hero", selector: "section" },
  { name: "footer", selector: "footer" },
];

async function hideNav(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: "#main-nav { display: none !important; }",
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
}
