import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

export interface TimelineItem {
  status: string;
  label: string;
  completed: boolean;
  current: boolean;
  icon: React.ReactNode;
}

interface StatusTimelineProps {
  timeline: TimelineItem[];
  createdAt?: string;
  updatedAt?: string;
  showTimestamps?: boolean;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  timeline,
  createdAt,
  updatedAt,
  showTimestamps = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Status Timeline</h3>
      </div>

      <div className="relative space-y-3">
        {timeline.map((timelineItem, index) => (
          <div key={timelineItem.status} className="relative flex items-center gap-3">
            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 z-10 ${
              timelineItem.current 
                ? 'border-green-500 bg-green-50' 
                : timelineItem.completed 
                  ? 'border-green-500 bg-green-500' 
                  : 'border-gray-300 bg-gray-50'
            }`}>
              {timelineItem.completed && !timelineItem.current ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                React.isValidElement(timelineItem.icon) ? (
                  React.cloneElement(timelineItem.icon as React.ReactElement<{ className?: string }>, {
                    className: `w-4 h-4 ${
                      timelineItem.current 
                        ? 'text-green-600' 
                        : timelineItem.completed 
                          ? 'text-white'
                          : 'text-gray-400'
                    }`
                  })
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
                )
              )}
              
              {timelineItem.current && (
                <div className="absolute -inset-1 rounded-full border-2 border-green-300 animate-pulse"></div>
              )}
            </div>
            
            {/* Connecting line */}
            {index < timeline.length - 1 && (
              <div 
                className={`absolute left-4 top-8 w-0.5 h-6 ${
                  timelineItem.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
            )}
            
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
                <p className="text-xs text-green-600">Current Status</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Timestamps */}
      {showTimestamps && (createdAt || updatedAt) && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          {createdAt && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Created</span>
              <span className="font-medium text-gray-900">
                {new Date(createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
          {updatedAt && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Updated</span>
              <span className="font-medium text-gray-900">
                {new Date(updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
