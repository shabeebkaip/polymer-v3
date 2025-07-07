"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProductList } from "@/apiServices/products";
import { createPromotion } from "@/apiServices/user";
import { useUserInfo } from "@/lib/useUserInfo";
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Save, 
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface Product {
  _id: string;
  productName: string;
  price: number;
  chemicalName?: string;
  stock?: number;
  uom?: string;
}

const CreatePromotion = () => {
  const router = useRouter();
  const { user } = useUserInfo();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    productId: '',
    offerPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch user's products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?._id) return;
      
      try {
        setLoadingProducts(true);
        const response = await getProductList({
          createdBy: [user._id],
        });
        setProducts(response.data || []);
        console.log("Products data:", response.data); // Debug log
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load your products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [user]);

  const selectedProduct = products.find(p => p._id === formData.productId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.offerPrice) {
      setError("Please fill in all required fields");
      return;
    }

    if (!user?._id) {
      setError("User information not available");
      return;
    }

    const offerPrice = parseFloat(formData.offerPrice);
    if (isNaN(offerPrice) || offerPrice <= 0) {
      setError("Please enter a valid offer price");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const promotionData = {
        productId: formData.productId,
        sellerId: user._id,
        offerPrice: offerPrice
      };

      await createPromotion(promotionData);
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/user/promotions');
      }, 2000);

    } catch (err) {
      // Type guard for error with response
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setError("Failed to create promotion");
      }
      console.error("Error creating promotion:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Promotion Created!</h2>
            <p className="text-gray-600 mb-4">
              Your promotional deal has been submitted for review. You&apos;ll be redirected to the promotions page.
            </p>
            <div className="animate-pulse text-sm text-gray-500">Redirecting...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white/90 to-green-50/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5"></div>
          <div className="relative p-8">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.back()}
                className="p-3 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all duration-200 border border-gray-200/50"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Create New Promotion
                </h1>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  Set up a special deal for one of your products
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="border-b border-gray-200/60 px-8 py-6 bg-gradient-to-r from-gray-50/80 to-green-50/30">
            <h2 className="text-xl font-semibold text-gray-900">Promotion Details</h2>
            <p className="text-gray-600 mt-1">Fill in the information below to create your promotional deal</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Product Selection */}
            <div>
              <label htmlFor="productId" className="block text-sm font-semibold text-gray-900 mb-2">
                Select Product *
              </label>
              {loadingProducts ? (
                <div className="w-full h-12 bg-gray-100 rounded-xl animate-pulse"></div>
              ) : (
                <select
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                >
                  <option value="">Choose a product...</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.productName} {product.chemicalName && `(${product.chemicalName})`} - ${product.price ? product.price.toFixed(2) : 'Price not set'}
                    </option>
                  ))}
                </select>
              )}
              {products.length === 0 && !loadingProducts && (
                <p className="text-sm text-gray-500 mt-2">
                  No products found. You need to add products first before creating promotions.
                </p>
              )}
            </div>

            {/* Selected Product Info */}
            {selectedProduct && (
              <div className="bg-green-50/50 border border-green-200/50 rounded-xl p-4">
                <h3 className="font-semibold text-green-900 mb-2">Selected Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Original Price:</span>
                    <div className="font-semibold text-gray-900">${selectedProduct.price ? selectedProduct.price.toFixed(2) : 'Not set'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Stock:</span>
                    <div className="font-semibold text-gray-900">{selectedProduct.stock || 'N/A'} {selectedProduct.uom || ''}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Chemical Name:</span>
                    <div className="font-semibold text-gray-900">{selectedProduct.chemicalName || 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Offer Price */}
            <div>
              <label htmlFor="offerPrice" className="block text-sm font-semibold text-gray-900 mb-2">
                Offer Price (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  id="offerPrice"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="Enter your promotional price"
                  className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              {selectedProduct && formData.offerPrice && selectedProduct.price && (
                <div className="mt-2 text-sm">
                  {parseFloat(formData.offerPrice) < selectedProduct.price ? (
                    <span className="text-green-600 font-medium">
                      Discount: ${(selectedProduct.price - parseFloat(formData.offerPrice)).toFixed(2)} 
                      ({(((selectedProduct.price - parseFloat(formData.offerPrice)) / selectedProduct.price) * 100).toFixed(1)}% off)
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-medium">
                      Price is higher than or equal to original price
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200/60">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.productId || !formData.offerPrice}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Creating...' : 'Create Promotion'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your promotion will be submitted for admin review</li>
            <li>• Only approved promotions will be visible to buyers</li>
            <li>• You can only create promotions for your own products</li>
            <li>• The offer price should be competitive to attract customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePromotion;