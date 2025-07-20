import React from "react";
import CompanyDetails from "@/components/product/CompanyDetails";
import { useUserInfo } from "@/lib/useUserInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SampleRequestModal from "@/components/shared/SampleRequestModal";
import QuoteRequestModal from "@/components/shared/QuoteRequestModal";
import {
  ShoppingCart,
  Award,
  FileText,
} from "lucide-react";
import { Product } from "@/types/product";
import ProductDetailBreadCrumb from "@/components/product/product-detail/ProductDetailBreadCrumb";
import ProductSummaryBar from "@/components/product/product-detail/ProductSummaryBar";
import ProductHeroSection from "@/components/product/product-detail/ProductHeroSection";
import ProductBasicInformation from "@/components/product/product-detail/ProductBasicInformation";
import ProductTechnicalProperties from "@/components/product/product-detail/ProductTechnicalProperties";

interface ProductDetailClientProps {
  product: Product;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
}) => {
  const { user } = useUserInfo();




  // Handler for chat button


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <ProductDetailBreadCrumb product={product} />

      {/* Quick Product Summary Bar */}
      <ProductSummaryBar product={product} />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - Simplified */}
          <ProductHeroSection product={product} user={user ?? {}} />

        {/* Product Specifications - Organized */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
          <div className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Product Specifications
            </h2>

            {/* Basic Information */}
            <ProductBasicInformation product={  product } />

            {/* Technical Properties */}
            {product.density ||
            product.mfi ||
            product.tensileStrength ||
            product.elongationAtBreak ||
            product.shoreHardness ||
            product.waterAbsorption ? (
              <ProductTechnicalProperties product={product} />
            ) : null}

            {/* Manufacturing & Origin */}
            {product.manufacturingMethod ||
            product.countryOfOrigin ||
            product.packagingWeight ? (
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
            {product.recyclable ||
            product.bioDegradable ||
            product.fdaApproved ||
            product.medicalGrade ||
            product.shelfLife ? (
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
        {product.description || product.additionalInfo ? (
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
                {(product.minimum_order_quantity &&
                  product.minimum_order_quantity > 0) ||
                (product.minOrderQuantity && product.minOrderQuantity > 0) ? (
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
                      {product.leadTime}
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
