import { useRouter } from 'next/navigation';
import { MapPin, Package, TrendingUp, Users, Clock, ArrowRight } from 'lucide-react';
import { Request } from '@/types/home';
const RequestCard: React.FC<{
  request: Request;
  getUrgencyColor: (urgency: 'low' | 'medium' | 'high') => string;
  isGuest: boolean;
  isSeller: boolean;
}> = ({ request, getUrgencyColor, isGuest, isSeller }) => {
  const router = useRouter();

  // Helper function to format dates safely (local to component)
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No deadline';

    try {
      // Handle both ISO strings and regular date strings
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'No deadline';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'No deadline';
    }
  };

  const handleButtonClick = () => {
    if (isGuest) {
      // Redirect to signup page for guests
      router.push('/auth/register');
    } else if (isSeller) {
      // Handle quote submission for sellers
      router.push(`/user/submitted-offers/add/${request.id}`);
    }
  };

  const getButtonText = () => {
    if (isGuest) {
      return 'Sign Up to Submit Quote';
    } else if (isSeller) {
      return 'Submit Quote';
    }
    return 'View Request';
  };
  return (
    <div className="bg-white rounded-xl shadow border hover:shadow-xl transition-all duration-200 overflow-hidden group">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          BUYER OPPORTUNITY
        </span>
        <span
          className={`px-2 py-1 rounded text-xs font-bold border ${getUrgencyColor(request.urgency)}`}
        >
          {request.urgency.toUpperCase()} PRIORITY
        </span>
      </div>

      <div className="p-5">
        {/* Product Request Info */}
        <h4 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">{request.product}</h4>
        <p className="text-gray-700 text-xs mb-3 line-clamp-2">{request.description}</p>

        {/* Buyer Info */}
        <div className="flex items-center gap-3 mb-3 p-2 bg-green-50 rounded-lg">
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 text-sm truncate">
                {request.buyer.company}
              </h3>
              {request.buyer.verified && (
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">
                  ✓
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{request.buyer.location}</span>
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase font-semibold">Quantity</span>
            </div>
            <p className="font-bold text-green-700 text-sm">{request.quantity}</p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-500 uppercase font-semibold">Deadline</span>
            </div>
            <p className="font-bold text-green-700 text-sm">{formatDate(request.deadline)}</p>
          </div>
        </div>

        {/* Destination (if available) */}
        {request.destination && (
          <div className="bg-green-50 p-3 rounded-lg mb-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-500 uppercase font-semibold">Destination</span>
            </div>
            <p className="font-semibold text-green-700 text-sm">{request.destination}</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{request.responses} responses</span>
          </div>
          {request.budget && request.budget !== 'Contact for quote' && (
            <div className="font-semibold text-green-700">{request.budget}</div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleButtonClick}
          className="w-full bg-green-700 text-white py-2 rounded font-medium border border-green-800 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2 group"
        >
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          <span className="tracking-tight">{getButtonText()}</span>
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
