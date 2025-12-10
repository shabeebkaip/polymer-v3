import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface YourOfferProps {
  pricePerUnit: number;
  totalValue: number;
  deliveryTimeInDays: number;
  incotermAndPackaging: string;
  message?: string;
}

export const YourOffer = ({
  pricePerUnit,
  totalValue,
  deliveryTimeInDays,
  incotermAndPackaging,
  message
}: YourOfferProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-4 w-4 text-green-600" />
          Your Offer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Price/Unit</label>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(pricePerUnit)}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Total Value</label>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Delivery Time</label>
            <p className="text-sm text-gray-900 flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-gray-400" />
              {deliveryTimeInDays} days
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Incoterm</label>
            <p className="text-sm text-gray-900">{incotermAndPackaging}</p>
          </div>

          {message && (
            <>
              <div className="border-t border-gray-200 my-3 col-span-2 md:col-span-4"></div>
              <div className="col-span-2 md:col-span-4">
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Your Message</label>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{message}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
