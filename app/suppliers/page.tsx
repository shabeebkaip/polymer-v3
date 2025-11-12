'use client';
import { useEffect } from 'react';
import SupplierCard from '@/components/suppliers/SupplierCard';
import React from 'react';
import { useSharedState } from '@/stores/sharedStore';

const SuppliersPage: React.FC = () => {
  const { sellers, fetchSellers, sellersLoading } = useSharedState();

  useEffect(() => {
    (async () => {
      await fetchSellers();
    })();
  }, [fetchSellers]);
  return (
    <section className="mt-10 container mx-auto px-4 ">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Trusted Suppliers</h1>
      <div className="mb-8">
        <p className="text-gray-600 text-lg mb-4">
          {
            'Connect with our extensive network of verified suppliers and manufacturers from around the world. Our platform brings together industry-leading companies that specialize in polymer materials,chemical products, and related services.'
          }
        </p>
        <p className="text-gray-600 mb-4">
          {
            "Each supplier in our network has been carefully vetted to ensure they meet our high standards for quality, reliability, and professionalism.Whether you're looking for raw materials, finished products, orspecialized services, our suppliers are ready to meet your businessneeds."
          }
        </p>
        <div className="bg-primary-50 border-l-4 border-primary-500 p-4 mb-6">
          <h3 className="text-lg font-semibold text-primary-600 mb-2">Why Choose Our Suppliers?</h3>
          <ul className="text-primary-500 space-y-1">
            <li>• Verified and trusted business partners</li>
            <li>• Competitive pricing and flexible terms</li>
            <li>• Global reach with local expertise</li>
            <li>• Quality assurance and compliance standards</li>
            <li>• Direct communication and fast response times</li>
          </ul>
        </div>
        <p className="text-gray-600">
          {
            'Browse through our supplier directory below to find the perfect partner for your business. Click on any supplier card to view their detailed profile, product catalog, and contact information.'
          }
        </p>
      </div>
      <div className="grid grid-cols-12 gap-4 mb-10">
        <div className="col-span-12 grid grid-cols-12 gap-4 mt-4">
          {sellersLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 animate-pulse"
                >
                  <div className="rounded-2xl p-5 w-full flex items-center border border-primary-500/20 bg-white/90 shadow-sm">
                    <div className="w-20 h-20 md:w-24 md:h-24 mr-5 rounded-xl bg-primary-50" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-5 bg-primary-50 rounded w-2/3" />
                      <div className="h-4 bg-primary-50 rounded w-1/2" />
                      <div className="h-4 bg-primary-50 rounded w-1/3" />
                      <div className="h-8 bg-primary-50 rounded w-1/4 mt-2" />
                    </div>
                  </div>
                </div>
              ))
            : sellers.map((supplier, index) => (
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
