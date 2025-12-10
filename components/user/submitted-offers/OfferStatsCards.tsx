import { Send, Clock, CheckCircle, Calendar } from "lucide-react";

interface OfferStatsCardsProps {
  totalSubmitted: number;
  pending: number;
  approved: number;
  thisMonthCount: number;
}

export const OfferStatsCards = ({
  totalSubmitted,
  pending,
  approved,
  thisMonthCount,
}: OfferStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs font-medium mb-1">
              Total Offers
            </p>
            <p className="text-2xl font-bold text-gray-900">{totalSubmitted}</p>
          </div>
          <div className="bg-green-100 p-2 rounded-lg">
            <Send className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-xs font-medium mb-1">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{pending}</p>
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
            <p className="text-2xl font-bold text-gray-900">{approved}</p>
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
            <p className="text-2xl font-bold text-gray-900">{thisMonthCount}</p>
          </div>
          <div className="bg-blue-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
