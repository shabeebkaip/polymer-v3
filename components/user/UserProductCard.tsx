import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Delete, Pencil } from "lucide-react";
import { FALLBACK_PRODUCT_IMAGE, FALLBACK_COMPANY_IMAGE } from "@/lib/fallbackImages";

interface Product {
  [key: string]: any;
}

interface UserProductCardProps {
  product: Product;
}

const UserProductCard: React.FC<UserProductCardProps> = ({ product }) => {
  const router = useRouter();
  return (
    <div className="rounded-xl p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <img
          src={product?.productImages?.[0]?.fileUrl || FALLBACK_PRODUCT_IMAGE}
          alt="Product"
          className="w-full h-32 object-cover rounded-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
          }}
        />
        <div className="flex items-center gap-4">
          <img
            src={product?.createdBy?.company_logo || FALLBACK_COMPANY_IMAGE}
            className="w-20 h-20 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE;
            }}
          />
          <div className="flex flex-col justify-center">
            <h4 className="font-normal text-lg">{product?.productName}</h4>
            <p className="text-sm text-gray-600">{product?.countryOfOrigin}</p>
          </div>
        </div>

        <hr className="h-px bg-gray-200 border-0" />

        <div className="flex flex-col gap-2 text-sm">
          <p className="text-[var(--text-gray-tertiary)]">
            <span className="text-[var(--dark-main)]">Chemical Name:</span>{" "}
            {product.chemicalName}
          </p>
          <p className="text-[var(--text-gray-tertiary)]">
            <span className="text-[var(--dark-main)]">Polymer Type:</span>{" "}
            {product.polymerType?.name}
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button
          variant={"secondary"}
          color="green"
          className="cursor-pointer"
          onClick={() => {
            router.push(`/user/products/${product._id}`);
          }}
        >
          <Pencil /> Edit
        </Button>

        <Button variant={"destructive"} className="cursor-pointer">
          <Delete /> Delete
        </Button>
      </div>
    </div>
  );
};

export default UserProductCard;
