'use client'
import React, { useState, useMemo } from 'react'
import { Wallet, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

// Mock payment data
const mockPayments = [
  {
    id: 'PAY001',
    propertyId: 'PROP001',
    propertyTitle: 'Marble Lodge',
    amount: 200000,
    status: 'pending',
    createdAt: '2024-01-15',
    expectedRelease: '2024-01-22'
  },
  {
    id: 'PAY002',
    itemId: 'ITEM001',
    itemTitle: 'Wooden Study Desk',
    amount: 15000,
    status: 'completed',
    createdAt: '2024-01-10',
    completedAt: '2024-01-12'
  },
  {
    id: 'PAY003',
    propertyId: 'PROP002',
    propertyTitle: 'Sunset Villa',
    amount: 250000,
    status: 'pending',
    createdAt: '2024-01-20',
    expectedRelease: '2024-01-27'
  },
  {
    id: 'PAY004',
    itemId: 'ITEM002',
    itemTitle: 'Laptop HP Core i5',
    amount: 45000,
    status: 'completed',
    createdAt: '2024-01-05',
    completedAt: '2024-01-08'
  },
]

export default function AgentPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredPayments = useMemo(() => {
    if (statusFilter === 'all') return mockPayments
    return mockPayments.filter(payment => payment.status === statusFilter)
  }, [statusFilter])

  const stats = useMemo(() => {
    const pending = filteredPayments.filter(p => p.status === 'pending')
    const completed = filteredPayments.filter(p => p.status === 'completed')
    const pendingTotal = pending.reduce((sum, p) => sum + p.amount, 0)
    const completedTotal = completed.reduce((sum, p) => sum + p.amount, 0)
    
    return {
      pendingCount: pending.length,
      pendingTotal,
      completedCount: completed.length,
      completedTotal
    }
  }, [filteredPayments])

  return (
    <div className="space-y-6 px-6 pb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Payments & Escrow</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-black10 border-none shadow-none rounded-lg">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-black10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Pending Payments</h3>
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900">{stats.pendingCount}</p>
            <p className="text-2xl font-semibold text-primary">₦{stats.pendingTotal.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Awaiting release from escrow</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-black10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Completed Payments</h3>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900">{stats.completedCount}</p>
            <p className="text-2xl font-semibold text-primary">₦{stats.completedTotal.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total received</p>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="">
          <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
          
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="border border-black10 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">
                          {payment.propertyTitle || payment.itemTitle}
                        </h4>
                        <Badge className={`${payment.status === 'pending' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'} hidden md:inline-flex`}>
                          {payment.status === 'pending' ? 'Pending' : 'Completed'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Transaction ID: {payment.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payment.propertyId ? 'Property Sale' : 'Item Sale'}
                      </p>
                      {payment.status === 'pending' && payment.expectedRelease && (
                        <p className="text-xs text-orange-600 mt-2">
                          Expected release: {new Date(payment.expectedRelease).toLocaleDateString()}
                        </p>
                      )}
                      {payment.status === 'completed' && payment.completedAt && (
                        <p className="text-xs text-green-600 mt-2">
                          Completed: {new Date(payment.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex flex-col justify-between items-end min-h-full">
                      <Badge className={`${payment.status === 'pending' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'} inline-flex md:hidden`}>
                        {payment.status === 'pending' ? 'Pending' : 'Completed'}
                      </Badge>

                      <div className='mt-7'>
                        <p className="text-2xl font-bold text-primary">
                          ₦{payment.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

