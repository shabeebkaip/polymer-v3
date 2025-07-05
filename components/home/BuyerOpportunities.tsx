"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Package, TrendingUp, Users, Clock, ArrowRight } from "lucide-react";
import { useSharedState } from "@/stores/sharedStore";
import { useUserInfo } from "@/lib/useUserInfo";
import { useRouter } from "next/navigation";

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



const BuyerOpportunities: React.FC = () => {
  const { buyerOpportunities, buyerOpportunitiesLoading } = useSharedState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUserInfo();
  const userType = user?.user_type;
  const isGuest = !user; // User is not logged in
  const isBuyer = Boolean(user && userType === "buyer");
  const isSeller = Boolean(user && userType === "seller");

  // Check if we have real data
  const hasRealData = Array.isArray(buyerOpportunities) && buyerOpportunities.length > 0;
  
  // Show loading only if we're loading AND don't have data yet
  const showLoading = buyerOpportunitiesLoading && !hasRealData;

  // Transform and display requests data
  const displayRequests = React.useMemo(() => {
    try {
      if (Array.isArray(buyerOpportunities) && buyerOpportunities.length > 0) {
        // Transform API data to match our Request interface
        return buyerOpportunities.map((item: any) => {
          // Determine urgency based on delivery date or message content
          const deliveryDate = new Date(item.delivery_date);
          const daysUntilDelivery = Math.ceil((deliveryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const hasUrgentKeywords = item.message?.toLowerCase().includes('urgent') || item.message?.toLowerCase().includes('asap') || item.message?.toLowerCase().includes('expedite');
          
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
            title: `${item.product?.productName || 'Product Request'} - Buyer Opportunity`,
            buyer: {
              company: item.user?.company || "Anonymous Company",
              location: item.city && item.country ? `${item.city}, ${item.country}` : "Location not specified",
              verified: item.status === 'approved'
            },
            product: item.product?.productName || "Product",
            quantity: item.uom ? `${item.quantity} ${item.uom}` : `${item.quantity || 'N/A'}`,
            budget: "Contact for quote", // This field is not in the API response
            deadline: item.delivery_date,
            description: item.message || `Buyer opportunity for ${item.product?.productName || 'product'}${item.destination ? '. Delivery to ' + item.destination : ''}.`,
            urgency: urgency,
            responses: item.responseMessage?.length || item.statusMessage?.length || 0,
            // Additional fields from API
            destination: item.destination,
            sellerStatus: item.sellerStatus,
            requestDocument: item.request_document,
            createdAt: item.createdAt
          };
          
          return transformedRequest;
        });
      }
      return [];
    } catch (error) {
      console.error("Error processing buyer opportunities:", error);
      return [];
    }
  }, [buyerOpportunities]);

  const itemsPerSlide = 3;
  const slides = Math.ceil(displayRequests.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides) % slides);
  };

  const getCurrentRequests = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return displayRequests.slice(startIndex, startIndex + itemsPerSlide);
  };

  const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
    }
  };

  // Only show opportunities to sellers and guests, hide from buyers
  if (isBuyer) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-purple-700 p-2 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Opportunities by Buyers</h3>
            <p className="text-gray-700 text-sm">Active opportunities from verified buyers seeking suppliers</p>
          </div>
        </div>
        <span className="bg-gray-100 text-purple-700 px-3 py-1 rounded text-xs font-semibold border border-purple-200">
          {displayRequests.length} Active
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
                    <div key={i} className="bg-white rounded-xl shadow border p-5 animate-pulse flex-shrink-0 w-[calc(90.91%-0.5rem)]">
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
              </div>
              {/* Desktop Loading - Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </>
          ) : displayRequests.length > 0 ? (
            <>
              {/* Mobile Layout - Horizontal Scroll with 1.1 cards visible */}
              <div className="md:hidden">
                <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide pb-2">
                  {displayRequests.map((request) => (
                    <div key={request.id} className="flex-shrink-0 w-[calc(90.91%-0.5rem)]">
                      <RequestCard request={request} getUrgencyColor={getUrgencyColor} isGuest={isGuest} isSeller={isSeller} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Desktop Layout - Grid with Pagination */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentRequests().map((request) => (
                  <div key={request.id} className="group">
                    <RequestCard request={request} getUrgencyColor={getUrgencyColor} isGuest={isGuest} isSeller={isSeller} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Opportunities Available</h3>
              <p className="text-gray-600">Check back later for new opportunities from buyers.</p>
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
                className={`w-3 h-3 rounded-full border border-purple-300 transition-all duration-200 ${currentSlide === index
                    ? "bg-purple-700 w-6"
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

// Request Card Component
const RequestCard: React.FC<{ 
  request: Request; 
  getUrgencyColor: (urgency: "low" | "medium" | "high") => string;
  isGuest: boolean;
  isSeller: boolean;
}> = ({ request, getUrgencyColor, isGuest, isSeller }) => {
  const router = useRouter();
  
  const handleButtonClick = () => {
    if (isGuest) {
      // Redirect to signup page for guests
      router.push("/auth/register");
    } else if (isSeller) {
      // Handle quote submission for sellers
      router.push(`/user/submitted-offers/add/${request.id}`);
      // Add your quote submission logic here
    }
  };

  const getButtonText = () => {
    if (isGuest) {
      return "Sign Up to Submit Quote";
    } else if (isSeller) {
      return "Submit Quote";
    }
    return "View Request";
  };
  console.log("Request Card Rendered:", request);
  return (
    <div className="bg-white rounded-xl shadow border hover:shadow-xl transition-all duration-200 overflow-hidden group">
      {/* Header */}
      <div className="bg-purple-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          BUYER OPPORTUNITY
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
        <button 
          onClick={handleButtonClick}
          className="w-full bg-purple-700 text-white py-2 rounded font-medium border border-purple-800 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2 group"
        >
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          <span className="tracking-tight">{getButtonText()}</span>
        </button>
      </div>
    </div>
  );
};

export default BuyerOpportunities;
