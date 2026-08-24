import { expect, Page, test } from "@playwright/test";
import { requireE2ECredentials } from "./test-config";

async function login(page: Page) {
  const { email, password } = requireE2ECredentials();
  await page.goto("/auth/login");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/user\/dashboard/, { timeout: 15_000 });
}

function visible(page: Page, selector: string) {
  return page.locator(selector).locator("visible=true").first();
}

async function mockDropdown(page: Page, endpoint: string, data: Array<{ _id: string; name: string }>) {
  await page.route(`**/${endpoint}/list`, route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ success: true, data }),
  }));
}

async function selectMultiSelectOptionByKeyboard(page: Page, triggerName: string, optionName: string) {
  const trigger = visible(page, `button[aria-label="${triggerName}"]`);
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const option = page.getByRole("option", { name: optionName, exact: true }).locator("visible=true").first();
  await expect(page.getByRole("textbox", { name: new RegExp(`Search ${triggerName} options`, "i") }).locator("visible=true").first()).toBeFocused();
  await page.keyboard.type(optionName);
  await page.keyboard.press("Tab");
  await expect(option).toBeFocused();
  await page.keyboard.press("Space");
  await expect(option).toHaveAttribute("aria-selected", "true");
  await expect(trigger).toContainText(optionName);

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
}

test("unit-bearing logistics values remain editable, labelled, unique, and reach the save payload; Grade works by keyboard", async ({ page }) => {
  await login(page);

  await Promise.all([
    mockDropdown(page, "chemical-family", [{ _id: "family-pp", name: "Polyolefin" }]),
    mockDropdown(page, "product-family", []),
    mockDropdown(page, "polymer-type", [{ _id: "polymer-pp", name: "Polypropylene" }]),
    mockDropdown(page, "industry", [{ _id: "industry-packaging", name: "Packaging" }]),
    mockDropdown(page, "physical-form", [{ _id: "form-pellet", name: "Pellets" }]),
    mockDropdown(page, "grade", [
      { _id: "grade-25", name: "Mock Grade 25" },
      { _id: "grade-50", name: "Mock Grade 50" },
    ]),
    mockDropdown(page, "incoterm", [{ _id: "incoterm-fob", name: "FOB" }]),
    mockDropdown(page, "payment-terms", []),
    mockDropdown(page, "packaging-type", []),
  ]);

  await page.route("**/ai/parse", route => route.fulfill({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({ sessionId: "unit-bearing-session", status: "processing" }),
  }));
  await page.route("**/ai/session/unit-bearing-session", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      status: "complete",
      extractionMethod: "text",
      sessionId: "unit-bearing-session",
      ocrFailed: false,
      products: [{
        product: {
          productName: { value: "Mock Unit-Bearing Product", confidence: "high" },
          chemicalName: { value: "Polypropylene", confidence: "high" },
          description: { value: "Representative textarea value", confidence: "high" },
          materialType: { value: "Virgin", confidence: "high" },
          chemicalFamily: { value: "Polyolefin", confidence: "high" },
          polymerType: { value: "Polypropylene", confidence: "high" },
          physicalForm: { value: "Pellets", confidence: "high" },
          industry: ["Packaging"],
          grade: ["Mock Grade 25"],
          minimum_order_quantity: { value: 10, confidence: "high" },
          stock: { value: 500, confidence: "high" },
          price: { value: 1200, confidence: "high" },
          leadTime: { value: "15-20 days", confidence: "high" },
          packagingWeight: { value: "25 kg", confidence: "high" },
          density: { value: 0.91, confidence: "high" },
          recyclable: true,
        },
        refMatches: {
          chemicalFamily: { query: "Polyolefin", tier: "auto", match: { _id: "family-pp", name: "Polyolefin" } },
          polymerType: { query: "Polypropylene", tier: "auto", match: { _id: "polymer-pp", name: "Polypropylene" } },
          physicalForm: { query: "Pellets", tier: "auto", match: { _id: "form-pellet", name: "Pellets" } },
          industry: [{ query: "Packaging", tier: "auto", match: { _id: "industry-packaging", name: "Packaging" } }],
          grade: [{ query: "Mock Grade 25", tier: "auto", match: { _id: "grade-25", name: "Mock Grade 25" } }],
        },
      }],
    }),
  }));
  await page.route("**/file/upload", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ id: "mock-image", fileUrl: "data:image/png;base64,iVBORw0KGgo=" }),
  }));

  let savePayload: Record<string, unknown> | undefined;
  await page.route("**/product/create", async route => {
    savePayload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: { _id: "mock-created-product" } }),
    });
  });

  await page.goto("/user/products/add?mode=advanced");
  const dropzone = page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first();
  await dropzone.locator('input[type="file"]').setInputFiles({
    name: "unit-bearing.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 deterministic fixture"),
  });
  await expect(visible(page, "text=fields found")).toBeVisible({ timeout: 15_000 });

  const cardLabels = page.locator('div[class*="bg-teal-50/20"] label').locator("visible=true");
  for (let index = 0; index < await cardLabels.count(); index += 1) {
    const label = cardLabels.nth(index);
    const htmlFor = await label.getAttribute("for");
    if (htmlFor) {
      const control = page.locator(`[id="${htmlFor}"]`);
      expect(await control.count()).toBe(1);
      await expect(control).not.toHaveAccessibleName("");
    } else {
      const labelId = await label.getAttribute("id");
      expect(labelId).toBeTruthy();
      expect(await page.locator(`[aria-labelledby="${labelId}"]`).count()).toBe(1);
    }
  }

  const leadLabel = page.locator("label").filter({ hasText: /^Lead Time/ }).locator("visible=true").first();
  const packagingLabel = page.locator("label").filter({ hasText: /^Packaging Weight/ }).locator("visible=true").first();
  const leadId = await leadLabel.getAttribute("for");
  const packagingId = await packagingLabel.getAttribute("for");
  expect(leadId).toBeTruthy();
  expect(packagingId).toBeTruthy();

  const leadInput = page.locator(`[id="${leadId}"]`);
  const packagingInput = page.locator(`[id="${packagingId}"]`);
  await expect(leadInput).toHaveAttribute("type", "text");
  await expect(packagingInput).toHaveAttribute("type", "text");
  await expect(leadInput).toHaveValue("15-20 days");
  await expect(packagingInput).toHaveValue("25 kg");
  await expect(leadInput).toBeEditable();
  await expect(packagingInput).toBeEditable();
  expect(await page.locator(`[id="${leadId}"]`).count()).toBe(1);
  expect(await page.locator(`[id="${packagingId}"]`).count()).toBe(1);

  const gradeLabel = page.locator("label").filter({ hasText: /^Grade/ }).locator("visible=true").first();
  const gradeId = await gradeLabel.getAttribute("for");
  expect(gradeId).toBeTruthy();
  const gradeTrigger = page.locator(`[id="${gradeId}"]`);
  await expect(gradeTrigger).toHaveRole("button");
  await expect(gradeTrigger).toHaveAccessibleName(/Grade/);
  await expect(gradeTrigger).toHaveAttribute("aria-expanded", "false");
  await gradeTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(gradeTrigger).toHaveAttribute("aria-expanded", "true");
  const gradeOption = page.getByRole("option", { name: "Mock Grade 50", exact: true }).locator("visible=true").first();
  await expect(page.getByRole("textbox", { name: "Search Select applicable grades options" }).locator("visible=true").first()).toBeFocused();
  await page.keyboard.type("Mock Grade 50");
  await page.keyboard.press("Tab");
  await expect(gradeOption).toBeFocused();
  await page.keyboard.press("Enter");

  await leadInput.fill("21-28 days");
  await packagingInput.fill("20 kg bags");

  const incotermTrigger = visible(page, 'button[aria-label="Select Incoterms"]');
  await incotermTrigger.focus();
  await page.keyboard.press("Enter");
  const incotermOption = page.getByRole("option", { name: "FOB", exact: true }).locator("visible=true").first();
  await incotermOption.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");

  const imageInput = page.locator("#productImages-field").locator("visible=true").first().locator('input[type="file"]');
  await imageInput.setInputFiles({
    name: "mock-product.png",
    mimeType: "image/png",
    buffer: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  });
  await expect(visible(page, "text=1 image uploaded")).toBeVisible();

  await visible(page, 'button:has-text("Create Product")').click();
  await expect.poll(() => savePayload).toBeTruthy();
  expect(savePayload?.leadTime).toBe("21-28 days");
  expect(savePayload?.packagingWeight).toBe("20 kg bags");
  expect(savePayload?.grade).toEqual(["grade-25", "grade-50"]);
});

