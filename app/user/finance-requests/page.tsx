'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronDown,
  Eye,
  FileText,
  Package,
} from 'lucide-react';
import { useFinanceRequestsListStore } from '@/stores/user';

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
  const getStatsData = () => {
    const stats = {
      total: totalRequests,
      pending: financeRequests.filter((req) => req.status === 'pending').length,
      approved: financeRequests.filter((req) => req.status === 'approved').length,
      rejected: financeRequests.filter((req) => req.status === 'rejected').length,
    };
    return [
      {
        label: 'Total Requests',
        value: stats.total,
        icon: FileText,
        color: 'text-primary-500',
        bgColor: 'bg-primary-50',
      },
      {
        label: 'Pending',
        value: stats.pending,
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      },
      {
        label: 'Approved',
        value: stats.approved,
        icon: CheckCircle,
        color: 'text-primary-500',
        bgColor: 'bg-primary-50',
      },
      {
        label: 'Rejected',
        value: stats.rejected,
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-primary-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-primary-500/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="bg-primary-500 p-4 rounded-2xl shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-primary-600 bg-clip-text text-transparent">
                    Finance Requests
                  </h1>
                  <p className="text-gray-600 text-lg mt-2 font-medium">
                    Manage and track your finance requests
                  </p>
                </div>
              </div>

              {/* Request for Finance Button */}
              <button
                onClick={() => router.push('/user/finance-requests/add')}
                className="inline-flex items-center gap-3 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CreditCard className="w-5 h-5" />
                Request for Finance
              </button>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {getStatsData().map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                >
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
                placeholder="Search by product, notes, or price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
              {debouncedSearchTerm && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent"></div>
                </div>
              )}
            </div>
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white/70 border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 min-w-[160px]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="under_review">Under Review</option>
                <option value="cancelled">Cancelled</option>
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
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50/80 to-primary-50/30">
              <TableRow className="border-gray-200/60">
                <TableHead className="font-bold text-gray-900 py-4">SL NO</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Product</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Quantity</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">EMI Months</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Est. Price</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Notes</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Status</TableHead>
                <TableHead className="font-bold text-gray-900 py-4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <span className="text-gray-500">Loading...</span>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : financeRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No finance requests found.
                  </TableCell>
                </TableRow>
              ) : (
                financeRequests.map((req, index) => (
                  <TableRow
                    key={req._id}
                    className="hover:bg-primary-50/30 transition-all duration-300 border-gray-200/40 group"
                  >
                    <TableCell className="font-bold text-gray-900 py-6">
                      <span className="bg-primary-50 text-primary-600 px-3 py-2 rounded-lg text-sm font-bold border border-primary-500/30">
                        #{((currentPage - 1) * pageSize + index + 1).toString().padStart(3, '0')}
                      </span>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-50 transition-all duration-300">
                          <Package className="w-6 h-6 text-primary-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1 text-base">
                            {req.productId?.productName || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <span className="font-bold text-gray-900 text-lg">
                        {req.quantity || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="py-6">
                      <span className="font-bold text-gray-900 text-lg">
                        {req.emiMonths || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="py-6">
                      <span className="font-bold text-gray-900 text-lg">
                        {formatCurrency(req.estimatedPrice)}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 max-w-xs truncate" title={req.notes}>
                      <span className="text-gray-700">{req.notes}</span>
                    </TableCell>
                    <TableCell className="py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadge(
                          req.status
                        )}`}
                      >
                        {getStatusText(req.status)}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 text-center">
                      <button
                        onClick={() => router.push(`/user/finance-requests/${req._id}`)}
                        className="group inline-flex items-center justify-center w-10 h-10 bg-primary-50 hover:bg-primary-50 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110"
                        title="View Request Details"
                      >
                        <Eye className="w-5 h-5 text-primary-500 group-hover:text-primary-600 transition-colors" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-primary-50/20 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 font-medium">
                <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50">
                  Showing{' '}
                  <span className="font-bold text-primary-500">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-bold text-primary-500">
                    {Math.min(currentPage * pageSize, totalRequests)}
                  </span>{' '}
                  of <span className="font-bold text-primary-500">{totalRequests}</span> results
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200/50 hover:bg-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageClick(i + 1)}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold border transition-all duration-300 ${
                      currentPage === i + 1
                        ? 'bg-primary-500 text-white border-primary-500 shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200/50 hover:bg-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200/50 hover:bg-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceRequests;
