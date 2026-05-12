'use client';
import Image from 'next/image';
import React from 'react';
import HeroSearch from './HeroSearch';
import { useCmsStore } from '@/stores/cms';

const DEFAULT_FEATURES = [
  { icon: '🔍', label: 'Smart Product Search' },
  { icon: '🤝', label: 'Direct Supplier Connect' },
  { icon: '📦', label: 'Wide Product Range' },
  { icon: '🌍', label: 'Global Trade Network' },
  { icon: '✅', label: 'Verified Listings' },
  { icon: '💬', label: 'Real-Time Enquiries' },
];

const Hero: React.FC = () => {
  const { heroSection } = useCmsStore();
  const cmsTitle = heroSection?.content?.title;
  const cmsDescription = heroSection?.content?.description;

  return (
    <section
      className="relative w-full overflow-hidden h-[calc(100dvh-64px)] md:h-[calc(100dvh-120px)]"
    >
      {/* Background image */}
      <Image
        src="/assets/hero-bg.png"
        alt="PolymersHub — Saudi Arabia polymer marketplace skyline"
        fill
        priority
        sizes="100vw"
        className="object-cover object-bottom"
      />

      {/* Gradient overlay — strong at top for readability, clears toward bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 38%, rgba(255,255,255,0.50) 62%, rgba(255,255,255,0.08) 80%, transparent 92%)',
        }}
      />

      {/* ── Content: vertically centred, offset up so skyline shows below ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center w-full h-full"
        style={{ paddingBottom: '26vh', paddingTop: '2rem' }}
      >
        {/* Saudi origin badge */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/90 border border-gray-200 shadow-sm backdrop-blur-sm">
            <span role="img" aria-label="Saudi Arabia flag" className="text-sm leading-none flex-shrink-0">🇸🇦</span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500">Made in Saudi Arabia</span>
            <span className="text-gray-300 select-none">·</span>
            <span className="text-[10px] sm:text-xs font-semibold text-primary-500">صنع في المملكة</span>
          </div>
        </div>

        {/* Heading */}
        <div className="container mx-auto px-4 sm:px-6 mt-3 sm:mt-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-[78px] uppercase font-semibold leading-tight animate-fade-in-up px-2 sm:px-6 md:px-12 text-gray-900">
              {cmsTitle ? (
                <span className="text-primary-500">{cmsTitle}</span>
              ) : (
                <>
                  Global{' '}
                  <span className="text-primary-500">POLYMER</span>
                  {' '}Marketplace
                </>
              )}
              <br />
              <span className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-[38px] font-normal text-gray-500 block mt-1 sm:mt-2">
                Connecting Industry Worldwide
              </span>
            </h1>

            {/* Description — desktop only */}
            <p className="hidden sm:block text-gray-500 text-sm md:text-base lg:text-lg mt-4 max-w-md md:max-w-2xl font-normal animate-fade-in-up-delayed-2 px-4 leading-relaxed">
              {cmsDescription ||
                'Connect directly with verified polymer suppliers worldwide — source smarter, trade faster, grow confidently.'}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="animate-fade-in-up-delayed-3 w-full mt-5 sm:mt-7">
          <HeroSearch />
        </div>

        {/* Feature pills
            Mobile : 3 key pills in one compact row (light footprint)
            sm+    : all 6, centred wrap                             */}
        <div className="w-full mt-3 sm:mt-5 animate-fade-in-up-delayed-4">

          {/* Mobile — 2×3 compact grid, no overflow */}
          <div className="grid grid-cols-3 sm:hidden gap-1.5 px-4 w-full max-w-xs mx-auto">
            {DEFAULT_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1 px-1.5 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm text-center"
              >
                <span className="text-base leading-none">{feature.icon}</span>
                <span className="text-[9px] font-medium text-gray-600 leading-tight line-clamp-2">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* sm+ — all 6 pills */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 sm:gap-3 container mx-auto px-4">
            {DEFAULT_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:border-primary-400 hover:shadow-md transition-all duration-200"
              >
                <span className="text-sm sm:text-base">{feature.icon}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{feature.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up           { animation: fadeInUp 0.7s ease-out forwards; }
        .animate-fade-in-up-delayed-2 { animation: fadeInUp 0.7s ease-out 0.2s  forwards; opacity: 0; }
        .animate-fade-in-up-delayed-3 { animation: fadeInUp 0.7s ease-out 0.4s  forwards; opacity: 0; }
        .animate-fade-in-up-delayed-4 { animation: fadeInUp 0.7s ease-out 0.55s forwards; opacity: 0; }
      `}</style>
    </section>
  );
};

export default Hero;
