import { expect, Page, test } from "@playwright/test";
import { areAiValuesEqual, isAiValueEmpty, partitionAiRows } from "../lib/aiConflicts";
import type { DiffRow, ParsedProductEntry } from "../types/ai";

type DropdownItem = { _id: string; name: string };

function visible(page: Page, selector: string) {
  return page.locator(selector).locator("visible=true").first();
}

async function authenticateLocally(page: Page) {
  const baseURL = String(test.info().project.use.baseURL);
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  await page.context().addCookies([
    { name: "token", value: `qa.${payload}.signature`, url: baseURL },
    { name: "userInfo", value: JSON.stringify({ user_type: "seller", firstName: "QA" }), url: baseURL },
  ]);
}

async function mockDropdown(page: Page, endpoint: string, data: DropdownItem[]) {
  await page.route(`**/${endpoint}/list`, route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: true, data }),
  }));
}

async function mockDependencies(page: Page) {
  await Promise.all([
    mockDropdown(page, "chemical-family", [{ _id: "family-pp", name: "Polyolefin" }]),
    mockDropdown(page, "product-family", []),
    mockDropdown(page, "polymer-type", [{ _id: "polymer-pp", name: "Polypropylene" }]),
    mockDropdown(page, "industry", [{ _id: "industry-packaging", name: "Packaging" }]),
    mockDropdown(page, "physical-form", [{ _id: "form-pellet", name: "Pellets" }]),
    mockDropdown(page, "grade", [{ _id: "grade-a", name: "Grade A" }]),
    mockDropdown(page, "incoterm", [{ _id: "incoterm-fob", name: "FOB" }]),
    mockDropdown(page, "payment-terms", []),
    mockDropdown(page, "packaging-type", []),
  ]);
}

function extracted(
  product: Partial<ParsedProductEntry["product"]>,
  refMatches: ParsedProductEntry["refMatches"] = {},
): ParsedProductEntry {
  return { product, refMatches };
}

function text(value: string) {
  return { value, confidence: "high" as const };
}

function numeric(value: number) {
  return { value, confidence: "high" as const };
}

async function installQueue(page: Page) {
  const queue: ParsedProductEntry[] = [];
  const sessions = new Map<string, ParsedProductEntry>();
  let sequence = 0;

  await page.route("**/ai/parse", route => {
    const entry = queue.shift();
    if (!entry) return route.fulfill({ status: 500, body: "QA queue empty" });
    sequence += 1;
    const sessionId = `qa-conflict-${sequence}`;
    sessions.set(sessionId, entry);
    return route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ sessionId, status: "processing" }),
    });
  });

  await page.route("**/ai/session/**", route => {
    const id = new URL(route.request().url()).pathname.split("/").pop() ?? "";
    const entry = sessions.get(id);
    return route.fulfill({
      status: entry ? 200 : 404,
      contentType: "application/json",
      body: JSON.stringify(entry ? {
        status: "complete",
        extractionMethod: "text",
        sessionId: id,
        ocrFailed: false,
        products: [entry],
      } : { status: "failed" }),
    });
  });

  return {
    enqueue(entry: ParsedProductEntry) { queue.push(entry); },
    get count() { return sequence; },
  };
}

async function upload(page: Page, expectedSequence: number) {
  const sourceBar = page.locator("#catalog-source-bar").locator("visible=true");
  const hasSourceBar = await sourceBar.count() > 0;
  if (hasSourceBar) await sourceBar.getByRole("button", { name: "Replace" }).click();
  const input = hasSourceBar
    ? page.getByRole("dialog").locator('input[type="file"]')
    : page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first().locator('input[type="file"]');
  await input.setInputFiles({
    name: `qa-conflict-${expectedSequence}.pdf`,
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 mocked QA catalogue"),
  });
}

async function applyReviewedCatalogue(page: Page) {
  const review = page.getByRole("dialog", { name: "Review extracted fields" });
  await expect(review).toBeVisible();
  await review.getByRole("button", { name: /^(Apply|Continue|Review \d+ conflict)/ }).first().click();
}

async function openTechnicalAndSeedDensity(page: Page, density: string) {
  await visible(page, "#advanced-details-toggle").click();
  await page.locator("button").filter({ hasText: /^Technical Properties/ }).locator("visible=true").first().click();
  await visible(page, "#density").fill(density);
}

