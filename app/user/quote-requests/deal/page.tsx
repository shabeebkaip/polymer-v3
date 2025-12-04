"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, Calendar, Eye, MapPin, DollarSign, Package, Truck, Search } from "lucide-react";
import { GenericTable, Column } from '@/components/shared/GenericTable';
import { FilterBar } from '@/components/shared/FilterBar';
import { DealQuoteRequestsHeader } from '@/components/user/deal-quote-requests';
import { getBuyerDealQuoteRequests } from '@/apiServices/user';
import { toast } from 'sonner';

interface DealQuoteRequest {
  _id: string;
  status: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  seller: {
    _id: string;
    name: string;
    email: string;
    phone?: number;
    company?: string;
  } | null;
  deal: {
    _id: string;
    productName?: string;
    productImage?: string | null;
  };
  orderDetails: {
    quantity: number;
    shippingCountry: string;
    paymentTerms: string;
    deliveryDeadline: string;
  };
  sellerResponse?: {
    message?: string;
    quotedPrice?: number;
    quotedQuantity?: number;
    estimatedDelivery?: string;
    respondedAt?: string;
    quotationDocument?: any;
  };
  statusHistory: Array<{
    status: string;
    message: string;
    date: string;
    updatedBy: string;
    _id: string;
  }>;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: DealQuoteRequest[];
  meta: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

const DealQuoteRequests = () => {
  const router = useRouter();
  
  const [requests, setRequests] = useState<DealQuoteRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const pageSize = 10;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response: ApiResponse = await getBuyerDealQuoteRequests(params);
      
      if (response.success) {
        setRequests(response.data);
        setTotalPages(response.meta.pagination.totalPages);
        setTotalRequests(response.meta.pagination.totalItems);
      } else {
        setError(response.message || 'Failed to fetch deal quote requests');
        toast.error('Failed to fetch deal quote requests');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch deal quote requests';
      setError(errorMessage);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border border-amber-200";
      case "responded": return "bg-primary-50 text-primary-600 border border-primary-500/30";
      case "accepted": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "rejected": return "bg-red-100 text-red-700 border border-red-200";
      case "cancelled": return "bg-gray-100 text-gray-700 border border-gray-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "responded": return "Responded";
      case "accepted": return "Accepted";
      case "rejected": return "Rejected";
      case "cancelled": return "Cancelled";
      default: return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const stats = useMemo(() => ({
    total: totalRequests,
    pending: requests.filter(req => req.status === 'pending').length,
    responded: requests.filter(req => req.status === 'responded').length,
    accepted: requests.filter(req => req.status === 'accepted').length,
    rejected: requests.filter(req => req.status === 'rejected').length,
    cancelled: requests.filter(req => req.status === 'cancelled').length,
  }), [totalRequests, requests]);

  const statusOptions = [
    { value: "all", label: "All Requests" },
    { value: "pending", label: "Pending" },
    { value: "responded", label: "Responded" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" },
  ];

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

  const columns: Column<DealQuoteRequest>[] = [
    {
      key: 'deal',
      label: 'Deal',
      render: (request) => (
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            {request.deal.productImage ? (
              <img 
                src={request.deal.productImage} 
                alt={request.deal.productName || 'Product'}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <Gift className="w-6 h-6 text-primary-500" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            {request.deal.productName && (
              <p className="font-medium text-gray-900 truncate">{request.deal.productName}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'seller',
      label: 'Seller',
      render: (request) => (
        request.seller ? (
          <div>
            <p className="font-medium text-gray-900">{request.seller.name}</p>
            {request.seller.company && (
              <p className="text-sm text-gray-500">{request.seller.company}</p>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">Not assigned</span>
        )
      ),
    },
    {
      key: 'orderDetails',
      label: 'Order Details',
      render: (request) => (
        <div className="space-y-1">
          {request.orderDetails?.quantity && (
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{request.orderDetails.quantity.toLocaleString()} units</span>
            </div>
          )}
          {request.orderDetails?.shippingCountry && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{request.orderDetails.shippingCountry}</span>
            </div>
          )}
          {request.orderDetails?.paymentTerms && (
            <div className="flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{request.orderDetails.paymentTerms}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (request) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
          {getStatusText(request.status)}
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
        <button
          onClick={() => router.push(`/user/quote-requests/deal/${request._id}`)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 ">
        <DealQuoteRequestsHeader
          totalRequests={totalRequests}
          pendingCount={stats.pending}
          respondedCount={stats.responded}
          acceptedCount={stats.accepted}
        />

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
        <GenericTable<DealQuoteRequest>
          columns={columns}
          data={requests}
          loading={loading}
          emptyState={{
            icon: searchTerm || statusFilter !== "all" 
              ? <Search className="w-6 h-6 text-gray-400" />
              : <Gift className="w-6 h-6 text-gray-400" />,
            title: searchTerm || statusFilter !== "all" 
              ? "No matching deal quote requests" 
              : "No deal quote requests yet",
            description: searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Your deal quote requests will appear here once you request quotes from special deals",
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

export default DealQuoteRequests;
