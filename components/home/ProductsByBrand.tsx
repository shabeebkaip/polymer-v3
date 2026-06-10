"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { useUserInfo } from "@/lib/useUserInfo";
import { useSharedState } from "@/stores/sharedStore";
import { ProductCardTypes } from "@/types/product";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type EnrichedProduct = ProductCardTypes & {
  supplierName: string;
  supplierLogo: string;
};

const ProductTile: React.FC<{ product: EnrichedProduct; onClick: () => void }> = ({
  product,
  onClick,
}) => {
  const rawImage = product.productImages?.[0];
  const imageUrl = typeof rawImage === "string" ? rawImage : rawImage?.fileUrl ?? null;
  const polymerType = product.polymerType?.name;
  const hasPrice = typeof product.price === "number" && product.price > 0;
  const hasMOQ =
    typeof product.minimum_order_quantity === "number" &&
    product.minimum_order_quantity > 0;

  const supplierInitials =
    product.supplierName
      .replace(/[-_]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w: string) => w[0])
      .join("")
      .toUpperCase() || "S";

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col text-left bg-white rounded-3xl border border-gray-100 hover:border-primary-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_-12px_rgba(19,111,71,0.18)] transition-all duration-500 overflow-hidden h-full w-full"
    >
      {/* Image area — fixed height for consistency across cards */}
      <div className="relative h-52 w-full bg-gradient-to-br from-gray-50 via-white to-primary-50/40 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.productName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-primary-200">
              <Package className="w-14 h-14" strokeWidth={1.25} />
              <span className="text-[10px] font-medium uppercase tracking-widest">
                {polymerType || "Polymer"}
              </span>
            </div>
          </div>
        )}

        {/* Subtle dark gradient for badge legibility */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />

        {/* Polymer type chip */}
        {polymerType && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-semibold text-gray-800 shadow-sm">
              <Sparkles className="w-3 h-3 text-primary-500" />
              {polymerType}
            </span>
          </div>
        )}

        {/* Availability dot */}
        {product.availability && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/95 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-700 shadow-sm uppercase tracking-wider">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              In Stock
            </span>
          </div>
        )}

        {/* Hover arrow */}
        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 text-primary-600" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-[15px] line-clamp-1 group-hover:text-primary-700 transition-colors">
            {product.productName}
          </h3>
          {product.chemicalName && (
            <p className="text-[13px] text-gray-500 line-clamp-1 mt-0.5">
              {product.chemicalName}
            </p>
          )}
        </div>

        {/* Meta row */}
        {(product.countryOfOrigin || hasMOQ || hasPrice) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-gray-500">
            {product.countryOfOrigin && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                {product.countryOfOrigin}
              </span>
            )}
            {hasMOQ && (
              <span className="inline-flex items-center gap-1">
                <Package className="w-3 h-3 text-gray-400" />
                Min {product.minimum_order_quantity} {product.uom}
              </span>
            )}
            {hasPrice && (
              <span className="ml-auto font-semibold text-primary-700 text-[13px]">
                ${product.price}
                <span className="text-gray-400 font-normal">/{product.uom}</span>
              </span>
            )}
          </div>
        )}

        {/* Supplier strip */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-2.5">
          {product.supplierLogo ? (
            <div className="w-7 h-7 rounded-full overflow-hidden bg-white ring-1 ring-gray-100 flex items-center justify-center flex-shrink-0">
              <Image
                src={product.supplierLogo}
                alt={product.supplierName}
                width={28}
                height={28}
                className="object-contain w-full h-full"
              />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
              {supplierInitials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-none">
              Supplier
            </p>
            <p className="text-[12px] font-semibold text-gray-700 truncate leading-tight mt-0.5">
              {product.supplierName}
            </p>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        </div>
      </div>
    </button>
  );
};

const SkeletonTile: React.FC = () => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
    <div className="aspect-[5/4] w-full bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
      </div>
      <div className="pt-3 border-t border-gray-100 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded animate-pulse flex-1" />
      </div>
    </div>
  </div>
);

const ProductsByBrand: React.FC = () => {
  const { user } = useUserInfo();
  const { sellersLoading, sellers } = useSharedState();
  const router = useRouter();

  const allProducts = useMemo<EnrichedProduct[]>(() => {
    if (!sellers) return [];
    return sellers.flatMap((seller: any) =>
      (seller.products || []).map((p: ProductCardTypes) => ({
        ...p,
        supplierName:
          seller.company?.trim() ||
          seller.name?.trim() ||
          p.createdBy?.company ||
          "Supplier",
        supplierLogo: seller.company_logo || p.createdBy?.company_logo || "",
      }))
    );
  }, [sellers]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selectedSnap, setSelectedSnap] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setSelectedSnap(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, allProducts.length]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  const handleProductClick = useCallback(
    (product: EnrichedProduct) => {
      if (!user) {
        router.push(`/auth/login?redirect=/products/${product._id}`);
      } else {
        router.push(`/products/${product._id}`);
      }
    },
    [user, router]
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white py-16 md:py-20 lg:py-24">
      {/* Soft decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-primary-100 rounded-full text-primary-700 text-xs font-semibold uppercase tracking-widest mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            Verified Suppliers
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight">
            Browse Products by{" "}
            <span className="text-primary-600">Top Suppliers</span>
          </h2>
          <p className="mt-4 text-gray-500 text-base md:text-lg leading-relaxed">
            Discover premium polymer products from our network of trusted
            manufacturers across Saudi Arabia and the GCC region.
          </p>
        </div>

        {/* Carousel */}
        {sellersLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonTile key={i} />
            ))}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            Products coming soon
          </div>
        ) : (
          <div className="relative">
            {/* Desktop side arrows */}
            <button
              onClick={prev}
              disabled={!canPrev}
              className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg ring-1 ring-gray-100 items-center justify-center text-gray-600 hover:text-primary-600 hover:scale-105 transition-all disabled:opacity-0 disabled:pointer-events-none"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={!canNext}
              className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg ring-1 ring-gray-100 items-center justify-center text-gray-600 hover:text-primary-600 hover:scale-105 transition-all disabled:opacity-0 disabled:pointer-events-none"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Embla viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex items-stretch -ml-5">
                {allProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0 pl-5"
                  >
                    <ProductTile
                      product={product}
                      onClick={() => handleProductClick(product)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dot indicators */}
        {!sellersLoading && snaps.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              disabled={!canPrev}
              className="md:hidden w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {snaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === selectedSnap
                      ? "w-8 h-2 bg-primary-600"
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              disabled={!canNext}
              className="md:hidden w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 md:mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Ready to Explore More?
          </h3>
          <p className="mt-2 text-gray-500 text-base md:text-lg max-w-xl mx-auto">
            Discover thousands of polymer products from verified suppliers
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
            <button
              onClick={() => router.push("/products")}
              className="group inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 rounded-full font-semibold shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all"
            >
              View All Products
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/suppliers")}
              className="inline-flex items-center gap-2 bg-white text-gray-700 hover:text-primary-700 border border-gray-200 hover:border-primary-300 px-7 py-3.5 rounded-full font-semibold transition-all"
            >
              Browse Suppliers
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsByBrand;
