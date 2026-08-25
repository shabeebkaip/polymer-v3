import { expect, Page, test } from "@playwright/test";
import type { ParsedProductEntry } from "../types/ai";

type DropdownItem = { _id: string; name: string };

async function authenticateWithoutCredentials(page: Page) {
  const baseURL = String(test.info().project.use.baseURL);
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  await page.context().addCookies([
    { name: "token", value: `e2e.${payload}.signature`, url: baseURL },
    {
      name: "userInfo",
      value: JSON.stringify({ user_type: "seller", firstName: "M-D test seller" }),
      url: baseURL,
    },
  ]);
}

async function mockDropdown(page: Page, endpoint: string, data: DropdownItem[]) {
  await page.route(`**/${endpoint}/list`, route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: true, data }),
  }));
}

async function mockFormDependencies(page: Page) {
  await Promise.all([
    mockDropdown(page, "chemical-family", []),
    mockDropdown(page, "product-family", []),
    mockDropdown(page, "polymer-type", []),
    mockDropdown(page, "industry", []),
    mockDropdown(page, "physical-form", []),
    mockDropdown(page, "grade", []),
    mockDropdown(page, "incoterm", []),
    mockDropdown(page, "payment-terms", []),
    mockDropdown(page, "packaging-type", []),
  ]);
}

function text(value: string) {
  return { value, confidence: "high" as const };
}

function numeric(value: number) {
  return { value, confidence: "high" as const };
}

async function mockCatalogue(page: Page, products: ParsedProductEntry[]) {
  await page.route("**/ai/parse", route => route.fulfill({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({ sessionId: "md-session", status: "processing" }),
  }));
  await page.route("**/ai/session/md-session", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      status: "complete",
      extractionMethod: "text",
      sessionId: "md-session",
      ocrFailed: false,
      products,
    }),
  }));
}

async function uploadMockCatalogue(page: Page, name = "catalogue-بيانات.pdf") {
  await page.locator('[aria-label^="Upload a catalog file"]').locator('input[type="file"]').setInputFiles({
    name,
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 deterministic M-D catalogue"),
  });
}

async function applyReviewedCatalogue(page: Page) {
  const review = page.getByRole("dialog", { name: "Review extracted fields" });
  await expect(review).toBeVisible();
  await review.getByRole("button", { name: /^(Apply|Continue|Review \d+ conflict)/ }).first().click();
}

test.beforeEach(async ({ page }) => {
  await authenticateWithoutCredentials(page);
  await mockFormDependencies(page);
});

test("M-D exposes one atomic status and visible reduced-motion focus in responsive RTL layouts", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Element.prototype.scrollIntoView = function scrollIntoView(options?: boolean | ScrollIntoViewOptions) {
      (window as typeof window & { __mdScrollOptions?: Array<boolean | ScrollIntoViewOptions | undefined> }).__mdScrollOptions ??= [];
      (window as typeof window & { __mdScrollOptions: Array<boolean | ScrollIntoViewOptions | undefined> }).__mdScrollOptions.push(options);
    };
  });
  await mockCatalogue(page, [{
    product: {
      productName: text("مادة بوليمر طويلة للاختبار"),
      description: text("RTL catalogue value قيمة كتالوج"),
      density: numeric(0.92),
    },
    refMatches: {},
  }]);

  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/user/products/add?mode=advanced");
  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  await uploadMockCatalogue(page);
  await applyReviewedCatalogue(page);

  const foundHeading = page.getByRole("heading", { name: "Product Identity" });
  await expect(foundHeading).toBeFocused();
  const catalogueStatus = page.locator('[role="status"][aria-atomic="true"][id$="-catalogue-status"]');
  await expect(catalogueStatus).toHaveCount(1);
  await expect(catalogueStatus).toHaveText("Catalogue processed. 3 fields found. 0 need review.");
  await expect(page.locator('[role="status"]')).toHaveCount(1);

  const duplicateIds = await page.locator("[id]").evaluateAll(elements => {
    const counts = new Map<string, number>();
    elements.forEach(element => counts.set(element.id, (counts.get(element.id) ?? 0) + 1));
    return [...counts.entries()].filter(([, count]) => count > 1).map(([id]) => id);
  });
  expect(duplicateIds).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await expect(page.locator("bdi").filter({ hasText: "مادة بوليمر" }).first()).toBeVisible();
  await expect(foundHeading).toHaveCSS("outline-style", "none");
  expect(await foundHeading.evaluate(element => getComputedStyle(element).boxShadow)).not.toBe("none");
  const scrollOptions = await page.evaluate(() => (window as typeof window & { __mdScrollOptions?: Array<boolean | ScrollIntoViewOptions | undefined> }).__mdScrollOptions ?? []);
  expect(scrollOptions.some(options => typeof options === "object" && options?.behavior === "auto")).toBe(true);

  await page.setViewportSize({ width: 375, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await page.setViewportSize({ width: 768, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await page.setViewportSize({ width: 1024, height: 900 });
  const sidebar = page.locator('[id$="-completion-tracker"]').locator("..");
  await expect(sidebar).toHaveCSS("position", "static");
  // A 1280px display at 200% browser zoom exposes a 640 CSS-pixel viewport.
  await page.setViewportSize({ width: 640, height: 900 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(sidebar).toHaveCSS("position", "sticky");
});

test("M-D direct second-product choice atomically retires A-only AI data and preserves seller edits", async ({ page }) => {
  await mockCatalogue(page, [
    {
      product: {
        productName: text("Atlas Product A"),
        tradeName: text("A-only trade name"),
        description: text("Catalogue A description"),
      },
      refMatches: {},
    },
    {
      product: {
        productName: text("Borealis Product B"),
        density: numeric(0.91),
      },
      refMatches: {},
    },
  ]);

  await page.goto("/user/products/add?mode=advanced");
  await uploadMockCatalogue(page, "two-products.pdf");
  await page.getByRole("option", { name: "Atlas Product A", exact: true }).click();
  await applyReviewedCatalogue(page);
  await expect(page.getByRole("textbox", { name: /^Trade Name/ })).toHaveValue("A-only trade name");
  await page.getByRole("textbox", { name: /^Description/ }).fill("Seller-edited description");

  await page.getByRole("button", { name: "Add another" }).click();
  await expect(page.getByRole("option", { name: "Atlas Product A — already added" })).toHaveAttribute("aria-disabled", "true");
  await page.getByRole("option", { name: "Borealis Product B", exact: true }).click();
  await applyReviewedCatalogue(page);

  const needsAttention = page.getByRole("heading", { name: "Needs Your Attention" });
  await expect(needsAttention).toBeFocused();
  const productConflict = page.getByRole("group", { name: "Product Name: Different value found" });
  await expect(productConflict).toContainText("Atlas Product A");
  await expect(productConflict).toContainText("Borealis Product B");
  await expect(page.getByRole("spinbutton", { name: /^Density/ })).toHaveValue("0.91");
  await expect(page.getByRole("textbox", { name: /^Trade Name/ })).toHaveCount(0);
  await expect(page.locator('[role="status"][aria-atomic="true"][id$="-catalogue-status"]')).toHaveText(
    "Catalogue processed. 2 fields found. 1 need review.",
  );

  await productConflict.getByRole("button", { name: "Use catalogue value for Product Name" }).click();
  await expect(page.locator("#productName")).toHaveValue("Borealis Product B");
  await page.locator("#advanced-details-toggle").click();
  await expect(page.locator("#tradeName")).toHaveValue("");
  await expect(page.locator("#description")).toHaveValue("Seller-edited description");
  await expect(page.getByRole("button", { name: "Add another" })).toHaveCount(0);
});
