import { expect, Page, test } from "@playwright/test";
import type { ParsedProductEntry } from "../types/ai";

// W2 regression — components/user/products/CatalogFindings.tsx's
// getVisibleTaxonomyReview used to hide a manual-tier ARRAY taxonomy row
// (industry/grade) whenever the array was non-empty for ANY reason, even an
// unrelated auto-matched sibling from the same extraction. This spec builds
// exactly that scenario: one industry auto-matches (applies immediately) and
// a DIFFERENT industry in the same extraction has no confident match (manual
// tier) — the manual row must stay visible until the seller actually adds a
// second industry themselves.

type DropdownItem = { _id: string; name: string };

function visible(page: Page, selector: string) {
  return page.locator(selector).locator("visible=true").first();
}

async function authenticateWithoutCredentials(page: Page) {
  const baseURL = String(test.info().project.use.baseURL);
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  await page.context().addCookies([
    { name: "token", value: `e2e.${payload}.signature`, url: baseURL },
    { name: "userInfo", value: JSON.stringify({ user_type: "seller", firstName: "W2 test seller" }), url: baseURL },
  ]);
}

async function mockDropdown(page: Page, endpoint: string, data: DropdownItem[]) {
  await page.route(`**/${endpoint}/list`, route => route.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data }),
  }));
}

async function mockFormDependencies(page: Page) {
  await Promise.all([
    mockDropdown(page, "chemical-family", [{ _id: "family-pp", name: "Polyolefin" }]),
    mockDropdown(page, "product-family", []),
    mockDropdown(page, "polymer-type", [{ _id: "polymer-pp", name: "Polypropylene" }]),
    mockDropdown(page, "industry", [
      { _id: "industry-packaging", name: "Packaging" },
      { _id: "industry-recycling", name: "Recycling" },
    ]),
    mockDropdown(page, "physical-form", [{ _id: "form-pellet", name: "Pellets" }]),
    mockDropdown(page, "grade", []),
    mockDropdown(page, "incoterm", [{ _id: "incoterm-fob", name: "FOB" }]),
    mockDropdown(page, "payment-terms", []),
    mockDropdown(page, "packaging-type", []),
  ]);
}

test.beforeEach(async ({ page }) => {
  await authenticateWithoutCredentials(page);
  await mockFormDependencies(page);
});

test("W2: manual-tier industry row survives an auto-matched sibling in the same array", async ({ page }) => {
  const entry: ParsedProductEntry = {
    product: {
      productName: { value: "W2 Test PP", confidence: "high" },
      chemicalName: { value: "Polypropylene", confidence: "high" },
    },
    refMatches: {
      industry: [
        { query: "Packaging", tier: "auto", match: { _id: "industry-packaging", name: "Packaging" } },
        { query: "Recycling Sector Use", tier: "manual", match: null },
      ],
    },
  };

  await page.route("**/ai/parse", route => route.fulfill({
    status: 202, contentType: "application/json",
    body: JSON.stringify({ sessionId: "w2-session", status: "processing" }),
  }));
  await page.route("**/ai/session/w2-session", route => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ status: "complete", extractionMethod: "text", sessionId: "w2-session", ocrFailed: false, products: [entry] }),
  }));

  await page.goto("/user/products/add?mode=advanced");
  const uploadInput = page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first().locator('input[type="file"]');
  await uploadInput.setInputFiles({ name: "w2.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 mock") });

  const review = page.getByRole("dialog", { name: "Review extracted fields" });
  await expect(review).toBeVisible();
  await review.getByRole("button", { name: /^(Apply|Continue|Review \d+ conflict)/ }).first().click();

  // The auto-matched industry applied — the real field is non-empty.
  const industryTrigger = visible(page, 'button[aria-label="Select Industries"]');
  await expect(industryTrigger).toContainText("Packaging");

  // W2: the manual row for the OTHER, unmatched industry must still be
  // visible — pre-fix, the array-non-empty check hid it here.
  const manualRow = page.getByText("No confident match — pick manually").locator("visible=true").first().locator("xpath=ancestor::div[@data-taxonomy-review-row]");
  await expect(manualRow).toBeVisible();
  await expect(manualRow).toContainText("Recycling Sector Use");

  // "Pick from list" scrolls/focuses the real Industries field, without
  // removing the manual row (it isn't resolved by focusing alone).
  await manualRow.getByRole("button", { name: "Pick from list" }).click();
  await expect(page.locator("#industry-field").locator("visible=true").first()).toBeFocused();
  await expect(manualRow).toBeVisible();

  // Now the seller manually adds the second industry themselves — the
  // array grows past the auto-applied baseline, and the manual row (finally
  // actually resolved) disappears. The auto-matched "Packaging" stays.
  await industryTrigger.click();
  await page.getByRole("option", { name: "Recycling", exact: true }).locator("visible=true").first().click();
  await page.keyboard.press("Escape");
  await expect(page.getByText("No confident match — pick manually").locator("visible=true")).toHaveCount(0);
  await expect(industryTrigger).toContainText("Packaging");
  await expect(industryTrigger).toContainText("Recycling");
});
