import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  Clock,
  Eye,
  Truck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getStatusConfig } from "@/lib/config/status.config";

interface BuyerInfo {
  name: string;
  email: string;
  company: string;
}

interface OfferUser {
  _id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
}

interface OfferProduct {
  _id: string;
  productName: string;
  chemicalName: string;
  tradeName: string;
}

interface BulkOrderDetails {
  _id: string;
  user: OfferUser;
  product: OfferProduct;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  destination?: string;
}

interface SubmittedOffer {
  _id: string;
  bulkOrderId: BulkOrderDetails;
  pricePerUnit: number;
  availableQuantity: number;
  deliveryTimeInDays: number;
  incotermAndPackaging: string;
  message: string;
  status: string;
  createdAt: string;
  buyer?: BuyerInfo;
}

interface OfferCardProps {
  offer: SubmittedOffer;
  onViewDetails: (bulkOrderId: string) => void;
  formatDateDisplay: (dateString: string) => string;
}

export const OfferCard = ({
  offer,
  onViewDetails,
  formatDateDisplay,
}: OfferCardProps) => {
  const statusConfig = getStatusConfig(offer.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
              {offer.bulkOrderId?.product?.productName || "Unknown Product"}
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {offer.bulkOrderId?.product?.tradeName ||
                offer.bulkOrderId?.product?.chemicalName}
            </p>
          </div>
          <Badge
            className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0 ml-2`}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Buyer Information */}
        {offer.buyer ? (
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {offer.buyer.company || "Unknown Company"}
              </p>
              <p className="text-xs text-gray-500 truncate">{offer.buyer.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {offer.bulkOrderId?.user?.company || "Unknown Company"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {offer.bulkOrderId?.user?.firstName}{" "}
                {offer.bulkOrderId?.user?.lastName}
              </p>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Requested:</span>
            <span className="font-medium text-gray-900">
              {offer.bulkOrderId?.quantity} {offer.bulkOrderId?.uom}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Available:</span>
            <span className="font-medium text-green-600">
              {offer.availableQuantity} {offer.bulkOrderId?.uom}
            </span>
          </div>
          <div className="flex items-center justify-between bg-green-50 p-2 rounded">
            <span className="text-xs text-gray-600">Price per Unit</span>
            <span className="text-sm font-bold text-green-700">
              {formatCurrency(offer.pricePerUnit)}
            </span>
          </div>
        </div>

        {/* Delivery & Terms */}
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 truncate">
              {offer.bulkOrderId?.city}, {offer.bulkOrderId?.country}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {offer.deliveryTimeInDays} days · {offer.incotermAndPackaging}
            </span>
          </div>
        </div>

        {/* Message if present */}
        {offer.message && (
          <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 line-clamp-2">
            {offer.message}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 pt-2 border-t text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          {formatDateDisplay(offer.createdAt)}
        </div>

        {/* Actions */}
        <Button
          onClick={() => onViewDetails(offer.bulkOrderId?._id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
