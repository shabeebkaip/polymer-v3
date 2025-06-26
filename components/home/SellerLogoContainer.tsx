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
      className="border border-[var(--green-light)] rounded-[10px] p-4 flex items-center justify-center w-32 h-32 hover:scale-105 duration-300 ease-in-out cursor-pointer"
    >
      <Image
        src={seller.company_logo}
        alt={"img"}
        width={100}
        height={100}
        className="w-full"
      />
    </div>
  );
};

export default SellerLogoContainer;
