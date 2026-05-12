'use client';
import { useEffect, useState } from 'react';
import SupplierCard from '@/components/suppliers/SupplierCard';
import React from 'react';
import { useSharedState } from '@/stores/sharedStore';
import { Building2, Globe2, ShieldCheck, Package, Search, SlidersHorizontal, Headphones, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserInfo } from '@/lib/useUserInfo';
import { useRouter } from 'next/navigation';

const FEATURES = [
  { icon: <ShieldCheck className="w-4 h-4 text-primary-600" />, title: 'Fully Verified',  desc: 'Every supplier is vetted for quality and compliance' },
  { icon: <Globe2       className="w-4 h-4 text-primary-600" />, title: 'Global Network',  desc: 'Worldwide network with deep GCC expertise' },
  { icon: <Package      className="w-4 h-4 text-primary-600" />, title: 'Wide Range',      desc: 'Thousands of polymer products ready to source' },
  { icon: <Headphones   className="w-4 h-4 text-primary-600" />, title: 'Local Support',   desc: 'Dedicated support for faster and smarter sourcing' },
];

const SuppliersPage: React.FC = () => {
  const { sellers, fetchSellers, sellersLoading } = useSharedState();
  const { user, isInitialized } = useUserInfo();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/auth/login?redirect=/suppliers');
    }
  }, [isInitialized, user, router]);

  useEffect(() => { if (user) fetchSellers(); }, [fetchSellers, user]);

  if (!isInitialized || !user) return null;

  const totalCountries = new Set(sellers.map((s: any) => s.location).filter(Boolean)).size;
  const totalProducts  = sellers.reduce((acc: number, s: any) => acc + (s.products?.length || 0), 0);

  const filtered = sellers.filter((s: any) =>
    !search ||
    s.company?.toLowerCase().includes(search.toLowerCase()) ||
    s.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center py-8 md:py-12 lg:py-16">

            {/* Content */}
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4 md:mb-6">
                <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
                <span>›</span>
                <span className="text-gray-700 font-medium">Suppliers</span>
              </nav>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-3 md:mb-4">
                Verified Supplier<br />Directory
              </h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-md">
                Discover our network of verified polymer suppliers. Partner with trusted manufacturers and distributors worldwide.
              </p>

              {/* Stats — scrollable on tiny screens */}
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                {[
                  { icon: <Building2 className="w-4 h-4 text-primary-600" />, value: `${sellers.length}+`, label: 'Verified Suppliers' },
                  { icon: <Globe2    className="w-4 h-4 text-primary-600" />, value: `${totalCountries}+`,  label: 'Countries Served'  },
                  { icon: <Package  className="w-4 h-4 text-primary-600" />,  value: `${totalProducts}+`,   label: 'Products Listed'   },
                ].map((s, i) => (
                  <div key={i} className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 bg-primary-50 rounded-2xl border border-primary-100">
                    <div className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-lg leading-none">{s.value}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Globe — desktop only */}
            <div className="hidden lg:flex items-center justify-center h-72 xl:h-96 relative">
              <Image src="/globe-network.png" alt="Global supplier network" fill className="object-contain object-center" priority />
            </div>
          </div>
        </div>
      </div>

      {/* ── Search bar — mobile-first ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-6xl py-3">
          {/* Mobile: search + filter button */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 bg-white"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {/* Desktop extra filters */}
            <div className="hidden md:flex gap-2">
              <select className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-primary-400">
                <option>All Countries</option>
              </select>
              <select className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-primary-400">
                <option>All Families</option>
              </select>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors bg-white whitespace-nowrap">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container mx-auto px-4 max-w-6xl py-5 md:py-8">

        {/* Features strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 md:mb-8 p-4 md:p-5 bg-primary-50/80 rounded-2xl border border-primary-100">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-8 h-8 bg-white rounded-xl shadow-sm border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-xs md:text-sm">{f.title}</p>
                <p className="text-gray-500 text-[11px] mt-0.5 leading-relaxed hidden sm:block">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">All Suppliers</h2>
            <p className="text-xs md:text-sm text-gray-400 mt-0.5">
              {sellersLoading ? 'Loading...' : `Showing 1 – ${filtered.length} of ${sellers.length}+ suppliers`}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-3 md:gap-4 mb-12">
          {sellersLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="col-span-12 animate-pulse bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                      <div className="h-px bg-gray-100 rounded w-full mt-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))
            : filtered.map((supplier: any, index: number) => (
                <SupplierCard
                  key={index}
                  logo={supplier?.company_logo}
                  name={supplier?.company}
                  location={supplier?.location}
                  website={supplier?.website}
                  supplierId={supplier?._id}
                  productCount={supplier?.products?.length || 0}
                  description={supplier?.about_us}
                  industry={supplier?.industry?.name}
                />
              ))}

          {!sellersLoading && filtered.length === 0 && (
            <div className="col-span-12 text-center py-12 md:py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-600 font-medium text-sm">No suppliers found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;
