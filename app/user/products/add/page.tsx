"use client";
import React, { useState } from "react";
import AddEditProduct from "@/components/user/AddEditProduct";
import QuickAddProduct from "@/components/user/products/QuickAddProduct";

const AddProduct = () => {
  const [mode, setMode] = useState<"quick" | "advanced">("quick");

  if (mode === "advanced") {
    return (
      <div>
        <div className="px-6 pt-4">
          <button
            onClick={() => setMode("quick")}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4 flex items-center gap-1"
          >
            ← Back to Quick Add
          </button>
        </div>
        <AddEditProduct />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <QuickAddProduct onSwitchToAdvanced={() => setMode("advanced")} />
    </div>
  );
};

export default AddProduct;
