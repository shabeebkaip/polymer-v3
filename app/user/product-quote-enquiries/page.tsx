'use client';

import {
  Package,
  Calendar,
  Building2,
  AlertCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSellerProductQuoteRequests } from '@/apiServices/user';
import { GenericTable, Column } from '@/components/shared/GenericTable';
import { FilterBar, FilterOption, ActiveFilter } from '@/components/shared/FilterBar';
import { getStatusConfig } from '@/lib/config/status.config';

interface ProductQuoteEnquiry {
  _id: string;
  productId: {
    _id: string;
    productName: string;
    chemicalName?: string;
    tradeName?: string;
    countryOfOrigin?: string;
    productImages?: Array<{ fileUrl: string; _id: string }>;
  };
  buyerId: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone?: number;
    address?: string;
  };
  sellerId: string;
  desiredQuantity: number;
  uom?: string;
  shippingCountry?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  deliveryDeadline?: string;
  paymentTerms?: string;
  application?: string;
  gradeId?: {
    _id: string;
    name: string;
  };
  incotermId?: {
    _id: string;
    name: string;
  };
  packagingTypeId?: {
    _id: string;
    name: string;
  };
  openRequest?: boolean;
  status: Array<{
    status: string;
    message: string;
    date: string;
    updatedBy: string;
    _id: string;
  }>;
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

const ProductQuoteEnquiries = () => {
  const router = useRouter();

  // State
  const [enquiries, setEnquiries] = useState<ProductQuoteEnquiry[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Pagination helpers
  const totalPages = meta?.pagination?.totalPages || 1;
  const totalRequests = meta?.pagination?.total || 0;

  // Status summary
  const [statusSummary, setStatusSummary] = useState<Record<string, number>>({});

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

        const response = await getSellerProductQuoteRequests(params);
        
        setEnquiries(response.data || []);
        setMeta({ pagination: response.pagination });
        setStatusSummary(response.statusSummary || {});
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching product quote enquiries:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product quote enquiries');
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  // Clear filters function
  const handleClearFilters = (): void => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Filter options for status
  const statusOptions: FilterOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Responded', value: 'responded' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  // Active filters
  const activeFilters: ActiveFilter[] = [];
  if (searchTerm) {
    activeFilters.push({
      type: 'search',
      label: 'Search',
      value: searchTerm,
      onRemove: () => setSearchTerm(''),
    });
  }
  if (statusFilter !== 'all') {
    activeFilters.push({
      type: 'status',
      label: 'Status',
      value: statusFilter,
      onRemove: () => setStatusFilter('all'),
    });
  }

  // Table columns
  const columns: Column<ProductQuoteEnquiry>[] = [
    {
      key: 'product',
      label: 'Product',
      render: (enquiry) => (
        <div className="flex items-center gap-3">
          {enquiry.productId?.productImages?.[0] && (
            <Image
              src={enquiry.productId.productImages[0].fileUrl}
              alt={enquiry.productId.productName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200"
            />
          )}
          <div>
            <div className="font-medium text-gray-900">
              {enquiry.productId?.productName || 'N/A'}
            </div>
            {(enquiry.productId?.tradeName || enquiry.productId?.chemicalName) && (
              <div className="text-xs text-gray-500">
                {enquiry.productId.tradeName || enquiry.productId.chemicalName}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (enquiry) => (
        <div className="text-gray-900">
          <span className="font-semibold">{enquiry.desiredQuantity?.toLocaleString()}</span>
          {enquiry.uom && <span className="text-gray-500 ml-1">{enquiry.uom}</span>}
        </div>
      ),
    },
    {
      key: 'buyer',
      label: 'Buyer',
      render: (enquiry) => (
        <div>
          <div className="font-medium text-gray-900">{enquiry.buyerId?.company || 'N/A'}</div>
          <div className="text-sm text-gray-600">
            {enquiry.buyerId ? `${enquiry.buyerId.firstName} ${enquiry.buyerId.lastName}` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'shippingCountry',
      label: 'Shipping',
      render: (enquiry) => (
        <span className="text-gray-900">
          {enquiry.shippingCountry || 'N/A'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (enquiry) => (
        <div className="flex items-center gap-2 text-gray-900">
          <Calendar className="w-4 h-4 text-gray-400" />
          {new Date(enquiry.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (enquiry) => {
        const statusConfig = getStatusConfig(enquiry.currentStatus);
        const StatusIcon = statusConfig.icon;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.text}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (enquiry) => (
        <button
          onClick={() => router.push(`/user/product-quote-enquiries/${enquiry._id}`)}
          className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-primary-600" />
        </button>
      ),
    },
  ];

  // Stats for cards
  const pendingCount = statusSummary.pending || 0;
  const respondedCount = statusSummary.responded || 0;
  const acceptedCount = statusSummary.accepted || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Quote Enquiries</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage quote requests for your products
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">{totalRequests}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-yellow-600 font-medium">Pending</div>
                  <div className="text-2xl font-bold text-yellow-800 mt-1">{pendingCount}</div>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-4 border border-primary-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-primary-600 font-medium">Responded</div>
                  <div className="text-2xl font-bold text-primary-600 mt-1">{respondedCount}</div>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-600 font-medium">Accepted</div>
                  <div className="text-2xl font-bold text-green-800 mt-1">{acceptedCount}</div>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          statusOptions={statusOptions}
          activeFilters={activeFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Table */}
        <GenericTable
          data={enquiries}
          columns={columns}
          loading={loading}
          emptyState={
            error
              ? {
                  icon: <AlertCircle className="w-16 h-16 text-red-500" />,
                  title: 'Error Loading Data',
                  description: error,
                }
              : {
                  icon: <Package className="w-16 h-16 text-gray-400" />,
                  title: 'No Product Quote Enquiries',
                  description: 'You haven\'t received any quote requests for your products yet.',
                }
          }
          pagination={{
            currentPage,
            totalPages,
            pageSize,
            totalItems: totalRequests,
            onPageChange: setCurrentPage,
          }}
          resultsHeader={{
            title: 'Product Quote Enquiries',
            isFiltered: searchTerm !== '' || statusFilter !== 'all',
            totalCount: totalRequests,
          }}
        />
      </div>
    </div>
  );
};

export default ProductQuoteEnquiries;
