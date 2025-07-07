"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductDetails } from "@/apiServices/products";
import AddEditProduct from "@/components/user/AddEditProduct";
import { ProductFormData } from "@/types/product";

export default function ProductPage() {
  const { id } = useParams() as { id: string };

  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await getProductDetails(id);
        const product = response.data;

        const data = {
          ...product,
          productName: product?.productName || "",
          chemicalName: product?.chemicalName || "",
          description: product?.description || "",
          tradeName: product?.tradeName || "",
          chemicalFamily: product?.chemicalFamily?._id || "",
          polymerType: product?.polymerType?._id || "",
          industry: product?.industry?.map((item: { _id: string }) => item._id) || [],
          grade: product?.grade?.map((item: { _id: string }) => item._id) || [],
          manufacturingMethod: product?.manufacturingMethod || "",
          physicalForm: product?.physicalForm?._id || "",
          countryOfOrigin: product?.countryOfOrigin || "",
          color: product?.color || "",
          productImages: product?.productImages || [],
          density: product?.density?.toString() || "",
          mfi: product?.mfi ?? null,
          tensileStrength: product?.tensileStrength ?? null,
          elongationAtBreak: product?.elongationAtBreak ?? null,
          shoreHardness: product?.shoreHardness ?? null,
          waterAbsorption: product?.waterAbsorption ?? null,
          minimum_order_quantity: product?.minimum_order_quantity ?? null,
          stock: product?.stock ?? null,
          uom: product?.uom || "",
          price: product?.price ?? null,
          priceTerms: product?.priceTerms || "fixed",
          incoterms: product?.incoterms?.map((item: { _id: string }) => item._id) || [],
          leadTime: product?.leadTime || "",
          paymentTerms: product?.paymentTerms?._id || "",
          packagingType: product?.packagingType?.map((item: { _id: string }) => item._id) || [],
          packagingWeight: product?.packagingWeight || "",
          storageConditions: product?.storageConditions || "",
          technical_data_sheet: product?.technical_data_sheet || {},
          certificate_of_analysis: product?.certificate_of_analysis || {},
          safety_data_sheet: product?.safety_data_sheet || {},
          shelfLife: product?.shelfLife || "",
          recyclable: product?.recyclable ?? false,
          bioDegradable: product?.bioDegradable ?? false,
          fdaApproved: product?.fdaApproved ?? false,
          medicalGrade: product?.medicalGrade ?? false,
          product_family: product?.product_family?.map((item: { _id: string }) => item._id) || [],
          _id: product?._id || null,
        };

        setProduct(data as ProductFormData);
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
