import { OfferCard } from "./OfferCard";

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

interface OfferGridProps {
  offers: SubmittedOffer[];
  onViewDetails: (bulkOrderId: string) => void;
  formatDateDisplay: (dateString: string) => string;
}

export const OfferGrid = ({
  offers,
  onViewDetails,
  formatDateDisplay,
}: OfferGridProps) => {
  return (
    <div className="p-6 pt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <OfferCard
            key={offer._id}
            offer={offer}
            onViewDetails={onViewDetails}
            formatDateDisplay={formatDateDisplay}
          />
        ))}
      </div>
    </div>
  );
};
