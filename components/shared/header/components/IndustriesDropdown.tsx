'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronDown, Building2, ArrowRight, Car, Package, Cpu,
  Zap, Leaf, Heart, ShoppingBag, Layers, Factory,
  Scissors, Workflow, FlaskConical, Wrench
} from 'lucide-react';
import { getIndustryList } from '@/apiServices/shared';
import { IndustryItem } from '@/types/industries';
import { useSharedState } from '@/stores/sharedStore';

// Map industry names → Lucide icon + accent color
const INDUSTRY_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Packaging':                          { icon: <Package className="w-4 h-4" />,      color: 'text-amber-600',   bg: 'bg-amber-50'   },
  'Automotive & Transportation':        { icon: <Car className="w-4 h-4" />,          color: 'text-blue-600',    bg: 'bg-blue-50'    },
  'Construction & Infrastructure':      { icon: <Building2 className="w-4 h-4" />,    color: 'text-orange-600',  bg: 'bg-orange-50'  },
  'Electrical & Electronics':           { icon: <Cpu className="w-4 h-4" />,          color: 'text-violet-600',  bg: 'bg-violet-50'  },
  'Consumer Goods & Appliances':        { icon: <ShoppingBag className="w-4 h-4" />,  color: 'text-pink-600',    bg: 'bg-pink-50'    },
  'Medical & Healthcare':               { icon: <Heart className="w-4 h-4" />,        color: 'text-rose-600',    bg: 'bg-rose-50'    },
  'Agriculture':                        { icon: <Leaf className="w-4 h-4" />,         color: 'text-green-600',   bg: 'bg-green-50'   },
  'Textiles, Fibers & Nonwovens':       { icon: <Scissors className="w-4 h-4" />,     color: 'text-purple-600',  bg: 'bg-purple-50'  },
  'Industrial Manufacturing':           { icon: <Factory className="w-4 h-4" />,      color: 'text-gray-600',    bg: 'bg-gray-100'   },
  'Wire & Cable':                       { icon: <Workflow className="w-4 h-4" />,     color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
  'Energy & Utilities':                 { icon: <Zap className="w-4 h-4" />,          color: 'text-yellow-600',  bg: 'bg-yellow-50'  },
  '3D Printing & Advanced Manufacturing':{ icon: <Layers className="w-4 h-4" />,     color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
};

const DEFAULT_META = { icon: <Wrench className="w-4 h-4" />, color: 'text-primary-600', bg: 'bg-primary-50' };

const IndustriesDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { industries: storeIndustries } = useSharedState();

  useEffect(() => {
    // Use already-fetched store data if available
    if (storeIndustries?.length > 0) {
      setIndustries(storeIndustries as IndustryItem[]);
      return;
    }
    if (!isOpen || industries.length > 0) return;

    setIsLoading(true);
    getIndustryList()
      .then(r => setIndustries(r?.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isOpen, industries.length, storeIndustries]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const handleMouseEnter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setIsOpen(true); };
  const handleMouseLeave = () => { timeoutRef.current = setTimeout(() => setIsOpen(false), 150); };
  const close = () => setIsOpen(false);

  const displayed = industries.slice(0, 12);

  return (
    <div ref={menuRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isOpen ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span>Industries</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Mega menu */}
      {isOpen && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-[680px]">

            {/* Header strip */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">Browse by Industry</p>
                  <p className="text-[11px] text-primary-200">{industries.length} industries available</p>
                </div>
              </div>
              <Link
                href="/industries"
                onClick={close}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary-700 hover:bg-primary-50 text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Grid */}
            <div className="p-4">
              {isLoading ? (
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div className="flex-1 h-3 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5">
                  {displayed.map((industry) => {
                    const meta = INDUSTRY_META[industry.name] || DEFAULT_META;
                    return (
                      <Link
                        key={industry._id}
                        href={`/products?industry=${industry._id}`}
                        onClick={close}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-150 group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${meta.bg} ${meta.color} group-hover:scale-110 transition-transform duration-200`}>
                          {meta.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2">
                          {industry.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div className="px-4 pb-4">
              <Link
                href="/products"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-semibold rounded-xl border border-primary-200 transition-colors"
              >
                Browse All Products
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustriesDropdown;
