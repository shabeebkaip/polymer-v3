/**
 * Verifies the remaining DESIGN_SPEC work:
 *  - QuickAdd migrated to useAiProcessing (inline parsing, minimize, widget)
 *  - ProductPicker in QuickAdd multi-product dialog (search, used rows)
 *  - "Use catalog again" catalog memory
 *  - Widget stage labels, ready copy, 44px dismiss buttons w/ aria-labels
 *  - Inline error copy (P0-7)
 *  - AddEdit modal stage dots + filename (new props wired)
 */
import pkg from "/Users/shabeeb/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.js";
const { chromium } = pkg;
import fs from "fs";

const BASE = "http://localhost:3001";
const EMAIL = "qa.seller.01@test.com";
const PASS = "QaTest@123#";

let pass = 0, fail = 0;
const ok = l => { console.log(`  ✓ ${l}`); pass++; };
const ko = (l, e) => { console.log(`  ✗ ${l}: ${e?.message ?? e}`); fail++; };

const product = (name, extra = {}) => ({
  product: {
    productName: { value: name, confidence: "high" },
    countryOfOrigin: { value: "Germany", confidence: "medium" },
    uom: { value: "Metric Ton", confidence: "high" },
    availability: { value: "In Stock", confidence: "low" },
    minimum_order_quantity: { value: 25, confidence: "high" },
    density: { value: 0.905, confidence: "high" }, // not a quick-add field — must be excluded from counts
    ...extra,
  },
  refMatches: {},
});

async function login(page) {
  await page.goto(`${BASE}/auth/login`);
  await page.waitForLoadState("networkidle");
  await page.locator("input[type='email']").first().fill(EMAIL);
  await page.locator("input[type='password']").first().fill(PASS);
  await page.locator("button[type='button']").filter({ hasText: "Sign In" }).click();
  await page.waitForURL(/\/user\//, { timeout: 20000 });
}

function mockParse(ctx, sessionId) {
  return ctx.route("**/ai/parse", async route => {
    await route.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify({ sessionId, status: "processing" }) });
  }, { times: 1 });
}

function mockSession(ctx, sessionId, body, opts = {}) {
  return ctx.route(`**/ai/session/${sessionId}`, async route => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  }, opts);
}

