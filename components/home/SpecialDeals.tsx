"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  MapPin,
  Package,
  Zap,
  Gift,
} from "lucide-react";
import { useSharedState } from "@/stores/sharedStore";
import { FALLBACK_COMPANY_IMAGE } from "@/lib/fallbackImages";
import { useUserInfo } from "@/lib/useUserInfo";
import { useRouter } from "next/navigation";

interface Deal {
  id: string;
  type: "special-deal";
  title: string;
  supplier: {
    name: string;
    logo: string;
    rating: number;
    location: string;
  };
  product: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  minQuantity: string;
  validUntil: string;
  description: string;
  badge: string;
  // Additional fields from API
  dealStatus?: string;
  dealType?: string;
  createdAt?: string;
}

const SpecialDeals: React.FC = () => {
  const { suppliersSpecialDeals, suppliersSpecialDealsLoading } =
    useSharedState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUserInfo();
  const userType = user?.user_type; // buyer or seller
  const isGuest = !user; // User is not logged in
  const isBuyer = Boolean(user && userType === "buyer");
  const isSupplier = Boolean(user && userType === "seller");

  // Check if we have real data
  const hasRealData =
    Array.isArray(suppliersSpecialDeals) && suppliersSpecialDeals.length > 0;

  // Show loading only if we're loading AND don't have data yet
  const showLoading = suppliersSpecialDealsLoading && !hasRealData;

  // Transform and display deals data
  const displayDeals = React.useMemo(() => {
    try {
      if (
        Array.isArray(suppliersSpecialDeals) &&
        suppliersSpecialDeals.length > 0
      ) {
        // Transform API data to match our Deal interface
        return suppliersSpecialDeals.map((item: any, index: number) => {
          // Use the actual API structure based on the provided response
          const originalPrice = parseFloat(item.productId?.price) || 100;
          const discountedPrice =
            parseFloat(item.offerPrice) || originalPrice * 0.85;
          const discount =
            originalPrice > 0
              ? Math.round(
                  ((originalPrice - discountedPrice) / originalPrice) * 100
                )
              : 0;

          // Extract seller name from email if company name not available
          const sellerName =
            item.sellerId?.company ||
            item.sellerId?.companyName ||
            (item.sellerId?.email
              ? item.sellerId.email.split("@")[0].charAt(0).toUpperCase() +
                item.sellerId.email.split("@")[0].slice(1)
              : "Supplier Company");

          const transformedDeal = {
            id: item._id,
            type: "special-deal" as const,
            title: `${
              item.productId?.productName || "Special Product"
            } - Limited Offer`,
            supplier: {
              name: sellerName,
              logo: item.sellerId?.company_logo || FALLBACK_COMPANY_IMAGE,
              rating: 4.5, // Default rating since not in API
              location:
                item.sellerId?.location ||
                item.sellerId?.address ||
                "Location not specified",
            },
            product: item.productId?.productName || "Special Product",
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            discount: Math.max(discount, 0), // Ensure discount is not negative
            minQuantity: item.minimumQuantity || "1 Unit",
            validUntil:
              item.validUntil ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            description:
              item.productId?.description ||
              `Special deal on ${
                item.productId?.productName || "product"
              } with attractive pricing.`,
            badge:
              item.adminNote && item.adminNote.trim()
                ? "FEATURED"
                : discount > 20
                ? "FLASH DEAL"
                : discount > 10
                ? "BULK OFFER"
                : "HOT DEAL",
            // Additional fields from API
            dealStatus: item.status,
            dealType: item.dealType,
            createdAt: item.createdAt,
          };

          return transformedDeal;
        });
      }

      // Temporary fallback with API-structure mock data for testing
      const mockApiData = [
        {
          _id: "685e79cf133bc1aa26760fee",
          productId: {
            _id: "68257e39b1a3690ee5b039b3",
            productName: "ImpactGuard PC",
            description:
              "High-impact strength polymer ideal for safety glazing and electronics.",
            price: 3.25,
          },
          sellerId: {
            _id: "6818b5e1571c9558d3d76358",
            email: "bob@buildcorp.com",
          },
          offerPrice: 100,
          status: "approved",
          adminNote: "This deal meets our pricing criteria.",
        },
      ];

      return mockApiData.map((item: any, index: number) => {
        const originalPrice = parseFloat(item.productId?.price) || 100;
        const discountedPrice =
          parseFloat(item.offerPrice) || originalPrice * 0.85;
        const discount =
          originalPrice > 0
            ? Math.round(
                ((originalPrice - discountedPrice) / originalPrice) * 100
              )
            : 0;

        const sellerName =
          item.sellerId?.company ||
          item.sellerId?.companyName ||
          (item.sellerId?.email
            ? item.sellerId.email.split("@")[0].charAt(0).toUpperCase() +
              item.sellerId.email.split("@")[0].slice(1)
            : "Supplier Company");

        return {
          id: item._id,
          type: "special-deal" as const,
          title: `${
            item.productId?.productName || "Special Product"
          } - Limited Offer`,
          supplier: {
            name: sellerName,
            logo: "/assets/company-logos/default.jpg",
            rating: 4.5,
            location: "Location not specified",
          },
          product: item.productId?.productName || "Special Product",
          originalPrice: originalPrice,
          discountedPrice: discountedPrice,
          discount: Math.max(discount, 0),
          minQuantity: "1 Unit",
          validUntil: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          description:
            item.productId?.description ||
            `Special deal on ${
              item.productId?.productName || "product"
            } with attractive pricing.`,
          badge:
            item.adminNote && item.adminNote.trim() ? "FEATURED" : "HOT DEAL",
          dealStatus: item.status,
          createdAt: new Date().toISOString(),
        };
      });
    } catch (error) {
      console.error("Error processing suppliers special deals:", error);
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Only show deals to buyers and guests, hide from suppliers
  if (isSupplier) {
    return null;
  }

  return (
    <div className="mb-16 container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-green-700 p-2 rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Special Deals by Suppliers
            </h3>
            <p className="text-gray-700 text-sm">
              Exclusive offers and competitive prices from trusted suppliers
            </p>
          </div>
        </div>
        <span className="bg-gray-100 text-green-700 px-3 py-1 rounded text-xs font-semibold border border-green-200">
          {displayDeals.length} Available
        </span>
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
                      <div className="bg-green-200 h-8 rounded mb-3"></div>
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
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow border p-5 animate-pulse"
                  >
                    <div className="bg-green-200 h-8 rounded mb-3"></div>
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
                    <div
                      key={deal.id}
                      className="flex-shrink-0 w-[calc(90.91%-0.5rem)]"
                    >
                      <DealCard 
                        deal={deal} 
                        formatPrice={formatPrice} 
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Special Deals Available
              </h3>
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
                className={`w-3 h-3 rounded-full border border-green-300 transition-all duration-200 ${
                  currentSlide === index
                    ? "bg-green-700 w-6"
                    : "bg-gray-200 hover:bg-gray-300"
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
const DealCard: React.FC<{
  deal: Deal;
  formatPrice: (price: number) => string;
  isGuest: boolean;
  isBuyer: boolean;
}> = ({ deal, formatPrice, isGuest, isBuyer }) => {
  const router = useRouter();
  
  const handleButtonClick = () => {
    if (isGuest) {
      // Redirect to signup page for guests
      router.push("/auth/register");
    } else if (isBuyer) {
      // Handle deal grabbing for buyers
      console.log("Grabbing deal:", deal.id);
      // Add your deal grabbing logic here
    }
  };

  const getButtonText = () => {
    if (isGuest) {
      return "Sign Up for More Details";
    } else if (isBuyer) {
      return "Grab This Deal";
    }
    return "View Deal";
  };

  return (
    <div className="bg-white rounded-xl shadow border hover:shadow-xl transition-all duration-200 overflow-hidden group">
      {/* Badge */}
      <div className="bg-green-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Gift className="w-4 h-4" />
          {deal.badge}
        </span>
        {deal.discount > 0 && (
          <span className="bg-white text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">
            -{deal.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-5">
        {/* Product Info */}
        <h4 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">
          {deal.product}
        </h4>
        <p className="text-gray-700 text-xs mb-3 line-clamp-2">
          {deal.description}
        </p>

        {/* Supplier Info */}
        <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center overflow-hidden">
            <Package className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {deal.supplier.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{deal.supplier.rating}</span>
              <span>•</span>
              <MapPin className="w-3 h-3" />
              <span className="truncate">{deal.supplier.location}</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-green-700">
            {formatPrice(deal.discountedPrice)}
          </span>
          {deal.originalPrice !== deal.discountedPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(deal.originalPrice)}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            <span>Min: {deal.minQuantity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              Valid till {new Date(deal.validUntil).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleButtonClick}
          className="w-full bg-green-700 text-white py-2 rounded font-medium border border-green-800 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2 group"
        >
          <Zap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="tracking-tight">{getButtonText()}</span>
        </button>
      </div>
    </div>
  );
};

export default SpecialDeals;
