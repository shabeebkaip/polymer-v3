"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductDetails } from "@/apiServices/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import type { Product } from "@/types/product";

export default function ProductPage() {
  const params = useParams();
  const id = (params as { id?: string })?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Product ID not found.");
      setLoading(false);
      return;
    }

    getProductDetails(id)
      .then((res) => setProduct(res.data as Product))
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailClient product={product} />
    </Suspense>
  );
}
