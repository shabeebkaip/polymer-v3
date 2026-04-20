import React from 'react';
import CompanyDetails from '@/components/product/CompanyDetails';
import { useUserInfo } from '@/lib/useUserInfo';
import SampleRequestModal from '@/components/shared/SampleRequestModal';
import QuoteRequestModal from '@/components/shared/QuoteRequestModal';
import {
  ShoppingCart, FileText, AlertTriangle, ArrowRight,
  CheckCircle2, FileDown, Layers
} from 'lucide-react';
import { ProductDetailClientProps } from '@/types/product';
import ProductDetailBreadCrumb from '@/components/product/product-detail/ProductDetailBreadCrumb';
import ProductHeroSection from '@/components/product/product-detail/ProductHeroSection';
import ProductBasicInformation from '@/components/product/product-detail/ProductBasicInformation';
import ProductTechnicalProperties from '@/components/product/product-detail/ProductTechnicalProperties';
import ProductManufactureDetails from '@/components/product/product-detail/ProductManufactureDetails';
import ProductCertifications from '@/components/product/product-detail/ProductCertifications';
import ProductOverview from '@/components/product/product-detail/ProductOverview';
import ProductTradeInformation from '@/components/product/product-detail/ProductTradeInformation';
import ProductDocumentDetails from '@/components/product/product-detail/ProductDocumentDetails';
import Link from 'next/link';

// ── Content presence helpers ────────────────────────────────────────────────

const hasBasicInfoContent = (product: any) =>
  (product.productType || product.polymerType?.name) ||
  product.tradeName || product.chemicalName ||
  product.chemicalFamily?.name || product.physicalForm?.name || product.color;

const hasTechContent = (product: any) =>
  product.density || product.mfi || product.tensileStrength ||
  product.elongationAtBreak || product.shoreHardness || product.waterAbsorption;

const hasManufactureContent = (product: any) =>
  product.manufacturingMethod || product.countryOfOrigin || product.packagingWeight;

const hasCertContent = (product: any) =>
  product.recyclable || product.bioDegradable || product.fdaApproved ||
  product.medicalGrade || product.shelfLife;

const hasOverviewContent = (product: any) =>
  product.description || (product.additionalInfo?.length > 0);

const hasTradeContent = (product: any) =>
  (product.price && product.price > 0) ||
  product.minimum_order_quantity || product.minOrderQuantity ||
  product.paymentTerms?.name || product.leadTime ||
  product.incoterms?.some((t: any) => t.name) ||
  product.packagingType?.some((t: any) => t.name) ||
  product.storageConditions || product.shelfLife ||
  product.industry?.some((t: any) => t.name) ||
  product.product_family?.some((t: any) => t.name) ||
  product.grade?.some((t: any) => t.name);

const hasDocsContent = (product: any) =>
  product.safety_data_sheet?.fileUrl || product.technical_data_sheet?.fileUrl ||
  product.certificate_of_analysis?.fileUrl ||
  (product.fdaApproved && product.fdaCertificate?.id) ||
  (product.medicalGrade && product.medicalCertificate?.id) ||
  (product.certificates?.length > 0);

