import { test, expect, Page } from "@playwright/test";

// QA-only, adversarial: mock /ai/parse + /ai/session/:id so we can inject a
// malicious `query` string into a manual-tier taxonomy refMatch without
// needing a crafted PDF fixture. Confirms CatalogFindings renders raw
// catalogue text as literal text, never HTML/markdown/script execution.
const EMAIL = "qa.seller.01@test.com";
const PASSWORD = "QaTest@123#";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api";
const XSS_PAYLOAD = '<script>window.__qa_xss_fired = true;</script><img src=x onerror="window.__qa_xss_fired_img = true">';

async function login(page: Page) {
  await page.goto("/auth/login");
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/user\/dashboard/, { timeout: 15000 });
}

test("XSS: manual-tier taxonomy raw query text renders as literal text, never executes", async ({ page }) => {
  test.setTimeout(60_000);
  const dialogs: string[] = [];
  page.on("dialog", (d) => { dialogs.push(d.message()); d.dismiss(); });

  let sawParse = false;
  await page.route(`${API_BASE_URL}/ai/parse`, async (route) => {
    sawParse = true;
    await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ sessionId: "qa-xss-session", status: "processing" }) });
  });
  await page.route(`${API_BASE_URL}/ai/session/qa-xss-session`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "complete",
        extractionMethod: "text",
        sessionId: "qa-xss-session",
        ocrFailed: false,
        products: [
          {
            product: {
              productName: { value: "QA XSS Test Product", confidence: "high" },
              chemicalName: { value: "QA Chemical", confidence: "high" },
            },
            refMatches: {
              chemicalFamily: { query: XSS_PAYLOAD, tier: "manual", match: null },
              physicalForm: { query: XSS_PAYLOAD, tier: "confirm", match: { _id: "fakeid123", name: "Suggested <b>Bold</b> Name" } },
            },
          },
        ],
      }),
    });
  });

  await login(page);
  await page.goto("/user/products/add?mode=advanced");

  const dropzoneCard = page.locator('[aria-label^="Upload a catalog file"]').locator("visible=true").first();
  // Any valid small file triggers the upload flow; the mocked routes above
  // intercept before it reaches the real backend/Claude.
  await dropzoneCard.locator('input[type="file"]').setInputFiles({
    name: "fake.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 fake"),
  });

  await expect(page.locator("text=fields found").locator("visible=true").first()).toBeVisible({ timeout: 15_000 });
  expect(sawParse).toBe(true);

  // Needs Your Attention should show both rows (manual + confirm).
  const needsAttention = page.locator("text=Needs Your Attention").locator("visible=true").first();
  await expect(needsAttention).toBeVisible();

  // The literal payload string must appear as visible TEXT content.
  const bodyText = await page.locator("body").innerText();
  expect(bodyText).toContain(XSS_PAYLOAD.slice(0, 30)); // truncated to 120 chars server-side is fine, this is well under

  // Confirm no script executed.
  const xssFired = await page.evaluate(() => (window as unknown as { __qa_xss_fired?: boolean }).__qa_xss_fired);
  const xssFiredImg = await page.evaluate(() => (window as unknown as { __qa_xss_fired_img?: boolean }).__qa_xss_fired_img);
  expect(xssFired).toBeFalsy();
  expect(xssFiredImg).toBeFalsy();
  expect(dialogs).toEqual([]);

  // Confirm no raw <script> or <img onerror> tag actually landed in the DOM
  // as an element (i.e. it's plain text, not innerHTML'd).
  const scriptTagCount = await page.locator('script:has-text("__qa_xss_fired")').count();
  expect(scriptTagCount).toBe(0);

  // Confirm the "suggested match" HTML-looking string in a confirm-tier row
  // also renders as literal text (no <b> tag actually created from it).
  const boldFromPayload = await page.locator("b:has-text('Bold')").count();
  expect(boldFromPayload).toBe(0);
  expect(bodyText).toContain("Suggested <b>Bold</b> Name");

  await page.screenshot({ path: "/private/tmp/claude-501/-Users-shabeeb-Documents-Shab-co-polymersHub/31f2cb6c-e036-4945-bb51-42ae7aeec21c/scratchpad/xss-check.png", fullPage: true });
});
