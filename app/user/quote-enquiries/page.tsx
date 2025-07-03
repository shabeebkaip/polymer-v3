"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Quote,
  Package,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  Truck,
  FileText,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserQuoteEnquiries } from "@/apiServices/user";
import { useQuoteEnquiriesStore } from "@/stores/quoteEnquiriesStore";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

const QuoteEnquiries = () => {
  const router = useRouter();

  // Zustand store
  const { enquiries, meta, setEnquiries, clearEnquiries } =
    useQuoteEnquiriesStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(meta?.filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(
    meta?.filters?.status || "all"
  );
  const [currentPage, setCurrentPage] = useState(meta?.pagination?.page || 1);
  const pageSize = 10;

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
      if (event.key === "Escape" && (searchTerm || statusFilter !== "all")) {
        clearFilters();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchTerm, statusFilter]);

  // Fetch data when component mounts or when filters change
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: pageSize,
          ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
          ...(statusFilter !== "all" && { status: statusFilter }),
        };

        const response = await getUserQuoteEnquiries(params);
        setEnquiries(response.data || [], response.meta);
        setError(null);
      } catch (err) {
        setError("Failed to load quote enquiries");
        clearEnquiries();
        console.error("Error fetching enquiries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [
    currentPage,
    debouncedSearchTerm,
    statusFilter,
    setEnquiries,
    clearEnquiries,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1 && (debouncedSearchTerm || statusFilter !== "all")) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, statusFilter, currentPage]);

  // Pagination helpers
  const totalPages = meta?.pagination?.totalPages || 1;
  const totalRequests = meta?.pagination?.total || 0;
  const count = meta?.pagination?.count || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "responded":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "pending":
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case "cancelled":
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      case "completed":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
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
      case "completed":
        return "Completed";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-200/15 to-blue-200/15 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
                  <Quote className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Quote Enquiries
                </h1>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  Track and manage your quote requests with advanced insights
                </p>
              </div>
            </div>

            {/* Modern Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Total Enquiries
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {totalRequests}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                    <Quote className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Pending
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {enquiries.filter((r) => r.status === "pending").length}
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
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      Approved
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {enquiries.filter((r) => r.status === "approved").length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      This Month
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {
                        enquiries.filter((e) => {
                          const enquiryDate = new Date(e.createdAt);
                          const currentDate = new Date();
                          return (
                            enquiryDate.getMonth() === currentDate.getMonth() &&
                            enquiryDate.getFullYear() ===
                              currentDate.getFullYear()
                          );
                        }).length
                      }
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by product, customer, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-50/50 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 bg-gray-100/50 hover:bg-gray-200/50"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}

            {/* Results Count */}
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100/50 px-3 py-2 rounded-lg">
              <span className="font-medium text-gray-700">{count}</span>
              <span>of</span>
              <span className="font-medium text-gray-700">{totalRequests}</span>
              <span>enquiries</span>
            </div>
          </div>
        </div>

        {/* Advanced Table Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Quote className="w-5 h-5 text-blue-600" />
                Quote Enquiries
              </h2>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {loading ? (
            /* Loading State */
            <div className="p-6 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">
                        <Skeleton className="h-4 w-8" />
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        <Skeleton className="h-4 w-20" />
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        <Skeleton className="h-4 w-20" />
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        <Skeleton className="h-4 w-24" />
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        <Skeleton className="h-4 w-16" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="p-3">
                          <Skeleton className="h-4 w-8" />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-xl" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-3 w-12" />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </td>
                        <td className="p-3">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to Load Quote Enquiries
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
            </div>
          ) : (
            /* Data Table */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="text-left p-3 font-semibold text-gray-700">
                      #
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Details
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Quote className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {searchTerm || statusFilter !== "all"
                                ? "No matching quote enquiries"
                                : "No quote enquiries yet"}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your search criteria"
                                : "Quote enquiries will appear here once customers request quotes"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((item, index) => (
                      <tr
                        key={item._id || item.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <td className="p-3">
                          <span className="text-sm font-medium text-gray-900">
                            {(currentPage - 1) * pageSize + index + 1}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 truncate max-w-xs">
                                {item.product?.productName || "Unknown Product"}
                              </p>
                              {item.product?.sku && (
                                <p className="text-xs text-gray-500">
                                  SKU: {item.product.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">
                              {item.quantity || "--"}
                            </span>
                            {item.uom && (
                              <span className="text-sm text-gray-500">
                                {item.uom}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            {item.incoterm && (
                              <div className="flex items-center gap-1">
                                <Truck className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {item.incoterm}
                                </span>
                              </div>
                            )}
                            {item.packaging && (
                              <div className="flex items-center gap-1">
                                <Package className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {item.packaging}
                                </span>
                              </div>
                            )}
                            {item.grade && (
                              <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {item.grade.gradeName || item.grade}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "2-digit",
                                    }
                                  )
                                : "--"}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className={getStatusBadge(item.status)}>
                            {getStatusIcon(item.status)}
                            <span>{getStatusText(item.status)}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {item.user?.email || "Unknown User"}
                              </p>
                              {item.user?.name && (
                                <p className="text-xs text-gray-500 truncate max-w-xs">
                                  {item.user.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/user/quote-enquiries/${item._id || item.id}`)
                            }
                            className="w-8 h-8 p-0 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && enquiries.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalRequests)} of{" "}
                  {totalRequests} enquiries
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-500 px-2">...</span>
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteEnquiries;
