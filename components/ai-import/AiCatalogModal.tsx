"use client";

import React, { useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload, AlertCircle, AlertTriangle, FileText,
  FileSpreadsheet, Image as ImageIcon, Sparkles,
} from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";
import ProductPicker from "./ProductPicker";
import CatalogProcessingWorkbench from "./CatalogProcessingWorkbench";
import type { AiModalPhase, CatalogFileMeta, ExtractedProduct, ProcessingStage, ReadyDiff } from "@/types/ai";

// ── Types ─────────────────────────────────────────────────────────────────────

// Re-export so AddEditProduct can still import AiFilledFields from this file
export type { AiFilledFields } from "@/types/ai";

interface AiCatalogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Controlled state from useAiProcessing hook
  phase: AiModalPhase;
  processingStage: ProcessingStage | null;
  uploadedFile: CatalogFileMeta | null;
  elapsedSeconds: number;
  accepted: boolean;
  delayed: boolean;
  readyDiff: ReadyDiff | null;
  errorMsg: string;
  pickItems: ExtractedProduct[] | null;
  usedIndices?: Set<number>;

  // Callbacks
  onFile: (file: File) => void;
  onMinimise: () => void;
  onStop: () => void;
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
        className={`block w-full rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-teal-700 focus-within:ring-offset-2 motion-reduce:transition-none
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
            <Upload aria-hidden="true" className="text-white" size={24} />
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
                <Icon aria-hidden="true" size={11} />{label}
              </span>
            ))}
          </div>
          <button type="button" onClick={e => { e.preventDefault(); inputRef.current?.click(); }}
            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md
              bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none">
            Choose a file
          </button>
        </div>
      </label>
      {localError && (
        <div className="mt-3 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{localError}</span>
        </div>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function AiCatalogModal({
  open, onOpenChange,
  phase, processingStage, uploadedFile, elapsedSeconds, accepted, delayed,
  readyDiff, errorMsg, pickItems, usedIndices,
  onFile, onMinimise, onStop, onApplyDiff, onPick, onClearAll,
}: AiCatalogModalProps) {

  // X during parsing → minimise; all other states → normal close
  const handleOpenChange = (val: boolean) => {
    if (!val && phase === "parsing") { onMinimise(); return; }
    onOpenChange(val);
  };

  const conflictCount = readyDiff?.payload.conflicts.length ?? 0;

  const diffRows = readyDiff?.rows ?? [];
  const activeRows = diffRows.filter(r => !r.skipped);
  const highMedCount = activeRows.filter(r => r.confidence === "high" || r.confidence === "medium").length;
  const unknownCount = diffRows.filter(r => r.confidence === "unknown").length;
  const showQualityWarning = readyDiff?.extractionMethod === "vision" && diffRows.length > 0 && unknownCount / diffRows.length >= 0.4;

  // Modal title per phase
  const title = phase === "diff" ? "Review extracted fields"
    : phase === "pick" ? "Choose a product"
    : phase === "parsing" ? "Preparing your catalogue"
    : phase === "rejected" ? "No product data found"
    : phase === "ocrFailed" ? "Couldn't read this document"
    : phase === "error" ? (errorMsg.startsWith("Upload failed") ? "Upload failed" : "Something went wrong")
    : "Import from a catalog";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        closeLabel={phase === "parsing" ? "Close and keep processing" : "Close"}
        className={`w-[calc(100%-1rem)] max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-2xl p-4 sm:w-[calc(100%-2rem)] sm:max-h-[calc(100dvh-4rem)] sm:p-6 ${phase === "parsing" ? "sm:max-w-[560px]" : phase === "diff" ? "sm:max-w-7xl" : "sm:max-w-lg"}`}
      >
        <DialogHeader className="pe-10 text-start">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            {phase === "parsing"
              ? <FileText aria-hidden="true" className="w-4 h-4 text-teal-700 shrink-0" />
              : <Sparkles aria-hidden="true" className="w-4 h-4 text-teal-600 shrink-0" />}
            {title}
          </DialogTitle>
          {phase === "parsing" && (
            <DialogDescription className="sr-only">
              You can keep filling the form while we prepare the file for review.
            </DialogDescription>
          )}
        </DialogHeader>

        {/* IDLE */}
        {phase === "idle" && <Dropzone onFile={onFile} disabled={false} />}

        {/* PARSING */}
        {phase === "parsing" && (
          <CatalogProcessingWorkbench
            file={uploadedFile}
            stage={processingStage}
            elapsedSeconds={elapsedSeconds}
            accepted={accepted}
            delayed={delayed}
            onMinimise={onMinimise}
            onStop={onStop}
          />
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {diffRows.map(row => (
                <div
                  key={row.key}
                  className={`flex items-start justify-between gap-2 rounded-xl border border-gray-100 px-4 py-3 ${row.skipped ? "opacity-50" : ""}`}
                  aria-label={row.skipped ? `${row.label} — already set, will not be overwritten` : undefined}
                >
                  <div className="min-w-0">
                    <p className={`break-words text-xs font-medium ${row.skipped ? "text-gray-400 line-through" : "text-gray-700"}`}><bdi>{row.label}</bdi></p>
                    <p className="break-words text-xs text-gray-400"><bdi>{row.displayValue}</bdi></p>
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
                style={{ minHeight: "44px" }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                {highMedCount > 0
                  ? `Apply ${highMedCount} field${highMedCount !== 1 ? "s" : ""}`
                  : conflictCount > 0
                    ? `Review ${conflictCount} conflict${conflictCount !== 1 ? "s" : ""}`
                    : "Continue"}
              </button>
              {activeRows.length > highMedCount && (
                <button
                  onClick={() => onApplyDiff(true)}
                  style={{ minHeight: "44px" }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  Apply all ({activeRows.length})
                </button>
              )}
            </div>

            {onClearAll && (
              <button
                type="button"
                onClick={onClearAll}
                className="w-full rounded text-center text-xs text-gray-400 hover:text-red-500 transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
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
