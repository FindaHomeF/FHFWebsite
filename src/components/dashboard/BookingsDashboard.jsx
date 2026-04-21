'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Phone, X, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

const mockBookings = {
  upcoming: [
    {
      id: 'BK-001',
      serviceName: 'Professional Cleaning',
      providerName: 'Elite Cleaners',
      providerPhone: '08012345678',
      date: '2024-12-20',
      time: '10:00 AM',
      duration: '2 hours',
      address: '123 Campus Road, North Gate',
      status: 'confirmed',
      amount: '₦5,000',
    },
    {
      id: 'BK-002',
      serviceName: 'Plumbing Service',
      providerName: 'Flow Plumbers',
      providerPhone: '08023456789',
      date: '2024-12-22',
      time: '02:00 PM',
      duration: '3 hours',
      address: '456 Student Hall, South Gate',
      status: 'pending',
      amount: '₦7,000',
    },
  ],
  past: [
    {
      id: 'BK-003',
      serviceName: 'Moving Service',
      providerName: 'Swift Movers',
      providerPhone: '08034567890',
      date: '2024-11-15',
      time: '09:00 AM',
      duration: '4 hours',
      address: '789 Hostel Block, West Gate',
      status: 'completed',
      amount: '₦15,000',
      rating: 5,
    },
  ],
}

const roleCopy = {
  student: {
    title: 'My Bookings',
    subtitle: 'Manage your service bookings',
  },
  agent: {
    title: 'Bookings',
    subtitle: 'Service appointments linked to your listings and referrals',
  },
  artisan: {
    title: 'Bookings',
    subtitle: 'Incoming and past jobs scheduled with you',
  },
}

export default function BookingsDashboard({ role = 'student' }) {
  const copy = roleCopy[role] || roleCopy.student
  const [bookings, setBookings] = useState(mockBookings)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const confirmCancel = () => {
    setBookings({
      ...bookings,
      upcoming: bookings.upcoming.filter((b) => b.id !== selectedBooking),
    })
    toast.success('Booking cancelled successfully')
    setCancelDialogOpen(false)
    setSelectedBooking(null)
  }

  const handleReschedule = (bookingId) => {
    toast.info('Reschedule feature coming soon')
  }

  const BookingCard = ({ booking, isUpcoming }) => (
    <div className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-lg font-bold">{booking.serviceName}</h3>
              <p className="text-gray-600">with {booking.providerName}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                booking.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {new Date(booking.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {booking.time} ({booking.duration})
              </span>
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{booking.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{booking.providerPhone}</span>
            </div>
            <div>
              <span className="font-semibold">Amount: </span>
              <span className="text-primary">{booking.amount}</span>
            </div>
          </div>
        </div>

        {isUpcoming && (
          <div className="flex flex-col gap-2 md:w-32">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => handleReschedule(booking.id)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reschedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                setSelectedBooking(booking.id)
                setCancelDialogOpen(true)
              }}
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 px-6 pb-12">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">{copy.title}</h1>
        <p className="text-gray-600">{copy.subtitle}</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="upcoming">Upcoming ({bookings.upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({bookings.past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {bookings.upcoming.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">No upcoming bookings</p>
            </div>
          ) : (
            bookings.upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} isUpcoming />)
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6 space-y-4">
          {bookings.past.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-gray-500">No past bookings</p>
            </div>
          ) : (
            bookings.past.map((booking) => <BookingCard key={booking.id} booking={booking} isUpcoming={false} />)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking?</DialogTitle>
          </DialogHeader>
          <p className="mb-4 text-gray-600">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button onClick={confirmCancel} className="bg-red-600 hover:bg-red-700">
              Cancel Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
