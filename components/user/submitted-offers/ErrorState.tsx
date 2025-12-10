import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Offer not found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              The requested offer could not be found or loaded. Please try again or go back to the offers list.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => router.back()} 
                variant="outline"
                className="bg-white border-gray-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button 
                onClick={onRetry}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
