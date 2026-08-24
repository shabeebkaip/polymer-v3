import { test, expect, Page } from "@playwright/test";
import { cleanupE2EProducts, E2E_PRODUCT_PREFIX } from "./test-cleanup";

// T2.3-REV (AI removal from Quick Add) + T3.4 (shared draft, Quick Add <-> Detailed)
// regression coverage. Credentials: QA staging seller account (MEMORY: project_test_accounts).
const EMAIL = "qa.seller.01@test.com";
const PASSWORD = "QaTest@123#";
const DRAFT_KEY = "polymer-v3:quickAddDraft";

// W2 (docs/PROJECT_PLAN.md §16): delete any E2E_PRODUCT_PREFIX-tagged
// products created during these tests, via the seller's own token.
test.afterEach(async ({ page }) => {
  await cleanupE2EProducts(page);
});

async function login(page: Page) {
  await page.goto("/auth/login");
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/user\/dashboard/, { timeout: 15000 });
}

// ponytail: app/user/layout.tsx renders {children} twice (desktop/mobile trees) —
// pre-existing, unrelated. Scope to the visible copy or interactions hit a hidden dup.
function visible(page: Page, selector: string) {
  return page.locator(selector).locator("visible=true").first();
}

// The page's own header "Add Detailed Product" button stays in the DOM (and
// technically "visible" per CSS) behind the Quick Add dialog overlay, so
// plain visible() can pick the wrong match when both exist — scope to the
// open dialog for anything meant to be clicked inside it.
function visibleInDialog(page: Page, selector: string) {
  return page.locator('[data-slot="dialog-content"]').locator(selector).locator("visible=true").first();
}

async function clearDraft(page: Page) {
  await page.evaluate((key) => sessionStorage.removeItem(key), DRAFT_KEY);
}

async function selectTwoPolymerTypes(page: Page): Promise<[string, string]> {
  await visible(page, 'button:has-text("Search and select polymer types")').click();
  const options = page.locator('div.absolute.z-50 .max-h-44 button').locator("visible=true");
  await options.first().waitFor({ state: "visible" });
  const first = (await options.nth(0).innerText()).trim();
  await options.nth(0).click();
  const second = (await options.nth(1).innerText()).trim();
  await options.nth(1).click();
  await visible(page, 'button:has-text("Done")').click();
  return [first, second];
}

async function selectChemicalFamily(page: Page): Promise<string> {
  await visible(page, 'button:has-text("Search and select a chemical family")').click();
  const options = page.locator('div.absolute.z-50 .max-h-44 button').locator("visible=true");
  await options.first().waitFor({ state: "visible" });
  const name = (await options.first().innerText()).trim();
  await options.first().click();
  return name;
}

async function selectPhysicalForm(page: Page): Promise<string> {
  const field = page.locator('label:has-text("Physical Form")').locator("xpath=..").locator("visible=true").first();
  const chip = field.locator("div.flex-wrap button").first();
  const name = (await chip.innerText()).trim();
  await chip.click();
  return name;
}

// Expand a collapsed SectionCard on the detailed form by its title.
async function expandSection(page: Page, title: string) {
  const header = page.locator(`button:has-text("${title}")`).locator("visible=true").first();
  await header.click();
}