test("shared MultiSelect remains keyboard-operable for Industries, Product Families, Incoterms, and Packaging Type", async ({ page }) => {
  await login(page);

  await Promise.all([
    mockDropdown(page, "chemical-family", []),
    mockDropdown(page, "product-family", [{ _id: "family-film", name: "Film Family" }]),
    mockDropdown(page, "polymer-type", []),
    mockDropdown(page, "industry", [{ _id: "industry-automotive", name: "Automotive" }]),
    mockDropdown(page, "physical-form", []),
    mockDropdown(page, "grade", []),
    mockDropdown(page, "incoterm", [{ _id: "incoterm-cif", name: "CIF" }]),
    mockDropdown(page, "payment-terms", []),
    mockDropdown(page, "packaging-type", [{ _id: "packaging-bag", name: "Bag" }]),
  ]);

  await page.goto("/user/products/add?mode=advanced");

  await selectMultiSelectOptionByKeyboard(page, "Select Industries", "Automotive");
  await selectMultiSelectOptionByKeyboard(page, "Select Incoterms", "CIF");

  await visible(page, 'button:has-text("Advanced & Optional Details")').click();
  await selectMultiSelectOptionByKeyboard(page, "Select Product Families", "Film Family");

  await page.locator("button").filter({ hasText: "Provide packaging and pallet information" }).locator("visible=true").first().click();
  await selectMultiSelectOptionByKeyboard(page, "Select packaging types", "Bag");
});
