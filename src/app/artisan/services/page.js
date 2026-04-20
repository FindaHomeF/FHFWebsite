'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Download, Plus, MoreVertical, Edit, Trash2, Eye, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'sonner'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const mockServices = []

export default function ServicesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [services, setServices] = useState(mockServices)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pendingDeleteServiceId, setPendingDeleteServiceId] = useState(null)

  // Load services from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedServices = JSON.parse(localStorage.getItem('services') || '[]')
      // Filter by artisan ID (in real app, this would be from auth)
      const artisanServices = storedServices.filter(s => s.artisanId === 'artisan-1' || !s.artisanId)
      setServices(artisanServices)
    }
  }, [])

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = 
        service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [services, searchTerm, statusFilter, categoryFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentServices = filteredServices.slice(startIndex, endIndex)

  const requestDelete = (serviceId) => {
    setPendingDeleteServiceId(serviceId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    const updatedServices = services.filter(s => s.id !== pendingDeleteServiceId)
    setServices(updatedServices)
    localStorage.setItem('services', JSON.stringify(updatedServices))
    setIsDeleteDialogOpen(false)
    setPendingDeleteServiceId(null)
    toast.success('Service deleted successfully')
  }

  const statusBadgeStyles = {
    Active: 'bg-green-600 text-white',
    Pending: 'bg-yellow-600 text-white',
    Inactive: 'bg-red-600 text-white'
  }

  const getStatusBadge = (status) => {
    return (
      <Badge className={statusBadgeStyles[status] || 'bg-gray-600 text-white'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 px-6 pb-12">
      {/* Header */}
      <div className="bg-white py-6">
        <div className='flex-itc-jub'>
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">My Services</h1>
          </div>

          <div className="flex items-center gap-1.5 !text-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 border-black10 border w-48"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-32 bg-black10 border-none shadow-none rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Link href="/artisan/services/add">
              <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Services List */}
      {currentServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-600 mb-6">Create your first service listing to get started</p>
          <Link href="/artisan/services/add">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Service
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-black10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black10">
                {currentServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{service.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.minPrice && service.maxPrice 
                          ? `₦${parseInt(service.minPrice).toLocaleString()} - ₦${parseInt(service.maxPrice).toLocaleString()}`
                          : service.price 
                          ? `₦${parseInt(service.price).toLocaleString()}`
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(service.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/artisan/services/${encodeURIComponent(service.id)}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/artisan/services/edit/${service.id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => requestDelete(service.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-black10">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of {filteredServices.length} services
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete service?'
        description='This action cannot be undone.'
        confirmText='Delete service'
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

