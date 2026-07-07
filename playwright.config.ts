import { defineConfig } from "@playwright/test";

const site = process.env.SITE || "fusion";

const buildCommand =
  site === "fusion" ? "npm run build:fusion" : "npm run build:ipor";

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `${buildCommand} && npx serve dist -l 4567`,
    port: 4567,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "fusion",
      testDir: "./tests/visual/fusion",
      use: {
        baseURL: "http://localhost:4567",
        browserName: "chromium",
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "ipor",
      testDir: "./tests/visual/ipor",
      use: {
        baseURL: "http://localhost:4567",
        browserName: "chromium",
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
