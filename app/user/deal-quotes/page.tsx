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
  Activity,
  ChevronLeft,
  ChevronRight,
  Gift,
  MapPin
} from "lucide-react";
import { getDealQuoteRequests } from "@/apiServices/user";
import { toast } from "sonner";
import { useUserInfo } from "@/lib/useUserInfo";

// Define the allowed statuses
const ALLOWED_STATUSES = [
  "pending", "responded", "negotiation", "accepted", "in_progress", 
  "shipped", "delivered", "completed", "rejected", "cancelled"
] as const;

type QuoteStatus = typeof ALLOWED_STATUSES[number];

interface DealQuote {
  _id: string;
  requestType: "deal_quote";
  status: QuoteStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
    phone: number;
    company: string;
    address: string;
    location: string;
  };
  deal: {
    _id: string;
    productName: string;
    productImage?: string;
  };
  orderDetails: {
    quantity: number;
    shippingCountry: string;
    paymentTerms?: string;
    deliveryDeadline?: string;
  };
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface StatusSummary {
  pending: number;
  approved: number;
  rejected: number;
}

const DealQuotesPage = () => {
  const router = useRouter();
  const { user } = useUserInfo();
  
  const [dealQuotes, setDealQuotes] = useState<DealQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "">("");
  const [statusSummary, setStatusSummary] = useState<StatusSummary>({ pending: 0, approved: 0, rejected: 0 });

  // Access control - only sellers can access this page
  useEffect(() => {
    if (user && user.user_type !== 'seller') {
      toast.error("Access denied. This page is only for sellers.");
      router.push('/user/profile');
    }
  }, [user, router]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch deal quotes
  const fetchDealQuotes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(statusFilter && { status: statusFilter }),
      };

      const response = await getDealQuoteRequests(params);
      
      if (response.success) {
        setDealQuotes(response.data || []);
        setTotalPages(response.meta?.pagination?.totalPages || 1);
        setTotalItems(response.meta?.pagination?.totalItems || 0);
        setStatusSummary(response.meta?.statusSummary || { pending: 0, approved: 0, rejected: 0 });
      } else {
        setError(response.message || "Failed to fetch deal quotes");
        toast.error("Failed to fetch deal quotes");
      }
    } catch (err) {
      console.error("❌ Error fetching deal quotes:", err);
      setError("An error occurred while fetching deal quotes");
      toast.error("An error occurred while fetching deal quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealQuotes();
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1 && (debouncedSearchTerm || statusFilter)) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, statusFilter]);

  const getStatusIcon = (status: QuoteStatus) => {
    switch (status) {
      case "accepted":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "responded":
      case "negotiation":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "in_progress":
      case "shipped":
      case "delivered":
        return <Activity className="w-4 h-4 text-blue-500" />;
      case "pending":
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: QuoteStatus) => {
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border";
    
    switch (status) {
      case "accepted":
      case "completed":
        return `${baseClasses} bg-green-50 text-green-700 border-green-200`;
      case "rejected":
        return `${baseClasses} bg-red-50 text-red-700 border-red-200`;
      case "cancelled":
        return `${baseClasses} bg-gray-50 text-gray-700 border-gray-200`;
      case "responded":
      case "negotiation":
        return `${baseClasses} bg-orange-50 text-orange-700 border-orange-200`;
      case "in_progress":
        return `${baseClasses} bg-blue-50 text-blue-700 border-blue-200`;
      case "shipped":
        return `${baseClasses} bg-purple-50 text-purple-700 border-purple-200`;
      case "delivered":
        return `${baseClasses} bg-indigo-50 text-indigo-700 border-indigo-200`;
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
      case "negotiation": return "Negotiation";
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

  const getStatsData = () => {
    return [
      { label: 'Total Requests', value: totalItems, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      { label: 'Pending', value: statusSummary.pending, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
      { label: 'Approved', value: statusSummary.approved, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
      { label: 'Rejected', value: statusSummary.rejected, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    ];
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-emerald-800 bg-clip-text text-transparent">
                    Deal Quote Requests
                  </h1>
                  <p className="text-gray-600 text-lg mt-2 font-medium">
                    Manage your best deal quote requests
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStatsData().map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by destination, country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | "")}
                  className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  {ALLOWED_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {getStatusText(status)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {(searchTerm || statusFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative mx-auto mb-6 w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : dealQuotes.length === 0 ? (
            <div className="text-center py-20">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deal Quotes Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter
                  ? "Try adjusting your filters"
                  : "No deal quote requests yet"}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700">Deal & Product</TableHead>
                    <TableHead className="font-semibold text-gray-700">Buyer</TableHead>
                    <TableHead className="font-semibold text-gray-700">Quantity</TableHead>
                    <TableHead className="font-semibold text-gray-700">Destination</TableHead>
                    <TableHead className="font-semibold text-gray-700">Delivery Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dealQuotes.map((quote) => (
                    <TableRow key={quote._id} className="hover:bg-blue-50/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">{quote.deal.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-900">{quote.buyer.name}</span>
                          <span className="text-sm text-gray-600">{quote.buyer.company}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">
                          {quote.orderDetails.quantity} units
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-900">{quote.orderDetails.shippingCountry}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {quote.orderDetails.deliveryDeadline
                              ? new Date(quote.orderDetails.deliveryDeadline).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getStatusBadge(quote.status)}>
                          {getStatusIcon(quote.status)}
                          {getStatusText(quote.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => router.push(`/user/deal-quotes/${quote._id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealQuotesPage;
