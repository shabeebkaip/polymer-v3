'use client';

import React from 'react';
import { ShoppingCart, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QuoteRequestModal from './QuoteRequestModal';
import SampleRequestModal from './SampleRequestModal';
import { UserType } from '@/types/user';

interface ActionButtonsProps {
  productId: string;
  uom: string;
  className?: string;
  variant?: 'default' | 'compact' | 'large' | 'custom';
  onChatClick?: () => void;
  user: UserType;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  productId,
  uom,
  className = '',
  variant = 'default',
  user,
}) => {
  const router = useRouter();

  const getButtonStyles = (type: 'quote' | 'sample' | 'chat') => {
    const baseStyles =
      'transition-all font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer ';
    switch (variant) {
      case 'compact':
        if (type === 'chat')
          return `${baseStyles} px-4 py-2 text-sm border-2 border-primary-500 text-primary-500 hover:bg-primary-50`;
        return `${baseStyles} px-4 py-2 text-sm ${
          type === 'quote'
            ? 'border border-primary-500 text-primary-500 cursor-pointer hover:bg-primary-50'
            : 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50'
        }`;
      case 'large':
        if (type === 'chat')
          return `${baseStyles} px-8 py-4 text-lg border-2 border-primary-500 text-primary-500 hover:bg-primary-50`;
        return `${baseStyles} px-8 py-4 text-lg ${
          type === 'quote'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
            : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
        }`;
      case 'custom':
        return className;
      default:
        if (type === 'chat')
          return `${baseStyles} px-6 py-3 border-2 border-primary-500 text-primary-500 hover:bg-primary-50`;
        return `${baseStyles} px-6 py-3 ${
          type === 'quote'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
        }`;
    }
  };

  return (
    <div className={` ${user?.user_type !== 'buyer' ? 'hidden' : 'flex flex-wrap gap-3'}`}>
      <QuoteRequestModal productId={productId} uom={uom} className={getButtonStyles('quote')}>
        <ShoppingCart className="w-5 h-5" />
        Request Quote
      </QuoteRequestModal>
      <SampleRequestModal productId={productId} uom={uom} className={getButtonStyles('sample')}>
        <FileText className="w-5 h-5" />
        Request Sample
      </SampleRequestModal>

      {user?.user_type === 'buyer' && (
        <button
          className={getButtonStyles('sample')}
          onClick={() => router.push(`/user/finance-requests/add?productId=${productId}`)}
          type="button"
        >
          <FileText className="w-5 h-5" />
          Request Finance
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
