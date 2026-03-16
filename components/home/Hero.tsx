'use client';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';
import { DotPattern } from '../magicui/dot-pattern';
import HeroSearch from './HeroSearch';

const features = [
  { icon: '🔍', label: 'Smart Product Search' },
  { icon: '🤝', label: 'Direct Supplier Connect' },
  { icon: '📦', label: 'Wide Product Range' },
  { icon: '🌍', label: 'Global Trade Network' },
  { icon: '✅', label: 'Verified Listings' },
  { icon: '💬', label: 'Real-Time Enquiries' },
];

const gradientTextClass = `
  text-primary-500
`;

const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <DotPattern
        className={cn('[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]')}
        glow={true}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center text-center mt-6 md:mt-12">
          <div className="relative">
            <Image
              src="/assets/hero_element_1.svg"
              alt="Hero Element 1"
              width={100}
              height={100}
              className="absolute top-4 sm:top-7 lg:top-0 left-0 lg:left-0 w-[25px] sm:w-[40px] md:w-[60px] lg:w-[100px] h-auto lg:h-[300px] animate-float"
            />
            <Image
              src="/assets/hero_element_2.svg"
              alt="Hero Element 2"
              width={100}
              height={100}
              className="absolute top-4 sm:top-7 lg:top-0 right-0 w-[25px] sm:w-[40px] md:w-[60px] lg:w-[100px] h-auto lg:h-[300px] animate-float"
            />
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl xl:text-[80px] uppercase font-semibold leading-tight animate-fade-in-up px-4 sm:px-8 md:px-12">
              Global <span className={`${gradientTextClass} animate-gradient`}>POLYMER</span>{' '}
              Marketplace <br />
              <span className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-[40px] font-normal text-gray-600 animate-fade-in-up-delayed block mt-2 lg:mt-0">
                Connecting Industry Worldwide
              </span>
            </h1>
          </div>

          <p className="text-[var(--text-gray-secondary)] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-4 sm:mt-6 lg:mt-8 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl font-normal animate-fade-in-up-delayed-2 px-4 leading-relaxed">
            Connect directly with verified polymer suppliers worldwide — source smarter, trade
            faster, grow confidently.
          </p>
        </div>
      </div>

      {/* Full-width search bar outside container */}
      <div className="animate-fade-in-up-delayed-3 w-full">
        <HeroSearch />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 mt-6 sm:mt-8 lg:mt-10 pb-8">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Platform Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 animate-fade-in-up-delayed-4 px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:border-primary-400 hover:shadow-md transition-all duration-200"
              >
                <span className="text-sm sm:text-base">{feature.icon}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-up-delayed {
          animation: fadeInUp 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delayed-2 {
          animation: fadeInUp 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delayed-3 {
          animation: fadeInUp 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delayed-4 {
          animation: fadeInUp 0.8s ease-out 0.8s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delayed-5 {
          animation: fadeInUp 0.8s ease-out 1s forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out infinite 3s;
        }

        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 4s ease infinite;
        }

        .animate-count-up {
          animation: countUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
