"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getIndustryList } from "@/apiServices/shared";
import * as LucideIcons from "lucide-react";
import { BarChart2, Package, Users, Globe, ArrowRight, Factory } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { IndustryItem } from "@/types/industries";

const STATS = [
  { icon: BarChart2, value: "25+", label: "Industries Served" },
  { icon: Package, value: "12K+", label: "Polymer Products" },
  { icon: Users, value: "500+", label: "Trusted Suppliers" },
  { icon: Globe, value: "40+", label: "Countries Worldwide" },
];

const BRANDS = ["sabic", "BASF", "Dow", "ExxonMobil", "LyondellBasell"];

/* ── Industry card for this page only ── */
const IndustryCard: React.FC<{ industry: IndustryItem }> = ({ industry }) => {
  const router = useRouter();

  const IconComponent =
    industry.icon && industry.icon in LucideIcons
      ? (LucideIcons as unknown as Record<string, React.ElementType>)[industry.icon]
      : null;

  return (
    <button
      onClick={() => router.push(`/products?industry=${industry._id}`)}
      className="group relative w-full text-left rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Top colour band */}
      <div className="relative h-32 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

        {/* Background image if available */}
        {industry.bg && (
          <Image
            src={industry.bg}
            alt={industry.name}
            fill
            sizes="300px"
            className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
          />
        )}

        {/* Icon */}
        <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          {IconComponent ? (
            <IconComponent className="w-7 h-7 text-white" strokeWidth={1.5} />
          ) : (
            <Factory className="w-7 h-7 text-white" strokeWidth={1.5} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {industry.name}
        </h3>
        <div className="flex items-center gap-1 text-primary-500 text-xs font-semibold mt-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          Explore <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </button>
  );
};

/* ── Page ── */
const Page: React.FC = () => {
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIndustryList()
      .then((response) => {
        setIndustries(response?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching industries:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[calc(100vh-120px)] py-12 lg:py-0">

            {/* Left column */}
            <div className="flex flex-col gap-6 z-10">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500 bg-white text-primary-600 text-[11px] font-bold uppercase tracking-widest w-fit">
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                Industries We Serve
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.1] text-gray-900">
                Advanced Polymer<br />
                Solutions for Every<br />
                <span className="text-primary-500">Industry</span>
              </h1>

              {/* Description */}
              <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                Powering innovation across industries with high-performance
                polymer materials and chemical solutions.<br />
                Built for today. Ready for tomorrow.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="#industries"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
                >
                  Explore Industries <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
                >
                  View All Products <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="border border-gray-200 rounded-xl p-3 flex flex-col gap-1.5"
                  >
                    <Icon className="w-4 h-4 text-primary-500" />
                    <span className="text-lg font-extrabold text-primary-600">{value}</span>
                    <span className="text-[11px] text-gray-500 leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* Trusted by */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Trusted by Industry Leaders
                </p>
                <div className="flex flex-wrap items-center gap-5">
                  {BRANDS.map((brand) => (
                    <span
                      key={brand}
                      className="text-gray-400 font-bold text-sm tracking-tight"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — hero image */}
            <div className="relative h-[380px] lg:h-[620px] w-full">
              <Image
                src="/industries-bg.png"
                alt="Industries served by Polymers Hub"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Industries Grid ── */}
      <section id="industries" className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Industries</h2>
          <p className="text-gray-600">
            Click on any industry to discover specific products, applications, and solutions designed for that sector.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Skeleton className="w-full h-32 rounded-t-2xl" />
                <Skeleton className="h-10 rounded-b-2xl" />
              </div>
            ))}
          </div>
        ) : industries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {industries.map((industry) => (
              <IndustryCard key={industry._id} industry={industry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Factory className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Industries Available</h3>
            <p className="text-gray-600">Industries data is currently being updated. Please check back later.</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary-500 rounded-2xl p-8 mt-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{"Don't See Your Industry?"}</h2>
          <p className="text-primary-50 mb-6 max-w-2xl mx-auto">
            {"We work with many specialized industries and can develop custom solutions for your unique requirements. Contact us to discuss your specific needs."}
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            Contact Our Experts
          </button>
        </div>
      </section>
    </div>
  );
};

export default Page;
