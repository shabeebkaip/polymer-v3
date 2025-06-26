"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Calendar, MapPin, Package, TrendingUp, Users, Clock, ArrowRight, Zap, Gift } from "lucide-react";
import { useUserInfo } from "@/lib/useUserInfo";

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
  image: string;
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
  image: string;
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
    badge: "FLASH SALE",
    image: "/assets/products/hdpe-granules.jpg"
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
    badge: "BULK OFFER",
    image: "/assets/products/pvc-compound.jpg"
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
    badge: "HOT DEAL",
    image: "/assets/products/pp-homopolymer.jpg"
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
    responses: 12,
    image: "/assets/products/food-grade-pe.jpg"
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
    responses: 8,
    image: "/assets/products/abs-plastic.jpg"
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
    responses: 15,
    image: "/assets/products/pc-abs-blend.jpg"
  }
];

const DealsAndRequests: React.FC = () => {
  const { user } = useUserInfo();
  const [currentDealsSlide, setCurrentDealsSlide] = useState(0);
  const [currentRequestsSlide, setCurrentRequestsSlide] = useState(0);
  
  // Always show both sections - no tabs needed
  const itemsPerSlide = 3;
  const dealsSlides = Math.ceil(dummyDeals.length / itemsPerSlide);
  const requestsSlides = Math.ceil(dummyRequests.length / itemsPerSlide);

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
    return dummyDeals.slice(startIndex, startIndex + itemsPerSlide);
  };

  const getCurrentRequests = () => {
    const startIndex = currentRequestsSlide * itemsPerSlide;
    return dummyRequests.slice(startIndex, startIndex + itemsPerSlide);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Driving Business Excellence Through Supply
          <br />
          <span className="text-green-600">and Demand Synergy</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Discover exclusive deals from trusted suppliers and connect with buyers looking for your products
        </p>
      </div>

      {/* Special Deals Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Special Deals by Suppliers</h3>
              <p className="text-gray-600">Exclusive offers and competitive prices from trusted suppliers</p>
            </div>
          </div>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
            {dummyDeals.length} Available
          </span>
        </div>

        <div className="relative">
          {/* Navigation Buttons for Deals */}
          <button
            onClick={prevDealsSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105"
            disabled={dealsSlides <= 1}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextDealsSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105"
            disabled={dealsSlides <= 1}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Deals Cards Container */}
          <div className="mx-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentDeals().map((deal) => (
                <div key={deal.id} className="group">
                  <DealCard deal={deal} formatPrice={formatPrice} />
                </div>
              ))}
            </div>
          </div>

          {/* Deals Slide Indicators */}
          {dealsSlides > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: dealsSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDealsSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentDealsSlide === index
                      ? "bg-green-500 w-8" 
                      : "bg-gray-300 hover:bg-gray-400"
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
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Opportunities by Buyers</h3>
              <p className="text-gray-600">Active buyers looking for your products and services</p>
            </div>
          </div>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
            {dummyRequests.length} Active
          </span>
        </div>

        <div className="relative">
          {/* Navigation Buttons for Requests */}
          <button
            onClick={prevRequestsSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105"
            disabled={requestsSlides <= 1}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextRequestsSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105"
            disabled={requestsSlides <= 1}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Requests Cards Container */}
          <div className="mx-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentRequests().map((request) => (
                <div key={request.id} className="group">
                  <RequestCard request={request} getUrgencyColor={getUrgencyColor} />
                </div>
              ))}
            </div>
          </div>

          {/* Requests Slide Indicators */}
          {requestsSlides > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: requestsSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentRequestsSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentRequestsSlide === index
                      ? "bg-purple-500 w-8" 
                      : "bg-gray-300 hover:bg-gray-400"
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
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
            <Zap className="w-5 h-5" />
            View All Special Deals
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
            <TrendingUp className="w-5 h-5" />
            Browse All Opportunities
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Deal Card Component
const DealCard: React.FC<{ deal: Deal; formatPrice: (price: number) => string }> = ({ deal, formatPrice }) => (
  <div className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
    {/* Badge */}
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-bold flex items-center justify-between">
      <span className="flex items-center gap-2">
        <Gift className="w-4 h-4" />
        {deal.badge}
      </span>
      <span className="bg-white text-green-600 px-3 py-1 rounded-full text-xs font-bold">
        -{deal.discount}% OFF
      </span>
    </div>

    <div className="p-6">
      {/* Supplier Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
          <Package className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{deal.supplier.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{deal.supplier.rating}</span>
            <span>•</span>
            <MapPin className="w-4 h-4" />
            <span>{deal.supplier.location}</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <h4 className="font-bold text-lg text-gray-900 mb-2">{deal.title}</h4>
      <p className="text-gray-600 text-sm mb-4">{deal.description}</p>

      {/* Pricing */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl font-bold text-green-600">{formatPrice(deal.discountedPrice)}</span>
        <span className="text-lg text-gray-400 line-through">{formatPrice(deal.originalPrice)}</span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
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
      <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
        <Zap className="w-5 h-5" />
        Grab This Deal
      </button>
    </div>
  </div>
);

// Request Card Component
const RequestCard: React.FC<{ request: Request; getUrgencyColor: (urgency: "low" | "medium" | "high") => string }> = ({ request, getUrgencyColor }) => (
  <div className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
    {/* Header */}
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-sm font-bold flex items-center justify-between">
      <span className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        BUYER REQUEST
      </span>
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(request.urgency)}`}>
        {request.urgency.toUpperCase()} PRIORITY
      </span>
    </div>

    <div className="p-6">
      {/* Buyer Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{request.buyer.company}</h3>
            {request.buyer.verified && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                VERIFIED
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{request.buyer.location}</span>
          </div>
        </div>
      </div>

      {/* Request Info */}
      <h4 className="font-bold text-lg text-gray-900 mb-2">{request.title}</h4>
      <p className="text-gray-600 text-sm mb-4">{request.description}</p>

      {/* Request Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-xs text-gray-500 uppercase font-semibold">Quantity</span>
          <p className="font-bold text-purple-600">{request.quantity}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500 uppercase font-semibold">Budget</span>
          <p className="font-bold text-green-600">{request.budget}</p>
        </div>
      </div>

      {/* Timeline & Responses */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Deadline: {new Date(request.deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          <span>{request.responses} responses</span>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
        <ArrowRight className="w-5 h-5" />
        Submit Proposal
      </button>
    </div>
  </div>
);

export default DealsAndRequests;