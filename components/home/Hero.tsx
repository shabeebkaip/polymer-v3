"use client";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { DotPattern } from "../magicui/dot-pattern";
import HeroSearch from "./HeroSearch";

const stats = [
  { value: "10,000+", label: "Polymer Products" },
  { value: "500+", label: "Verified Suppliers" },
  { value: "50+", label: "Countries Served" },
  { value: "24/7", label: "Expert Support" },
];
const gradientTextClass = `
  bg-gradient-to-r
  from-[var(--green-gradient-from)]
  via-[var(--green-gradient-via)]
  to-[var(--green-gradient-to)]
  bg-clip-text
  text-transparent
`;

const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
        glow={true}
      />

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center mt-16">
          <div className="relative">
            <Image
              src="/assets/hero_element_1.svg"
              alt="Hero Element 1"
              width={100}
              height={100}
              className="absolute top-7 lg:top-0 lg:left-0 w-[40px] md:w-[80px] lg:w-[100px] lg:h-[300px] animate-float"
            />
            <Image
              src="/assets/hero_element_2.svg"
              alt="Hero Element 2"
              width={100}
              height={100}
              className="absolute top-7 lg:top-0 right-0 w-[40px] md:w-[80px] lg:w-[100px] lg:h-[300px] animate-float-delayed"
            />
            <h1 className="text-2xl md:text-4xl lg:text-[80px] uppercase font-semibold leading-tight animate-fade-in-up">
              Global <span className={`${gradientTextClass} animate-gradient`}>POLYMER</span>{" "}
              Marketplace <br /> 
              <span className="text-xl md:text-2xl lg:text-[40px] font-normal text-gray-600 animate-fade-in-up-delayed">
                Connecting Industry Worldwide
              </span>
            </h1>
          </div>

          <p className="text-[var(--text-gray-secondary)] text-[16px] md:text-[20px] mt-10 lg:text-2xl max-w-4xl font-normal animate-fade-in-up-delayed-2">
            Your gateway to premium polymers in the Middle East and beyond. Connect with verified suppliers, 
            access quality materials, and accelerate your manufacturing projects with confidence.
          </p>
        </div>
      </div>
      
      {/* Full-width search bar outside container */}
      <div className="animate-fade-in-up-delayed-3 w-full">
        <HeroSearch />
      </div>

      <div className="relative z-10 container mx-auto px-4 mt-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl animate-fade-in-up-delayed-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-700 mb-2 animate-count-up">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 animate-fade-in-up-delayed-5">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">SASO Compliant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700">Global Shipping</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-orange-700">Expert Support</span>
            </div>
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
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient {
          0%, 100% {
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