// Completion score (0-100) for seller nudge
const getCompletionScore = (product: any) => {
  const checks = [
    !!(product.productName),
    !!(product.chemicalName),
    !!(product.chemicalFamily?.name),
    !!(product.polymerType?.name || product.polymerTypes?.length > 0),
    !!(product.physicalForm?.name),
    !!(product.productImages?.length > 0),
    !!(product.price && product.price > 0),
    !!(product.minimum_order_quantity),
    !!(product.incoterms?.some((t: any) => t.name)),
    !!(product.description),
    !!(product.industry?.some((t: any) => t.name)),
    !!(product.safety_data_sheet?.fileUrl || product.technical_data_sheet?.fileUrl),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

// ── Component ────────────────────────────────────────────────────────────────

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const { user } = useUserInfo();
  const isOwner = user && product.createdBy &&
    (user as any)._id === (product.createdBy as any)._id;
  const completionScore = getCompletionScore(product);
  const isQuickAdd = product.completionStatus === 'quick' || completionScore < 50;

  // Polymer type tags from polymerTypes array or fallback
  const polymerTags: string[] =
    (product as any).polymerTypes?.filter((p: any) => p.name).map((p: any) => p.name) ||
    (product.polymerType?.name ? [product.polymerType.name] : []);

  // Has any spec content beyond just polymer types
  const hasAnySpecContent =
    hasBasicInfoContent(product) || hasTechContent(product) || hasManufactureContent(product);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetailBreadCrumb product={product} />

      {/* ── Seller completion banner ── */}
      {isOwner && isQuickAdd && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Your listing is {completionScore}% complete
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Products with complete details get <strong>3× more enquiries</strong>. Add images, pricing, certifications and more.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${completionScore}%` }} />
                  </div>
                  <span className="text-xs font-bold text-amber-700">{completionScore}%</span>
                </div>
                <Link
                  href={`/user/products/${product._id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Complete Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Hero */}
            <ProductHeroSection product={product} user={user ?? {}} />

            {/* Material Types — always show if polymerTypes exist */}
            {polymerTags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border p-5 lg:p-6">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Material Types
                </h2>
                <div className="flex flex-wrap gap-2">
                  {polymerTags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overview / Description */}
            {hasOverviewContent(product) && <ProductOverview product={product} />}

            {/* Product Details — basic info */}
            {hasBasicInfoContent(product) && (
              <div className="bg-white rounded-2xl shadow-sm border p-5 lg:p-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">Product Details</h2>
                <ProductBasicInformation product={product} />
              </div>
            )}

            {/* Technical Properties */}
            {hasTechContent(product) && (
              <div className="bg-white rounded-2xl shadow-sm border p-5 lg:p-6">
                <ProductTechnicalProperties product={product} />
              </div>
            )}

            {/* Manufacturing & Origin */}
            {hasManufactureContent(product) && (
              <div className="bg-white rounded-2xl shadow-sm border p-5 lg:p-6">
                <ProductManufactureDetails product={product} />
              </div>
            )}

            {/* Certifications */}
            {hasCertContent(product) && (
              <div className="bg-white rounded-2xl shadow-sm border p-5 lg:p-6">
                <ProductCertifications product={product} />
              </div>
            )}

            {/* Trade Information */}
            {hasTradeContent(product) && <ProductTradeInformation product={product} />}

            {/* Documents */}
            {hasDocsContent(product) && <ProductDocumentDetails product={product} />}

            {/* Empty state — buyers viewing a quick-add with no content */}
            {!isOwner && isQuickAdd && !hasAnySpecContent && !hasOverviewContent(product) && (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">Detailed specifications coming soon</p>
                <p className="text-xs text-gray-400">
                  Contact the supplier directly to get full technical details, pricing, and samples.
                </p>
              </div>
            )}

            {/* Supplier */}
            {product.createdBy && (
              <div className="bg-white rounded-2xl shadow-sm border p-5 lg:p-6">
                <CompanyDetails
                  companyDetails={product.createdBy}
                  productId={product._id}
                  product={product}
                  uom={product.uom || 'Metric Ton'}
                  userType={(user as any)?.user_type}
                />
              </div>
            )}
          </div>

          {/* ── Sticky sidebar ── */}
          <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 space-y-4">

            {/* Action Card */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4">
                <h3 className="font-bold text-white text-sm mb-1">
                  {isQuickAdd ? 'Interested in this material?' : 'Ready to order?'}
                </h3>
                <p className="text-emerald-100 text-xs leading-relaxed">
                  {isQuickAdd
                    ? 'Contact the supplier for pricing, samples, and full specs.'
                    : `Get a custom quote from ${product.createdBy?.company || 'the supplier'}.`}
                </p>
              </div>

              <div className="p-4 space-y-2">
                {(user as any)?.user_type === 'buyer' ? (
                  <>
                    <QuoteRequestModal
                      productId={product._id}
                      uom={product.uom || 'kg'}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" /> Request Quote
                    </QuoteRequestModal>
                    <SampleRequestModal
                      productId={product._id}
                      uom={product.uom || 'kg'}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-700 rounded-xl text-sm font-medium transition-all"
                    >
                      <FileText className="w-4 h-4" /> Request Sample
                    </SampleRequestModal>
                  </>
                ) : (
                  <p className="text-center text-xs text-gray-500 py-2">
                    <Link href="/auth/login" className="text-emerald-600 font-medium hover:underline">Sign in</Link> as a buyer to send enquiries
                  </p>
                )}
              </div>

              {/* Quick stats strip */}
              {((product as any).availability || product.minimum_order_quantity || product.minOrderQuantity || product.leadTime) && (
                <div className="border-t border-gray-100 px-4 py-3 flex gap-2 flex-wrap">
                  {(product as any).availability && (
                    <div className={`flex-1 text-center px-2 py-1.5 rounded-lg text-xs font-semibold ${
                      (product as any).availability === 'In Stock' ? 'bg-emerald-50 text-emerald-700' :
                      (product as any).availability === 'Limited' ? 'bg-amber-50 text-amber-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {(product as any).availability}
                    </div>
                  )}
                  {(product.minimum_order_quantity || product.minOrderQuantity) && (
                    <div className="flex-1 text-center px-2 py-1.5 rounded-lg bg-gray-50 text-xs text-gray-600">
                      <span className="font-semibold block">
                        {(product.minimum_order_quantity || product.minOrderQuantity)?.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-[10px]">{product.uom || 'MOQ'}</span>
                    </div>
                  )}
                  {product.leadTime && (
                    <div className="flex-1 text-center px-2 py-1.5 rounded-lg bg-gray-50 text-xs text-gray-600">
                      <span className="font-semibold block">{product.leadTime}</span>
                      <span className="text-gray-400 text-[10px]">days</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product List download */}
            {(product as any).productListFile?.fileUrl && (
              <a
                href={(product as any).productListFile.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-white rounded-2xl shadow-sm border p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <FileDown className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                    Download Product List
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {(product as any).productListFile.originalFilename || 'Product catalogue'}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 shrink-0 transition-colors" />
              </a>
            )}

            {/* Owner completion checklist */}
            {isOwner && isQuickAdd && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-700 mb-3">What to add next</p>
                <div className="space-y-2">
                  {[
                    { label: 'Product images', done: !!(product.productImages?.length) },
                    { label: 'Price & trade terms', done: !!(product.price && product.price > 0) },
                    { label: 'Chemical details', done: !!(product.chemicalName && product.chemicalFamily?.name) },
                    { label: 'Description', done: !!product.description },
                    { label: 'Documents / certs', done: hasDocsContent(product) },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${done ? 'text-emerald-500' : 'text-gray-200'}`} />
                      <span className={`text-xs ${done ? 'text-gray-400 line-through' : 'text-gray-600'}`}>{label}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/user/products/${product._id}`}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Complete Listing <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
