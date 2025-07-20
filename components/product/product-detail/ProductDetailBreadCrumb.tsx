import React from 'react';
import { useRouter } from 'next/navigation';

interface ProductDetailBreadCrumbProps {
  product: {
    productName: string;
  }
}

const ProductDetailBreadCrumb: React.FC<ProductDetailBreadCrumbProps> = ({ product }) => {
    const  router = useRouter();
    return (
      <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
              <nav className="text-sm text-gray-600">
            <span
                className="cursor-pointer underline"
                onClick={() => router.push("/")}
            >
              Home
            </span>{" "}
                  /{" "}
                  <span
                      className="cursor-pointer underline"
                      onClick={() => router.push("/products")}
                  >
              Products
            </span>{" "}
                  / <span className="text-gray-900">{product.productName}</span>
              </nav>
          </div>
      </div>
  );
};

export default ProductDetailBreadCrumb;

