"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const VisitShopButton = ({ supplierId }) => {
  const router = useRouter();
  return (
    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition duration-300 w-fit">
      <Image
        src="/icons/shop.png"
        alt="Shop Icon"
        width={24}
        height={24}
        className="w-4 h-4"
      />
      <span
        className="text-sm text-gray-600"
        onClick={() => router.push(`/products?supplier=${supplierId}`)}
      >
        Visit Shop
      </span>
    </button>
  );
};

export default VisitShopButton;
