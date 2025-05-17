import { getProductDetails } from "@/apiServices/products";
import ProductDetailClient from "@/components/product/ProductClient"; // adjust import path if needed
import AddEditProduct from "@/components/user/AddEditProduct";

interface PageProps {
  params: {
    id: string;
  };
}

const ProductPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const response = await getProductDetails(id);
  const product = response.data;
  console.log("Product Details:", product);
  let data = Object.assign({}, product);
  data = {
    ...data,
    chemicalFamily: data?.chemicalFamily?._id,
    grade: data?.grade?.map((item: any) => item._id),
    incoterms: data?.incoterms?.map((item: any) => item._id),
    industry: data?.industry?.map((item: any) => item._id),
    packagingType: data?.packagingType?.map((item: any) => item._id),
    paymentTerms: data?.paymentTerms?._id,
    physicalForm: data?.physicalForm?._id,
    polymerType: data?.polymerType?._id,
    product_family: data?.product_family?.map((item: any) => item._id),
  };
  return <AddEditProduct product={data} id={id} />;
};

export default ProductPage;
