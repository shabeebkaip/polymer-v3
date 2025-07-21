"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface VisitShopButtonProps {
  supplierId: string;
}

const VisitShopButton: React.FC<VisitShopButtonProps> = ({ supplierId }) => {
  const router = useRouter();

  const handleClick = () => {
    if (supplierId) {
      router.push(`/suppliers/${supplierId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-lg hover:from-green-600 hover:to-green-800 hover:scale-[1.03] transition-all duration-200 w-fit mt-2 cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-green-400"
    >
      <Image
        src="/icons/shop.png"
        alt="Shop Icon"
        width={28}
        height={28}
        className="w-5 h-5 drop-shadow"
      />
      <span className="text-base">Visit Supplier Profile</span>
    </button>
  );
};

export default VisitShopButton;
