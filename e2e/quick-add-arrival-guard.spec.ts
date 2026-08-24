import { test, expect, Page } from "@playwright/test";
import { requireE2ECredentials } from "./test-config";
import { cleanupE2EProducts } from "./test-cleanup";

// Regression coverage for the "Back to Quick Add" navigation fix:
// app/user/products/add/page.tsx now routes to /user/products?quickAdd=1
// instead of flipping local `mode` state (which used to strand the seller on
// the legacy full-page Quick Add, still under the sidebar). app/user/products/page.tsx
// reads the one-shot `?quickAdd=1` param, opens the modal, and strips the param.
//
// This file targets the cross-instance arrival guard specifically (QA round,
// 2026-08-24): app/user/layout.tsx mounts {children} TWICE (desktop `md:block
// hidden` + mobile `md:hidden` trees, both always mounted, switched via CSS
// only) so both copies of ProductsPage independently observe the same
// `?quickAdd=1` param. Without the sessionStorage cross-instance guard in
// products/page.tsx, both copies would open their own Dialog (Radix portals to
// document.body regardless of which tree instance opened it) -> two stacked
// "Quick add product" dialogs. Verify exactly one dialog survives, at both a
// desktop and a mobile viewport (both trees exist in the DOM at every width).
const NAME_INPUT = 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]';

