'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Gift } from 'lucide-react';
import { useSharedState } from '@/stores/sharedStore';
import { FALLBACK_COMPANY_IMAGE } from '@/lib/fallbackImages';
import { useUserInfo } from '@/lib/useUserInfo';
import { Deal, ApiDeal } from '@/types/home';

import DealCard from './DealCard';

const SpecialDeals: React.FC = () => {
  const { suppliersSpecialDeals, suppliersSpecialDealsLoading } = useSharedState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user: currentUser } = useUserInfo();
  const userType = currentUser?.user_type; // buyer or seller
  const isGuest = !currentUser; // User is not logged in
  const isBuyer = Boolean(currentUser && userType === 'buyer');
  const isSupplier = Boolean(currentUser && userType === 'seller');

  // Check if we have real data
  const hasRealData = Array.isArray(suppliersSpecialDeals) && suppliersSpecialDeals.length > 0;

  // Show loading only if we're loading AND don't have data yet
  const showLoading = suppliersSpecialDealsLoading && !hasRealData;

  // Transform and display deals data
  const displayDeals = React.useMemo<Deal[]>(() => {
    try {
      if (Array.isArray(suppliersSpecialDeals) && suppliersSpecialDeals.length > 0) {
        // Transform API data to match our Deal interface
        return suppliersSpecialDeals.map((item: ApiDeal) => {
          const originalPrice =
            typeof item.productId?.price === 'number'
              ? item.productId.price
              : parseFloat(String(item.productId?.price || '0')) || 100;
          const discountedPrice =
            typeof item.offerPrice === 'number'
              ? item.offerPrice
              : parseFloat(String(item.offerPrice || '0')) || originalPrice * 0.85;
          const discount =
            originalPrice > 0
              ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
              : 0;

          // Extract seller name from email if company name not available
          const sellerName =
            item.sellerId?.company ||
            item.sellerId?.companyName ||
            (item.sellerId?.email
              ? item.sellerId.email.split('@')[0].charAt(0).toUpperCase() +
                item.sellerId.email.split('@')[0].slice(1)
              : 'Supplier Company');

          const transformedDeal: Deal = {
            id: item._id || `deal-${Date.now()}-${Math.random()}`,
            type: 'special-deal',
            title: `${item.productId?.productName || 'Special Product'} - Limited Offer`,
            supplier: {
              name: sellerName,
              logo: item.sellerId?.company_logo || FALLBACK_COMPANY_IMAGE,
              rating: 4.5, // Default rating since not in API
              location:
                item.sellerId?.location || item.sellerId?.address || 'Location not specified',
            },
            product: item.productId?.productName || 'Special Product',
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            discount: Math.max(discount, 0), // Ensure discount is not negative
            minQuantity: item.minimumQuantity || '1 Unit',
            validUntil:
              item.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            description:
              item.productId?.description ||
              `Special deal on ${
                item.productId?.productName || 'product'
              } with attractive pricing.`,
            badge:
              item.adminNote && item.adminNote.trim()
                ? 'FEATURED'
                : discount > 20
                  ? 'FLASH DEAL'
                  : discount > 10
                    ? 'BULK OFFER'
                    : 'HOT DEAL',
            // Additional fields from API
            dealStatus: item.status,
            dealType: item.dealType,
            createdAt: item.createdAt,
          };

          return transformedDeal;
        });
      }
      return [];
    } catch (error) {
      console.error('Error processing suppliers special deals:', error);
      return [];
    }
  }, [suppliersSpecialDeals]);

  const itemsPerSlide = 3;
  const slides = Math.ceil(displayDeals.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides) % slides);
  };

  const getCurrentDeals = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return displayDeals.slice(startIndex, startIndex + itemsPerSlide);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Use a consistent format that works the same on server and client
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Only show deals to buyers and guests, hide from suppliers
  if (isSupplier) {
    return null;
  }

  return (
    <div className="mb-16 container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 p-2 rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Special Deals by Suppliers</h3>
            <p className="text-gray-700 text-sm">
              Exclusive offers and competitive prices from trusted suppliers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-gray-100 text-primary-600 px-3 py-1 rounded text-xs font-semibold border border-primary-500">
            {displayDeals.length} Available
          </span>
          <button
            className="ml-2 px-3 py-1 rounded text-xs font-semibold bg-white border border-primary-500 text-primary-600 hover:bg-primary-50 transition"
            onClick={() => {
              // TODO: Implement navigation to all deals page
            }}
          >
            View All
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Navigation Buttons - Desktop Only */}
        <button
          onClick={prevSlide}
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded p-2 shadow border hover:bg-gray-100 transition-all duration-200"
          disabled={slides <= 1}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded p-2 shadow border hover:bg-gray-100 transition-all duration-200"
          disabled={slides <= 1}
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Cards Container */}
        <div className="mx-0 md:mx-12">
          {showLoading ? (
            <>
              {/* Mobile Loading - Horizontal Scroll */}
              <div className="md:hidden">
                <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow border p-5 animate-pulse flex-shrink-0 w-[calc(90.91%-0.5rem)]"
                    >
                      <div className="bg-primary-500/20 h-8 rounded mb-3"></div>
                      <div className="bg-gray-100 h-4 rounded mb-2"></div>
                      <div className="bg-gray-100 h-4 rounded w-3/4 mb-4"></div>
                      <div className="flex gap-2 mb-3">
                        <div className="bg-gray-200 h-6 rounded flex-1"></div>
                        <div className="bg-gray-100 h-6 rounded w-16"></div>
                      </div>
                      <div className="bg-gray-200 h-8 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Desktop Loading - Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow border p-5 animate-pulse">
                    <div className="bg-primary-500/20 h-8 rounded mb-3"></div>
                    <div className="bg-gray-100 h-4 rounded mb-2"></div>
                    <div className="bg-gray-100 h-4 rounded w-3/4 mb-4"></div>
                    <div className="flex gap-2 mb-3">
                      <div className="bg-gray-200 h-6 rounded flex-1"></div>
                      <div className="bg-gray-100 h-6 rounded w-16"></div>
                    </div>
                    <div className="bg-gray-200 h-8 rounded"></div>
                  </div>
                ))}
              </div>
            </>
          ) : displayDeals.length > 0 ? (
            <>
              {/* Mobile Layout - Horizontal Scroll with 1.1 cards visible */}
              <div className="md:hidden">
                <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide pb-2">
                  {displayDeals.map((deal) => (
                    <div key={deal.id} className="flex-shrink-0 w-[calc(90.91%-0.5rem)]">
                      <DealCard
                        deal={deal}
                        formatPrice={formatPrice}
                        formatDate={formatDate}
                        isGuest={isGuest}
                        isBuyer={isBuyer}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Desktop Layout - Grid with Pagination */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentDeals().map((deal) => (
                  <div key={deal.id} className="group">
                    <DealCard
                      deal={deal}
                      formatPrice={formatPrice}
                      formatDate={formatDate}
                      isGuest={isGuest}
                      isBuyer={isBuyer}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Special Deals Available</h3>
              <p className="text-gray-600">
                Check back later for exclusive deals from our suppliers.
              </p>
            </div>
          )}
        </div>

        {/* Slide Indicators - Desktop Only */}
        {slides > 1 && (
          <div className="hidden md:flex justify-center mt-6 gap-2">
            {Array.from({ length: slides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full border border-primary-500 transition-all duration-200 ${
                  currentSlide === index ? 'bg-primary-500 w-6' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Deal Card Component

export default SpecialDeals;
