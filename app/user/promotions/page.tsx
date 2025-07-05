"use client";
import React, { useEffect, useState } from 'react';
import { usePromotionsStore } from '@/stores/promotionsStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Eye,
  ChevronDown,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const Promotions = () => {
  const router = useRouter();
  const {
    promotions,
    meta,
    loading,
    error,
    filters,
    currentPage,
    itemsPerPage,
    fetchPromotions,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
    clearFilters,
    getPaginatedPromotions,
    getFilteredPromotions,
    getTotalPages,
  } = usePromotionsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    setFilters({ search: searchTerm });
  }, [searchTerm, setFilters]);

  useEffect(() => {
    setFilters({ status: statusFilter });
  }, [statusFilter, setFilters]);

  const paginatedPromotions = getPaginatedPromotions();
  const filteredPromotions = getFilteredPromotions();
  const totalPages = getTotalPages();

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'active':
        return {
          color: 'text-green-700',
          bg: 'bg-green-100',
          border: 'border-green-200',
          icon: CheckCircle,
          text: 'Active'
        };
      case 'pending':
        return {
          color: 'text-yellow-700',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200',
          icon: Clock,
          text: 'Pending'
        };
      case 'rejected':
      case 'expired':
        return {
          color: 'text-red-700',
          bg: 'bg-red-100',
          border: 'border-red-200',
          icon: XCircle,
          text: 'Rejected'
        };
      default:
        return {
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          icon: AlertTriangle,
          text: 'Unknown'
        };
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

  const getStatsData = () => [
    {
      icon: Package,
      value: meta?.summary?.total || promotions.length,
      label: 'Total Deals',
      bgColor: 'bg-green-100',
      color: 'text-green-600'
    },
    {
      icon: CheckCircle,
      value: meta?.summary?.active || promotions.filter((p: any) => p.status === 'approved').length,
      label: 'Active',
      bgColor: 'bg-emerald-100',
      color: 'text-emerald-600'
    },
    {
      icon: Clock,
      value: meta?.summary?.pending || promotions.filter((p: any) => p.status === 'pending').length,
      label: 'Pending',
      bgColor: 'bg-yellow-100',
      color: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      value: promotions.length,
      label: 'Published',
      bgColor: 'bg-teal-100',
      color: 'text-teal-600'
    }
  ];

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    clearFilters();
  };

  if (loading && promotions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 h-20"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-40"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white/90 to-green-50/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5"></div>
          <div className="relative p-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  My Promotions
                </h1>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  Manage your special deals and promotional offers
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
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
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white/70 border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 min-w-[160px]"
              >
                <option value="">All Statuses</option>
                <option value="approved">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {(searchTerm || statusFilter) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Clear Filters
              </button>
            )}

            {/* Create Button */}
            <button 
              onClick={() => router.push('/user/promotions/add')}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              Create Deal
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 text-red-800">
              <XCircle className="w-6 h-6" />
              <span className="font-semibold">Error loading promotions</span>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
          </div>
        )}

        {/* Results Table */}
        {!loading && paginatedPromotions.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="border-b border-gray-200/60 px-8 py-6 bg-gradient-to-r from-gray-50/80 to-green-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Promotional Deals
                    {(searchTerm || statusFilter) ? " (Filtered)" : ""}
                  </h3>
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-200/50">
                    {filteredPromotions.length} {filteredPromotions.length === 1 ? 'result' : 'results'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50/80 to-green-50/30">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 py-4">SL NO</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Product</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Offer Price</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Created</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4">Updated</TableHead>
                  <TableHead className="font-bold text-gray-900 py-4 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPromotions.map((promotion: any, index: number) => {
                  const statusConfig = getStatusConfig(promotion.status);
                  const StatusIcon = statusConfig.icon;
                  const serialNumber = ((currentPage - 1) * itemsPerPage) + index + 1;
                  
                  return (
                    <TableRow key={promotion.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="py-4 font-medium text-gray-900">
                        {serialNumber}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                            <Package className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {promotion.productName || 'Unknown Product'}
                            </div>
                            <div className="text-sm text-gray-600">
                              ID: {promotion.productId || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-bold text-lg text-green-700">
                          {formatCurrency(promotion.offerPrice)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.text}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(promotion.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(promotion.updatedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <button className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-green-50/20 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 font-medium">
                    <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50">
                      Showing <span className="font-bold text-green-600">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-green-600">{Math.min(currentPage * itemsPerPage, filteredPromotions.length)}</span> of <span className="font-bold text-green-600">{filteredPromotions.length}</span> results
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
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
                            onClick={() => setCurrentPage(pageNumber)}
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
                      onClick={() => setCurrentPage(currentPage + 1)}
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
        )}

        {/* Empty State */}
        {!loading && paginatedPromotions.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 py-16">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Promotions Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter 
                  ? 'Try adjusting your search criteria or filters to find more results' 
                  : 'Create your first promotional deal to start attracting customers'
                }
              </p>
              {!searchTerm && !statusFilter && (
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium inline-flex items-center gap-2 shadow-lg">
                  <Plus className="w-5 h-5" />
                  Create Your First Deal
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;