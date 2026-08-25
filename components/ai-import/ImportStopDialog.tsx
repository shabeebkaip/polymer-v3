"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImportStopDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStop: () => void;
}

export default function ImportStopDialog({ open, onOpenChange, onStop }: ImportStopDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl p-5 sm:p-6">
        <DialogHeader className="pe-10 text-start">
          <DialogTitle>Stop this import?</DialogTitle>
          <DialogDescription className="leading-6 text-gray-600">
            The result will not be added to this form. Processing may continue on the server for a short time.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="min-h-11 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Keep processing
          </button>
          <button
            type="button"
            onClick={() => { onOpenChange(false); onStop(); }}
            className="min-h-11 rounded-xl px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Stop import
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