function row(key: string, displayValue: string, label = key): DiffRow {
  return { key, label, displayValue, confidence: "high" };
}

test.beforeEach(async ({ page }) => {
  await authenticateLocally(page);
  await mockDependencies(page);
});

test("QA normalization matrix treats false as populated and excludes every taxonomy key", () => {
  expect(areAiValuesEqual("price", "2100.00", 2100)).toBe(true);
  expect(areAiValuesEqual("leadTime", " 10 days ", "10 days")).toBe(true);
  expect(areAiValuesEqual("leadTime", "TEN days", "ten days")).toBe(false);
  expect(areAiValuesEqual("otherArray", ["Beta", "Alpha", "Beta", ""], ["Alpha", "Beta"])).toBe(true);
  expect(areAiValuesEqual("recyclable", false, false)).toBe(true);
  expect(areAiValuesEqual("recyclable", false, true)).toBe(false);
  expect(isAiValueEmpty(false)).toBe(false);

  const taxonomyKeys = ["chemicalFamily", "physicalForm", "polymerTypes", "polymerType", "industry", "grade"];
  const result = partitionAiRows({
    rows: [row("recyclable", "Yes", "Recyclable"), ...taxonomyKeys.map(key => row(key, "Different", key))],
    fields: Object.fromEntries([["recyclable", true], ...taxonomyKeys.map(key => [key, `${key}-new`])]),
    existingData: Object.fromEntries([["recyclable", false], ...taxonomyKeys.map(key => [key, `${key}-current`])]),
    suppressed: new Set(),
  });

  expect(result.conflicts.map(conflict => conflict.fieldKey)).toEqual(["recyclable"]);
  expect(result.conflicts[0]).toMatchObject({ catalogueValue: true, displayValue: "Yes" });
});

