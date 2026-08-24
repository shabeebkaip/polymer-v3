import { test, expect, Page } from "@playwright/test";
import { cleanupE2EProducts, E2E_PRODUCT_PREFIX } from "./test-cleanup";

// Milestone 1 (T1.1 + T1.2) regression coverage for the Quick Add modal shell.
// Credentials: QA staging seller account (MEMORY: project_test_accounts).
const EMAIL = "qa.seller.01@test.com";
const PASSWORD = "QaTest@123#";

async function login(page: Page) {
  await page.goto("/auth/login");
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/user\/dashboard/, { timeout: 15000 });
}

// ponytail: app/user/layout.tsx renders {children} twice (separate desktop/mobile
// trees, one hidden via CSS per breakpoint) — pre-existing, unrelated to this
// feature. All locators below must scope to the visible copy or interactions
// silently hit an off-screen/hidden duplicate.
function visible(page: Page, selector: string) {
  return page.locator(selector).locator("visible=true").first();
}

async function gotoProducts(page: Page) {
  await page.goto("/user/products");
  await page.locator("h1:visible", { hasText: "My Products" }).first().waitFor({ state: "visible" });
}

test.describe("Quick Add modal — Milestone 1 shell", () => {
  // W2 (docs/PROJECT_PLAN.md §16): delete any E2E_PRODUCT_PREFIX-tagged
  // products this test created, via the seller's own token — self-cleaning.
  test.afterEach(async ({ page }) => {
    await cleanupE2EProducts(page);
  });

  test("Add New Product opens the modal with no page navigation", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    const urlBefore = page.url();
    let navCount = 0;
    page.on("framenavigated", (frame) => { if (frame === page.mainFrame()) navCount++; });

    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();

    expect(page.url()).toBe(urlBefore);
    expect(navCount).toBe(0);
  });

  test("empty-state Add Your First Product opens the same modal and restores focus to itself (not the header trigger)", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    // Only meaningful when the seller truly has zero products (qa.seller.01 is seeded empty).
    const emptyState = page.getByText("No products yet");
    if (await emptyState.count() === 0) test.skip(true, "Seller account is not empty — cannot exercise empty-state CTA");

    const emptyTrigger = visible(page, 'button:has-text("Add Your First Product")');
    const headerTrigger = visible(page, 'button:has-text("Quick Add")');
    await emptyTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Quick add product")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByText("Quick add product")).toHaveCount(0);
    await expect(emptyTrigger).toBeFocused();
    const headerWronglyFocused = await headerTrigger.evaluate((el) => el === document.activeElement);
    expect(headerWronglyFocused).toBe(false);
  });

  test("focus moves into the modal on open", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();
    await page.waitForTimeout(200);

    const focusedInsideDialog = await page.evaluate(() => {
      const dialog = document.querySelector('[data-slot="dialog-content"]');
      return !!dialog && dialog.contains(document.activeElement);
    });
    expect(focusedInsideDialog).toBe(true);
  });

  test("focus is trapped inside the dialog across repeated Tab presses", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();
    await page.waitForTimeout(200);

    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
    }
    const stillInside = await page.evaluate(() => {
      const dialog = document.querySelector('[data-slot="dialog-content"]');
      return !!dialog && dialog.contains(document.activeElement);
    });
    expect(stillInside).toBe(true);
  });

  test("Escape closes the modal", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByText("Quick add product")).toHaveCount(0);
  });

  // Was a KNOWN BUG (qa-engineer, Milestone 1): focus did not return to the
  // "Add New Product" trigger on any close path. Fixed by frontend-developer
  // via an explicit onCloseAutoFocus handler in app/user/products/page.tsx
  // (Radix only auto-restores focus via DialogTrigger; these two triggers are
  // plain buttons). Verified fixed across all three close paths below — do
  // not soften these assertions, they guard a real accessibility regression.
  test("Escape close restores focus to the Add New Product trigger", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    const trigger = visible(page, 'button:has-text("Quick Add")');
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Quick add product")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByText("Quick add product")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("X close button closes the modal and restores focus to the trigger", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    const trigger = visible(page, 'button:has-text("Quick Add")');
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Quick add product")).toBeVisible();
    await visible(page, 'button:has-text("Close")').click();
    await expect(page.getByText("Quick add product")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("backdrop click closes the modal and restores focus to the trigger", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    const trigger = visible(page, 'button:has-text("Quick Add")');
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Quick add product")).toBeVisible();
    // Real user click, not synthetic — a click in the same tick as open is a
    // separate Radix "ignore the click that just opened me" guard, not a bug.
    await page.mouse.click(5, 5);
    await expect(page.getByText("Quick add product")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("underlying page scroll is locked while modal is open", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();
    const locked = await page.evaluate(() => document.body.getAttribute("data-scroll-locked"));
    expect(locked).toBe("1");
  });

  test("marketing hero and old full-screen success view are gone", async ({ page }) => {
    await login(page);
    await gotoProducts(page);
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();
    const text = await page.locator('[data-slot="dialog-content"]').innerText();
    expect(text).not.toMatch(/boost visibility/i);
    expect(text).not.toMatch(/Complete Details/i);
  });

  test("mobile viewport (375px): dialog goes full-screen", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page);
    await gotoProducts(page);
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();
    await page.waitForTimeout(200);
    const box = await page.locator('[data-slot="dialog-content"]').boundingBox();
    expect(box?.width).toBe(375);
    expect(box?.height).toBe(667);
  });

  test("320px width: dialog itself does not overflow and submit is reachable", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await login(page);
    await gotoProducts(page);
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();
    await page.waitForTimeout(200);

    const dims = await page.evaluate(() => {
      const dc = document.querySelector('[data-slot="dialog-content"]') as HTMLElement;
      return { scrollWidth: dc.scrollWidth, clientWidth: dc.clientWidth };
    });
    expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 1);

    const submitBtn = visible(page, 'button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test("rapid open/close/open cycles leave no stray dialogs and no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await login(page);
    await gotoProducts(page);
    const trigger = visible(page, 'button:has-text("Quick Add")');
    for (let i = 0; i < 5; i++) {
      await trigger.click();
      await expect(page.getByText("Quick add product")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByText("Quick add product")).toHaveCount(0);
    }
    expect(await page.locator('[data-slot="dialog-content"]').count()).toBe(0);
    expect(errors).toEqual([]);
  });

  test("duplicate submit guard: rapid double-click creates exactly one product", async ({ page }) => {
    const createCalls: string[] = [];
    page.on("request", (req) => {
      if (req.method() === "POST" && req.url().includes("/product/create")) createCalls.push(req.url());
    });
    await login(page);
    await gotoProducts(page);
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();

    // Tag the created product for cleanup (test doesn't otherwise care about the name).
    await visible(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]').fill(`${E2E_PRODUCT_PREFIX}Duplicate Submit Guard`);
    await visible(page, 'button:has-text("Search and select polymer types")').click();
    await page.waitForTimeout(200);
    await page.locator('div.absolute.z-50 button').locator("visible=true").first().click();
    await visible(page, "button:has-text('Done')").click();

    const submitBtn = visible(page, 'button[type="submit"]');
    await Promise.all([submitBtn.click(), submitBtn.click()]);
    await page.waitForTimeout(2000);

    expect(createCalls.length).toBe(1);
  });

  test("regression: legacy /user/products/add still renders Quick Add usably", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await login(page);
    await page.goto("/user/products/add");
    await expect(visible(page, "text=Polymer Types")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("regression: detailed Add Edit Product form still enforces required fields", async ({ page }) => {
    await login(page);
    await page.goto("/user/products/add");
    await visible(page, 'button:has-text("Add Detailed Product")').click();
    await visible(page, 'button:has-text("Create Product")').click();
    await page.waitForTimeout(500);
    const errorCount = await page.locator("text=/is required/i").count();
    expect(errorCount).toBeGreaterThan(0);
  });
});
