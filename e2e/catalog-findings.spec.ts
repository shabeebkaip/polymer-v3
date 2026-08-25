import path from "path";
import { test, expect, Page } from "@playwright/test";
import { cleanupE2EProducts, E2E_PRODUCT_PREFIX } from "./test-cleanup";
import { catalogFixture, requireE2ECredentials } from "./test-config";

const TEST_IMAGE_PATH = path.join(__dirname, "fixtures", "test-image.png");

// DESIGN_SPEC §14 — "Found in Your Catalogue" / "Needs Your Attention" review
// surface + the flexuralModulus/availability persistence fixes it depends on
// (§14.7/§21.9). Credentials: QA staging seller (MEMORY: project_test_accounts).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api";

test.afterEach(async ({ page }) => {
  await cleanupE2EProducts(page);
});

async function login(page: Page) {
  const { email, password } = requireE2ECredentials();
  await page.goto("/auth/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/user\/dashboard/, { timeout: 15000 });
}

// ponytail: app/user/layout.tsx mounts {children} twice (desktop/mobile
// trees, CSS-toggled) — pre-existing, unrelated to this feature. Scope to
// the visible copy or interactions/assertions hit a hidden duplicate.
function visible(page: Page, selector: string) {
  return page.locator(selector).locator("visible=true").first();
}

test("M-A — catalog import surfaces Found in Your Catalogue + Needs Your Attention, flexuralModulus and availability persist to the save payload", async ({ page }) => {
  test.setTimeout(120_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await login(page);
  await page.goto("/user/products/add?mode=advanced");

  const dropzoneCard = page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first();
  await dropzoneCard.locator('input[type="file"]').setInputFiles(catalogFixture("01_happy_flow_pp_grades.pdf"));

  await expect(page.locator('[data-slot="dialog-content"]')).toBeVisible({ timeout: 5000 });
  await expect(
    page.getByText("Choose a product").or(page.getByText("Review extracted fields"))
  ).toBeVisible({ timeout: 60_000 });

  if (await page.getByText("Choose a product").isVisible().catch(() => false)) {
    await page.locator('[data-slot="dialog-content"] button').filter({ hasText: /PP/i }).first().click();
  }
  // Create mode auto-applies + closes the modal.
  await expect(page.locator('[data-slot="dialog-content"]')).toBeHidden({ timeout: 10_000 });

  // §14.5 — compact source bar replaces the tall success card.
  await expect(visible(page, "text=fields found")).toBeVisible({ timeout: 5000 });
  await expect(visible(page, 'button:has-text("Replace")')).toBeVisible();
  await expect(visible(page, 'button:has-text("Remove")')).toBeVisible();

  // §14.4 — group headings, only where populated.
  await expect(visible(page, "h2:has-text('Technical Properties')")).toBeVisible();
  await expect(visible(page, "h2:has-text('Product Identity')")).toBeVisible();
  await expect(visible(page, "h2:has-text('Packaging & Logistics')")).toBeVisible();

  // §14.9 — aria-live announcement fires on extraction complete.
  const catalogueStatus = page.locator('[role="status"][aria-atomic="true"][id$="-catalogue-status"]');
  await expect(catalogueStatus).toHaveCount(1);
  const liveText = await catalogueStatus.textContent();
  expect(liveText).toContain("Catalogue processed");

  // §14.2 — Needs Your Attention (confirm/manual taxonomy tiers), when present.
  if (await visible(page, "h2:has-text('Needs Your Attention')").count() > 0) {
    const useThis = visible(page, 'button:has-text("Use this")');
    const notThis = visible(page, 'button:has-text("Not this")');
    const pickFromList = visible(page, 'button:has-text("Pick from list")');
    if (await useThis.count() > 0) await useThis.click();
    if (await notThis.count() > 0) await notThis.click();
    if (await pickFromList.count() > 0) {
      await pickFromList.click();
      // "Pick from list" must scroll/focus the real field (grade lives behind
      // Advanced -> Technical Properties, so this also proves the reveal path).
      await expect
        .poll(() => page.evaluate(() => document.activeElement?.id))
        .toMatch(/-field$/);
    }
  }

  // §14.3 — flexuralModulus and availability cards exist (fix + orphan control).
  await expect(page.locator("label:has-text('Flexural Modulus')").locator("visible=true").first()).toBeVisible();
  const availLabel = page.locator("label:has-text('Availability')").locator("visible=true").first();
  await expect(availLabel).toBeVisible();
  await availLabel
    .locator("xpath=ancestor::div[contains(@class,'rounded-xl')][last()]")
    .locator('button:has-text("On Request")')
    .click();

  // §14.3 dismissed state — clears both the AI flag and the value.
  const colorLabelAll = page.locator("label:has-text('Color')").locator("visible=true");
  const colorCountBefore = await colorLabelAll.count();
  if (colorCountBefore > 0) {
    await colorLabelAll.first()
      .locator("xpath=ancestor::div[contains(@class,'rounded-xl')][last()]")
      .locator('button[aria-label^="Remove"]')
      .click();
    await expect.poll(() => colorLabelAll.count()).toBeLessThan(colorCountBefore);
  }

  // §14.3 edited state — editing clears the AI badge, card leaves the surface.
  const tradeLabelAll = page.locator("label:has-text('Trade Name')").locator("visible=true");
  const tradeCountBefore = await tradeLabelAll.count();
  if (tradeCountBefore > 0) {
    await tradeLabelAll.first()
      .locator("xpath=ancestor::div[contains(@class,'rounded-xl')][last()]")
      .locator("input").first()
      .fill("Edited Trade Name");
    await expect.poll(() => tradeLabelAll.count()).toBeLessThan(tradeCountBefore);
  }

  // Fill whatever the catalog didn't supply for this SKU + submit.
  const productName = `${E2E_PRODUCT_PREFIX}Catalog Findings PP`;
  await visible(page, "#productName").fill(productName);
  await visible(page, "#chemicalName").fill("E2E Test Chemical");
  const stockInput = visible(page, "#stock");
  if (!(await stockInput.inputValue())) await stockInput.fill("500");
  const priceInput = visible(page, "#price");
  if (!(await priceInput.inputValue())) await priceInput.fill("1200");
  const incotermsTrigger = page.locator('[id="incoterms-field"]').locator("visible=true").locator('div.cursor-pointer:has-text("Select Incoterms")');
  if (await incotermsTrigger.count() > 0) {
    await incotermsTrigger.click();
    const opt = page.locator("div.absolute.z-50 label").locator("visible=true").first();
    await opt.waitFor({ state: "visible", timeout: 5000 });
    await opt.click();
    await page.keyboard.press("Escape");
  }
  const imageInput = page.locator('[id="productImages-field"]').locator("visible=true").locator('input[type="file"]');
  await imageInput.setInputFiles(TEST_IMAGE_PATH);
  await page.waitForTimeout(4000); // Cloudinary upload round trip

  let requestPayload: Record<string, unknown> | null = null;
  let createdId: string | null = null;
  page.on("request", (req) => {
    if (req.method() === "POST" && new URL(req.url()).pathname.endsWith("/product/create")) {
      try { requestPayload = req.postDataJSON(); } catch { /* not json */ }
    }
  });
  page.on("response", async (res) => {
    if (res.request().method() === "POST" && new URL(res.url()).pathname.endsWith("/product/create") && res.ok()) {
      try { createdId = (await res.json())?.data?._id ?? null; } catch { /* not json */ }
    }
  });

  await visible(page, 'button:has-text("Create Product")').click();
  await page.waitForURL(/\/user\/products$/, { timeout: 15_000 });

  expect(requestPayload).not.toBeNull();
  const payload = requestPayload as unknown as Record<string, unknown>;
  // §14.7 — flexuralModulus is no longer silently dropped before submit.
  expect(payload.flexuralModulus).toBeTruthy();
  // §14.3 — the orphan `availability` chip control writes through to the payload.
  expect(payload.availability).toBe("On Request");

  // Round-trip: confirm the values actually persisted server-side (fetch the
  // single product by its own id — the list endpoint's aggregation can trim
  // fields not needed for the card view, so it isn't a reliable persistence check).
  expect(createdId).toBeTruthy();
  const cookie = await page.context().cookies().then((cs) => cs.find((c) => c.name === "token"));
  if (cookie && createdId) {
    const res = await page.request.get(`${API_BASE_URL}/product/${createdId}`, {
      headers: { Authorization: `Bearer ${cookie.value}` },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const created = body?.data ?? body;
    expect(created.flexuralModulus).toBe(payload.flexuralModulus);
    expect(created.availability).toBe("On Request");
  }

  expect(pageErrors).toEqual([]);
});
