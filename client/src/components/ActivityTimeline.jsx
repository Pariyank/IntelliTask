import React from 'react';
import { Clock, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ActivityTimeline = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Clock size={18} className="text-indigo-500" /> Activity Timeline
      </h3>
      <div className="space-y-6">
        {activities?.map((log, idx) => (
          <div key={idx} className="flex gap-4 relative">
            {idx !== activities.length - 1 && (
              <div className="absolute left-[11px] top-7 w-[2px] h-10 bg-gray-100"></div>
            )}
            <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center z-10">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-700 font-medium">{log.action}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                  <UserIcon size={10} /> {log.user}
                </span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(log.timestamp))} ago</span>
              </div>
            </div>
          </div>
        ))}
        {(!activities || activities.length === 0) && (
          <p className="text-gray-400 text-sm italic">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;