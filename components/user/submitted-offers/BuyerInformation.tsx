import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, MapPin, Copy } from "lucide-react";
import { toast } from "sonner";

interface BuyerInformationProps {
  buyer: {
    company: string;
    name: string;
    email: string;
    phone?: number;
    address?: {
      full?: string;
    };
  };
  deliveryLocation: {
    city?: string;
    country?: string;
  };
}

export const BuyerInformation = ({ buyer, deliveryLocation }: BuyerInformationProps) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4 text-green-600" />
          Buyer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Company</label>
          <p className="font-semibold text-sm text-gray-900">{buyer.company}</p>
        </div>
        
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Contact Person</label>
          <p className="text-sm text-gray-900">{buyer.name}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900 flex-1 truncate">{buyer.email}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => copyToClipboard(buyer.email, "Email")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {buyer.phone && (
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Phone</label>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-900 flex-1">{buyer.phone}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(buyer.phone?.toString() || "", "Phone")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {buyer.address?.full && (
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Address</label>
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-900">
                {buyer.address.full}
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Delivery Location</label>
          <div className="flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-900">
              {[deliveryLocation.city, deliveryLocation.country].filter(Boolean).join(", ")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
