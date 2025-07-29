"use client";
import React from "react";
import SellerLogoContainer from "./SellerLogoContainer";
import { useSharedState } from "@/stores/sharedStore";
import { useRouter } from "next/navigation";
import { BadgeCheck, Clock, Globe } from "lucide-react";

const FeaturedSuppliers: React.FC = () => {
  const router = useRouter();
  const { sellers } = useSharedState();

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
              Partner with industry-leading polymer suppliers from around the
              globe. Our verified network ensures quality materials, reliable
              delivery, and competitive pricing for your manufacturing needs.
            </p>
          </div>

          {/* Enhanced Suppliers Grid */}
          <div className="w-full max-w-6xl">
            {/* Stats Row - Fully Responsive */}
            <div className="flex gap-4 mb-8 overflow-x-auto scrollbar-hide md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
              <div className="text-center p-4 bg-white/50 rounded-xl border border-green-100 min-w-[140px] flex-shrink-0">
                <div className="text-2xl font-bold text-green-600 mb-1">500+</div>
                <div className="text-sm text-gray-600">Verified Suppliers</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-green-100 min-w-[140px] flex-shrink-0">
                <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-green-100 min-w-[140px] flex-shrink-0">
                <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-green-100 min-w-[140px] flex-shrink-0">
                <div className="text-2xl font-bold text-green-600 mb-1">99%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>

            {/* Suppliers Showcase */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50/50 to-green-50/30 border border-gray-200 shadow-xl">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="relative p-4 sm:p-6 md:p-8">
                {/* Mobile Layout - Horizontal Scroll */}
                <div className="md:hidden">
                  <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 pr-4">
                    {sellers?.map((seller, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 min-w-[120px] sm:min-w-[140px] group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 flex items-center justify-center">
                          <SellerLogoContainer seller={seller} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Layout - Enhanced Flex Row, Always Centered */}
                <div className="hidden md:flex justify-center items-center gap-4 flex-wrap">
                  {sellers?.map((seller, index) => (
                    <div
                      key={index}
                      className="group relative flex items-center justify-center"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-green-200 flex items-center justify-center min-w-[70px] min-h-[70px] max-w-[90px] max-h-[90px]">
                        <SellerLogoContainer seller={seller} />
                      </div>
                    </div>
                  )).slice(0, 8)}
                </div>

                {/* Call to Action - Responsive */}
                <div className="mt-8 text-center">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                    <button className="w-full sm:w-auto inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold justify-center">
                      <span>View All Suppliers</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => router.push("/auth/register?role=seller")}
                      className="w-full sm:w-auto inline-flex items-center gap-3 px-6 py-4 bg-white border-2 border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold justify-center"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Become a Supplier</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Trust Indicators - Fully Responsive */}
          <div className="w-full max-w-5xl mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gradient-to-r from-white via-green-50/30 to-white rounded-2xl p-4 sm:p-6 border border-green-100 shadow-sm">
              <div className="text-center group flex flex-col items-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BadgeCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Verified Quality
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  All suppliers undergo rigorous quality verification and
                  compliance checks
                </p>
              </div>
              <div className="text-center group flex flex-col items-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Fast Delivery
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Quick turnaround times with express shipping options for
                  urgent requirements
                </p>
              </div>
              <div className="text-center group flex flex-col items-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Global Network
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Worldwide shipping network with local support and
                  multilingual assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle,
            #e5e7eb 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }
      `}</style>
    </section>
  );
};

export default FeaturedSuppliers;
