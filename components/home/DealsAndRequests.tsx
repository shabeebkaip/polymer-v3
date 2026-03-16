'use client';
import React from 'react';
import { TrendingUp, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import SpecialDeals from './SpecialDeals';
import BuyerOpportunities from './BuyerOpportunities';
import { useUserInfo } from '@/lib/useUserInfo';
import HowPolymersConnect from '@/components/home/HowPolymersConnect';
import { useSharedState } from '@/stores/sharedStore';

const DealsAndRequests: React.FC = () => {
  const { user } = useUserInfo();
  const userType = user?.user_type;
  const isGuest = !user;
  const isBuyer = Boolean(user && userType === 'buyer');
  const isSeller = Boolean(user && userType === 'seller');

  const {
    suppliersSpecialDeals,
    suppliersSpecialDealsLoading,
    buyerOpportunities,
    buyerOpportunitiesLoading,
  } = useSharedState();

  const hasSpecialDeals =
    Array.isArray(suppliersSpecialDeals) && suppliersSpecialDeals.length > 0;

  const hasBuyerOpportunities = (() => {
    if (!buyerOpportunities) return false;
    if (typeof buyerOpportunities === 'object' && 'data' in buyerOpportunities) {
      return Array.isArray((buyerOpportunities as { data: unknown[] }).data) &&
        (buyerOpportunities as { data: unknown[] }).data.length > 0;
    }
    return Array.isArray(buyerOpportunities) && (buyerOpportunities as unknown[]).length > 0;
  })();

  const isLoading = suppliersSpecialDealsLoading || buyerOpportunitiesLoading;

  // Don't render anything while loading or if both sections have no data
  if (isLoading || (!hasSpecialDeals && !hasBuyerOpportunities)) return null;

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 md:mb-4 tracking-tight">
          Driving Business Excellence Through Supply
          <br />
          <span className="text-primary-600">and Demand Synergy</span>
        </h2>
        <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto font-medium">
          Discover exclusive deals from trusted suppliers and connect with buyers seeking quality
          products
        </p>
      </div>
      <SpecialDeals />
      <BuyerOpportunities />
      <HowPolymersConnect isBuyer={isBuyer} isSeller={isSeller} />

      <div className="text-center mt-8 md:mt-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          {(isBuyer || isGuest) && (
            <Link 
              href="/deals"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold border border-primary-600 hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
            >
              <Zap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="tracking-tight">View All Special Deals</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}

          {(isSeller || isGuest) && (
            <Link 
              href="/opportunities/"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold border border-primary-600 hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
            >
              <TrendingUp className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="tracking-tight">Browse All Bulk Orders</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default DealsAndRequests;
