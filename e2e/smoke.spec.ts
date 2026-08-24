import { test, expect } from "@playwright/test";

// Infrastructure smoke test only: proves the Playwright harness can boot
// and talk to a running polymer-v3 instance. Not a feature test — see
// qa-engineer specs for Quick Add coverage once that feature lands.
test("homepage renders", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("body")).toBeVisible();
});
