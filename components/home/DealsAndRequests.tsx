"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Calendar, MapPin, Package, TrendingUp, Users, Clock, ArrowRight, Zap, Gift } from "lucide-react";
import { useUserInfo } from "@/lib/useUserInfo";
import { useSharedState } from "@/stores/sharedStore";

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

interface Request {
  id: string;
  type: "buyer-request";
  title: string;
  buyer: {
    company: string;
    location: string;
    verified: boolean;
  };
  product: string;
  quantity: string;
  budget: string;
  deadline: string;
  description: string;
  urgency: "low" | "medium" | "high";
  responses: number;
  // Additional fields from API
  destination?: string;
  sellerStatus?: string;
  requestDocument?: string;
  createdAt?: string;
}

type CardData = Deal | Request;

// Dummy data
const dummyDeals: Deal[] = [
  {
    id: "1",
    type: "special-deal",
    title: "Premium HDPE Granules - Limited Time Offer",
    supplier: {
      name: "Polymer Industries Ltd",
      logo: "/assets/company-logos/polymer-ind.jpg",
      rating: 4.8,
      location: "Mumbai, India"
    },
    product: "HDPE Granules",
    originalPrice: 125000,
    discountedPrice: 95000,
    discount: 24,
    minQuantity: "5 MT",
    validUntil: "2025-07-15",
    description: "High-quality HDPE granules perfect for blow molding applications",
    badge: "FLASH SALE"
  },
  {
    id: "2",
    type: "special-deal",
    title: "PVC Compound Bulk Discount",
    supplier: {
      name: "ChemTech Solutions",
      logo: "/assets/company-logos/chemtech.jpg",
      rating: 4.9,
      location: "Gujarat, India"
    },
    product: "PVC Compound",
    originalPrice: 85000,
    discountedPrice: 72000,
    discount: 15,
    minQuantity: "10 MT",
    validUntil: "2025-07-30",
    description: "Flexible PVC compound for cable and wire applications",
    badge: "BULK OFFER"
  },
  {
    id: "3",
    type: "special-deal",
    title: "PP Homopolymer Special Price",
    supplier: {
      name: "Global Polymers",
      logo: "/assets/company-logos/global-poly.jpg",
      rating: 4.7,
      location: "Chennai, India"
    },
    product: "PP Homopolymer",
    originalPrice: 98000,
    discountedPrice: 88000,
    discount: 10,
    minQuantity: "3 MT",
    validUntil: "2025-08-10",
    description: "High-flow PP homopolymer for injection molding",
    badge: "HOT DEAL"
  }
];

const dummyRequests: Request[] = [
  {
    id: "1",
    type: "buyer-request",
    title: "Urgent: Food Grade PE for Packaging",
    buyer: {
      company: "PackTech Industries",
      location: "Delhi, India",
      verified: true
    },
    product: "Food Grade PE",
    quantity: "20 MT",
    budget: "₹15-18 Lakh",
    deadline: "2025-07-05",
    description: "Need FDA approved food grade PE for flexible packaging films",
    urgency: "high",
    responses: 12
  },
  {
    id: "2",
    type: "buyer-request",
    title: "ABS Plastic for Automotive Parts",
    buyer: {
      company: "AutoParts Manufacturing",
      location: "Pune, India",
      verified: true
    },
    product: "ABS Plastic",
    quantity: "8 MT",
    budget: "₹8-10 Lakh",
    deadline: "2025-07-20",
    description: "High impact ABS plastic for automotive interior components",
    urgency: "medium",
    responses: 8
  },
  {
    id: "3",
    type: "buyer-request",
    title: "PC/ABS Blend for Electronics",
    buyer: {
      company: "TechComponents Ltd",
      location: "Bangalore, India",
      verified: true
    },
    product: "PC/ABS Blend",
    quantity: "5 MT",
    budget: "₹12-15 Lakh",
    deadline: "2025-08-01",
    description: "Flame retardant PC/ABS blend for electronic housings",
    urgency: "low",
    responses: 15
  }
];

