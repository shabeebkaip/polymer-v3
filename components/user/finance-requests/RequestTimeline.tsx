import React from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface RequestTimelineProps {
  createdAt: string;
  updatedAt: string;
  formatDate: (date: string) => string;
}

export const RequestTimeline: React.FC<RequestTimelineProps> = ({
  createdAt,
  updatedAt,
  formatDate
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-green-600" />
        Request Timeline
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Created</p>
            <p className="font-medium text-gray-900 text-sm">{formatDate(createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Last Updated</p>
            <p className="font-medium text-gray-900 text-sm">{formatDate(updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
