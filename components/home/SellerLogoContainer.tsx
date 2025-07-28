"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { sellerLogoContainerType } from "@/types/seller";

interface SellerLogoContainerProps {
  seller: sellerLogoContainerType;
}

const SellerLogoContainer: React.FC<SellerLogoContainerProps> = ({
  seller,
}) => {
  const router = useRouter();
  console.log("Seller Logo Container Seller:", seller);
  return (
    <div
      onClick={() => router.push(`/sellers/${seller._id}`)}
      className="border border-emerald-600 rounded-[10px] p-4 flex items-center justify-center w-20 h-20 hover:scale-105 hover:shadow-xl focus:scale-105 focus:shadow-xl focus:ring-2 focus:ring-green-300 duration-300 ease-in-out cursor-pointer group"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter") router.push(`/sellers/${seller._id}`);
      }}
      aria-label={seller.company_logo}
    >
      <Image
        src={seller.company_logo}
        alt={"img"}
        width={100}
        height={100}
        className="w-full transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
};

export default SellerLogoContainer;
