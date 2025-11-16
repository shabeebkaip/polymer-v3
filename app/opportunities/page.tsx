'use client';
import React, { useState, useMemo } from 'react';
import { useSharedState } from '@/stores/sharedStore';
import { useUserInfo } from '@/lib/useUserInfo';
import { Request } from '@/types/home';
import RequestCard from '@/components/home/RequestCard';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Users,
  AlertCircle,
  Clock,
  Package
} from 'lucide-react';

const OpportunitiesPage = () => {
  const { buyerOpportunities, buyerOpportunitiesLoading } = useSharedState();
  const { user } = useUserInfo();
  const userType = user?.user_type;
  const isGuest = !user;
  const isBuyer = Boolean(user && userType === 'buyer');
  const isSeller = Boolean(user && userType === 'seller');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Transform API data
  const allRequests = useMemo<Request[]>(() => {
    try {
      let dataArray: { priority?: string; deadline: string; [key: string]: unknown }[] = [];
      
      if (buyerOpportunities && typeof buyerOpportunities === 'object') {
        if ('data' in buyerOpportunities && Array.isArray((buyerOpportunities as { data: unknown[] }).data)) {
          dataArray = (buyerOpportunities as { data: { priority?: string; deadline: string; [key: string]: unknown }[] }).data;
        } else if (Array.isArray(buyerOpportunities)) {
          dataArray = buyerOpportunities as { priority?: string; deadline: string; [key: string]: unknown }[];
        }
      }
      
      if (dataArray.length > 0) {
        return dataArray.map((item) => {
          const priority = item.priority?.toLowerCase() || 'normal';
          const deliveryDate = new Date(item.deadline);
          const daysUntilDelivery = Math.ceil((deliveryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          let urgency: "low" | "medium" | "high" = "medium";
          if (priority === 'high' || daysUntilDelivery <= 7) {
            urgency = "high";
          } else if (priority === 'normal' && daysUntilDelivery <= 30) {
            urgency = "medium";
          } else {
            urgency = "low";
          }

          return {
            id: String(item.id || item._id || Math.random()),
            type: "buyer-request" as const,
            title: `${item.productName || 'Product Request'} - Buyer Opportunity`,
            buyer: {
              company: (item.buyer as { company?: string })?.company || "Anonymous Company",
              location: (item.buyer as { location?: string })?.location || (item.city && item.country ? `${item.city}, ${item.country}` : "Location not specified"),
              verified: (item.buyer as { isVerified?: boolean })?.isVerified || false,
              name: (item.buyer as { name?: string })?.name
            },
            product: String(item.productName || "Product"),
            quantity: item.uom ? `${item.quantity} ${item.uom}` : `${item.quantity || 'N/A'}`,
            budget: "Contact for quote",
            deadline: item.deadline,
            description: String(item.description || `Buyer opportunity for ${item.productName || 'product'}${item.destination ? '. Delivery to ' + item.destination : ''}.`),
            urgency: urgency,
            responses: (item.responses as { count?: number })?.count || 0,
            destination: item.destination as string | undefined,
            sellerStatus: item.sellerStatus as string | undefined,
            requestDocument: item.request_document as string | undefined,
            createdAt: item.createdAt as string | undefined,
            priority: item.priority as string | undefined,
            tradeName: item.tradeName as string | undefined,
            chemicalName: item.chemicalName as string | undefined,
            daysLeft: daysUntilDelivery
          };
        });
      }
      return [];
    } catch (error) {
      console.error('Error processing opportunities:', error);
      return [];
    }
  }, [buyerOpportunities]);

  // Filter and search
  const filteredRequests = useMemo(() => {
    let requests = [...allRequests];

    // Apply search
    if (searchQuery.trim()) {
      requests = requests.filter(
        (req) =>
          req.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.buyer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (req.destination && req.destination.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply urgency filter
    if (selectedFilter !== 'all') {
      requests = requests.filter((req) => req.urgency === selectedFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        requests.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'deadline':
        requests.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'urgency':
        const urgencyOrder = { high: 0, medium: 1, low: 2 };
        requests.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
        break;
      case 'responses':
        requests.sort((a, b) => a.responses - b.responses);
        break;
    }

    return requests;
  }, [allRequests, searchQuery, selectedFilter, sortBy]);

  const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-primary-50 text-primary-600 border-primary-200";
    }
  };

  // Redirect buyers
  if (isBuyer) {
    return null;
  }

  const filterOptions = [
    { value: 'all', label: 'All Opportunities', icon: Users, count: allRequests.length },
    { value: 'high', label: 'High Priority', icon: AlertCircle, count: allRequests.filter(r => r.urgency === 'high').length },
    { value: 'medium', label: 'Medium Priority', icon: Clock, count: allRequests.filter(r => r.urgency === 'medium').length },
    { value: 'low', label: 'Low Priority', icon: Package, count: allRequests.filter(r => r.urgency === 'low').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                <Users className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Buyer Opportunities
              </h1>
            </div>
            <p className="text-lg md:text-xl text-primary-50 mb-8">
              Active opportunities from verified buyers seeking suppliers
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product, company, or destination..."
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

              {/* Urgency Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-700 mb-3">Urgency</h3>
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
                  <option value="deadline">Closest Deadline</option>
                  <option value="urgency">Highest Urgency</option>
                  <option value="responses">Least Responses</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {filteredRequests.length} {filteredRequests.length === 1 ? 'Opportunity' : 'Opportunities'} Found
                </h2>
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-1">
                    Searching for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {buyerOpportunitiesLoading && allRequests.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow border p-5 animate-pulse">
                    <div className="bg-gray-200 h-8 rounded mb-3"></div>
                    <div className="bg-gray-100 h-4 rounded mb-2"></div>
                    <div className="bg-gray-100 h-4 rounded w-3/4 mb-4"></div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-100 h-12 rounded"></div>
                      <div className="bg-gray-100 h-12 rounded"></div>
                    </div>
                    <div className="bg-gray-200 h-10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <RequestCard
                    key={request.id as string}
                    request={request}
                    getUrgencyColor={getUrgencyColor}
                    isGuest={isGuest}
                    isSeller={isSeller}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Opportunities Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Check back later for new buyer opportunities'}
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

export default OpportunitiesPage;
