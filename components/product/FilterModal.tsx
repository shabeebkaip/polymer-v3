"use client";

import React, { useEffect } from "react";
import { FilterModalProps } from "@/types/product";

const FilterModal: React.FC<FilterModalProps> = ({ open, onClose, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-start justify-start">
      <div className="h-full w-full max-w-md rounded-r-lg shadow-lg flex flex-col">

        <div className="p-4 border-b font-bold text-lg sticky top-0 bg-white z-10">
          FILTER
          <button
            className="absolute top-2 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>

        <div className="p-4 border-t sticky bottom-0 bg-white z-10">
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded font-semibold transition-colors duration-200"
              onClick={onClose}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
