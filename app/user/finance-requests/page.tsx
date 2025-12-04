'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  Package,
} from 'lucide-react';
import { useFinanceRequestsListStore } from '@/stores/user';
import { GenericTable, Column } from '@/components/shared/GenericTable';
import { FilterBar, FilterOption, ActiveFilter } from '@/components/shared/FilterBar';
import { FinanceRequestsHeader } from '@/components/user/finance-requests';

const FinanceRequests = () => {
  const router = useRouter();
  const {
    requests: financeRequests,
    loading,
    error,
    currentPage,
    totalPages,
    totalRequests,
    pageSize,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    fetchFinanceRequests,
    clearFilters,
    reset,
  } = useFinanceRequestsListStore();

  // Local state for debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchFinanceRequests({
      page: currentPage,
      search: debouncedSearchTerm || undefined,
      status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
    });
  }, [currentPage, debouncedSearchTerm, statusFilter, fetchFinanceRequests]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handlePageClick = (page: number) => setCurrentPage(page);

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-primary-50 text-primary-600 border border-primary-500/30';
      case 'rejected':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'under_review':
        return 'Under Review';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Define status options for filter
  const statusOptions: FilterOption[] = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "under_review", label: "Under Review" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Define active filters for display
  const activeFilters: ActiveFilter[] = [];
  if (debouncedSearchTerm) {
    activeFilters.push({
      type: 'search',
      label: `"${debouncedSearchTerm}"`,
      value: debouncedSearchTerm,
      onRemove: () => setSearchTerm("")
    });
  }
  if (statusFilter && statusFilter !== "all") {
    activeFilters.push({
      type: 'status',
      label: getStatusText(statusFilter),
      value: statusFilter,
      onRemove: () => setStatusFilter("all")
    });
  }

  // Define table columns
  interface FinanceRequestItem {
    _id: string;
    productId?: { productName?: string };
    quantity?: number;
    emiMonths?: number;
    estimatedPrice: number;
    notes?: string;
    status: string;
  }

  const columns: Column<FinanceRequestItem>[] = [
    {
      key: "index",
      label: "#",
      render: (_item, index) => (
        <span className="text-sm text-gray-600">
          {((currentPage - 1) * pageSize + index + 1)}
        </span>
      ),
    },
    {
      key: "product",
      label: "Product",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm line-clamp-1">
              {item.productId?.productName || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (item) => (
        <span className="font-medium text-gray-900 text-sm">
          {item.quantity || "N/A"}
        </span>
      ),
    },
    {
      key: "emiMonths",
      label: "EMI Months",
      render: (item) => (
        <span className="font-medium text-gray-900 text-sm">
          {item.emiMonths || "N/A"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Est. Price",
      render: (item) => (
        <span className="font-medium text-gray-900 text-sm">
          {formatCurrency(item.estimatedPrice)}
        </span>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      render: (item) => (
        <span className="text-gray-700 text-sm truncate max-w-xs block" title={item.notes}>
          {item.notes || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
          {getStatusText(item.status)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-center",
      render: (item) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => router.push(`/user/finance-requests/${item._id}`)}
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
        <FinanceRequestsHeader
          totalRequests={totalRequests}
          pendingCount={financeRequests.filter(req => req.status === "pending").length}
          approvedCount={financeRequests.filter(req => req.status === "approved").length}
          rejectedCount={financeRequests.filter(req => req.status === "rejected").length}
        />

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter || "all"}
          statusOptions={statusOptions}
          onStatusChange={setStatusFilter}
          onClearFilters={clearFilters}
          activeFilters={activeFilters}
          isSearching={!!debouncedSearchTerm && loading}
        />

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <GenericTable
            data={financeRequests}
            columns={columns}
            loading={loading}
            emptyState={{
              icon: debouncedSearchTerm || statusFilter !== "all"
                ? <Search className="w-6 h-6 text-gray-400" />
                : <Package className="w-6 h-6 text-gray-400" />,
              title: debouncedSearchTerm || statusFilter !== "all"
                ? "No Matching Requests"
                : "No Finance Requests",
              description: error || (debouncedSearchTerm || statusFilter !== "all"
                ? "No finance requests match your filters. Try adjusting your search."
                : "You haven't made any finance requests yet.")
            }}
            resultsHeader={{
              title: "Finance Requests",
              isFiltered: debouncedSearchTerm !== "" || statusFilter !== "all",
              totalCount: totalRequests
            }}
            pagination={{
              currentPage,
              totalPages,
              pageSize,
              totalItems: totalRequests,
              onPageChange: setCurrentPage
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FinanceRequests;
