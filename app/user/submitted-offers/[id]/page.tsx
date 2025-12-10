"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSubmittedOffersStore } from "@/stores/submittedOffersStore";
import { getStatusConfig } from "@/lib/config/status.config";
import { OfferDetailHeader } from "@/components/user/submitted-offers/OfferDetailHeader";
import { ProductInformation } from "@/components/user/submitted-offers/ProductInformation";
import { OrderRequirements } from "@/components/user/submitted-offers/OrderRequirements";
import { YourOffer } from "@/components/user/submitted-offers/YourOffer";
import { StatusCard } from "@/components/user/submitted-offers/StatusCard";
import { BuyerInformation } from "@/components/user/submitted-offers/BuyerInformation";
import { StatusTimeline } from "@/components/user/submitted-offers/StatusTimeline";
import { LoadingState } from "@/components/user/submitted-offers/LoadingState";
import { ErrorState } from "@/components/user/submitted-offers/ErrorState";

const SubmittedOfferDetail = () => {
  const params = useParams();
  const offerId = params.id as string;

  const { 
    detailedOffer, 
    loading, 
    fetchOfferDetail,
    clearOfferDetail
  } = useSubmittedOffersStore();

  useEffect(() => {
    fetchOfferDetail(offerId);
    return () => {
      clearOfferDetail();
    };
  }, [offerId, fetchOfferDetail, clearOfferDetail]);

  if (loading) {
    return <LoadingState />;
  }

  if (!detailedOffer) {
    return <ErrorState onRetry={() => fetchOfferDetail(offerId)} />;
  }

  const statusConfig = getStatusConfig(detailedOffer.status);
  const totalValue = detailedOffer.pricePerUnit * detailedOffer.bulkOrderId.quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6">
        <OfferDetailHeader 
          buyerCompany={detailedOffer.buyer?.company}
          statusConfig={statusConfig}
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <ProductInformation 
                product={detailedOffer.bulkOrderId.product}
                deliveryLocation={detailedOffer.orderDetails.deliveryLocation}
                deliveryDate={detailedOffer.orderDetails.deliveryDate}
                orderStatus={detailedOffer.orderDetails.orderStatus}
              />

              <OrderRequirements 
                requestedQuantity={detailedOffer.orderDetails.quantity}
                availableQuantity={detailedOffer.availableQuantity}
                uom={detailedOffer.orderDetails.uom}
                city={detailedOffer.bulkOrderId.city}
                country={detailedOffer.bulkOrderId.country}
                deliveryDate={detailedOffer.bulkOrderId.delivery_date}
              />

              <YourOffer 
                pricePerUnit={detailedOffer.pricePerUnit}
                totalValue={totalValue}
                deliveryTimeInDays={detailedOffer.deliveryTimeInDays}
                incotermAndPackaging={detailedOffer.incotermAndPackaging}
                message={detailedOffer.message}
              />
            </div>

            <div className="space-y-4">
              <StatusCard 
                statusConfig={statusConfig}
                createdAt={detailedOffer.createdAt}
              />

              <BuyerInformation 
                buyer={detailedOffer.buyer}
                deliveryLocation={detailedOffer.orderDetails.deliveryLocation}
              />

              <StatusTimeline 
                orderCreatedAt={detailedOffer.orderDetails.orderCreatedAt}
                offerCreatedAt={detailedOffer.createdAt}
                offerUpdatedAt={detailedOffer.updatedAt}
                statusTimeline={detailedOffer.statusTimeline}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedOfferDetail;
