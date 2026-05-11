'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronDown, Package, ArrowRight, FlaskConical, Layers,
  Atom, Droplets, Flame, Shield, Recycle, Zap,
  Microscope, Wind, Wrench
} from 'lucide-react';
import { getProductFamilies } from '@/apiServices/shared';
import { ProductFamily } from '@/types/productFamily';
import { useSharedState } from '@/stores/sharedStore';

// Map product family names → icon + color
const FAMILY_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Polyethylene (PE)':               { icon: <Layers className="w-4 h-4" />,      color: 'text-blue-600',    bg: 'bg-blue-50'    },
  'Polypropylene (PP)':              { icon: <Atom className="w-4 h-4" />,         color: 'text-green-600',   bg: 'bg-green-50'   },
  'PVC':                             { icon: <FlaskConical className="w-4 h-4" />, color: 'text-violet-600',  bg: 'bg-violet-50'  },
  'Polyvinyl Chloride':              { icon: <FlaskConical className="w-4 h-4" />, color: 'text-violet-600',  bg: 'bg-violet-50'  },
  'Polystyrene (PS)':                { icon: <Droplets className="w-4 h-4" />,     color: 'text-cyan-600',    bg: 'bg-cyan-50'    },
  'Nylon / Polyamide':               { icon: <Wind className="w-4 h-4" />,         color: 'text-pink-600',    bg: 'bg-pink-50'    },
  'Polyamide (PA)':                  { icon: <Wind className="w-4 h-4" />,         color: 'text-pink-600',    bg: 'bg-pink-50'    },
  'ABS':                             { icon: <Shield className="w-4 h-4" />,       color: 'text-orange-600',  bg: 'bg-orange-50'  },
  'Polycarbonate (PC)':              { icon: <Microscope className="w-4 h-4" />,   color: 'text-indigo-600',  bg: 'bg-indigo-50'  },
  'Polyurethane (PU)':               { icon: <Flame className="w-4 h-4" />,        color: 'text-rose-600',    bg: 'bg-rose-50'    },
  'Thermoplastic Elastomers (TPE)':  { icon: <Recycle className="w-4 h-4" />,      color: 'text-teal-600',    bg: 'bg-teal-50'    },
  'Engineering Plastics':            { icon: <Zap className="w-4 h-4" />,          color: 'text-amber-600',   bg: 'bg-amber-50'   },
  'Bioplastics':                     { icon: <Recycle className="w-4 h-4" />,      color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

const DEFAULT_META = { icon: <Package className="w-4 h-4" />, color: 'text-primary-600', bg: 'bg-primary-50' };

const ProductFamiliesDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { productFamilies: storeFamilies } = useSharedState();

  useEffect(() => {
    if (storeFamilies?.length > 0) {
      setProductFamilies(storeFamilies as ProductFamily[]);
      return;
    }
    if (!isOpen || productFamilies.length > 0) return;

    setIsLoading(true);
    getProductFamilies()
      .then(r => setProductFamilies(r?.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isOpen, productFamilies.length, storeFamilies]);

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

  const displayed = productFamilies.slice(0, 12);

  return (
    <div ref={menuRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isOpen ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
        }`}
      >
        <Package className="w-4 h-4" />
        <span>Product Families</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Mega menu */}
      {isOpen && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-[680px]">

            {/* Header strip */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">Browse by Polymer Family</p>
                  <p className="text-[11px] text-gray-400">{productFamilies.length} product families</p>
                </div>
              </div>
              <Link
                href="/product-families"
                onClick={close}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-800 hover:bg-gray-100 text-xs font-semibold rounded-lg transition-colors shadow-sm"
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
                  {displayed.map((family) => {
                    // Match by name substring for flexibility
                    const metaKey = Object.keys(FAMILY_META).find(k =>
                      family.name.toLowerCase().includes(k.toLowerCase()) ||
                      k.toLowerCase().includes(family.name.toLowerCase())
                    );
                    const meta = (metaKey ? FAMILY_META[metaKey] : null) || DEFAULT_META;
                    return (
                      <Link
                        key={family._id}
                        href={`/products?productFamily=${family._id}`}
                        onClick={close}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-150 group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${meta.bg} ${meta.color} group-hover:scale-110 transition-transform duration-200`}>
                          {meta.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2">
                          {family.name}
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
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-colors"
              >
                Browse All Polymer Products
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFamiliesDropdown;
