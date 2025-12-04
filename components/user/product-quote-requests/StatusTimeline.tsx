import React from 'react';
import { Clock } from 'lucide-react';

interface StatusTimelineProps {
  statusHistory: Array<{
    status: string;
    message: string;
    date: string;
    updatedBy: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  statusHistory,
  createdAt,
  updatedAt,
  getStatusIcon,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Clock className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Status Timeline</h3>
      </div>

      <div className="space-y-3">
        {statusHistory && statusHistory.length > 0 ? (
          statusHistory.map((item, index) => (
            <div key={item._id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === statusHistory.length - 1
                      ? 'bg-primary-100 ring-2 ring-primary-200'
                      : 'bg-gray-100'
                  }`}
                >
                  {getStatusIcon(item.status)}
                </div>
                {index < statusHistory.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-200 my-0.5"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <div
                  className={`p-3 rounded-lg ${
                    index === statusHistory.length - 1
                      ? 'bg-primary-50 border border-primary-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-medium capitalize ${
                        index === statusHistory.length - 1
                          ? 'text-primary-700'
                          : 'text-gray-900'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-1">by {item.updatedBy}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No status history available</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Created</span>
          <span className="font-medium text-gray-900">
            {new Date(createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Last Updated</span>
          <span className="font-medium text-gray-900">
            {new Date(updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
