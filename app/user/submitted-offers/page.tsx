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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Send,
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
  X,
  RefreshCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmittedOffersStore } from "@/stores/submittedOffersStore";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

const SubmittedOffers = () => {
  const router = useRouter();

  // Zustand store
  const { offers, meta, loading, error, fetchOffers } =
    useSubmittedOffersStore();
  console.log("Offers:", offers);
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Local state for debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);

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

  // Fetch data when component mounts
  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Clear filters function
  const clearFilters = (): void => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          icon: Clock,
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
        };
      case "approved":
        return {
          icon: CheckCircle,
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
        };
      case "completed":
        return {
          icon: CheckCircle,
          color: "bg-emerald-500",
          textColor: "text-emerald-700",
          bgColor: "bg-emerald-50",
        };
      default:
        return {
          icon: AlertCircle,
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
        };
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle view details
  const handleViewDetails = (bulkOrderId: string) => {
    router.push(`/user/submitted-offers/${bulkOrderId}`);
  };

  // Filter offers
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      !debouncedSearchTerm ||
      offer.bulkOrderId?.product?.productName
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      offer.buyer?.company
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      offer.buyer?.email
        ?.toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      offer.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalFilteredItems = filteredOffers.length;
  const totalPages = Math.ceil(totalFilteredItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentOffers = filteredOffers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error loading offers
              </h3>
              <p className="text-gray-600 mb-4 max-w-md">{error}</p>
              <Button
                onClick={fetchOffers}
                variant="outline"
                className="bg-white/80 border-gray-200"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <Send className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Submitted Offers
                </h1>
                <p className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2 font-medium">
                  Track and manage your submitted offers to buyers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={fetchOffers}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-white/90"
                >
                  <RefreshCcw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-200/50 hover:shadow-xl hover:scale-105 transition-all duration-500 hover:bg-white/90">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                      Total Offers
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {meta?.summary?.totalSubmitted || offers.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 sm:p-3 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 flex-shrink-0">
                    <Send className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
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
                      {meta?.summary?.pending ||
                        offers.filter(
                          (offer) => offer.status?.toLowerCase() === "pending"
                        ).length}
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
                      {meta?.summary?.approved ||
                        offers.filter(
                          (offer) => offer.status?.toLowerCase() === "approved"
                        ).length}
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
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {
                        offers.filter((offer) => {
                          const offerDate = new Date(offer.createdAt);
                          const currentDate = new Date();
                          return (
                            offerDate.getMonth() === currentDate.getMonth() &&
                            offerDate.getFullYear() ===
                              currentDate.getFullYear()
                          );
                        }).length
                      }
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 sm:p-3 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
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
                placeholder="Search by product, company, or buyer email..."
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
              <span className="font-medium text-gray-700">
                {filteredOffers.length}
              </span>
              <span className="hidden sm:inline">of</span>
              <span className="sm:hidden">/</span>
              <span className="font-medium text-gray-700">{offers.length}</span>
              <span className="hidden lg:inline">offers</span>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || statusFilter !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200/50">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
                >
                  Search: {searchTerm}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="h-auto p-0 ml-1 hover:bg-green-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
                >
                  Status:{" "}
                  {
                    statusOptions.find((opt) => opt.value === statusFilter)
                      ?.label
                  }
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className="h-auto p-0 ml-1 hover:bg-green-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Offers Content Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
          <div className="p-4 sm:p-6 pb-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Your Submitted Offers
              </h2>
              {totalPages > 0 && (
                <div className="text-xs sm:text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="overflow-hidden bg-white/60">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Offers Grid */}
          {!loading && (
            <>
              {currentOffers.length === 0 ? (
                <div className="p-4 sm:p-6 pt-0">
                  <Card className="bg-white/60">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Send className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {filteredOffers.length === 0 && offers.length > 0
                          ? "No offers match your filters"
                          : "No submitted offers yet"}
                      </h3>
                      <p className="text-gray-600 text-center max-w-md">
                        {filteredOffers.length === 0 && offers.length > 0
                          ? "Try adjusting your search criteria or filters to find what you're looking for."
                          : "When you submit offers to buyers, they will appear here for you to track and manage."}
                      </p>
                      {filteredOffers.length === 0 && offers.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="mt-4"
                        >
                          Clear all filters
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentOffers.map((offer) => {
                      const statusInfo = getStatusInfo(offer.status);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <Card
                          key={offer._id}
                          className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white/80 backdrop-blur-sm border-gray-200/50"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                                  {offer.bulkOrderId?.product?.productName ||
                                    "Unknown Product"}
                                </CardTitle>
                                <p className="text-sm text-gray-600 mt-1">
                                  {offer.bulkOrderId?.product?.tradeName ||
                                    offer.bulkOrderId?.product?.chemicalName}
                                </p>
                              </div>
                              <Badge
                                className={`${statusInfo.bgColor} ${statusInfo.textColor} border-0 ml-2`}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {offer.status}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            {/* Buyer Information */}
                            <div className="flex items-start gap-3">
                              <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {offer.buyer?.company || "Unknown Company"}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {offer.buyer?.name}
                                </p>
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {offer.bulkOrderId?.quantity}{" "}
                                  {offer.bulkOrderId?.uom}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">
                                  {formatCurrency(offer.pricePerUnit)}
                                </span>
                              </div>
                            </div>

                            {/* Delivery & Terms */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Delivery: {offer.deliveryTimeInDays} days
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600 truncate">
                                  {offer.incotermAndPackaging}
                                </span>
                              </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-200/50">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Submitted on {formatDate(offer.createdAt)}
                              </span>
                            </div>

                            {/* Actions */}
                            <Button
                              onClick={() => handleViewDetails(offer.bulkOrderId?._id)}
                              className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 hover:text-white"
                              variant="outline"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 sm:p-6 pt-0 border-t border-gray-200/50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, totalFilteredItems)} of{" "}
                      {totalFilteredItems} offers
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-white/80 border-gray-200"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {/* Show page numbers */}
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          const isCurrentPage = pageNumber === currentPage;

                          // Show first page, last page, current page, and pages around current
                          const showPage =
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 &&
                              pageNumber <= currentPage + 1);

                          if (!showPage) {
                            // Show ellipsis
                            if (
                              pageNumber === currentPage - 2 ||
                              pageNumber === currentPage + 2
                            ) {
                              return (
                                <span
                                  key={pageNumber}
                                  className="px-2 text-gray-400"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <Button
                              key={pageNumber}
                              variant={isCurrentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNumber)}
                              className={`w-8 h-8 p-0 ${
                                isCurrentPage
                                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0"
                                  : "bg-white/80 border-gray-200"
                              }`}
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-white/80 border-gray-200"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
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

export default SubmittedOffers;
