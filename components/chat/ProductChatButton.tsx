"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ProductChatButtonProps {
  productId: string;
  onChatOpen: (productId: string) => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const ProductChatButton: React.FC<ProductChatButtonProps> = ({
  productId,
  onChatOpen,
  disabled = false,
  className = "",
  variant = 'primary',
  size = 'md'
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChatOpen(productId);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 disabled:bg-emerald-400';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 disabled:bg-gray-50';
      case 'outline':
        return 'bg-transparent hover:bg-emerald-50 text-emerald-600 border-emerald-600 disabled:text-emerald-400 disabled:border-emerald-300';
      default:
        return 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 disabled:bg-emerald-400';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'md':
        return 'w-4 h-4';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 
        border rounded-lg font-medium
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      type="button"
    >
      <MessageCircle className={getIconSize()} />
      Chat with Supplier
    </button>
  );
};

export default ProductChatButton;
