'use client';
import React, { useState, useMemo } from 'react';
import { useSharedState } from '@/stores/sharedStore';
import { useUserInfo } from '@/lib/useUserInfo';
import { Deal, ApiDeal } from '@/types/home';
import { FALLBACK_COMPANY_IMAGE } from '@/lib/fallbackImages';
import DealCard from '@/components/home/DealCard';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Package,
  TrendingDown,
  Flame,
  Sparkles,
  Gift
} from 'lucide-react';

const DealsPage = () => {
  const { suppliersSpecialDeals, suppliersSpecialDealsLoading } = useSharedState();
  const { user: currentUser } = useUserInfo();
  const userType = currentUser?.user_type;
  const isGuest = !currentUser;
  const isBuyer = Boolean(currentUser && userType === 'buyer');
  const isSupplier = Boolean(currentUser && userType === 'seller');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Transform API data
  const allDeals = useMemo<Deal[]>(() => {
    try {
      if (Array.isArray(suppliersSpecialDeals) && suppliersSpecialDeals.length > 0) {
        return suppliersSpecialDeals.map((item: ApiDeal) => {
          const originalPrice =
            typeof item.productId?.price === 'number'
              ? item.productId.price
              : parseFloat(String(item.productId?.price || '0')) || 100;
          const discountedPrice =
            typeof item.offerPrice === 'number'
              ? item.offerPrice
              : parseFloat(String(item.offerPrice || '0')) || originalPrice * 0.85;
          const discount =
            originalPrice > 0
              ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
              : 0;

          const sellerName =
            item.sellerId?.company ||
            item.sellerId?.companyName ||
            (item.sellerId?.email
              ? item.sellerId.email.split('@')[0].charAt(0).toUpperCase() +
                item.sellerId.email.split('@')[0].slice(1)
              : 'Supplier Company');

          return {
            id: item._id || `deal-${Date.now()}-${Math.random()}`,
            type: 'special-deal',
            title: `${item.productId?.productName || 'Special Product'} - Limited Offer`,
            supplier: {
              name: sellerName,
              logo: item.sellerId?.company_logo || FALLBACK_COMPANY_IMAGE,
              rating: 4.5,
              location:
                item.sellerId?.location || item.sellerId?.address || 'Location not specified',
            },
            product: item.productId?.productName || 'Special Product',
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            discount: Math.max(discount, 0),
            minQuantity: item.minimumQuantity || '1 Unit',
            validUntil:
              item.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            description:
              item.productId?.description ||
              `Special deal on ${
                item.productId?.productName || 'product'
              } with attractive pricing.`,
            badge:
              item.adminNote && item.adminNote.trim()
                ? 'FEATURED'
                : discount > 20
                  ? 'FLASH DEAL'
                  : discount > 10
                    ? 'BULK OFFER'
                    : 'HOT DEAL',
            dealStatus: item.status,
            dealType: item.dealType,
            createdAt: item.createdAt,
          };
        });
      }
      return [];
    } catch (error) {
      console.error('Error processing deals:', error);
      return [];
    }
  }, [suppliersSpecialDeals]);

  // Filter and search
  const filteredDeals = useMemo(() => {
    let deals = [...allDeals];

    // Apply search
    if (searchQuery.trim()) {
      deals = deals.filter(
        (deal) =>
          deal.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply badge filter
    if (selectedFilter !== 'all') {
      deals = deals.filter((deal) => deal.badge === selectedFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        deals.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'price-low':
        deals.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case 'price-high':
        deals.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case 'discount':
        deals.sort((a, b) => b.discount - a.discount);
        break;
    }

    return deals;
  }, [allDeals, searchQuery, selectedFilter, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Redirect suppliers
  if (isSupplier) {
    return null;
  }

  const filterOptions = [
    { value: 'all', label: 'All Deals', icon: Gift, count: allDeals.length },
    { value: 'FLASH DEAL', label: 'Flash Deals', icon: Flame, count: allDeals.filter(d => d.badge === 'FLASH DEAL').length },
    { value: 'FEATURED', label: 'Featured', icon: Sparkles, count: allDeals.filter(d => d.badge === 'FEATURED').length },
    { value: 'HOT DEAL', label: 'Hot Deals', icon: TrendingDown, count: allDeals.filter(d => d.badge === 'HOT DEAL').length },
    { value: 'BULK OFFER', label: 'Bulk Offers', icon: Package, count: allDeals.filter(d => d.badge === 'BULK OFFER').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                <Gift className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Special Deals
              </h1>
            </div>
            <p className="text-lg md:text-xl text-primary-50 mb-8">
              Exclusive offers and competitive prices from verified suppliers
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name, supplier, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-primary-600" />
                <h2 className="font-bold text-lg text-gray-900">Filters</h2>
              </div>

              {/* Deal Type Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Deal Type</h3>
                <div className="space-y-2">
                  {filterOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedFilter(option.value)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                          selectedFilter === option.value
                            ? 'bg-primary-50 text-primary-700 border border-primary-200'
                            : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium">
                          <Icon className="w-4 h-4" />
                          {option.label}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          selectedFilter === option.value
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {option.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="discount">Highest Discount</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredDeals.length} {filteredDeals.length === 1 ? 'Deal' : 'Deals'} Found
                </h2>
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-1">
                    Searching for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {suppliersSpecialDealsLoading && allDeals.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow border p-5 animate-pulse">
                    <div className="bg-gray-200 h-8 rounded mb-3"></div>
                    <div className="bg-gray-100 h-4 rounded mb-2"></div>
                    <div className="bg-gray-100 h-4 rounded w-3/4 mb-4"></div>
                    <div className="flex gap-2 mb-3">
                      <div className="bg-gray-200 h-6 rounded flex-1"></div>
                      <div className="bg-gray-100 h-6 rounded w-16"></div>
                    </div>
                    <div className="bg-gray-200 h-10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                    isGuest={isGuest}
                    isBuyer={isBuyer}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Deals Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Check back later for new exclusive deals'}
                </p>
                {(searchQuery || selectedFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                    }}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
