'use client'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Download, Plus, MoreHorizontal, TrendingUp, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import AdminTableWithBulk from '../../admin/components/AdminTableWithBulk'
import { toast } from 'sonner'

export default function AgentPropertiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [properties, setProperties] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const allProperties = JSON.parse(localStorage.getItem('properties') || '[]')
      // Filter by agent ID (in real app, this would be from auth)
      const agentProperties = allProperties.filter(p => p.agentId === 'agent-1' || !p.agentId)
      setProperties(agentProperties)
    }
  }, [])

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = (property.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (property.location || '').toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || property.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [properties, searchTerm, statusFilter, categoryFilter])

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentProperties = filteredProperties.slice(startIndex, endIndex)
    
    return {
      totalPages,
      startIndex,
      endIndex,
      currentProperties,
      totalItems: filteredProperties.length
    }
  }, [filteredProperties, currentPage, itemsPerPage])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }, [currentPage])

  const handleNext = useCallback(() => {
    if (currentPage < paginationData.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }, [currentPage, paginationData.totalPages])

  const statusBadgeStyles = useMemo(() => ({
    'Active': 'bg-[#4EC50E] text-white',
    'Pending': 'bg-[#C5B60E] text-white',
    'Inactive': 'bg-[#E01A1A] text-white'
  }), [])

  const getStatusBadge = useCallback((status) => {
    const className = statusBadgeStyles[status] || 'bg-gray-100 text-gray-800'
    return (
      <Badge className={className}>
        {status}
      </Badge>
    )
  }, [statusBadgeStyles])

  const columns = useMemo(() => [
    { key: 'id', label: 'ID', width: 'w-20', truncate: true },
    { key: 'title', label: 'Title', width: 'w-32', truncate: true, fontMedium: true },
    { key: 'category', label: 'Category', width: 'w-28', truncate: true },
    { key: 'location', label: 'Location', width: 'w-32', truncate: true },
    { key: 'price', label: 'Price', width: 'w-24', fontMedium: true },
    { key: 'inventory', label: 'Inventory', width: 'w-24' },
    { key: 'status', label: 'Status', width: 'w-24' }
  ], [])

  const handleRowClick = useCallback((property) => {
    router.push(`/agent/properties/${property.id}`)
  }, [router])

  const pageNumbers = useMemo(() => {
    const pages = []
    const { totalPages } = paginationData
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }, [paginationData.totalPages, currentPage])

  const getRowActions = useCallback(
    (item) => [
      {
        id: 'analytics',
        label: 'View analytics',
        icon: <TrendingUp className="h-4 w-4" />,
        onClick: () => router.push(`/agent/analytics/property/${encodeURIComponent(item.id)}`),
      },
      {
        id: 'details',
        label: 'View details',
        icon: <Eye className="h-4 w-4" />,
        onClick: () => router.push(`/agent/properties/${encodeURIComponent(item.id)}`),
      },
    ],
    [router]
  )

  const handleBulkAction = useCallback((action, selectedIds) => {
    try {
      const allProperties = JSON.parse(localStorage.getItem('properties') || '[]')
      
      switch (action) {
        case 'delete':
          const remaining = allProperties.filter(p => !selectedIds.includes(p.id))
          localStorage.setItem('properties', JSON.stringify(remaining))
          setProperties(remaining.filter(p => p.agentId === 'agent-1' || !p.agentId))
          toast.success(`${selectedIds.length} property(ies) deleted successfully`)
          break
          
        case 'activate':
          allProperties.forEach(p => {
            if (selectedIds.includes(p.id)) {
              p.status = 'Active'
            }
          })
          localStorage.setItem('properties', JSON.stringify(allProperties))
          setProperties(allProperties.filter(p => p.agentId === 'agent-1' || !p.agentId))
          toast.success(`${selectedIds.length} property(ies) activated`)
          break
          
        case 'deactivate':
          allProperties.forEach(p => {
            if (selectedIds.includes(p.id)) {
              p.status = 'Inactive'
            }
          })
          localStorage.setItem('properties', JSON.stringify(allProperties))
          setProperties(allProperties.filter(p => p.agentId === 'agent-1' || !p.agentId))
          toast.success(`${selectedIds.length} property(ies) deactivated`)
          break
          
        case 'export':
          const selectedProperties = allProperties.filter(p => selectedIds.includes(p.id))
          const csvContent = [
            ['ID', 'Title', 'Category', 'Location', 'Price', 'Status', 'Inventory'].join(','),
            ...selectedProperties.map(p => [
              p.id,
              p.title,
              p.category,
              p.location,
              p.price,
              p.status,
              p.inventory || 0
            ].join(','))
          ].join('\n')
          
          const blob = new Blob([csvContent], { type: 'text/csv' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `properties_${new Date().toISOString().split('T')[0]}.csv`
          a.click()
          window.URL.revokeObjectURL(url)
          toast.success(`${selectedIds.length} property(ies) exported`)
          break
          
        default:
          toast.error('Unknown action')
      }
    } catch (error) {
      console.error('Bulk action error:', error)
      toast.error('Failed to perform bulk action')
    }
  }, [])

  return (
    <div className="space-y-6 px-6 pb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
        <Button 
          className="bg-primary text-white rounded-lg px-6 py-6"
          onClick={() => router.push('/agent/properties/add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="bg-white rounded-lg">
        <div className="flex gap-2 justify-end items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 border-black10 border"
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

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36 bg-black10 border-none shadow-none rounded-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="single-room">Single Room</SelectItem>
              <SelectItem value="shared-apartment">Shared Apartment</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <AdminTableWithBulk
          columns={columns}
          data={paginationData.currentProperties}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          paginationData={{
            currentProperties: paginationData.currentProperties,
            startIndex: paginationData.startIndex,
            endIndex: paginationData.endIndex,
            totalItems: paginationData.totalItems,
            totalPages: paginationData.totalPages
          }}
          pageNumbers={pageNumbers}
          statusBadgeStyles={statusBadgeStyles}
          getStatusBadge={getStatusBadge}
          onRowClick={handleRowClick}
          bulkActions={['activate', 'deactivate', 'delete', 'export']}
          onBulkAction={handleBulkAction}
          getRowActions={getRowActions}
        />
      </div>
    </div>
  )
}

