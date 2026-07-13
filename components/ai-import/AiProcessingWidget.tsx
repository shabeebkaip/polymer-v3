"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import type { BgFailReason, BgState } from "@/types/ai";

interface AiProcessingWidgetProps {
  bgState: BgState;
  bgFailReason: BgFailReason | null;
  fieldCount: number;
  pickCount?: number;
  loadingStage?: 1 | 2 | 3 | 4;
  fileName?: string;
  onCancel: () => void;
  onApply: () => void;
  onRetry: () => void;
  onDismiss: () => void;
}

const FAIL_COPY: Record<BgFailReason, string> = {
  ocrFailed: "Couldn't read this document",
  timeout: "Processing took too long",
  error: "Something went wrong",
};

const STAGE_COPY: Record<1 | 2 | 3 | 4, string> = {
  1: "Reading your catalog…",
  2: "Extracting product data…",
  3: "Still working — large catalog…",
  4: "Almost done — nearly ready",
};

function DismissButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="w-10 h-10 -my-2 -mr-2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shrink-0"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

export default function AiProcessingWidget({
  bgState, bgFailReason, fieldCount, pickCount = 0, loadingStage = 1, fileName,
  onCancel, onApply, onRetry, onDismiss,
}: AiProcessingWidgetProps) {
  const visible = bgState !== "idle";
  const shouldReduce = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={shouldReduce ? false : { y: 16, opacity: 0 }}
          animate={shouldReduce ? {} : { y: 0, opacity: 1 }}
          exit={shouldReduce ? {} : { y: 16, opacity: 0 }}
          transition={shouldReduce ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50 w-80 max-sm:left-4 max-sm:right-4 max-sm:bottom-20 max-sm:w-auto bg-white rounded-2xl shadow-lg border border-gray-200 px-4 py-3.5"
        >
          {bgState === "processing" && (
            <div className="flex items-center gap-3" role="status">
              <Loader2 className="w-4 h-4 text-teal-600 animate-spin motion-reduce:animate-none shrink-0" />
              <p className="flex-1 text-sm font-medium text-gray-900 truncate" title={fileName}>
                {STAGE_COPY[loadingStage]}
              </p>
              <DismissButton onClick={onCancel} label="Cancel catalog processing" />
            </div>
          )}

          {bgState === "ready" && (
            <div className="flex items-center gap-3" role="alert">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <p className="flex-1 text-sm font-medium text-gray-900 truncate" title={fileName}>
                {pickCount > 0
                  ? `${pickCount} products found — choose one`
                  : `${fieldCount} field${fieldCount !== 1 ? "s" : ""} ready — tap Apply`}
              </p>
              <button
                type="button"
                onClick={onApply}
                style={{ minHeight: "44px" }}
                className="px-3 -my-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shrink-0"
              >
                {pickCount > 0 ? "Choose" : "Apply"}
              </button>
              <DismissButton onClick={onDismiss} label="Dismiss" />
            </div>
          )}

          {bgState === "failed" && (
            <div className="flex items-center gap-3" role="alert">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="flex-1 text-sm font-medium text-gray-900 truncate">
                {bgFailReason ? FAIL_COPY[bgFailReason] : "Something went wrong"}
              </p>
              <button
                type="button"
                onClick={onRetry}
                style={{ minHeight: "44px" }}
                className="px-3 -my-2 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
              >
                Try again
              </button>
              <DismissButton onClick={onDismiss} label="Dismiss" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
