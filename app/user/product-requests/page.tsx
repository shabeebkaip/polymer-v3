"use client";

import React, { useEffect, useMemo, useCallback } from 'react';
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
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronDown,
  Eye,
  AlertCircle,
  FileText,
  Activity,
  Loader2,
  MapPin,
  Truck,
  Globe
} from "lucide-react";
import { useProductRequestsListStore } from "@/stores/user";

const ProductRequests = () => {
  const router = useRouter();
  
  // Zustand store
  const {
    requests: productRequests,
    loading,
    error,
    searchTerm,
    statusFilter,
    totalPages,
    totalRequests,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    fetchProductRequests,
    clearFilters
  } = useProductRequestsListStore();

  // Fetch product requests on mount
  useEffect(() => {
    fetchProductRequests({ forceRefresh: true });
  }, [fetchProductRequests]);

  // Handle search with debouncing
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, [setSearchTerm]);

  // Handle status filter
  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  }, [setStatusFilter, setCurrentPage]);

  // Filter requests based on search term and status (client-side filtering)
  const filteredRequests = useMemo(() => {
    return productRequests.filter(request => {
      const matchesSearch = !searchTerm || 
        request.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || request.sellerStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [productRequests, searchTerm, statusFilter]);

  // Status badge for seller status
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

  const getStatsData = useMemo(() => {
    const stats = {
      total: totalRequests,
      pending: filteredRequests.filter(req => req.sellerStatus === 'pending').length,
      accepted: filteredRequests.filter(req => req.sellerStatus === 'accepted').length,
      in_progress: filteredRequests.filter(req => req.sellerStatus === 'in_progress').length,
      shipped: filteredRequests.filter(req => req.sellerStatus === 'shipped').length,
      delivered: filteredRequests.filter(req => req.sellerStatus === 'delivered').length,
      completed: filteredRequests.filter(req => req.sellerStatus === 'completed').length,
      rejected: filteredRequests.filter(req => req.sellerStatus === 'rejected').length,
      cancelled: filteredRequests.filter(req => req.sellerStatus === 'cancelled').length,
    };
    return [
      { label: 'Total Requests', value: stats.total, icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50' },
      { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
      { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
      { label: 'In Progress', value: stats.in_progress, icon: Activity, color: 'text-teal-600', bgColor: 'bg-teal-50' },
      { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'text-green-600', bgColor: 'bg-green-50' },
      { label: 'Delivered', value: stats.delivered, icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
      { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
      { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    ];
  }, [totalRequests, filteredRequests]);

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
                  Sourcing Requests
                </h1>
                <p className="text-gray-600 text-sm mt-0.5">
                  Manage and track your bulk product orders
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/user/product-requests/add')}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Package className="w-4 h-4" />
              <span>New Request</span>
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            {getStatsData.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600 font-medium leading-tight">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by product, destination, or country..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
            {/* Status Filter */}
            <div className="relative lg:w-56">
              <select
                value={statusFilter}
                onChange={e => handleStatusFilter(e.target.value)}
                className="appearance-none w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            {/* Clear Filters */}
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-700 py-3 text-xs">#</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 text-xs">Product</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 text-xs">Quantity</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 text-xs">Destination</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 text-xs">Delivery Date</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 text-xs">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 text-xs text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 rounded-full border-3 border-green-200"></div>
                        <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-green-600 animate-spin"></div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">Loading...</p>
                      <p className="text-xs text-gray-600">Please wait</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                      <span className="text-sm text-red-500">{error}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">No Requests Found</h3>
                      <p className="text-sm text-gray-600">No product requests match your filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request, index) => (
                  <TableRow key={request._id} className="hover:bg-gray-50 transition-colors border-gray-200">
                    <TableCell className="py-3 text-sm text-gray-600">
                      {(index + 1)}
                    </TableCell>
                    <TableCell className="py-3">
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
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">
                          {request.quantity?.toLocaleString() || "N/A"}
                        </span>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{request.uom}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
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
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 text-sm">
                          {formatDate(request.delivery_date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.sellerStatus)}`}>
                        {getStatusText(request.sellerStatus)}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <button
                        onClick={() => router.push(`/user/product-requests/${request._id}`)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-green-600" />
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
          <div className="border-t border-gray-200 bg-white px-4 py-3 mt-4 rounded-b-lg">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredRequests.length}</span> of <span className="font-semibold text-gray-900">{totalRequests}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRequests;
