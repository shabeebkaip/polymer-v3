import type { Page } from "@playwright/test";

// W2 (docs/PROJECT_PLAN.md §16): e2e-created products must self-clean so the
// shared staging seller (qa.seller.01) doesn't accumulate unbounded rows.
//
// Any product a test actually submits through the UI should have its name
// prefixed with this string. Import it wherever a spec fills the product
// name input right before a real submit/create.
export const E2E_PRODUCT_PREFIX = "E2E-TEST-";

// ponytail: same fallback the app itself already uses (apiServices'
// axiosInstance.ts) — .env isn't auto-loaded into the Playwright test
// process, only into the Next dev server it launches.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api";

/**
 * Deletes every product owned by the logged-in seller whose name starts with
 * E2E_PRODUCT_PREFIX. Call from an `afterEach` after `login(page)` has run
 * (reuses the same JWT the UI login already put in the "token" cookie —
 * no second login). Safe to call even if the test created nothing, or isn't
 * logged in (no-ops instead of throwing).
 */
export async function cleanupE2EProducts(page: Page): Promise<void> {
  const cookie = await page.context().cookies().then((cookies) => cookies.find((c) => c.name === "token"));
  if (!cookie) return; // not logged in / already logged out — nothing to clean up

  const headers = { Authorization: `Bearer ${cookie.value}` };

  let products: Array<{ _id: string; productName?: string }> = [];
  try {
    const listRes = await page.request.post(`${API_BASE_URL}/product/list`, {
      headers,
      data: { search: E2E_PRODUCT_PREFIX, limit: 200 },
    });
    if (!listRes.ok()) {
      console.warn(`[e2e cleanup] product/list failed: ${listRes.status()}`);
      return;
    }
    const body = await listRes.json();
    products = Array.isArray(body?.data) ? body.data : [];
  } catch (err) {
    console.warn("[e2e cleanup] failed to list products for cleanup:", err);
    return;
  }

  // Defensive exact-prefix check — the backend `search` filter is a
  // case-insensitive substring regex, not an anchored prefix match, so
  // re-verify here before deleting anything.
  const toDelete = products.filter((p) => p.productName?.startsWith(E2E_PRODUCT_PREFIX));

  for (const product of toDelete) {
    try {
      const delRes = await page.request.delete(`${API_BASE_URL}/product/${product._id}`, { headers });
      if (!delRes.ok()) {
        console.warn(`[e2e cleanup] delete failed for ${product._id}: ${delRes.status()}`);
      }
    } catch (err) {
      // One failed delete must never crash the rest of the teardown.
      console.warn(`[e2e cleanup] delete threw for ${product._id}:`, err);
    }
  }
}
