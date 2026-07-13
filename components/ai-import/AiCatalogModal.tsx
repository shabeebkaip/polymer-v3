"use client";

import React, { useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload, Loader2, AlertCircle, AlertTriangle, FileText,
  FileSpreadsheet, Image as ImageIcon, Sparkles, ArrowRight,
} from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";
import ProductPicker from "./ProductPicker";
import type { AiModalPhase, ExtractedProduct, ReadyDiff } from "@/types/ai";

// ── Types ─────────────────────────────────────────────────────────────────────

// Re-export so AddEditProduct can still import AiFilledFields from this file
export type { AiFilledFields } from "@/types/ai";

interface AiCatalogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Controlled state from useAiProcessing hook
  phase: AiModalPhase;
  loadingMsg: string;
  loadingSubMsg: string;
  loadingStage: 1 | 2 | 3 | 4;
  uploadedFileName?: string | null;
  readyDiff: ReadyDiff | null;
  errorMsg: string;
  pickItems: ExtractedProduct[] | null;
  usedIndices?: Set<number>;

  // Callbacks
  onFile: (file: File) => void;
  onMinimise: () => void;
  onApplyDiff: (includeAll: boolean) => void;
  onPick: (idx: number) => void;
  onClearAll?: () => void;
}

// ── Dropzone ──────────────────────────────────────────────────────────────────

const MAX_BYTES = 20 * 1024 * 1024;
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
              [ImageIcon, "WEBP"],
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

export default function AiCatalogModal({
  open, onOpenChange,
  phase, loadingMsg, loadingSubMsg, loadingStage, uploadedFileName,
  readyDiff, errorMsg, pickItems, usedIndices,
  onFile, onMinimise, onApplyDiff, onPick, onClearAll,
}: AiCatalogModalProps) {

  // X during parsing → minimise; all other states → normal close
  const handleOpenChange = (val: boolean) => {
    if (!val && phase === "parsing") { onMinimise(); return; }
    onOpenChange(val);
  };

  const diffRows = readyDiff?.rows ?? [];
  const activeRows = diffRows.filter(r => !r.skipped);
  const highMedCount = activeRows.filter(r => r.confidence === "high" || r.confidence === "medium").length;
  const unknownCount = diffRows.filter(r => r.confidence === "unknown").length;
  const showQualityWarning = readyDiff?.extractionMethod === "vision" && diffRows.length > 0 && unknownCount / diffRows.length >= 0.4;

  // Modal title per phase
  const title = phase === "diff" ? "Review extracted fields"
    : phase === "pick" ? "Choose a product"
    : phase === "parsing" ? loadingMsg
    : phase === "rejected" ? "No product data found"
    : phase === "ocrFailed" ? "Couldn't read this document"
    : phase === "error" ? (errorMsg.startsWith("Upload failed") ? "Upload failed" : "Something went wrong")
    : "Import from a catalog";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* IDLE */}
        {phase === "idle" && <Dropzone onFile={onFile} disabled={false} />}

        {/* PARSING */}
        {phase === "parsing" && (
          <div className="flex flex-col items-center gap-3 py-10 px-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-teal-600 animate-spin motion-reduce:animate-none" />
            </div>

            {uploadedFileName && (
              <p className="text-xs text-gray-400 max-w-full truncate px-4">{uploadedFileName}</p>
            )}

            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-gray-900">{loadingMsg}</p>
              {loadingSubMsg && <p className="text-xs text-gray-500">{loadingSubMsg}</p>}
            </div>

            {/* Stage progress dots (decorative) */}
            <div className="flex gap-2" aria-hidden="true">
              {[1, 2, 3, 4].map(i => (
                <span key={i} className={`w-2 h-2 rounded-full ${
                  i < loadingStage ? "bg-teal-200" : i === loadingStage ? "bg-teal-500" : "bg-gray-200"
                }`} />
              ))}
            </div>

            {/* Stage 1-2: text link; Stage 3+: pill button */}
            {loadingStage >= 3 ? (
              <button
                type="button"
                onClick={onMinimise}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-200 bg-teal-50 text-sm font-medium text-teal-700 hover:bg-teal-100 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Continue in background
              </button>
            ) : (
              <button
                type="button"
                onClick={onMinimise}
                className="text-xs text-teal-600 underline underline-offset-2 hover:text-teal-700 transition-colors"
                style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
              >
                Continue in background →
              </button>
            )}
          </div>
        )}

        {/* PRODUCT PICK (multi-product catalog) */}
        {phase === "pick" && pickItems && (
          <ProductPicker
            items={pickItems}
            usedIndices={usedIndices}
            onPick={onPick}
          />
        )}

        {/* DIFF REVIEW */}
        {phase === "diff" && readyDiff && (
          <div className="flex flex-col gap-4">
            {/* Confidence legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500" aria-label="Confidence legend">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" aria-hidden="true" />High — safe to keep
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" aria-hidden="true" />Med — worth a quick check
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" aria-hidden="true" />Low — please verify
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" aria-hidden="true" />Missing — fill manually
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Claude found <span className="font-semibold text-gray-900">{diffRows.length} fields</span>
              {diffRows.some(r => r.skipped) && (
                <> · <span className="text-amber-600">{diffRows.filter(r => r.skipped).length} already set</span></>
              )}.
            </p>

            {showQualityWarning && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Some pages weren&apos;t readable — fields marked &lsquo;missing&rsquo; need manual entry.</span>
              </div>
            )}

            <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
              {diffRows.map(row => (
                <div
                  key={row.key}
                  className={`flex items-center justify-between gap-3 px-4 py-3 ${row.skipped ? "opacity-50" : ""}`}
                  aria-label={row.skipped ? `${row.label} — already set, will not be overwritten` : undefined}
                >
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
                onClick={() => onApplyDiff(false)}
                disabled={highMedCount === 0}
                style={{ minHeight: "44px" }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
              >
                Apply {highMedCount} field{highMedCount !== 1 ? "s" : ""}
              </button>
              {activeRows.length > highMedCount && (
                <button
                  onClick={() => onApplyDiff(true)}
                  style={{ minHeight: "44px" }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Apply all ({activeRows.length})
                </button>
              )}
            </div>

            {onClearAll && (
              <button
                type="button"
                onClick={onClearAll}
                className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
                style={{ minHeight: "44px" }}
              >
                Clear all AI data
              </button>
            )}
          </div>
        )}

        {/* REJECTION */}
        {phase === "rejected" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">No product data found</p>
                <p className="text-xs text-amber-700 mt-1">
                  This file doesn&apos;t look like a polymer catalog or TDS. Make sure it contains
                  product specifications — not a brochure, certificate, or Safety Data Sheet.
                </p>
                <ul className="mt-2 space-y-0.5 text-xs text-amber-700 list-disc list-inside">
                  <li>Text-based PDFs work best</li>
                  <li>Excel sheets with product data columns work well</li>
                  <li>Scanned images may not extract correctly</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              style={{ minHeight: "44px" }}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Try a different file
            </button>
          </div>
        )}

        {/* OCR FAILED */}
        {phase === "ocrFailed" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Couldn&apos;t read this document</p>
                <p className="text-xs text-red-700 mt-0.5">
                  This looks like a scanned image. For best results, upload a text-based PDF.
                  If you only have a scan, try re-scanning at 300 DPI or higher.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onOpenChange(false)}
                style={{ minHeight: "44px" }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Try a different file
              </button>
              <button
                onClick={() => onOpenChange(false)}
                style={{ minHeight: "44px" }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fill manually
              </button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {phase === "error" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              style={{ minHeight: "44px" }}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
