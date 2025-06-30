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
import SampleRequestDetailModal from "@/components/user/sampleRequests/SampleRequestDetailModal";
import { Package, Calendar, Building2, AlertCircle, CheckCircle, XCircle, Clock, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const SampleRequest = () => {
  const [requests, setRequests] = useState<any[]>([]);
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
        
        // Handle the API response structure
        if (response && response.data) {
          setRequests(response.data || []);
          setTotalRequests(response.total || 0);
          setTotalPages(response.totalPages || 1);
          // Don't override currentPage from response, keep user's selection
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
      case "fullfilled":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
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
      case "fullfilled":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "fullfilled":
        return "Fulfilled";
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-700 p-2 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sample Requests</h1>
              <p className="text-gray-600 text-sm mt-1">
                Track and manage all your sample requests in one place
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total</p>
                  <p className="text-2xl font-bold text-purple-700">{totalRequests}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {requests.filter(r => r.status === "pending").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Approved</p>
                  <p className="text-2xl font-bold text-green-700">
                    {requests.filter(r => r.status === "approved").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Fulfilled</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {requests.filter(r => r.status === "fullfilled").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by product name or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="fullfilled">Fulfilled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your sample requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {totalRequests === 0 ? "No Sample Requests" : "No Matching Requests"}
              </h3>
              <p className="text-gray-600 mb-4">
                {totalRequests === 0 
                  ? "You haven't made any sample requests yet."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {searchTerm || statusFilter !== "all" ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">SL NO</TableHead>
                  <TableHead className="font-semibold text-gray-900">Product</TableHead>
                  <TableHead className="font-semibold text-gray-900">Quantity</TableHead>
                  <TableHead className="font-semibold text-gray-900">Company</TableHead>
                  <TableHead className="font-semibold text-gray-900">Date</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((item, index) => (
                  <TableRow key={item._id || index} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">
                      #{((currentPage - 1) * pageSize + index + 1).toString().padStart(3, '0')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {item.product?.productName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Grade: {item.grade?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {item.quantity || "N/A"}
                        </span>
                        {item.uom && (
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {item.uom}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {item.product?.createdBy?.company || "--"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
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
                    <TableCell>
                      <span className={getStatusBadge(item.status)}>
                        {getStatusIcon(item.status)}
                        {getStatusText(item.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <SampleRequestDetailModal mode="view" requestDetails={item} />
                        <SampleRequestDetailModal mode="edit" requestDetails={item} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <span>
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRequests)} of {totalRequests} results
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
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
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNumber
                              ? "bg-purple-700 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
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
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
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
