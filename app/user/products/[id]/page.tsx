"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductDetails } from "@/apiServices/products";
import AddEditProduct from "@/components/user/AddEditProduct";

export default function ProductPage() {
  const { id } = useParams() as { id: string };

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await getProductDetails(id);
        const product = response.data;

        const data = {
          ...product,
          chemicalFamily: product?.chemicalFamily?._id,
          grade: product?.grade?.map((item: any) => item._id),
          incoterms: product?.incoterms?.map((item: any) => item._id),
          industry: product?.industry?.map((item: any) => item._id),
          packagingType: product?.packagingType?.map((item: any) => item._id),
          paymentTerms: product?.paymentTerms?._id,
          physicalForm: product?.physicalForm?._id,
          polymerType: product?.polymerType?._id,
          product_family: product?.product_family?.map((item: any) => item._id),
        };

        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (!product)
    return <div className="p-4 text-center">Product not found.</div>;

  return <AddEditProduct product={product} id={id} />;
}
