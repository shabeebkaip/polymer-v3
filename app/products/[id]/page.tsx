import { getProductDetails } from "@/apiServices/products";
import ProductDetailClient from "@/components/product/ProductClient";

interface PageProps {
  params: {
    id: string;
  };
}

const ProductPage = async ({ params }: PageProps) => {
  const { id } = params; // ✅ FIXED: removed "await"
  const response = await getProductDetails(id);
  const product = response.data;

  return <ProductDetailClient product={product} />;
};

export default ProductPage;
