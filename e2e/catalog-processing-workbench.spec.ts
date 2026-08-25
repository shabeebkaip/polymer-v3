import { expect, Page, test } from "@playwright/test";

async function authenticateWithoutCredentials(page: Page) {
  const baseURL = String(test.info().project.use.baseURL);
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  await page.context().addCookies([
    { name: "token", value: `e2e.${payload}.signature`, url: baseURL },
    {
      name: "userInfo",
      value: JSON.stringify({ user_type: "seller", firstName: "Workbench seller" }),
      url: baseURL,
    },
  ]);
}

async function mockReferenceLists(page: Page) {
  await page.route(/\/(chemical-family|product-family|polymer-type|industry|physical-form|grade|incoterm|payment-terms|packaging-type)\/list(?:\?.*)?$/, route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: true, data: [] }),
  }));
}

test("catalogue workbench shows truthful stage context and can minimise, reopen, and stop", async ({ page }) => {
  await authenticateWithoutCredentials(page);
  await mockReferenceLists(page);

  let parseRequests = 0;
  await page.route("**/ai/parse", route => {
    parseRequests += 1;
    return route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({
        sessionId: "workbench-session",
        status: "processing",
        stage: "uploaded",
        createdAt: new Date().toISOString(),
      }),
    });
  });
  await page.route("**/ai/session/workbench-session", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      sessionId: "workbench-session",
      status: "processing",
      stage: "extracting",
    }),
  }));

  await page.goto("/user/products/add?mode=advanced");
  const dropzone = page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first();
  await dropzone.locator('input[type="file"]').setInputFiles({
    name: "Long Advanced PP Technical Data Sheet 110IS.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 deterministic fixture"),
  });

  const dialog = page.getByRole("dialog", { name: "Preparing your catalogue" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription("You can keep filling the form while we prepare the file for review.");
  await expect(dialog).toContainText("Long Advanced PP Technical Data Sheet 110IS.pdf");
  await expect(dialog).toContainText("PDF · 1 KB");
  await expect(dialog.getByText(/^Elapsed 00:/)).toBeVisible();
  const progressbar = dialog.getByRole("progressbar");
  await expect(progressbar).toBeVisible();
  await expect(progressbar).toHaveAttribute("aria-valuemin", "0");
  await expect(progressbar).toHaveAttribute("aria-valuemax", "100");
  await expect(progressbar).toHaveAttribute("aria-valuenow", "30");
  await expect(dialog.getByText("Reading the document")).toBeVisible();
  await expect(dialog).toContainText("Keep working—nothing is applied until you review it.");
  await expect(dialog).not.toContainText("What happens next?");
  await expect(dialog).not.toContainText("Almost done");
  await expect(dialog).not.toContainText("Continue in background");
  await expect(dialog).not.toContainText("Current activity");
  await expect(dialog.locator(".animate-spin")).toHaveCount(0);

  await dialog.getByRole("button", { name: "Keep filling the form" }).click();
  await expect(dialog).toBeHidden();

  const task = page.getByRole("complementary", { name: "Background catalogue task" });
  await expect(task).toBeVisible();
  await expect(page.locator("#productName")).toBeFocused();
  await expect(task).toContainText("Reading the document");
  await expect(task.getByRole("button", { name: "View progress" })).toBeVisible();
  await expect(task.getByRole("button", { name: "Replace file" })).toBeVisible();
  await expect(task.getByRole("button", { name: "Stop" })).toBeVisible();

  await task.locator('input[type="file"]').setInputFiles({
    name: "unsupported.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not a supported catalogue"),
  });
  await expect(task.getByRole("alert")).toContainText("Accepted: PDF, XLSX, XLS, CSV, JPG, PNG, WEBP, GIF");
  expect(parseRequests).toBe(1);
  await expect(task).toBeVisible();

  const viewProgress = task.getByRole("button", { name: "View progress" });
  await viewProgress.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close and keep processing" }).click();
  await expect(task).toBeVisible();
  await expect(viewProgress).toBeFocused();

  await viewProgress.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(task).toBeVisible();
  await expect(viewProgress).toBeFocused();

  await viewProgress.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Stop import" }).click();
  const confirmation = page.getByRole("dialog", { name: "Stop this import?" });
  await expect(confirmation).toContainText("Processing may continue on the server for a short time.");
  await confirmation.getByRole("button", { name: "Stop import" }).click();
  await expect(dialog).toBeHidden();
  await expect(task).toBeHidden();
});

test("unknown processing stage stays generic rather than inventing progress", async ({ page }) => {
  await authenticateWithoutCredentials(page);
  await mockReferenceLists(page);

  await page.route("**/ai/parse", route => route.fulfill({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({ sessionId: "legacy-session", status: "processing" }),
  }));
  await page.route("**/ai/session/legacy-session", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ sessionId: "legacy-session", status: "processing", stage: "made-up-stage" }),
  }));

  await page.goto("/user/products/add?mode=advanced");
  await page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first().locator('input[type="file"]').setInputFiles({
    name: "legacy.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 deterministic fixture"),
  });

  const dialog = page.getByRole("dialog", { name: "Preparing your catalogue" });
  // The accepted 202 truthfully completes only Upload received. The unknown
  // poll stage must not invent a named current server boundary — the bar
  // stays at the "uploaded" baseline instead of guessing further progress.
  const progressbar = dialog.getByRole("progressbar");
  await expect(progressbar).toHaveAttribute("aria-valuenow", "10");
  await expect(dialog.getByText("Processing your catalogue")).toBeVisible();
  await expect(dialog).not.toContainText("Almost done");
});
