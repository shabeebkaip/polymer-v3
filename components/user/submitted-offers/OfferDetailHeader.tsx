import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface OfferDetailHeaderProps {
  buyerCompany: string;
  statusConfig: {
    bgColor: string;
    textColor: string;
    borderColor: string;
    text: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

export const OfferDetailHeader = ({ buyerCompany, statusConfig }: OfferDetailHeaderProps) => {
  const router = useRouter();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 mx-auto max-w-7xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-green-600 p-2 rounded-lg flex-shrink-0">
              <Send className="w-5 h-5 text-white" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                Offer Details
              </h1>
              <p className="text-sm text-gray-600 truncate">
                {buyerCompany}
              </p>
            </div>
          </div>
        </div>
        
        <Badge 
          className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0 px-2.5 py-1 text-xs font-medium flex-shrink-0`}
        >
          <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
          {statusConfig.text}
        </Badge>
      </div>
    </div>
  );
};
