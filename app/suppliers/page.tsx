"use client";
import { useEffect, useState } from "react";
import SupplierCard from "@/components/suppliers/SupplierCard";
import React from "react";
import { getSellers } from "@/apiServices/shared";

interface Seller {
  _id: string;
  company: string;
  company_logo: string;
  location: string;
  website: string;
  [key: string]: any;
}

const SuppliersPage: React.FC = () => {
  const [sellers, setSellers] = useState<any[]>([]);

  useEffect(() => {
    getSellers().then((response) => {
      const sellerData: Seller[] = response.data;
      setSellers(sellerData);
    });
  }, []);
  console.log("sellers", sellers);
  return (
    <section className="mt-10 container mx-auto px-4 ">
      <div className="grid grid-cols-12 gap-4 mb-10">
        <div className="col-span-12 grid grid-cols-12 gap-4 mt-4">
          {sellers.map((supplier, index) => (
            <SupplierCard
              logo={supplier?.company_logo}
              name={supplier?.company}
              location={supplier?.location}
              website={supplier?.website}
              supplierId={supplier?._id}
              key={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuppliersPage;
