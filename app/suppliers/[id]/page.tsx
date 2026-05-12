'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Globe, MapPin, Mail, Shield, Truck,
  BadgeCheck, ChevronLeft, ChevronRight, Share2, Heart,
  Clock, Package, Zap, Award, Download, FileText,
  Factory, Recycle, FlaskConical, Wrench, Settings,
  Users, Calendar, ArrowLeft, ExternalLink,
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { getSellerDetail } from '@/apiServices/shared';
import { useUserInfo } from '@/lib/useUserInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { Supplier } from '@/types/seller';
import Image from 'next/image';
import Link from 'next/link';

/* ── Tabs ── */
const TABS = ['Overview', 'Products', 'Certifications', 'Industries', 'Capabilities', 'Contact'];

/* ── Trust badges ── */
const TRUST_BADGES = [
  { icon: <BadgeCheck className="w-6 h-6 text-primary-600" />, title: 'Verified Supplier',  sub: 'Platform Verified'      },
  { icon: <Shield      className="w-6 h-6 text-primary-600" />, title: 'Trade Assurance',    sub: 'Secure Transactions'    },
  { icon: <Award       className="w-6 h-6 text-primary-600" />, title: 'ISO Certified',      sub: 'Quality Management'     },
  { icon: <Globe       className="w-6 h-6 text-primary-600" />, title: 'Global Shipping',    sub: 'Worldwide Delivery'     },
  { icon: <Zap         className="w-6 h-6 text-primary-600" />, title: 'Fast Response',      sub: 'Average < 2 hrs'        },
];

/* ── Manufacturing capabilities ── */
const CAPABILITIES = [
  { icon: <Factory      className="w-6 h-6" />, label: 'Injection Molding' },
  { icon: <Settings     className="w-6 h-6" />, label: 'Extrusion'         },
  { icon: <Package      className="w-6 h-6" />, label: 'Blow Molding'      },
  { icon: <FlaskConical className="w-6 h-6" />, label: 'Compounding'       },
  { icon: <Recycle      className="w-6 h-6" />, label: 'Recycling'         },
  { icon: <Wrench       className="w-6 h-6" />, label: 'R&D Support'       },
  { icon: <Zap          className="w-6 h-6" />, label: 'Custom Solutions'   },
];

/* ── Certifications ── */
const CERTS = ['ISO 9001:2015', 'ISO 14001:2015', 'SGS', 'RoHS', 'FDA', 'REACH'];

