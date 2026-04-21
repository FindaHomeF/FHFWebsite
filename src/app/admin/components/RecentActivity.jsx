'use client';
import { Clock, User, Home, Wrench } from 'lucide-react';

const recentActivities = [
  {
    id: 1,
    type: 'user',
    message: 'New user registered: John Doe',
    time: '2 minutes ago',
    icon: User,
  },
  {
    id: 2,
    type: 'property',
    message: 'Property listing approved: Marble Lodge',
    time: '5 minutes ago',
    icon: Home,
  },
  {
    id: 3,
    type: 'service',
    message: 'Service provider verified: ABC Plumbing',
    time: '1 hour ago',
    icon: Wrench,
  },
  {
    id: 4,
    type: 'user',
    message: 'User profile updated: Jane Smith',
    time: '2 hours ago',
    icon: User,
  },
  {
    id: 5,
    type: 'property',
    message: 'New property listing: Sunset Villa',
    time: '3 hours ago',
    icon: Home,
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <activity.icon className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button type="button" className="text-sm text-primary hover:text-primary-dark font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
}

