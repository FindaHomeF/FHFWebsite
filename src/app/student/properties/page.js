'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Edit, Trash2, Eye, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { RowActionsMenu } from '@/components/ui/row-actions-menu'
import Link from 'next/link'
import { toast } from 'sonner'
import { Building2 } from 'lucide-react'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

export default function StudentPropertiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [properties, setProperties] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pendingDeletePropertyId, setPendingDeletePropertyId] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProperties = JSON.parse(localStorage.getItem('properties') || '[]')
      // Filter by student ID (in real app, this would be from auth)
      const studentProperties = storedProperties.filter(p => p.studentId === 'student-1' || !p.studentId)
      setProperties(studentProperties)
    }
  }, [])

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const requestDelete = (propertyId) => {
    setPendingDeletePropertyId(propertyId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    const updatedProperties = properties.filter(p => p.id !== pendingDeletePropertyId)
    setProperties(updatedProperties)
    localStorage.setItem('properties', JSON.stringify(updatedProperties))
    setIsDeleteDialogOpen(false)
    setPendingDeletePropertyId(null)
    toast.success('Property deleted successfully')
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
      <div className="bg-white py-6">
        <div className='flex-itc-jub'>
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">My Properties</h1>
          </div>
          <div className="flex items-center gap-1.5 !text-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-black10 border w-48"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <Link href="/student/properties/add">
              <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Property
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties yet</h3>
          <p className="text-gray-600 mb-6">Create your first property listing to get started</p>
          <Link href="/student/properties/add">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-black10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black10">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{property.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{property.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap" data-row-actions>
                      <RowActionsMenu
                        actions={[
                          {
                            id: 'analytics',
                            label: 'View analytics',
                            icon: <TrendingUp className="h-4 w-4" />,
                            onClick: () =>
                              router.push(`/student/analytics/property/${encodeURIComponent(property.id)}`),
                          },
                          {
                            id: 'view',
                            label: 'View',
                            icon: <Eye className="h-4 w-4" />,
                            onClick: () => router.push(`/sp/${property.id}`),
                          },
                          {
                            id: 'edit',
                            label: 'Edit',
                            icon: <Edit className="h-4 w-4" />,
                            onClick: () => router.push(`/student/properties/edit/${property.id}`),
                          },
                          {
                            id: 'delete',
                            label: 'Delete',
                            icon: <Trash2 className="h-4 w-4" />,
                            destructive: true,
                            onClick: () => requestDelete(property.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete property?'
        description='This action cannot be undone.'
        confirmText='Delete property'
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

