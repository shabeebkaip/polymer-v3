'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import CategoryCard from './CategoryCard';
import { useRouter } from 'next/navigation';
import useIsMobile from '@/lib/useIsMobile';
import { Skeleton } from '../ui/skeleton';
import { useSharedState } from '@/stores/sharedStore';

/* ── View-all card ────────────────────────────────────────── */
const ViewAllCard: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
    className="group cursor-pointer select-none h-full hidden lg:block"
  >
    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 flex flex-col h-full min-h-[160px] sm:min-h-[180px] group-hover:bg-primary-100 transition-colors duration-200">
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h6v6H4zM14 6h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>
        </svg>
      </div>
      <div className="w-5 h-0.5 bg-primary-400 rounded-full mt-3" />
      <p className="mt-3 flex-1 text-primary-600 font-bold text-sm sm:text-base leading-snug">
        {label}
      </p>
      <div className="mt-4 flex justify-end">
        <span className="text-primary-400 text-xl font-light leading-none group-hover:text-primary-600 transition-colors duration-200">
          →
        </span>
      </div>
    </div>
  </div>
);

/* ── Tab icons ────────────────────────────────────────────── */
const IndustriesIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-primary-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 9h2m4 0h2M9 13h2m4 0h2M9 17h2m4 0h2"/>
  </svg>
);

const FamiliesIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-4 h-4 ${active ? 'text-white' : 'text-primary-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
  </svg>
);

/* ── Main component ───────────────────────────────────────── */
const Categories: React.FC = () => {
  const { industriesLoading, familiesLoading, industries, productFamilies } = useSharedState();
  const [selectedCategory, setSelectedCategory] = useState<string>('industries');
  const isMobile = useIsMobile();
  const router = useRouter();

  const displayedItems = useMemo(() => {
    const data = selectedCategory === 'industries' ? industries : productFamilies;
    const sliced = data.length > 9 ? data.slice(0, 9) : data;
    return isMobile ? sliced.slice(0, 4) : sliced;
  }, [selectedCategory, isMobile, industries, productFamilies]);

  const totalCount = selectedCategory === 'industries' ? industries.length : productFamilies.length;
  const shouldShowViewAll = totalCount > 9 && !isMobile;

  const viewAllPath = selectedCategory === 'industries' ? '/industries' : '/product-families';
  const viewAllLabel = `View All ${selectedCategory === 'industries' ? 'Industries' : 'Product Families'}`;

  return (
    <section className="relative overflow-hidden" style={{ background: '#f5faf5' }}>

      {/* Dot-grid — top-right, behind skyline */}
      <Image
        src="/categories-section/dot-grid.png"
        alt="" aria-hidden="true"
        width={260} height={260}
        className="absolute top-0 right-0 opacity-40 hidden lg:block pointer-events-none select-none mix-blend-multiply"
      />

      {/* Molecule — top-left, seamlessly blended */}
      <Image
        src="/categories-section/molecule.png"
        alt="" aria-hidden="true"
        width={240} height={240}
        className="absolute -top-4 -left-4 hidden lg:block pointer-events-none select-none mix-blend-multiply opacity-90"
      />

      {/* Wave-lines — bottom centre */}
      <Image
        src="/categories-section/wave-lines.png"
        alt="" aria-hidden="true"
        width={700} height={110}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-25 hidden lg:block pointer-events-none select-none mix-blend-multiply"
        style={{ width: '52%' }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-20">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="text-center space-y-3 sm:space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-primary-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest">
                Our Product Ecosystem
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-gray-900">Discover </span>
              <span className="text-primary-500">Our Products</span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed">
              Explore our comprehensive range of polymer products across various industries and product families
            </p>
          </div>

          {/* ── Tab switcher ────────────────────────────────────── */}
          <div className="flex items-center bg-white rounded-2xl p-1.5 gap-1 shadow-sm border border-gray-100">
            {[
              { id: 'industries', label: 'Product Industries', Icon: IndustriesIcon },
              { id: 'families',   label: 'Product Families',  Icon: FamiliesIcon   },
            ].map(({ id, label, Icon }) => {
              const active = selectedCategory === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none whitespace-nowrap
                    ${active
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-primary-700 hover:bg-primary-50'
                    }`}
                >
                  <Icon active={active} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Grid ────────────────────────────────────────────── */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">

              {/* Loading skeletons */}
              {(industriesLoading || familiesLoading) &&
                Array.from({ length: isMobile ? 4 : 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-[160px] sm:h-[180px] rounded-2xl" />
                ))}

              {/* Category cards */}
              {displayedItems.map((item, index) => (
                <CategoryCard
                  key={item?._id || index}
                  name={item?.name}
                  icon={item?.icon}
                  id={item?._id}
                  index={index}
                  selectedCategory={selectedCategory}
                />
              ))}

              {/* View all card (desktop) */}
              {shouldShowViewAll && (
                <ViewAllCard
                  label={viewAllLabel}
                  onClick={() => router.push(viewAllPath)}
                />
              )}
            </div>
          </div>

          {/* ── Mobile view-all button ──────────────────────────── */}
          {isMobile && (
            <button
              onClick={() => router.push(viewAllPath)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-sm"
            >
              {viewAllLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          )}

          {/* ── Bottom sustainability tagline ───────────────────── */}
          <div className="flex items-center gap-2 pt-2 sm:pt-4 border-t border-primary-100 w-full justify-center">
            <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s2-4 7-4c0 0-2 6-7 6 0 0 .5-2 2-3 0 0-5 1-5 6 0 0-2.5-1-3-3.5z"/>
            </svg>
            <p className="text-xs sm:text-sm text-gray-500 text-center">
              <span className="font-bold text-primary-600">Sustainable by nature.</span>
              {' '}Building a better tomorrow with innovative polymer solutions.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Categories;
