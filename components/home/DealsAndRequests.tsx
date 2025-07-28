"use client";
import React from "react";
import {
  TrendingUp,
  ArrowRight,
  Zap,
  ShoppingCart,
  Plus,
  Users,
  Target,
  Handshake,
  CheckCircle,
  Star,
  MessageCircle,
} from "lucide-react";
import SpecialDeals from "./SpecialDeals";
import BuyerOpportunities from "./BuyerOpportunities";
import { useUserInfo } from "@/lib/useUserInfo";
import HowPolymersConnect from "@/components/home/HowPolymersConnect";

const DealsAndRequests: React.FC = () => {
  const { user } = useUserInfo();
  const userType = user?.user_type;
  const isGuest = !user; // User is not logged in
  const isBuyer = Boolean(user && userType === "buyer");
  const isSeller = Boolean(user && userType === "seller");

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 md:mb-4 tracking-tight">
          Driving Business Excellence Through Supply
          <br />
          <span className="text-green-700">and Demand Synergy</span>
        </h2>
        <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto font-medium">
          Discover exclusive deals from trusted suppliers and connect with
          buyers seeking quality products
        </p>
      </div>

      {/* Special Deals Section */}
      <SpecialDeals />

      {/* Buyer Opportunities Section */}
      <BuyerOpportunities />

      {/* How Polymer Hub Helps Section */}
      <HowPolymersConnect isBuyer={isBuyer} isSeller={isSeller} />

      {/* Call to Action Section */}
      <div className="text-center mt-8 md:mt-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          {/* Show Special Deals button for buyers and guests */}
          {(isBuyer || isGuest) && (
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold border border-emerald-700 hover:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group">
              <Zap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="tracking-tight">View All Special Deals</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          )}

          {/* Show Bulk Orders button for sellers and guests */}
          {(isSeller || isGuest) && (
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold border border-emerald-600 hover:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group">
              <TrendingUp className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="tracking-tight">Browse All Bulk Orders</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DealsAndRequests;
