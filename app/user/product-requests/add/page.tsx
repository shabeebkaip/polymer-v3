"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, CheckCircle, AlertCircle, Calendar as CalendarIcon, MapPin, FileText, Clock, Truck, Scale, Globe, MessageSquare, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { getProductList } from "@/apiServices/products";
import { createBuyerProductRequest } from "@/apiServices/user";
import { getCountryList } from "@/lib/useCountries";
import { format } from "date-fns";

interface Product {
  _id: string;
  productName: string;
  grade?: { name: string };
  uom?: string;
  pricePerUnit?: number;
  createdBy?: {
    company?: string;
  };
}

interface ProductRequestFormData {
  productId: string;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  destination: string;
  delivery_date: Date | undefined;
  message: string;
  request_document: string;
}

const UOM_OPTIONS = [
  "Kilogram",
  "Gram", 
  "Milligram",
  "Metric Ton",
  "Pound",
  "Ounce",
  "Liter",
  "Milliliter",
  "Cubic Meter",
  "Cubic Centimeter",
  "Gallon",
  "Quart",
  "Pint",
];

const CreateProductRequest = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const [formData, setFormData] = useState<ProductRequestFormData>({
    productId: "",
    quantity: 1,
    uom: "Kilogram",
    city: "",
    country: "",
    destination: "",
    delivery_date: undefined,
    message: "",
    request_document: "no",
  });

  const countries = useMemo(() => getCountryList(), []);

  // Debounced input values to prevent excessive re-renders
  const [inputValues, setInputValues] = useState({
    quantity: "1",
    city: "",
    destination: "",
    message: "",
  });

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await getProductList({ page: 1, limit: 100 });
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoized handlers to prevent re-creation on every render
  const handleProductChange = useCallback((productId: string) => {
    const product = products.find(p => p._id === productId);
    setSelectedProduct(product || null);
    setFormData(prev => ({
      ...prev,
      productId,
      uom: product?.uom || "Kilogram",
    }));
  }, [products]);

  const handleInputChange = useCallback((field: keyof ProductRequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Optimized quantity input handler
  const handleQuantityInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update input value immediately for responsiveness
    setInputValues(prev => ({ ...prev, quantity: value }));
    
    // Clean and validate the value
    const cleanValue = value.replace(/[^0-9]/g, '');
    const numericValue = cleanValue === '' ? 1 : parseInt(cleanValue) || 1;
    
    // Update form data
    setFormData(prev => ({ ...prev, quantity: numericValue }));
  }, []);

  // Debounced text input handlers
  const handleTextInputChange = useCallback((field: string) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInputValues(prev => ({ ...prev, [field]: value }));
      
      // Use a timeout to debounce the form data update
      const timeoutId = setTimeout(() => {
        setFormData(prev => ({ ...prev, [field]: value }));
      }, 300);
      
      return () => clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId) {
      toast.error("Please select a product");
      return;
    }

    if (!formData.delivery_date) {
      toast.error("Please select a delivery date");
      return;
    }

    if (!formData.city || !formData.country || !formData.destination) {
      toast.error("Please fill in all location details");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        product: formData.productId,
        quantity: formData.quantity,
        uom: formData.uom,
        city: formData.city.trim(),
        country: formData.country,
        destination: formData.destination.trim(),
        delivery_date: formData.delivery_date,
        message: formData.message.trim(),
        request_document: formData.request_document,
      };

      console.log("Submitting product request:", requestData);
      
      const response = await createBuyerProductRequest(requestData);
      
      if (response.success) {
        toast.success("Product request created successfully!");
        router.push("/user/product-requests");
      } else {
        toast.error(response.message || "Failed to create product request");
      }
    } catch (error: any) {
      console.error("Error creating product request:", error);
      toast.error(error?.response?.data?.message || "Failed to create product request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/user/product-requests")}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product Requests
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
              Create Product Request
            </h1>
            <p className="text-gray-600 mt-1">Request products from our verified suppliers</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900">Quality Products</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Request from thousands of verified polymer products with quality assurance.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900">Fast Delivery</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Get your products delivered quickly with our logistics network.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900">Verified Suppliers</h3>
            </div>
            <p className="text-gray-600 text-sm">
              All suppliers are thoroughly vetted and verified for quality and reliability.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="border-b border-gray-200/60 px-8 py-6 bg-gradient-to-r from-gray-50/80 to-green-50/30">
            <h2 className="text-xl font-bold text-gray-900">Product Request Details</h2>
            <p className="text-gray-600 mt-1">Fill in the details below to submit your product request</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Package className="w-4 h-4 inline mr-2 text-green-600" />
                    Select Product *
                  </label>
                  <Select
                    value={formData.productId}
                    onValueChange={handleProductChange}
                    disabled={loadingProducts || products.length === 0}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-12">
                      <SelectValue placeholder={
                        loadingProducts 
                          ? "Loading products..." 
                          : products.length === 0 
                            ? "No products available" 
                            : "Choose a product"
                      } />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {loadingProducts ? (
                        <div className="p-2 text-center text-gray-500">Loading products...</div>
                      ) : products.length === 0 ? (
                        <div className="p-2 text-center text-gray-500">No products available</div>
                      ) : (
                        products.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{product.productName}</span>
                              {product.createdBy?.company && (
                                <span className="text-xs text-gray-500">by {product.createdBy.company}</span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedProduct && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700">
                        Selected: <span className="font-semibold">{selectedProduct.productName}</span>
                        {selectedProduct.grade?.name && (
                          <span className="ml-2 text-green-600">({selectedProduct.grade.name})</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quantity & UOM */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <Scale className="w-4 h-4 inline mr-2 text-green-600" />
                      Quantity *
                    </label>
                    <Input
                      type="text"
                      value={inputValues.quantity}
                      onChange={handleQuantityInputChange}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-12"
                      placeholder="Enter quantity"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Unit of Measure *
                    </label>
                    <Select
                      value={formData.uom}
                      onValueChange={(value) => handleInputChange("uom", value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UOM_OPTIONS.map((uom) => (
                          <SelectItem key={uom} value={uom}>
                            {uom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <CalendarIcon className="w-4 h-4 inline mr-2 text-green-600" />
                    Required Delivery Date *
                  </label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left border-gray-300 hover:border-green-500 h-12"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                        {formData.delivery_date ? (
                          format(formData.delivery_date, "PPP")
                        ) : (
                          <span className="text-gray-500">Select delivery date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.delivery_date}
                        onSelect={(date) => {
                          handleInputChange("delivery_date", date);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Request Document */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <FileText className="w-4 h-4 inline mr-2 text-green-600" />
                    Require Documentation *
                  </label>
                  <Select
                    value={formData.request_document}
                    onValueChange={(value) => handleInputChange("request_document", value)}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes - Send product documentation</SelectItem>
                      <SelectItem value="no">No - Documentation not required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Country Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Globe className="w-4 h-4 inline mr-2 text-green-600" />
                    Country *
                  </label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange("country", value)}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-12">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <MapPin className="w-4 h-4 inline mr-2 text-green-600" />
                    City *
                  </label>
                  <Input
                    type="text"
                    value={inputValues.city}
                    onChange={handleTextInputChange("city")}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-12"
                    placeholder="Enter your city"
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Truck className="w-4 h-4 inline mr-2 text-green-600" />
                    Delivery Destination *
                  </label>
                  <Input
                    type="text"
                    value={inputValues.destination}
                    onChange={handleTextInputChange("destination")}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-12"
                    placeholder="Enter delivery address"
                  />
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <MessageSquare className="w-4 h-4 inline mr-2 text-green-600" />
                    Additional Message
                  </label>
                  <Textarea
                    value={inputValues.message}
                    onChange={handleTextInputChange("message")}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-[120px] resize-none"
                    placeholder="Add any special requirements or notes for the supplier..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include any specific requirements, quality standards, or delivery instructions
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  * Required fields must be filled out
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.productId || !formData.delivery_date}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Creating Request...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Product Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductRequest;