test("QA equal normalized create values are silent and never autosave", async ({ page }) => {
  const queue = await installQueue(page);
  let createCalls = 0;
  await page.route("**/product/create", route => {
    createCalls += 1;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
  });

  await page.goto("/user/products/add?mode=advanced");
  await visible(page, "#productName").fill("  Equal Resin  ");
  await visible(page, "#stock").fill("2100.0");

  queue.enqueue(extracted({
    productName: text("Equal Resin"),
    stock: numeric(2100),
    recyclable: false,
  }));
  await upload(page, 1);
  await expect.poll(() => queue.count).toBe(1);
  await applyReviewedCatalogue(page);

  await expect(page.getByRole("group", { name: /Different value found/ }).locator("visible=true")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Needs Your Attention" }).locator("visible=true")).toHaveCount(0);
  await expect(visible(page, "#productName")).toHaveValue("  Equal Resin  ");
  await expect(visible(page, "#stock")).toHaveValue("2100.0");
  expect(createCalls).toBe(0);
});

test("QA zero-applied conflicts precede taxonomy, replace atomically, preserve unrelated edits, and render raw text literally", async ({ page }) => {
  const queue = await installQueue(page);
  let createCalls = 0;
  await page.route("**/product/create", route => {
    createCalls += 1;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
  });

  await page.goto("/user/products/add?mode=advanced");
  await visible(page, "#productName").fill("Seller Product");
  await openTechnicalAndSeedDensity(page, "0.95");
  await visible(page, "#description").fill("Unrelated seller note");
  await visible(page, "#leadTime").fill("15");

  queue.enqueue(extracted({
    productName: text("Catalogue Product"),
    density: numeric(0.92),
    chemicalFamily: text("Polyolefin raw"),
  }, {
    chemicalFamily: {
      query: "Polyolefin raw",
      tier: "confirm",
      match: { _id: "family-pp", name: "Polyolefin" },
    },
  }));
  await upload(page, 1);
  await expect.poll(() => queue.count).toBe(1);
  await applyReviewedCatalogue(page);

  const heading = page.getByRole("heading", { name: "Needs Your Attention" }).locator("visible=true").first();
  const conflicts = page.locator('fieldset:has(legend:text("Different value found"))').locator("visible=true");
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
  await expect(conflicts).toHaveCount(2);
  await expect(conflicts.nth(0)).toHaveAccessibleName("Product Name: Different value found");
  await expect(conflicts.nth(1)).toHaveAccessibleName("Density: Different value found");
  await expect(conflicts.nth(0)).toContainText("Your current value");
  await expect(conflicts.nth(0)).toContainText("Catalogue value");
  await expect(conflicts.nth(0)).toContainText("From catalogue");
  await expect(conflicts.nth(0).getByRole("button", { name: "Keep current value for Product Name" })).toHaveText("Keep current");
  await expect(conflicts.nth(0).getByRole("button", { name: "Use catalogue value for Product Name" })).toHaveText("Use catalogue value");
  await expect(visible(page, "#productName")).toHaveValue("Seller Product");
  await expect(visible(page, "#density")).toHaveValue("0.95");

  const taxonomyRow = page.locator("[data-taxonomy-review-row]").locator("visible=true").first();
  await expect(taxonomyRow).toContainText("Chemical Family");
  expect((await conflicts.nth(1).boundingBox())!.y).toBeLessThan((await taxonomyRow.boundingBox())!.y);
  const catalogueStatus = page.locator('[role="status"][aria-atomic="true"][id$="-catalogue-status"]');
  await expect(catalogueStatus).toHaveCount(1);
  await expect(catalogueStatus).toContainText("Catalogue processed. 2 fields found. 3 need review.");

  const keepFirst = conflicts.nth(0).getByRole("button", { name: "Keep current value for Product Name" });
  await keepFirst.focus();
  await page.keyboard.press("Enter");
  await expect(conflicts).toHaveCount(1);
  await expect(conflicts.first()).toBeFocused();
  expect(createCalls).toBe(0);

  const literal = '<svg onload="document.body.dataset.qaConflictXss=1"></svg>';
  queue.enqueue(extracted({ leadTime: text(literal) }));
  await upload(page, 2);
  await expect.poll(() => queue.count).toBe(2);
  await applyReviewedCatalogue(page);

  await expect(page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true")).toHaveCount(0);
  const replacement = page.getByRole("group", { name: "Lead Time: Different value found" }).locator("visible=true").first();
  await expect(replacement).toContainText(literal);
  await expect(visible(page, "#description")).toHaveValue("Unrelated seller note");
  await expect(page.locator("svg[onload]")).toHaveCount(0);
  expect(await page.locator("body").getAttribute("data-qa-conflict-xss")).toBeNull();
  expect(createCalls).toBe(0);
});

test("QA edit-mode false-to-true Use writes canonical boolean only on explicit update", async ({ page }) => {
  const queue = await installQueue(page);
  const saved = {
    _id: "qa-boolean-product",
    productName: "Saved Product",
    chemicalName: "Polypropylene",
    description: "Keep this note",
    recyclable: false,
    industry: [], grade: [], incoterms: [], packagingType: [], product_family: [], productImages: [],
  };
  let updatePayload: Record<string, unknown> | undefined;
  let updateCalls = 0;

  await page.route("**/product/qa-boolean-product", route => {
    if (route.request().method() === "PUT") {
      updateCalls += 1;
      updatePayload = route.request().postDataJSON() as Record<string, unknown>;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: saved }),
    });
  });

  await page.goto("/user/products/qa-boolean-product");
  await expect(page.getByText("Loading...", { exact: true }).locator("visible=true")).toHaveCount(0);
  queue.enqueue(extracted({ recyclable: true }));
  await upload(page, 1);
  await expect.poll(() => queue.count).toBe(1);
  await applyReviewedCatalogue(page);

  const conflict = page.getByRole("group", { name: "Recyclable: Different value found" }).locator("visible=true").first();
  await expect(conflict).toContainText("Your current valueNo");
  await expect(conflict).toContainText("Catalogue valueFrom catalogueYes");
  expect(updateCalls).toBe(0);

  const use = conflict.getByRole("button", { name: "Use catalogue value for Recyclable" });
  await use.focus();
  await page.keyboard.press("Space");
  await expect(conflict).toBeHidden();
  const catalogueStatus = page.locator('[role="status"][aria-atomic="true"][id$="-catalogue-status"]');
  await expect(catalogueStatus).toHaveCount(1);
  await expect(catalogueStatus).toContainText("Using catalogue value for Recyclable.");
  expect(updateCalls).toBe(0);

  await visible(page, 'button:has-text("Save Changes")').click();
  await expect.poll(() => updatePayload).toBeTruthy();
  expect(updatePayload?.recyclable).toBe(true);
  expect(updatePayload?.description).toBe("Keep this note");
  expect(updateCalls).toBe(1);
});
