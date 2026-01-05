'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Bell, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { DotPattern } from '../magicui/dot-pattern';
import { cn } from '@/lib/utils';

const ComingSoonPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitted(true);
    toast.success("Thank you! We'll notify you when we launch 🚀");
    setEmail('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Background Pattern - matching your design */}
      <DotPattern
        className={cn('[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]')}
        glow={true}
      />

      {/* Decorative Elements - matching Hero design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/assets/hero_element_1.svg"
          alt="Decorative Element"
          width={100}
          height={100}
          className="absolute top-20 left-4 md:left-20 w-[40px] md:w-[80px] lg:w-[100px] opacity-30 animate-float"
        />
        <Image
          src="/assets/hero_element_2.svg"
          alt="Decorative Element"
          width={100}
          height={100}
          className="absolute top-20 right-4 md:right-20 w-[40px] md:w-[80px] lg:w-[100px] opacity-30 animate-float"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="max-w-5xl w-full text-center space-y-8 md:space-y-12">
          {/* Logo/Branding */}
          <div className="animate-fade-in-up">
            <div className="flex justify-center mb-6 gap-3 items-center">
              <Image
                src="/onlylogo.png"
                alt="Polymers Hub"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20"
              />
              {/* <h4 className="text-primary-500 font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px]">
                POLYMERS HUB
              </h4> */}
            </div>
          </div>

          {/* Main Heading - matching your typography */}
          <div className="animate-fade-in-up-delayed space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] uppercase font-semibold leading-tight px-4">
              Global <span className="text-primary-500">POLYMER</span> Marketplace
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 mt-4">
              Connecting Industry Worldwide
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delayed-2 px-4">
            {`We're building something extraordinary. Connect directly with verified polymer suppliers
            worldwide — source smarter, trade faster, grow confidently.`}
          </p>

          {/* Email Signup */}
          <div className="animate-fade-in-up-delayed-3 max-w-md mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-12 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notify Me</span>
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4 px-6 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <span className="text-green-700 font-medium">
                  You&apos;re on the list! We&apos;ll keep you updated.
                </span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4">
              Be the first to know when we launch. No spam, ever.
            </p>
          </div>

          {/* Trust Indicators - matching your design */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 animate-fade-in-up-delayed-4 pb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-500">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary-600">SASO Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-500">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary-600">Global Shipping</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-500">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary-600">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 py-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          © 2026 Polymers Hub. All rights reserved.
        </p>
      </div>

      {/* Animations CSS */}
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ComingSoonPage;
