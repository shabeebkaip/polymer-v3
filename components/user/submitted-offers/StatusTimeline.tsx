import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StatusTimelineProps {
  orderCreatedAt?: string;
  offerCreatedAt: string;
  offerUpdatedAt: string;
  statusTimeline?: Array<{
    _id: string;
    status: string;
    message?: string;
    date: string;
    updatedBy: string;
  }>;
}

export const StatusTimeline = ({
  orderCreatedAt,
  offerCreatedAt,
  offerUpdatedAt,
  statusTimeline
}: StatusTimelineProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-green-600" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {orderCreatedAt && (
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-gray-900">Order Created</p>
              <p className="text-xs text-gray-600">
                {formatDate(orderCreatedAt)}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm text-gray-900">Offer Submitted</p>
            <p className="text-xs text-gray-600">
              {formatDate(offerCreatedAt)}
            </p>
          </div>
        </div>
        
        {statusTimeline && statusTimeline.map((timeline) => (
          <div key={timeline._id} className="flex items-start gap-2">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
              timeline.status === 'approved' ? 'bg-green-600' : 
              timeline.status === 'rejected' ? 'bg-red-600' : 
              timeline.status === 'pending' ? 'bg-yellow-600' : 'bg-gray-600'
            }`}></div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-gray-900 capitalize">{timeline.status}</p>
              {timeline.message && (
                <p className="text-xs text-gray-600 mb-0.5">{timeline.message}</p>
              )}
              <p className="text-xs text-gray-500">
                {formatDate(timeline.date)} • {timeline.updatedBy}
              </p>
            </div>
          </div>
        ))}

        {offerUpdatedAt !== offerCreatedAt && !statusTimeline?.length && (
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-gray-900">Last Updated</p>
              <p className="text-xs text-gray-600">
                {formatDate(offerUpdatedAt)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
