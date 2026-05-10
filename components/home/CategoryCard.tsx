'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { CategoryCardProps } from '@/types/category';

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, selectedCategory, id }) => {
  const router = useRouter();

  const handleClick = () => {
    if (selectedCategory === 'industries') {
      router.push(`/products?industry=${id}`);
    } else {
      router.push(`/products?productFamily=${id}`);
    }
  };

  // Resolve icon name → Lucide component at render time
  const IconComponent =
    icon && icon in LucideIcons
      ? (LucideIcons as Record<string, React.ElementType>)[icon]
      : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
      aria-label={`Explore ${name}`}
      className="group cursor-pointer select-none h-full"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col h-full min-h-[160px] sm:min-h-[180px]">

        {/* Icon circle + accent dash */}
        <div className="flex flex-col gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600">
            {IconComponent ? (
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.6} />
            ) : (
              /* Generic fallback — box/package outline */
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            )}
          </div>
          <div className="w-5 h-0.5 bg-primary-400 rounded-full" />
        </div>

        {/* Name */}
        <h3 className="mt-3 flex-1 text-gray-900 font-bold text-sm sm:text-base leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Arrow */}
        <div className="mt-4 flex justify-end">
          <span className="text-gray-300 text-xl font-light leading-none group-hover:text-primary-500 transition-colors duration-200">
            →
          </span>
        </div>

      </div>
    </div>
  );
};

export default CategoryCard;
