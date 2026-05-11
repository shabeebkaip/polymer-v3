import { Award, Package, Share2, CheckCircle2, Clock, AlertCircle, MapPin, ShoppingCart, FileText } from 'lucide-react';
import QuoteRequestModal from '@/components/shared/QuoteRequestModal';
import SampleRequestModal from '@/components/shared/SampleRequestModal';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';
import { Product } from '@/types/product';
import { UserType } from '@/types/user';
import { FALLBACK_COMPANY_IMAGE } from '@/lib/fallbackImages';
import Link from 'next/link';

const HERO_GRADIENTS = [
  'from-emerald-600 to-teal-700',
  'from-blue-600 to-indigo-700',
  'from-violet-600 to-purple-700',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-cyan-600 to-sky-700',
];

const getHeroGradient = (id: string) => {
  const n = id ? id.charCodeAt(id.length - 1) % HERO_GRADIENTS.length : 0;
  return HERO_GRADIENTS[n];
};

const AvailabilityBadge = ({ value }: { value: string }) => {
  if (value === 'In Stock') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
    </span>
  );
  if (value === 'On Request') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
      <Clock className="w-3.5 h-3.5" /> On Request
    </span>
  );
  if (value === 'Limited') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
      <AlertCircle className="w-3.5 h-3.5" /> Limited Stock
    </span>
  );
  return null;
};

const ProductHeroSection = ({ product, user }: { product: Product; user: UserType | Record<string, unknown> }) => {
  const gradient = getHeroGradient(product._id || '');
  const hasImage = !!(product?.productImages?.length);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.productName, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const polymerTags: string[] = (product as any).polymerTypes?.filter((p: any) => p.name).map((p: any) => p.name) ||
    (product.polymerType?.name ? [product.polymerType.name] : []);

  const title = product.productName || polymerTags.join(' / ') || 'Polymer Product';
  const userType = (user as any)?.user_type;

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* ── Image gallery ── */}
      <div className="relative w-full h-72 overflow-hidden bg-gray-50">
        {hasImage ? (
          <>
            {/* Blurred backdrop — fills the space for any aspect ratio */}
            <Image
              src={product.productImages![0].fileUrl}
              alt=""
              fill
              sizes="100vw"
              className="object-cover scale-110 blur-2xl brightness-75 saturate-150 pointer-events-none"
              aria-hidden="true"
            />
            {/* Dark overlay for depth */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            {/* Actual image — contained, centred, crisp */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <Image
                src={product.productImages![0].fileUrl}
                alt={product.productName || 'Product image'}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Image count pill — bottom right */}
            {(product.productImages?.length ?? 0) > 1 && (
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm z-10">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                </svg>
                {product.productImages!.length} photos
              </div>
            )}
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-3`}>
            <Package className="w-14 h-14 text-white/70" />
            <span className="text-white/60 text-sm font-medium">No image available</span>
          </div>
        )}

        {/* Company logo — top right */}
        <div className="absolute top-3 right-3 z-10 w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center p-1.5">
          <Image
            src={(product.createdBy as any)?.company_logo || FALLBACK_COMPANY_IMAGE}
            alt="Supplier"
            width={28}
            height={28}
            className="w-full h-full object-contain"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE; }}
          />
        </div>

        {/* Availability badge — bottom left */}
        {(product as any).availability && (
          <div className="absolute bottom-3 left-4 z-10">
            <AvailabilityBadge value={(product as any).availability} />
          </div>
        )}
      </div>

      {/* Thumbnail strip — shown when multiple images */}
      {(product.productImages?.length ?? 0) > 1 && (
        <div className="flex gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {product.productImages!.map((img, i) => (
            <div key={i} className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-400 transition-colors cursor-pointer">
              <Image
                src={img.fileUrl}
                alt={`Photo ${i + 1}`}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-4">

        {/* Share button — top right of content area */}
        <div className="flex justify-end mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="border-gray-200 text-gray-400 hover:text-gray-700 h-8 w-8 p-0"
          >
            <Share2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Badges */}
        {(product.fdaApproved || product.medicalGrade) && (
          <div className="flex flex-wrap items-center gap-2 mb-3 mt-1">
            {product.fdaApproved && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                <Award className="w-3 h-3" /> FDA Approved
              </span>
            )}
            {product.medicalGrade && !product.fdaApproved && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
                <Award className="w-3 h-3" /> Medical Grade
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 leading-tight">{title}</h1>

        {/* Polymer type tags */}
        {polymerTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {polymerTags.map((tag, i) => (
              <span key={i} className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        {(product.price || product.minimum_order_quantity || product.minOrderQuantity || product.countryOfOrigin || product.leadTime || product.stock) && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 py-3 border-y border-gray-100 mb-4 text-sm">
            {product.price && product.price > 0 && (
              <div>
                <span className="text-gray-400 text-xs block">Price</span>
                <span className="font-semibold text-emerald-700">${product.price}/{product.uom}</span>
              </div>
            )}
            {(product.minimum_order_quantity || product.minOrderQuantity) && (
              <div>
                <span className="text-gray-400 text-xs block">Min Order</span>
                <span className="font-semibold text-gray-900">
                  {(product.minimum_order_quantity || product.minOrderQuantity)?.toLocaleString()} {product.uom}
                </span>
              </div>
            )}
            {typeof product.stock === 'number' && product.stock > 0 && (
              <div>
                <span className="text-gray-400 text-xs block">Stock</span>
                <span className="font-semibold text-gray-900">{product.stock.toLocaleString()} {product.uom}</span>
              </div>
            )}
            {product.leadTime && (
              <div>
                <span className="text-gray-400 text-xs block">Lead Time</span>
                <span className="font-semibold text-gray-900">{product.leadTime} days</span>
              </div>
            )}
            {product.countryOfOrigin && (
              <div className="flex items-end gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 mb-0.5" />
                <span className="font-medium text-gray-700 text-sm">{product.countryOfOrigin}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions — shown only on mobile / when sidebar hidden */}
        <div className="flex flex-wrap gap-2 lg:hidden">
          {userType === 'buyer' ? (
            <>
              <QuoteRequestModal
                productId={product._id}
                uom={product.uom || 'kg'}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Request Quote
              </QuoteRequestModal>
              <SampleRequestModal
                productId={product._id}
                uom={product.uom || 'kg'}
                className="flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-700 rounded-xl text-sm font-medium transition-all"
              >
                <FileText className="w-4 h-4" /> Request Sample
              </SampleRequestModal>
            </>
          ) : !user || !(user as any)._id ? (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all"
            >
              Sign in to enquire
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductHeroSection;
