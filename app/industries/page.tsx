"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getIndustryList } from "@/apiServices/shared";
import { Skeleton } from "@/components/ui/skeleton";
import { IndustryItem } from "@/types/industries";
import {
  BarChart2,
  Package,
  Users,
  Globe,
  ArrowRight,
  Factory,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Minus,
  Wind,
  Thermometer,
  Cable,
  Syringe,
  Monitor,
  Box,
  Settings,
} from "lucide-react";

/* ── Static data ── */
const STATS = [
  { icon: BarChart2, value: "25+", label: "Industries Served" },
  { icon: Package, value: "12K+", label: "Polymer Products" },
  { icon: Users, value: "500+", label: "Trusted Suppliers" },
  { icon: Globe, value: "40+", label: "Countries Worldwide" },
];

const APPLICATIONS = [
  { icon: Layers, label: "Injection Molding" },
  { icon: Minus, label: "Extrusion" },
  { icon: Wind, label: "Blow Molding" },
  { icon: Thermometer, label: "Thermoforming" },
  { icon: Cable, label: "Cable Insulation" },
  { icon: Syringe, label: "Medical Tubing" },
  { icon: Package, label: "Flexible Packaging" },
  { icon: Monitor, label: "Consumer Electronics" },
];

const MATERIAL_TAGS = [
  "Polyethylene (PE)",
  "Polypropylene (PP)",
  "Engineering Plastics",
  "Elastomers (TPE)",
  "Bioplastics",
  "Recycled Materials",
];

const PROCESS_STEPS = [
  { icon: Box, label: "Raw Materials" },
  { icon: Settings, label: "Compounding & Blending" },
  { icon: ArrowRight, label: "Extrusion & Processing" },
  { icon: Factory, label: "Manufacturing & Molding" },
  { icon: Package, label: "End Use Applications" },
];

const BRANDS = [
  { name: "sabic", sub: "" },
  { name: "BASF", sub: "We create chemistry" },
  { name: "Dow", sub: "" },
  { name: "lyondellbasell", sub: "" },
  { name: "ExxonMobil", sub: "" },
  { name: "Covestro", sub: "" },
];

const INNOVATION_BULLETS = [
  "High strength & durability",
  "Lightweight & energy efficient",
  "Chemical & corrosion resistance",
  "Design flexibility & cost efficiency",
];

