"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Calendar, Building2, AlertCircle, CheckCircle, XCircle, Clock, Search, Filter, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSampleRequestsListStore } from "@/stores/user";

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
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2.5 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Sample Requests
                </h1>
                <p className="text-gray-600 text-sm mt-0.5">
                  Track and manage your sample requests
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Total Requests</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalRequests}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {requests.filter(r => r.status === "pending").length}
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
                  <p className="text-gray-600 text-xs font-medium mb-1">Delivered</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {requests.filter(r => r.status === "delivered").length}
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
                  <p className="text-gray-600 text-xs font-medium mb-1">Approved</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {requests.filter(r => r.status === "approved").length}
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by product name, company, or grade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
                {debouncedSearchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-56">
              <div className="relative">
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="responded">Responded</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Clear
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(debouncedSearchTerm || statusFilter !== "all") && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs font-medium text-gray-600">Filters:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {debouncedSearchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-200">
                    <Search className="w-3 h-3" />
                    <span>&quot;{debouncedSearchTerm}&quot;</span>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:bg-green-100 rounded-full p-0.5 transition-colors"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200">
                    <Filter className="w-3 h-3" />
                    <span>{getStatusText(statusFilter)}</span>
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Results Header */}
          {!loading && requests.length > 0 && (
            <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Requests
                    {debouncedSearchTerm || statusFilter !== "all" ? " (Filtered)" : ""}
                  </h3>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                    {totalRequests}
                  </span>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center">
              <div className="relative mx-auto mb-4 w-10 h-10">
                <div className="absolute inset-0 rounded-full border-3 border-green-200"></div>
                <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-green-600 animate-spin"></div>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {debouncedSearchTerm || statusFilter !== "all" 
                  ? "Searching..."
                  : "Loading..."}
              </p>
              <p className="text-xs text-gray-600">
                Please wait
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {debouncedSearchTerm || statusFilter !== "all" ? (
                  <Search className="w-6 h-6 text-gray-400" />
                ) : (
                  <Package className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {debouncedSearchTerm || statusFilter !== "all" 
                  ? "No Matching Requests" 
                  : "No Sample Requests"}
              </h3>
              <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                {debouncedSearchTerm || statusFilter !== "all" 
                  ? "No sample requests match your filters. Try adjusting your search."
                  : "You haven't made any sample requests yet."}
              </p>
              {(debouncedSearchTerm || statusFilter !== "all") && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="border-gray-200">
                  <TableHead className="font-semibold text-gray-700 py-3 text-xs">#</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3 text-xs">Product</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3 text-xs">Quantity</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3 text-xs">Company</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3 text-xs">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3 text-xs">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-3 text-xs text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((item, index) => (
                  <TableRow key={item._id || index} className="hover:bg-gray-50 transition-colors border-gray-200">
                    <TableCell className="py-3 text-sm text-gray-600">
                      {((currentPage - 1) * pageSize + index + 1)}
                    </TableCell>
                    <TableCell className="py-3">
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
                    </TableCell>
                    <TableCell className="py-3">
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
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 text-sm">
                          {item.product?.createdBy?.company || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
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
                    </TableCell>
                    <TableCell className="py-3">
                      <span className={getStatusBadge(item.status)}>
                        {getStatusIcon(item.status)}
                        {getStatusText(item.status)}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => router.push(`/user/sample-requests/${item._id}`)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{((currentPage - 1) * pageSize) + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * pageSize, totalRequests)}</span> of <span className="font-semibold text-gray-900">{totalRequests}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="w-3 h-3" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                            currentPage === pageNumber
                              ? "bg-green-600 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SampleRequest;
