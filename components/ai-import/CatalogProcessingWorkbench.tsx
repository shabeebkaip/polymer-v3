"use client";

import { useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import type { CatalogFileMeta, ProcessingStage } from "@/types/ai";
import ImportStopDialog from "./ImportStopDialog";

export const PROCESSING_STEPS: ReadonlyArray<{
  id: ProcessingStage;
  title: string;
  description: string;
}> = [
  { id: "uploaded", title: "Upload received", description: "Your file is attached to this import." },
  { id: "extracting", title: "Reading the document", description: "Reading text, tables, and supported images." },
  { id: "analysing", title: "Identifying product data", description: "Looking for product names and supported specifications." },
  { id: "matching", title: "Matching catalogue terms", description: "Comparing supported categories and units with PolymersHub." },
  { id: "preparing", title: "Preparing your review", description: "Organising the result for you to check." },
];

export const PROCESSING_STAGE_ORDER = Object.fromEntries(
  PROCESSING_STEPS.map((step, index) => [step.id, index]),
) as Record<ProcessingStage, number>;

export function isProcessingStage(value: unknown): value is ProcessingStage {
  return typeof value === "string" && value in PROCESSING_STAGE_ORDER;
}

export function formatElapsed(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatFileMeta(file: CatalogFileMeta | null) {
  if (!file) return "";
  const extension = file.name.split(".").pop()?.toUpperCase();
  const type = extension && extension.length <= 5 ? extension : file.type.split("/").pop()?.toUpperCase() || "FILE";
  const size = file.size >= 1024 * 1024
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(file.size / 1024))} KB`;
  return `${type} · ${size}`;
}

// Reasonable progression across the 5 real server-reported stages (§M-P.1
// truth contract — driven by the actual `stage` field from polling, never by
// a timer). Never reaches 100 while still in the parsing phase; the terminal
// jump to 100 happens implicitly when the modal hands off to diff/pick.
const STAGE_PERCENT: Record<ProcessingStage, number> = {
  uploaded: 10,
  extracting: 30,
  analysing: 55,
  matching: 80,
  preparing: 95,
};

interface CatalogProcessingWorkbenchProps {
  file: CatalogFileMeta | null;
  stage: ProcessingStage | null;
  elapsedSeconds: number;
  accepted: boolean;
  delayed: boolean;
  onMinimise: () => void;
  onStop: () => void;
}

export default function CatalogProcessingWorkbench({
  file,
  stage,
  elapsedSeconds,
  accepted,
  delayed,
  onMinimise,
  onStop,
}: CatalogProcessingWorkbenchProps) {
  const [stopOpen, setStopOpen] = useState(false);
  const step = stage ? PROCESSING_STEPS[PROCESSING_STAGE_ORDER[stage]] : null;
  const currentTitle = step?.title ?? "Processing your catalogue";
  const percent = step ? STAGE_PERCENT[step.id] : accepted ? STAGE_PERCENT.uploaded : 0;
  const statusText = delayed ? "Still working on this catalogue" : currentTitle;

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex min-w-0 flex-col gap-3 border-b border-gray-200 pb-4 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            <FileText aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="line-clamp-2 break-anywhere text-sm font-semibold leading-5 text-gray-950" title={file?.name}>
              <bdi>{file?.name ?? "Catalogue upload"}</bdi>
            </p>
            {file && <p className="mt-0.5 text-xs font-medium text-gray-500" dir="ltr">{formatFileMeta(file)}</p>}
          </div>
        </div>
        <p className="shrink-0 text-xs font-semibold tabular-nums text-gray-500" dir="ltr">
          Elapsed {formatElapsed(elapsedSeconds)}
        </p>
      </div>

      {/* Linear progress bar + single rotating status line. The visible
          percentage is derived only from the real server `stage` (never a
          timer); the aria-live announcement for stage changes is already
          owned by the page's single status region (useAiProcessing's
          acceptStage -> onStatusMessage), so this component doesn't add a
          second live region. */}
      <section className="mt-5" aria-labelledby="catalogue-current-status">
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-labelledby="catalogue-current-status"
          className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
        >
          <div
            className="h-full rounded-full bg-emerald-700 transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${percent}%` }}
          />
        </div>

        <h3
          id="catalogue-current-status"
          tabIndex={-1}
          className="mt-3 rounded text-base font-semibold text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          {statusText}
        </h3>

        {delayed && (
          <p className="mt-1 text-sm leading-5 text-gray-600">
            Some catalogues need more processing time. Your form entries are safe, and you can keep filling the form.
          </p>
        )}
      </section>

      <p className="mt-4 flex items-start gap-2 text-sm leading-5 text-gray-600">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal-700" />
        <span>Keep working—nothing is applied until you review it.</span>
      </p>

      <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onMinimise}
          className="min-h-11 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Keep filling the form
        </button>
        <button
          type="button"
          onClick={() => setStopOpen(true)}
          className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Stop import
        </button>
      </div>

      <ImportStopDialog open={stopOpen} onOpenChange={setStopOpen} onStop={onStop} />
    </div>
  );
}
