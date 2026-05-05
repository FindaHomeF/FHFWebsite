'use client'
import React, { useState, useMemo, useCallback } from 'react'
import { Search, Filter, Download, Plus, MoreVertical, Eye, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AdminTableWithBulk from '../components/AdminTableWithBulk'
import { useRouter } from 'next/navigation'

// Mock data for services
const mockServices = [
  {
    id: "1",
    serviceName: "Tech Repair Services",
    providerName: "John Smith",
    category: "Electronics Repair",
    location: "North Gate, Akure",
    phone: "08012345678",
    email: "john@techrepair.com",
    status: "Active"
  },
  {
    id: "2",
    serviceName: "Cleaning Services",
    providerName: "Mary Johnson",
    category: "Cleaning",
    location: "South Gate, Akure",
    phone: "08023456789",
    email: "mary@clean.com",
    status: "Pending"
  },
  {
    id: "3",
    serviceName: "Laundry Services",
    providerName: "Mike Williams",
    category: "Laundry",
    location: "East Gate, Akure",
    phone: "08034567890",
    email: "mike@laundry.com",
    status: "Active"
  },
  {
    id: "4",
    serviceName: "Food Delivery",
    providerName: "Sarah Davis",
    category: "Food Service",
    location: "West Gate, Akure",
    phone: "08045678901",
    email: "sarah@food.com",
    status: "Inactive"
  },
  {
    id: "5",
    serviceName: "Tutoring Services",
    providerName: "David Wilson",
    category: "Education",
    location: "Central, Akure",
    phone: "08056789012",
    email: "david@tutor.com",
    status: "Pending"
  },
  {
    id: "6",
    serviceName: "Photography Services",
    providerName: "Lisa Anderson",
    category: "Photography",
    location: "North Gate, Akure",
    phone: "08067890123",
    email: "lisa@photo.com",
    status: "Active"
  },
  {
    id: "7",
    serviceName: "Hair Salon",
    providerName: "Robert Taylor",
    category: "Beauty",
    location: "South Gate, Akure",
    phone: "08078901234",
    email: "robert@hair.com",
    status: "Active"
  },
  {
    id: "8",
    serviceName: "Printing Services",
    providerName: "Jennifer Brown",
    category: "Printing",
    location: "East Gate, Akure",
    phone: "08089012345",
    email: "jen@print.com",
    status: "Pending"
  },
  {
    id: "9",
    serviceName: "Tailoring Services",
    providerName: "James Martinez",
    category: "Tailoring",
    location: "West Gate, Akure",
    phone: "08090123456",
    email: "james@tailor.com",
    status: "Inactive"
  },
  {
    id: "10",
    serviceName: "Plumbing Services",
    providerName: "Patricia Garcia",
    category: "Plumbing",
    location: "Central, Akure",
    phone: "08001234567",
    email: "pat@plumber.com",
    status: "Active"
  }
]

const ServicesPage = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [services, setServices] = useState(mockServices)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Load services from localStorage after mount to avoid hydration errors
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedServices = JSON.parse(localStorage.getItem('services') || '[]')
      if (storedServices.length > 0) {
        setServices(storedServices)
      }
    }
  }, [])

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = 
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      
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

  // Generate page numbers
  const generatePageNumbers = () => {
    const pages = []
    const maxPages = 5
    
    if (totalPages <= maxPages) {
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
  }

  const pageNumbers = generatePageNumbers()

  const handlePageChange = (page) => {
    if (page !== '...' && page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const paginationData = {
    currentServices,
    startIndex,
    endIndex,
    totalItems: filteredServices.length,
    totalPages
  }

  // Status badge styles
  const statusBadgeStyles = useMemo(() => ({
    Active: 'bg-green-600 text-white',
    Pending: 'bg-yellow-600 text-white',
    Inactive: 'bg-red-600 text-white'
  }), [])

  const getStatusBadge = useCallback((status) => {
    return (
      <Badge className={statusBadgeStyles[status] || 'bg-gray-600 text-white'}>
        {status}
      </Badge>
    )
  }, [statusBadgeStyles])

  const handleRowClick = useCallback((service) => {
    router.push(`/admin/services/${encodeURIComponent(service.id)}`)
  }, [router])

  const getRowActions = useCallback(
    (service) => {
      const actions = [
        {
          id: 'view',
          label: 'View service',
          icon: <Eye className="h-4 w-4" />,
          onClick: () => router.push(`/admin/services/${encodeURIComponent(service.id)}`),
        },
      ]
      if (service.status === 'Pending') {
        actions.push({
          id: 'approval',
          label: 'Review approval',
          icon: <ClipboardList className="h-4 w-4" />,
          onClick: () => router.push(`/admin/services/approval/${encodeURIComponent(service.id)}`),
        })
      }
      return actions
    },
    [router]
  )

  const handleBulkAction = useCallback((action, selectedIds) => {
    console.log('Bulk action:', action, selectedIds)
    // Add your bulk action logic here
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setCurrentPage(1)
  }, [])

  // Define columns for the table
  const columns = useMemo(() => [
    { key: 'id', label: 'ID', width: 'w-20', truncate: true },
    { key: 'serviceName', label: 'Service Name', width: 'w-32', truncate: true, fontMedium: true },
    { key: 'providerName', label: 'Provider Name', width: 'w-32', truncate: true },
    { key: 'category', label: 'Category', width: 'w-28', truncate: true },
    { key: 'location', label: 'Location', width: 'w-32', truncate: true },
    { key: 'phone', label: 'Phone', width: 'w-28', truncate: true },
    { key: 'status', label: 'Status', width: 'w-24' }
  ], [])

  return (
    <div className="space-y-6 px-6 pb-12">
      {/* Header with Search and Filters */}
      <div className="bg-white py-6">
        <div className='flex-itc-jub'>
          {/* Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">Service Providers</h1>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-1.5 !text-sm">
            <div className="hidden md:flex items-center gap-1.5 !text-sm">
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

            <Select value={categoryFilter} onValueChange={(value) => {
              setCategoryFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-40 bg-black10 border-none shadow-none rounded-lg">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics Repair">Electronics Repair</SelectItem>
                <SelectItem value="Cleaning">Cleaning</SelectItem>
                <SelectItem value="Laundry">Laundry</SelectItem>
                <SelectItem value="Food Service">Food Service</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Photography">Photography</SelectItem>
                <SelectItem value="Beauty">Beauty</SelectItem>
                <SelectItem value="Printing">Printing</SelectItem>
                <SelectItem value="Tailoring">Tailoring</SelectItem>
                <SelectItem value="Plumbing">Plumbing</SelectItem>
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
                <DropdownMenuItem onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </DropdownMenuItem>
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
                    <SheetTitle>Filter Services</SheetTitle>
                    <SheetDescription>Use filters to refine service provider listings.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
                      <Input
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="pl-10 border-black10 border w-full"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={(value) => {
                      setStatusFilter(value)
                      setCurrentPage(1)
                    }}>
                      <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={(value) => {
                      setCategoryFilter(value)
                      setCurrentPage(1)
                    }}>
                      <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Electronics Repair">Electronics Repair</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="Laundry">Laundry</SelectItem>
                        <SelectItem value="Food Service">Food Service</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Printing">Printing</SelectItem>
                        <SelectItem value="Tailoring">Tailoring</SelectItem>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
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
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <AdminTableWithBulk
          columns={columns}
          data={filteredServices}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          paginationData={paginationData}
          pageNumbers={pageNumbers}
          statusBadgeStyles={statusBadgeStyles}
          getStatusBadge={getStatusBadge}
          onRowClick={handleRowClick}
          getRowActions={getRowActions}
          bulkActions={['approve', 'reject', 'delete', 'export']}
          onBulkAction={handleBulkAction}
          emptyMessage="No service providers match your current filters."
        />
      </div>
    </div>
  )
}

export default ServicesPage

