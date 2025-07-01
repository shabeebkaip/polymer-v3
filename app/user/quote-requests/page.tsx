"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Package, 
  Calendar, 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown, 
  Eye, 
  AlertCircle, 
  FileText,
  TrendingUp,
  Users,
  Target,
  Activity,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useQuoteRequestsListStore } from "@/stores/user";

// Define the allowed statuses for quote requests based on API response
const ALLOWED_STATUSES = [
  "pending", "responded", "approved", "rejected", "cancelled"
] as const;

type QuoteStatus = typeof ALLOWED_STATUSES[number];

const QuoteRequests = () => {
  const router = useRouter();
  
  // Zustand store
  const {
    requests: quoteRequests,
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
    fetchQuoteRequests,
    clearFilters,
    reset
  } = useQuoteRequestsListStore();

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
      if (event.key === 'Escape' && (searchTerm || statusFilter)) {
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
      ...(statusFilter && { status: statusFilter })
    };

    fetchQuoteRequests(params);
  }, [currentPage, pageSize, debouncedSearchTerm, statusFilter, fetchQuoteRequests]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1 && (debouncedSearchTerm || statusFilter)) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, statusFilter, currentPage, setCurrentPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't reset the store on unmount to preserve data when navigating back
    };
  }, []);

  const getStatusIcon = (status: QuoteStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "responded":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "pending":
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: QuoteStatus) => {
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border";
    
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-50 text-green-700 border-green-200`;
      case "rejected":
        return `${baseClasses} bg-red-50 text-red-700 border-red-200`;
      case "cancelled":
        return `${baseClasses} bg-gray-50 text-gray-700 border-gray-200`;
      case "responded":
        return `${baseClasses} bg-orange-50 text-orange-700 border-orange-200`;
      case "pending":
        return `${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border-gray-200`;
    }
  };

  const getStatusText = (status: QuoteStatus) => {
    switch (status) {
      case "pending": return "Pending";
      case "responded": return "Responded";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "cancelled": return "Cancelled";
      default: return "Unknown";
    }
  };

  const getStatsData = () => {
    const stats = {
      total: totalRequests,
      pending: quoteRequests.filter(req => req.status === 'pending').length,
      responded: quoteRequests.filter(req => req.status === 'responded').length,
      approved: quoteRequests.filter(req => req.status === 'approved').length,
      rejected: quoteRequests.filter(req => req.status === 'rejected').length,
    };
    
    return [
      { label: 'Total Requests', value: stats.total, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
      { label: 'Responded', value: stats.responded, icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
      { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    ];
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && quoteRequests.length === 0) {
    // Only show full page loader on initial load, not for subsequent fetches
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Quote Requests
                </h1>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  Manage and track your quote requests
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {getStatsData().map((stat, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product name, company, or application..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
              {debouncedSearchTerm && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent"></div>
                </div>
              )}
            </div>
            {debouncedSearchTerm && (
              <p className="text-sm text-green-600 mt-2 font-medium">
                Searching for "{debouncedSearchTerm}"
              </p>
            )}

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white/70 border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 min-w-[160px]"
              >
                <option value="">All Statuses</option>
                {ALLOWED_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {(searchTerm || statusFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          {/* Results Header */}
          {!loading && quoteRequests.length > 0 && (
            <div className="border-b border-gray-200/60 px-8 py-6 bg-gradient-to-r from-gray-50/80 to-green-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quote Requests
                    {debouncedSearchTerm || statusFilter ? " (Filtered)" : ""}
                  </h3>
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-200/50">
                    {totalRequests} {totalRequests === 1 ? 'result' : 'results'}
                  </span>
                </div>
                {(debouncedSearchTerm || statusFilter) && (
                  <div className="text-sm text-gray-600 font-medium">
                    {debouncedSearchTerm && `Search: "${debouncedSearchTerm}"`}
                    {debouncedSearchTerm && statusFilter && " • "}
                    {statusFilter && `Status: ${getStatusText(statusFilter as QuoteStatus)}`}
                  </div>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center">
              <div className="relative mx-auto mb-6 w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-green-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {debouncedSearchTerm || statusFilter 
                  ? "Searching your quote requests..."
                  : "Loading your quote requests..."}
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch your data
              </p>
            </div>
          ) : quoteRequests.length === 0 ? (
            <div className="p-16 text-center">
              <div className="relative mx-auto mb-6 w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  {debouncedSearchTerm || statusFilter ? (
                    <Search className="w-10 h-10 text-gray-400" />
                  ) : (
                    <FileText className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">0</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {debouncedSearchTerm || statusFilter 
                  ? "No Matching Requests Found" 
                  : "No Quote Requests"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                {debouncedSearchTerm || statusFilter 
                  ? `No quote requests match your current filters. Try adjusting your search term or status filter to find what you're looking for.`
                  : "You haven't made any quote requests yet. Start by exploring our marketplace and requesting quotes from suppliers."}
              </p>
              {(debouncedSearchTerm || statusFilter) && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 inline-block">
                    <div className="font-medium mb-2">Current filters:</div>
                    {debouncedSearchTerm && <div className="flex items-center gap-2"><Search className="w-4 h-4" /> Search: "{debouncedSearchTerm}"</div>}
                    {statusFilter && <div className="flex items-center gap-2"><Filter className="w-4 h-4" /> Status: {getStatusText(statusFilter as QuoteStatus)}</div>}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    <XCircle className="w-5 h-5" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          ) : error ? (
            <div className="p-16 text-center">
              <div className="relative mx-auto mb-6 w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => fetchQuoteRequests({ forceRefresh: true })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50/80 to-green-50/30">
                <TableRow className="border-gray-200/60">
                  <TableHead className="font-bold text-gray-900 py-4">SL NO</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Product</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Quantity</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Company</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Date</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quoteRequests.map((item, index) => (
                  <TableRow key={item._id || index} className="hover:bg-gradient-to-r hover:from-green-50/30 hover:to-emerald-50/30 transition-all duration-300 border-gray-200/40 group">
                    <TableCell className="font-bold text-gray-900 py-6">
                      <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-2 rounded-lg text-sm font-bold border border-green-200/50">
                        #{((currentPage - 1) * pageSize + index + 1).toString().padStart(3, '0')}
                      </span>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                          <Package className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1 text-base">
                            {item.product?.productName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Grade: <span className="font-medium">{item.grade?.name || "N/A"}</span>
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-lg">
                          {item.quantity || "N/A"}
                        </span>
                        {item.uom && (
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                            {item.uom}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="text-gray-900 font-medium">
                          {item.product?.createdBy?.company || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-900 font-medium">
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
                    <TableCell className="py-6">
                      <span className={getStatusBadge(item.status)}>
                        {getStatusIcon(item.status)}
                        {getStatusText(item.status)}
                      </span>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => router.push(`/user/quote-requests/${item._id}`)}
                          className="group inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110"
                          title="View Request Details"
                        >
                          <Eye className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" />
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
            <div className="border-t border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-green-50/20 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50">
                    Showing <span className="font-bold text-green-600">{((currentPage - 1) * pageSize) + 1}</span> to <span className="font-bold text-green-600">{Math.min(currentPage * pageSize, totalRequests)}</span> of <span className="font-bold text-green-600">{totalRequests}</span> results
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200/50 hover:bg-white hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
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
                          className={`w-11 h-11 rounded-xl text-sm font-bold transition-all duration-300 ${
                            currentPage === pageNumber
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-110"
                              : "bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200/50 hover:bg-white hover:shadow-lg hover:scale-105"
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
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200/50 hover:bg-white hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
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

export default QuoteRequests;
