import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { OfferStatsCards } from "./OfferStatsCards";

interface OfferHeaderProps {
  loading: boolean;
  totalSubmitted: number;
  pending: number;
  approved: number;
  thisMonthCount: number;
  onRefresh: () => void;
}

export const OfferHeader = ({
  loading,
  totalSubmitted,
  pending,
  approved,
  thisMonthCount,
  onRefresh,
}: OfferHeaderProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Submitted Offers
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Track and manage your submitted offers to buyers
            </p>
          </div>
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <OfferStatsCards
          totalSubmitted={totalSubmitted}
          pending={pending}
          approved={approved}
          thisMonthCount={thisMonthCount}
        />
      </div>
    </div>
  );
};
