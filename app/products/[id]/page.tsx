"use client";

import { getProductDetails } from "@/apiServices/products";
import CompanyDetails from "@/components/product/CompanyDetails";
import ImageContainers from "@/components/product/ImageContainers";
import React, { use, useEffect, useState } from "react";

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ params }) => {
  const { id } = use(params);
  const [product, setProduct] = useState({});

  useEffect(() => {
    getProductDetails(id).then((response) => {
      setProduct(response.data);
    });
  }, [id]);
  console.log(product, "product");

  return (
    <section className="mt-10 container mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-normal text-[var(--dark-main)]">
            {product?.productName}
          </h1>
          <ImageContainers productImages={product?.productImages} />
        </div>
        <CompanyDetails companyDetails={product?.createdBy} />
      </div>
    </section>
  );
};

export default ProductDetail;
