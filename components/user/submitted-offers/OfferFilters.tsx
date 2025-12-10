import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface OfferFiltersProps {
  searchTerm: string;
  statusFilter: string;
  totalFilteredItems: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  onClearSearch: () => void;
  onClearStatus: () => void;
  statusOptions: Array<{ label: string; value: string }>;
}

export const OfferFilters = ({
  searchTerm,
  statusFilter,
  totalFilteredItems,
  onSearchChange,
  onStatusChange,
  onClearFilters,
  onClearSearch,
  onClearStatus,
  statusOptions,
}: OfferFiltersProps) => {
  const hasActiveFilters = searchTerm || statusFilter !== "all";

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by product, company, or buyer email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-40">
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
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} size="sm">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {totalFilteredItems} {totalFilteredItems === 1 ? "offer" : "offers"}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
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
                onClick={onClearSearch}
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
              {statusOptions.find((opt) => opt.value === statusFilter)?.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearStatus}
                className="h-auto p-0 ml-1 hover:bg-green-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
