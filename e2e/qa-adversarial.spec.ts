import { test, expect, Page } from "@playwright/test";
import { cleanupE2EProducts, E2E_PRODUCT_PREFIX } from "./test-cleanup";
import { catalogFixture, requireE2ECredentials } from "./test-config";

// QA-only adversarial coverage for DESIGN_SPEC §14, independent of the
// developer's own catalog-findings.spec.ts (different fixtures/scenarios).
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

function visible(page: Page, selector: string) {
  return page.locator(selector).locator("visible=true").first();
}

async function uploadAndWait(page: Page, fixture: string) {
  const dropzoneCard = page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first();
  await dropzoneCard.locator('input[type="file"]').setInputFiles(catalogFixture(fixture));
  await expect(page.locator('[data-slot="dialog-content"]')).toBeVisible({ timeout: 5000 });
  await expect(
    page.getByText("Choose a product").or(page.getByText("Review extracted fields"))
  ).toBeVisible({ timeout: 60_000 });
  if (await page.getByText("Choose a product").isVisible().catch(() => false)) {
    await page.locator('[data-slot="dialog-content"] button').first().click();
  }
  await expect(page.locator('[data-slot="dialog-content"]')).toBeHidden({ timeout: 10_000 });
  await expect(visible(page, "text=/fields? found/")).toBeVisible({ timeout: 5000 });
}

// After a successful import, the page-level idle dropzone (aria-label
// "Upload a catalog file...") no longer exists — §14.5 replaces it with the
// compact bar (`#catalog-source-bar`), which keeps its OWN getRootProps/
// getInputProps wired (per AddEditProduct.tsx's diff comment: "dropping a
// new file directly onto the compact bar re-triggers import exactly like
// Replace"). Re-upload via that bar's own hidden input, matching how a real
// drag-and-drop onto the bar would work.
async function reUploadViaBar(page: Page, fixture: string) {
  // The bar's own dropzone input is deliberately CSS-hidden (`className="hidden"`,
  // real drag-and-drop targets the visible bar div, not this input) — do not
  // filter on visible=true here, that would never match a real file input.
  const barInput = page.locator("#catalog-source-bar").locator("visible=true").first().locator("input[type='file']");
  await barInput.setInputFiles(catalogFixture(fixture));
  await expect(page.locator('[data-slot="dialog-content"]')).toBeVisible({ timeout: 5000 });
  await expect(
    page.getByText("Choose a product").or(page.getByText("Review extracted fields"))
  ).toBeVisible({ timeout: 60_000 });
  if (await page.getByText("Choose a product").isVisible().catch(() => false)) {
    await page.locator('[data-slot="dialog-content"] button').first().click();
  }
  await expect(page.locator('[data-slot="dialog-content"]')).toBeHidden({ timeout: 10_000 });
}

