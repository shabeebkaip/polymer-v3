'use client';
import React from 'react';
import BenefitCard from './BenefitCard';
import { useCmsStore } from '@/stores/cms';

const Benefits: React.FC = () => {
  const { buyersBenefits, suppliersBenefits } = useCmsStore();
  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-primary-50/30 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-12">
          {/* Enhanced Header Section */}
          <div className="flex flex-col items-center justify-center text-center gap-3 sm:gap-4 lg:gap-6 max-w-xs sm:max-w-2xl lg:max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-50 text-primary-600 rounded-full text-xs sm:text-sm font-medium mb-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-pulse"></div>
              Why Choose Us
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
              Unique Advantages of{' '}
              <span className="text-primary-500">
                PolymersHub
              </span>
            </h1>
            <p className="text-[var(--text-gray-tertiary)] font-normal text-sm sm:text-base lg:text-lg text-center max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl leading-relaxed">
              Experience the future of polymer trading with our comprehensive platform. Whether
              you&apos;re sourcing quality materials or expanding your market reach, we provide the
              tools and network to accelerate your success.
            </p>
          </div>

          {/* Enhanced Benefits Grid */}
          <div className="w-full ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="group ">
                <BenefitCard
                  subtitle="Free For Buyers"
                  title="Benefits for Buyers"
                  registerLink="auth/register?role=buyer"
                  benefits={buyersBenefits?.content?.description || []}
                />
              </div>
              <div className="group  ">
                <BenefitCard
                  subtitle="Free For Suppliers"
                  title="Benefits for Suppliers"
                  registerLink="auth/register?role=seller"
                  benefits={suppliersBenefits?.content?.description || []}
                />
              </div>
            </div>
          </div>

          {/* Additional Value Propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-6xl mt-4 sm:mt-6 lg:mt-8">
            <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary-50 to-primary-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Connect with suppliers and find products in minutes, not days. Our streamlined
                platform accelerates your sourcing process.
              </p>
            </div>

            <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary-50 to-primary-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Secure & Trusted</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Every transaction is protected with enterprise-grade security. Build lasting
                partnerships with verified, trusted suppliers.
              </p>
            </div>

            <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary-50 to-primary-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Global Network</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Access a worldwide network of polymer suppliers and buyers. Expand your reach beyond
                geographical boundaries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Benefits;
