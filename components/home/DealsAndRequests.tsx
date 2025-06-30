"use client";
import React from "react";
import { TrendingUp, ArrowRight, Zap, ShoppingCart, Plus, Users, Target, Handshake, CheckCircle, Star, MessageCircle } from "lucide-react";
import SpecialDeals from "./SpecialDeals";
import BuyerOpportunities from "./BuyerOpportunities";
import { useUserInfo } from "@/lib/useUserInfo";

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
          Discover exclusive deals from trusted suppliers and connect with buyers seeking quality products
        </p>
      </div>

      {/* Special Deals Section */}
      <SpecialDeals />

      {/* Buyer Opportunities Section */}
      <BuyerOpportunities />

      {/* How Polymer Hub Helps Section */}
      <div className="mt-12 md:mt-16 mb-8 md:mb-12">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            How Polymer Hub Connects You
          </h3>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            We bridge the gap between buyers and suppliers, creating seamless business opportunities in the polymer industry
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* For Buyers Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 md:p-8 border border-emerald-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-gray-900">For Buyers</h4>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Request Any Product</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Can't find what you're looking for? Simply request any polymer product and our network of verified suppliers will respond with competitive quotes and samples.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Verified Supplier Network</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Connect with pre-vetted suppliers who have proven track records, ensuring quality products and reliable delivery timelines.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Streamlined Process</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    From initial request to final delivery, we facilitate the entire procurement process, saving you time and ensuring transparency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Star className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Exclusive Deals & Samples</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Access special pricing, bulk discounts, and free samples that are only available through our platform partnerships.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-100 rounded-xl border border-emerald-200">
              <p className="text-emerald-800 text-sm font-medium text-center">
                💡 <strong>Pro Tip:</strong> The more specific your product requirements, the better matches we can find for you!
              </p>
            </div>

            {/* Buyer Action Button */}
            <div className="mt-6">
              {isBuyer ? (
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-semibold border border-emerald-700 hover:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group">
                  <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="tracking-tight">Request Product</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              ) : (
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-semibold border border-emerald-700 hover:border-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group">
                  <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="tracking-tight">Sign Up as Buyer</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </div>

          {/* For Suppliers Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-gray-900">For Suppliers</h4>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Post Special Offers</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Showcase your best products with exclusive pricing and reach thousands of potential buyers actively seeking polymer solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Targeted Buyer Matching</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Receive qualified product requests that match your inventory and capabilities, ensuring higher conversion rates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Handshake className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Build Long-term Relationships</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Connect with repeat customers and establish ongoing partnerships that drive sustainable business growth.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Direct Communication</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Communicate directly with interested buyers, negotiate terms, and close deals faster through our integrated messaging system.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-100 rounded-xl border border-blue-200">
              <p className="text-blue-800 text-sm font-medium text-center">
                🚀 <strong>Growth Tip:</strong> Regular posting of competitive offers increases your visibility and sales opportunities!
              </p>
            </div>

            {/* Supplier Action Button */}
            <div className="mt-6">
              {isSeller ? (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold border border-blue-700 hover:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group">
                  <Plus className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="tracking-tight">Post Your Offers</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              ) : (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold border border-blue-700 hover:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group">
                  <Plus className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="tracking-tight">Sign Up as Supplier</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Success Stats */}
        <div className="mt-10 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Polymer Hub Success Stories</h4>
            <p className="text-gray-600">Real results from our growing community</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">2,500+</div>
              <div className="text-sm text-gray-600">Product Requests Fulfilled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">1,200+</div>
              <div className="text-sm text-gray-600">Active Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">98%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">48hr</div>
              <div className="text-sm text-gray-600">Avg. Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="text-center mt-8 md:mt-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          {/* Show Special Deals button for buyers and guests */}
          {(isBuyer || isGuest) && (
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-xl font-semibold border border-green-700 hover:border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group">
              <Zap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="tracking-tight">View All Special Deals</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          )}
          
          {/* Show Bulk Orders button for sellers and guests */}
          {(isSeller || isGuest) && (
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-xl font-semibold border border-purple-700 hover:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group">
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