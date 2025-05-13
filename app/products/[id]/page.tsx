import { getProductDetails } from "@/apiServices/products";
import ProductDetailClient from "@/components/product/ProductClient"; // adjust import path if needed

interface PageProps {
  params: {
    id: string;
  };
}

const ProductPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const response = await getProductDetails(id);
  const product = response.data;

  return <ProductDetailClient product={product} />;
};

export default ProductPage;
