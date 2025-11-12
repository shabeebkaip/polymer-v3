"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight,  Users  } from "lucide-react";
import { useSharedState } from "@/stores/sharedStore";
import { useUserInfo } from "@/lib/useUserInfo";
import RequestCard from "./RequestCard";


const BuyerOpportunities: React.FC = () => {
  const { buyerOpportunities, buyerOpportunitiesLoading } = useSharedState();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUserInfo();
  const userType = user?.user_type;
  const isGuest = !user; // User is not logged in
  const isBuyer = Boolean(user && userType === "buyer");
  const isSeller = Boolean(user && userType === "seller");

  // Check if we have real data - handle both old and new API structures
  const hasRealData = React.useMemo(() => {
    if (!buyerOpportunities) return false;
    
    // Check for new API structure with data property
    if (typeof buyerOpportunities === 'object' && 'data' in buyerOpportunities) {
      return Array.isArray((buyerOpportunities as { data: unknown[] }).data) && (buyerOpportunities as { data: unknown[] }).data.length > 0;
    }
    
    // Fallback to old structure where buyerOpportunities is directly an array
    return Array.isArray(buyerOpportunities) && buyerOpportunities.length > 0;
  }, [buyerOpportunities]);
  
  // Show loading only if we're loading AND don't have data yet
  const showLoading = buyerOpportunitiesLoading && !hasRealData;

  // Transform and display requests data
  const displayRequests = React.useMemo(() => {
    try {
      // Check if buyerOpportunities has a data array (new API structure) or is array itself (old structure)
      let dataArray: { priority?: string; deadline: string; [key: string]: unknown }[] = [];
      
      if (buyerOpportunities && typeof buyerOpportunities === 'object') {
        // Check for new API structure with data property
        if ('data' in buyerOpportunities && Array.isArray((buyerOpportunities as { data: unknown[] }).data)) {
          dataArray = (buyerOpportunities as { data: { priority?: string; deadline: string; [key: string]: unknown }[] }).data;
        } 
        // Fallback to old structure where buyerOpportunities is directly an array
        else if (Array.isArray(buyerOpportunities)) {
          dataArray = buyerOpportunities as { priority?: string; deadline: string; [key: string]: unknown }[];
        }
      }
      
      if (dataArray.length > 0) {
        // Transform API data to match our Request interface
        return dataArray.map((item) => {
          // Determine urgency based on priority field or delivery date
          const priority = item.priority?.toLowerCase() || 'normal';
          const deliveryDate = new Date(item.deadline);
          const daysUntilDelivery = Math.ceil((deliveryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          let urgency: "low" | "medium" | "high" = "medium";
          if (priority === 'high' || daysUntilDelivery <= 7) {
            urgency = "high";
          } else if (priority === 'normal' && daysUntilDelivery <= 30) {
            urgency = "medium";
          } else {
            urgency = "low";
          }

          const transformedRequest = {
            id: String(item.id || item._id || Math.random()),
            type: "buyer-request" as const,
            title: `${item.productName || 'Product Request'} - Buyer Opportunity`,
            buyer: {
              company: (item.buyer as { company?: string })?.company || "Anonymous Company",
              location: (item.buyer as { location?: string })?.location || (item.city && item.country ? `${item.city}, ${item.country}` : "Location not specified"),
              verified: (item.buyer as { isVerified?: boolean })?.isVerified || false,
              name: (item.buyer as { name?: string })?.name
            },
            product: String(item.productName || "Product"),
            quantity: item.uom ? `${item.quantity} ${item.uom}` : `${item.quantity || 'N/A'}`,
            budget: "Contact for quote", // This field is not in the API response
            deadline: item.deadline,
            description: String(item.description || `Buyer opportunity for ${item.productName || 'product'}${item.destination ? '. Delivery to ' + item.destination : ''}.`),
            urgency: urgency,
            responses: (item.responses as { count?: number })?.count || 0,
            // Additional fields from API
            destination: item.destination as string | undefined,
            sellerStatus: item.sellerStatus as string | undefined,
            requestDocument: item.request_document as string | undefined,
            createdAt: item.createdAt as string | undefined,
            priority: item.priority as string | undefined,
            tradeName: item.tradeName as string | undefined,
            chemicalName: item.chemicalName as string | undefined,
            daysLeft: daysUntilDelivery
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
      case "low": return "bg-primary-50 text-primary-600 border-primary-200";
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
          <div className="bg-primary-500 p-2 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Opportunities by Buyers</h3>
            <p className="text-gray-700 text-sm">Active opportunities from verified buyers seeking suppliers</p>
          </div>
        </div>
        <span className="bg-gray-100 text-primary-600 px-3 py-1 rounded text-xs font-semibold border border-primary-500">
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
                    <div key={request.id as string} className="flex-shrink-0 w-[calc(90.91%-0.5rem)]">
                      <RequestCard request={request} getUrgencyColor={getUrgencyColor} isGuest={isGuest} isSeller={isSeller} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Desktop Layout - Grid with Pagination */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentRequests().map((request) => (
                  <div key={request.id as string} className="group">
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
                className={`w-3 h-3 rounded-full border border-primary-500 transition-all duration-200 ${currentSlide === index
                    ? "bg-primary-500 w-6"
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


export default BuyerOpportunities;
