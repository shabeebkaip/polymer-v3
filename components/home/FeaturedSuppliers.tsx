"use client";
import React from "react";
import SellerLogoContainer from "./SellerLogoContainer";
import { useSharedState } from "@/stores/sharedStore";

const FeaturedSuppliers: React.FC = () => {
  const { sellers } = useSharedState();
  console.log("Featured Suppliers Sellers:", sellers);
  return (
    <section className="bg-gradient-to-br from-gray-50 to-green-50/30 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 md:gap-8">
          {/* Enhanced Header Section */}
          <div className="text-center max-w-4xl mx-auto space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Trusted Partners
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent">
              Featured Suppliers
            </h2>
            <p className="text-[var(--text-gray-tertiary)] font-normal text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
              Partner with industry-leading polymer suppliers from around the globe. Our verified network ensures 
              quality materials, reliable delivery, and competitive pricing for your manufacturing needs.
            </p>
          </div>

          {/* Enhanced Suppliers Grid */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 lg:p-8">
              {/* Mobile Layout - Horizontal Scroll with 1.1 cards visible */}
              <div className="md:hidden">
                <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide pb-2">
                  {sellers?.map((seller, index) => (
                    <div 
                      key={index} 
                      className="flex-shrink-0 w-[calc(90.91%-0.5rem)] group hover:scale-105 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="bg-gray-50 rounded-xl p-4 h-full flex items-center justify-center">
                        <SellerLogoContainer seller={seller} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Desktop Layout - Grid */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 items-center justify-items-center">
                {sellers?.map((seller, index) => (
                  <div 
                    key={index} 
                    className="group hover:scale-110 transition-all duration-300 hover:z-10 relative"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <SellerLogoContainer seller={seller} />
                  </div>
                ))}
              </div>
              
              {/* Call to Action */}
              <div className="mt-6 md:mt-8 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
                  <span className="font-medium">View All Suppliers</span>
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Verified Quality</h3>
              <p className="text-xs md:text-sm text-gray-600">All suppliers undergo rigorous quality verification</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Fast Delivery</h3>
              <p className="text-xs md:text-sm text-gray-600">Quick turnaround times for urgent requirements</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Global Reach</h3>
              <p className="text-xs md:text-sm text-gray-600">Worldwide shipping and local support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSuppliers;
