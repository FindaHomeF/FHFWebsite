'use client'
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, Package, Archive, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'sonner'
import { useDeleteDeclutteringListing, useRestoreDeclutteringListing, useSoftDeleteDeclutteringListing } from '@/lib/mutations'
import { useMyItems } from '@/contexts/DataContext'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const toNumericListingId = (id) => {
  if (id === null || id === undefined) return null
  const normalized = String(id).trim().replace(/^#D/i, '')
  if (!/^\d+$/.test(normalized)) return null
  const parsed = Number(normalized)
  return Number.isInteger(parsed) ? parsed : null
}

export default function StudentDeclutteringPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('active')
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pendingItemId, setPendingItemId] = useState(null)
  const { data: queriedItems = [], isLoading: isItemsLoading } = useMyItems()
  const { mutateAsync: softDeleteDeclutteringListing, isPending: isArchiving } = useSoftDeleteDeclutteringListing()
  const { mutateAsync: restoreDeclutteringListing, isPending: isRestoring } = useRestoreDeclutteringListing()
  const { mutateAsync: deleteDeclutteringListing, isPending: isDeleting } = useDeleteDeclutteringListing()

  const currentUser = useMemo(() => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null')
    } catch {
      return null
    }
  }, [])

  const ownedItems = useMemo(() => {
    const userId = String(currentUser?.id ?? currentUser?.user_id ?? currentUser?.pk ?? '')
    const userEmail = String(currentUser?.email || '').toLowerCase()

    return queriedItems.filter((item) => {
      const ownerId = String(item.ownerId ?? item.owner ?? item.owner_id ?? item.userId ?? item.user_id ?? '')
      const ownerEmail = String(item.ownerEmail ?? item.owner_email ?? '').toLowerCase()
      const legacyStudentOwner = String(item.studentId || '')

      if (userId && ownerId) return ownerId === userId
      if (userEmail && ownerEmail) return ownerEmail === userEmail
      if (legacyStudentOwner) return legacyStudentOwner === 'student-1' || legacyStudentOwner === userId

      // Fallback behavior for demo/mock items that do not yet carry owner metadata.
      return !ownerId && !ownerEmail && !legacyStudentOwner
    })
  }, [queriedItems, currentUser])

  const scopedItems = useMemo(() => {
    return ownedItems.filter((item) => {
      const isDeleted = Boolean(item.isDeleted ?? item.is_deleted)
      return viewMode === 'archived' ? isDeleted : !isDeleted
    })
  }, [ownedItems, viewMode])

  const filteredItems = useMemo(() => {
    return scopedItems.filter((item) => {
      const title = String(item.title || '').toLowerCase()
      const location = String(item.location || '').toLowerCase()
      const matchesSearch = title.includes(searchTerm.toLowerCase()) || location.includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [scopedItems, searchTerm, statusFilter])

  const requestArchive = (itemId) => {
    setPendingItemId(itemId)
    setIsArchiveDialogOpen(true)
  }

  const requestRestore = (itemId) => {
    setPendingItemId(itemId)
    setIsRestoreDialogOpen(true)
  }

  const requestPermanentDelete = (itemId) => {
    setPendingItemId(itemId)
    setIsDeleteDialogOpen(true)
  }

  const resetDialogs = () => {
    setIsArchiveDialogOpen(false)
    setIsRestoreDialogOpen(false)
    setIsDeleteDialogOpen(false)
    setPendingItemId(null)
  }

  const handleConfirmArchive = async () => {
    try {
      const numericId = toNumericListingId(pendingItemId)
      if (numericId === null) {
        toast.error('Invalid listing id. Unable to archive item.')
        return
      }

      await softDeleteDeclutteringListing({ id: numericId })
      resetDialogs()
    } catch {
      // Handled by mutation onError toast.
    }
  }

  const handleConfirmRestore = async () => {
    try {
      const numericId = toNumericListingId(pendingItemId)
      if (numericId === null) {
        toast.error('Invalid listing id. Unable to restore item.')
        return
      }

      await restoreDeclutteringListing({ id: numericId })
      resetDialogs()
    } catch {
      // Handled by mutation onError toast.
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const numericId = toNumericListingId(pendingItemId)
      if (numericId === null) {
        toast.error('Invalid listing id. Unable to delete item.')
        return
      }

      await deleteDeclutteringListing({ id: numericId })
      resetDialogs()
    } catch {
      // Handled by mutation onError toast.
    }
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
            <h1 className="text-xl font-bold text-gray-900">My Decluttering Items</h1>
          </div>
          <div className="flex items-center gap-1.5 !text-sm">
            <div className="mr-2 flex items-center rounded-md border border-black10 bg-white p-1">
              <Button
                variant={viewMode === 'active' ? 'default' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => {
                  setViewMode('active')
                  setStatusFilter('all')
                }}
              >
                Active
              </Button>
              <Button
                variant={viewMode === 'archived' ? 'default' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => {
                  setViewMode('archived')
                  setStatusFilter('all')
                }}
              >
                Archived
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
              <Input
                placeholder="Search items..."
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
            <Link href="/student/decluttering/add">
              <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Archived items can be restored within 90 days from deletion.
      </p>

      {isItemsLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading your items...</h3>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {viewMode === 'archived' ? 'No archived items' : 'No items yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {viewMode === 'archived'
              ? 'Archived listings will appear here.'
              : 'Create your first item listing to get started'}
          </p>
          <Link href="/student/decluttering/add">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
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
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(viewMode === 'archived' ? 'Archived' : item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/decluttering/${item.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          {viewMode !== 'archived' ? (
                            <>
                              <DropdownMenuItem onClick={() => router.push(`/student/decluttering/edit/${item.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => requestArchive(item.id)}
                                className="text-amber-700"
                                disabled={isArchiving}
                              >
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem
                                onClick={() => requestRestore(item.id)}
                                disabled={isRestoring}
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => requestPermanentDelete(item.id)}
                                className="text-red-600"
                                disabled={isDeleting}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Permanently
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmActionDialog
        open={isArchiveDialogOpen}
        onOpenChange={setIsArchiveDialogOpen}
        title='Archive item?'
        description='This moves the listing to Archived. You can restore it within 90 days.'
        confirmText='Archive item'
        onConfirm={handleConfirmArchive}
        isConfirming={isArchiving}
      />

      <ConfirmActionDialog
        open={isRestoreDialogOpen}
        onOpenChange={setIsRestoreDialogOpen}
        title='Restore item?'
        description='This moves the listing back to your active items.'
        confirmText='Restore item'
        onConfirm={handleConfirmRestore}
        isConfirming={isRestoring}
      />

      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete item permanently?'
        description='This permanently removes the item listing and cannot be undone.'
        confirmText='Delete item'
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
      />
    </div>
  )
}

