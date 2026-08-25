"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import type { BgFailReason, BgState, CatalogFileMeta, ProcessingStage } from "@/types/ai";
import { formatElapsed, PROCESSING_STAGE_ORDER, PROCESSING_STEPS } from "./CatalogProcessingWorkbench";
import ImportStopDialog from "./ImportStopDialog";

interface AiProcessingWidgetProps {
  bgState: BgState;
  bgFailReason: BgFailReason | null;
  fieldCount: number;
  pickCount?: number;
  stage: ProcessingStage | null;
  file: CatalogFileMeta | null;
  elapsedSeconds: number;
  delayed: boolean;
  onStop: () => void;
  onViewProgress: () => void;
  onReplaceFile: (file: File) => void;
  onRetry: () => void;
  onDismiss: () => void;
}

const FAILURE_COPY: Record<BgFailReason, { title: string; body: string }> = {
  upload: {
    title: "Upload didn’t complete",
    body: "Check your connection and try the same file again. Your form has not changed.",
  },
  connection: {
    title: "Connection interrupted",
    body: "Your catalogue may still be processing. Reconnect to check its status.",
  },
  expired: {
    title: "This import is no longer available",
    body: "Upload the catalogue again. Your form entries are unchanged.",
  },
  timeout: {
    title: "We couldn’t finish this catalogue",
    body: "Try the file again, choose a smaller or text-based file, or continue manually.",
  },
  error: {
    title: "We couldn’t finish this catalogue",
    body: "Try the file again, choose a smaller or text-based file, or continue manually.",
  },
  ocrFailed: {
    title: "We couldn’t read this document",
    body: "The file appears to be scanned or has too little readable text. Try a text-based PDF or a clearer scan.",
  },
  rejected: {
    title: "No polymer product data found",
    body: "This may be a brochure, certificate, or SDS rather than a product catalogue or TDS.",
  },
};

const ACCEPT = ".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.webp,.gif";
const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPT_RE = /\.(pdf|xlsx|xls|csv|jpg|jpeg|png|webp|gif)$/i;
const ACCEPT_MIME = new Set([
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function ActionButton({ children, onClick, danger = false, primary = false, viewProgress = false }: {
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
  primary?: boolean;
  viewProgress?: boolean;
}) {
  return (
    <button
      type="button"
      data-ai-view-progress={viewProgress ? "" : undefined}
      onClick={onClick}
      className={`min-h-11 rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none ${primary
        ? "bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-700"
        : danger
          ? "text-red-700 hover:bg-red-50 focus-visible:ring-red-700"
          : "text-teal-800 hover:bg-teal-50 focus-visible:ring-teal-700"
      }`}
    >
      {children}
    </button>
  );
}

export default function AiProcessingWidget({
  bgState,
  bgFailReason,
  fieldCount,
  pickCount = 0,
  stage,
  file,
  elapsedSeconds,
  delayed,
  onStop,
  onViewProgress,
  onReplaceFile,
  onRetry,
  onDismiss,
}: AiProcessingWidgetProps) {
  const visible = bgState !== "idle";
  const shouldReduce = useReducedMotion();
  const fileRef = useRef<HTMLInputElement>(null);
  const [stopOpen, setStopOpen] = useState(false);
  const [fileError, setFileError] = useState("");
  const currentStep = stage ? PROCESSING_STEPS[PROCESSING_STAGE_ORDER[stage]] : null;

  const pickReplacement = (replacement: File) => {
    if (replacement.size > MAX_BYTES) {
      setFileError("File exceeds 20 MB limit.");
      return;
    }
    if (!ACCEPT_RE.test(replacement.name) && !ACCEPT_MIME.has(replacement.type)) {
      setFileError("Accepted: PDF, XLSX, XLS, CSV, JPG, PNG, WEBP, GIF");
      return;
    }
    setFileError("");
    onReplaceFile(replacement);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={shouldReduce ? false : { y: 12, opacity: 0 }}
          animate={shouldReduce ? {} : { y: 0, opacity: 1 }}
          exit={shouldReduce ? {} : { y: 12, opacity: 0 }}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          aria-label="Background catalogue task"
          className="fixed z-50 w-[min(380px,calc(100%-3rem))] [inset-block-end:max(1.5rem,env(safe-area-inset-bottom))] [inset-inline-end:max(1.5rem,env(safe-area-inset-right))] rounded-2xl border border-gray-200 bg-white p-4 shadow-lg max-sm:w-auto max-sm:[inset-inline:0.5rem] max-sm:[inset-block-end:max(5rem,env(safe-area-inset-bottom))]"
        >
          {bgState === "processing" && (
            <div>
              <div className="flex min-w-0 items-start gap-3">
                <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <FileText aria-hidden="true" className="size-5" />
                  <span aria-hidden="true" className="absolute end-1.5 top-1.5 size-2 rounded-full bg-teal-600 motion-safe:animate-pulse" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-5 text-gray-950">
                    {currentStep?.title ?? "Processing your catalogue"}
                  </p>
                  <p className="mt-1 line-clamp-2 break-anywhere text-xs leading-5 text-gray-600" title={file?.name}>
                    <bdi>{file?.name ?? "Catalogue upload"}</bdi>
                    <span aria-hidden="true"> · </span>
                    <span dir="ltr" className="tabular-nums">Elapsed {formatElapsed(elapsedSeconds)}</span>
                  </p>
                </div>
              </div>

              {delayed && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
                  Some catalogues need more processing time. Your form entries are safe, and you can keep filling the form.
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-1">
                <ActionButton primary viewProgress onClick={onViewProgress}>View progress</ActionButton>
                <ActionButton onClick={() => fileRef.current?.click()}>Replace file</ActionButton>
                <ActionButton danger onClick={() => setStopOpen(true)}>Stop</ActionButton>
              </div>
            </div>
          )}

          {bgState === "ready" && (
            <div>
              <div className="flex items-start gap-3">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-950">
                    {pickCount > 0 ? `${pickCount} products ready to choose` : "Catalogue ready to review"}
                  </p>
                  <p className="mt-1 line-clamp-2 break-anywhere text-xs text-gray-600" title={file?.name}>
                    <bdi>{file?.name ?? "Catalogue upload"}</bdi>
                    {pickCount === 0 && fieldCount > 0 ? ` · ${fieldCount} fields found` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1">
                <ActionButton primary onClick={onViewProgress}>{pickCount > 0 ? "Choose product" : "Review"}</ActionButton>
                <ActionButton onClick={onDismiss}>Dismiss notification</ActionButton>
              </div>
            </div>
          )}

          {bgState === "failed" && (
            <div role="alert">
              <div className="flex items-start gap-3">
                <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-950">
                    {bgFailReason ? FAILURE_COPY[bgFailReason].title : "We couldn’t finish this catalogue"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    {bgFailReason ? FAILURE_COPY[bgFailReason].body : FAILURE_COPY.error.body}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1">
                <ActionButton primary onClick={onRetry}>{bgFailReason === "connection" ? "Check again" : "Try again"}</ActionButton>
                <ActionButton onClick={() => fileRef.current?.click()}>Choose a different file</ActionButton>
                <ActionButton onClick={onDismiss}>Continue manually</ActionButton>
              </div>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            tabIndex={-1}
            onChange={event => {
              const replacement = event.target.files?.[0];
              if (replacement) pickReplacement(replacement);
              event.target.value = "";
            }}
          />
          {fileError && <p role="alert" className="mt-2 text-xs text-red-700">{fileError}</p>}
          <ImportStopDialog open={stopOpen} onOpenChange={setStopOpen} onStop={onStop} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
