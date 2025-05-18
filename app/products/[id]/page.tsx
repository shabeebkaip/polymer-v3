import { getProductDetails } from "@/apiServices/products";
import ProductDetailClient from "@/components/product/ProductClient";

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const response = await getProductDetails(id);
  const product = response.data;

  return <ProductDetailClient product={product} />;
};

export default ProductPage;