const SupplierDetail = () => {
  const params   = useParams();
  const { user } = useUserInfo();

  const [supplier,    setSupplier]    = useState<Supplier | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState('Overview');
  const [scrollIdx,   setScrollIdx]   = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [logoError,   setLogoError]   = useState(false);

  const overviewRef       = useRef<HTMLDivElement>(null);
  const productsRef       = useRef<HTMLDivElement>(null);
  const certsRef          = useRef<HTMLDivElement>(null);
  const capabilitiesRef   = useRef<HTMLDivElement>(null);
  const contactRef        = useRef<HTMLDivElement>(null);
  const carouselRef       = useRef<HTMLDivElement>(null);

  const fetchSupplierDetails = useCallback(async () => {
    try {
      const response = await getSellerDetail(params.id as string);
      setSupplier(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { if (params.id) fetchSupplierDetails(); }, [params.id, fetchSupplierDetails]);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, tab: string) => {
    setActiveTab(tab);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const carouselPrev = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    setScrollIdx(i => Math.max(0, i - 1));
  };
  const carouselNext = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    setScrollIdx(i => i + 1);
  };

  /* ── Loading skeleton ── */
  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-12 bg-white border-b" />
      <div className="h-56 md:h-72 bg-gray-200 animate-pulse" />
      <div className="h-16 bg-white border-b animate-pulse" />
      <div className="container mx-auto px-4 max-w-6xl py-5 md:py-8 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Skeleton className="h-48 md:h-64 rounded-2xl" />
          <Skeleton className="h-48 md:h-64 rounded-2xl" />
        </div>
        <Skeleton className="h-20 md:h-24 rounded-2xl" />
        <Skeleton className="h-48 md:h-64 rounded-2xl" />
      </div>
    </div>
  );

  if (!supplier) return (
    <div className="text-center py-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Supplier Not Found</h1>
      <p className="text-gray-500">This supplier doesn&apos;t exist or has been removed.</p>
    </div>
  );

  const displayName = supplier.company || 'Supplier';
  const words       = displayName.replace(/[-_]/g, ' ').split(/\s+/).filter(Boolean);
  const monogram    = words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : displayName.slice(0, 2).toUpperCase();
  const hasLogo     = !!supplier.company_logo && !logoError;
  const products    = supplier.products || [];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky top nav ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Top row: back + actions */}
          <div className="flex items-center justify-between h-12">
            <Link href="/suppliers" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Suppliers</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>

          {/* Tabs row — horizontally scrollable on mobile */}
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px pb-0">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'Overview')       scrollTo(overviewRef,     tab);
                  if (tab === 'Products')       scrollTo(productsRef,     tab);
                  if (tab === 'Certifications') scrollTo(certsRef,        tab);
                  if (tab === 'Capabilities')   scrollTo(capabilitiesRef, tab);
                  if (tab === 'Contact')        scrollTo(contactRef,      tab);
                  else setActiveTab(tab);
                }}
                className={`flex-shrink-0 px-3 md:px-4 py-2.5 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-500 border-transparent hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div ref={overviewRef} className="relative overflow-hidden">
        {/* Supplier background image */}
        <Image src="/supplier-bg.png" alt="" aria-hidden fill className="object-cover object-center pointer-events-none" priority />
        {/* Overlay — lighter so the bg image shows through */}
        <div className="absolute inset-0 bg-[#0f2d1e]/55 pointer-events-none" />

        <div className="relative container mx-auto px-4 max-w-6xl py-8 md:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start lg:items-center">

            {/* Left — identity + CTAs */}
            <div className="flex-1 min-w-0">
              {/* Logo + name row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-xl p-2 md:p-3">
                  {hasLogo ? (
                    <Image src={supplier.company_logo} alt={displayName} width={96} height={96} className="w-full h-full object-contain" onError={() => setLogoError(true)} />
                  ) : (
                    <span className="text-3xl font-bold text-primary-600">{monogram}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-xl md:text-4xl font-bold text-white leading-tight">{displayName}</h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/40 border border-primary-400/50 text-white text-xs font-bold rounded-full">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified Supplier
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/70 flex-wrap mt-1">
                    {supplier.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary-300" />
                        {supplier.location}
                      </span>
                    )}
                    {supplier.website && (
                      <a href={supplier.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <ExternalLink className="w-3.5 h-3.5 text-primary-300" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Trusted Polymer Solutions. Delivering Quality. Driving Innovation.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => window.open(`mailto:${supplier.email}`, '_blank')}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold rounded-xl transition-colors shadow-lg"
                >
                  <Mail className="w-4 h-4" /> Contact Supplier
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-bold rounded-xl transition-colors">
                  <FileText className="w-4 h-4" /> Request Quote
                </button>
              </div>
            </div>

            {/* Right — 2×2 stats */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-72 flex-shrink-0">
              {[
                { icon: <Calendar className="w-5 h-5" />, value: '12+',                    label: 'Years in Business' },
                { icon: <Package  className="w-5 h-5" />, value: `${products.length || 250}+`, label: 'Products'          },
                { icon: <Globe    className="w-5 h-5" />, value: '40+',                    label: 'Countries Served'  },
                { icon: <Truck    className="w-5 h-5" />, value: '1000 MT',                label: 'Minimum Order'     },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-2xl font-bold text-white leading-none">{s.value}</p>
                    <div className="w-8 h-8 bg-primary-500/30 rounded-lg flex items-center justify-center text-primary-300">
                      {s.icon}
                    </div>
                  </div>
                  <p className="text-white/55 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Performance bar — white card BELOW hero ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { icon: <Clock   className="w-4 h-4 text-primary-500" />, label: 'Response Time',    value: '< 2 hrs',      sub: 'Average response'     },
              { icon: <Truck   className="w-4 h-4 text-primary-500" />, label: 'On-time Delivery', value: '98%',          sub: 'Reliable & consistent' },
              { icon: <Factory className="w-4 h-4 text-primary-500" />, label: 'Supplier Type',    value: 'Manufacturer', sub: 'ISO Certified'         },
              { icon: <Shield  className="w-4 h-4 text-primary-500" />, label: 'Trade Assurance',  value: 'Protected',    sub: 'Your orders are safe'  },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-2.5 px-4 py-4 md:px-5 md:py-5 ${i % 2 === 0 && i < 2 ? 'border-r border-gray-100' : ''} ${i < 2 ? 'border-b md:border-b-0 border-gray-100' : ''} ${i === 1 || i === 3 ? 'md:border-r md:border-gray-100' : ''}`}>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-wide">{s.label}</p>
                  <p className="text-gray-900 font-bold text-xs md:text-sm">{s.value}</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 hidden sm:block">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container mx-auto px-4 max-w-6xl py-5 md:py-8 space-y-5 md:space-y-8">

        {/* ── About + Quick Facts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {displayName}</h2>
            <div
              className="text-gray-600 text-sm leading-relaxed mb-5 supplier-about"
              dangerouslySetInnerHTML={{
                __html: `<style>.supplier-about strong{color:#136F47;font-weight:700}.supplier-about em{color:#136F47;font-style:italic}</style>
                  ${supplier.about_us || `${displayName} is a <strong>trusted supplier</strong> in the polymer and chemical industry, committed to providing <em>high-quality products</em> and exceptional service to customers worldwide. With years of experience in the market, we specialize in delivering <strong>innovative solutions</strong> that meet the evolving needs of our clients.`}`,
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
                <Shield className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Quality Assured</p>
                  <p className="text-xs text-gray-500">Certified products & processes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl border border-primary-100">
                <Truck className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Fast Delivery</p>
                  <p className="text-xs text-gray-500">Reliable logistics network</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Facts</h2>
            <div className="space-y-3">
              {[
                { icon: <Calendar  className="w-4 h-4" />, label: 'Founded',        value: '2012'                     },
                { icon: <Users     className="w-4 h-4" />, label: 'Employees',      value: '120+'                     },
                { icon: <Globe     className="w-4 h-4" />, label: 'Export Markets', value: 'GCC, Asia, Europe, Africa' },
                { icon: <Award     className="w-4 h-4" />, label: 'Certifications', value: 'ISO 9001, ISO 14001, RoHS' },
                { icon: <Clock     className="w-4 h-4" />, label: 'Response Time',  value: '< 2 hours'                },
                { icon: <Globe     className="w-4 h-4" />, label: 'Languages',      value: 'English, Arabic'          },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2 text-gray-500">
                    {r.icon}
                    <span className="text-sm">{r.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Trust badges ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-5 text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
                  {b.icon}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{b.title}</p>
                <p className="text-xs text-gray-400">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Featured Products ── */}
        <div ref={productsRef}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
            <div className="flex items-center gap-3">
              <Link href={`/products?createdBy=${supplier._id}`} className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View all products <ChevronRight className="w-4 h-4" />
              </Link>
              <button onClick={carouselPrev} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={carouselNext} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {products.length > 0 ? (
            <div ref={carouselRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
              {products.map((product) => (
                <div key={product._id} className="flex-shrink-0 w-72">
                  <ProductCard product={product} userType={user?.user_type} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm">No products available yet</p>
            </div>
          )}
        </div>

        {/* ── Manufacturing Capabilities ── */}
        <div ref={capabilitiesRef}>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Manufacturing Capabilities</h2>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
            {CAPABILITIES.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2 hover:border-primary-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  {c.icon}
                </div>
                <p className="text-xs font-semibold text-gray-700 text-center leading-tight">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Certifications ── */}
        <div ref={certsRef}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
            <button className="text-sm text-primary-600 font-semibold flex items-center gap-1">
              View all certifications <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
            {(supplier.certifications?.length ? supplier.certifications : CERTS).map((cert, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2 hover:border-primary-200 transition-all">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-xs font-bold text-gray-800 text-center leading-tight">{cert}</p>
                <p className="text-[10px] text-gray-400 text-center">{cert.includes('ISO') ? 'Quality Management' : cert.includes('RoHS') ? 'RoHS Compliant' : `${cert} Certified`}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA Footer ── */}
        <div ref={contactRef} className="relative bg-[#0f2d1e] rounded-2xl overflow-hidden p-6 md:p-10">
          <Image src="/supplier-bg.png" alt="" aria-hidden fill className="object-cover object-center opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-[#0f2d1e]/60 pointer-events-none rounded-2xl" />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Let&apos;s Build a Stronger Partnership</h2>
              <p className="text-white/60 text-sm mb-6 max-w-md">
                Looking for high-quality polymer materials for your business?
                Get in touch with {displayName} for competitive pricing and reliable supply.
              </p>
              <div className="flex flex-wrap gap-5">
                {[
                  { icon: <Clock  className="w-4 h-4 text-primary-400" />, title: 'Quick Response', sub: 'Within 2 hours'   },
                  { icon: <Globe  className="w-4 h-4 text-primary-400" />, title: 'Global Delivery', sub: 'To 40+ Countries' },
                  { icon: <Shield className="w-4 h-4 text-primary-400" />, title: 'Quality Assured', sub: '100% Certified'   },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {f.icon}
                    <div>
                      <p className="text-white text-xs font-semibold">{f.title}</p>
                      <p className="text-white/40 text-[10px]">{f.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — action buttons */}
            <div className="flex flex-col gap-3 w-full lg:w-56">
              <button
                onClick={() => window.open(`mailto:${supplier.email}`, '_blank')}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4" /> Contact Supplier
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-semibold rounded-xl transition-colors">
                <FileText className="w-4 h-4" /> Request Quotation
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-semibold rounded-xl transition-colors">
                <Download className="w-4 h-4" /> Download Catalog
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupplierDetail;
