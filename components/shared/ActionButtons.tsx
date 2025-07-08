"use client";

import React, { useState } from "react";
import { ShoppingCart, FileText, MessageCircle } from "lucide-react";
import QuoteRequestModal from "./QuoteRequestModal";
import SampleRequestModal from "./SampleRequestModal";
import dynamic from "next/dynamic";

const ProductChatModal = dynamic(() => import("@/components/chat/ProductChatModal"), { ssr: false });

interface ActionButtonsProps {
  productId: string;
  uom: string;
  className?: string;
  variant?: "default" | "compact" | "large" | "custom";
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  productId,
  uom,
  className = "",
  variant = "default"
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Define button styles based on variant
  const getButtonStyles = (type: "quote" | "sample" | "chat") => {
    const baseStyles = "transition-all font-medium rounded-lg flex items-center justify-center gap-2";
    
    switch (variant) {
      case "compact":
        if (type === "chat") return `${baseStyles} px-4 py-2 text-sm border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50`;
        return `${baseStyles} px-4 py-2 text-sm ${
          type === "quote" 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        }`;
        
      case "large":
        if (type === "chat") return `${baseStyles} px-8 py-4 text-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50`;
        return `${baseStyles} px-8 py-4 text-lg ${
          type === "quote" 
            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white" 
            : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        }`;
        
      case "custom":
        return className;
        
      default: // "default"
        if (type === "chat") return `${baseStyles} px-6 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50`;
        return `${baseStyles} px-6 py-3 ${
          type === "quote" 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        }`;
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Quote Request Button */}
      <QuoteRequestModal
        productId={productId}
        uom={uom}
        className={getButtonStyles("quote")}
      >
        <ShoppingCart className="w-5 h-5" />
        Request Quote
      </QuoteRequestModal>

      {/* Sample Request Button */}
      <SampleRequestModal
        productId={productId}
        uom={uom}
        className={getButtonStyles("sample")}
      >
        <FileText className="w-5 h-5" />
        Request Sample
      </SampleRequestModal>

      {/* Chat with Supplier Button */}
      <button
        type="button"
        className={getButtonStyles("chat")}
        onClick={() => setIsChatOpen(true)}
        aria-label="Chat with Supplier"
      >
        <MessageCircle className="w-5 h-5" />
        Chat with Supplier
      </button>
      {isChatOpen && (
        <ProductChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          productId={productId}
        />
      )}
    </div>
  );
};

export default ActionButtons;
