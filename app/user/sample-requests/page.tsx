"use client";

import { Package, Calendar, Building2, AlertCircle, CheckCircle, XCircle, Clock, Search, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSampleRequestsListStore } from "@/stores/user";
import { GenericTable, Column } from "@/components/shared/GenericTable";
import { FilterBar, FilterOption, ActiveFilter } from "@/components/shared/FilterBar";
import { SampleRequestsHeader } from "@/components/user/sample-requests";

// Define types for the API response structure based on actual API data

const SampleRequest = () => {
  const router = useRouter();
  
  // Zustand store
  const {
    requests,
    loading,
    currentPage,
    totalPages,
    totalRequests,
    pageSize,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    fetchSampleRequests,
    clearFilters
  } = useSampleRequestsListStore();

  // Local state for debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

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
      if (event.key === 'Escape' && (searchTerm || statusFilter !== "all")) {
        clearFilters();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, statusFilter, clearFilters]);

  // Fetch data when component mounts or when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(statusFilter !== "all" && { status: statusFilter })
    };

    fetchSampleRequests(params);
  }, [currentPage, pageSize, debouncedSearchTerm, statusFilter, fetchSampleRequests]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1 && (debouncedSearchTerm || statusFilter !== "all")) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, statusFilter, currentPage, setCurrentPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't reset the store on unmount to preserve data when navigating back
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "sent":
        return <Package className="w-4 h-4 text-purple-500" />;
      case "responded":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "pending":
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case "cancelled":
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      case "delivered":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      case "sent":
        return `${baseClasses} bg-purple-100 text-purple-700 border border-purple-200`;
      case "responded":
        return `${baseClasses} bg-orange-100 text-orange-700 border border-orange-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "responded":
        return "Responded";
      case "sent":
        return "Sent";
      case "delivered":
        return "Delivered";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };
  // Define status options for filter
  const statusOptions: FilterOption[] = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "responded", label: "Responded" },
    { value: "sent", label: "Sent" },
    { value: "delivered", label: "Delivered" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
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
  if (statusFilter !== "all") {
    activeFilters.push({
      type: 'status',
      label: getStatusText(statusFilter),
      value: statusFilter,
      onRemove: () => setStatusFilter("all")
    });
  }

  // Define table columns
  interface SampleRequestItem {
    _id: string;
    product?: { productName?: string; createdBy?: { company?: string } };
    grade?: { name?: string };
    quantity?: number;
    uom?: string;
    createdAt?: string;
    status: string;
  }

  const columns: Column<SampleRequestItem>[] = [
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
              {item.product?.productName || "N/A"}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {item.grade?.name || "N/A"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 text-sm">
            {item.quantity || "N/A"}
          </span>
          {item.uom && (
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              {item.uom}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "company",
      label: "Company",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm">
            {item.product?.createdBy?.company || "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "--"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span className={getStatusBadge(item.status)}>
          {getStatusIcon(item.status)}
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
            onClick={() => router.push(`/user/sample-requests/${item._id}`)}
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
      <div className="container mx-auto px-4 py-6 ">
        <SampleRequestsHeader
          totalRequests={totalRequests}
          pendingCount={requests.filter(r => r.status === "pending").length}
          deliveredCount={requests.filter(r => r.status === "delivered").length}
          approvedCount={requests.filter(r => r.status === "approved").length}
        />

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
            data={requests}
            columns={columns}
            loading={loading}
            emptyState={{
              icon: debouncedSearchTerm || statusFilter !== "all" 
                ? <Search className="w-6 h-6 text-gray-400" />
                : <Package className="w-6 h-6 text-gray-400" />,
              title: debouncedSearchTerm || statusFilter !== "all"
                ? "No Matching Requests"
                : "No Sample Requests",
              description: debouncedSearchTerm || statusFilter !== "all"
                ? "No sample requests match your filters. Try adjusting your search."
                : "You haven't made any sample requests yet.",
              action: (debouncedSearchTerm || statusFilter !== "all") ? (
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
              title: "Requests",
              isFiltered: debouncedSearchTerm !== "" || statusFilter !== "all",
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

export default SampleRequest;
