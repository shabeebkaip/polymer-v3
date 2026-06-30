"use client";

import React, { useCallback, useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload, Loader2, AlertCircle, FileText, FileSpreadsheet, Image as ImageIcon, Sparkles,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import ConfidenceBadge from "./ConfidenceBadge";
import type { AiParseResponse, ExtractedProduct, RefMatch, RefMatches } from "@/types/ai";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModalState = "idle" | "parsing" | "diff" | "rejected" | "error";
type Confidence = "high" | "medium" | "low" | "unknown";

export type AiFilledFields = Record<string, { confidence: string }>;

interface ApplyPayload {
  fields: Record<string, unknown>;
  aiFilledFields: AiFilledFields;
  sessionId: string;
}

interface AiCatalogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode?: boolean;
  existingData?: Record<string, unknown>;
  onApply: (payload: ApplyPayload) => void;
}

// ── Field label map (for diff review) ────────────────────────────────────────

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

// ── Extraction → form data mapper ─────────────────────────────────────────────

interface DiffRow {
  key: string;
  label: string;
  displayValue: string;
  confidence: Confidence;
  skipped?: boolean;
}

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
    rows.push({ key, label: FIELD_LABELS[key] ?? key, displayValue: display, confidence: (confidence as Confidence) });
  };

  const str = (key: string, val: string | null | undefined) =>
    val && add(key, val, "high", val);
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

  const num = (key: string, val: number | null | undefined) =>
    val != null && add(key, val, "high", String(val));
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

  // Boolean fields — explicit to avoid string-indexing the typed interface
  if (product.recyclable != null) add("recyclable", product.recyclable, "high", product.recyclable ? "Yes" : "No");
  if (product.bioDegradable != null) add("bioDegradable", product.bioDegradable, "high", product.bioDegradable ? "Yes" : "No");
  if (product.fdaApproved != null) add("fdaApproved", product.fdaApproved, "high", product.fdaApproved ? "Yes" : "No");
  if (product.medicalGrade != null) add("medicalGrade", product.medicalGrade, "high", product.medicalGrade ? "Yes" : "No");

  // Ref fields — explicit to avoid string-indexing RefMatches
  const applyRef = (formKey: string, match: RefMatch | null | undefined, confidence: string) => {
    if (match?.match?._id) add(formKey, match.match._id, confidence, match.match.name ?? match.match._id);
  };
  applyRef("chemicalFamily", refMatches?.chemicalFamily, "medium");
  applyRef("physicalForm", refMatches?.physicalForm, "medium");

  if (refMatches?.polymerType?.match?._id) {
    add("polymerTypes", [refMatches.polymerType.match._id], "medium", refMatches.polymerType.match.name ?? "");
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

// ── Dropzone area ─────────────────────────────────────────────────────────────

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const ACCEPT_RE = /\.(pdf|xlsx|xls|csv|jpg|jpeg|png|webp|gif)$/i;

function isAcceptable(f: File) {
  return ACCEPT_RE.test(f.name) || f.type.startsWith("image/") ||
    ["application/pdf", "application/vnd.ms-excel",
     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
     "text/csv"].includes(f.type);
}

function Dropzone({ onFile, disabled }: { onFile: (f: File) => void; disabled: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");

  const pick = (f: File) => {
    if (f.size > MAX_BYTES) { setLocalError("File exceeds 20 MB limit."); return; }
    if (!isAcceptable(f)) { setLocalError("Accepted: PDF, XLSX, XLS, CSV, JPG, PNG, WEBP, GIF"); return; }
    setLocalError("");
    onFile(f);
  };

  return (
    <div>
      <label
        className={`block w-full rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors
          ${dragging ? "border-teal-400 bg-teal-50" : "border-gray-200 bg-white hover:border-teal-400 hover:bg-teal-50/40"}
          ${disabled ? "pointer-events-none opacity-60" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) pick(f); }}
      >
        <input ref={inputRef} type="file" className="hidden" disabled={disabled}
          accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.webp,.gif"
          onChange={e => { const f = e.target.files?.[0]; if (f) pick(f); e.target.value = ""; }}
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-600 shadow-md">
            <Upload className="text-white" size={24} />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">Drop a polymer catalog</p>
            <p className="mt-1 text-sm text-gray-500">PDF, Excel, CSV, or image — up to 20 MB</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {([
              [FileText, "PDF"],
              [FileSpreadsheet, "XLSX"],
              [FileSpreadsheet, "CSV"],
              [ImageIcon, "JPG/PNG"],
            ] as [React.ElementType, string][]).map(([Icon, label]) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-xs text-gray-600 border border-gray-100">
                <Icon size={11} />{label}
              </span>
            ))}
          </div>
          <button type="button" onClick={e => { e.preventDefault(); inputRef.current?.click(); }}
            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md
              bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all">
            Choose a file
          </button>
        </div>
      </label>
      {localError && (
        <div className="mt-3 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{localError}</span>
        </div>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function AiCatalogModal({ open, onOpenChange, isEditMode = false, existingData, onApply }: AiCatalogModalProps) {
  const [state, setState] = useState<ModalState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [diffRows, setDiffRows] = useState<DiffRow[]>([]);
  const [pendingPayload, setPendingPayload] = useState<ApplyPayload | null>(null);
  const cancelRef = useRef(false);

  const reset = () => { setState("idle"); setErrorMsg(""); setDiffRows([]); setPendingPayload(null); };

  const handleClose = (val: boolean) => {
    if (!val) { cancelRef.current = true; reset(); }
    onOpenChange(val);
  };

  const handleFile = useCallback(async (file: File) => {
    cancelRef.current = false;
    setState("parsing");
    setErrorMsg("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await axiosInstance.post<AiParseResponse>("/ai/parse", form);
      if (cancelRef.current) return;
      const { sessionId, products } = res.data;

      if (!sessionId || !products?.length) {
        setState("rejected");
        return;
      }

      const { fields, filled, rows } = buildDiff(products[0].product, products[0].refMatches);
      const payload: ApplyPayload = { fields, aiFilledFields: filled, sessionId };

      // Mark rows whose key already has a non-empty value in the form
      if (existingData) {
        rows.forEach(r => {
          const v = existingData[r.key];
          if (v != null && v !== "" && !(Array.isArray(v) && v.length === 0)) r.skipped = true;
        });
      }

      if (!isEditMode) {
        const filteredFields: Record<string, unknown> = {};
        const filteredFilled: AiFilledFields = {};
        rows.filter(r => !r.skipped).forEach(r => {
          filteredFields[r.key] = fields[r.key];
          filteredFilled[r.key] = filled[r.key];
        });
        onApply({ ...payload, fields: filteredFields, aiFilledFields: filteredFilled });
        handleClose(false);
        return;
      }

      setDiffRows(rows);
      setPendingPayload(payload);
      setState("diff");
    } catch (err: unknown) {
      if (cancelRef.current) return;
      const serverMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(serverMsg
        ? `Something went wrong while processing your file. Please try again or use a different file.`
        : "Upload failed. Please check your connection and try again.");
      setState("error");
    }
  }, [isEditMode, onApply, existingData]);

  const applyDiff = (includeAll: boolean) => {
    if (!pendingPayload) return;
    const applicableRows = diffRows.filter(r => !r.skipped);
    if (!includeAll) {
      const safe: Record<string, unknown> = {};
      const safeFilled: AiFilledFields = {};
      applicableRows
        .filter(r => r.confidence === "high" || r.confidence === "medium")
        .forEach(r => {
          safe[r.key] = pendingPayload.fields[r.key];
          safeFilled[r.key] = pendingPayload.aiFilledFields[r.key];
        });
      onApply({ ...pendingPayload, fields: safe, aiFilledFields: safeFilled });
    } else {
      const allFields: Record<string, unknown> = {};
      const allFilled: AiFilledFields = {};
      applicableRows.forEach(r => {
        allFields[r.key] = pendingPayload.fields[r.key];
        allFilled[r.key] = pendingPayload.aiFilledFields[r.key];
      });
      onApply({ ...pendingPayload, fields: allFields, aiFilledFields: allFilled });
    }
    handleClose(false);
  };

  const activeRows = diffRows.filter(r => !r.skipped);
  const highMedCount = activeRows.filter(r => r.confidence === "high" || r.confidence === "medium").length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="w-4 h-4 text-teal-600" />
            {state === "diff" ? "Review extracted fields" : "Import from a catalog"}
          </DialogTitle>
        </DialogHeader>

        {/* IDLE */}
        {state === "idle" && <Dropzone onFile={handleFile} disabled={false} />}

        {/* PARSING */}
        {state === "parsing" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-teal-50">
              <Loader2 className="w-7 h-7 text-teal-600 animate-spin" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Analyzing catalog…</p>
              <p className="text-sm text-gray-500 mt-1">Claude is extracting specs and matching references</p>
            </div>
          </div>
        )}

        {/* DIFF REVIEW (edit mode) */}
        {state === "diff" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">
              Claude found <span className="font-semibold text-gray-900">{diffRows.length} fields</span>
              {diffRows.some(r => r.skipped) && (
                <> · <span className="text-amber-600">{diffRows.filter(r => r.skipped).length} already set</span></>
              )}.
            </p>
            <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
              {diffRows.map(row => (
                <div key={row.key} className={`flex items-center justify-between gap-3 px-4 py-2.5 ${row.skipped ? "opacity-50" : ""}`}>
                  <div className="min-w-0">
                    <p className={`text-xs font-medium truncate ${row.skipped ? "text-gray-400 line-through" : "text-gray-700"}`}>{row.label}</p>
                    <p className="text-xs text-gray-400 truncate">{row.displayValue}</p>
                  </div>
                  {row.skipped
                    ? <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">already set</span>
                    : <ConfidenceBadge level={row.confidence} />
                  }
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => applyDiff(false)}
                disabled={highMedCount === 0}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
              >
                Apply {highMedCount} field{highMedCount !== 1 ? "s" : ""}
              </button>
              {activeRows.length > highMedCount && (
                <button
                  onClick={() => applyDiff(true)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Apply all ({activeRows.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* REJECTION */}
        {state === "rejected" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">No polymer data found</p>
                <p className="text-xs text-amber-700 mt-0.5">The file doesn&apos;t appear to contain polymer catalog data. Try a text-based PDF, Excel sheet, or CSV with product specifications.</p>
              </div>
            </div>
            <button onClick={reset} className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Try another file
            </button>
          </div>
        )}

        {/* ERROR */}
        {state === "error" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
            <button onClick={reset} className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Try again
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