const DealsAndRequests: React.FC = () => {
  const { user } = useUserInfo();
  const { buyerOpportunities, buyerOpportunitiesLoading, suppliersSpecialDeals, suppliersSpecialDealsLoading } = useSharedState();
  const [currentDealsSlide, setCurrentDealsSlide] = useState(0);
  const [currentRequestsSlide, setCurrentRequestsSlide] = useState(0);
  
  // Check if we have real data
  const hasRealDealsData = Array.isArray(suppliersSpecialDeals) && suppliersSpecialDeals.length > 0;
  const hasRealRequestsData = Array.isArray(buyerOpportunities) && buyerOpportunities.length > 0;
  
  // Show loading only if we're loading AND don't have data yet
  const showDealsLoading = suppliersSpecialDealsLoading && !hasRealDealsData;
  const showRequestsLoading = buyerOpportunitiesLoading && !hasRealRequestsData;
  // Safely use real supplier special deals data with fallback to dummy data
  const displayDeals = React.useMemo(() => {
    try {
      if (Array.isArray(suppliersSpecialDeals) && suppliersSpecialDeals.length > 0) {
        // Transform API data to match our Deal interface
        return suppliersSpecialDeals.map((item: any, index: number) => {
          
          // Use the actual API structure based on the provided response
          const originalPrice = parseFloat(item.productId?.price) || 100;
          const discountedPrice = parseFloat(item.offerPrice) || originalPrice * 0.85;
          const discount = originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
          
          // Extract seller name from email if company name not available
          const sellerName = item.sellerId?.company || 
                             item.sellerId?.companyName || 
                             (item.sellerId?.email ? item.sellerId.email.split('@')[0].charAt(0).toUpperCase() + item.sellerId.email.split('@')[0].slice(1) : "Supplier Company");

          const transformedDeal = {
            id: item._id,
            type: "special-deal" as const,
            title: `${item.productId?.productName || 'Special Product'} - Limited Offer`,
            supplier: {
              name: sellerName,
              logo: item.sellerId?.company_logo || "/assets/company-logos/default.jpg",
              rating: 4.5, // Default rating since not in API
              location: item.sellerId?.location || item.sellerId?.address || "Location not specified"
            },
            product: item.productId?.productName || "Special Product",
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            discount: Math.max(discount, 0), // Ensure discount is not negative
            minQuantity: item.minimumQuantity || "1 Unit",
            validUntil: item.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            description: item.productId?.description || `Special deal on ${item.productId?.productName || 'product'} with attractive pricing.`,
            badge: item.adminNote && item.adminNote.trim() ? "FEATURED" : (discount > 20 ? "FLASH DEAL" : discount > 10 ? "BULK OFFER" : "HOT DEAL"),
            // Additional fields from API
            dealStatus: item.status,
            dealType: item.dealType,
            createdAt: item.createdAt
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
            description: "High-impact strength polymer ideal for safety glazing and electronics.",
            price: 3.25
          },
          sellerId: {
            _id: "6818b5e1571c9558d3d76358",
            email: "bob@buildcorp.com"
          },
          offerPrice: 100,
          status: "approved",
          adminNote: "This deal meets our pricing criteria."
        }
      ];
      
      return mockApiData.map((item: any, index: number) => {
        const originalPrice = parseFloat(item.productId?.price) || 100;
        const discountedPrice = parseFloat(item.offerPrice) || originalPrice * 0.85;
        const discount = originalPrice > 0 ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
        
        const sellerName = item.sellerId?.company || 
                           item.sellerId?.companyName || 
                           (item.sellerId?.email ? item.sellerId.email.split('@')[0].charAt(0).toUpperCase() + item.sellerId.email.split('@')[0].slice(1) : "Supplier Company");

        return {
          id: item._id,
          type: "special-deal" as const,
          title: `${item.productId?.productName || 'Special Product'} - Limited Offer`,
          supplier: {
            name: sellerName,
            logo: "/assets/company-logos/default.jpg",
            rating: 4.5,
            location: "Location not specified"
          },
          product: item.productId?.productName || "Special Product",
          originalPrice: originalPrice,
          discountedPrice: discountedPrice,
          discount: Math.max(discount, 0),
          minQuantity: "1 Unit",
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          description: item.productId?.description || `Special deal on ${item.productId?.productName || 'product'} with attractive pricing.`,
          badge: item.adminNote && item.adminNote.trim() ? "FEATURED" : "HOT DEAL",
          dealStatus: item.status,
          createdAt: new Date().toISOString()
        };
      });
    } catch (error) {
      console.error("Error processing suppliers special deals:", error);
      return dummyDeals;
    }
  }, [suppliersSpecialDeals]);

  // Safely use real buyer opportunities data with fallback to dummy data
  const displayRequests = React.useMemo(() => {
    console.log("displayRequests useMemo - buyerOpportunities:", buyerOpportunities);
    console.log("displayRequests useMemo - loading:", buyerOpportunitiesLoading);
    
    try {
      if (Array.isArray(buyerOpportunities) && buyerOpportunities.length > 0) {
        // Transform API data to match our Request interface
        return buyerOpportunities.map((item: any, index: number) => {
          
          // Determine urgency based on delivery date or message content
          const deliveryDate = new Date(item.delivery_date);
          const daysUntilDelivery = Math.ceil((deliveryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const hasUrgentKeywords = item.message?.toLowerCase().includes('urgent') || item.message?.toLowerCase().includes('asap');
          
          let urgency: "low" | "medium" | "high" = "medium";
          if (hasUrgentKeywords || daysUntilDelivery <= 7) {
            urgency = "high";
          } else if (daysUntilDelivery <= 30) {
            urgency = "medium";
          } else {
            urgency = "low";
          }

          const transformedRequest = {
            id: item._id,
            type: "buyer-request" as const,
            title: `${item.product?.productName || item.productName || 'Product Request'} - Bulk Order`,
            buyer: {
              company: item.user?.company || item.user?.companyName || item.buyerCompany || "Anonymous Company",
              location: item.city && item.country ? `${item.city}, ${item.country}` : item.location || "Location not specified",
              verified: item.status === 'approved' || item.user?.verified || false
            },
            product: item.product?.productName || item.productName || "Product",
            quantity: item.uom ? `${item.quantity} ${item.uom}` : `${item.quantity || 'N/A'}`,
            budget: item.budget || "Contact for quote",
            deadline: item.delivery_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            description: item.message || `Bulk order requirement for ${item.product?.productName || item.productName || 'product'}${item.destination ? '. Delivery to ' + item.destination : ''}.`,
            urgency: urgency,
            responses: item.responseMessage?.length || item.responses || 0,
            // Additional fields from API
            destination: item.destination,
            sellerStatus: item.sellerStatus,
            requestDocument: item.request_document,
            createdAt: item.createdAt
          };
          
          console.log(`Transformed request ${index + 1}:`, transformedRequest);
          return transformedRequest;
        });
      }
      console.log("No buyerOpportunities found, using dummy data");
      return dummyRequests;
    } catch (error) {
      console.error("Error processing buyer opportunities:", error);
      return dummyRequests;
    }
  }, [buyerOpportunities]);

  // Always show both sections - no tabs needed
  const itemsPerSlide = 3;
  const dealsSlides = Math.ceil(displayDeals.length / itemsPerSlide);
  const requestsSlides = Math.ceil(displayRequests.length / itemsPerSlide);

  const nextDealsSlide = () => {
    setCurrentDealsSlide((prev) => (prev + 1) % dealsSlides);
  };

  const prevDealsSlide = () => {
    setCurrentDealsSlide((prev) => (prev - 1 + dealsSlides) % dealsSlides);
  };

  const nextRequestsSlide = () => {
    setCurrentRequestsSlide((prev) => (prev + 1) % requestsSlides);
  };

  const prevRequestsSlide = () => {
    setCurrentRequestsSlide((prev) => (prev - 1 + requestsSlides) % requestsSlides);
  };

  const getCurrentDeals = () => {
    const startIndex = currentDealsSlide * itemsPerSlide;
    return displayDeals.slice(startIndex, startIndex + itemsPerSlide);
  };

  const getCurrentRequests = () => {
    const startIndex = currentRequestsSlide * itemsPerSlide;
    return displayRequests.slice(startIndex, startIndex + itemsPerSlide);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 ">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Driving Business Excellence Through Supply
          <br />
          <span className="text-green-700">and Demand Synergy</span>
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto font-medium">
          Discover exclusive deals from trusted suppliers and connect with buyers seeking quality products
        </p>
      </div>

      {/* Special Deals Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-green-700 p-2 rounded-lg">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Special Deals by Suppliers</h3>
              <p className="text-gray-700 text-sm">Exclusive offers and competitive prices from trusted suppliers</p>
            </div>
          </div>
          <span className="bg-gray-100 text-green-700 px-3 py-1 rounded text-xs font-semibold border border-green-200">
            {displayDeals.length} Available
          </span>
        </div>

        <div className="relative">
          {/* Navigation Buttons for Deals */}
          <button
            onClick={prevDealsSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded p-2 shadow border hover:bg-gray-100 transition-all duration-200"
            disabled={dealsSlides <= 1}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={nextDealsSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded p-2 shadow border hover:bg-gray-100 transition-all duration-200"
            disabled={dealsSlides <= 1}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Deals Cards Container */}
          <div className="mx-12">
            {showDealsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow border p-5 animate-pulse">
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentDeals().map((deal) => (
                  <div key={deal.id} className="group">
                    <DealCard deal={deal} formatPrice={formatPrice} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deals Slide Indicators */}
          {dealsSlides > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: dealsSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDealsSlide(index)}
                  className={`w-3 h-3 rounded-full border border-green-300 transition-all duration-200 ${currentDealsSlide === index
                      ? "bg-green-700 w-6"
                      : "bg-gray-200 hover:bg-gray-300"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buyer Requests Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-700 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Bulk Order Opportunities</h3>
              <p className="text-gray-700 text-sm">Active bulk orders from verified buyers seeking suppliers</p>
            </div>
          </div>
          <span className="bg-gray-100 text-purple-700 px-3 py-1 rounded text-xs font-semibold border border-purple-200">
            {displayRequests.length} Active
          </span>
        </div>

        <div className="relative">
          {/* Navigation Buttons for Requests */}
          <button
            onClick={prevRequestsSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded p-2 shadow border hover:bg-gray-100 transition-all duration-200"
            disabled={requestsSlides <= 1}
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={nextRequestsSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded p-2 shadow border hover:bg-gray-100 transition-all duration-200"
            disabled={requestsSlides <= 1}
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Requests Cards Container */}
          <div className="mx-12">
            {showRequestsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow border p-5 animate-pulse">
                    <div className="bg-gray-200 h-6 rounded mb-3"></div>
                    <div className="bg-gray-100 h-4 rounded mb-2"></div>
                    <div className="bg-gray-100 h-4 rounded w-3/4 mb-4"></div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-100 h-12 rounded"></div>
                      <div className="bg-gray-100 h-12 rounded"></div>
                    </div>
                    <div className="bg-gray-200 h-8 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentRequests().map((request) => (
                  <div key={request.id} className="group">
                    <RequestCard request={request} getUrgencyColor={getUrgencyColor} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Requests Slide Indicators */}
          {requestsSlides > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: requestsSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentRequestsSlide(index)}
                  className={`w-3 h-3 rounded-full border border-purple-300 transition-all duration-200 ${currentRequestsSlide === index
                      ? "bg-purple-700 w-6"
                      : "bg-gray-200 hover:bg-gray-300"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-700 text-white px-8 py-3 rounded font-medium border border-green-800 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2">
            <Zap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="tracking-tight">View All Special Deals</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button className="bg-purple-700 text-white px-8 py-3 rounded font-medium border border-purple-800 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2">
            <TrendingUp className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="tracking-tight">Browse All Bulk Orders</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Deal Card Component
const DealCard: React.FC<{ deal: Deal; formatPrice: (price: number) => string }> = ({ deal, formatPrice }) => (
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
      <h4 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">{deal.product}</h4>
      <p className="text-gray-700 text-xs mb-3 line-clamp-2">{deal.description}</p>

      {/* Supplier Info */}
      <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-lg">
        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center overflow-hidden">
          <Package className="w-4 h-4 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm truncate">{deal.supplier.name}</h3>
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
        <span className="text-xl font-bold text-green-700">{formatPrice(deal.discountedPrice)}</span>
        {deal.originalPrice !== deal.discountedPrice && (
          <span className="text-sm text-gray-400 line-through">{formatPrice(deal.originalPrice)}</span>
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
          <span>Valid till {new Date(deal.validUntil).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-green-700 text-white py-2 rounded font-medium border border-green-800 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2 group">
        <Zap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        <span className="tracking-tight">Grab This Deal</span>
      </button>
    </div>
  </div>
);

// Request Card Component - Matching design with DealCard
const RequestCard: React.FC<{ request: Request; getUrgencyColor: (urgency: "low" | "medium" | "high") => string }> = ({ request, getUrgencyColor }) => (
  <div className="bg-white rounded-xl shadow border hover:shadow-xl transition-all duration-200 overflow-hidden group">
    {/* Header */}
    <div className="bg-purple-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
      <span className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        BULK ORDER REQUEST
      </span>
      <span className={`px-2 py-1 rounded text-xs font-bold border ${getUrgencyColor(request.urgency)}`}>
        {request.urgency.toUpperCase()} PRIORITY
      </span>
    </div>

    <div className="p-5">
      {/* Product Request Info */}
      <h4 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">{request.product}</h4>
      <p className="text-gray-700 text-xs mb-3 line-clamp-2">{request.description}</p>

      {/* Buyer Info */}
      <div className="flex items-center gap-3 mb-3 p-2 bg-purple-50 rounded-lg">
        <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
          <Users className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 text-sm truncate">{request.buyer.company}</h3>
            {request.buyer.verified && (
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">
                ✓
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{request.buyer.location}</span>
          </div>
        </div>
      </div>

      {/* Request Details */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500 uppercase font-semibold">Quantity</span>
          </div>
          <p className="font-bold text-purple-700 text-sm">{request.quantity}</p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-500 uppercase font-semibold">Deadline</span>
          </div>
          <p className="font-bold text-blue-700 text-sm">{new Date(request.deadline).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Destination (if available) */}
      {request.destination && (
        <div className="bg-green-50 p-3 rounded-lg mb-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-500 uppercase font-semibold">Destination</span>
          </div>
          <p className="font-semibold text-green-700 text-sm">{request.destination}</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span>{request.responses} responses</span>
        </div>
        {request.budget && request.budget !== "Contact for quote" && (
          <div className="font-semibold text-purple-700">
            {request.budget}
          </div>
        )}
      </div>

      {/* Action Button */}
      <button className="w-full bg-purple-700 text-white py-2 rounded font-medium border border-purple-800 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2 group">
        <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        <span className="tracking-tight">Submit Quote</span>
      </button>
    </div>
  </div>
);

export default DealsAndRequests;