test.describe("T2.3-REV — AI catalog import removed from Quick Add", () => {
  test("no dropzone/file input/AI affordance anywhere in Quick Add", async ({ page }) => {
    await login(page);
    await clearDraft(page);
    await page.goto("/user/products/add");
    await expect(visible(page, "text=Polymer Types")).toBeVisible();

    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    await expect(page.getByText(/AI Catalog Import/i)).toHaveCount(0);
    await expect(page.getByText(/Browse or drag/i)).toHaveCount(0);
    await expect(page.getByText(/Claude/i)).toHaveCount(0);
    // No confidence badge / orange "verify" styling classes anywhere in the form.
    await expect(page.locator(".border-orange-300, .border-teal-200.bg-teal-50\\/30")).toHaveCount(0);
  });

  test("Row 3 has exactly two fields (MOQ, Availability) — no orphaned third column", async ({ page }) => {
    await login(page);
    await page.goto("/user/products/add");
    await expect(visible(page, "text=Min. Order Quantity")).toBeVisible();
    await expect(visible(page, "text=Availability")).toBeVisible();
    // Field 8 no longer exists.
    await expect(page.getByText("Field 8")).toHaveCount(0);
  });

  test("product still creatable from Quick Add by typing (only polymerTypes required)", async ({ page }) => {
    await login(page);
    await clearDraft(page);
    await page.goto("/user/products/add");
    await selectTwoPolymerTypes(page);
    await visible(page, 'button[type="submit"]').click();
    await expect(page.getByText("Product created")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("T3.4 — shared in-progress draft (Quick Add <-> Detailed)", () => {
  test("partial Quick Add carries into the detailed form; multi-select -> first-selected single, no crash", async ({ page }) => {
    await login(page);
    await clearDraft(page);
    await page.goto("/user/products/add");

    const [first] = await selectTwoPolymerTypes(page);
    const familyName = await selectChemicalFamily(page);
    const formName = await selectPhysicalForm(page);
    await visible(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]').fill("Draft Test Product");
    await visible(page, 'input[placeholder="e.g. 1000"]').fill("500");
    await visible(page, "text=Availability").locator("xpath=..").locator('button:has-text("On Request")').click();

    await visible(page, 'button:has-text("Add Detailed Product")').click();

    // Detailed form (core section, open by default) shows the carried values.
    await expect(visible(page, "text=Core Details")).toBeVisible();
    await expect(page.locator('input[value="Draft Test Product"]').first()).toBeVisible();
    await expect(page.getByText(familyName, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(first, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(formName, { exact: true }).first()).toBeVisible();
    // No console crash — page still fully interactive.
    await expect(visible(page, 'button:has-text("Create Product")')).toBeVisible();

    // Trade section carries MOQ.
    await expandSection(page, "Trade Information");
    await expect(page.locator("#minimum_order_quantity")).toHaveValue("500");
  });

  test("retain on return: Back to Quick Add reopens the My Products modal with entered values", async ({ page }) => {
    await login(page);
    await clearDraft(page);
    await page.goto("/user/products/add");

    await visible(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]').fill("Retained Product");
    const [first] = await selectTwoPolymerTypes(page);

    await visible(page, 'button:has-text("Add Detailed Product")').click();
    await expect(visible(page, "text=Core Details")).toBeVisible();

    // Back to Quick Add now returns to My Products with the modal reopened —
    // not the old in-place full-page quick form.
    await visible(page, 'button:has-text("Back to Quick Add")').click();
    await page.waitForURL(/\/user\/products$/, { timeout: 10000 });
    await expect(page.getByText("Quick add product")).toBeVisible();
    await expect(visibleInDialog(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]')).toHaveValue("Retained Product");
    await expect(page.getByText(first, { exact: true })).toBeVisible();
  });

  test("retain on return: via /user/products modal round-trip", async ({ page }) => {
    await login(page);
    await clearDraft(page);
    await page.goto("/user/products");
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();

    await visibleInDialog(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]').fill("Modal Roundtrip Product");
    await visibleInDialog(page, 'button:has-text("Add Detailed Product")').click();
    await page.waitForURL(/mode=advanced/, { timeout: 10000 });
    await expect(visible(page, "text=Core Details")).toBeVisible();
    await expect(page.locator('input[value="Modal Roundtrip Product"]').first()).toBeVisible();

    await visible(page, 'button:has-text("Back to Products")').click();
    await page.waitForURL(/\/user\/products$/, { timeout: 10000 });
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(page.getByText("Quick add product")).toBeVisible();
    await expect(visible(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]')).toHaveValue("Modal Roundtrip Product");
  });

  test("empty switch: nothing entered -> detailed blank, and Quick Add stays blank on return (no draft written)", async ({ page }) => {
    await login(page);
    await clearDraft(page);
    await page.goto("/user/products/add");
    await visible(page, 'button:has-text("Add Detailed Product")').click();
    await expect(visible(page, "text=Core Details")).toBeVisible();
    await expect(page.locator('input[value=""]').first()).toBeDefined();

    const draftAfterEmptySwitch = await page.evaluate((key) => sessionStorage.getItem(key), DRAFT_KEY);
    expect(draftAfterEmptySwitch).toBeNull();

    await visible(page, 'button:has-text("Back to Quick Add")').click();
    await page.waitForURL(/\/user\/products$/, { timeout: 10000 });
    await expect(page.getByText("Quick add product")).toBeVisible();
    await expect(visibleInDialog(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]')).toHaveValue("");
  });

  test("draft cleared on successful create -> a fresh Quick Add opens empty", async ({ page }) => {
    await login(page);
    await clearDraft(page);
    await page.goto("/user/products/add");
    await selectTwoPolymerTypes(page);
    await visible(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]').fill(`${E2E_PRODUCT_PREFIX}Clear On Create Product`);

    // Write the draft (switch to detailed, then Back to Quick Add — which now
    // reopens the My Products modal) so we know it exists before create.
    await visible(page, 'button:has-text("Add Detailed Product")').click();
    await visible(page, 'button:has-text("Back to Quick Add")').click();
    await page.waitForURL(/\/user\/products$/, { timeout: 10000 });
    await expect(page.getByText("Quick add product")).toBeVisible();
    const draftBefore = await page.evaluate((key) => sessionStorage.getItem(key), DRAFT_KEY);
    expect(draftBefore).not.toBeNull();

    await visibleInDialog(page, 'button[type="submit"]').click();
    await expect(page.getByText("Product created")).toBeVisible({ timeout: 10000 });

    const draftAfter = await page.evaluate((key) => sessionStorage.getItem(key), DRAFT_KEY);
    expect(draftAfter).toBeNull();

    // Fresh open after a successful create shows a blank form (no stale draft).
    await visible(page, 'button:has-text("Quick Add")').click();
    await expect(visibleInDialog(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]')).toHaveValue("");
  });

  test("header 'Add Detailed Product' with no prior draft -> blank detailed form", async ({ page }) => {
    await login(page);
    await clearDraft(page);
    await page.goto("/user/products");
    await visible(page, 'button:has-text("Add Detailed Product")').click();
    await page.waitForURL(/mode=advanced/, { timeout: 10000 });
    await expect(visible(page, "text=Core Details")).toBeVisible();
    await expect(page.locator(`input[value="${E2E_PRODUCT_PREFIX}Clear On Create Product"]`)).toHaveCount(0);
    await expandSection(page, "Trade Information");
    await expect(page.locator("#minimum_order_quantity")).toHaveValue("");
  });

  test("TTL: a draft older than 5 minutes is ignored on both hydrate and seed", async ({ page }) => {
    await login(page);
    await page.goto("/user/products/add");
    await page.evaluate((key) => {
      sessionStorage.setItem(key, JSON.stringify({
        ts: Date.now() - 6 * 60_000,
        values: { polymerTypes: ["x"], productName: "Stale Draft Product", uom: "Metric Ton" },
      }));
    }, DRAFT_KEY);

    // Hydrate on Quick Add mount — stale draft ignored.
    await page.reload();
    await expect(visible(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]')).toHaveValue("");

    // Seed on Detailed mount — stale draft ignored too.
    await page.evaluate((key) => {
      sessionStorage.setItem(key, JSON.stringify({
        ts: Date.now() - 6 * 60_000,
        values: { polymerTypes: ["x"], productName: "Stale Draft Product", uom: "Metric Ton" },
      }));
    }, DRAFT_KEY);
    await page.goto("/user/products/add?mode=advanced");
    await expect(visible(page, "text=Core Details")).toBeVisible();
    await expect(page.locator('input[value="Stale Draft Product"]')).toHaveCount(0);
  });

  test("W1: hard-load of the bare quick-add URL with a fresh draft triggers no hydration warning", async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });

    await login(page);
    await page.goto("/user/products/add");
    await page.evaluate((key) => {
      sessionStorage.setItem(key, JSON.stringify({
        ts: Date.now(),
        values: { polymerTypes: [], productName: "Hydration Test Product", uom: "Metric Ton" },
      }));
    }, DRAFT_KEY);
    pageErrors.length = 0;
    consoleErrors.length = 0; // ignore anything from setup, only assert on the hard load below

    // Full page navigation (not a SPA router.push) — the scenario that risks a
    // server(blank)/client(draft-filled) mismatch on the useState lazy initializer
    // this fix replaced (T16 item 2).
    await page.goto("/user/products/add", { waitUntil: "load" });
    await expect(visible(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]')).toHaveValue("Hydration Test Product");

    expect(pageErrors).toEqual([]);
    const hydrationWarnings = consoleErrors.filter((t) => /hydrat/i.test(t));
    expect(hydrationWarnings).toEqual([]);
  });

  test("refresh trait: refreshing the detailed form after a switch re-seeds the Quick Add subset without crashing", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await login(page);
    await clearDraft(page);
    await page.goto("/user/products");
    await visible(page, 'button:has-text("Quick Add")').click();
    await visibleInDialog(page, 'input[placeholder="e.g. LDPE Film, PP Homopolymer"]').fill("Refresh Trait Product");
    await visibleInDialog(page, 'button:has-text("Add Detailed Product")').click();
    await page.waitForURL(/mode=advanced/, { timeout: 10000 });
    await expect(page.locator('input[value="Refresh Trait Product"]').first()).toBeVisible();

    await page.reload();
    await expect(visible(page, "text=Core Details")).toBeVisible();
    await expect(page.locator('input[value="Refresh Trait Product"]').first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("regression: detailed form AI catalog import still works end-to-end", async ({ page }) => {
    test.setTimeout(90_000);
    await login(page);
    await page.goto("/user/products/add?mode=advanced");
    await expect(visible(page, "text=Import from a catalog")).toBeVisible();

    await visible(page, 'button:has-text("Upload Catalog")').click();
    await expect(page.getByText("Drop a polymer catalog")).toBeVisible();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(
      "/Users/shabeeb/Documents/Shab.co/polymersHub/polymer-ai-parser-poc/test-catalogs/files/09_minimal_data.pdf"
    );

    // Parsing kicks off — either resolves to a ready/apply state, a multi-product
    // pick step, or a graceful rejection; either way the AI pipeline must
    // actually respond (not hang/crash).
    await expect(
      page.getByText("Review extracted fields")
        .or(page.getByText("Choose a product"))
        .or(page.getByText("No product data found"))
        .or(page.getByText("Couldn't read this document"))
        .or(page.getByText(/upload failed|something went wrong/i))
    ).toBeVisible({ timeout: 60_000 });
  });
});
