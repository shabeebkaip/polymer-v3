'use client';
import React from 'react';
import BenefitCard from './BenefitCard';
import { useCmsStore } from '@/stores/cms';
import { Zap, ShieldCheck, Globe2, BarChart3 } from 'lucide-react';

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Lightning Fast",
    description: "Source products and connect with verified suppliers in minutes.",
    color: "text-primary-600",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Verified Suppliers",
    description: "Every supplier goes through a rigorous verification process.",
    color: "text-primary-600",
  },
  {
    icon: <Globe2 className="w-5 h-5" />,
    title: "Global Reach",
    description: "Access polymer trade across 40+ countries from one platform.",
    color: "text-primary-600",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Market Intelligence",
    description: "Real-time pricing and analytics to help you trade smarter.",
    color: "text-primary-600",
  },
];

const Benefits: React.FC = () => {
  const { buyersBenefits, suppliersBenefits, polymerAdvantages, homeSections } = useCmsStore();

  const badge = homeSections?.content?.benefitsBadge || 'Why Choose Us';
  const title = polymerAdvantages?.content?.title || 'Unique Advantages of PolymersHub';
  const description = polymerAdvantages?.content?.description ||
    "Whether you're sourcing quality polymer materials or expanding your supplier reach — PolymersHub gives you the tools, network, and intelligence to trade smarter.";

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-primary-600 text-xs font-bold uppercase tracking-widest shadow-sm mb-5">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            {badge}
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {title.includes('PolymersHub') ? (
              <>
                {title.split('PolymersHub')[0]}
                <span className="text-primary-600">PolymersHub</span>
                {title.split('PolymersHub')[1]}
              </>
            ) : title}
          </h2>

          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* ── Buyer / Supplier cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BenefitCard
            variant="buyer"
            subtitle="Free For Buyers"
            title="Benefits for Buyers"
            registerLink="auth/register?role=buyer"
            benefits={buyersBenefits?.content?.description || []}
          />
          <BenefitCard
            variant="supplier"
            subtitle="Free For Suppliers"
            title="Benefits for Suppliers"
            registerLink="auth/register?role=seller"
            benefits={suppliersBenefits?.content?.description || []}
          />
        </div>

        {/* ── Platform features ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-6">
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center ${f.color}`}>
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Benefits;
