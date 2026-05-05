'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, Check, CheckCheck, MessageCircle, Star, Gift, TrendingUp, X } from 'lucide-react'

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    type: 'message',
    title: 'New message from John Doe',
    message: 'Hi, is the item still available?',
    timestamp: '2 mins ago',
    read: false,
    icon: MessageCircle,
    color: 'text-blue-500'
  },
  {
    id: '2',
    type: 'review',
    title: 'You received a new review',
    message: 'Sarah Smith left a 5-star review on your listing',
    timestamp: '1 hour ago',
    read: false,
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    id: '3',
    type: 'reward',
    title: 'Reward unlocked!',
    message: 'You\'ve earned the "Super Seller" badge',
    timestamp: '3 hours ago',
    read: true,
    icon: Gift,
    color: 'text-purple-500'
  },
  {
    id: '4',
    type: 'referral',
    title: 'New referral!',
    message: 'John Doe joined using your referral link',
    timestamp: '1 day ago',
    read: true,
    icon: TrendingUp,
    color: 'text-green-500'
  }
]

export default function UserNotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (notification) => {
    const Icon = notification.icon
    return <Icon className={`w-4 h-4 ${notification.color}`} />
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative rounded-full w-10 h-10 p-0 border-none shadow-none">
          <Bell className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col bg-white">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 mt-6">
          {notifications.length === 0 ? (
            <div className="text-center py-20">
              <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No notifications</p>
              <p className="text-sm text-gray-400 mt-2">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border border-black33 transition-colors ${
                    notification.read
                      ? 'bg-white'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
