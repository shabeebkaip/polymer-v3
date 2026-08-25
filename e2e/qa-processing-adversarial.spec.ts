import { expect, Page, test } from "@playwright/test";

async function authenticateWithoutCredentials(page: Page) {
  const baseURL = String(test.info().project.use.baseURL);
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  await page.context().addCookies([
    { name: "token", value: `e2e.${payload}.signature`, url: baseURL },
    {
      name: "userInfo",
      value: JSON.stringify({ user_type: "seller", firstName: "Processing QA seller" }),
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

async function upload(page: Page, name = "qa-catalogue.pdf") {
  await page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first().locator('input[type="file"]').setInputFiles({
    name,
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 deterministic QA fixture"),
  });
}

test.beforeEach(async ({ page }) => {
  await authenticateWithoutCredentials(page);
  await mockReferenceLists(page);
});

test("poll jump completes the progress bar without presenting skipped stages as current and elapsed ticks stay out of live output", async ({ page }) => {
  await page.addInitScript(() => {
    const observed: string[] = [];
    (window as typeof window & { __qaObservedPercents: string[] }).__qaObservedPercents = observed;
    new MutationObserver(() => {
      document.querySelectorAll('[role="progressbar"]').forEach(element => {
        const value = element.getAttribute("aria-valuenow");
        if (value && !observed.includes(value)) observed.push(value);
      });
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-valuenow"] });
  });

  await page.route("**/ai/parse", route => route.fulfill({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({ sessionId: "jump-session", status: "processing", stage: "uploaded", createdAt: new Date().toISOString() }),
  }));
  let polls = 0;
  await page.route("**/ai/session/jump-session", route => {
    polls += 1;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ sessionId: "jump-session", status: "processing", stage: polls === 1 ? "preparing" : "extracting" }),
    });
  });

  await page.goto("/user/products/add?mode=advanced");
  await upload(page);

  const dialog = page.getByRole("dialog", { name: "Preparing your catalogue" });
  const progressbar = dialog.getByRole("progressbar");
  await expect(progressbar).toHaveAttribute("aria-valuemin", "0");
  await expect(progressbar).toHaveAttribute("aria-valuemax", "100");
  // First poll jumps straight from "uploaded" to "preparing" — the bar must
  // reflect that real stage immediately, not step through the skipped ones.
  await expect(progressbar).toHaveAttribute("aria-valuenow", "95");
  await expect(dialog.getByText("Preparing your review")).toBeVisible();

  const status = page.locator('[role="status"][aria-atomic="true"][id$="-catalogue-status"]');
  await expect(status).toHaveText("Preparing your review. Organising the result for you to check.");
  const liveBeforeTick = await status.textContent();
  const elapsed = dialog.getByText(/^Elapsed 00:/);
  const elapsedBefore = await elapsed.textContent();
  await expect.poll(async () => elapsed.textContent(), { timeout: 2_500 }).not.toBe(elapsedBefore);
  await expect(status).toHaveText(liveBeforeTick ?? "");
  await expect(status).not.toContainText("Elapsed");

  await expect.poll(() => polls, { timeout: 5_500 }).toBeGreaterThanOrEqual(2);
  // Second poll regresses to "extracting" (an earlier stage) — the monotonic
  // guard in useAiProcessing must keep the bar/status pinned at "preparing".
  await expect(progressbar).toHaveAttribute("aria-valuenow", "95");
  await expect(dialog.getByText("Preparing your review")).toBeVisible();
  const observed = await page.evaluate(() => (window as typeof window & { __qaObservedPercents: string[] }).__qaObservedPercents);
  // The skipped intermediate stages (extracting=30, analysing=55, matching=80)
  // must never have been rendered as the current percentage.
  expect(observed).not.toContain("30");
  expect(observed).not.toContain("55");
  expect(observed).not.toContain("80");
});

test("compact progress-bar workbench reflows at 320, 375, desktop, and 200-percent equivalent without congestion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/ai/parse", route => route.fulfill({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({ sessionId: "responsive-session", status: "processing", stage: "analysing", createdAt: new Date().toISOString() }),
  }));
  await page.route("**/ai/session/responsive-session", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ sessionId: "responsive-session", status: "processing", stage: "analysing" }),
  }));

  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/user/products/add?mode=advanced");
  await upload(page, "بيانات-البوليمر-Long-Latin-Grade-110IS-document.pdf");

  const dialog = page.getByRole("dialog", { name: "Preparing your catalogue" });
  const progressbar = dialog.getByRole("progressbar");
  await expect(progressbar).toHaveAttribute("aria-valuenow", "55");
  await expect(dialog.getByText("Identifying product data")).toBeVisible();
  await expect(dialog.locator("bdi")).toContainText("بيانات-البوليمر");
  await expect(dialog.locator(".animate-spin")).toHaveCount(0);
  await expect(dialog).not.toContainText("What happens next?");
  await expect(dialog).not.toContainText("Continue in background");
  // prefers-reduced-motion is emulated for this test — Tailwind's
  // `motion-reduce:transition-none` clears `transition-property` so no
  // property animates, regardless of the base `duration-500` value.
  const fillTransitionProperty = await progressbar.locator("> div").evaluate(el => getComputedStyle(el).transitionProperty);
  expect(fillTransitionProperty).toBe("none");

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 375, height: 812 },
    { width: 640, height: 800 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(dialog).toBeVisible();
    const geometry = await dialog.evaluate(element => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      };
    });
    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(viewport.width + 1);
    expect(geometry.top).toBeGreaterThanOrEqual(0);
    expect(geometry.bottom).toBeLessThanOrEqual(viewport.height + 1);
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    for (const action of ["Close and keep processing", "Keep filling the form", "Stop import"]) {
      const button = dialog.getByRole("button", { name: action });
      await expect(button).toBeVisible();
      expect(await button.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    }
    await expect(progressbar).toBeVisible();
    if (viewport.width >= 1024) expect(geometry.width).toBeLessThanOrEqual(562);
  }

  await test.info().attach("m-p-compact-desktop", { body: await page.screenshot(), contentType: "image/png" });
});

