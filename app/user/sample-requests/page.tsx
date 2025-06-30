"use client";

import { getUserSampleRequests } from "@/apiServices/user";
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

// Define types for the API response structure based on actual API data
interface SampleRequest {
  _id: string;
  user: string;
  product?: {
    _id: string;
    productName: string;
    createdBy?: {
      _id: string;
      firstName: string;
      lastName: string;
      company: string;
      email: string;
    };
  };
  quantity: number;
  uom?: string;
  address?: string;
  country?: string;
  grade?: {
    _id: string;
    name: string;
  };
  application?: string;
  expected_annual_volume?: number;
  orderDate?: string;
  neededBy?: string;
  message?: string;
  request_document?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  statusMessage?: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
}

interface SampleRequestsResponse {
  data: SampleRequest[];
  meta?: {
    pagination: {
      page: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
  // Fallback for older API structure
  total?: number;
  page?: number;
  totalPages?: number;
}

const SampleRequest = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<SampleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [pageSize] = useState(10); // Items per page

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keyboard shortcut for clearing filters (Escape key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (searchTerm || statusFilter !== "all")) {
        setSearchTerm("");
        setStatusFilter("all");
        setCurrentPage(1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // Add pagination and filter parameters to API call
        const params = {
          page: currentPage,
          limit: pageSize,
          ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
          ...(statusFilter !== "all" && { status: statusFilter })
        };
        
        const response = await getUserSampleRequests(params);
        
        // Handle the new API response structure with data array and meta.pagination
        if (response && response.data && Array.isArray(response.data)) {
          setRequests(response.data);
          // Extract pagination info from meta.pagination
          const pagination = response.meta?.pagination;
          if (pagination) {
            setTotalRequests(pagination.total || 0);
            setTotalPages(pagination.totalPages || 1);
          } else {
            // Fallback for older API structure
            setTotalRequests(response.total || response.data.length);
            setTotalPages(Math.ceil((response.total || response.data.length) / pageSize));
          }
        } else {
          setRequests([]);
          setTotalRequests(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching sample requests:", error);
        setRequests([]);
        setTotalRequests(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentPage, pageSize, debouncedSearchTerm, statusFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-200/15 to-green-200/15 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Sample Requests
                </h1>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  Track and manage all your sample requests with advanced insights
                </p>
              </div>
            </div>

            {/* Modern Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Requests</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{totalRequests}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {requests.filter(r => r.status === "pending").length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-3 rounded-xl group-hover:from-yellow-200 group-hover:to-orange-200 transition-all duration-300">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Delivered</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {requests.filter(r => r.status === "delivered").length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-xl group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Approved</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {requests.filter(r => r.status === "approved").length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by product name, company, location, or grade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-900 font-medium"
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
            </div>

            {/* Status Filter */}
            <div className="lg:w-64">
              <div className="relative group">
                <Filter className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 appearance-none bg-white/50 backdrop-blur-sm text-gray-900 font-medium cursor-pointer"
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
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 border border-gray-200 font-medium group"
              >
                <XCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {(debouncedSearchTerm || statusFilter !== "all") && (
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200/60">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {debouncedSearchTerm && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium border border-green-200/50 group">
                    <Search className="w-4 h-4" />
                    <span>Search: "{debouncedSearchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:bg-green-200/50 rounded-full p-1 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 rounded-full text-sm font-medium border border-teal-200/50 group">
                    <Filter className="w-4 h-4" />
                    <span>Status: {getStatusText(statusFilter)}</span>
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="ml-1 hover:bg-teal-200/50 rounded-full p-1 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          {/* Results Header */}
          {!loading && requests.length > 0 && (
            <div className="border-b border-gray-200/60 px-8 py-6 bg-gradient-to-r from-gray-50/80 to-green-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sample Requests
                    {debouncedSearchTerm || statusFilter !== "all" ? " (Filtered)" : ""}
                  </h3>
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-200/50">
                    {totalRequests} {totalRequests === 1 ? 'result' : 'results'}
                  </span>
                </div>
                {(debouncedSearchTerm || statusFilter !== "all") && (
                  <div className="text-sm text-gray-600 font-medium">
                    {debouncedSearchTerm && `Search: "${debouncedSearchTerm}"`}
                    {debouncedSearchTerm && statusFilter !== "all" && " • "}
                    {statusFilter !== "all" && `Status: ${getStatusText(statusFilter)}`}
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
                {debouncedSearchTerm || statusFilter !== "all" 
                  ? "Searching your sample requests..."
                  : "Loading your sample requests..."}
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch your data
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-16 text-center">
              <div className="relative mx-auto mb-6 w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  {debouncedSearchTerm || statusFilter !== "all" ? (
                    <Search className="w-10 h-10 text-gray-400" />
                  ) : (
                    <Package className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">0</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {debouncedSearchTerm || statusFilter !== "all" 
                  ? "No Matching Requests Found" 
                  : "No Sample Requests"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                {debouncedSearchTerm || statusFilter !== "all" 
                  ? `No sample requests match your current filters. Try adjusting your search term or status filter to find what you're looking for.`
                  : "You haven't made any sample requests yet. Start by exploring our marketplace and requesting samples from suppliers."}
              </p>
              {(debouncedSearchTerm || statusFilter !== "all") && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 inline-block">
                    <div className="font-medium mb-2">Current filters:</div>
                    {debouncedSearchTerm && <div className="flex items-center gap-2"><Search className="w-4 h-4" /> Search: "{debouncedSearchTerm}"</div>}
                    {statusFilter !== "all" && <div className="flex items-center gap-2"><Filter className="w-4 h-4" /> Status: {getStatusText(statusFilter)}</div>}
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    <XCircle className="w-5 h-5" />
                    Clear All Filters
                  </button>
                </div>
              )}
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
                {requests.map((item, index) => (
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
                          onClick={() => router.push(`/user/sample-requests/${item._id}`)}
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

export default SampleRequest;
