"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import type {
  AiFilledFields, AiModalPhase, ApplyPayload, AiParseResponse,
  BgFailReason, BgState, DiffRow, ExtractedProduct, ReadyDiff,
  ParsedProductEntry, TaxonomyReviewItem, TaxonomyFieldKey,
  CatalogFileMeta, ProcessingStage,
} from "@/types/ai";
import type { RefMatch, RefMatches } from "@/types/ai";
import type { ConflictValue } from "@/types/ai";
import { conflictSuppressionKey, partitionAiRows } from "@/lib/aiConflicts";
import { isProcessingStage, PROCESSING_STAGE_ORDER, PROCESSING_STEPS } from "@/components/ai-import/CatalogProcessingWorkbench";

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

const TAXONOMY_LABELS: Record<TaxonomyFieldKey, string> = {
  chemicalFamily: "Chemical Family", physicalForm: "Physical Form",
  polymerType: "Polymer Type", industry: "Industry", grade: "Grade",
};

function buildDiff(
  product: ExtractedProduct,
  refMatches: RefMatches,
): { fields: Record<string, unknown>; filled: AiFilledFields; rows: DiffRow[]; taxonomyReview: TaxonomyReviewItem[] } {
  const fields: Record<string, unknown> = {};
  const filled: AiFilledFields = {};
  const rows: DiffRow[] = [];
  const taxonomyReview: TaxonomyReviewItem[] = [];

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

  // mfi test-condition passthrough (e.g. "190°C/2.16kg") — attach to the mfi
  // row/filled entry that was just added above, if any (§14.3 trailing parenthetical).
  const mfiConditions = product.mfi_conditions?.value;
  if (mfiConditions && filled.mfi) {
    filled.mfi.conditions = mfiConditions;
    const mfiRow = rows.find(r => r.key === "mfi");
    if (mfiRow) mfiRow.conditions = mfiConditions;
  }

  // ── Taxonomy — tier-aware (§14.0/§21.9 point 4) ──────────────────────────
  // Only "auto"-tier matches auto-apply. "confirm"/"manual" no longer get
  // silently applied identically to a confident match (the pre-existing bug)
  // — they become review items instead, carrying the raw catalogue `query`
  // text that was previously discarded.
  const applySingularRef = (formKey: TaxonomyFieldKey, addKey: string, match: RefMatch | null | undefined, confidence: string) => {
    if (!match) return;
    if (match.tier === "auto" && match.match?._id) {
      add(addKey, addKey === "polymerTypes" ? [match.match._id] : match.match._id, confidence, match.match.name ?? match.match._id);
    } else if (match.tier === "confirm" || match.tier === "manual") {
      taxonomyReview.push({
        key: formKey, formKey, isArray: false, tier: match.tier, query: match.query,
        suggestedId: match.match?._id, suggestedName: match.match?.name, label: TAXONOMY_LABELS[formKey],
      });
    }
  };
  applySingularRef("chemicalFamily", "chemicalFamily", refMatches?.chemicalFamily, product.chemicalFamily?.confidence ?? "medium");
  applySingularRef("physicalForm", "physicalForm", refMatches?.physicalForm, product.physicalForm?.confidence ?? "medium");
  // polymerType's form field is `polymerType` (singular) but buildDiff has
  // historically filled `polymerTypes` (array) — handleAiApply collapses it
  // back to `polymerType` on bulk-apply; the review row's own "Use this"
  // handler (CatalogFindings) writes `polymerType` directly, so both paths converge.
  applySingularRef("polymerType", "polymerTypes", refMatches?.polymerType, product.polymerType?.confidence ?? "medium");

  const refArrTiered = (formKey: TaxonomyFieldKey, arr: (RefMatch | null)[] | undefined) => {
    if (!Array.isArray(arr)) return;
    const autoIds: string[] = [];
    const autoNames: string[] = [];
    arr.forEach((m, idx) => {
      if (!m) return;
      if (m.tier === "auto" && m.match?._id) {
        autoIds.push(m.match._id);
        if (m.match.name) autoNames.push(m.match.name);
      } else if (m.tier === "confirm" || m.tier === "manual") {
        taxonomyReview.push({
          key: `${formKey}-${idx}`, formKey, isArray: true, tier: m.tier, query: m.query,
          suggestedId: m.match?._id, suggestedName: m.match?.name, label: TAXONOMY_LABELS[formKey],
        });
      }
    });
    if (autoIds.length > 0) add(formKey, autoIds, "medium", autoNames.join(", "));
  };
  refArrTiered("industry", refMatches?.industry ?? undefined);
  refArrTiered("grade", refMatches?.grade ?? undefined);

  return { fields, filled, rows, taxonomyReview };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseAiProcessingOptions {
  isEditMode: boolean;
  existingData?: Record<string, unknown>;
  // Restrict extraction to these form keys (Quick Add only has 8 fields);
  // keeps toasts/widget counts honest about what will actually be applied
  allowedFields?: string[];
  // Detailed form owns one atomic aria-live lifecycle for apply/conflict
  // results. Suppress Sonner's separate live-region copy there so assistive
  // technology receives the result once; compact callers keep their toast.
  suppressResultToasts?: boolean;
  onStatusMessage?: (message: string) => void;
  onMinimiseFocus?: () => void;
  onApply: (payload: ApplyPayload) => void;
}

export function useAiProcessing({ existingData, allowedFields, suppressResultToasts = false, onStatusMessage, onMinimiseFocus, onApply }: UseAiProcessingOptions) {
  // Ref-wrap options to avoid stale closures in async callbacks
  const onApplyRef = useRef(onApply);
  const existingDataRef = useRef(existingData);
  const allowedFieldsRef = useRef(allowedFields);
  const suppressResultToastsRef = useRef(suppressResultToasts);
  const onStatusMessageRef = useRef(onStatusMessage);
  const onMinimiseFocusRef = useRef(onMinimiseFocus);
  useEffect(() => { onApplyRef.current = onApply; }, [onApply]);
  useEffect(() => { existingDataRef.current = existingData; }, [existingData]);
  useEffect(() => { allowedFieldsRef.current = allowedFields; }, [allowedFields]);
  useEffect(() => { suppressResultToastsRef.current = suppressResultToasts; }, [suppressResultToasts]);
  useEffect(() => { onStatusMessageRef.current = onStatusMessage; }, [onStatusMessage]);
  useEffect(() => { onMinimiseFocusRef.current = onMinimiseFocus; }, [onMinimiseFocus]);

  // Modal state
  const [modalOpen, setModalOpen_] = useState(false);
  const modalOpenRef = useRef(false);
  const setModalOpen = (val: boolean) => { setModalOpen_(val); modalOpenRef.current = val; };

  const [modalPhase, setModalPhase] = useState<AiModalPhase>("idle");
  const [processingStage, setProcessingStage] = useState<ProcessingStage | null>(null);
  const processingStageRef = useRef<ProcessingStage | null>(null);
  const [acceptedAt, setAcceptedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<CatalogFileMeta | null>(null);
  const retainedFileRef = useRef<File | null>(null);
  const [modalErrorMsg, setModalErrorMsg] = useState("");
  const [modalFailReason, setModalFailReason] = useState<BgFailReason | null>(null);
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
  const activePollRef = useRef<null | (() => Promise<boolean>)>(null);
  const activeSessionIdRef = useRef<string | null>(null);
  const cancelRef = useRef(false);
  const resolvedConflictsRef = useRef<Set<string>>(new Set());
  const delayedAnnouncedRef = useRef(false);
  const reopenedFromWidgetRef = useRef(false);

  const stopPolling = () => {
    if (pollIntervalRef.current) { clearInterval(pollIntervalRef.current); pollIntervalRef.current = null; }
  };
  const stopAll = () => {
    stopPolling();
  };

  const clearActiveSession = () => {
    stopPolling();
    activePollRef.current = null;
    activeSessionIdRef.current = null;
  };

  const acceptStage = (candidate: unknown) => {
    if (!isProcessingStage(candidate)) return;
    const previous = processingStageRef.current;
    if (previous && PROCESSING_STAGE_ORDER[candidate] < PROCESSING_STAGE_ORDER[previous]) return;
    if (previous === candidate) return;
    processingStageRef.current = candidate;
    setProcessingStage(candidate);
    const step = PROCESSING_STEPS[PROCESSING_STAGE_ORDER[candidate]];
    onStatusMessageRef.current?.(`${step.title}. ${step.description}`);
  };

  useEffect(() => {
    const active = modalPhase === "parsing" || bgState === "processing";
    if (!active || acceptedAt == null) return;
    const tick = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - acceptedAt) / 1000)));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [acceptedAt, bgState, modalPhase]);

  useEffect(() => {
    if (elapsedSeconds < 60 || delayedAnnouncedRef.current || (modalPhase !== "parsing" && bgState !== "processing")) return;
    delayedAnnouncedRef.current = true;
    onStatusMessageRef.current?.("Some catalogues need more processing time. Your form entries are safe, and you can keep filling the form.");
  }, [bgState, elapsedSeconds, modalPhase]);

  // ── Apply helpers ─────────────────────────────────────────────────────────

  const applyFiltered = (diff: ReadyDiff, includeAll: boolean) => {
    const { payload, rows, taxonomyReview } = diff;
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
    // §21.9's plumbing note — the persistent "Found in Your Catalogue" surface
    // needs the taxonomy review metadata, not just flattened fields.
    onApplyRef.current({ ...payload, fields: filteredFields, aiFilledFields: filteredFilled, taxonomyReview });
    return target.length;
  };

  // ── Poll complete handler ─────────────────────────────────────────────────

  const finishWithProduct = (
    products: NonNullable<AiParseResponse["products"]>,
    idx: number,
    extractionMethod: "vision" | "text",
    sessionId: string,
  ) => {
    let { fields, filled, rows, taxonomyReview } = buildDiff(products[idx].product, products[idx].refMatches);
    if (allowedFieldsRef.current) {
      const allowed = new Set(allowedFieldsRef.current);
      rows = rows.filter(r => allowed.has(r.key));
      fields = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.has(k)));
      filled = Object.fromEntries(Object.entries(filled).filter(([k]) => allowed.has(k)));
      taxonomyReview = taxonomyReview.filter(t => allowed.has(t.formKey));
    }
    const ed = existingDataRef.current;
    const partition = partitionAiRows({
      rows,
      fields,
      existingData: ed,
      suppressed: resolvedConflictsRef.current,
    });
    rows = partition.rows;
    const conflicts = partition.conflicts;

    if (ed) {
      // Same skip-if-filled rule (§14.6) applied to taxonomy review rows — a
      // field that already has a manual value never gets a review row either.
      taxonomyReview = taxonomyReview.filter(item => {
        const v = ed[item.formKey];
        const hasValue = item.isArray ? Array.isArray(v) && v.length > 0 : (v != null && v !== "");
        return !hasValue;
      });
    }

    const payload: ApplyPayload = {
      fields,
      extractedFieldKeys: Object.keys(fields),
      aiFilledFields: filled,
      sessionId,
      taxonomyReview: [],
      conflicts,
      foundCount: rows.length,
    };

    const diff: ReadyDiff = { payload, rows, extractionMethod, taxonomyReview };
    setReadyDiff(diff);

    if (modalOpenRef.current) {
      // M-P: extracted data is always reviewed before it is used, in create
      // and edit mode alike. The existing diff remains the terminal UI.
      setModalPhase("diff");
      onStatusMessageRef.current?.("Catalogue ready. Review the extracted details before applying them.");
    } else {
      setBgState("ready");
      onStatusMessageRef.current?.("Catalogue ready to review.");
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
      onStatusMessageRef.current?.(`Catalogue ready. ${products.length} products found. Choose one to continue.`);
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
    reopenedFromWidgetRef.current = false;
    stopAll();
    setModalOpen(false);
    setModalPhase("idle");
    setBgState("idle");
    setReadyDiff(null);
    setPendingPick(null);
    setBgFailReason(null);
    setModalFailReason(null);
    setModalErrorMsg("");
    setCatalogMemory(null); // new file = fresh catalog memory
    delayedAnnouncedRef.current = false;
    processingStageRef.current = null;
    setProcessingStage(null);
    setAcceptedAt(null);
    setElapsedSeconds(0);
    retainedFileRef.current = file;
    setUploadedFile({ name: file.name, size: file.size, type: file.type });

    setUploadedFileName(file.name);
    setModalPhase("parsing");
    setModalOpen(true);

    try {
      const form = new FormData();
      form.append("file", file);
      const initRes = await axiosInstance.post<{
        sessionId: string;
        status: string;
        stage?: ProcessingStage;
        createdAt?: string;
      }>("/ai/parse", form, { timeout: 600000 });
      if (cancelRef.current || parseSeqRef.current !== seq) {
        // ponytail: stale/cancelled request — not a bug, but log so a silent
        // dead-end (no polling, no UI change) is never mistaken for one again.
        console.warn("[ai-import] parse aborted before polling started (cancelled or superseded)");
        stopAll();
        return;
      }

      const { sessionId } = initRes.data;
      activeSessionIdRef.current = sessionId;
      const serverCreatedAt = initRes.data.createdAt ? Date.parse(initRes.data.createdAt) : Number.NaN;
      setAcceptedAt(Number.isFinite(serverCreatedAt) ? serverCreatedAt : Date.now());
      // Older responses remain generic; the successful 202 is represented by
      // the accepted flag, without inventing a named current server stage.
      acceptStage(initRes.data.stage);
      if (!isProcessingStage(initRes.data.stage)) {
        onStatusMessageRef.current?.("Processing your catalogue. We’re preparing the file for review. You can keep filling the form while this runs.");
      }

      // Fire the first status check immediately — don't wait a full interval tick
      // to discover the poll can't even reach the backend (this is what let a
      // dead polling path go unnoticed: nothing observable for a full 4s+).
      const poll = async () => {
        try {
          const pollRes = await axiosInstance.get<{
            status: string;
            extractionMethod?: "vision" | "text";
            ocrFailed?: boolean;
            products?: AiParseResponse["products"];
            sessionId?: string;
            stage?: ProcessingStage;
            createdAt?: string;
            failureCode?: string;
          }>(`/ai/session/${sessionId}`);

          if (cancelRef.current || parseSeqRef.current !== seq) { stopAll(); return false; }

          const { status } = pollRes.data;
          if (pollRes.data.createdAt) {
            const created = Date.parse(pollRes.data.createdAt);
            if (Number.isFinite(created)) setAcceptedAt(created);
          }
          acceptStage(pollRes.data.stage);
          if (status === "processing") return true;

          clearActiveSession();

          if (status === "failed") {
            const reason: BgFailReason = pollRes.data.failureCode === "timeout" ? "timeout" : "error";
            const msg = "Try the file again, choose a smaller or text-based file, or continue manually.";
            if (modalOpenRef.current) {
              setModalErrorMsg(msg);
              setModalFailReason(reason);
              setModalPhase("error");
            } else {
              setBgState("failed");
              setBgFailReason(reason);
            }
            return false;
          }

          handleComplete({
            ocrFailed: pollRes.data.ocrFailed ?? false,
            products: pollRes.data.products ?? [],
            extractionMethod: pollRes.data.extractionMethod ?? "text",
            sessionId: pollRes.data.sessionId ?? sessionId,
          });
          return false;
        } catch (pollErr) {
          if (cancelRef.current || parseSeqRef.current !== seq) { stopAll(); return false; }
          // Surface the real failure instead of dying silently — this is exactly
          // what let the staging polling failure go unnoticed for so long.
          console.error("[ai-import] session status poll failed", pollErr);
          stopPolling();
          const status = (pollErr as { response?: { status?: number } })?.response?.status;
          const reason: BgFailReason = status === 404 ? "expired" : "connection";
          if (modalOpenRef.current) {
            setModalErrorMsg(reason === "expired"
              ? "Upload the catalogue again. Your form entries are unchanged."
              : "Your catalogue may still be processing. Reconnect to check its status.");
            setModalFailReason(reason);
            setModalPhase("error");
          } else {
            setBgState("failed");
            setBgFailReason(reason);
          }
          return false;
        }
      };

      activePollRef.current = poll;
      pollIntervalRef.current = setInterval(() => { void poll(); }, 4000);
      void poll();

    } catch (err: unknown) {
      stopAll();
      if (cancelRef.current || parseSeqRef.current !== seq) return;
      console.error("[ai-import] initial parse request failed", err);
      const serverMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const msg = serverMsg
        ? "Something went wrong while processing your file. Please try again or use a different file."
        : "Upload failed — check your connection and try again.";
      if (modalOpenRef.current) {
        setModalErrorMsg(msg);
        setModalFailReason("upload");
        setModalPhase("error");
      } else {
        setBgState("failed");
        setBgFailReason("upload");
      }
    }
  }, [handleComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Modal control ─────────────────────────────────────────────────────────

  const openModal = useCallback(() => {
    reopenedFromWidgetRef.current = false;
    setModalPhase("idle");
    setModalOpen(true);
  }, []);

  const minimise = useCallback(() => {
    const returnToProgress = reopenedFromWidgetRef.current;
    setModalOpen(false);
    setBgState("processing");
    onStatusMessageRef.current?.("Catalogue processing continues in the background.");
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      if (returnToProgress) {
        document.querySelector<HTMLElement>("[data-ai-view-progress]")?.focus();
      } else {
        onMinimiseFocusRef.current?.();
      }
    }));
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
      setModalFailReason(null);
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
    if (target.length > 0 && !suppressResultToastsRef.current) {
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

  const suppressConflict = useCallback((fieldKey: string, catalogueValue: ConflictValue) => {
    resolvedConflictsRef.current.add(conflictSuppressionKey(fieldKey, catalogueValue));
  }, []);

  const clearConflictSuppressions = useCallback(() => {
    resolvedConflictsRef.current.clear();
  }, []);

  // ── Widget actions ────────────────────────────────────────────────────────

  const cancelBg = useCallback(() => {
    cancelRef.current = true;
    parseSeqRef.current++;
    clearActiveSession();
    setModalOpen(false);
    setModalPhase("idle");
    setBgState("idle");
    setReadyDiff(null);
    setPendingPick(null);
    setBgFailReason(null);
    setCatalogMemory(null);
    processingStageRef.current = null;
    setProcessingStage(null);
    setAcceptedAt(null);
    setElapsedSeconds(0);
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
    setModalPhase("diff");
    setModalOpen(true);
    setBgState("idle");
  }, [readyDiff, pendingPick]); // eslint-disable-line react-hooks/exhaustive-deps

  const retry = useCallback(() => {
    const retained = retainedFileRef.current;
    if (retained) {
      handleFile(retained);
      return;
    }
    setBgState("idle");
    setReadyDiff(null);
    setPendingPick(null);
    setBgFailReason(null);
    setModalPhase("idle");
    setModalOpen(true);
  }, [handleFile]);

  const checkAgain = useCallback(async () => {
    const poll = activePollRef.current;
    if (!poll || !activeSessionIdRef.current) return;
    stopPolling();
    setModalFailReason(null);
    setBgFailReason(null);
    if (modalOpenRef.current) setModalPhase("parsing");
    else setBgState("processing");
    const stillProcessing = await poll();
    if (
      stillProcessing &&
      activePollRef.current === poll &&
      activeSessionIdRef.current &&
      !pollIntervalRef.current
    ) {
      pollIntervalRef.current = setInterval(() => { void poll(); }, 4000);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const continueManually = useCallback(() => {
    cancelRef.current = true;
    parseSeqRef.current++;
    clearActiveSession();
    setModalOpen(false);
    setModalPhase("idle");
    setBgState("idle");
    setReadyDiff(null);
    setPendingPick(null);
    setBgFailReason(null);
    setModalFailReason(null);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => onMinimiseFocusRef.current?.()));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const viewProgress = useCallback(() => {
    if (bgState === "ready") {
      applyReady();
      return;
    }
    if (bgState === "failed") {
      setModalPhase(bgFailReason === "ocrFailed" ? "ocrFailed" : bgFailReason === "rejected" ? "rejected" : "error");
    } else {
      setModalPhase("parsing");
    }
    reopenedFromWidgetRef.current = true;
    setBgState("idle");
    setModalOpen(true);
  }, [applyReady, bgFailReason, bgState]);

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
    processingStage,
    uploadedFile,
    elapsedSeconds,
    accepted: acceptedAt != null,
    delayed: elapsedSeconds >= 60 && (modalPhase === "parsing" || bgState === "processing"),
    uploadedFileName,
    modalErrorMsg,
    modalFailReason,
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
    suppressConflict,
    clearConflictSuppressions,
    // Widget
    bgState,
    bgFailReason,
    fieldCount,
    cancelBg,
    viewProgress,
    applyReady,
    retry,
    checkAgain,
    continueManually,
    dismissWidget,
    onFormSubmit,
  };
}