test("background completion preserves form focus and requires Review before any extracted value is applied", async ({ page }) => {
  await page.route("**/ai/parse", route => route.fulfill({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({ sessionId: "review-session", status: "processing", stage: "uploaded", createdAt: new Date().toISOString() }),
  }));
  let polls = 0;
  await page.route("**/ai/session/review-session", route => {
    polls += 1;
    const complete = polls >= 2;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(complete ? {
        sessionId: "review-session",
        status: "completed",
        extractionMethod: "text",
        ocrFailed: false,
        products: [{ product: { density: { value: 0.92, confidence: "high" } }, refMatches: {} }],
      } : { sessionId: "review-session", status: "processing", stage: "extracting" }),
    });
  });

  await page.goto("/user/products/add?mode=advanced");
  await upload(page);
  const processingDialog = page.getByRole("dialog", { name: "Preparing your catalogue" });
  await processingDialog.getByRole("button", { name: "Keep filling the form" }).click();
  expect.soft(await page.evaluate(() => document.activeElement?.id)).toBe("productName");
  await page.locator("#productName").focus();
  await page.locator("#productName").fill("Seller draft remains");
  await expect(page.locator("#density")).toHaveCount(0);

  const task = page.getByRole("complementary", { name: "Background catalogue task" });
  await expect(task).toContainText("Catalogue ready to review", { timeout: 6_000 });
  await expect(processingDialog).toBeHidden();
  await expect(page.locator("#productName")).toBeFocused();
  await expect(page.locator("#productName")).toHaveValue("Seller draft remains");
  await expect(task.getByRole("button", { name: "Apply" })).toHaveCount(0);

  await task.getByRole("button", { name: "Review" }).click();
  const reviewDialog = page.getByRole("dialog", { name: "Review extracted fields" });
  await expect(reviewDialog).toBeVisible();
  await expect(page.locator("#density")).toHaveCount(0);
  await reviewDialog.getByRole("button", { name: "Apply 1 field" }).click();
  await page.locator("#advanced-details-toggle").click();
  await page.getByRole("button", { name: /Technical Properties/ }).click();
  await expect(page.locator("#density")).toHaveValue("0.92");
  await expect(page.locator("#productName")).toHaveValue("Seller draft remains");
});

test("background Replace file rejects an unsupported type before superseding the active session", async ({ page }) => {
  let parseCalls = 0;
  await page.route("**/ai/parse", route => {
    parseCalls += 1;
    return route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ sessionId: `replace-session-${parseCalls}`, status: "processing", stage: "uploaded" }),
    });
  });
  await page.route("**/ai/session/**", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ sessionId: route.request().url().split("/").pop(), status: "processing", stage: "extracting" }),
  }));

  await page.goto("/user/products/add?mode=advanced");
  await upload(page);
  await page.getByRole("dialog", { name: "Preparing your catalogue" }).getByRole("button", { name: "Keep filling the form" }).click();
  const task = page.getByRole("complementary", { name: "Background catalogue task" });
  await task.locator('input[type="file"]').setInputFiles({
    name: "unsupported.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not a supported catalogue"),
  });

  await page.waitForTimeout(500);
  expect.soft(parseCalls).toBe(1);
  await expect.soft(task.getByRole("alert")).toContainText("Accepted: PDF, XLSX, XLS, CSV, JPG, PNG, WEBP, GIF", { timeout: 1_000 });
  await expect.soft(page.getByRole("dialog", { name: "Preparing your catalogue" })).toBeHidden();
});
