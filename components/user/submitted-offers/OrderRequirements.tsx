import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface OrderRequirementsProps {
  requestedQuantity: number;
  availableQuantity: number;
  uom: string;
  city?: string;
  country?: string;
  deliveryDate?: string;
}

export const OrderRequirements = ({
  requestedQuantity,
  availableQuantity,
  uom,
  city,
  country,
  deliveryDate
}: OrderRequirementsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4 text-green-600" />
          Order Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Requested Qty</label>
            <p className="text-sm font-semibold text-gray-900">
              {requestedQuantity.toLocaleString()} {uom}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Available Qty</label>
            <p className="text-sm font-semibold text-green-600">
              {availableQuantity.toLocaleString()} {uom}
            </p>
          </div>
          {city && (
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Order City</label>
              <p className="text-sm text-gray-900">{city}</p>
            </div>
          )}
          {country && (
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Order Country</label>
              <p className="text-sm text-gray-900">{country}</p>
            </div>
          )}
          {deliveryDate && (
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Original Delivery Date</label>
              <p className="text-sm text-gray-900">{formatDate(deliveryDate)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
