import React from "react";
import { useRouter } from "next/navigation";

// Define a proper type for product props
interface Product {
  [key: string]: any;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  console.log("ProductCard", product?.createdBy?.company_logo);
  return (
    <div className="rounded-xl p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        {/* Product image */}
        <img
          src={product?.productImages?.[0]?.fileUrl}
          alt="Product"
          className="w-full h-32 object-cover rounded-md"
        />

        {/* Seller Info */}
        <div className="flex items-center gap-4">
          <img
            src={product?.createdBy?.company_logo}
            className="w-20 h-20 object-contain"
          />
          <div className="flex flex-col justify-center">
            <h4 className="font-normal text-lg">{product?.productName}</h4>
            <p className="text-sm text-gray-600">{product?.countryOfOrigin}</p>
          </div>
        </div>

        <hr className="h-px bg-gray-200 border-0" />

        {/* Product Info */}
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-[var(--text-gray-tertiary)]">
            <span className="text-[var(--dark-main)]">Chemical Name:</span>{" "}
            {product.chemicalName}
          </p>
          <p className="text-[var(--text-gray-tertiary)]">
            <span className="text-[var(--dark-main)]">Polymer Type:</span>{" "}
            {product.polymerType?.name}
          </p>
          {/* <p className="text-[var(--text-gray-tertiary)]">
            <span className="text-[var(--dark-main)]">Industry:</span>{" "}
            {product.industry}
          </p> */}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          type="button"
          className=" px-4 py-2 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 transition cursor-pointer text-xs"
        >
          Request For Quote
        </button>

        <button
          type="button"
          className="transition px-4 py-3 rounded-lg w-full text-xs cursor-pointer bg-[var(--button-gray)] text-white"
        >
          Request For Sample
        </button>
      </div>
      <button
        className="mt-4 border border-[var(--green-main)] text-[var(--green-main)] px-4 py-3 rounded-lg w-full  hover:bg-green-50 transition"
        onClick={() => {
          router.push(`/products/${product._id}`);
        }}
      >
        View Product
      </button>
    </div>
  );
};

export default ProductCard;
