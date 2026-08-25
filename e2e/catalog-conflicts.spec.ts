import { expect, Page, test } from "@playwright/test";
import type { ParsedProductEntry } from "../types/ai";

type DropdownItem = { _id: string; name: string };

function visible(page: Page, selector: string) {
  return page.locator(selector).locator("visible=true").first();
}

async function authenticateWithoutCredentials(page: Page) {
  const baseURL = String(test.info().project.use.baseURL);
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  await page.context().addCookies([
    { name: "token", value: `e2e.${payload}.signature`, url: baseURL },
    {
      name: "userInfo",
      value: JSON.stringify({ user_type: "seller", firstName: "Conflict test seller" }),
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
    mockDropdown(page, "chemical-family", [{ _id: "family-pp", name: "Polyolefin" }]),
    mockDropdown(page, "product-family", []),
    mockDropdown(page, "polymer-type", [{ _id: "polymer-pp", name: "Polypropylene" }]),
    mockDropdown(page, "industry", [{ _id: "industry-packaging", name: "Packaging" }]),
    mockDropdown(page, "physical-form", [{ _id: "form-pellet", name: "Pellets" }]),
    mockDropdown(page, "grade", []),
    mockDropdown(page, "incoterm", [{ _id: "incoterm-fob", name: "FOB" }]),
    mockDropdown(page, "payment-terms", []),
    mockDropdown(page, "packaging-type", []),
  ]);
}

async function installExtractionQueue(page: Page) {
  const queue: ParsedProductEntry[] = [];
  const sessions = new Map<string, ParsedProductEntry>();
  let generation = 0;

  await page.route("**/ai/parse", async route => {
    const next = queue.shift();
    if (!next) {
      await route.fulfill({ status: 500, body: "No deterministic catalogue result queued" });
      return;
    }
    generation += 1;
    const sessionId = `conflict-session-${generation}`;
    sessions.set(sessionId, next);
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ sessionId, status: "processing" }),
    });
  });

  await page.route("**/ai/session/**", async route => {
    const sessionId = new URL(route.request().url()).pathname.split("/").pop() ?? "";
    const product = sessions.get(sessionId);
    await route.fulfill({
      status: product ? 200 : 404,
      contentType: "application/json",
      body: JSON.stringify(product ? {
        status: "complete",
        extractionMethod: "text",
        sessionId,
        ocrFailed: false,
        products: [product],
      } : { status: "failed" }),
    });
  });

  return {
    enqueue(product: ParsedProductEntry) {
      queue.push(product);
    },
    get completedGenerations() {
      return generation;
    },
  };
}

function extracted(fields: Partial<ParsedProductEntry["product"]>, refMatches: ParsedProductEntry["refMatches"] = {}): ParsedProductEntry {
  return { product: fields, refMatches };
}

function numeric(value: number) {
  return { value, confidence: "high" as const };
}

function text(value: string) {
  return { value, confidence: "high" as const };
}

function persistedProduct(data: Record<string, unknown>, id: string) {
  const toRef = (value: unknown) => value ? { _id: String(value) } : undefined;
  const toRefs = (value: unknown) => Array.isArray(value) ? value.map(item => ({ _id: String(item) })) : [];
  return {
    ...data,
    _id: id,
    chemicalFamily: toRef(data.chemicalFamily),
    polymerType: toRef(data.polymerType),
    physicalForm: toRef(data.physicalForm),
    paymentTerms: toRef(data.paymentTerms),
    industry: toRefs(data.industry),
    grade: toRefs(data.grade),
    incoterms: toRefs(data.incoterms),
    packagingType: toRefs(data.packagingType),
    product_family: toRefs(data.product_family),
  };
}

async function uploadQueuedCatalogue(page: Page, sequence: number) {
  const source = page.locator('[aria-label^="Upload a catalog file"], #catalog-source-bar').locator("visible=true").first();
  await expect(source).toBeVisible();
  await source.locator('input[type="file"]').setInputFiles({
    name: `conflict-${sequence + 1}.pdf`,
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 deterministic mocked catalogue"),
  });
}

