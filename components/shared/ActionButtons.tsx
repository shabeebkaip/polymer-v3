"use client";

import React from "react";
import { ShoppingCart, FileText } from "lucide-react";
import QuoteRequestModal from "./QuoteRequestModal";
import SampleRequestModal from "./SampleRequestModal";
import ProductChatButton from "@/components/chat/ProductChatButton";
import { useUserInfo } from "@/lib/useUserInfo";

interface ActionButtonsProps {
  productId: string;
  uom: string;
  className?: string;
  variant?: "default" | "compact" | "large" | "custom";
  onChatOpen?: () => void; // Add this prop
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  productId,
  uom,
  className = "",
  variant = "default",
  onChatOpen
}) => {
  const { user } = useUserInfo();
  
  const canChat = user?.user_type === 'buyer';

  const handleChatOpen = (productId: string) => {
    if (onChatOpen) {
      onChatOpen();
    }
  };

  // Define button styles based on variant
  const getButtonStyles = (type: "quote" | "sample" | "chat") => {
    const baseStyles = "transition-all font-medium rounded-lg flex items-center justify-center gap-2";
    
    switch (variant) {
      case "compact":
        return `${baseStyles} px-4 py-2 text-sm ${
          type === "quote" 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : type === "chat"
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        }`;
        
      case "large":
        return `${baseStyles} px-8 py-4 text-lg ${
          type === "quote" 
            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white" 
            : type === "chat"
            ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        }`;
        
      case "custom":
        return className;
        
      default: // "default"
        return `${baseStyles} px-6 py-3 ${
          type === "quote" 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : type === "chat"
            ? "bg-green-600 hover:bg-green-700 text-white"
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
      <ProductChatButton
        productId={productId}
        onChatOpen={handleChatOpen}
        className={getButtonStyles("chat")}
        variant={variant === "compact" ? "secondary" : "primary"}
        size={variant === "large" ? "lg" : variant === "compact" ? "sm" : "md"}
        disabled={!canChat}
      />
    </div>
  );
};

export default ActionButtons;
