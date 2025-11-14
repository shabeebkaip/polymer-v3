'use client';

import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

interface VisitShopButtonProps {
  supplierId: string;
  from?: string; // Optional prop to indicate where the button is used
}

const VisitShopButton: React.FC<VisitShopButtonProps> = ({ supplierId, from }) => {
  const router = useRouter();
  const handleClick = () => {
    if (supplierId) {
      router.push(`/suppliers/${supplierId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={
        from === 'supplier'
          ? 'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500 text-white font-semibold shadow hover:bg-primary-600 transition-all duration-200 w-fit cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm'
          : 'flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white font-semibold shadow-lg hover:bg-primary-600 hover:scale-[1.03] transition-all duration-200 w-fit  cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-primary-500'
      }
    >
      <Image
        src="/icons/shop.png"
        alt="Shop Icon"
        width={from === 'supplier' ? 20 : 28}
        height={from === 'supplier' ? 20 : 28}
        className={from === 'supplier' ? 'w-4 h-4 drop-shadow' : 'w-5 h-5 drop-shadow'}
      />
      <span className={from === 'supplier' ? 'text-sm' : 'text-base'}>Visit Supplier Profile</span>
    </button>
  );
};

export default VisitShopButton;
