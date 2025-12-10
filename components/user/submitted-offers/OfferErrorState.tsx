import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfferErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const OfferErrorState = ({ error, onRetry }: OfferErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 lg:px-6 py-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error loading offers
            </h3>
            <p className="text-gray-600 mb-4 max-w-md">{error}</p>
            <Button
              onClick={onRetry}
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
};
