"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmittedOffersStore } from "@/stores/submittedOffersStore";
import { OfferHeader } from "@/components/user/submitted-offers/OfferHeader";
import { OfferFilters } from "@/components/user/submitted-offers/OfferFilters";
import { OfferLoadingSkeleton } from "@/components/user/submitted-offers/OfferLoadingSkeleton";
import { OfferEmptyState } from "@/components/user/submitted-offers/OfferEmptyState";
import { OfferGrid } from "@/components/user/submitted-offers/OfferGrid";
import { OfferPagination } from "@/components/user/submitted-offers/OfferPagination";
import { OfferErrorState } from "@/components/user/submitted-offers/OfferErrorState";

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
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Local state for debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);
  
  // Track if filters have changed to reset to page 1
  const [filtersChanged, setFiltersChanged] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setFiltersChanged(true);
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

  // Fetch data when filters or pagination changes
  useEffect(() => {
    if (filtersChanged) {
      setCurrentPage(1);
      setFiltersChanged(false);
    }
  }, [debouncedSearchTerm, statusFilter, filtersChanged]);

  // Fetch data when component mounts or filters/pagination change
  useEffect(() => {
    const params: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
    } = {
      page: currentPage,
      limit: pageSize,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    fetchOffers(params);
  }, [currentPage, debouncedSearchTerm, statusFilter, fetchOffers]);

  // Clear filters function
  const clearFilters = (): void => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    setFiltersChanged(true);
  };

  // Format date helper for display
  const formatDateDisplay = (dateString: string) => {
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

  // Use offers directly from API (already filtered and paginated)
  const currentOffers = offers;
  const totalPages = meta?.pagination?.totalPages || 1;
  const totalFilteredItems = meta?.pagination?.total || 0;
  const startIndex = ((meta?.pagination?.page || 1) - 1) * (meta?.pagination?.limit || pageSize);
  const endIndex = startIndex + (meta?.pagination?.count || 0);

  // Handle page change
  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calculate this month's offers count
  const thisMonthCount = offers.filter((offer) => {
    const offerDate = new Date(offer.createdAt);
    const currentDate = new Date();
    return (
      offerDate.getMonth() === currentDate.getMonth() &&
      offerDate.getFullYear() === currentDate.getFullYear()
    );
  }).length;

  const handleRefresh = () => {
    const params: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
    } = {
      page: currentPage,
      limit: pageSize,
    };
    if (statusFilter !== "all") params.status = statusFilter;
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    fetchOffers(params);
  };

  if (error) {
    return <OfferErrorState error={error} onRetry={() => fetchOffers()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 lg:px-6 py-6 max-w-7xl mx-auto">
        <OfferHeader
          loading={loading}
          totalSubmitted={meta?.summary?.totalSubmitted || offers.length}
          pending={
            meta?.summary?.pending ||
            offers.filter((offer) => offer.status?.toLowerCase() === "pending")
              .length
          }
          approved={
            meta?.summary?.approved ||
            offers.filter((offer) => offer.status?.toLowerCase() === "approved")
              .length
          }
          thisMonthCount={thisMonthCount}
          onRefresh={handleRefresh}
        />

        <OfferFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          totalFilteredItems={totalFilteredItems}
          onSearchChange={setSearchTerm}
          onStatusChange={setStatusFilter}
          onClearFilters={clearFilters}
          onClearSearch={() => {
            setSearchTerm("");
            setFiltersChanged(true);
          }}
          onClearStatus={() => {
            setStatusFilter("all");
            setFiltersChanged(true);
          }}
          statusOptions={statusOptions}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Submitted Offers
              </h2>
              {totalPages > 0 && (
                <div className="text-xs sm:text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          </div>

          {loading && <OfferLoadingSkeleton />}

          {!loading && (
            <>
              {currentOffers.length === 0 ? (
                <OfferEmptyState
                  hasActiveFilters={searchTerm !== "" || statusFilter !== "all"}
                  onClearFilters={clearFilters}
                />
              ) : (
                <OfferGrid
                  offers={currentOffers}
                  onViewDetails={handleViewDetails}
                  formatDateDisplay={formatDateDisplay}
                />
              )}

              <OfferPagination
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalFilteredItems}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmittedOffers;
