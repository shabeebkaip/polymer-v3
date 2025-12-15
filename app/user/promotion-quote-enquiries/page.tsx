'use client';

import {
  ShoppingCart,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  DollarSign,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSellerDealQuoteEnquiries } from '@/apiServices/user';
import { usePromotionQuoteEnquiriesStore, DealQuoteEnquiry } from '@/stores/promotionQuoteEnquiriesStore';
import { GenericTable, Column } from '@/components/shared/GenericTable';
import { FilterBar, FilterOption, ActiveFilter } from '@/components/shared/FilterBar';

const PromotionQuoteEnquiries = () => {
  const router = useRouter();

  // Zustand store
  const { enquiries, meta, setEnquiries, clearEnquiries } = usePromotionQuoteEnquiriesStore();
  const [loading, setLoading] = useState<boolean>(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(meta?.filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(meta?.filters?.status || 'all');
  const [currentPage, setCurrentPage] = useState(meta?.pagination?.page || 1);
  const pageSize = 10;

  // Pagination helpers
  const totalPages = meta?.pagination?.totalPages || 1;
  const totalRequests = meta?.pagination?.total || 0;

  // Local state for debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keyboard shortcut for clearing filters (Escape key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (searchTerm || statusFilter !== 'all')) {
        handleClearFilters();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, statusFilter]);

  // Fetch data when component mounts or when filters change
  useEffect(() => {
    const fetchEnquiries = async (): Promise<void> => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: pageSize,
          ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
        };

        const response = await getSellerDealQuoteEnquiries(params);
        
        // Map API response to expected format
        const mappedData = (response.data || []).map((item: DealQuoteEnquiry) => ({
          _id: item._id,
          bestDealId: {
            _id: item.deal?._id || '',
            productName: item.deal?.product?.productName || item.deal?.productName || '',
            productImage: item.deal?.product?.productImages?.[0]?.fileUrl || item.deal?.productImage || '',
            offerPrice: item.deal?.offerPrice || item.sellerResponse?.quotedPrice,
          },
          buyerId: {
            _id: item.buyer?._id || '',
            firstName: item.buyer?.name?.split(' ')[0] || '',
            lastName: item.buyer?.name?.split(' ').slice(1).join(' ') || '',
            company: item.buyer?.company || '',
            email: item.buyer?.email || '',
            phone: item.buyer?.phone || '',
          },
          desiredQuantity: item.orderDetails?.quantity || 0,
          shippingCountry: item.orderDetails?.shippingCountry || '',
          paymentTerms: item.orderDetails?.paymentTerms || '',
          deliveryDeadline: item.orderDetails?.deliveryDeadline || '',
          message: item.message || '',
          status: item.status || 'pending',
          quotedPrice: item.sellerResponse?.quotedPrice,
          quotedQuantity: item.sellerResponse?.quotedQuantity,
          estimatedDelivery: item.sellerResponse?.estimatedDelivery,
          responseMessage: item.sellerResponse?.message,
          quotationDocument: item.sellerResponse?.quotationDocument,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        // Map pagination meta
        const mappedMeta = {
          pagination: {
            total: response.meta?.pagination?.totalItems || 0,
            page: response.meta?.pagination?.currentPage || 1,
            totalPages: response.meta?.pagination?.totalPages || 1,
            count: response.data?.length || 0,
            limit: response.meta?.pagination?.itemsPerPage || pageSize,
          },
          filters: {
            search: debouncedSearchTerm,
            status: statusFilter,
          },
        };

        setEnquiries(mappedData, mappedMeta);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load promotion quote enquiries';
        console.error('Error fetching enquiries:', errorMessage, err);
        clearEnquiries();
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [currentPage, debouncedSearchTerm, statusFilter, setEnquiries, clearEnquiries]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1 && (debouncedSearchTerm || statusFilter !== 'all')) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, statusFilter, currentPage]);

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = (): void => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const getStatusIcon = (status: string): React.ReactElement => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'responded':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'pending':
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string): string => {
    const baseClasses = 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium';

    switch (status) {
      case 'accepted':
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      case 'responded':
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'responded':
        return 'Responded';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  // Define status options for filter
  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'responded', label: 'Responded' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Define active filters for display
  const activeFilters: ActiveFilter[] = [];
  if (debouncedSearchTerm) {
    activeFilters.push({
      type: 'search',
      label: `"${debouncedSearchTerm}"`,
      value: debouncedSearchTerm,
      onRemove: () => setSearchTerm('')
    });
  }
  if (statusFilter !== 'all') {
    activeFilters.push({
      type: 'status',
      label: getStatusText(statusFilter),
      value: statusFilter,
      onRemove: () => setStatusFilter('all')
    });
  }

  // Define table columns
  const columns: Column<DealQuoteEnquiry>[] = [
    {
      key: 'index',
      label: '#',
      render: (_item, index) => (
        <span className="text-sm text-gray-600">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      key: 'promotion',
      label: 'Promotion',
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.bestDealId?.productImage ? (
            <Image
              src={item.bestDealId.productImage}
              alt={item.bestDealId?.productName || 'Product'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-green-600" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 text-sm line-clamp-1">
              {item.bestDealId?.productName || 'Unknown Promotion'}
            </p>
            {item.bestDealId?.offerPrice && (
              <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                <DollarSign className="w-3 h-3" />
                {item.bestDealId.offerPrice}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (item) => (
        <span className="font-medium text-gray-900 text-sm">
          {item.desiredQuantity?.toLocaleString() || 'N/A'}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-gray-900 text-sm font-medium">
              {`${item.buyerId?.firstName || ''} ${item.buyerId?.lastName || ''}`.trim() ||
                item.buyerId?.email ||
                'N/A'}
            </p>
            {item.buyerId?.company && (
              <p className="text-xs text-gray-600 mt-0.5">{item.buyerId.company}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '--'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span className={getStatusBadge(item.status)}>
          {getStatusIcon(item.status)}
          {getStatusText(item.status)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-center',
      render: (item) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => router.push(`/user/promotion-quote-enquiries/${item._id}`)}
            className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-green-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2.5 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Promotion Quote Enquiries
                </h1>
                <p className="text-gray-600 text-sm mt-0.5">
                  Track and manage quote requests from your promotional deals
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Total Enquiries</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalRequests}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {enquiries.filter((r) => r.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Responded</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {enquiries.filter((r) => r.status === 'responded').length}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Accepted</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {enquiries.filter((r) => r.status === 'accepted').length}
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          statusOptions={statusOptions}
          onStatusChange={setStatusFilter}
          onClearFilters={handleClearFilters}
          activeFilters={activeFilters}
          isSearching={!!debouncedSearchTerm && loading}
        />

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <GenericTable
            data={enquiries}
            columns={columns}
            loading={loading}
            emptyState={{
              icon: debouncedSearchTerm || statusFilter !== 'all'
                ? <Search className="w-6 h-6 text-gray-400" />
                : <ShoppingCart className="w-6 h-6 text-gray-400" />,
              title: debouncedSearchTerm || statusFilter !== 'all'
                ? 'No Matching Enquiries'
                : 'No Promotion Quote Enquiries',
              description: debouncedSearchTerm || statusFilter !== 'all'
                ? 'No promotion enquiries match your filters. Try adjusting your search.'
                : 'You haven\'t received any promotion quote enquiries yet.',
              action: (debouncedSearchTerm || statusFilter !== 'all') ? (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Clear Filters
                </button>
              ) : undefined
            }}
            resultsHeader={{
              title: 'Enquiries',
              isFiltered: debouncedSearchTerm !== '' || statusFilter !== 'all',
              totalCount: totalRequests
            }}
            pagination={{
              currentPage,
              totalPages,
              pageSize,
              totalItems: totalRequests,
              onPageChange: handlePageChange
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PromotionQuoteEnquiries;
