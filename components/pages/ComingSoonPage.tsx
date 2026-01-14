'use client';

import React from 'react';
import Image from 'next/image';
import { DotPattern } from '../magicui/dot-pattern';
import { cn } from '@/lib/utils';
import EarlyAccessForm from './EarlyAccessForm';

const ComingSoonPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Background Pattern - simplified without glow */}
      <DotPattern
        className={cn('[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]')}
        glow={false}
      />

      {/* Decorative Elements - only on desktop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <Image
          src="/assets/hero_element_1.svg"
          alt=""
          width={80}
          height={80}
          className="absolute top-20 left-20 w-[80px] opacity-20"
        />
        <Image
          src="/assets/hero_element_2.svg"
          alt=""
          width={80}
          height={80}
          className="absolute top-20 right-20 w-[80px] opacity-20"
        />
      </div>

      {/* Main Content - Horizontal Layout for Desktop */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-8 lg:px-12">
        <div className="w-full max-w-7xl">
          {/* Mobile: Vertical Compact Layout */}
          <div className="lg:hidden flex flex-col items-center justify-center space-y-6">
            {/* Logo */}
            <Image
              src="/onlylogo.png"
              alt="PolymersHub"
              width={60}
              height={60}
              className="w-14 h-14"
              priority
            />
            
            {/* Badge */}
            <div className="inline-block px-4 py-1.5 bg-primary-50 border border-primary-200 rounded-full">
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                Soft Launch – Early Access
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl uppercase font-semibold leading-tight text-center">
              Global <span className="text-primary-500">POLYMER</span> Marketplace
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg font-normal text-gray-600 text-center">
              Connecting Industry Worldwide
            </p>
            
            {/* Form */}
            <div className="w-full max-w-md">
              <EarlyAccessForm compact />
            </div>
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6 text-left">
              {/* Logo */}
              <Image
                src="/onlylogo.png"
                alt="PolymersHub"
                width={70}
                height={70}
                className="w-[70px] h-[70px]"
                priority
              />
              
              {/* Badge */}
              <div className="inline-block px-5 py-2 bg-primary-50 border border-primary-200 rounded-full">
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                  Soft Launch Phase – Limited Early Access
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-5xl xl:text-6xl uppercase font-semibold leading-tight">
                Global <span className="text-primary-500">POLYMER</span> Marketplace
              </h1>
              
              {/* Subtitle */}
              <p className="text-2xl xl:text-3xl font-normal text-gray-600">
                Connecting Industry Worldwide
              </p>
              
              {/* Description */}
              <p className="text-gray-600 text-lg xl:text-xl leading-relaxed max-w-xl">
                {`We're building something extraordinary. Connect directly with verified polymer suppliers worldwide — source smarter, trade faster, grow confidently.`}
              </p>
            </div>

            {/* Right: Form */}
            <div className="flex justify-center">
              <EarlyAccessForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
