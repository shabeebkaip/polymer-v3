"use client";
import React from "react";
import SellerLogoContainer from "./SellerLogoContainer";
import { useSharedState } from "@/stores/sharedStore";
import { useRouter } from "next/navigation";

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
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-white/50 rounded-xl border border-green-100">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-600">Verified Suppliers</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-blue-100">
                <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-purple-100">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  24/7
                </div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-orange-100">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  99%
                </div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>

            {/* Suppliers Showcase */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50/50 to-green-50/30 border border-gray-200 shadow-xl">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="relative p-6 md:p-8">
                {/* Mobile Layout - Horizontal Scroll */}
                <div className="md:hidden">
                  <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                    {sellers?.map((seller, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-32 group"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                          <SellerLogoContainer seller={seller} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Layout - Enhanced Grid */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-items-center">
                    {sellers?.map((seller, index) => (
                      <div
                        key={index}
                        className="group relative"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border border-gray-100 group-hover:border-green-200">
                          <div className="relative">
                            <SellerLogoContainer seller={seller} />
                            <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 text-center">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
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
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
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

          {/* Enhanced Trust Indicators */}
          <div className="w-full max-w-5xl">
            <div className="bg-gradient-to-r from-white via-green-50/30 to-white rounded-2xl p-6 border border-green-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center group">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="absolute -inset-2 bg-green-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    Verified Quality
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    All suppliers undergo rigorous quality verification and
                    compliance checks
                  </p>
                </div>
                <div className="text-center group">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    Fast Delivery
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Quick turnaround times with express shipping options for
                    urgent requirements
                  </p>
                </div>
                <div className="text-center group">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                      />
                    </svg>
                    <div className="absolute -inset-2 bg-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
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
