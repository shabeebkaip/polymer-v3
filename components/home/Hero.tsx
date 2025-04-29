import Image from "next/image";
import React from "react";

const stats = [
  { value: "1000+", label: "Products" },
  { value: "100+", label: "Trusted Brands" },
  { value: "300+", label: "Verified Sellers" },
  { value: "24/7", label: "Expert Support" },
];

const Hero: React.FC = () => {
  return (
    <section className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center text-center mt-16">
        <div className="relative">
          <Image
            src="/assets/hero_element_1.svg"
            alt="Hero Element 1"
            width={100}
            height={100}
            className="absolute top-0 left-0 w-[100px] h-[300px]"
          />
          <Image
            src="/assets/hero_element_2.svg"
            alt="Hero Element 2"
            width={100}
            height={100}
            className="absolute top-0 right-0 w-[100px] h-[300px]"
          />
          <h1 className="text-[80px] uppercase font-semibold leading-tight">
            Sustainable{" "}
            <span
              className="
              bg-gradient-to-r
              from-[var(--green-gradient-from)]
              via-[var(--green-gradient-via)]
              to-[var(--green-gradient-to)]
              bg-clip-text
              text-transparent
            "
            >
              POLYMERS
            </span>{" "}
            for <br /> a Better Tomorrow
          </h1>
        </div>
        <p className="text-[var(--text-gray-secondary)] text-[20px] mt-10  max-w-4xl text-2xl font-normal">
          We believe that healthy eating should be delicious and satisfying.
          Join us for a culinary experience that nourishes your body and
          delights your taste buds.
        </p>
        <div className="mt-10 w-full relative ">
          <div
            className="w-10 h-10
              bg-gradient-to-r
              from-[var(--green-gradient-from)]
              via-[var(--green-gradient-via)]
              to-[var(--green-gradient-to)]
              rounded-full flex justify-center items-center absolute top-2 2xl:right-66 xl:right-56 lg:right-44 md:right-32 sm:right-28 right-20"
          >
            <Image
              src="/icons/search.svg"
              alt="Arrow Icon"
              width={20}
              height={20}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Search Polymers"
              className="w-4/6 px-4 py-4
            rounded-full
            border-1 border-[var(--green-light)] "
            />
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-20 w-full">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center"
            >
              <h1
                className="text-[80px] font-semibold
               bg-gradient-to-r
              from-[var(--green-gradient-from)]
              via-[var(--green-gradient-via)]
              to-[var(--green-gradient-to)]
              bg-clip-text
              text-transparent"
              >
                {stat.value}
              </h1>
              <p className="text-[var(--text-gray-secondary)] text-[20px] font-normal">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
