import { Deal } from '@/types/home';
import QuoteDealRequestModal from '@/components/shared/QuoteDealRequestModal';
import { useRouter } from 'next/navigation';
import { Star, Calendar, MapPin, Package, Zap, Gift } from 'lucide-react';

const DealCard: React.FC<{
  deal: Deal;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
  isGuest: boolean;
  isBuyer: boolean;
}> = ({ deal, formatPrice, formatDate, isGuest, isBuyer }) => {
  const router = useRouter();

  const handleButtonClick = () => {
    if (isGuest) {
      // Redirect to signup page for guests
      router.push('/auth/register');
    }
    // For buyers, the QuoteDealRequestModal will handle the click
  };

  const getButtonText = () => {
    if (isGuest) {
      return 'Sign Up for More Details';
    } else if (isBuyer) {
      return 'Grab This Deal';
    }
    return 'View Deal';
  };


  // For buyers, render the deal quote modal; for others, render a regular button
  const renderActionButton = () => {
    if (isBuyer) {
      return (
        <QuoteDealRequestModal
          dealId={deal.id}
          dealProduct={deal.product}
          dealSupplier={deal.supplier.name}
          dealMinQuantity={deal.minQuantity}
          dealPrice={deal.discountedPrice}
          buttonText={getButtonText()}
          className="w-full"
        />
      );
    }

    return (
      <button
        onClick={handleButtonClick}
        className="w-full bg-green-700 text-white py-2 rounded font-medium border border-green-800 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2 group"
      >
        <Zap className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        <span className="tracking-tight">{getButtonText()}</span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow border hover:shadow-xl transition-all duration-200 overflow-hidden group">
      {/* Badge */}
      <div className="bg-green-700 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Gift className="w-4 h-4" />
          {deal.badge}
        </span>
        {deal.discount > 0 && (
          <span className="bg-white text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">
            -{deal.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-5">
        {/* Product Info */}
        <h4 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">{deal.product}</h4>
        <p className="text-gray-700 text-xs mb-3 line-clamp-2">{deal.description}</p>

        {/* Supplier Info */}
        <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center overflow-hidden">
            <Package className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm truncate">{deal.supplier.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{deal.supplier.rating}</span>
              <span>•</span>
              <MapPin className="w-3 h-3" />
              <span className="truncate">{deal.supplier.location}</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-green-700">
            {formatPrice(deal.discountedPrice)}
          </span>
          {deal.originalPrice !== deal.discountedPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(deal.originalPrice)}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            <span>Min: {deal.minQuantity}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Valid till {formatDate(deal.validUntil)}</span>
          </div>
        </div>

        {/* Action Button */}
        {renderActionButton()}
      </div>
    </div>
  );
};

export default DealCard;
