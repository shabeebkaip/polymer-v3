'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Building2, Package, ArrowRight, Sparkles } from 'lucide-react';
import { getIndustryList, getProductFamilies } from '@/apiServices/shared';
import { IndustryItem } from '@/types/industries';
import { ProductFamily } from '@/types/productFamily';

const MegaMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (industries.length > 0 && productFamilies.length > 0) return; // Already loaded
      
      setIsLoading(true);
      try {
        const [industriesRes, familiesRes] = await Promise.all([
          getIndustryList(),
          getProductFamilies()
        ]);
        setIndustries(industriesRes?.data || []);
        setProductFamilies(familiesRes?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && (industries.length === 0 || productFamilies.length === 0)) {
      fetchData();
    }
  }, [isOpen, industries.length, productFamilies.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div 
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        className={`flex items-center gap-1.5 px-3 py-2 font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 ${
          isOpen ? 'text-green-600 bg-green-50' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Categories</span>
        <ChevronDown 
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-[920px]">
            {/* Content */}
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              {/* Industries Section */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Industries</h3>
                      <p className="text-xs text-gray-500">{industries.length} available</p>
                    </div>
                  </div>
                  <Link
                    href="/industries"
                    onClick={handleItemClick}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:gap-1.5 transition-all"
                  >
                    View All
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-0.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                  {isLoading ? (
                    [...Array(6)].map((_, idx) => (
                      <div key={idx} className="animate-pulse flex items-center gap-2.5 p-2 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-3.5 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    industries.slice(0, 10).map((industry) => (
                      <Link
                        key={industry._id}
                        href={`/products?industry=${industry._id}`}
                        onClick={handleItemClick}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-blue-50/70 transition-all duration-150 group"
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          <Image
                            src={industry.image || industry.bg}
                            alt={industry.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {industry.name}
                          </h4>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Product Families Section */}
              <div className="p-5 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Product Families</h3>
                      <p className="text-xs text-gray-500">{productFamilies.length} available</p>
                    </div>
                  </div>
                  <Link
                    href="/product-families"
                    onClick={handleItemClick}
                    className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1 hover:gap-1.5 transition-all"
                  >
                    View All
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-0.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                  {isLoading ? (
                    [...Array(6)].map((_, idx) => (
                      <div key={idx} className="animate-pulse flex items-center gap-2.5 p-2 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-3.5 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    productFamilies.slice(0, 10).map((family) => (
                      <Link
                        key={family._id}
                        href={`/products?productFamily=${family._id}`}
                        onClick={handleItemClick}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-green-50/70 transition-all duration-150 group"
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          <Image
                            src={family.image}
                            alt={family.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors line-clamp-1">
                            {family.name}
                          </h4>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-600">
                  Need something specific?{' '}
                  <Link 
                    href="/user/product-requests/add" 
                    onClick={handleItemClick}
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                  >
                    Request a Product
                  </Link>
                </p>
                <div className="flex items-center gap-3 text-gray-500">
                  <Link 
                    href="/industries" 
                    onClick={handleItemClick}
                    className="hover:text-gray-700 font-medium transition-colors"
                  >
                    All Industries
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link 
                    href="/product-families" 
                    onClick={handleItemClick}
                    className="hover:text-gray-700 font-medium transition-colors"
                  >
                    All Families
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default MegaMenu;