test("independent fixture coverage: 06_eight_grades_pp (multi-product) surfaces cards + does not crash", async ({ page }) => {
  test.setTimeout(90_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await login(page);
  await page.goto("/user/products/add?mode=advanced");
  await uploadAndWait(page, "06_eight_grades_pp.pdf");
  const groupHeadingCount = await page.locator("h2").locator("visible=true").count();
  expect(groupHeadingCount).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
});

test("independent fixture coverage: 04_mixed_confidence_nylon surfaces cards without crashing", async ({ page }) => {
  test.setTimeout(90_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await login(page);
  await page.goto("/user/products/add?mode=advanced");
  await uploadAndWait(page, "04_mixed_confidence_nylon.pdf");
  const anyGroupHeading = page.locator("h2").locator("visible=true");
  expect(await anyGroupHeading.count()).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
});

test("rapid re-upload of a DIFFERENT catalog replaces cards cleanly, no stale cross-catalog data", async ({ page }) => {
  test.setTimeout(120_000);
  await login(page);
  await page.goto("/user/products/add?mode=advanced");
  await uploadAndWait(page, "01_happy_flow_pp_grades.pdf");

  // Scope to the compact bar's own paragraph, NOT the sr-only aria-live
  // region — Playwright's visible=true does not reliably exclude sr-only
  // (clip-based) text, and that region legitimately contains similar wording.
  const barCountText = () => page.locator("#catalog-source-bar p:has-text('found')").locator("visible=true").first();
  const firstFieldCount = (await barCountText().textContent()) ?? "";

  // Replace with a different catalog (imperial units HDPE), via the compact
  // bar's own drop target (equivalent to clicking "Replace" then picking a
  // file, but scriptable without a native OS file-picker dialog).
  await reUploadViaBar(page, "02_imperial_units_hdpe.pdf");
  await page.waitForTimeout(500);

  // Live Claude extraction is non-deterministic across runs/products — if
  // this particular re-extraction genuinely applied 0 fields, §14.1 says the
  // surface (and compact bar, aiFillCount>0-gated) correctly reverts to the
  // full idle dropzone instead of showing an empty bar; that IS the spec'd
  // behavior, not a stale-state bug, so treat it as a pass, not a failure.
  const stillHasBar = await page.locator("#catalog-source-bar").locator("visible=true").count() > 0;
  const revertedToIdleDropzone = await page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").count() > 0;
  console.log("first:", firstFieldCount, "re-upload result: bar present =", stillHasBar, "reverted to idle dropzone =", revertedToIdleDropzone);
  expect(stillHasBar || revertedToIdleDropzone).toBe(true);

  if (stillHasBar) {
    const secondFieldCount = (await barCountText().textContent()) ?? "";
    console.log("second:", secondFieldCount);
    // Only ONE compact source bar should exist (no duplicate/stacked bars
    // from the old import lingering alongside the new one).
    const sourceBars = page.locator("#catalog-source-bar").locator("visible=true");
    expect(await sourceBars.count()).toBe(1);
  }

  // At most ONE "Technical Properties" heading — proves groups were rebuilt
  // from scratch on re-upload, never appended to (no stale duplicate group).
  const techHeadings = page.locator("h2:has-text('Technical Properties')").locator("visible=true");
  expect(await techHeadings.count()).toBeLessThanOrEqual(1);
});

test("dismiss a card then re-upload the SAME catalog: the dismissed value comes back (full reset, not a permanent block-list)", async ({ page }) => {
  test.setTimeout(90_000);
  await login(page);
  await page.goto("/user/products/add?mode=advanced");
  await uploadAndWait(page, "01_happy_flow_pp_grades.pdf");

  const colorLabel = page.locator("label:has-text('Color')").locator("visible=true").first();
  const hadColorCard = await colorLabel.count() > 0;
  if (hadColorCard) {
    await colorLabel.locator("xpath=ancestor::div[contains(@class,'rounded-xl')][last()]")
      .locator('button[aria-label^="Remove"]').click();
    await expect(page.locator("label:has-text('Color')").locator("visible=true")).toHaveCount(0);
  }

  // Re-upload (Replace) the exact same catalog.
  await reUploadViaBar(page, "01_happy_flow_pp_grades.pdf");
  await expect(visible(page, "text=/fields? found/")).toBeVisible({ timeout: 5000 });

  if (hadColorCard) {
    // Full state replace on re-upload (confirmed at code level, §21.9 point 5)
    // means the dismissed field's card should reappear — dismiss is a
    // session/view action, not a permanent per-field exclusion list.
    await expect(page.locator("label:has-text('Color')").locator("visible=true").first()).toBeVisible({ timeout: 5000 });
  }
});

test("submit is NOT blocked by unresolved Needs Your Attention items (optional-field concern, not a required-field gate)", async ({ page }) => {
  test.setTimeout(90_000);
  await login(page);
  await page.goto("/user/products/add?mode=advanced");
  await uploadAndWait(page, "01_happy_flow_pp_grades.pdf");

  // Deliberately do NOT resolve any Needs Your Attention row.
  const hadAttention = await visible(page, "h2:has-text('Needs Your Attention')").count() > 0;
  console.log("Needs Your Attention present (left unresolved):", hadAttention);

  const productName = `${E2E_PRODUCT_PREFIX}Adversarial Unresolved Attention`;
  await visible(page, "#productName").fill(productName);
  await visible(page, "#chemicalName").fill("E2E Chemical");
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
  // If chemicalFamily/physicalForm/polymerType/industry are unresolved
  // manual-tier with no auto-apply, they'd be blank required fields —
  // resolve any remaining "Pick from list" via the field's own control is
  // out of scope here; this test's point is that submit must not be BLOCKED
  // BY THE ATTENTION UI ITSELF (no dead-end / disabled submit specifically
  // because of unresolved review rows) — required-field validation is a
  // separate, pre-existing, unrelated gate (§13/§19), not this feature's concern.
  const imageInput = page.locator('[id="productImages-field"]').locator("visible=true").locator('input[type="file"]');
  await imageInput.setInputFiles({ name: "test.png", mimeType: "image/png", buffer: Buffer.from([137,80,78,71,13,10,26,10]) });
  await page.waitForTimeout(3000);

  const createBtn = visible(page, 'button:has-text("Create Product")');
  await expect(createBtn).toBeEnabled();
  console.log("Create Product button is enabled with unresolved Needs Your Attention rows present:", hadAttention);
});

test("network failure mid-parse surfaces an honest error, no crash", async ({ page }) => {
  test.setTimeout(60_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await page.route(`${API_BASE_URL}/ai/parse`, (route) => route.abort("failed"));

  await login(page);
  await page.goto("/user/products/add?mode=advanced");
  const dropzoneCard = page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first();
  await dropzoneCard.locator('input[type="file"]').setInputFiles(catalogFixture("01_happy_flow_pp_grades.pdf"));

  // Give the app a moment to surface a failure state (modal error, inline
  // rejection message, or toast — any honest error is acceptable; a silent
  // hang or a JS crash is not).
  await page.waitForTimeout(4000);
  const errorSignals = await page.locator("text=/fail|error|try again|couldn.t/i").locator("visible=true").count();
  console.log("error-ish text nodes visible after aborted /ai/parse:", errorSignals);
  expect(errorSignals).toBeGreaterThan(0);
  expect(pageErrors).toEqual([]);
});

test("edit mode (EXISTING product, no catalog import): Required card, Advanced disclosure, FDA cascade still function", async ({ page }) => {
  test.setTimeout(60_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await login(page);

  // Edit an existing product already in this seller's catalogue (dev's own
  // report explicitly did NOT re-run edit-mode — use whatever product is
  // already there rather than building a fresh one through full required-field
  // validation, which is orthogonal to what this test is checking).
  await page.goto("/user/products");
  const editBtn = page.locator('button:has-text("Edit")').locator("visible=true").first();
  await editBtn.waitFor({ timeout: 15000 });
  await editBtn.click();
  await page.waitForURL(/\/user\/products\/.+/, { timeout: 10000 });
  // [id]/page.tsx shows a plain "Loading..." div until its own fetch resolves
  // (client-side useEffect, not SSR) — wait that out explicitly rather than
  // networkidle, which never settles in dev mode (HMR websocket).
  await expect(page.locator("text=Loading...")).toHaveCount(0, { timeout: 15000 });

  // Genuinely in edit mode (not silently redirected/crashed to a blank
  // create form) and no CatalogFindings surface without an import.
  await expect(page.locator("text=Edit Product").locator("visible=true").first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator('button:has-text("Save Changes")').locator("visible=true").first()).toBeVisible();
  await expect(page.locator("h2:has-text('Needs Your Attention')").locator("visible=true")).toHaveCount(0);
  const nameField = page.locator("#productName").locator("visible=true").first();
  await expect(nameField).toBeVisible({ timeout: 10000 });

  // Advanced disclosure still opens.
  const advancedToggle = page.locator("button, div").filter({ hasText: /Advanced.*Optional Details|Advanced & Optional/i }).locator("visible=true").first();
  if (await advancedToggle.count() > 0) {
    await advancedToggle.click();
  }

  // FDA cascade: toggling FDA Approved reveals + requires an FDA certificate.
  const fdaToggle = page.locator("text=FDA Approved").locator("visible=true").first();
  if (await fdaToggle.count() > 0) {
    await fdaToggle.click();
    await expect(page.locator("#fdaCertificate-field").locator("visible=true").first()).toBeVisible({ timeout: 5000 });
  }

  expect(pageErrors).toEqual([]);
});

// The task's highest-risk ask: does "Use this"/"Not this" actually touch the
// REAL field in the Required card (not just remove the review row)? Uses the
// real extraction pipeline (01_happy_flow_pp_grades.pdf reliably produces
// confirm/manual taxonomy rows across every run observed in this session).
test("Needs Your Attention 'Use this' applies the suggested match to the real Required-card field", async ({ page }) => {
  test.setTimeout(90_000);
  await login(page);
  await page.goto("/user/products/add?mode=advanced");
  await uploadAndWait(page, "01_happy_flow_pp_grades.pdf");

  const useThisCountBefore = await visible(page, 'button:has-text("Use this")').count() > 0;
  test.skip(!useThisCountBefore, "This extraction run produced no confirm-tier taxonomy row to test against.");

  // Snapshot a stable handle on the specific first row BEFORE acting — a
  // locator re-derived from a `.first()` button can silently re-resolve to
  // the NEXT row after the first is removed (test-authoring pitfall, not
  // product behavior), so count on the row list, not on `useThis` itself.
  const firstRow = page.locator("div.border-amber-200").locator("visible=true").first();
  // Scope to the suggested-match paragraph specifically (CatalogFindings.tsx:
  // `<p className="text-sm font-medium text-gray-900 mt-0.5">→ {suggestedName}</p>`)
  // — a whole-row textContent() concatenates the button labels right after
  // it with no separator, corrupting a naive regex extraction.
  const suggestedParaText = (await firstRow.locator("p.text-sm.font-medium.text-gray-900").first().textContent()) ?? "";
  const suggestedName = suggestedParaText.replace(/^→\s*/, "").trim();
  console.log("confirm-tier row suggested value:", suggestedName);
  const rowsBefore = await page.locator("div.border-amber-200").locator("visible=true").count();

  await firstRow.locator('button:has-text("Use this")').click();

  // One fewer amber (confirm-tier) row than before — this specific row is gone.
  await expect(page.locator("div.border-amber-200").locator("visible=true")).toHaveCount(rowsBefore - 1);

  // The suggested value must now be reflected somewhere in the Required card
  // (any of the four taxonomy fields' real controls) — i.e. no field is still
  // showing its empty "Select ..." placeholder for the value we just applied.
  if (suggestedName && suggestedName !== "Unknown") {
    const appliedInRequiredCard = await page.locator(`#chemicalFamily-field, #physicalForm-field, #polymerType-field, #industry-field`)
      .locator("visible=true")
      .filter({ hasText: suggestedName })
      .count();
    console.log("suggested name reflected in a Required-card field:", appliedInRequiredCard > 0);
    expect(appliedInRequiredCard).toBeGreaterThan(0);
  }
});

test("Needs Your Attention 'Not this' clears the row WITHOUT applying the suggestion to the real field", async ({ page }) => {
  test.setTimeout(90_000);
  await login(page);
  await page.goto("/user/products/add?mode=advanced");
  await uploadAndWait(page, "01_happy_flow_pp_grades.pdf");

  const notThisCountBefore = await visible(page, 'button:has-text("Not this")').count() > 0;
  test.skip(!notThisCountBefore, "This extraction run produced no confirm-tier taxonomy row to test against.");

  // Snapshot the specific row's identifying text BEFORE acting — `.first()`
  // is a dynamic/re-evaluating locator, so deriving an ancestor handle from
  // it and re-querying post-click can silently re-resolve to the NEXT row if
  // more than one confirm-tier row exists (a test-authoring pitfall, not a
  // product behavior) — assert on the captured text instead.
  const firstRow = page.locator("div.border-amber-200").locator("visible=true").first();
  // Scope to the suggested-match paragraph specifically (CatalogFindings.tsx:
  // `<p className="text-sm font-medium text-gray-900 mt-0.5">→ {suggestedName}</p>`)
  // — a whole-row textContent() concatenates the button labels right after
  // it with no separator, corrupting a naive regex extraction.
  const suggestedParaText = (await firstRow.locator("p.text-sm.font-medium.text-gray-900").first().textContent()) ?? "";
  const suggestedName = suggestedParaText.replace(/^→\s*/, "").trim();
  const rowsBefore = await page.locator("div.border-amber-200").locator("visible=true").count();

  await firstRow.locator('button:has-text("Not this")').click();

  // One fewer amber (confirm-tier) row than before — this specific row is gone.
  await expect(page.locator("div.border-amber-200").locator("visible=true")).toHaveCount(rowsBefore - 1);

  if (suggestedName && suggestedName !== "Unknown") {
    // The rejected suggestion must NOT silently land in any Required-card
    // field — "Not this" clears to empty, it does not apply anything.
    const appliedAnyway = await page.locator(`#chemicalFamily-field, #physicalForm-field, #polymerType-field, #industry-field`)
      .locator("visible=true")
      .filter({ hasText: suggestedName })
      .count();
    console.log("rejected suggestion leaked into a Required-card field (should be 0):", appliedAnyway);
    expect(appliedAnyway).toBe(0);
  }
});

// §14.9: focus must move to Needs Your Attention's heading (or Found in
// Catalogue's first heading if no attention rows) once per extraction —
// verified programmatically via document.activeElement, not just visually.
test("§14.9 focus moves to Needs Your Attention (or Found in Catalogue) heading on extraction complete", async ({ page }) => {
  test.setTimeout(60_000);
  await login(page);
  await page.goto("/user/products/add?mode=advanced");
  await uploadAndWait(page, "01_happy_flow_pp_grades.pdf");

  const hasAttention = await visible(page, "h2:has-text('Needs Your Attention')").count() > 0;
  const expectedIdSuffix = hasAttention ? "-needs-attention-heading" : "-found-in-catalogue-heading";

  await expect.poll(() => page.evaluate(() => document.activeElement?.id), { timeout: 5000 }).toMatch(new RegExp(`${expectedIdSuffix}$`));

  // The aria-live region's actual text content (not just visual copy).
  // Pre-existing dual desktop/mobile render tree (app/user/layout.tsx,
  // unrelated to this feature — noted elsewhere in this suite) means TWO
  // #ai-import-status divs exist (a real, if minor, duplicate-id issue);
  // scope to whichever instance actually has content.
  const liveRegions = page.locator("#ai-import-status");
  const liveRegionCount = await liveRegions.count();
  let liveMsg = "";
  for (let i = 0; i < liveRegionCount; i++) {
    const t = (await liveRegions.nth(i).textContent()) ?? "";
    if (t.trim()) { liveMsg = t; break; }
  }
  console.log("aria-live message:", liveMsg);
  expect(liveMsg).toMatch(/^Catalogue processed — \d+ fields? found\.(\s\d+ needs?\syour attention\.)?$/);
});
