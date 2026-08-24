"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddEditProduct from "@/components/user/AddEditProduct";
import QuickAddProduct, {
  QUICK_ADD_DRAFT_KEY,
  QUICK_ADD_DRAFT_TTL_MS,
} from "@/components/user/products/QuickAddProduct";
import { initialFormData } from "@/apiServices/constants/userProductCrud";
import type { ProductFormData, QuickAddFormData } from "@/types/product";

// Seed the detailed form from the shared Quick Add draft (T3.4). Non-destructive
// read — Quick Add may still need the same draft if the seller switches back.
function readDraft(): ProductFormData | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(QUICK_ADD_DRAFT_KEY);
    if (!raw) return undefined;
    const draft = JSON.parse(raw) as { ts: number; values: QuickAddFormData };
    if (!draft?.ts || !draft.values || Date.now() - draft.ts > QUICK_ADD_DRAFT_TTL_MS) return undefined;
    const v = draft.values;
    const mapped: Partial<ProductFormData> = {
      polymerType: v.polymerTypes?.[0] ?? "",
      polymerTypes: v.polymerTypes ?? [],
      productName: v.productName ?? "",
      chemicalFamily: v.chemicalFamily ?? "",
      physicalForm: v.physicalForm ?? "",
      countryOfOrigin: v.countryOfOrigin ?? "",
      minimum_order_quantity: v.minimum_order_quantity ?? null,
      uom: v.uom ?? "",
      availability: v.availability,
      productListFile: v.productListFile,
    };
    // Merge over initialFormData — AddEditProduct reads fields like data.industry.length
    // unguarded, so a bare partial would crash it.
    return { ...initialFormData, ...mapped };
  } catch {
    return undefined;
  }
}

const AddProductInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"quick" | "advanced">(
    searchParams.get("mode") === "advanced" ? "advanced" : "quick"
  );

  // Blank on both the server render and the very first client render so
  // hydration can never mismatch — readDraft() reads sessionStorage, which
  // doesn't exist server-side (same class of bug T16 item 2 already fixed for
  // QuickAddProduct's own state, applied here to the detailed form's seed).
  // Once mounted, in-place Quick Add -> Detailed switches (never SSR'd) read
  // the draft synchronously as before; a genuine hard reload with an actual
  // draft present instead flips the seed a tick later and remounts (key
  // change) exactly once. The key only changes when there's a real draft to
  // seed — no draft means "blank" before and after mount, so the common case
  // (no draft) never remounts at all.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (mode === "advanced") {
    const seed = mounted ? readDraft() : undefined;
    return (
      <AddEditProduct
        key={seed ? "seeded" : "blank"}
        product={seed}
        // Back to Quick Add must return to the My Products modal (where Quick
        // Add now lives), not flip local state to the old full-page quick form
        // rendered in this same route — that was the legacy pre-modal UI.
        // `quickAdd=1` is a one-shot param: products/page.tsx opens the modal
        // on read and strips it via router.replace. AddEditProduct writes the
        // current Detailed values into the shared draft before calling this
        // (T16 item 1 — symmetric write-on-switch).
        onBackToQuickAdd={() => router.push("/user/products?quickAdd=1")}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <QuickAddProduct onSwitchToAdvanced={() => setMode("advanced")} />
    </div>
  );
};

const AddProduct = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    }
  >
    <AddProductInner />
  </Suspense>
);

export default AddProduct;
