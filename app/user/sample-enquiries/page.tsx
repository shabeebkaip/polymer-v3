"use client";

import {
  FlaskConical,
  Package,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUserSampleEnquiries } from "@/apiServices/user";
import { useSampleEnquiriesStore } from "@/stores/sampleEnquiriesStore";
import { GenericTable, Column } from "@/components/shared/GenericTable";
import { FilterBar, FilterOption, ActiveFilter } from "@/components/shared/FilterBar";
import { SampleEnquiry } from "@/types/sampleEnquiry";
import { getStatusConfig } from "@/lib/config/status.config";

const SampleEnquiries = () => {
  const router = useRouter();

  // Zustand store
  const { enquiries, meta, setEnquiries, clearEnquiries } = useSampleEnquiriesStore();
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(meta?.filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(meta?.filters?.status || "all");
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
        handleClearFilters();
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

        const response = await getUserSampleEnquiries(params);
        setEnquiries(response.data || [], response.meta);
      } catch (err) {
        console.error("Error fetching enquiries:", err);
        clearEnquiries();
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [currentPage, debouncedSearchTerm, statusFilter, setEnquiries, clearEnquiries]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1 && (debouncedSearchTerm || statusFilter !== "all")) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, statusFilter, currentPage]);

  // Pagination helpers
  const totalPages = meta?.pagination?.totalPages || 1;
  const totalRequests = meta?.pagination?.total || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };



  // Define status options for filter
  const statusOptions: FilterOption[] = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "responded", label: "Responded" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" },
    { value: "sent", label: "Sent" },
    { value: "delivered", label: "Delivered" },
  ];

  // Define active filters for display
  const activeFilters: ActiveFilter[] = [];
  if (debouncedSearchTerm) {
    activeFilters.push({
      type: "search",
      label: `"${debouncedSearchTerm}"`,
      value: debouncedSearchTerm,
      onRemove: () => setSearchTerm(""),
    });
  }
  if (statusFilter !== "all") {
    activeFilters.push({
      type: "status",
      label: getStatusConfig(statusFilter).text,
      value: statusFilter,
      onRemove: () => setStatusFilter("all"),
    });
  }

  // Define table columns
  const columns: Column<SampleEnquiry>[] = [
    {
      key: "index",
      label: "#",
      render: (_item, index) => (
        <span className="text-sm text-gray-600">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      key: "product",
      label: "Product",
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.product?.productImages?.[0] ? (
            <Image
              src={item.product.productImages[0].fileUrl}
              alt={item.product?.productName || "Product"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-green-600" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 text-sm line-clamp-1">
              {item.product?.productName || "N/A"}
            </p>
            {item.product?.grade && (
              <p className="text-xs text-gray-600 mt-0.5">
                Grade: {item.product.grade}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 text-sm">
            {item.quantity?.toLocaleString() || "N/A"}
          </span>
          {item.uom && (
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {item.uom}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "company",
      label: "Company",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm font-medium">
            {item.user?.company || "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-900 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => {
        const statusConfig = getStatusConfig(item.status);
        const StatusIcon = statusConfig.icon;
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border`}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig.text}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <button
          onClick={() => router.push(`/user/sample-enquiries/${item._id}`)}
          className="inline-flex items-center justify-center w-8 h-8 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-primary-600" />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2.5 rounded-lg">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Sample Enquiries
                </h1>
                <p className="text-gray-600 text-sm mt-0.5">
                  Track and manage your sample requests
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Total Enquiries</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalRequests}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <FlaskConical className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {enquiries.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">Approved</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {enquiries.filter((r) => r.status === "approved").length}
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-1">This Month</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {enquiries.filter((e) => {
                      const enquiryDate = new Date(e.createdAt || "");
                      const currentDate = new Date();
                      return (
                        enquiryDate.getMonth() === currentDate.getMonth() &&
                        enquiryDate.getFullYear() === currentDate.getFullYear()
                      );
                    }).length}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          statusOptions={statusOptions}
          onStatusChange={setStatusFilter}
          onClearFilters={handleClearFilters}
          activeFilters={activeFilters}
          isSearching={!!debouncedSearchTerm && loading}
        />

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <GenericTable
            data={enquiries}
            columns={columns}
            loading={loading}
            emptyState={{
              icon: debouncedSearchTerm || statusFilter !== "all"
                ? <Search className="w-6 h-6 text-gray-400" />
                : <FlaskConical className="w-6 h-6 text-gray-400" />,
              title: debouncedSearchTerm || statusFilter !== "all"
                ? "No Matching Enquiries"
                : "No Sample Enquiries",
              description: debouncedSearchTerm || statusFilter !== "all"
                ? "No sample enquiries match your filters. Try adjusting your search."
                : "You haven't received any sample enquiries yet.",
              action: (debouncedSearchTerm || statusFilter !== "all") ? (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Clear Filters
                </button>
              ) : undefined
            }}
            resultsHeader={{
              title: "Enquiries",
              isFiltered: debouncedSearchTerm !== "" || statusFilter !== "all",
              totalCount: totalRequests
            }}
            pagination={{
              currentPage,
              totalPages,
              pageSize,
              totalItems: totalRequests,
              onPageChange: handlePageChange
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SampleEnquiries;
