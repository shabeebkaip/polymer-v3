"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { usePromotionsStore } from '@/stores/promotionsStore';
import { Package, Eye, Edit, CheckCircle, XCircle, Clock, AlertTriangle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DealQuoteRequestCount } from '@/components/user/deal-quote-requests';
import { GenericTable, Column } from '@/components/shared/GenericTable';
import { FilterBar } from '@/components/shared/FilterBar';

interface Promotion {
  id: string;
  productName?: string;
  productId?: string;
  offerPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Promotions = () => {
  const router = useRouter();
  const {
    promotions,
    meta,
    loading,
    error,
    currentPage,
    itemsPerPage,
    fetchPromotions,
    setFilters,
    setCurrentPage,
    clearFilters,
    getPaginatedPromotions,
    getFilteredPromotions,
    getTotalPages,
  } = usePromotionsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setFilters({ search: term });
    setCurrentPage(1);
  }, [setFilters, setCurrentPage]);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setFilters({ status: status === 'all' ? '' : status });
    setCurrentPage(1);
  }, [setFilters, setCurrentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    clearFilters();
  }, [clearFilters]);

  const paginatedPromotions = getPaginatedPromotions();
  const filteredPromotions = getFilteredPromotions();
  const totalPages = getTotalPages();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'rejected':
      case 'expired':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = useMemo(() => ({
    total: meta?.summary?.total || promotions.length,
    active: meta?.summary?.active || promotions.filter((p: Promotion) => p.status === 'approved').length,
    pending: meta?.summary?.pending || promotions.filter((p: Promotion) => p.status === 'pending').length,
    rejected: promotions.filter((p: Promotion) => p.status === 'rejected').length,
  }), [meta, promotions]);

  const filters = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'approved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Expired', value: 'expired' },
  ];

  const columns: Column<Promotion>[] = [
    {
      key: 'product',
      label: 'Product',
      render: (promotion) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-primary-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm line-clamp-1">
              {promotion.productName || 'Unknown Product'}
            </p>
            <p className="text-xs text-gray-600">
              ID: {promotion.productId || 'N/A'}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'offerPrice',
      label: 'Offer Price',
      render: (promotion) => (
        <span className="font-bold text-primary-600 text-sm">
          {formatCurrency(promotion.offerPrice)}
        </span>
      )
    },
    {
      key: 'quoteRequests',
      label: 'Quote Requests',
      render: (promotion) => (
        <DealQuoteRequestCount dealId={promotion.id} />
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (promotion) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(promotion.status)}`}>
          {getStatusText(promotion.status)}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (promotion) => (
        <span className="text-gray-900 text-sm">
          {formatDate(promotion.createdAt)}
        </span>
      )
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (promotion) => (
        <span className="text-gray-900 text-sm">
          {formatDate(promotion.updatedAt)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (promotion) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/user/promotions/${promotion.id}`)}
            className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-primary-600" />
          </button>
          <button
            onClick={() => router.push(`/user/promotions/${promotion.id}/edit`)}
            className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 ">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Promotions</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your special deals and promotional offers</p>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/user/promotions/add')}
              className="px-4 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Deal
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600">Total</div>
              <div className="text-lg font-bold text-gray-900">{stats.total}</div>
            </div>
            <div className="text-center px-4 py-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xs text-green-600">Active</div>
              <div className="text-lg font-bold text-green-800">{stats.active}</div>
            </div>
            <div className="text-center px-4 py-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-xs text-amber-600">Pending</div>
              <div className="text-lg font-bold text-amber-800">{stats.pending}</div>
            </div>
            <div className="text-center px-4 py-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xs text-red-600">Rejected</div>
              <div className="text-lg font-bold text-red-800">{stats.rejected}</div>
            </div>
          </div>
        </div>

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          statusOptions={filters}
          onStatusChange={handleStatusFilter}
          onClearFilters={handleClearFilters}
          activeFilters={[
            ...(searchTerm ? [{ 
              type: 'search' as const, 
              label: 'Search', 
              value: searchTerm, 
              onRemove: () => handleSearch('') 
            }] : []),
            ...(statusFilter !== 'all' ? [{ 
              type: 'status' as const, 
              label: filters.find(f => f.value === statusFilter)?.label || statusFilter, 
              value: statusFilter, 
              onRemove: () => handleStatusFilter('all') 
            }] : [])
          ]}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">Error loading promotions</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        <GenericTable<Promotion>
          data={paginatedPromotions as Promotion[]}
          columns={columns}
          loading={loading && promotions.length === 0}
          emptyState={{
            icon: <Package className="w-6 h-6 text-gray-400" />,
            title: "No Promotions Found",
            description: searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filters to find more results'
              : 'Create your first promotional deal to start attracting customers',
            action: !searchTerm && statusFilter === 'all' ? (
              <button
                onClick={() => router.push('/user/promotions/add')}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Your First Deal
              </button>
            ) : undefined
          }}
          pagination={{
            currentPage,
            totalPages,
            pageSize: itemsPerPage,
            totalItems: filteredPromotions.length,
            onPageChange: handlePageChange
          }}
          resultsHeader={{
            title: "Promotional Deals",
            isFiltered: searchTerm !== '' || statusFilter !== 'all',
            totalCount: paginatedPromotions.length
          }}
        />
      </div>
    </div>
  );
};

export default Promotions;