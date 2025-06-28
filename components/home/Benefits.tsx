"use client";
import React from "react";
import BenefitCard from "./BenefitCard";
import { useCmsStore } from "@/stores/cms";

const Benefits: React.FC = () => {
  const { buyersBenefits, suppliersBenefits } = useCmsStore();
  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-green-50/30 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-16">
          {/* Enhanced Header Section */}
          <div className="flex flex-col items-center justify-center text-center gap-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Why Choose Us
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Unique Advantages of{" "}
              <span className="bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] bg-clip-text text-transparent animate-gradient">
                Polymers Hub
              </span>
            </h1>
            <p className="text-[var(--text-gray-tertiary)] font-normal text-base md:text-lg lg:text-xl text-center max-w-3xl leading-relaxed">
              Experience the future of polymer trading with our comprehensive platform. Whether you're sourcing 
              quality materials or expanding your market reach, we provide the tools and network to accelerate your success.
            </p>
          </div>

          {/* Enhanced Benefits Grid */}
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="group hover:scale-105 transition-all duration-300">
                <BenefitCard
                  subtitle="Free For Buyers"
                  title="Benefits for Buyers"
                  registerLink="auth/register?role=buyer"
                  benefits={buyersBenefits?.content?.description || []}
                />
              </div>
              <div className="group hover:scale-105 transition-all duration-300">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-8">
            <div className="text-center space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect with suppliers and find products in minutes, not days. Our streamlined platform accelerates your sourcing process.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Secure & Trusted</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every transaction is protected with enterprise-grade security. Build lasting partnerships with verified, trusted suppliers.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Global Network</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access a worldwide network of polymer suppliers and buyers. Expand your reach beyond geographical boundaries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
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
