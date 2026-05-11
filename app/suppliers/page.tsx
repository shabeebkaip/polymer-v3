'use client';
import { useEffect, useState } from 'react';
import SupplierCard from '@/components/suppliers/SupplierCard';
import React from 'react';
import { useSharedState } from '@/stores/sharedStore';
import { Building2, Globe2, ShieldCheck, Package, Search, SlidersHorizontal, Headphones } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


const FEATURES = [
  { icon: <ShieldCheck className="w-4 h-4 text-primary-600" />, title: 'Fully Verified',  desc: 'Every supplier is vetted for quality and compliance' },
  { icon: <Globe2       className="w-4 h-4 text-primary-600" />, title: 'Global Network',  desc: 'Worldwide network with deep GCC expertise' },
  { icon: <Package      className="w-4 h-4 text-primary-600" />, title: 'Wide Range',      desc: 'Thousands of polymer products ready to source' },
  { icon: <Headphones   className="w-4 h-4 text-primary-600" />, title: 'Local Support',   desc: 'Dedicated support for faster and smarter sourcing' },
];

const SuppliersPage: React.FC = () => {
  const { sellers, fetchSellers, sellersLoading } = useSharedState();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchSellers(); }, [fetchSellers]);

  const totalCountries = new Set(sellers.map((s: any) => s.location).filter(Boolean)).size;
  const totalProducts  = sellers.reduce((acc: number, s: any) => acc + (s.products?.length || 0), 0);

  const filtered = sellers.filter((s: any) =>
    !search ||
    s.company?.toLowerCase().includes(search.toLowerCase()) ||
    s.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero — white, two-column ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12 md:py-16">

            {/* Left — content */}
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
                <span>›</span>
                <span className="text-gray-700 font-medium">Suppliers</span>
              </nav>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                Verified Supplier<br />Directory
              </h1>
              <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
                Discover our network of verified polymer suppliers. Partner with trusted manufacturers and distributors worldwide.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: <Building2 className="w-4 h-4 text-primary-600" />, value: `${sellers.length}+`,  label: 'Verified Suppliers' },
                  { icon: <Globe2    className="w-4 h-4 text-primary-600" />, value: `${totalCountries}+`,   label: 'Countries Served'   },
                  { icon: <Package  className="w-4 h-4 text-primary-600" />,  value: `${totalProducts}+`,    label: 'Products Listed'    },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-2xl border border-primary-100">
                    <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-xl leading-none">{s.value}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — world map */}
            <div className="hidden lg:flex items-center justify-center h-72 xl:h-96 relative">
              <Image
                src="/ChatGPT Image May 11, 2026, 11_14_54 PM.png"
                alt="Global supplier network"
                fill
                className="object-contain object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-6xl py-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers by name, location, or specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50 bg-white"
              />
            </div>
            <select className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-primary-400 appearance-none pr-8">
              <option>All Countries</option>
            </select>
            <select className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-primary-400 appearance-none pr-8">
              <option>All Families</option>
            </select>
            <select className="hidden md:block px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-primary-400 appearance-none pr-8">
              <option>All Types</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors bg-white whitespace-nowrap">
              <SlidersHorizontal className="w-4 h-4" />
              More Filters
            </button>
            <button className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container mx-auto px-4 max-w-6xl py-8">

        {/* Features strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-5 bg-primary-50/80 rounded-2xl border border-primary-100">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-9 h-9 bg-white rounded-xl shadow-sm border border-primary-100 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Suppliers</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {sellersLoading ? 'Loading...' : `Showing 1 – ${filtered.length} of ${sellers.length}+ suppliers`}
            </p>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-12 gap-4 mb-12">
          {sellersLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="col-span-12 animate-pulse bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex gap-5">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-100 rounded w-1/3" />
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="h-px bg-gray-100 rounded w-full mt-2" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
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
            <div className="col-span-12 text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Building2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No suppliers found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;
