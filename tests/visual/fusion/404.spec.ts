import { test, expect } from "@playwright/test";

test.setTimeout(60_000);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("cookie_consent", "declined");
  });
});

test("404 page - light mode", async ({ page }) => {
  await page.goto("/this-page-does-not-exist", { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot("404-light.png", {
    maxDiffPixelRatio: 0.01,
  });
});

test("404 page - dark mode", async ({ page }) => {
  await page.goto("/this-page-does-not-exist", { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.waitForTimeout(500);
  await expect(page).toHaveScreenshot("404-dark.png", {
    maxDiffPixelRatio: 0.01,
  });
});
