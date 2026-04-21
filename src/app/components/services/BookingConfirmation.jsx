'use client'
import { CheckCircle2, Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const BookingConfirmation = ({ booking, onClose }) => {
  const bookingData = booking || {
    id: 'BK-2024-001234',
    serviceName: 'Professional Cleaning',
    providerName: 'Elite Cleaners',
    date: '2024-12-15',
    time: '10:00 AM',
    duration: '2 hours',
    address: '123 Campus Road, North Gate, Akure',
    customerName: 'John Doe',
    customerPhone: '08012345678',
    customerEmail: 'john@example.com',
    status: 'confirmed',
    totalAmount: '₦5,000'
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your service booking has been confirmed</p>
      </div>

      {/* Booking Details */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Booking Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">{bookingData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{bookingData.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Provider:</span>
              <span className="font-medium">{bookingData.providerName}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Date & Time</span>
            </div>
            <p className="font-medium">{new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-sm text-gray-600">{bookingData.time} ({bookingData.duration})</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Service Location</span>
            </div>
            <p className="font-medium text-sm">{bookingData.address}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-gray-500" />
            <h3 className="font-semibold text-sm">Your Contact Information</h3>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-gray-400" />
              <span>{bookingData.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gray-400" />
              <span>{bookingData.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-gray-400" />
              <span>{bookingData.customerEmail}</span>
            </div>
          </div>
        </div>

        {bookingData.totalAmount && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-xl font-bold text-primary">{bookingData.totalAmount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>A confirmation email has been sent to your email address</li>
          <li>The service provider will contact you 24 hours before the scheduled time</li>
          <li>You can manage this booking from your bookings page</li>
          <li>Payment instructions will be provided by the service provider</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onClose} variant="outline" className="flex-1">
          Close
        </Button>
        <Button className="flex-1 bg-primary hover:bg-primary/90">
          <Link href="/student/bookings" className="w-full text-center">
            View My Bookings
          </Link>
        </Button>
        <Button variant="outline" className="flex-1">
          <Link href={`/service/${bookingData.serviceId || '1'}`} className="w-full text-center">
            Service Details
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default BookingConfirmation

