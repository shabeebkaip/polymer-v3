import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

interface StatusTimelineProps {
  createdAt: string;
  updatedAt: string;
  getStatusTimeline: () => Array<{
    status: string;
    label: string;
    completed: boolean;
    current: boolean;
    icon: React.ReactNode;
  }>;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  createdAt,
  updatedAt,
  getStatusTimeline,
}) => {
  const timeline = getStatusTimeline();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Clock className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Status Timeline</h3>
      </div>

      {/* Timeline Progress */}
      <div className="relative">
        {timeline.map((timelineItem, index) => (
          <div key={timelineItem.status} className="flex items-center mb-3 last:mb-0">
            <div className="flex items-center gap-3 flex-1">
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                timelineItem.current 
                  ? 'border-green-500 bg-green-50' 
                  : timelineItem.completed 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300 bg-gray-50'
              }`}>
                {timelineItem.completed && !timelineItem.current ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <div className={`${
                    timelineItem.current 
                      ? 'text-green-600' 
                      : timelineItem.completed 
                        ? 'text-white'
                        : 'text-gray-400'
                  }`}>
                    {timelineItem.icon}
                  </div>
                )}
                
                {timelineItem.current && (
                  <div className="absolute -inset-1 rounded-full border-2 border-green-300 animate-pulse"></div>
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  timelineItem.current 
                    ? 'text-green-900' 
                    : timelineItem.completed 
                      ? 'text-gray-900'
                      : 'text-gray-500'
                }`}>
                  {timelineItem.label}
                </p>
                {timelineItem.current && (
                  <p className="text-xs text-green-600">Current</p>
                )}
              </div>
            </div>
            
            {index < timeline.length - 1 && (
              <div className={`absolute left-4 mt-8 w-0.5 h-5 ${
                timelineItem.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} style={{ top: `${index * 52 + 32}px` }}></div>
            )}
          </div>
        ))}
      </div>

      {/* Timestamps */}
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Created</span>
          <span className="font-medium text-gray-900">
            {new Date(createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Updated</span>
          <span className="font-medium text-gray-900">
            {new Date(updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
