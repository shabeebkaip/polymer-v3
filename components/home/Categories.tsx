'use client';
import React, { useState, useMemo } from 'react';
import CategoryCard from './CategoryCard';
import { useRouter } from 'next/navigation';
import useIsMobile from '@/lib/useIsMobile';
import { Skeleton } from '../ui/skeleton';
import { useSharedState } from '@/stores/sharedStore';
import { CategoryData } from '@/types/category';

const categoryData: CategoryData[] = [
  {
    id: 'industries',
    name: 'Product Industries',
    icon: '/assets/industries-logo.png',
  },
  {
    id: 'families',
    name: 'Product Families',
    icon: '/assets/product-families-logo.png',
  },
];

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

  const shouldShowViewAll =
    (selectedCategory === 'industries' ? industries.length : productFamilies.length) > 9 &&
    !isMobile;
  return (
    <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
      <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center bg-gradient-to-r from-gray-900 via-primary-500 to-gray-900 bg-clip-text text-transparent leading-tight">
            Discover Our Products
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
            Explore our comprehensive range of polymer products across various industries and
            product families
          </p>
        </div>

        {/* Segmented tab control */}
        <div
          className="flex items-center rounded-xl p-1 gap-1"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          {categoryData.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none whitespace-nowrap
                ${selectedCategory === id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-primary-700 hover:bg-primary-100/60'
                }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Enhanced Grid Layout */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {(industriesLoading || familiesLoading) &&
              Array.from({ length: isMobile ? 4 : 10 }).map((_, index) => (
                <div key={index} className="group">
                  <Skeleton className="w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] rounded-xl sm:rounded-2xl shadow-sm" />
                </div>
              ))}

            {displayedItems.map((item, index) => (
              <CategoryCard
                key={item?._id || index}
                name={item?.name}
                id={item?._id}
                index={index}
                selectedCategory={selectedCategory}
              />
            ))}

            {shouldShowViewAll && (
              <div className="hidden lg:flex group h-full">
                <div
                  className="w-full h-full aspect-[4/3] rounded-xl sm:rounded-t-2xl sm:rounded-b-xl lg:rounded-t-3xl lg:rounded-b-2xl border-2 border-dashed border-primary-500 bg-primary-50 flex items-center justify-center gap-2 cursor-pointer hover:border-primary-600 hover:bg-primary-50 transition-all duration-300 group-hover:scale-105 p-0"
                  onClick={() =>
                    router.push(
                      selectedCategory === 'industries' ? '/industries' : '/product-families'
                    )
                  }
                >
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-primary-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold group-hover:bg-primary-600 transition-colors">
                      +
                    </div>
                    <button className="text-primary-600 text-sm lg:text-base font-semibold">
                      View All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile View All Button */}
        {isMobile && (
          <div className="w-full flex justify-center">
            <button
              onClick={() =>
                router.push(selectedCategory === 'industries' ? '/industries' : '/product-families')
              }
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              <span>
                View All {selectedCategory === 'industries' ? 'Industries' : 'Product Families'}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Enhanced Mobile Button */}
        <button
          type="button"
          className="flex md:hidden items-center gap-3 px-6 py-3 rounded-full bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={() =>
            router.push(selectedCategory === 'industries' ? '/industries' : '/product-families')
          }
        >
          <span>See More</span>
          <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Categories;
