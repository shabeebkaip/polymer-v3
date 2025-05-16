"use client";
import { getProductList } from "@/apiServices/products";
import { Button } from "@/components/ui/button";
import UserProductCard from "@/components/user/UserProductCard";
import { useUserInfo } from "@/lib/useUserInfo";
import React, { useEffect } from "react";

const ProductsPage: React.FC = () => {
  const { user } = useUserInfo();
  const [products, setProducts] = React.useState<any[]>([]);
  useEffect(() => {
    getProductList({
      createdBy: [user?._id],
    }).then((response) => {
      const productData: any[] = response.data;
      setProducts(productData);
    });
  }, [user]);
  console.log("products", products);
  return (
    <div className="container mx-auto px-4 ">
      <div className="flex flex-row ">
        <h1 className="md:text-2xl">My Products</h1>
        <Button
          className="ml-auto"
          onClick={() => {
            window.location.href = "/user/products/add";
          }}
        >
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {products.map((product, index) => (
          <UserProductCard key={index} product={product} />
        ))}
      </div>

      {/* Add your products list or content here */}
    </div>
  );
};

export default ProductsPage;
