import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QuoteRequestModal from "../shared/QuoteRequestModal";
import SampleRequestModal from "../shared/SampleRequestModal";
import { ProductCardProps } from "@/types/product";
import { FALLBACK_COMPANY_IMAGE } from "@/lib/fallbackImages";
import { MapPin, Package, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";

// Accent palette — cycles by product ID
const ACCENTS = [
  { strip: "from-emerald-500 to-teal-600", avatar: "from-emerald-500 to-teal-600" },
  { strip: "from-blue-500 to-indigo-600",  avatar: "from-blue-500 to-indigo-600"  },
  { strip: "from-violet-500 to-purple-600",avatar: "from-violet-500 to-purple-600"},
  { strip: "from-orange-400 to-amber-500", avatar: "from-orange-400 to-amber-500" },
  { strip: "from-rose-500 to-pink-600",    avatar: "from-rose-500 to-pink-600"    },
  { strip: "from-cyan-500 to-sky-600",     avatar: "from-cyan-500 to-sky-600"     },
];

const getAccent = (id: string) => {
  const n = id ? id.charCodeAt(id.length - 1) % ACCENTS.length : 0;
  return ACCENTS[n];
};

const AvailabilityBadge = ({ value }: { value: string }) => {
  if (value === "In Stock")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
        <CheckCircle2 className="w-3 h-3" /> In Stock
      </span>
    );
  if (value === "On Request")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
        <Clock className="w-3 h-3" /> On Request
      </span>
    );
  if (value === "Limited")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
        <AlertCircle className="w-3 h-3" /> Limited
      </span>
    );
  return null;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, userType }) => {
  const router = useRouter();
  const accent = getAccent(product._id || "");
  const hasImage = !!(product?.productImages?.[0]?.fileUrl);

  // Polymer tags: prefer polymerTypes array, fall back to polymerType
  const polymerTags: string[] =
    (product as any).polymerTypes?.length > 0
      ? (product as any).polymerTypes.map((p: any) => p.name || p).filter(Boolean)
      : product.polymerType?.name
      ? [product.polymerType.name]
      : [];

  const title = product.productName || polymerTags.join(" / ") || "Polymer Product";
  const availability = (product as any).availability as string | undefined;

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 hover:border-emerald-200 flex flex-col cursor-pointer"
      onClick={() => router.push(`/products/${product._id}`)}
    >
      {/* ── Image / banner area ── */}
      <div className="relative h-36 overflow-hidden">
        {hasImage ? (
          /* Real product image — fill the banner */
          <Image
            src={product.productImages![0].fileUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            onError={(e) => {
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) parent.innerHTML = `<div class="w-full h-full bg-gradient-to-r ${accent.strip} flex items-center justify-center"><svg xmlns='http://www.w3.org/2000/svg' class='w-10 h-10 text-white opacity-80' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10'/></svg></div>`;
            }}
          />
        ) : (
          /* Gradient placeholder with centred icon */
          <div className={`w-full h-full bg-gradient-to-r ${accent.strip} flex items-center justify-center`}>
            <Package className="w-10 h-10 text-white opacity-70" />
          </div>
        )}

        {/* Subtle dark scrim so overlays are readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Company logo — top-right */}
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center p-1 border border-gray-100">
          <Image
            src={product?.createdBy?.company_logo || FALLBACK_COMPANY_IMAGE}
            alt="Supplier"
            width={24}
            height={24}
            className="w-full h-full object-contain"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE; }}
          />
        </div>

        {/* Availability badge — bottom-left of image */}
        {(product as any).availability && (
          <div className="absolute bottom-2 left-3">
            <AvailabilityBadge value={(product as any).availability} />
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="pt-3 px-4 pb-4 flex flex-col flex-1">

        {/* Location meta */}
        {product.countryOfOrigin && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            {product.countryOfOrigin}
          </div>
        )}

        {/* Title */}
        <h4 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {title}
        </h4>

        {/* Polymer tags */}
        {polymerTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {polymerTags.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
            {polymerTags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                +{polymerTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Key specs */}
        <div className="space-y-1.5 mb-3 flex-1">
          {product.chemicalName && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Chemical</span>
              <span className="text-xs font-medium text-gray-700 text-right max-w-[60%] truncate">{product.chemicalName}</span>
            </div>
          )}
          {(product.minimum_order_quantity || (product as any).minOrderQuantity) && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Min Order</span>
              <span className="text-xs font-semibold text-gray-800">
                {((product.minimum_order_quantity || (product as any).minOrderQuantity) as number).toLocaleString()} {product.uom || ""}
              </span>
            </div>
          )}
          {product.price && product.price > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Price</span>
              <span className="text-xs font-semibold text-emerald-700">${product.price}/{product.uom}</span>
            </div>
          )}
        </div>

        {/* Supplier name */}
        {product.createdBy?.company && (
          <p className="text-xs text-gray-400 mb-3 truncate">
            by <span className="font-medium text-gray-600">{product.createdBy.company}</span>
          </p>
        )}

        {/* Actions */}
        <div className="space-y-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          {userType === "buyer" && (
            <div className="grid grid-cols-2 gap-1.5">
              <QuoteRequestModal
                className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-xs font-semibold text-center"
                productId={product._id}
                uom={product.uom}
              />
              <SampleRequestModal
                className="py-2 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors text-xs font-medium text-center"
                productId={product._id}
                uom={product.uom}
              />
            </div>
          )}
          <button
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 rounded-lg hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all text-xs font-medium"
            onClick={() => router.push(`/products/${product._id}`)}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
