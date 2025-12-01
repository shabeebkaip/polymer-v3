import React from 'react';
import CompanyDetails from '@/components/product/CompanyDetails';
import { useUserInfo } from '@/lib/useUserInfo';
import SampleRequestModal from '@/components/shared/SampleRequestModal';
import QuoteRequestModal from '@/components/shared/QuoteRequestModal';
import { ShoppingCart, FileText } from 'lucide-react';
import { Product, ProductDetailClientProps } from '@/types/product';
import ProductDetailBreadCrumb from '@/components/product/product-detail/ProductDetailBreadCrumb';
import ProductSummaryBar from '@/components/product/product-detail/ProductSummaryBar';
import ProductHeroSection from '@/components/product/product-detail/ProductHeroSection';
import ProductBasicInformation from '@/components/product/product-detail/ProductBasicInformation';
import ProductTechnicalProperties from '@/components/product/product-detail/ProductTechnicalProperties';
import ProductManufactureDetails from '@/components/product/product-detail/ProductManufactureDetails';
import ProductCertifications from '@/components/product/product-detail/ProductCertifications';
import ProductOverview from '@/components/product/product-detail/ProductOverview';
import ProductTradeInformation from '@/components/product/product-detail/ProductTradeInformation';
import ProductDocumentDetails from '@/components/product/product-detail/ProductDocumentDetails';

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const { user } = useUserInfo();
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
            <h2 className="text-xl font-bold text-gray-900 mb-6">Product Specifications</h2>

            {/* Basic Information */}
            <ProductBasicInformation product={product} />

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
            {product.manufacturingMethod || product.countryOfOrigin || product.packagingWeight ? (
              <ProductManufactureDetails product={product} />
            ) : null}

            {/* Certifications & Features */}
            {product.recyclable ||
            product.bioDegradable ||
            product.fdaApproved ||
            product.medicalGrade ||
            product.shelfLife ? (
              <ProductCertifications product={product} />
            ) : null}
          </div>
        </div>

        {/* Product Description & Applications */}
        {product.description || product.additionalInfo ? (
          <ProductOverview product={product} />
        ) : null}

        {/* Trade Information */}
        <ProductTradeInformation product={product} />

        {/* Documents & Certificates */}
        {(product.safety_data_sheet ||
          product.technical_data_sheet ||
          product.certificate_of_analysis ||
          (product.fdaApproved && product.fdaCertificate && product.fdaCertificate.id) ||
          (product.medicalGrade && product.medicalCertificate && product.medicalCertificate.id) ||
          (product.certificates && product.certificates.length > 0)) && <ProductDocumentDetails product={product} />}

        {/* Company Details Card - Moved down */}
        {product.createdBy && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 lg:p-8 mb-8">
            <CompanyDetails
              companyDetails={product.createdBy}
              productId={product?._id}
              product={product}
              uom={product.uom || 'kilogram'}
              userType={user?.user_type}
            />
          </div>
        )}

        {/* Call to Action - Brand Greenish */}
        <div className="bg-primary-500 rounded-2xl p-6 mt-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Need More Information?</h2>
          <p className="text-white/80 mb-4 max-w-xl mx-auto">
            Contact {product.createdBy?.company || 'the supplier'} for detailed specifications,
            custom quotes, or bulk pricing.
          </p>
          {user?.user_type === 'buyer' && (
            <div className="flex flex-wrap justify-center gap-3">
              <QuoteRequestModal
                productId={product._id}
                uom={product.uom || 'kg'}
                className="px-6 py-3 bg-white text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all flex items-center gap-2 shadow"
              >
                <ShoppingCart className="w-5 h-5" />
                Request Quote
              </QuoteRequestModal>
              <SampleRequestModal
                productId={product._id}
                uom={product.uom || 'kg'}
                className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-primary-600 rounded-lg font-medium transition-all flex items-center gap-2 shadow"
              >
                <FileText className="w-5 h-5" />
                Request Sample
              </SampleRequestModal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
