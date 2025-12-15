'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Gift } from 'lucide-react';
import { useSharedState } from '@/stores/sharedStore';
import { FALLBACK_COMPANY_IMAGE } from '@/lib/fallbackImages';
import { useUserInfo } from '@/lib/useUserInfo';
import { Deal, ApiDeal } from '@/types/home';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useRouter } from 'next/navigation';

import 'swiper/css';
import 'swiper/css/navigation';

import DealCard from './DealCard';

const SpecialDeals: React.FC = () => {
  const router = useRouter();
  const { suppliersSpecialDeals, suppliersSpecialDealsLoading } = useSharedState();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
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
              id: typeof item.sellerId === 'object' ? (item.sellerId as { _id?: string })?._id || '' : item.sellerId || '',
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
            <h3 className="text-2xl font-bold text-gray-900">Special Deals by Suppliers</h3>
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
            onClick={() => router.push('/deals')}
          >
            View All
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-200 items-center justify-center group hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!swiperInstance}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
        </button>

        <button
          onClick={() => swiperInstance?.slideNext()}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-200 items-center justify-center group hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!swiperInstance}
        >
          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
        </button>

        {/* Cards Container */}
        <div className="px-4 md:px-0">
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
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1.1}
              onSwiper={setSwiperInstance}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className="deals-swiper"
            >
              {displayDeals.map((deal) => (
                <SwiperSlide key={deal.id}>
                  <DealCard
                    deal={deal}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                    isGuest={isGuest}
                    isBuyer={isBuyer}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Special Deals Available</h3>
              <p className="text-gray-600">
                Check back later for exclusive deals from our suppliers.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .deals-swiper .swiper-wrapper {
          align-items: stretch;
        }
        .deals-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
        .deals-swiper .swiper-slide > div {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

// Deal Card Component

export default SpecialDeals;
