"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useSharedState } from "@/stores/sharedStore";
import { useCmsStore } from "@/stores/cms";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Globe,
  Package,
  Award,
  Truck,
  Shield,
  Plus,
  ArrowRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 5;

const FeaturedSuppliers: React.FC = () => {
  const router = useRouter();
  const { sellers, sellersTotal } = useSharedState();
  const { homeSections } = useCmsStore();
  const [currentPage, setCurrentPage] = useState(0);

  const uniqueCountries = new Set(
    sellers?.map((s) => s.location).filter(Boolean)
  ).size;
  const totalProducts = sellers?.reduce(
    (sum: number, s: any) => sum + (s.products?.length || 0),
    0
  );

  const badge =
    homeSections?.content?.suppliersBadge || "Trusted Global Suppliers";
  const title =
    homeSections?.content?.suppliersTitle ||
    "Partner With Leading Polymer Suppliers";
  const description =
    homeSections?.content?.suppliersDescription ||
    "Verified manufacturers and distributors supplying high-quality polymer materials worldwide.";

  const totalPages = Math.max(1, Math.ceil((sellers?.length || 0) / ITEMS_PER_PAGE));
  const currentSellers =
    sellers?.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    ) || [];

  const prev = useCallback(
    () => setCurrentPage((p) => Math.max(0, p - 1)),
    []
  );
  const next = useCallback(
    () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1)),
    [totalPages]
  );

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background molecular decorations */}
      <div className="absolute left-0 top-0 bottom-0 w-64 opacity-[0.06] pointer-events-none">
        <svg viewBox="0 0 200 600" className="w-full h-full" fill="none">
          <circle cx="60" cy="120" r="8" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="140" cy="80" r="6" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="100" cy="200" r="10" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="40" cy="280" r="7" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="160" cy="320" r="9" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="80" cy="400" r="6" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="130" cy="460" r="8" stroke="#1a6b3c" strokeWidth="2" />
          <line x1="60" y1="120" x2="140" y2="80" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="140" y1="80" x2="100" y2="200" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="60" y1="120" x2="100" y2="200" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="100" y1="200" x2="40" y2="280" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="40" y1="280" x2="160" y2="320" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="160" y1="320" x2="80" y2="400" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="80" y1="400" x2="130" y2="460" stroke="#1a6b3c" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-64 opacity-[0.06] pointer-events-none">
        <svg viewBox="0 0 200 600" className="w-full h-full" fill="none">
          <circle cx="140" cy="100" r="8" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="60" cy="60" r="6" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="100" cy="180" r="10" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="160" cy="260" r="7" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="50" cy="340" r="9" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="120" cy="420" r="6" stroke="#1a6b3c" strokeWidth="2" />
          <circle cx="70" cy="500" r="8" stroke="#1a6b3c" strokeWidth="2" />
          <line x1="140" y1="100" x2="60" y2="60" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="60" y1="60" x2="100" y2="180" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="140" y1="100" x2="100" y2="180" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="100" y1="180" x2="160" y2="260" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="160" y1="260" x2="50" y2="340" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="50" y1="340" x2="120" y2="420" stroke="#1a6b3c" strokeWidth="1.5" />
          <line x1="120" y1="420" x2="70" y2="500" stroke="#1a6b3c" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 border border-primary-300 rounded-full text-primary-700 text-xs font-semibold uppercase tracking-widest mb-6 bg-white shadow-sm">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            {badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Carousel */}
        <div className="flex items-center gap-3 md:gap-5 mb-5">
          <button
            onClick={prev}
            disabled={currentPage === 0}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex divide-x divide-gray-100">
              {currentSellers.length > 0 ? (
                currentSellers.map((seller) => {
                  const displayName = seller.company?.trim() || seller.name?.trim() || "Supplier";
                  const initial = displayName.charAt(0).toUpperCase();
                  return (
                    <button
                      key={seller._id}
                      onClick={() => router.push(`/sellers/${seller._id}`)}
                      className="flex-1 flex flex-col items-center justify-center gap-3 p-6 md:p-8 min-h-[140px] hover:bg-primary-50/30 transition-colors group"
                    >
                      {seller.company_logo ? (
                        <>
                          <div className="flex items-center justify-center h-14">
                            <Image
                              src={seller.company_logo}
                              alt={displayName}
                              width={120}
                              height={56}
                              className="object-contain max-h-14 w-auto grayscale group-hover:grayscale-0 transition-all duration-300"
                            />
                          </div>
                          <span className="text-xs text-gray-400 font-medium truncate max-w-[100px] group-hover:text-primary-600 transition-colors">
                            {displayName}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-md group-hover:shadow-primary-200 group-hover:scale-105 transition-all duration-300">
                            <span className="text-white text-xl font-bold">
                              {initial}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 font-medium text-center leading-tight max-w-[100px] truncate group-hover:text-primary-600 transition-colors">
                            {displayName}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="flex-1 flex items-center justify-center py-16 text-gray-400 text-sm">
                  No suppliers yet
                </div>
              )}
            </div>
          </div>

          <button
            onClick={next}
            disabled={currentPage >= totalPages - 1}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mb-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`rounded-full transition-all duration-200 ${
                i === currentPage
                  ? "w-6 h-2.5 bg-primary-600"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="flex items-center gap-3 md:gap-4 p-5 md:p-8">
              <div className="flex-shrink-0 w-11 h-11 bg-primary-50 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold text-primary-600">
                  {sellersTotal > 0 ? `${sellersTotal}+` : "—"}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  Verified Suppliers
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 md:gap-4 p-5 md:p-8">
              <div className="flex-shrink-0 w-11 h-11 bg-primary-50 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold text-primary-600">
                  {uniqueCountries > 0 ? `${uniqueCountries}+` : "—"}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  Countries Served
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 md:gap-4 p-5 md:p-8">
              <div className="flex-shrink-0 w-11 h-11 bg-primary-50 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-xl md:text-3xl font-bold text-primary-600">
                  {totalProducts > 0 ? `${totalProducts}+` : "—"}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  Polymer Products
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={() => router.push("/sellers")}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-md"
          >
            <Users className="w-5 h-5" />
            Explore Suppliers
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push("/auth/register?role=seller")}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-full font-semibold hover:bg-primary-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Become a Supplier
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            <div className="flex items-start gap-4 p-5 md:p-6">
              <div className="flex-shrink-0 w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5">
                <Award className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                  Verified Suppliers
                </h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  Rigorous verification ensures authentic and reliable partners
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 md:p-6">
              <div className="flex-shrink-0 w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5">
                <Truck className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                  Fast Delivery
                </h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  Quick turnaround with efficient logistics and on-time delivery
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 md:p-6">
              <div className="flex-shrink-0 w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5">
                <Globe className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                  Global Distribution
                </h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  Worldwide shipping network with local support
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 md:p-6">
              <div className="flex-shrink-0 w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5">
                <Shield className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">
                  Quality Assurance
                </h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  Strict quality standards for consistent performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSuppliers;
