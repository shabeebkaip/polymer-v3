import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:3000",
    // ponytail: local port 3000 is routinely already occupied by a running
    // `pnpm run dev` instance in this environment, so always reuse it
    // instead of gating on !process.env.CI. Revisit once CI wiring exists.
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