async function seedDensity(page: Page, value: string) {
  await visible(page, "#advanced-details-toggle").click();
  await page.locator("button").filter({ hasText: /^Technical Properties/ }).locator("visible=true").first().click();
  await visible(page, "#density").fill(value);
}

test.beforeEach(async ({ page }) => {
  await authenticateWithoutCredentials(page);
  await mockFormDependencies(page);
});

test("M-B conflict lifecycle preserves seller data, supports keyboard decisions, anti-nag, and canonical save payload", async ({ page }) => {
  const catalogues = await installExtractionQueue(page);
  let savePayload: Record<string, unknown> | undefined;
  await page.route("**/product/create", async route => {
    savePayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: { _id: "conflict-created" } }),
    });
  });
  await page.route("**/file/upload", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      id: "mock-image",
      fileUrl: "data:image/png;base64,iVBORw0KGgo=",
      originalFilename: "mock-product.png",
      format: "png",
      resourceType: "image",
    }),
  }));

  await page.goto("/user/products/add?mode=advanced");
  await seedDensity(page, "0.95");

  catalogues.enqueue(extracted({ density: numeric(0.92) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(1);

  const needsAttention = page.getByRole("heading", { name: "Needs Your Attention" }).locator("visible=true").first();
  const densityConflict = page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true").first();
  await expect(needsAttention).toBeVisible();
  await expect(needsAttention).toBeFocused();
  await expect(densityConflict).toContainText("Your current value");
  await expect(densityConflict).toContainText("0.95 g/cm³");
  await expect(densityConflict).toContainText("Catalogue value");
  await expect(densityConflict).toContainText("0.92 g/cm³");
  await expect(densityConflict).toContainText("From catalogue");
  await expect(visible(page, "#density")).toHaveValue("0.95");
  await expect(page.locator("#ai-import-status").first()).toContainText("Catalogue processed. 1 field found. 1 need review.");

  const conflictValues = densityConflict.locator(".grid");
  await expect(conflictValues).toHaveCSS("grid-template-columns", /[0-9.]+px [0-9.]+px/);
  const keepButton = densityConflict.getByRole("button", { name: "Keep current value for Density" });
  const useButton = densityConflict.getByRole("button", { name: "Use catalogue value for Density" });
  expect(await keepButton.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  expect(await useButton.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);

  await keepButton.focus();
  await page.keyboard.press("Enter");
  await expect(densityConflict).toBeHidden();
  await expect(visible(page, "#density")).toHaveValue("0.95");
  await expect(page.locator("#ai-import-status").first()).toContainText("Kept current value for Density.");
  await expect(page.getByText("Required Information", { exact: true }).locator("visible=true").first()).toBeFocused();

  catalogues.enqueue(extracted({ density: numeric(0.92) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(2);
  await expect(page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true")).toHaveCount(0);
  await expect(visible(page, "#density")).toHaveValue("0.95");

  catalogues.enqueue(extracted({ density: numeric(0.91) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(3);
  const changedProposal = page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true").first();
  await expect(changedProposal).toContainText("0.91 g/cm³");
  const useChanged = changedProposal.getByRole("button", { name: "Use catalogue value for Density" });
  await useChanged.focus();
  await page.keyboard.press("Space");
  await expect(changedProposal).toBeHidden();
  await expect(visible(page, "#density")).toHaveValue("0.91");
  await expect(page.locator("#ai-import-status").first()).toContainText("Using catalogue value for Density.");

  await visible(page, "#density").fill("0.93");
  catalogues.enqueue(extracted({ density: numeric(0.94) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(4);
  const protectedEdit = page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true").first();
  await expect(protectedEdit).toContainText("0.93 g/cm³");
  await expect(protectedEdit).toContainText("0.94 g/cm³");
  await protectedEdit.getByRole("button", { name: "Use catalogue value for Density" }).click();
  await expect(visible(page, "#density")).toHaveValue("0.94");

  catalogues.enqueue(extracted({
    density: numeric(0.94),
    productName: text("Conflict-safe PP"),
    chemicalName: text("Polypropylene"),
    chemicalFamily: text("Polyolefin"),
    polymerType: text("Polypropylene"),
    physicalForm: text("Pellets"),
    industry: ["Packaging"],
    minimum_order_quantity: numeric(10),
    stock: numeric(500),
    uom: text("kg"),
    price: numeric(1200),
  }, {
    chemicalFamily: { query: "Polyolefin", tier: "auto", match: { _id: "family-pp", name: "Polyolefin" } },
    polymerType: { query: "Polypropylene", tier: "auto", match: { _id: "polymer-pp", name: "Polypropylene" } },
    physicalForm: { query: "Pellets", tier: "auto", match: { _id: "form-pellet", name: "Pellets" } },
    industry: [{ query: "Packaging", tier: "auto", match: { _id: "industry-packaging", name: "Packaging" } }],
  }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(5);
  await expect(page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true")).toHaveCount(0);
  await expect(visible(page, "#density")).toHaveValue("0.94");

  const incoterm = visible(page, 'button[aria-label="Select Incoterms"]');
  await incoterm.click();
  await page.getByRole("option", { name: "FOB", exact: true }).locator("visible=true").first().click();
  await page.keyboard.press("Escape");
  await page.locator("#productImages-field").locator("visible=true").first().locator('input[type="file"]').setInputFiles({
    name: "mock-product.png",
    mimeType: "image/png",
    buffer: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  });
  await expect(visible(page, "text=1 image uploaded")).toBeVisible();
  await visible(page, 'button:has-text("Create Product")').click();
  await expect.poll(() => savePayload).toBeTruthy();
  expect(savePayload?.density).toBe(0.94);
  expect(savePayload?.productName).toBe("Conflict-safe PP");
  expect(savePayload?.createdVia).toBe("ai");

  await page.route("**/product/conflict-created", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: true, data: persistedProduct(savePayload!, "conflict-created") }),
  }));
  await page.waitForURL(url => url.pathname === "/user/products", { timeout: 5_000 });
  await page.goto("/user/products/conflict-created");
  await expect(page.getByText("Loading...", { exact: true }).locator("visible=true")).toHaveCount(0);
  await visible(page, "#advanced-details-toggle").click();
  await page.locator("button").filter({ hasText: /^Technical Properties/ }).locator("visible=true").first().click();
  await expect(visible(page, "#density")).toHaveValue("0.94");
});

test("M-B edit-mode no-op generation atomically replaces an unresolved conflict and commits its session", async ({ page }) => {
  const catalogues = await installExtractionQueue(page);
  let stored: Record<string, unknown> = {
    productName: "Existing product",
    chemicalName: "Polypropylene",
    density: 0.95,
    industry: [],
    grade: [],
    incoterms: [],
    packagingType: [],
    product_family: [],
    productImages: [],
  };
  const saveAttempts: Record<string, unknown>[] = [];
  let updatePayload: Record<string, unknown> | undefined;
  await page.route("**/product/keep-product", async route => {
    if (route.request().method() === "PUT") {
      const payload = route.request().postDataJSON() as Record<string, unknown>;
      saveAttempts.push(payload);
      if (saveAttempts.length === 1) {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: false }) });
        return;
      }
      updatePayload = payload;
      stored = { ...stored, ...updatePayload };
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: persistedProduct(stored, "keep-product") }),
    });
  });

  await page.goto("/user/products/keep-product");
  await expect(page.getByText("Loading...", { exact: true }).locator("visible=true")).toHaveCount(0);
  await visible(page, "#advanced-details-toggle").click();
  await page.locator("button").filter({ hasText: /^Technical Properties/ }).locator("visible=true").first().click();
  await expect(visible(page, "#density")).toHaveValue("0.95");

  catalogues.enqueue(extracted({ density: numeric(0.92) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(1);
  const reviewConflict = page.getByRole("button", { name: "Review 1 conflict" }).locator("visible=true").first();
  await expect(reviewConflict).toBeEnabled();
  await reviewConflict.click();
  const firstConflict = page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true").first();
  await expect(firstConflict).toContainText("0.92 g/cm³");
  await expect(visible(page, "#density")).toHaveValue("0.95");

  // Generation B equals the live current value. Committing this successful
  // no-op must still replace generation A's unresolved conflict and session.
  catalogues.enqueue(extracted({ density: numeric(0.95) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(2);
  const commitNoOp = page.getByRole("button", { name: "Continue" }).locator("visible=true").first();
  await expect(commitNoOp).toBeEnabled();
  await commitNoOp.click();
  await expect(page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true")).toHaveCount(0);
  await expect(visible(page, "#density")).toHaveValue("0.95");

  // Inspect the explicit-save payload without navigating so this same mounted
  // form can retain the Keep-current save/reload regression below.
  await visible(page, 'button:has-text("Save Changes")').click();
  await expect.poll(() => saveAttempts.length).toBe(1);
  expect(saveAttempts[0].density).toBe(0.95);
  expect(saveAttempts[0].aiSessionId).toBe("conflict-session-2");

  catalogues.enqueue(extracted({ density: numeric(0.91) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(3);
  await page.getByRole("button", { name: "Review 1 conflict" }).locator("visible=true").first().click();
  const differentConflict = page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true").first();
  await expect(differentConflict).toContainText("0.91 g/cm³");
  await differentConflict.getByRole("button", { name: "Keep current value for Density" }).click();

  await visible(page, 'button:has-text("Save Changes")').click();
  await expect.poll(() => updatePayload).toBeTruthy();
  expect(updatePayload?.density).toBe(0.95);
  await page.waitForURL(url => url.pathname === "/user/products", { timeout: 5_000 });
  await page.goto("/user/products/keep-product");
  await expect(page.getByText("Loading...", { exact: true }).locator("visible=true")).toHaveCount(0);
  await visible(page, "#advanced-details-toggle").click();
  await page.locator("button").filter({ hasText: /^Technical Properties/ }).locator("visible=true").first().click();
  await expect(visible(page, "#density")).toHaveValue("0.95");
});

test("M-B replaces stale conflict generations atomically and renders catalogue text literally", async ({ page }) => {
  const catalogues = await installExtractionQueue(page);
  await page.goto("/user/products/add?mode=advanced");
  await seedDensity(page, "0.95");
  await visible(page, "#leadTime").fill("15");

  catalogues.enqueue(extracted({ density: numeric(0.92) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(1);
  await expect(page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true").first()).toBeVisible();

  const literal = '<img src=x onerror="document.body.dataset.xss=1">';
  catalogues.enqueue(extracted({ leadTime: text(literal) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(2);
  await expect(page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true")).toHaveCount(0);
  const literalConflict = page.getByRole("group", { name: "Lead Time: Different value found" }).locator("visible=true").first();
  await expect(literalConflict).toContainText(literal);
  await expect(page.locator("img[src='x']")).toHaveCount(0);
  expect(await page.locator("body").getAttribute("data-xss")).toBeNull();
});

test("M-B conflict comparison and actions reflow to one column with 44px targets on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  const catalogues = await installExtractionQueue(page);
  await page.goto("/user/products/add?mode=advanced");
  await seedDensity(page, "0.95");

  catalogues.enqueue(extracted({ density: numeric(0.92) }));
  await uploadQueuedCatalogue(page, catalogues.completedGenerations);
  await expect.poll(() => catalogues.completedGenerations).toBe(1);

  const conflict = page.getByRole("group", { name: "Density: Different value found" }).locator("visible=true").first();
  const grid = conflict.locator(".grid");
  const keep = conflict.getByRole("button", { name: "Keep current value for Density" });
  const use = conflict.getByRole("button", { name: "Use catalogue value for Density" });
  await expect(grid).toHaveCSS("grid-template-columns", /[0-9.]+px/);
  expect(await keep.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  expect(await use.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  expect(Math.abs((await keep.boundingBox())!.width - (await use.boundingBox())!.width)).toBeLessThan(1);
});

test("M-B manual form remains unchanged when no catalogue is selected", async ({ page }) => {
  await page.goto("/user/products/add?mode=advanced");
  await seedDensity(page, "0.95");
  await expect(visible(page, "#density")).toHaveValue("0.95");
  await expect(page.getByRole("heading", { name: "Needs Your Attention" }).locator("visible=true")).toHaveCount(0);
  await expect(page.getByText("Found in Your Catalogue", { exact: true }).locator("visible=true")).toHaveCount(0);
});
