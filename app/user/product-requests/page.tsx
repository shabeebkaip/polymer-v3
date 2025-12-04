"use client";

import React, { useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Calendar, Eye, MapPin, Globe } from "lucide-react";
import { useProductRequestsListStore } from "@/stores/user";
import { GenericTable, Column } from '@/components/shared/GenericTable';
import { FilterBar } from '@/components/shared/FilterBar';
import { ProductRequestsHeader } from '@/components/user/product-requests';
import type { ProductRequestListItem } from '@/types/userRequests';

const ProductRequests = () => {
  const router = useRouter();
  
  const {
    requests: productRequests,
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    totalPages,
    totalRequests,
    pageSize,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    fetchProductRequests,
    clearFilters
  } = useProductRequestsListStore();

  useEffect(() => {
    fetchProductRequests({ 
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      forceRefresh: true
    });
  }, [currentPage, pageSize, searchTerm, statusFilter, fetchProductRequests]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, [setSearchTerm, setCurrentPage]);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, [setStatusFilter, setCurrentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border border-amber-200";
      case "accepted": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "in_progress": return "bg-teal-100 text-teal-700 border border-teal-200";
      case "shipped": return "bg-green-100 text-green-700 border border-green-200";
      case "delivered": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "completed": return "bg-green-100 text-green-700 border border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border border-red-200";
      case "cancelled": return "bg-gray-100 text-gray-700 border border-gray-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "accepted": return "Accepted";
      case "in_progress": return "In Progress";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "completed": return "Completed";
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
    pending: productRequests.filter(req => req.sellerStatus === 'pending').length,
    accepted: productRequests.filter(req => req.sellerStatus === 'accepted').length,
    in_progress: productRequests.filter(req => req.sellerStatus === 'in_progress').length,
    shipped: productRequests.filter(req => req.sellerStatus === 'shipped').length,
    delivered: productRequests.filter(req => req.sellerStatus === 'delivered').length,
    completed: productRequests.filter(req => req.sellerStatus === 'completed').length,
    rejected: productRequests.filter(req => req.sellerStatus === 'rejected').length,
    cancelled: productRequests.filter(req => req.sellerStatus === 'cancelled').length,
  }), [totalRequests, productRequests]);

  const filters = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const columns: Column<ProductRequestListItem>[] = [
    {
      key: 'product',
      label: 'Product',
      render: (request) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm line-clamp-1">
              {request.product.productName}
            </p>
            <p className="text-xs text-gray-600">
              {request.product.createdBy.company}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (request) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 text-sm">
            {request.quantity?.toLocaleString() || "N/A"}
          </span>
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{request.uom}</span>
        </div>
      )
    },
    {
      key: 'destination',
      label: 'Destination',
      render: (request) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-gray-900 text-sm">
            <MapPin className="w-3 h-3 text-gray-400" />
            {request.destination}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Globe className="w-3 h-3" />
            {request.city}, {request.country}
          </div>
        </div>
      )
    },
    {
      key: 'delivery_date',
      label: 'Delivery Date',
      render: (request) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm">
            {formatDate(request.delivery_date)}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (request) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.sellerStatus)}`}>
          {getStatusText(request.sellerStatus)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (request) => (
        <button
          onClick={() => router.push(`/user/product-requests/${request._id}`)}
          className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-green-600" />
        </button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 ">
        <ProductRequestsHeader stats={stats} />

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          statusOptions={filters}
          onStatusChange={handleStatusFilter}
          onClearFilters={clearFilters}
          activeFilters={[
            ...(searchTerm ? [{ 
              type: 'search' as const, 
              label: 'Search', 
              value: searchTerm, 
              onRemove: () => setSearchTerm('') 
            }] : []),
            ...(statusFilter !== 'all' ? [{ 
              type: 'status' as const, 
              label: filters.find(f => f.value === statusFilter)?.label || statusFilter, 
              value: statusFilter, 
              onRemove: () => setStatusFilter('all') 
            }] : [])
          ]}
        />

        <GenericTable<ProductRequestListItem>
          data={productRequests}
          columns={columns}
          loading={loading}
          emptyState={{
            icon: <Package className="w-6 h-6 text-gray-400" />,
            title: "No Requests Found",
            description: error || "No product requests match your filters."
          }}
          pagination={{
            currentPage,
            totalPages,
            pageSize,
            totalItems: totalRequests,
            onPageChange: handlePageChange
          }}
          resultsHeader={{
            title: "Product Requests",
            isFiltered: searchTerm !== '' || statusFilter !== 'all',
            totalCount: productRequests.length
          }}
        />
      </div>
    </div>
  );
};

export default ProductRequests;