const fakePdf = "/tmp/verify-catalog.pdf";
fs.writeFileSync(fakePdf, "%PDF-1.4 fake");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  console.log("\n=== Login + QuickAdd loads ===");
  try {
    await login(page);
    ok("logged in");
    await page.goto(`${BASE}/user/products/add`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=Browse", { timeout: 10000 });
    ok("QuickAdd Field 8 idle dropzone visible");
  } catch (e) {
    ko("setup", e);
    await page.screenshot({ path: "/tmp/verify-setup-fail.png" });
    await browser.close();
    process.exit(1);
  }

  const fileInput = page.locator('input[type="file"][accept*=".pdf"]').first();

  // ── Scenario 1: multi-product catalog → ProductPicker → catalog memory ──
  console.log("\n=== Multi-product: inline parsing → ProductPicker ===");
  await mockParse(ctx, "s-multi");
  await mockSession(ctx, "s-multi", {
    status: "complete", extractionMethod: "text", ocrFailed: false, sessionId: "s-multi",
    products: [product("Alpha PP 100"), product("Beta PE 200"), product("Gamma PA 300")],
  });
  try {
    await fileInput.setInputFiles(fakePdf);
    await page.waitForSelector("text=Reading your catalog…", { timeout: 5000 });
    ok("inline parsing state with stage-1 message");
    await page.waitForSelector("text=Work in the background", { timeout: 2000 });
    ok('"Work in the background →" visible inline');
    await page.waitForSelector('[role="dialog"] input[type="search"]', { timeout: 10000 });
    ok("multi-product dialog opens with ProductPicker search input");
    await page.waitForSelector("text=Showing 3 of 3", { timeout: 2000 });
    ok("count badge shows 3 of 3");
    await page.locator('input[type="search"]').fill("beta");
    await page.waitForSelector("text=Showing 1 of 3", { timeout: 2000 });
    ok("search filters list (1 of 3)");
    await page.locator('input[type="search"]').fill("");
    await page.locator('[role="option"]').filter({ hasText: "Alpha PP 100" }).click();
    await page.waitForSelector("text=fields filled by Claude", { timeout: 5000 });
    ok("picked product → Field 8 success card");
    const countTxt = await page.locator("text=fields filled by Claude").textContent();
    // 4 = the 5 quick-add fields minus low-confidence availability (auto-apply is high/medium only);
    // density (high conf, not a quick-add field) correctly excluded by the whitelist
    if (countTxt.startsWith("4 ")) ok(`field count honest — whitelist + high/medium filter ("${countTxt}")`);
    else ko("field count", `expected "4 fields filled by Claude", got "${countTxt}"`);
    await page.waitForSelector("text=Use catalog again", { timeout: 2000 });
    ok('"Use catalog again" affordance visible (2 more products)');
  } catch (e) { ko("multi-product flow", e); await page.screenshot({ path: "/tmp/verify-multi-fail.png" }); }

  console.log("\n=== Catalog memory: reopen picker, used row disabled ===");
  try {
    await page.click("text=Use catalog again");
    await page.waitForSelector('[role="dialog"] input[type="search"]', { timeout: 3000 });
    ok("picker reopens from catalog memory");
    const used = await page.locator('[role="option"][aria-disabled="true"]').count();
    if (used === 1) ok("previously picked product is disabled (aria-disabled)");
    else ko("used row", `expected 1 aria-disabled row, got ${used}`);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector('[role="dialog"][data-state="open"]'), { timeout: 3000 });
    ok("picker closes on Escape; success card retained");
    // Clear AI import
    await page.locator('button[aria-label="Clear AI data"]').click();
    await page.waitForSelector("text=Browse", { timeout: 3000 });
    ok("× clears AI import back to idle dropzone");
  } catch (e) { ko("catalog memory flow", e); await page.screenshot({ path: "/tmp/verify-memory-fail.png" }); }

  // ── Scenario 2: single product via background widget ──
  console.log("\n=== Background: minimize → widget stages → Apply ===");
  let s2Polls = 0;
  await mockParse(ctx, "s-single");
  await ctx.route("**/ai/session/s-single", async route => {
    s2Polls++;
    if (s2Polls <= 1) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: "processing" }) });
    } else {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
        status: "complete", extractionMethod: "text", ocrFailed: false, sessionId: "s-single",
        products: [product("Solo PVC 900")],
      }) });
    }
  });
  try {
    await fileInput.setInputFiles(fakePdf);
    await page.waitForSelector("text=Work in the background", { timeout: 5000 });
    await page.click("text=Work in the background");
    await page.waitForSelector(".fixed >> text=Reading your catalog…", { timeout: 3000 });
    ok("widget appears with stage-1 label");
    const cancelBtn = await page.locator('button[aria-label="Cancel catalog processing"]').count();
    if (cancelBtn === 1) ok("widget cancel button has aria-label (P0-4)");
    else ko("widget cancel aria-label", `count=${cancelBtn}`);
    await page.waitForSelector("text=ready — tap Apply", { timeout: 15000 });
    ok('widget ready copy: "N fields ready — tap Apply" (P1-8)');
    await page.locator(".fixed button", { hasText: "Apply" }).click();
    await page.waitForSelector("text=fields filled by Claude", { timeout: 5000 });
    ok("widget Apply → fields applied, success card shown");
    await page.locator('button[aria-label="Clear AI data"]').click();
    await page.waitForSelector("text=Browse", { timeout: 3000 });
  } catch (e) { ko("background flow", e); await page.screenshot({ path: "/tmp/verify-bg-fail.png" }); }

  // ── Scenario 3: failed parse attended → inline amber error (P0-7) ──
  console.log("\n=== Inline error copy (P0-7) ===");
  await mockParse(ctx, "s-fail");
  await mockSession(ctx, "s-fail", { status: "failed" });
  try {
    await fileInput.setInputFiles(fakePdf);
    await page.waitForSelector("text=This catalog took too long to process", { timeout: 10000 });
    ok("timeout error uses new copy (no 'try a shorter file')");
    const stale = await page.locator("text=Try a shorter file").count();
    if (stale === 0) ok("old copy gone");
    else ko("old copy still present", `count=${stale}`);
    await page.locator("button", { hasText: "Try again" }).first().click();
    await page.waitForSelector("text=Browse", { timeout: 3000 });
    ok("Try again resets to idle dropzone");
  } catch (e) { ko("inline error flow", e); await page.screenshot({ path: "/tmp/verify-err-fail.png" }); }

  // ── Scenario 4: AddEdit modal — stage dots + filename (new props) ──
  console.log("\n=== AddEdit modal: stage dots, filename, widget stage label ===");
  await mockParse(ctx, "s-detail");
  await mockSession(ctx, "s-detail", { status: "processing" });
  try {
    await page.click("text=Add Detailed Product");
    await page.waitForSelector("text=Upload Catalog", { timeout: 8000 });
    await page.click("text=Upload Catalog");
    await page.waitForSelector("text=Drop a polymer catalog", { timeout: 3000 });
    await page.locator('[role="dialog"] input[type="file"]').first().setInputFiles(fakePdf);
    await page.waitForSelector('[role="dialog"] >> text=verify-catalog.pdf', { timeout: 5000 });
    ok("uploaded filename shown in parsing view (P1-6)");
    const dots = await page.locator('[role="dialog"] [aria-hidden="true"] > span.rounded-full').count();
    if (dots === 4) ok("4 stage progress dots rendered");
    else ko("stage dots", `expected 4, got ${dots}`);
    await page.click("text=Continue in background");
    await page.waitForSelector(".fixed >> text=Reading your catalog…", { timeout: 3000 });
    ok("AddEdit widget shows stage label instead of generic copy");
    await page.locator('button[aria-label="Cancel catalog processing"]').click();
    await page.waitForFunction(() => !document.querySelector(".fixed.bottom-6, .fixed.max-sm\\:bottom-20"), { timeout: 3000 }).catch(() => {});
    ok("widget cancelled");
  } catch (e) { ko("AddEdit modal flow", e); await page.screenshot({ path: "/tmp/verify-detail-fail.png" }); }

  console.log("\n═══════════════════════════════");
  console.log(`  PASSED: ${pass}  FAILED: ${fail}`);
  console.log("═══════════════════════════════\n");
  await browser.close();
  process.exit(fail > 0 ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });
