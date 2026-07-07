import { test, expect } from "@playwright/test";

test.setTimeout(60_000);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("cookie_consent", "declined");
  });
});

test("nav - light mode", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  const nav = page.locator("#main-nav");
  await expect(nav).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(500);
  await expect(nav).toHaveScreenshot("nav-light.png", {
    maxDiffPixelRatio: 0.01,
  });
});

test("nav - dark mode", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const nav = page.locator("#main-nav");
  await expect(nav).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(500);
  await expect(nav).toHaveScreenshot("nav-dark.png", {
    maxDiffPixelRatio: 0.01,
  });
});
