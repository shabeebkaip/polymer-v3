"use client";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserQuoteEnquiries } from "@/apiServices/user";
import { useQuoteEnquiriesStore } from "@/stores/quoteEnquiriesStore";

// Enhanced interface for better type safety
interface QuoteEnquiryProduct {
  productName?: string;
  sku?: string;
  [key: string]: unknown;
}

interface QuoteEnquiryUser {
  email?: string;
  name?: string;
  [key: string]: unknown;
}

interface QuoteEnquiryGrade {
  name?: string;
  [key: string]: unknown;
}

interface QuoteEnquiry {
  _id?: string;
  id?: string;
  user?: QuoteEnquiryUser;
  product?: QuoteEnquiryProduct;
  quantity?: number;
  uom?: string;
  incoterm?: string | { name?: string; [key: string]: unknown };
  grade?: QuoteEnquiryGrade;
  packaging?: string;
  message?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  [key: string]: unknown;
}

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

const QuoteEnquiries = () => {
  const router = useRouter();

  // Zustand store with proper typing
  const { enquiries, meta, setEnquiries, clearEnquiries } =
    useQuoteEnquiriesStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(meta?.filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(
    meta?.filters?.status || "all"
  );
  const [currentPage, setCurrentPage] = useState(meta?.pagination?.page || 1);
  const pageSize = 10;

  // Helper function to safely extract incoterm value
  const getIncotermValue = (incoterm: string | { name?: string; [key: string]: unknown } | undefined): string => {
    if (!incoterm) return '';
    if (typeof incoterm === 'string') return incoterm;
    return incoterm.name || String(incoterm);
  };

  // Local state for debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);

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
    const fetchEnquiries = async (): Promise<void> => {
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
        const errorMessage = err instanceof Error ? err.message : "Failed to load quote enquiries";
        setError(errorMessage);
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

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = (): void => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const getStatusIcon = (status: string): React.ReactElement => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "responded":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "pending":
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string): string => {
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
        return `${baseClasses} bg-emerald-100 text-emerald-700 border border-emerald-200`;
      case "responded":
        return `${baseClasses} bg-orange-100 text-orange-700 border border-orange-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusText = (status: string): string => {
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
  console.log("Enquiries:", enquiries);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-200/15 to-green-200/15 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mb-6 lg:mb-8">
              <div className="relative flex-shrink-0">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                  <Quote className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Quote Enquiries
                </h1>
                <p className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2 font-medium">
                  Track and manage your quote requests with advanced insights
                </p>
              </div>
            </div>

            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                      Total Enquiries
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {totalRequests}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 sm:p-3 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 flex-shrink-0">
                    <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                      Pending
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {enquiries.filter((r: QuoteEnquiry) => r.status === "pending").length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-2 sm:p-3 rounded-xl group-hover:from-yellow-200 group-hover:to-orange-200 transition-all duration-300 flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                      Approved
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {enquiries.filter((r: QuoteEnquiry) => r.status === "approved").length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 sm:p-3 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                      This Month
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                      {
                        enquiries.filter((e: QuoteEnquiry) => {
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
                  <div className="bg-gradient-to-br from-teal-100 to-green-100 p-2 sm:p-3 rounded-xl group-hover:from-teal-200 group-hover:to-green-200 transition-all duration-300 flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50 mb-8 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
          <div className="flex flex-col sm:flex-row lg:flex-row gap-4 lg:gap-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full sm:max-w-xs lg:max-w-sm xl:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by product, customer, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 sm:w-36 lg:w-40 bg-gray-50/50 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100">
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
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-100/50 px-2 sm:px-3 py-2 rounded-lg whitespace-nowrap">
              <span className="font-medium text-gray-700">{count}</span>
              <span className="hidden sm:inline">of</span>
              <span className="sm:hidden">/</span>
              <span className="font-medium text-gray-700">{totalRequests}</span>
              <span className="hidden lg:inline">enquiries</span>
            </div>
          </div>
        </div>

        {/* Advanced Table Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
          <div className="p-4 sm:p-6 pb-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Quote Enquiries
              </h2>
              <div className="text-xs sm:text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {loading ? (
            /* Loading State */
            <div className="p-4 sm:p-6 pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-8 sm:w-10 lg:w-12">
                      <Skeleton className="h-4 w-8" />
                    </TableHead>
                    <TableHead className="min-w-[180px] sm:min-w-[200px]">
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead className="w-20 sm:w-24">
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead className="min-w-[100px] sm:min-w-[120px]">
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead className="w-28 sm:w-32">
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead className="w-20 sm:w-24">
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead className="min-w-[130px] sm:min-w-[150px]">
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead className="w-12 sm:w-16">
                      <Skeleton className="h-4 w-12" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-xl" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-3 h-3 rounded" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-3 h-3 rounded" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Skeleton className="w-3 h-3 rounded" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                          <Skeleton className="h-3 w-12 ml-5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-8 h-8 rounded-lg" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Try Again
              </Button>
            </div>
          ) : (
            /* Data Table */
            <div className="p-4 sm:p-6 pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-8 sm:w-10 lg:w-12 font-semibold text-gray-700">
                      #
                    </TableHead>
                    <TableHead className="min-w-[180px] sm:min-w-[200px] font-semibold text-gray-700">
                      Product
                    </TableHead>
                    <TableHead className="w-20 sm:w-24 font-semibold text-gray-700">
                      Quantity
                    </TableHead>
                    <TableHead className="min-w-[100px] sm:min-w-[120px] font-semibold text-gray-700">
                      Details
                    </TableHead>
                    <TableHead className="w-28 sm:w-32 font-semibold text-gray-700">
                      Date
                    </TableHead>
                    <TableHead className="w-20 sm:w-24 font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="min-w-[130px] sm:min-w-[150px] font-semibold text-gray-700">
                      Customer
                    </TableHead>
                    <TableHead className="w-12 sm:w-16 font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
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
                      </TableCell>
                    </TableRow>
                  ) : (
                    enquiries.map((item: QuoteEnquiry, index: number) => (
                      <TableRow key={item._id || item.id}>
                        <TableCell>
                          <span className="text-sm font-medium text-gray-900">
                            {(currentPage - 1) * pageSize + index + 1}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 truncate" title={item.product?.productName || "Unknown Product"}>
                                {item.product?.productName || "Unknown Product"}
                              </p>
                              {item.product?.sku && (
                                <p className="text-xs text-gray-500 truncate" title={`SKU: ${item.product.sku}`}>
                                  SKU: {item.product.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {item.incoterm && (
                              <div className="flex items-center gap-2">
                                <Truck className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-600 font-medium truncate">
                                  {getIncotermValue(item.incoterm)}
                                </span>
                              </div>
                            )}
                            {item.packaging && (
                              <div className="flex items-center gap-2">
                                <Package className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-600 truncate">
                                  {item.packaging}
                                </span>
                              </div>
                            )}
                            {item.grade && (
                              <div className="flex items-center gap-2">
                                <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-600 truncate">
                                  {item.grade.name || ""}
                                </span>
                              </div>
                            )}
                            {!item.incoterm && !item.packaging && !item.grade && (
                              <span className="text-xs text-gray-400 italic">No details available</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "2-digit",
                                        year: "2-digit",
                                      }
                                    )
                                  : "--"}
                              </span>
                            </div>
                            {item.createdAt && (
                              <span className="text-xs text-gray-500 ml-5">
                                {new Date(item.createdAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={getStatusBadge(item.status)}>
                            {getStatusIcon(item.status)}
                            <span>{getStatusText(item.status)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate" title={item.user?.email || "Unknown User"}>
                                {item.user?.email || "Unknown User"}
                              </p>
                              {item.user?.name && (
                                <p className="text-xs text-gray-500 truncate" title={item.user.name}>
                                  {item.user.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/user/quote-enquiries/${item._id || item.id}`)
                            }
                            className="w-9 h-9 p-0 rounded-lg hover:bg-green-100 hover:text-green-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && enquiries.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="text-xs sm:text-sm text-gray-600">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalRequests)} of{" "}
                  {totalRequests} enquiries
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
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
                          className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-500 px-1 sm:px-2 text-xs sm:text-sm">...</span>
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
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
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
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
