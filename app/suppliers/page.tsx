"use client";
import { useEffect, useState } from "react";
import SupplierCard from "@/components/suppliers/SupplierCard";
import React from "react";
import { getSellers } from "@/apiServices/shared";
import { useSharedState } from "@/stores/sharedStore";

interface Seller {
  _id: string;
  company: string;
  company_logo: string;
  location: string;
  website: string;
  [key: string]: any;
}

const SuppliersPage: React.FC = () => {
  const { sellers, fetchSellers } = useSharedState();

  useEffect(() => {
    fetchSellers();
  }, []);
  console.log("sellers", sellers);
  return (
    <section className="mt-10 container mx-auto px-4 ">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Our Trusted Suppliers
      </h1>
      <div className="mb-8">
        <p className="text-gray-600 text-lg mb-4">
          Connect with our extensive network of verified suppliers and
          manufacturers from around the world. Our platform brings together
          industry-leading companies that specialize in polymer materials,
          chemical products, and related services.
        </p>
        <p className="text-gray-600 mb-4">
          Each supplier in our network has been carefully vetted to ensure they
          meet our high standards for quality, reliability, and professionalism.
          Whether you're looking for raw materials, finished products, or
          specialized services, our suppliers are ready to meet your business
          needs.
        </p>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Why Choose Our Suppliers?
          </h3>
          <ul className="text-green-700 space-y-1">
            <li>• Verified and trusted business partners</li>
            <li>• Competitive pricing and flexible terms</li>
            <li>• Global reach with local expertise</li>
            <li>• Quality assurance and compliance standards</li>
            <li>• Direct communication and fast response times</li>
          </ul>
        </div>
        <p className="text-gray-600">
          Browse through our supplier directory below to find the perfect
          partner for your business. Click on any supplier card to view their
          detailed profile, product catalog, and contact information.
        </p>
      </div>
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
