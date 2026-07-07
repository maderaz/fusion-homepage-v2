import { test, expect } from "@playwright/test";

test.setTimeout(60_000);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("cookie_consent", "declined");
  });
});

test("404 page", async ({ page }) => {
  await page.goto("/this-page-does-not-exist", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot("404.png", {
    maxDiffPixelRatio: 0.01,
  });
});
