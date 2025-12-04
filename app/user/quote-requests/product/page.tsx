"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Package, Calendar, Eye, MapPin, Search, FileText } from "lucide-react";
import { GenericTable, Column } from '@/components/shared/GenericTable';
import { FilterBar } from '@/components/shared/FilterBar';
import { StatsCard } from '@/components/shared/StatsCard';
import { getBuyerProductQuotes } from '@/apiServices/user';
import { toast } from 'sonner';
import type { 
  BuyerProductQuoteRequest, 
  BuyerProductQuotesApiResponse, 
  StatusConfigMap 
} from '@/types/productQuote';

const ProductQuoteRequests = () => {
  const [requests, setRequests] = useState<BuyerProductQuoteRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const pageSize = 10;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    
    try {
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response: BuyerProductQuotesApiResponse = await getBuyerProductQuotes(params);
      
      if (response.success) {
        setRequests(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalRequests(response.pagination.total);
      } else {
        toast.error('Failed to fetch product quote requests');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch product quote requests';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  }, []);

  const STATUS_CONFIG: StatusConfigMap = {
    pending: { badge: "bg-amber-100 text-amber-700 border border-amber-200", text: "Pending" },
    responded: { badge: "bg-primary-50 text-primary-600 border border-primary-500/30", text: "Responded" },
    accepted: { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", text: "Accepted" },
    rejected: { badge: "bg-red-100 text-red-700 border border-red-200", text: "Rejected" },
    cancelled: { badge: "bg-gray-100 text-gray-700 border border-gray-200", text: "Cancelled" },
  };

  const getStatusBadge = (status: string) => 
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.badge || "bg-gray-100 text-gray-700 border border-gray-200";

  const getStatusText = (status: string) => 
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.text || "Unknown";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const statusOptions = [
    { value: "all", label: "All Requests" },
    ...Object.keys(STATUS_CONFIG).map(key => ({
      value: key,
      label: STATUS_CONFIG[key as keyof typeof STATUS_CONFIG].text,
    })),
  ];

  const stats = useMemo(() => {
    const statusCounts = requests.reduce((acc, req) => {
      acc[req.currentStatus] = (acc[req.currentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalRequests,
      pending: statusCounts.pending || 0,
      responded: statusCounts.responded || 0,
      accepted: statusCounts.accepted || 0,
      rejected: statusCounts.rejected || 0,
      cancelled: statusCounts.cancelled || 0,
    };
  }, [totalRequests, requests]);

  const activeFilters = useMemo(() => {
    const filters: Array<{
      type: 'search' | 'status';
      label: string;
      value: string;
      onRemove: () => void;
    }> = [];
    
    if (searchTerm) {
      filters.push({
        type: 'search',
        label: 'Search',
        value: searchTerm,
        onRemove: () => setSearchTerm(''),
      });
    }
    
    if (statusFilter !== 'all') {
      filters.push({
        type: 'status',
        label: 'Status',
        value: statusOptions.find(opt => opt.value === statusFilter)?.label || statusFilter,
        onRemove: () => setStatusFilter('all'),
      });
    }
    
    return filters;
  }, [searchTerm, statusFilter, statusOptions]);

  const columns: Column<BuyerProductQuoteRequest>[] = [
    {
      key: 'product',
      label: 'Product',
      render: (request) => (
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            {request.productId.productImages?.[0]?.fileUrl ? (
              <img 
                src={request.productId.productImages[0].fileUrl} 
                alt={request.productId.productName || 'Product'}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <Package className="w-6 h-6 text-primary-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            {request.productId.productName && (
              <p className="font-medium text-gray-900 truncate">{request.productId.productName}</p>
            )}
            {request.productId.chemicalName && (
              <p className="text-sm text-gray-500 truncate">{request.productId.chemicalName}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (request) => (
        request.sellerId ? (
          <div>
            <p className="font-medium text-gray-900">
              {`${request.sellerId.firstName} ${request.sellerId.lastName}`}
            </p>
            {request.sellerId.company && (
              <p className="text-sm text-gray-500">{request.sellerId.company}</p>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">Not available</span>
        )
      ),
    },
    {
      key: 'details',
      label: 'Request Details',
      render: (request) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">
              {request.desiredQuantity.toLocaleString()} {request.uom || 'units'}
            </span>
          </div>
          {request.shippingCountry && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{request.shippingCountry}</span>
            </div>
          )}
          {request.gradeId?.name && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{request.gradeId.name}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (request) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.currentStatus)}`}>
          {getStatusText(request.currentStatus)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Requested',
      render: (request) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {formatDate(request.createdAt)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (request) => (
        <Link
          href={`/user/quote-requests/product/${request._id}`}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Quote Requests</h1>
          <p className="text-gray-600">Manage and track your product quote requests</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            <StatsCard label="Total" value={stats.total} />
            <StatsCard label="Pending" value={stats.pending} colorClass="text-amber-600" />
            <StatsCard label="Responded" value={stats.responded} colorClass="text-primary-600" />
            <StatsCard label="Accepted" value={stats.accepted} colorClass="text-emerald-600" />
            <StatsCard label="Rejected" value={stats.rejected} colorClass="text-red-600" />
            <StatsCard label="Cancelled" value={stats.cancelled} colorClass="text-gray-600" />
          </div>
        </div>

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          statusOptions={statusOptions}
          onStatusChange={handleStatusFilter}
          onClearFilters={handleClearFilters}
          activeFilters={activeFilters}
        />

        {/* Table Section */}
        <GenericTable<BuyerProductQuoteRequest>
          columns={columns}
          data={requests}
          loading={loading}
          emptyState={{
            icon: searchTerm || statusFilter !== "all" 
              ? <Search className="w-6 h-6 text-gray-400" />
              : <Package className="w-6 h-6 text-gray-400" />,
            title: searchTerm || statusFilter !== "all" 
              ? "No matching product quote requests" 
              : "No product quote requests yet",
            description: searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Your product quote requests will appear here once you request quotes from products",
          }}
          pagination={{
            currentPage,
            totalPages,
            totalItems: totalRequests,
            pageSize,
            onPageChange: handlePageChange,
          }}
        />
      </div>
    </div>
  );
};

export default ProductQuoteRequests;
