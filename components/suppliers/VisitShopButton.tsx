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
      router.push(`/products?createdBy=${supplierId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition duration-300 w-fit hover:opacity-90 hover:bg-gray-50 mt-2 cursor-pointer"
    >
      <Image
        src="/icons/shop.png"
        alt="Shop Icon"
        width={24}
        height={24}
        className="w-4 h-4"
      />
      <span className="text-sm text-gray-600">Visit Shop</span>
    </button>
  );
};

export default VisitShopButton;
