import { Send } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Send className="w-6 h-6 text-green-600 animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Offer Details</h3>
            <p className="text-gray-600 max-w-md">
              Please wait while we fetch the detailed information for this offer...
            </p>
            
            <div className="flex space-x-1 mt-4">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
