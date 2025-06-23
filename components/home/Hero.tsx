"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// import { Particles } from "@/components/magicui/particles";
import { DotPattern } from "../magicui/dot-pattern";
import HeroSearch from "./HeroSearch";

const stats = [
  { value: 1000, label: "Products" },
  { value: 300, label: "Verified Suppliers" },
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
    <section className="relative w-full overflow-hidden pb-6">
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
              className="absolute top-7 lg:top-0 lg:left-0 w-[40px] md:w-[80px] lg:w-[100px] lg:h-[300px]"
            />
            <Image
              src="/assets/hero_element_2.svg"
              alt="Hero Element 2"
              width={100}
              height={100}
              className="absolute top-7 lg:top-0 right-0 w-[40px] md:w-[80px] lg:w-[100px] lg:h-[300px]"
            />
            <motion.h1
              initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-2xl md:text-4xl lg:text-[80px] uppercase font-semibold leading-tight"
            >
              Sustainable <span className={gradientTextClass}>POLYMERS</span>{" "}
              for <br /> a Better Tomorrow
            </motion.h1>
          </div>

          <p className="text-[var(--text-gray-secondary)] text-[16px] md:text-[20px] mt-10 lg:text-2xl max-w-4xl font-normal">
            We believe that healthy eating should be delicious and satisfying.
            Join us for a culinary experience that nourishes your body and
            delights your taste buds.
          </p>
          <HeroSearch />

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 justify-center gap-10 md:gap-20 w-full">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center"
              >
                <h1 className={`text-[40px] md:text-[80px] font-semibold `}>
                  {stat.value}
                </h1>

                <p className="text-[var(--text-gray-secondary)] md:text-[20px] font-normal">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
