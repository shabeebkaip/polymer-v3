"use client";
import Image from "next/image";
import React from "react";
import { useSearchParams } from "next/navigation";

const SupplierBasic: React.FC = () => {
  const searchParams = useSearchParams();
  const supplierDetail = searchParams.get("supplierDetail");
  console.log("Supplier Detail:", supplierDetail);

  return (
    <div
      className={`${
        supplierDetail ? "flex" : "hidden"
      } w-full  border border-primary-500/30 rounded-lg p-4 gap-4 items-center justify-start mb-10`}
    >
      <div>
        <Image
          src={"/assets/seller 2.svg"}
          alt="Supplier Logo"
          width={72}
          height={72}
          className="w-60"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-[var(--dark-main)] text-xl md:text-5xl">
          Pure Health Ingredients (shanghi) co,Itd
        </h2>
        <h4 className="md:text-xl text-gray-400">Shanghal , china </h4>
      </div>
    </div>
  );
};

export default SupplierBasic;
