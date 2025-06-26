import React, { useState, useRef, useLayoutEffect } from "react";
import CompanyDetails from "@/components/product/CompanyDetails";
import ImageContainers from "@/components/product/ImageContainers";
import GeneralTabInformation from "./GeneralTabInformation";
import TradeInformation from "./TradeInformation";
import { useUserInfo } from "@/lib/useUserInfo";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SampleRequestModal from "@/components/shared/SampleRequestModal";
import {
  Star,
  Share2,
  Heart,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  Award,
  Globe,
  Factory,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Interfaces (same as your original)

interface ProductImage {
  fileUrl: string;
  [key: string]: any;
}

interface Company {
  _id: string;
  company: string;
  company_logo: string;
  countryOfOrigin: string;
  website?: string;
  [key: string]: any;
}

interface NamedObject {
  _id: string;
  name: string;
  ar_name?: string;
  ger_name?: string;
  cn_name?: string;
}

interface Product {
  _id: string;
  productName: string;
  chemicalName?: string;
  tradeName?: string;
  description?: string;
  productImages?: ProductImage[];
  createdBy?: Company;
  chemicalFamily?: NamedObject;
  polymerType?: NamedObject;
  physicalForm?: NamedObject;
  industry?: NamedObject[];
  grade?: NamedObject[];
  productType?: string;
  uom?: string; // This is just a string based on the data structure
  minimum_order_quantity?: number;
  minOrderQuantity?: number;
  price?: number;
  density?: number;
  stock?: number;
  manufacturingMethod?: string;
  color?: string;
  countryOfOrigin?: string;
  [key: string]: any;
}

interface ProductDetailClientProps {
  product: Product;
}

const tabs = [
  { key: "general", label: "General Product Information" },
  { key: "trade", label: "Trade Information" },
] as const;

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "trade">("general");
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useUserInfo();
  const router = useRouter();

  // For underline animation
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const setTabRef = (el: HTMLButtonElement | null, idx: number) => {
    tabRefs.current[idx] = el;
  };

  useLayoutEffect(() => {
    const index = tabs.findIndex((tab) => tab.key === activeTab);
    const currentRef = tabRefs.current[index];
    if (currentRef) {
      const { offsetLeft, offsetWidth } = currentRef;
      setUnderline({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.productName,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
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

      {/* Quick Product Summary Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                {product.productType || product.polymerType?.name || "Product"}
              </Badge>
              <span className="text-gray-600">•</span>
              <span className="font-medium">{product.productName}</span>
            </div>
            {(product.grade || product.physicalForm) && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-gray-700">
                  {product.grade &&
                    Array.isArray(product.grade) &&
                    product.grade.length > 0 && (
                      <>
                        Grade:{" "}
                        <span className="font-medium">
                          {product.grade.map((g, index) => (
                            <span key={g._id || index}>
                              {g.name}
                              {index < product.grade!.length - 1 && ", "}
                            </span>
                          ))}
                        </span>
                      </>
                    )}
                  {product.physicalForm && !product.grade && (
                    <>
                      Form:{" "}
                      <span className="font-medium">
                        {product.physicalForm?.name}
                      </span>
                    </>
                  )}
                </span>
              </>
            )}
            {(product.minimum_order_quantity || product.minOrderQuantity) &&
              product.uom && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-700">
                    Min Order:{" "}
                    <span className="font-medium">
                      {product.minimum_order_quantity ||
                        product.minOrderQuantity}{" "}
                      {product.uom}
                    </span>
                  </span>
                </>
              )}
            {product.createdBy && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-gray-700">
                  By:{" "}
                  <span className="font-medium">
                    {product.createdBy.company}
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - Maximum Product Details Priority */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 lg:p-8 ">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div>
                {product?.productImages && product?.productImages?.length ? (
                  <ImageContainers
                    productImages={product.productImages}
                    isCompact={true}
                  />
                ) : (
                  <div className="h-48 lg:h-60 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="mb-6">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 mb-3"
                >
                  <Award className="w-4 h-4 mr-1" />
                  Premium Quality
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.productName}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8 out of 5)</span>
                </div>
              </div>
            </div>
            {/* Badge and Product Name at Top */}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4">
              {/* Product Images Section - Smaller */}

              {/* Product Details Section - Larger */}
              <div className="lg:col-span-5">
                {/* Key Product Details Preview - Enhanced */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  {(product.productType || product.polymerType) && (
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-green-500">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-gray-900 text-sm">
                          Product Type
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {product.productType || product.polymerType?.name}
                      </p>
                    </div>
                  )}
                  {product.grade &&
                    Array.isArray(product.grade) &&
                    product.grade.length > 0 && (
                      <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-900 text-sm">
                            Grade{product.grade.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {product.grade.map((g, index) => (
                            <span key={g._id || index}>
                              {g.name}
                              {index < product.grade!.length - 1 && ", "}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                  {product.physicalForm && (
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-indigo-500">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-gray-900 text-sm">
                          Physical Form
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {product.physicalForm?.name}
                      </p>
                    </div>
                  )}
                  {product.uom && (
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-purple-500">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-gray-900 text-sm">
                          Unit
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {product.uom}
                      </p>
                    </div>
                  )}
                  {(product.minimum_order_quantity ||
                    product.minOrderQuantity) && (
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-orange-500">
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingCart className="w-4 h-4 text-orange-600" />
                        <span className="font-semibold text-gray-900 text-sm">
                          Min Order
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {product.minimum_order_quantity ||
                          product.minOrderQuantity}{" "}
                        {product.uom}
                      </p>
                    </div>
                  )}
                  {product.price && (
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-red-500">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-gray-900 text-sm">
                          Price
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        ${product.price}
                      </p>
                    </div>
                  )}
                  {product.density && (
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-teal-500">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold text-gray-900 text-sm">
                          Density
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {product.density}
                      </p>
                    </div>
                  )}
                  {product.chemicalFamily && (
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-pink-500">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-pink-600" />
                        <span className="font-semibold text-gray-900 text-sm">
                          Chemical Family
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {product.chemicalFamily?.name}
                      </p>
                    </div>
                  )}
                  {product.stock && (
                    <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-emerald-500">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-gray-900 text-sm">
                          Stock Available
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {product.stock} {product.uom}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Features */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        Quality Assured
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">ISO Certified</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        Fast Delivery
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Worldwide Shipping</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex-1 min-w-[200px]"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Request Quote
                  </Button>
                  {user?.user_type === "buyer" && (
                    <SampleRequestModal
                      productId={product._id}
                      uom={product.uom || "kg"}
                      className="flex-1 min-w-[200px] px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all font-medium flex items-center justify-center"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Request Sample
                    </SampleRequestModal>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Company Info Preview */}
                {product.createdBy && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {product.createdBy.company_logo ? (
                          <img
                            src={product.createdBy.company_logo}
                            alt={product.createdBy.company}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Factory className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {product.createdBy.company}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {product.createdBy.countryOfOrigin}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Supplier
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section - Moved up for better priority */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 lg:px-8 py-4">
            <div className="relative flex gap-8">
              {tabs.map((tab, i) => (
                <button
                  key={tab.key}
                  ref={(el) => setTabRef(el, i)}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-2 text-lg font-medium cursor-pointer transition-all duration-200 ${
                    activeTab === tab.key
                      ? "text-green-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              {/* Animated underline */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute bottom-0 h-0.5 rounded bg-green-600"
                style={{
                  left: underline.left,
                  width: underline.width,
                }}
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <GeneralTabInformation product={product} />
                </motion.div>
              )}
              {activeTab === "trade" && (
                <motion.div
                  key="trade"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <TradeInformation product={product} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Company Details Card - Moved down */}
        {product.createdBy && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 lg:p-8 mb-8">
            <CompanyDetails
              companyDetails={product.createdBy}
              productId={product?._id}
              uom={product.uom || "kg"}
              userType={user?.user_type}
            />
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 mt-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Interested in This Product?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Get in touch with our team to discuss your requirements, request
            samples, or get a custom quote for {product.productName}.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Request Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600"
            >
              Contact Supplier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
