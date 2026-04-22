'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CategoryCardProps } from '@/types/category';

const CategoryCard: React.FC<CategoryCardProps> = ({ name, selectedCategory, id }) => {
  const router = useRouter();

  const initials = name
    .split(/[\s&\/\-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  const handleClick = () => {
    if (selectedCategory === 'industries') {
      router.push(`/products?industry=${id}`);
    } else {
      router.push(`/products?productFamily=${id}`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={(e) => { if (e.key === 'Enter') handleClick(); }}
      aria-label={name}
      className="group cursor-pointer select-none"
      style={{ fontFamily: 'inherit' }}
    >
      <div
        className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-200"
        style={{ background: '#fff' }}
      >
        {/* ── Green header slab ── */}
        <div
          className="relative flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #1a4731 0%, #166534 60%, #15803d 100%)',
            padding: '28px 16px 22px',
            minHeight: 90,
          }}
        >
          {/* Subtle dot-grid texture */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '10px 10px',
            }}
          />

          {/* Ghost large initial — decorative watermark */}
          <span
            className="absolute right-2 bottom-0 font-black text-white select-none pointer-events-none leading-none"
            style={{ fontSize: 72, opacity: 0.06, lineHeight: 1 }}
            aria-hidden
          >
            {initials[0]}
          </span>

          {/* Initials */}
          <span
            className="relative z-10 font-bold text-white tracking-widest"
            style={{ fontSize: 22, letterSpacing: '0.15em' }}
          >
            {initials}
          </span>
        </div>

        {/* ── White body ── */}
        <div className="px-4 pt-3.5 pb-4 flex flex-col gap-2.5">
          <h3
            className="text-gray-900 font-semibold leading-snug line-clamp-2"
            style={{ fontSize: 13 }}
          >
            {name}
          </h3>

          {/* Animated underline arrow */}
          <div className="flex items-center gap-1 overflow-hidden" style={{ height: 16 }}>
            <span
              className="text-[11px] font-semibold tracking-wide text-primary-600 transition-all duration-200 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
              style={{ whiteSpace: 'nowrap' }}
            >
              Explore
            </span>
            <svg
              className="w-3 h-3 text-primary-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
              fill="none"
              viewBox="0 0 12 12"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6h8M7 3l3 3-3 3" />
            </svg>
          </div>
        </div>

        {/* Bottom accent line on hover */}
        <div
          className="absolute bottom-0 left-0 h-[2.5px] bg-primary-500 transition-all duration-300 w-0 group-hover:w-full"
        />
      </div>
    </div>
  );
};

export default CategoryCard;
