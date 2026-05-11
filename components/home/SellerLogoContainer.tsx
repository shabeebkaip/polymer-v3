"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { SellerLogoContainerProps } from "@/types/seller";



const SellerLogoContainer: React.FC<SellerLogoContainerProps> = ({
  seller,
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/suppliers/${seller._id}`)}
      className="border border-primary-500 rounded-xl flex items-center justify-center w-[70px] h-[70px] bg-white hover:shadow-lg hover:border-primary-600 focus:shadow-lg focus:border-primary-600 transition-all duration-200 cursor-pointer group outline-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/suppliers/${seller._id}`);
      }}
      aria-label={seller.company_logo}
    >
      {seller.company_logo ? (
        <Image
          src={seller.company_logo}
          alt={seller.company || "Supplier Logo"}
          width={56}
          height={56}
          className="object-contain w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-105 transition-transform duration-200"
          draggable={false}
        />
      ) : (
        <span className="text-primary-600 font-bold text-lg select-none">
          {seller.company?.charAt(0).toUpperCase() || "S"}
        </span>
      )}
    </div>
  );
};

export default SellerLogoContainer;
