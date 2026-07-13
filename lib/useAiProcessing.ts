"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import type {
  AiFilledFields, AiModalPhase, ApplyPayload, AiParseResponse,
  BgFailReason, BgState, DiffRow, ExtractedProduct, ReadyDiff,
  ParsedProductEntry,
} from "@/types/ai";
import type { RefMatch, RefMatches } from "@/types/ai";

// ── Field label map ───────────────────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  productName: "Product Name", tradeName: "Trade Name",
  chemicalName: "Chemical Name", description: "Description",
  manufacturingMethod: "Manufacturing Method", countryOfOrigin: "Country of Origin",
  color: "Color", additives: "Additives", polymerTypes: "Polymer Type(s)",
  chemicalFamily: "Chemical Family", physicalForm: "Physical Form",
  industry: "Industry", grade: "Grade",
  density: "Density", mfi: "MFI", tensileStrength: "Tensile Strength",
  elongationAtBreak: "Elongation at Break", flexuralModulus: "Flexural Modulus",
  shoreHardness: "Shore Hardness", waterAbsorption: "Water Absorption",
  availability: "Availability", minimum_order_quantity: "Min. Order Qty",
  stock: "Stock", uom: "Unit of Measure", price: "Price",
  priceTerms: "Price Terms", leadTime: "Lead Time",
  packagingWeight: "Packaging Weight", storageConditions: "Storage Conditions",
  shelfLife: "Shelf Life", materialType: "Material Type",
  form: "Form", supplierType: "Supplier Type",
  recyclable: "Recyclable", bioDegradable: "Bio-Degradable",
  fdaApproved: "FDA Approved", medicalGrade: "Medical Grade",
};

// ── buildDiff ─────────────────────────────────────────────────────────────────

function buildDiff(
  product: ExtractedProduct,
  refMatches: RefMatches,
): { fields: Record<string, unknown>; filled: AiFilledFields; rows: DiffRow[] } {
  const fields: Record<string, unknown> = {};
  const filled: AiFilledFields = {};
  const rows: DiffRow[] = [];

  const add = (key: string, value: unknown, confidence: string, display: string) => {
    if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) return;
    fields[key] = value;
    filled[key] = { confidence };
    rows.push({ key, label: FIELD_LABELS[key] ?? key, displayValue: display, confidence: confidence as DiffRow["confidence"] });
  };

  type StrField = { value: string | null; confidence: string } | null | undefined;
  type NumField = { value: number | null; confidence: string; upperBound?: number } | null | undefined;

  const str = (key: string, field: StrField) =>
    field?.value && add(key, field.value, field.confidence, String(field.value));
  str("productName", product.productName);
  str("tradeName", product.tradeName);
  str("chemicalName", product.chemicalName);
  str("description", product.description);
  str("manufacturingMethod", product.manufacturingMethod);
  str("countryOfOrigin", product.countryOfOrigin);
  str("color", product.color);
  str("additives", product.additives);
  str("uom", product.uom);
  str("leadTime", product.leadTime);
  str("packagingWeight", product.packagingWeight);
  str("storageConditions", product.storageConditions);
  str("shelfLife", product.shelfLife);
  str("availability", product.availability);
  str("priceTerms", product.priceTerms);
  str("materialType", product.materialType);
  str("form", product.form);
  str("supplierType", product.supplierType);

  const num = (key: string, field: NumField) =>
    field?.value != null && add(key, field.value, field.confidence, String(field.value));
  num("density", product.density);
  num("mfi", product.mfi);
  num("tensileStrength", product.tensileStrength);
  num("elongationAtBreak", product.elongationAtBreak);
  num("flexuralModulus", product.flexuralModulus);
  num("shoreHardness", product.shoreHardness);
  num("waterAbsorption", product.waterAbsorption);
  num("minimum_order_quantity", product.minimum_order_quantity);
  num("stock", product.stock);
  num("price", product.price);

  if (product.recyclable != null) add("recyclable", product.recyclable, "high", product.recyclable ? "Yes" : "No");
  if (product.bioDegradable != null) add("bioDegradable", product.bioDegradable, "high", product.bioDegradable ? "Yes" : "No");
  if (product.fdaApproved != null) add("fdaApproved", product.fdaApproved, "high", product.fdaApproved ? "Yes" : "No");
  if (product.medicalGrade != null) add("medicalGrade", product.medicalGrade, "high", product.medicalGrade ? "Yes" : "No");

  const applyRef = (formKey: string, match: RefMatch | null | undefined, confidence: string) => {
    if (match?.match?._id) add(formKey, match.match._id, confidence, match.match.name ?? match.match._id);
  };
  applyRef("chemicalFamily", refMatches?.chemicalFamily, product.chemicalFamily?.confidence ?? "medium");
  applyRef("physicalForm", refMatches?.physicalForm, product.physicalForm?.confidence ?? "medium");

  if (refMatches?.polymerType?.match?._id) {
    add("polymerTypes", [refMatches.polymerType.match._id],
      product.polymerType?.confidence ?? "medium", refMatches.polymerType.match.name ?? "");
  }

  const refArr = (formKey: string, arr: (RefMatch | null)[] | undefined) => {
    if (!Array.isArray(arr)) return;
    const ids = arr.filter(m => m?.match?._id).map(m => m!.match!._id);
    const names = arr.filter(m => m?.match?.name).map(m => m!.match!.name).join(", ");
    if (ids.length > 0) add(formKey, ids, "medium", names);
  };
  refArr("industry", refMatches?.industry ?? undefined);
  refArr("grade", refMatches?.grade ?? undefined);

  return { fields, filled, rows };
}