/* ── Page ── */
const Page: React.FC = () => {
  const router = useRouter();
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
    <div className="bg-white">
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden h-[calc(100dvh-64px)] md:h-[calc(100dvh-120px)]"
        style={{
          backgroundImage: 'url(/industries-bg.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }}
      >
        {/* White gradient — keeps left content readable over bg image */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent pointer-events-none z-0" />

        <div className="relative z-10 h-full container mx-auto px-4 lg:px-8 flex flex-col justify-center">
          <div className="flex flex-col gap-6 lg:w-[48%] py-12 lg:py-0">

            {/* Left column — vertically centred */}
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
              <p className="text-gray-500 text-base leading-relaxed max-w-md">
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

              {/* Stats row */}
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
                <div className="flex flex-wrap items-center gap-6">
                  {BRANDS.map((brand) => (
                    <span key={brand.name} className="text-gray-400 font-bold text-sm tracking-tight leading-none">
                      {brand.name}
                      {brand.sub && <span className="block text-[9px] font-normal">{brand.sub}</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — EXPLORE INDUSTRIES
      ═══════════════════════════════════════════════════════════ */}
      <section id="industries" className="container mx-auto px-4 lg:px-8 py-16">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Explore Industries
            </h2>
            <p className="text-gray-600 max-w-md">
              Discover solutions tailored for your sector&apos;s unique challenges and opportunities.
            </p>
          </div>
          <a
            href="#industries"
            className="inline-flex items-center gap-2 border border-primary-600 text-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
          >
            View All Industries <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {loading ? (
          /* Loading skeleton */
          <div className="flex flex-col gap-4">
            {/* Row 1 skeleton */}
            <div className="flex flex-col lg:flex-row gap-4">
              <Skeleton className="w-full lg:w-[45%] min-h-[320px] rounded-2xl" />
              <div className="flex flex-col gap-4 flex-1">
                <Skeleton className="h-[152px] rounded-2xl" />
                <Skeleton className="h-[152px] rounded-2xl" />
              </div>
            </div>
            {/* Row 2 skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[100px] rounded-xl" />
              ))}
            </div>
          </div>
        ) : industries.length > 0 ? (
          <div className="flex flex-col gap-4">

            {/* Row 1: featured + 2 medium cards */}
            <div className="flex flex-col lg:flex-row gap-4">

              {/* Featured card (industries[0]) */}
              {industries[0] && (
                <button
                  onClick={() => router.push(`/products?industry=${industries[0]._id}`)}
                  className="group relative w-full lg:w-[45%] min-h-[320px] rounded-2xl overflow-hidden text-left cursor-pointer"
                >
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                  {industries[0].bg && (
                    <Image
                      src={industries[0].bg}
                      alt={industries[0].name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-300"
                    />
                  )}
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Featured badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-primary-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Featured
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-white/30">
                      <Factory className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-white font-bold text-2xl mb-1 leading-tight">
                      {industries[0].name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      Advanced polymer solutions engineered for {industries[0].name.toLowerCase()} sector performance.
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-white text-sm font-semibold group-hover:gap-2.5 transition-all">
                      Explore Industry <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              )}

              {/* Medium cards stacked (industries[1] and industries[2]) */}
              <div className="flex flex-col gap-4 flex-1">
                {[industries[1], industries[2]].map((industry, idx) =>
                  industry ? (
                    <button
                      key={industry._id}
                      onClick={() => router.push(`/products?industry=${industry._id}`)}
                      className="group relative w-full bg-white border border-gray-200 rounded-2xl p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-h-[152px] flex flex-col justify-between overflow-hidden"
                    >
                      {industry.bg && (
                        <Image
                          src={industry.bg}
                          alt={industry.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 27vw"
                          className="object-cover opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                        />
                      )}
                      <div className="relative z-10">
                        <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 mb-3">
                          <Factory className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-primary-600 transition-colors">
                          {industry.name}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          Tailored polymer solutions for the {industry.name.toLowerCase()} industry.
                        </p>
                      </div>
                      <span className="relative z-10 inline-flex items-center gap-1 text-primary-600 text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                        Explore Industry <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ) : (
                    <div key={idx} className="flex-1" />
                  )
                )}
              </div>
            </div>

            {/* Row 2: 4 small horizontal cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[industries[3], industries[4], industries[5], industries[6]].map((industry, idx) =>
                industry ? (
                  <button
                    key={industry._id}
                    onClick={() => router.push(`/products?industry=${industry._id}`)}
                    className="group flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 shrink-0 mt-0.5">
                      <Factory className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-primary-600 transition-colors truncate">
                        {industry.name}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-2">
                        Polymer solutions for {industry.name.toLowerCase()}.
                      </p>
                      <span className="inline-flex items-center gap-1 text-primary-600 text-xs font-semibold group-hover:gap-1.5 transition-all">
                        Explore Industry <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ) : (
                  <div key={idx} />
                )
              )}
            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-2 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === 0 ? "bg-primary-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Factory className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Industries Available</h3>
            <p className="text-gray-600">Industries data is currently being updated. Please check back later.</p>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — INNOVATION (full-width two-column)
      ═══════════════════════════════════════════════════════════ */}
      <section className="w-full flex flex-col lg:flex-row">

        {/* Left half — innovation image */}
        <div
          className="w-full lg:w-1/2 min-h-[480px]"
          style={{
            backgroundImage: 'url(/industries/innovation.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        {/* Right half — content */}
        <div className="relative w-full lg:w-1/2 bg-white p-12 lg:p-16 flex flex-col justify-center overflow-hidden">
          {/* Decorative polymer elements */}
          <img
            src="/globe-network.png"
            alt=""
            aria-hidden="true"
            className="absolute -top-8 -right-8 w-48 h-48 opacity-10 pointer-events-none select-none"
          />
          <img
            src="/hero_element_2.svg"
            alt=""
            aria-hidden="true"
            className="absolute bottom-4 right-4 w-32 h-32 opacity-10 pointer-events-none select-none"
          />

          <div className="relative z-10 max-w-xl">
            <p className="text-primary-600 text-xs font-bold uppercase tracking-widest mb-4">
              Industry Solutions
            </p>

            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
              Driving{" "}
              <span className="text-primary-500">Innovation</span>{" "}
              Across Key Industries
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Our polymer materials help industries improve performance, reduce weight,
              enhance safety and achieve sustainability goals.
            </p>

            <ul className="flex flex-col gap-3 mb-8">
              {INNOVATION_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
                  <span className="text-gray-700 text-sm font-medium">{bullet}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              View Solutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — APPLICATIONS & MATERIALS
      ═══════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left column — Applications */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Applications Across Industries
            </h2>

            {/* Application icons grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {APPLICATIONS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 border border-gray-200 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
                  <span className="text-[10px] text-gray-600 text-center leading-tight font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Material categories */}
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              Polymer Material Categories
            </h3>
            <div className="flex flex-wrap gap-2 mb-5">
              {MATERIAL_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="border border-gray-300 rounded-full text-xs px-3 py-1 text-gray-600 hover:border-primary-400 hover:text-primary-600 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-primary-600 text-sm font-semibold hover:gap-2.5 transition-all"
            >
              View All Materials <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right column — Process flow */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              From Material to Solution
            </h2>

            {/* 5-step horizontal flow */}
            <div className="flex items-start gap-1 mb-8 overflow-x-auto pb-2">
              {PROCESS_STEPS.map(({ icon: Icon, label }, idx) => (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center gap-2 min-w-[60px]">
                    <div className="w-10 h-10 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary-600" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] text-gray-600 text-center leading-tight font-medium w-14">
                      {label}
                    </span>
                  </div>
                  {idx < PROCESS_STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-300 mt-3 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              End-to-end polymer solutions with consistent quality, technical expertise
              and global supply chain support.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-primary-600 text-sm font-semibold hover:gap-2.5 transition-all"
            >
              Learn More About Our Process <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — TRUSTED BY
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          Trusted by Industry Leaders Worldwide
        </h2>

        <div className="relative flex items-center justify-center gap-2">
          {/* Left arrow */}
          <button
            className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Brand logos row */}
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide flex-1 max-w-4xl">
            {BRANDS.map(({ name, sub }) => (
              <div
                key={name}
                className="flex-shrink-0 flex flex-col items-center justify-center px-8 border-r border-gray-100 last:border-r-0"
              >
                <span
                  className={`font-bold text-gray-600 leading-tight ${
                    name === "Dow"
                      ? "text-2xl"
                      : name === "BASF" || name === "ExxonMobil"
                      ? "text-lg"
                      : "text-base"
                  } ${name === "sabic" ? "text-primary-700" : ""}`}
                >
                  {name}
                </span>
                {sub && (
                  <span className="text-[10px] text-gray-400 mt-0.5">{sub}</span>
                )}
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — CTA BANNER
      ═══════════════════════════════════════════════════════════ */}
      <div className="px-4 lg:px-8 mb-8">
        <div className="bg-primary-700 rounded-2xl p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

            {/* Left — text */}
            <div className="max-w-xl">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-snug">
                Ready to find the right polymer solutions for your industry?
              </h2>
              <p className="text-primary-200 text-base leading-relaxed">
                Connect with verified suppliers and explore thousands of high-quality
                polymer products.
              </p>
            </div>

            {/* Right — buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
              >
                <Package className="w-4 h-4" />
                Explore Products
              </Link>
              <Link
                href="/suppliers"
                className="inline-flex items-center gap-2 border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                Contact Suppliers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
