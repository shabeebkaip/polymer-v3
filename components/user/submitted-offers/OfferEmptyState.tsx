import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface OfferEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const OfferEmptyState = ({
  hasActiveFilters,
  onClearFilters,
}: OfferEmptyStateProps) => {
  return (
    <div className="p-6 pt-0">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Send className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {hasActiveFilters
              ? "No offers match your filters"
              : "No submitted offers yet"}
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            {hasActiveFilters
              ? "Try adjusting your search criteria or filters to find what you're looking for."
              : "When you submit offers to buyers, they will appear here for you to track and manage."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={onClearFilters} className="mt-4">
              Clear all filters
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