// ── OCR detection ─────────────────────────────────────────────────────────────

const OCR_RE = /\.(jpg|jpeg|png|webp)$/i;
function isOcrUpload(f: File) {
  return OCR_RE.test(f.name) || ["image/jpeg", "image/png", "image/webp"].includes(f.type);
}

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseAiProcessingOptions {
  isEditMode: boolean;
  existingData?: Record<string, unknown>;
  // Restrict extraction to these form keys (Quick Add only has 8 fields);
  // keeps toasts/widget counts honest about what will actually be applied
  allowedFields?: string[];
  onApply: (payload: ApplyPayload) => void;
}

export function useAiProcessing({ isEditMode, existingData, allowedFields, onApply }: UseAiProcessingOptions) {
  // Ref-wrap options to avoid stale closures in async callbacks
  const isEditModeRef = useRef(isEditMode);
  const onApplyRef = useRef(onApply);
  const existingDataRef = useRef(existingData);
  const allowedFieldsRef = useRef(allowedFields);
  useEffect(() => { isEditModeRef.current = isEditMode; }, [isEditMode]);
  useEffect(() => { onApplyRef.current = onApply; }, [onApply]);
  useEffect(() => { existingDataRef.current = existingData; }, [existingData]);
  useEffect(() => { allowedFieldsRef.current = allowedFields; }, [allowedFields]);

  // Modal state
  const [modalOpen, setModalOpen_] = useState(false);
  const modalOpenRef = useRef(false);
  const setModalOpen = (val: boolean) => { setModalOpen_(val); modalOpenRef.current = val; };

  const [modalPhase, setModalPhase] = useState<AiModalPhase>("idle");
  const [loadingMsg, setLoadingMsg] = useState("Reading your catalog…");
  const [loadingSubMsg, setLoadingSubMsg] = useState("");
  const [loadingStage, setLoadingStage] = useState<1 | 2 | 3 | 4>(1);
  const [modalErrorMsg, setModalErrorMsg] = useState("");
  const [readyDiff, setReadyDiff] = useState<ReadyDiff | null>(null);

  // Uploaded file name (for toasts and display)
  const [uploadedFileName, setUploadedFileName_] = useState<string | null>(null);
  const uploadedFileNameRef = useRef<string | null>(null);
  const setUploadedFileName = (v: string | null) => {
    setUploadedFileName_(v);
    uploadedFileNameRef.current = v;
  };

  // Multi-product catalogs: hold all extracted products until the seller picks one
  const [pendingPick, setPendingPick] = useState<{
    products: NonNullable<AiParseResponse["products"]>;
    extractionMethod: "vision" | "text";
    sessionId: string;
  } | null>(null);

  // Catalog memory: persists after picking so seller can pick another from same catalog
  const [catalogMemory, setCatalogMemory] = useState<{
    sessionId: string;
    fileName: string;
    products: ParsedProductEntry[];
    usedIndices: Set<number>;
  } | null>(null);

  // Background widget state
  const [bgState, setBgState] = useState<BgState>("idle");
  const [bgFailReason, setBgFailReason] = useState<BgFailReason | null>(null);

  // Polling refs
  const parseSeqRef = useRef(0);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelRef = useRef(false);
  // Stage timers (replaces single loadingTimerRef)
  const stageTimerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stopPolling = () => {
    if (pollIntervalRef.current) { clearInterval(pollIntervalRef.current); pollIntervalRef.current = null; }
  };
  const stopStageTimers = () => {
    stageTimerRefs.current.forEach(t => clearTimeout(t));
    stageTimerRefs.current = [];
  };
  const stopAll = () => {
    stopPolling();
    stopStageTimers();
  };

  // ── Apply helpers ─────────────────────────────────────────────────────────

  const applyFiltered = (diff: ReadyDiff, includeAll: boolean) => {
    const { payload, rows } = diff;
    const applicable = rows.filter(r => !r.skipped);
    const target = includeAll
      ? applicable
      : applicable.filter(r => r.confidence === "high" || r.confidence === "medium");
    const filteredFields: Record<string, unknown> = {};
    const filteredFilled: AiFilledFields = {};
    target.forEach(r => {
      filteredFields[r.key] = payload.fields[r.key];
      filteredFilled[r.key] = payload.aiFilledFields[r.key];
    });
    onApplyRef.current({ ...payload, fields: filteredFields, aiFilledFields: filteredFilled });
    return target.length;
  };

  // ── Poll complete handler ─────────────────────────────────────────────────

  const finishWithProduct = (
    products: NonNullable<AiParseResponse["products"]>,
    idx: number,
    extractionMethod: "vision" | "text",
    sessionId: string,
  ) => {
    let { fields, filled, rows } = buildDiff(products[idx].product, products[idx].refMatches);
    if (allowedFieldsRef.current) {
      const allowed = new Set(allowedFieldsRef.current);
      rows = rows.filter(r => allowed.has(r.key));
      fields = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.has(k)));
      filled = Object.fromEntries(Object.entries(filled).filter(([k]) => allowed.has(k)));
    }
    const payload: ApplyPayload = { fields, aiFilledFields: filled, sessionId };

    const ed = existingDataRef.current;
    if (ed) {
      rows.forEach(r => {
        const v = ed[r.key];
        if (v != null && v !== "" && !(Array.isArray(v) && v.length === 0)) r.skipped = true;
      });
    }

    const diff: ReadyDiff = { payload, rows, extractionMethod };
    setReadyDiff(diff);

    if (modalOpenRef.current) {
      if (!isEditModeRef.current) {
        // Create mode: auto-apply high/medium fields, fire toast
        const applicable = diff.rows.filter(r => !r.skipped);
        const target = applicable.filter(r => r.confidence === "high" || r.confidence === "medium");
        applyFiltered(diff, false);

        if (target.length > 0) {
          const productName = products[idx].product.productName?.value ?? products[idx].product.tradeName?.value;
          const isMultiCatalog = products.length > 1;
          toast.success(
            isMultiCatalog
              ? `${target.length} fields filled${productName ? ` — ${productName}` : ""}`
              : `${target.length} fields filled from ${uploadedFileNameRef.current ?? "catalog"}`,
            {
              duration: 4000,
              description: target.length < 5 ? "Check orange fields before submitting." : undefined,
            }
          );
        } else {
          toast.info("No new fields to fill from this catalog.");
        }

        setModalOpen(false);
        setModalPhase("idle");
      } else {
        setModalPhase("diff");
      }
    } else {
      setBgState("ready");
    }
  };

  const handleComplete = useCallback((data: {
    ocrFailed: boolean;
    products: AiParseResponse["products"];
    extractionMethod: "vision" | "text";
    sessionId: string;
  }) => {
    const { ocrFailed, products, extractionMethod, sessionId } = data;

    if (ocrFailed) {
      if (modalOpenRef.current) setModalPhase("ocrFailed");
      else { setBgState("failed"); setBgFailReason("ocrFailed"); }
      return;
    }
    if (!products?.length) {
      if (modalOpenRef.current) setModalPhase("rejected");
      else { setBgState("failed"); setBgFailReason("error"); }
      return;
    }

    if (products.length > 1) {
      setPendingPick({ products, extractionMethod, sessionId });
      if (modalOpenRef.current) setModalPhase("pick");
      else setBgState("ready");
      return;
    }

    finishWithProduct(products, 0, extractionMethod, sessionId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Seller picked one product from a multi-product catalog
  const pickProduct = useCallback((idx: number) => {
    if (!pendingPick) return;
    const { products, extractionMethod, sessionId } = pendingPick;
    finishWithProduct(products, idx, extractionMethod, sessionId);

    // Store catalog memory so seller can pick another product later
    setCatalogMemory(prev => {
      const prevUsed = prev?.sessionId === sessionId ? prev.usedIndices : new Set<number>();
      return {
        sessionId,
        fileName: uploadedFileNameRef.current ?? "",
        products,
        usedIndices: new Set([...prevUsed, idx]),
      };
    });
    setPendingPick(null);
  }, [pendingPick]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reopen picker from catalog memory (for "Use catalog again" / "Add another" flow)
  const reopenCatalogPicker = useCallback(() => {
    if (!catalogMemory) return;
    setPendingPick({
      products: catalogMemory.products,
      extractionMethod: "text",
      sessionId: catalogMemory.sessionId,
    });
    setModalPhase("pick");
    setModalOpen(true);
  }, [catalogMemory]);

  // ── handleFile ────────────────────────────────────────────────────────────

  const handleFile = useCallback(async (file: File) => {
    // Cancel any existing session (one active session rule)
    parseSeqRef.current++;
    const seq = parseSeqRef.current;
    cancelRef.current = false;
    stopAll();
    setBgState("idle");
    setReadyDiff(null);
    setPendingPick(null);
    setBgFailReason(null);
    setModalErrorMsg("");
    setCatalogMemory(null); // new file = fresh catalog memory

    setUploadedFileName(file.name);
    setModalPhase("parsing");

    if (isOcrUpload(file)) {
      // OCR uploads start at stage 3 (they genuinely take longer from the start)
      setLoadingStage(3);
      setLoadingMsg("Working through this catalog…");
      setLoadingSubMsg("Complex or multi-product catalogs can take 1–2 minutes");
      stageTimerRefs.current.push(setTimeout(() => {
        setLoadingMsg("Almost there — nearly done");
        setLoadingSubMsg("You can minimize and come back when ready");
        setLoadingStage(4);
      }, 35000));
      stageTimerRefs.current.push(setTimeout(() => {
        setLoadingMsg("Still processing…");
        setLoadingSubMsg("This is taking longer than usual — you can minimize and keep working");
      }, 95000));
    } else {
      setLoadingStage(1);
      setLoadingMsg("Reading your catalog…");
      setLoadingSubMsg("");
      stageTimerRefs.current.push(setTimeout(() => {
        setLoadingMsg("Extracting product data…");
        setLoadingSubMsg("Standard catalogs take 10–30 seconds");
        setLoadingStage(2);
      }, 8000));
      stageTimerRefs.current.push(setTimeout(() => {
        setLoadingMsg("Working through this catalog…");
        setLoadingSubMsg("Complex or multi-product catalogs can take 1–2 minutes");
        setLoadingStage(3);
      }, 25000));
      stageTimerRefs.current.push(setTimeout(() => {
        setLoadingMsg("Almost there — nearly done");
        setLoadingSubMsg("You can minimize and come back when ready");
        setLoadingStage(4);
      }, 60000));
      stageTimerRefs.current.push(setTimeout(() => {
        setLoadingMsg("Still processing…");
        setLoadingSubMsg("This is taking longer than usual — you can minimize and keep working");
      }, 120000));
    }

    try {
      const form = new FormData();
      form.append("file", file);
      const initRes = await axiosInstance.post<{ sessionId: string; status: string }>("/ai/parse", form, { timeout: 600000 });
      if (cancelRef.current || parseSeqRef.current !== seq) { stopAll(); return; }

      const { sessionId } = initRes.data;

      pollIntervalRef.current = setInterval(async () => {
        try {
          const pollRes = await axiosInstance.get<{
            status: string;
            extractionMethod?: "vision" | "text";
            ocrFailed?: boolean;
            products?: AiParseResponse["products"];
            sessionId?: string;
          }>(`/ai/session/${sessionId}`);

          if (cancelRef.current || parseSeqRef.current !== seq) { stopAll(); return; }

          const { status } = pollRes.data;
          if (status === "processing") return;

          stopAll();

          if (status === "failed") {
            const msg = "This catalog took too long to process. Try uploading a smaller section, or use a text-based PDF.";
            if (modalOpenRef.current) {
              setModalErrorMsg(msg);
              setModalPhase("error");
            } else {
              setBgState("failed");
              setBgFailReason("timeout");
            }
            return;
          }

          handleComplete({
            ocrFailed: pollRes.data.ocrFailed ?? false,
            products: pollRes.data.products ?? [],
            extractionMethod: pollRes.data.extractionMethod ?? "text",
            sessionId: pollRes.data.sessionId ?? sessionId,
          });
        } catch {
          if (cancelRef.current || parseSeqRef.current !== seq) { stopAll(); return; }
          stopAll();
          if (modalOpenRef.current) {
            setModalErrorMsg("Upload failed — check your connection and try again.");
            setModalPhase("error");
          } else {
            setBgState("failed");
            setBgFailReason("error");
          }
        }
      }, 4000);

    } catch (err: unknown) {
      stopAll();
      if (cancelRef.current || parseSeqRef.current !== seq) return;
      const serverMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const msg = serverMsg
        ? "Something went wrong while processing your file. Please try again or use a different file."
        : "Upload failed — check your connection and try again.";
      if (modalOpenRef.current) {
        setModalErrorMsg(msg);
        setModalPhase("error");
      } else {
        setBgState("failed");
        setBgFailReason("error");
      }
    }
  }, [handleComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Modal control ─────────────────────────────────────────────────────────

  const openModal = useCallback(() => {
    setModalPhase("idle");
    setModalOpen(true);
  }, []);

  const minimise = useCallback(() => {
    setModalOpen(false);
    setBgState("processing");
    // cancelRef NOT touched — poll continues
  }, []);

  const handleModalOpenChange = useCallback((val: boolean) => {
    if (val) { setModalOpen(true); return; }
    if (modalPhase === "parsing") {
      minimise();
    } else {
      cancelRef.current = true;
      parseSeqRef.current++;
      stopAll();
      setModalOpen(false);
      setModalPhase("idle");
      setBgState("idle");
      setReadyDiff(null);
      setPendingPick(null);
      setBgFailReason(null);
      setModalErrorMsg("");
    }
  }, [modalPhase, minimise]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Diff apply (from modal diff UI) ──────────────────────────────────────

  const applyDiff = useCallback((includeAll: boolean) => {
    if (!readyDiff) return;
    const applicable = readyDiff.rows.filter(r => !r.skipped);
    const target = includeAll
      ? applicable
      : applicable.filter(r => r.confidence === "high" || r.confidence === "medium");
    applyFiltered(readyDiff, includeAll);
    if (target.length > 0) {
      toast.success(
        `${target.length} fields updated from ${uploadedFileNameRef.current ?? "catalog"}`,
        { duration: 4000 }
      );
    }
    setModalOpen(false);
    setModalPhase("idle");
    setReadyDiff(null);
  }, [readyDiff]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Clear AI data (from "Clear AI data" button in diff modal) ─────────────

  const clearAiData = useCallback(() => {
    setReadyDiff(null);
    setModalOpen(false);
    setModalPhase("idle");
    setCatalogMemory(null);
    setUploadedFileName(null);
  }, []);

  // ── Widget actions ────────────────────────────────────────────────────────

  const cancelBg = useCallback(() => {
    cancelRef.current = true;
    parseSeqRef.current++;
    stopAll();
    setBgState("idle");
    setReadyDiff(null);
    setPendingPick(null);
    setBgFailReason(null);
    setCatalogMemory(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyReady = useCallback(() => {
    // Multi-product result waiting: reopen modal so the seller can pick one
    if (pendingPick) {
      setModalPhase("pick");
      setModalOpen(true);
      setBgState("idle");
      return;
    }
    if (!readyDiff) return;
    if (!isEditModeRef.current) {
      const applicable = readyDiff.rows.filter(r => !r.skipped);
      const target = applicable.filter(r => r.confidence === "high" || r.confidence === "medium");
      applyFiltered(readyDiff, false);
      if (target.length > 0) {
        toast.success(
          `${target.length} fields filled from ${uploadedFileNameRef.current ?? "catalog"}`,
          { duration: 4000, description: target.length < 5 ? "Check orange fields before submitting." : undefined }
        );
      }
      setBgState("idle");
      setReadyDiff(null);
    } else {
      // Edit mode: reopen modal in diff state
      setModalPhase("diff");
      setModalOpen(true);
      setBgState("idle");
    }
  }, [readyDiff, pendingPick]); // eslint-disable-line react-hooks/exhaustive-deps

  const retry = useCallback(() => {
    setBgState("idle");
    setReadyDiff(null);
    setPendingPick(null);
    setBgFailReason(null);
    setModalPhase("idle");
    setModalOpen(true);
  }, []);

  const dismissWidget = useCallback(() => {
    setBgState("idle");
    setReadyDiff(null);
    setPendingPick(null);
    setBgFailReason(null);
    // ponytail: catalogMemory preserved on dismiss — seller may still use "Add another" later
  }, []);

  // Dismiss widget on form submit
  const onFormSubmit = useCallback(() => {
    if (bgState === "ready") dismissWidget();
  }, [bgState, dismissWidget]);

  const fieldCount = readyDiff ? readyDiff.rows.filter(r => !r.skipped).length : 0;
  const pickItems = pendingPick ? pendingPick.products.map(p => p.product) : null;

  return {
    // Modal
    modalOpen,
    handleModalOpenChange,
    openModal,
    modalPhase,
    loadingMsg,
    loadingSubMsg,
    loadingStage,
    uploadedFileName,
    modalErrorMsg,
    readyDiff,
    handleFile,
    minimise,
    applyDiff,
    pickItems,
    pickProduct,
    // Catalog memory
    catalogMemory,
    reopenCatalogPicker,
    clearAiData,
    // Widget
    bgState,
    bgFailReason,
    fieldCount,
    cancelBg,
    applyReady,
    retry,
    dismissWidget,
    onFormSubmit,
  };
}
