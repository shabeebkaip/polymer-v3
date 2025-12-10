import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { getProductList } from '@/apiServices/products';
import { Product } from '@/types/finance';

export const useProductData = (productId: string | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await getProductList({ page: 1, limit: 100 });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    (async () => {
      await fetchProducts();
    })();
  }, []);

  const productOptions = useMemo(() => {
    return products.map(product => ({
      _id: product._id,
      name: product.productName,
      grade: product.grade?.name,
      company: product.createdBy?.company,
    }));
  }, [products]);

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProduct(product || null);
    return product || null;
  };

  return {
    products,
    loadingProducts,
    selectedProduct,
    productOptions,
    handleProductChange,
  };
};
