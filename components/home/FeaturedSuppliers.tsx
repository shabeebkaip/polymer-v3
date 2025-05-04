import React from "react";
import SellerLogoContainer from "./SellerLogoContainer";

const FeaturedSuppliers: React.FC = () => {
  const sellers = [
    "/assets/seller 1.svg",
    "/assets/seller 2.svg",
    "/assets/seller 3.svg",
    "/assets/seller 1.svg",
    "/assets/seller 2.svg",
    "/assets/seller 3.svg",
    "/assets/seller 1.svg",
    "/assets/seller 2.svg",
  ];
  return (
    <section className="container mx-auto px-4 mt-20 mb-10">
      <div className="flex flex-col  items-center gap-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-0 items-center text-center md:text-left">
          <h2 className="text-2xl md:text-5xl text-[var(--dark-main)]">
            Featured Suppliers
          </h2>
          <p className="text-[var(--text-gray-tertiary)] font-normal   md:text-lg">
            As new technologies like cryptocurrency develop, the real estate
            sector is changing drastically. It is important to understand both
            how these technologies and the traditional real estate market work.
          </p>
        </div>

        <div className="w-full flex md:block justify-center ">
          <div className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 md:gap-4 lg:gap-2 gap-2 " >
            {sellers?.map((seller, index) => (
              <SellerLogoContainer key={index} logoUrl={seller} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSuppliers;
