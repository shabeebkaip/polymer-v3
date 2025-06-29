"use client";
import React from "react";
import { TrendingUp, ArrowRight, Zap } from "lucide-react";
import SpecialDeals from "./SpecialDeals";
import BuyerOpportunities from "./BuyerOpportunities";

const DealsAndRequests: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 md:mb-4 tracking-tight">
          Driving Business Excellence Through Supply
          <br />
          <span className="text-green-700">and Demand Synergy</span>
        </h2>
        <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto font-medium">
          Discover exclusive deals from trusted suppliers and connect with buyers seeking quality products
        </p>
      </div>

      {/* Special Deals Section */}
      <SpecialDeals />

      {/* Buyer Opportunities Section */}
      <BuyerOpportunities />

      {/* Call to Action */}
      <div className="text-center mt-8 md:mt-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-700 text-white px-6 md:px-8 py-2.5 md:py-3 rounded font-medium border border-green-800 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2 text-sm md:text-base">
            <Zap className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="tracking-tight">View All Special Deals</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button className="bg-purple-700 text-white px-6 md:px-8 py-2.5 md:py-3 rounded font-medium border border-purple-800 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2 text-sm md:text-base">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:scale-110" />
            <span className="tracking-tight">Browse All Bulk Orders</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DealsAndRequests;