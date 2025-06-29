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
import QuoteRequestModal from "@/components/shared/QuoteRequestModal";
import ActionButtons from "@/components/shared/ActionButtons";
import { FALLBACK_COMPANY_IMAGE } from "@/lib/fallbackImages";
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
  uom?: string;
  minimum_order_quantity?: number;
  minOrderQuantity?: number;
  price?: number;
  density?: number;
  stock?: number;
  manufacturingMethod?: string;
  color?: string;
  countryOfOrigin?: string;
  packagingWeight?: string;
  mfi?: number;
  tensileStrength?: number;
  elongationAtBreak?: number;
  shoreHardness?: number;
  waterAbsorption?: number;
  storageConditions?: string;
  shelfLife?: string;
  recyclable?: boolean;
  bioDegradable?: boolean;
  fdaApproved?: boolean;
  medicalGrade?: boolean;
  leadTime?: string;
  paymentTerms?: NamedObject;
  priceTerms?: string;
  packagingType?: NamedObject[];
  incoterms?: NamedObject[];
  product_family?: NamedObject[];
  additionalInfo?: Array<{
    title: string;
    description: string;
  }>;
  safety_data_sheet?: {
    fileUrl: string;
    name: string;
    type: string;
  };
  technical_data_sheet?: {
    fileUrl: string;
    name: string;
    type: string;
  };
  certificate_of_analysis?: {
    fileUrl: string;
    name: string;
    type: string;
  };
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
            {product.grade || product.physicalForm ? (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-gray-700">
                  {product.grade &&
                    Array.isArray(product.grade) &&
                    product.grade.length > 0 ? (
                      <>
                        Grade:{" "}
                        <span className="font-medium">
                          {product.grade.map((g, index) => (
                            <span key={g._id || index}>
                              {g.name}
                              {index < product.grade!.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </span>
                      </>
                    ) : null}
                  {product.physicalForm && !product.grade ? (
                    <>
                      Form:{" "}
                      <span className="font-medium">
                        {product.physicalForm?.name}
                      </span>
                    </>
                  ) : null}
                </span>
              </>
            ) : null}
            {((product.minimum_order_quantity &&
              product.minimum_order_quantity > 0) ||
              (product.minOrderQuantity && product.minOrderQuantity > 0)) &&
            product.uom ? (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-gray-700">
                  Min Order:{" "}
                  <span className="font-medium">
                    {product.minimum_order_quantity || product.minOrderQuantity}{" "}
                    {product.uom}
                  </span>
                </span>
              </>
            ) : null}
            {product.createdBy ? (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-gray-700">
                  By:{" "}
                  <span className="font-medium">
                    {product.createdBy.company}
                  </span>
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - Simplified */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                {product?.productImages && product?.productImages?.length ? (
                  <ImageContainers
                    productImages={product.productImages}
                    isCompact={true}
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                {/* Badge */}
                {product.fdaApproved ? (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 mb-3"
                  >
                    <Award className="w-4 h-4 mr-1" />
                    FDA Approved
                  </Badge>
                ) : null}
                {product.medicalGrade && !product.fdaApproved ? (
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 mb-3"
                  >
                    <Award className="w-4 h-4 mr-1" />
                    Medical Grade
                  </Badge>
                ) : null}
                {!product.fdaApproved && !product.medicalGrade ? (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-800 mb-3"
                  >
                    <Award className="w-4 h-4 mr-1" />
                    Industrial Grade
                  </Badge>
                ) : null}

                {/* Product Name */}
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {product.productName}
                </h1>

                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {product.price && product.price > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-semibold text-lg text-gray-900">
                        ${product.price}/{product.uom}
                      </span>
                    </div>
                  ) : null}
                  {((product.minimum_order_quantity &&
                    product.minimum_order_quantity > 0) ||
                    (product.minOrderQuantity &&
                      product.minOrderQuantity > 0)) ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Min Order:</span>
                      <span className="font-medium text-gray-900">
                        {product.minimum_order_quantity ||
                          product.minOrderQuantity}{" "}
                        {product.uom}
                      </span>
                    </div>
                  ) : null}
                  {product.stock && product.stock > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <span className="font-medium text-gray-900">
                        {product.stock} {product.uom}
                      </span>
                    </div>
                  ) : null}
                  {product.leadTime ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Lead Time:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(product.leadTime).toLocaleDateString()}
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <ActionButtons
                    productId={product._id}
                    uom={product.uom || "Metric Ton"}
                    variant="compact"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite ? "fill-current text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications - Organized */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
          <div className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Product Specifications
            </h2>

            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(product.productType || product.polymerType) ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Product Type
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.productType || product.polymerType?.name}
                    </p>
                  </div>
                ) : null}
                {product.tradeName ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Trade Name
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.tradeName}
                    </p>
                  </div>
                ) : null}
                {product.chemicalName ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Chemical Name
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.chemicalName}
                    </p>
                  </div>
                ) : null}
                {product.chemicalFamily ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Chemical Family
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.chemicalFamily?.name}
                    </p>
                  </div>
                ) : null}
                {product.physicalForm ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Physical Form
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.physicalForm?.name}
                    </p>
                  </div>
                ) : null}
                {product.color ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Color
                    </span>
                    <p className="text-gray-900 font-medium">{product.color}</p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Technical Properties */}
            {(product.density ||
              product.mfi ||
              product.tensileStrength ||
              product.elongationAtBreak ||
              product.shoreHardness ||
              product.waterAbsorption) ? (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Properties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.density && product.density > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">
                        Density
                      </span>
                      <p className="text-gray-900 font-medium">
                        {product.density} g/cm³
                      </p>
                    </div>
                  ) : null}
                  {product.mfi && product.mfi > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">
                        MFI
                      </span>
                      <p className="text-gray-900 font-medium">{product.mfi}</p>
                    </div>
                  ) : null}
                  {product.tensileStrength && product.tensileStrength > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">
                        Tensile Strength
                      </span>
                      <p className="text-gray-900 font-medium">
                        {product.tensileStrength} MPa
                      </p>
                    </div>
                  ) : null}
                  {product.elongationAtBreak &&
                    product.elongationAtBreak > 0 ? (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">
                          Elongation at Break
                        </span>
                        <p className="text-gray-900 font-medium">
                          {product.elongationAtBreak}%
                        </p>
                      </div>
                    ) : null}
                  {product.shoreHardness ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">
                        Shore Hardness
                      </span>
                      <p className="text-gray-900 font-medium">
                        {product.shoreHardness}
                      </p>
                    </div>
                  ) : null}
                  {product.waterAbsorption && product.waterAbsorption > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">
                        Water Absorption
                      </span>
                      <p className="text-gray-900 font-medium">
                        {product.waterAbsorption}%
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Manufacturing & Origin */}
            {(product.manufacturingMethod ||
              product.countryOfOrigin ||
              product.packagingWeight) ? (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manufacturing & Origin
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.manufacturingMethod ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">
                        Manufacturing Method
                      </span>
                      <p className="text-gray-900 font-medium">
                        {product.manufacturingMethod}
                      </p>
                    </div>
                  ) : null}
                  {product.countryOfOrigin ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">
                        Country of Origin
                      </span>
                      <p className="text-gray-900 font-medium">
                        {product.countryOfOrigin}
                      </p>
                    </div>
                  ) : null}
                  {product.packagingWeight ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">
                        Packaging Weight
                      </span>
                      <p className="text-gray-900 font-medium">
                        {product.packagingWeight}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Certifications & Features */}
            {(product.recyclable ||
              product.bioDegradable ||
              product.fdaApproved ||
              product.medicalGrade ||
              product.shelfLife) ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Certifications & Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.recyclable ? (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <span className="text-sm font-medium text-green-700">
                        Recyclable
                      </span>
                      <p className="text-green-900 font-medium">
                        Eco-friendly material
                      </p>
                    </div>
                  ) : null}
                  {product.bioDegradable ? (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <span className="text-sm font-medium text-green-700">
                        Biodegradable
                      </span>
                      <p className="text-green-900 font-medium">
                        Environmentally safe
                      </p>
                    </div>
                  ) : null}
                  {product.fdaApproved ? (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <span className="text-sm font-medium text-blue-700">
                        FDA Approved
                      </span>
                      <p className="text-blue-900 font-medium">
                        Food contact safe
                      </p>
                    </div>
                  ) : null}
                  {product.medicalGrade ? (
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <span className="text-sm font-medium text-purple-700">
                        Medical Grade
                      </span>
                      <p className="text-purple-900 font-medium">
                        Healthcare approved
                      </p>
                    </div>
                  ) : null}
                  {product.shelfLife ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-600">
                        Shelf Life
                      </span>
                      <p className="text-gray-900 font-medium">
                        {product.shelfLife}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Product Description & Applications */}
        {(product.description || product.additionalInfo) ? (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
            <div className="p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Product Overview
              </h2>

              {product.description ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              ) : null}

              {product.additionalInfo && product.additionalInfo.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.additionalInfo.map((info, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-l-4 border-blue-500 shadow-sm"
                      >
                        <h4 className="font-bold text-blue-900 mb-3 text-lg flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          {info.title}
                        </h4>
                        <p className="text-blue-800 leading-relaxed">
                          {info.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Trade Information */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
          <div className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Trade Information
            </h2>

            {/* Pricing & Terms */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pricing & Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.price && product.price > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Price
                    </span>
                    <p className="text-gray-900 font-medium">
                      ${product.price}/{product.uom}
                      {product.priceTerms ? (
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.priceTerms})
                        </span>
                      ) : null}
                    </p>
                  </div>
                ) : null}
                {((product.minimum_order_quantity &&
                  product.minimum_order_quantity > 0) ||
                  (product.minOrderQuantity &&
                    product.minOrderQuantity > 0)) ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Minimum Order Quantity
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.minimum_order_quantity ||
                        product.minOrderQuantity}{" "}
                      {product.uom}
                    </p>
                  </div>
                ) : null}
                {product.paymentTerms ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Payment Terms
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.paymentTerms.name}
                    </p>
                  </div>
                ) : null}
                {product.leadTime ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Lead Time
                    </span>
                    <p className="text-gray-900 font-medium">
                      {new Date(product.leadTime).toLocaleDateString()}
                    </p>
                  </div>
                ) : null}
                {product.incoterms && product.incoterms.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Incoterms
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.incoterms.map((term) => term.name).join(", ")}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Packaging & Storage */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Packaging & Storage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.packagingType && product.packagingType.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Packaging Type
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.packagingType
                        .map((type) => type.name)
                        .join(", ")}
                    </p>
                  </div>
                ) : null}
                {product.packagingWeight ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Packaging Weight
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.packagingWeight}
                    </p>
                  </div>
                ) : null}
                {product.storageConditions ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Storage Conditions
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.storageConditions}
                    </p>
                  </div>
                ) : null}
                {product.shelfLife ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600">
                      Shelf Life
                    </span>
                    <p className="text-gray-900 font-medium">
                      {product.shelfLife}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Industry Applications */}
            {product.industry && product.industry.length > 0 ? (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Industry Applications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.industry.map((ind, index) => (
                    <Badge
                      key={ind._id || index}
                      variant="outline"
                      className="text-blue-600 border-blue-600"
                    >
                      {ind.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Product Families */}
            {product.product_family && product.product_family.length > 0 ? (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Families
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.product_family.map((family, index) => (
                    <Badge
                      key={family._id || index}
                      variant="outline"
                      className="text-purple-600 border-purple-600"
                    >
                      {family.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Grades */}
            {product.grade && product.grade.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Grades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.grade.map((g, index) => (
                    <Badge
                      key={g._id || index}
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      {g.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Documents & Certificates */}
        {(product.safety_data_sheet ||
          product.technical_data_sheet ||
          product.certificate_of_analysis) && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
            <div className="p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Documents & Certificates
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.safety_data_sheet && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-6 h-6 text-red-600" />
                      <div>
                        <h4 className="font-semibold text-red-900">
                          Safety Data Sheet
                        </h4>
                        <p className="text-sm text-red-700">
                          {product.safety_data_sheet.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() =>
                        window.open(
                          product.safety_data_sheet?.fileUrl,
                          "_blank"
                        )
                      }
                    >
                      Download PDF
                    </Button>
                  </div>
                )}

                {product.technical_data_sheet && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-900">
                          Technical Data Sheet
                        </h4>
                        <p className="text-sm text-blue-700">
                          {product.technical_data_sheet.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() =>
                        window.open(
                          product.technical_data_sheet?.fileUrl,
                          "_blank"
                        )
                      }
                    >
                      Download PDF
                    </Button>
                  </div>
                )}

                {product.certificate_of_analysis && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-6 h-6 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-900">
                          Certificate of Analysis
                        </h4>
                        <p className="text-sm text-green-700">
                          {product.certificate_of_analysis.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-green-300 text-green-600 hover:bg-green-50"
                      onClick={() =>
                        window.open(
                          product.certificate_of_analysis?.fileUrl,
                          "_blank"
                        )
                      }
                    >
                      Download PDF
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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

        {/* Call to Action - Simplified */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mt-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Need More Information?</h2>
          <p className="text-blue-100 mb-4 max-w-xl mx-auto">
            Contact {product.createdBy?.company || "the supplier"} for detailed
            specifications, custom quotes, or bulk pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <QuoteRequestModal
              productId={product._id}
              uom={product.uom || "kg"}
              className="px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Request Quote
            </QuoteRequestModal>
            <SampleRequestModal
              productId={product._id}
              uom={product.uom || "kg"}
              className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-blue-600 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Request Sample
            </SampleRequestModal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
