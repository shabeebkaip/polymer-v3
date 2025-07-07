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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                    Product Requests
                  </h1>
                  <p className="text-gray-600 text-lg mt-2 font-medium">
                    Manage and track your bulk product orders
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/user/product-requests/add')}
                className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center gap-3">
                  <Package className="w-6 h-6" />
                  <span>Request Product</span>
                </div>
              </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
              {getStatsData.map((stat, index) => (
                <div key={index} className={`bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 ${stat.value > 0 ? 'ring-2 ring-green-100/50' : ''}`}>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className={`p-3 rounded-xl ${stat.bgColor} transition-all duration-300 hover:scale-110`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-600 font-medium leading-tight">{stat.label}</p>
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
                placeholder="Search by product, message, destination, or country..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
            </div>
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => handleStatusFilter(e.target.value)}
                className="appearance-none bg-white/70 border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 min-w-[160px]"
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
            <TableHeader className="bg-gradient-to-r from-gray-50/80 to-green-50/30">
              <TableRow className="border-gray-200/60">
                <TableHead className="font-bold text-gray-900 py-4">SL NO</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Product</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Quantity</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Destination</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Delivery Date</TableHead>
                <TableHead className="font-bold text-gray-900 py-4">Status</TableHead>
                <TableHead className="font-bold text-gray-900 py-4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                      <span className="text-gray-500">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-500">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-12 h-12 text-gray-300" />
                      <span>No product requests found.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request, index) => (
                  <TableRow key={request._id} className="hover:bg-gradient-to-r hover:from-green-50/30 hover:to-emerald-50/30 transition-all duration-300 border-gray-200/40 group">
                    <TableCell className="font-bold text-gray-900 py-6">
                      <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-2 rounded-lg text-sm font-bold border border-green-200/50">
                        #{(index + 1).toString().padStart(3, '0')}
                      </span>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                          <Package className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1 text-base">
                            {request.product.productName}
                          </p>
                          <p className="text-sm text-gray-600">
                            By: {request.product.createdBy.company}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-lg">
                          {request.quantity?.toLocaleString() || "N/A"}
                        </span>
                        <span className="text-sm text-gray-600">{request.uom}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-gray-900 font-medium">
                          <MapPin className="w-4 h-4 text-green-600" />
                          {request.destination}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Globe className="w-3 h-3" />
                          {request.city}, {request.country}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">
                          {formatDate(request.delivery_date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadge(request.sellerStatus)}`}>
                        {getStatusText(request.sellerStatus)}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 text-center">
                      <button
                        onClick={() => router.push(`/user/product-requests/${request._id}`)}
                        className="group inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110"
                        title="View Request Details"
                      >
                        <Eye className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination would go here if needed */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200/60 bg-gradient-to-r from-gray-50/50 to-green-50/20 px-8 py-6 mt-8 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 font-medium">
                <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50">
                  Showing <span className="font-bold text-green-600">{filteredRequests.length}</span> of <span className="font-bold text-green-600">{totalRequests}</span> results
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRequests;
