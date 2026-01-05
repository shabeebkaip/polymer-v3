'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, CheckCircle2, Building2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { DotPattern } from '../magicui/dot-pattern';
import { cn } from '@/lib/utils';

const ComingSoonPage = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'supplier' | 'buyer' | ''>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!userType) {
      toast.error('Please select Supplier or Buyer');
      return;
    }

    setIsSubmitted(true);
    toast.success(`Thank you. We'll contact you soon.`);
    setEmail('');
    setUserType('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Background Pattern - simplified without glow */}
      <DotPattern
        className={cn('[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]')}
        glow={false}
      />

      {/* Decorative Elements - static for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/assets/hero_element_1.svg"
          alt=""
          width={100}
          height={100}
          className="absolute top-20 left-4 md:left-20 w-[40px] md:w-[80px] lg:w-[100px] opacity-20"
        />
        <Image
          src="/assets/hero_element_2.svg"
          alt=""
          width={100}
          height={100}
          className="absolute top-20 right-4 md:right-20 w-[40px] md:w-[80px] lg:w-[100px] opacity-20"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="max-w-5xl w-full text-center space-y-8 md:space-y-12">
          {/* Logo/Branding */}
          <div>
            <div className="flex justify-center mb-6 gap-3 items-center">
              <Image
                src="/onlylogo.png"
                alt="Polymers Hub"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20"
                priority
              />
            </div>
          </div>

          {/* Main Heading - matching your typography */}
          <div className="space-y-4">
            <div className="inline-block px-6 py-2 bg-primary-50 border border-primary-200 rounded-full mb-4">
              <span className="text-sm md:text-base font-semibold text-primary-600 uppercase tracking-wide">
                Soft Launch Phase – Limited Early Access
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl   uppercase font-semibold leading-tight px-4">
              Global <span className="text-primary-500">POLYMER</span> Marketplace
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 mt-4">
              Connecting Industry Worldwide
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            {`We're building something extraordinary. Connect directly with verified polymer suppliers
            worldwide — source smarter, trade faster, grow confidently.`}
          </p>

          {/* Email Signup */}
          <div className="max-w-md mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('supplier')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 font-semibold transition-colors duration-150 ${
                      userType === 'supplier'
                        ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Supplier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('buyer')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 font-semibold transition-colors duration-150 ${
                      userType === 'buyer'
                        ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Buyer</span>
                  </button>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-12 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-colors duration-150"
                >
                  Request Early Access
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4 px-6 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <span className="text-green-700 font-medium">
                  Thank you. We&apos;ll contact you soon.
                </span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-4">
              Be the first to access our platform. No spam, ever.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10 py-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          © 2026 Polymers Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ComingSoonPage;
