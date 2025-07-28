"use client";
import React from "react";
import SellerLogoContainer from "./SellerLogoContainer";
import { useSharedState } from "@/stores/sharedStore";
import { useRouter } from "next/navigation";
import { Truck, Globe, ShieldCheck } from "lucide-react";

const FeaturedSuppliers: React.FC = () => {
  const router = useRouter();
  const { sellers } = useSharedState();

  return (
    <section className="bg-white py-12 md:py-16 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium mb-2 border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Trusted Partners
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Featured Suppliers
            </h2>
            <p className="text-gray-500 font-normal text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Partner with industry-leading polymer suppliers from around the globe.
              Our verified network ensures quality materials, reliable delivery, and
              competitive pricing for your manufacturing needs.
            </p>
          </div>

          {/* Trust Indicators - Prominent and Professional */}
          <div className="w-full max-w-4xl mt-2">
            <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm justify-center items-center">
              <div className="flex-1 flex flex-col items-center text-center min-w-[120px]">
                <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl mb-2">
                  <ShieldCheck className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  Verified Quality
                </h3>
                <p className="text-xs text-gray-500">
                  All suppliers undergo rigorous quality verification and compliance
                  checks
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center text-center min-w-[120px]">
                <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl mb-2">
                  <Truck className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  Fast Delivery
                </h3>
                <p className="text-xs text-gray-500">
                  Quick turnaround times with express shipping options for urgent
                  requirements
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center text-center min-w-[120px]">
                <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl mb-2">
                  <Globe className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  Global Network
                </h3>
                <p className="text-xs text-gray-500">
                  Worldwide shipping network with local support and multilingual
                  assistance
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row - Clean and Modern */}
          <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-2">
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xl font-bold text-green-600 mb-0.5">500+</div>
              <div className="text-xs text-gray-500">Verified Suppliers</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xl font-bold text-green-600 mb-0.5">50+</div>
              <div className="text-xs text-gray-500">Countries</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xl font-bold text-green-600 mb-0.5">24/7</div>
              <div className="text-xs text-gray-500">Support</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-xl font-bold text-green-600 mb-0.5">99%</div>
              <div className="text-xs text-gray-500">Satisfaction</div>
            </div>
          </div>

          {/* Suppliers Slider - Clean, Minimal, Mobile-first */}
          <div className="w-full max-w-xl mx-auto">
            {/* Replace with your Swiper slider or SupplierSlider component */}
            {/* <SupplierSlider sellers={sellers || []} /> */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
              {sellers?.map((seller, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 min-w-[100px] max-w-[120px] bg-white rounded-xl p-3 shadow border border-gray-100 flex items-center justify-center hover:shadow-md transition-all duration-200"
                >
                  <SellerLogoContainer seller={seller} />
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-center">
              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-base shadow-sm hover:from-green-600 hover:to-emerald-700 transition-all"
                onClick={() => router.push("/suppliers")}
              >
                View All Suppliers
                <svg
                  className="w-4 h-4"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSuppliers;