async function login(page: Page) {
  const { email, password } = requireE2ECredentials();
  await page.goto("/auth/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/user\/dashboard/, { timeout: 15000 });
}

// ponytail: app/user/layout.tsx renders {children} twice (desktop/mobile trees) —
// pre-existing, unrelated. Scope to the visible copy or interactions hit a hidden dup.
function visible(page: Page, selector: string) {
  return page.locator(selector).locator("visible=true").first();
}
function visibleInDialog(page: Page, selector: string) {
  return page.locator('[data-slot="dialog-content"]').locator(selector).locator("visible=true").first();
}
function dialogContentCount(page: Page) {
  return page.locator('[data-slot="dialog-content"]').count();
}
function dialogTitleCount(page: Page) {
  return page.getByText("Quick add product").count();
}

async function arriveViaFooterLink(page: Page, productName: string) {
  await page.goto("/user/products");
  await visible(page, 'button:has-text("Quick Add")').click();
  await expect(page.getByText("Quick add product")).toBeVisible();
  await visibleInDialog(page, NAME_INPUT).fill(productName);
  await visibleInDialog(page, 'button:has-text("Add Detailed Product")').click();
  await page.waitForURL(/mode=advanced/, { timeout: 10000 });
  await visible(page, 'button:has-text("Back to Quick Add")').click();
  await page.waitForURL(/\/user\/products$/, { timeout: 10000 });
}

test.describe("Back to Quick Add — arrival guard (T2.3-REV/T3.4 follow-up fix)", () => {
  // W2 (docs/PROJECT_PLAN.md §16): no test here actually clicks Create (all
  // stop at "Back to Quick Add"), but this is defensive in case that changes.
  test.afterEach(async ({ page }) => {
    await cleanupE2EProducts(page);
  });

  test("desktop: exactly one dialog, clean URL, no full page reload, values retained", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await login(page);

    let loadEventCount = 0;
    page.on("load", () => loadEventCount++);
    await page.goto("/user/products");
    loadEventCount = 0; // settle after initial nav

    await visible(page, 'button:has-text("Quick Add")').click();
    await visibleInDialog(page, NAME_INPUT).fill("Desktop Arrival Product");
    await visibleInDialog(page, 'button:has-text("Add Detailed Product")').click();
    await page.waitForURL(/mode=advanced/, { timeout: 10000 });

    await page.evaluate(() => { (window as any).__qaMarker = "survived"; });
    await visible(page, 'button:has-text("Back to Quick Add")').click();
    await page.waitForURL(/\/user\/products$/, { timeout: 10000 });
    await page.waitForTimeout(300);

    expect(page.url()).not.toContain("quickAdd");
    expect(await dialogContentCount(page)).toBe(1);
    expect(await dialogTitleCount(page)).toBe(1);
    await expect(visibleInDialog(page, NAME_INPUT)).toHaveValue("Desktop Arrival Product");
    // Real SPA transition, not a hard reload: no `load` event, window state survives.
    expect(loadEventCount).toBe(0);
    expect(await page.evaluate(() => (window as any).__qaMarker)).toBe("survived");
  });

  test("mobile viewport (375px): exactly one dialog, full-screen sheet, values retained", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await login(page);
    await arriveViaFooterLink(page, "Mobile Arrival Product");
    await page.waitForTimeout(300);

    expect(page.url()).not.toContain("quickAdd");
    expect(await dialogContentCount(page)).toBe(1);
    expect(await dialogTitleCount(page)).toBe(1);
    await expect(visibleInDialog(page, NAME_INPUT)).toHaveValue("Mobile Arrival Product");

    const box = await page.locator('[data-slot="dialog-content"]').locator("visible=true").first().boundingBox();
    expect(box?.width).toBeGreaterThan(360); // full-screen sheet, not the desktop-capped card
  });

  test("header 'Add Detailed Product' (no Quick Add typing first) -> Back to Quick Add -> single blank modal", async ({ page }) => {
    await login(page);
    await page.goto("/user/products");
    await page.evaluate(() => sessionStorage.clear());
    await visible(page, 'button:has-text("Add Detailed Product")').click();
    await page.waitForURL(/mode=advanced/, { timeout: 10000 });

    await visible(page, 'button:has-text("Back to Quick Add")').click();
    await page.waitForURL(/\/user\/products$/, { timeout: 10000 });
    await page.waitForTimeout(300);

    expect(await dialogContentCount(page)).toBe(1);
    expect(await dialogTitleCount(page)).toBe(1);
    await expect(visibleInDialog(page, NAME_INPUT)).toHaveValue("");
  });

  test("rapid double-click on Back to Quick Add does not open two dialogs", async ({ page }) => {
    await login(page);
    await page.goto("/user/products");
    await visible(page, 'button:has-text("Quick Add")').click();
    await visibleInDialog(page, NAME_INPUT).fill("DblClick Product");
    await visibleInDialog(page, 'button:has-text("Add Detailed Product")').click();
    await page.waitForURL(/mode=advanced/, { timeout: 10000 });

    const backBtn = visible(page, 'button:has-text("Back to Quick Add")');
    await Promise.all([backBtn.click(), backBtn.click({ force: true }).catch(() => {})]);
    await page.waitForURL(/\/user\/products$/, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(500);

    expect(await dialogContentCount(page)).toBeLessThanOrEqual(1);
  });

  test("browser back/forward around the arrival does not duplicate or re-trigger the dialog", async ({ page }) => {
    await login(page);
    await arriveViaFooterLink(page, "BackButton Product");
    await page.waitForTimeout(300);

    // The ?quickAdd=1 URL was consumed via router.replace, so it's not in
    // history — back should land on the detailed form, not re-show the param.
    await page.goBack();
    await page.waitForTimeout(500);
    expect(page.url()).toContain("mode=advanced");
    expect(await dialogContentCount(page)).toBe(0);

    await page.goForward().catch(() => {});
    await page.waitForTimeout(500);
    expect(page.url()).not.toContain("quickAdd");
    expect(await dialogContentCount(page)).toBeLessThanOrEqual(1);
  });

  test("two consecutive round trips in one session both reopen the modal (T16 item 5)", async ({ page }) => {
    // No prior test exercised the arrival guard's cleanup (`setTimeout(() =>
    // sessionStorage.removeItem(GUARD_KEY), 0)`) twice in the same session — if it
    // silently failed to clear, the second "Back to Quick Add" would stop reopening
    // the modal even though every single-round-trip test above would still pass.
    await login(page);

    await arriveViaFooterLink(page, "Round Trip One");
    await page.waitForTimeout(300);
    expect(page.url()).not.toContain("quickAdd");
    expect(await dialogContentCount(page)).toBe(1);
    expect(await dialogTitleCount(page)).toBe(1);
    await expect(visibleInDialog(page, NAME_INPUT)).toHaveValue("Round Trip One");

    await arriveViaFooterLink(page, "Round Trip Two");
    await page.waitForTimeout(300);
    expect(page.url()).not.toContain("quickAdd");
    expect(await dialogContentCount(page)).toBe(1);
    expect(await dialogTitleCount(page)).toBe(1);
    await expect(visibleInDialog(page, NAME_INPUT)).toHaveValue("Round Trip Two");
  });

  test("direct URL entry /user/products?quickAdd=1 (no draft) opens one blank modal and strips the param", async ({ page }) => {
    await login(page);
    await page.goto("/user/products");
    await page.evaluate(() => sessionStorage.clear());
    await page.goto("/user/products?quickAdd=1");
    await page.waitForTimeout(500);

    expect(page.url()).not.toContain("quickAdd");
    expect(await dialogContentCount(page)).toBe(1);
    expect(await dialogTitleCount(page)).toBe(1);
    await expect(visibleInDialog(page, NAME_INPUT)).toHaveValue("");
  });
});
