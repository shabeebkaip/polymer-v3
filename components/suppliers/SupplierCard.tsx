'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Package, Globe2, BadgeCheck, ArrowRight } from 'lucide-react';
import { SupplierCardProps } from '@/types/seller';

const SupplierCard: React.FC<SupplierCardProps> = ({
  name, location, logo, supplierId,
  productCount = 0, description, industry,
}) => {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const displayName = name?.trim() || 'Supplier';
  const words = displayName.replace(/[-_]/g, ' ').split(/\s+/).filter(Boolean);
  const monogram = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : displayName.slice(0, 2).toUpperCase();
  const hasLogo = !!logo && !imgError;

  return (
    <div
      onClick={() => router.push(`/suppliers/${supplierId}`)}
      className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 cursor-pointer group p-5"
    >
      {/* Verified badge — top right */}
      <div className="flex justify-end mb-3">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
          <BadgeCheck className="w-3.5 h-3.5" />
          Verified
        </span>
      </div>

      {/* Main row: logo + info + arrow */}
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
          {hasLogo ? (
            <Image
              src={logo}
              alt={displayName}
              width={80}
              height={80}
              className="w-full h-full object-contain p-2"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-2xl font-bold text-primary-600 tracking-tight">{monogram}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 capitalize group-hover:text-primary-700 transition-colors leading-tight mb-1">
            {displayName}
          </h2>
          {location && (
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-500">{location}</span>
            </div>
          )}
          {industry && (
            <span className="inline-block px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
              {industry}
            </span>
          )}
        </div>

        {/* Arrow */}
        <button className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-primary-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mt-3">
          {description}
        </p>
      )}

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 pt-4 border-t border-gray-100">
        {productCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Package className="w-3.5 h-3.5 text-primary-500" />
            <span className="font-semibold text-gray-700">{productCount}+</span> Products
          </div>
        )}
        {location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Globe2 className="w-3.5 h-3.5 text-primary-500" />
            {location}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <BadgeCheck className="w-3.5 h-3.5 text-primary-500" />
          ISO Certified
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;
