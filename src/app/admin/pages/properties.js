'use client'
import React, { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Download, Plus, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AdminTableWithBulk from '../components/AdminTableWithBulk'

// Mock data to match the image
const mockProperties = [
  {
    id: "1234",
    title: "Marble Lodge",
    ownerName: "John Doe",
    category: "Flat",
    location: "Southgate, Akure",
    price: "₦200,000",
    condition: "Good",
    inventory: 5,
    status: "Active"
  },
  {
    id: "1234-2",
    title: "Marble Lodge",
    ownerName: "John Doe",
    category: "Single Room",
    location: "Southgate, Akure",
    price: "₦200,000",
    condition: "Good",
    inventory: 4,
    status: "Pending"
  },
  {
    id: "1234-3",
    title: "Marble Lodge",
    ownerName: "John Doe",
    category: "Shared Apart...",
    location: "Southgate, Akure",
    price: "₦200,000",
    condition: "Good",
    inventory: 8,
    status: "Inactive"
  },
  {
    id: "1234-4",
    title: "Marble Lodge",
    ownerName: "John Doe",
    category: "Flat",
    location: "Southgate, Akure",
    price: "₦200,000",
    condition: "Good",
    inventory: 3,
    status: "Active"
  },
  {
    id: "1234-5",
    title: "Marble Lodge",
    ownerName: "John Doe",
    category: "Single Room",
    location: "Southgate, Akure",
    price: "₦200,000",
    condition: "Good",
    inventory: 2,
    status: "Pending"
  },
  {
    id: "1235",
    title: "Sunset Villa",
    ownerName: "Jane Smith",
    category: "House",
    location: "North Gate, Akure",
    price: "₦250,000",
    condition: "Excellent",
    inventory: 2,
    status: "Active"
  },
  {
    id: "1236",
    title: "Student Haven",
    ownerName: "Mike Johnson",
    category: "Single Room",
    location: "East Gate, Akure",
    price: "₦150,000",
    condition: "Good",
    inventory: 6,
    status: "Inactive"
  },
  {
    id: "1237",
    title: "Modern Apartment",
    ownerName: "Sarah Wilson",
    category: "Flat",
    location: "West Gate, Akure",
    price: "₦300,000",
    condition: "Excellent",
    inventory: 1,
    status: "Pending"
  },
  {
    id: "1238",
    title: "Cozy Studio",
    ownerName: "David Brown",
    category: "Studio",
    location: "Central, Akure",
    price: "₦180,000",
    condition: "Good",
    inventory: 4,
    status: "Active"
  },
  {
    id: "1239",
    title: "Luxury Suite",
    ownerName: "Emily Davis",
    category: "Penthouse",
    location: "Southgate, Akure",
    price: "₦500,000",
    condition: "Excellent",
    inventory: 1,
    status: "Active"
  }
];

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Show 5 items per page
  const [allProperties, setAllProperties] = useState(mockProperties)

  // Load properties from localStorage after mount to avoid hydration errors
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProperties = JSON.parse(localStorage.getItem('properties') || '[]')
      // Combine stored properties with mock data, avoiding duplicates
      const combined = [...mockProperties]
      storedProperties.forEach(storedProp => {
        // Only add if it doesn't already exist in mock data
        if (!combined.some(prop => prop.id === storedProp.id)) {
          combined.push(storedProp)
        }
      })
      setAllProperties(combined)
    }
  }, [])

  // Memoized filter values to avoid repeated calculations
  const filterValues = useMemo(() => ({
    category: categoryFilter.toLowerCase(),
    status: statusFilter.toLowerCase(),
    isAllCategory: categoryFilter === 'all',
    isAllStatus: statusFilter === 'all',
    isAllDate: dateFilter === 'all'
  }), [categoryFilter, statusFilter, dateFilter])

  // Optimized filtering with useMemo and early returns
  const filteredProperties = useMemo(() => {
    if (filterValues.isAllCategory && filterValues.isAllStatus && filterValues.isAllDate) {
      return allProperties // Return all properties if no filters applied
    }

    return allProperties.filter(property => {
      // Early return for date filter (always true for now)
      if (!filterValues.isAllDate) return false
      
      // Optimized string comparisons with early returns
      if (!filterValues.isAllCategory && !property.category.toLowerCase().includes(filterValues.category)) {
        return false
      }
      
      if (!filterValues.isAllStatus && !property.status.toLowerCase().includes(filterValues.status)) {
        return false
      }
      
      return true
    })
  }, [filterValues])

  // Optimized pagination calculation
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

  // Optimized event handlers with useCallback
  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

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

  // Optimized filter change handler
  const handleFilterChange = useCallback((filterType, value) => {
    resetToFirstPage()
    switch (filterType) {
      case 'date':
        setDateFilter(value)
        break
      case 'category':
        setCategoryFilter(value)
        break
      case 'status':
        setStatusFilter(value)
        break
    }
  }, [resetToFirstPage])

  // Memoized page numbers generation
  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisiblePages = 5
    const { totalPages } = paginationData
    
    if (totalPages <= maxVisiblePages) {
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

  // Memoized status badge styles
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

  // Define columns for the table
  const columns = useMemo(() => [
    { key: 'id', label: 'ID', width: 'w-20', truncate: true },
    { key: 'title', label: 'Title', width: 'w-32', truncate: true, fontMedium: true },
    { key: 'ownerName', label: 'Owner Name', width: 'w-32', truncate: true },
    { key: 'category', label: 'Category', width: 'w-28', truncate: true },
    { key: 'location', label: 'Location', width: 'w-32', truncate: true },
    { key: 'price', label: 'Price', width: 'w-24', fontMedium: true },
    { key: 'inventory', label: 'Inventory', width: 'w-24' },
    { key: 'status', label: 'Status', width: 'w-24' }
  ], [])

  const router = useRouter()
  const handleRowClick = useCallback((property) => {
    router.push(`/admin/properties/${property.id}`)
  }, [router])

  const handleBulkAction = useCallback((action, selectedIds) => {
    console.log('Bulk action:', action, selectedIds)
    // Add your bulk action logic here
  }, [])

  const clearFilters = useCallback(() => {
    setDateFilter('all')
    setCategoryFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }, [])


  return (
    <div className="space-y-6 px-6">
      <div className="bg-white ">
          <div className=" py-6">
            {/* Filters Row */}
            <div className='flex-itc-jub !block md:!flex'>
              <div className="flex justify-between items-center pb-5 md:pb-0">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Property Listings</h1>
                </div>
              </div>

              <div className="flex flex-wrap md:flex-nowrap items-center gap-1.5 justify-between md:justify-start !text-sm">
                <div className="hidden md:flex items-center gap-1.5 !text-sm">
                <Select value={dateFilter} onValueChange={(value) => handleFilterChange('date', value)}>
                  <SelectTrigger className="w-32 bg-black10 border-none shadow-none rounded-lg">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Date</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger className="w-40 bg-black10 border-none shadow-none rounded-lg">
                    <SelectValue placeholder="All Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Category</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="single">Single Room</SelectItem>
                    <SelectItem value="shared">Shared Apartment</SelectItem>
                  </SelectContent>
                </Select>

                

                <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-32 bg-black10 border-none shadow-none rounded-lg">
                    <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-32 bg-black10 border-none shadow-none rounded-lg flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      More
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => document.getElementById('download')?.click()}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>

                <div className="md:hidden">
                  <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button type="button" variant="outline" className="rounded-lg flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[88%] sm:max-w-md overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filter Properties</SheetTitle>
                        <SheetDescription>Apply filters to narrow property listings.</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <Select value={dateFilter} onValueChange={(value) => handleFilterChange('date', value)}>
                          <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                            <SelectValue placeholder="Date" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Date</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={categoryFilter} onValueChange={(value) => handleFilterChange('category', value)}>
                          <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                            <SelectValue placeholder="All Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Category</SelectItem>
                            <SelectItem value="flat">Flat</SelectItem>
                            <SelectItem value="single">Single Room</SelectItem>
                            <SelectItem value="shared">Shared Apartment</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
                          <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="pt-3 flex gap-2">
                          <Button type="button" variant="outline" className="flex-1" onClick={clearFilters}>
                            Clear
                          </Button>
                          <Button type="button" className="flex-1" onClick={() => setIsMobileFiltersOpen(false)}>
                            Apply
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <Button 
                  className="bg-primary text-white rounded-lg px-6 py-6"
                  onClick={() => window.location.href = '/admin/properties/add'}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
          </Button>
          </div>
        </div>
      </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <AdminTableWithBulk
              columns={columns}
              data={filteredProperties}
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
              bulkActions={['approve', 'reject', 'delete', 'export']}
              onBulkAction={handleBulkAction}
            />
          </div>
      </div>
    </div>
  );
}