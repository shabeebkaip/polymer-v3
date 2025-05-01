import Image from "next/image";
import React from "react";

interface Product {
  image: string;
  logo: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="rounded-xl p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <img
          src={product.image}
          className="w-full h-32 object-cover rounded-md"
        />
        <div className="flex items-center gap-4 ">
          <Image
            src={product.logo}
            alt="Seller Icon"
            width={20}
            height={20}
            className="w-20 h-20"
          />
          <div className="flex flex-col justify-center">
            <h4 className="font-normal text-lg">
              Pure Health Ingredients (shanghi) co,Itd
            </h4>
            <p>Shanghai, China </p>
          </div>
        </div>
        <hr className="h-px bg-gray-200 border-0" />
        <div className="flex flex-col gap-2">
          <p className="text-[var(--text-gray-tertiary)] font-normal">
            <span className="text-[var(--dark-main)]">Chemical Name:</span>{" "}
            Polyethlene Glycol
          </p>
          <p className="text-[var(--text-gray-tertiary)] font-normal">
            <span className="text-[var(--dark-main)]">Polymer Type:</span> Water
            Soluble Polymer
          </p>
          <p className="text-[var(--text-gray-tertiary)] font-normal">
            <span className="text-[var(--dark-main)]">Industry:</span> Cosmetic
            & Personal Care
          </p>
        </div>
      </div>

      {/* Buttons Section - always pinned at bottom */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          type="button"
          className="bg-gradient-to-r
            from-[var(--green-gradient-from)]
            via-[var(--green-gradient-via)]
            to-[var(--green-gradient-to)]
            text-white px-4 py-2 rounded-lg w-full text-xs"
        >
          Request For Quote
        </button>
        <button
          type="button"
          className="transition px-4 py-2 rounded-lg w-full text-xs cursor-pointer bg-[var(--button-gray)] text-white"
        >
          Request For Sample
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
