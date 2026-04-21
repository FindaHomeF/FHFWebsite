'use client'
import React, { useState, useMemo, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, MoreHorizontal, Download, ChevronDown, Plus, Eye, Pencil, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AdminTableWithBulk from '../components/AdminTableWithBulk'

// Mock data for decluttered items
const mockItems = [
  {
    id: "#D001",
    title: "Wooden Study Desk",
    sellerName: "John Doe",
    category: "Furniture",
    price: "₦15,000",
    condition: "Good",
    status: "Active"
  },
  {
    id: "#D002",
    title: "iPhone 12",
    sellerName: "Jane Smith",
    category: "Electronics",
    price: "₦350,000",
    condition: "Excellent",
    status: "Active"
  },
  {
    id: "#D003",
    title: "Chemistry Textbooks Set",
    sellerName: "Mike Johnson",
    category: "Books",
    price: "₦8,000",
    condition: "Good",
    status: "Pending"
  },
  {
    id: "#D004",
    title: "Coffee Maker",
    sellerName: "Sarah Wilson",
    category: "Appliances",
    price: "₦12,000",
    condition: "Fair",
    status: "Inactive"
  },
  {
    id: "#D005",
    title: "Study Lamp",
    sellerName: "David Brown",
    category: "Room Decor",
    price: "₦3,500",
    condition: "Excellent",
    status: "Active"
  },
  {
    id: "#D006",
    title: "Mattress",
    sellerName: "Emily Davis",
    category: "Furniture",
    price: "₦25,000",
    condition: "Good",
    status: "Active"
  },
  {
    id: "#D007",
    title: "LG Refrigerator",
    sellerName: "Michael Chen",
    category: "Appliances",
    price: "₦85,000",
    condition: "Excellent",
    status: "Active"
  },
  {
    id: "#D008",
    title: "Physics Textbook Bundle",
    sellerName: "Lisa Anderson",
    category: "Books",
    price: "₦5,500",
    condition: "Good",
    status: "Pending"
  },
  {
    id: "#D009",
    title: "Samsung Monitor 24 inch",
    sellerName: "Robert Taylor",
    category: "Electronics",
    price: "₦45,000",
    condition: "Excellent",
    status: "Active"
  },
  {
    id: "#D010",
    title: "Wall Clock",
    sellerName: "Amanda White",
    category: "Room Decor",
    price: "₦2,500",
    condition: "Good",
    status: "Active"
  },
  {
    id: "#D011",
    title: "Office Chair",
    sellerName: "James Wilson",
    category: "Furniture",
    price: "₦18,000",
    condition: "Fair",
    status: "Inactive"
  },
  {
    id: "#D012",
    title: "Electric Kettle",
    sellerName: "Patricia Lee",
    category: "Appliances",
    price: "₦7,000",
    condition: "Good",
    status: "Active"
  },
  {
    id: "#D013",
    title: "Laptop Stand",
    sellerName: "Christopher Brown",
    category: "Electronics",
    price: "₦4,500",
    condition: "Excellent",
    status: "Active"
  },
  {
    id: "#D014",
    title: "Philosophy Books Collection",
    sellerName: "Nancy Garcia",
    category: "Books",
    price: "₦6,000",
    condition: "Good",
    status: "Pending"
  },
  {
    id: "#D015",
    title: "Throw Pillows Set",
    sellerName: "Daniel Martinez",
    category: "Room Decor",
    price: "₦3,800",
    condition: "Excellent",
    status: "Active"
  },
  {
    id: "#D016",
    title: "Bookshelf",
    sellerName: "Maria Rodriguez",
    category: "Furniture",
    price: "₦22,000",
    condition: "Good",
    status: "Active"
  },
  {
    id: "#D017",
    title: "Microwave Oven",
    sellerName: "Thomas Moore",
    category: "Appliances",
    price: "₦28,000",
    condition: "Excellent",
    status: "Active"
  },
  {
    id: "#D018",
    title: "Wireless Mouse & Keyboard",
    sellerName: "Jennifer Lopez",
    category: "Electronics",
    price: "₦5,500",
    condition: "Good",
    status: "Inactive"
  },
  {
    id: "#D019",
    title: "Mathematics Reference Books",
    sellerName: "William Harris",
    category: "Books",
    price: "₦9,000",
    condition: "Fair",
    status: "Pending"
  },
  {
    id: "#D020",
    title: "Curtains Set",
    sellerName: "Elizabeth Clark",
    category: "Room Decor",
    price: "₦8,500",
    condition: "Good",
    status: "Active"
  },
  {
    id: "#D021",
    title: "Dining Table",
    sellerName: "Richard Lewis",
    category: "Furniture",
    price: "₦35,000",
    condition: "Excellent",
    status: "Active"
  },
  {
    id: "#D022",
    title: "Blender",
    sellerName: "Susan Walker",
    category: "Appliances",
    price: "₦10,500",
    condition: "Good",
    status: "Inactive"
  },
  {
    id: "#D023",
    title: "Portable Speaker",
    sellerName: "Joseph Young",
    category: "Electronics",
    price: "₦15,000",
    condition: "Excellent",
    status: "Active"
  },
  {
    id: "#D024",
    title: "Literature Textbooks",
    sellerName: "Betty King",
    category: "Books",
    price: "₦7,500",
    condition: "Good",
    status: "Pending"
  },
];

export default function ItemsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState(mockItems)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Load items from localStorage after mount to avoid hydration errors
  React.useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const storedItems = JSON.parse(localStorage.getItem('items') || '[]')
      // Combine stored items with mock data, avoiding duplicates
      const allItems = [...mockItems]
      storedItems.forEach(storedItem => {
        // Only add if it doesn't already exist in mock data
        if (!allItems.some(item => item.id === storedItem.id)) {
          allItems.push(storedItem)
        }
      })
      setItems(allItems)
    }
  }, [])

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const normalizedSearchTerm = String(searchTerm || '').toLowerCase()
      const normalizedTitle = String(item?.title || '').toLowerCase()
      const normalizedSellerName = String(item?.sellerName || '').toLowerCase()
      const normalizedCategory = String(item?.category || '').toLowerCase()
      const normalizedStatus = String(item?.status || '')
      const normalizedCondition = String(item?.condition || '')

      const matchesSearch =
        normalizedTitle.includes(normalizedSearchTerm) ||
        normalizedSellerName.includes(normalizedSearchTerm) ||
        normalizedCategory.includes(normalizedSearchTerm)
      const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter
      const matchesCategory = categoryFilter === 'all' || String(item?.category || '') === categoryFilter
      const matchesCondition = conditionFilter === 'all' || normalizedCondition === conditionFilter
      
      return matchesSearch && matchesStatus && matchesCategory && matchesCondition
    })
  }, [items, searchTerm, statusFilter, categoryFilter, conditionFilter])

  // Pagination data
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = filteredItems.slice(startIndex, endIndex)
    
    return {
      totalPages,
      startIndex,
      endIndex,
      currentItems,
      totalItems: filteredItems.length
    }
  }, [filteredItems, currentPage, itemsPerPage])

  // Navigation handlers
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

  // Generate page numbers
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

  // Status badge styles
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
    { key: 'id', label: 'ID', width: 'w-20' },
    { key: 'title', label: 'Title', width: 'w-32', truncate: true },
    { key: 'sellerName', label: 'Seller', width: 'w-32', truncate: true },
    { key: 'category', label: 'Category', width: 'w-28', truncate: true },
    { key: 'price', label: 'Price', width: 'w-24' },
    { key: 'condition', label: 'Condition', width: 'w-24' },
    { key: 'inventory', label: 'Inventory', width: 'w-24' },
    { key: 'status', label: 'Status', width: 'w-24' }
  ], [])

  const handleRowClick = useCallback((item) => {
    router.push(`/admin/items/${encodeURIComponent(item.id)}`)
  }, [router])

  const getRowActions = useCallback(
    (item) => {
      const actions = [
        {
          id: 'view',
          label: 'View item',
          icon: <Eye className="h-4 w-4" />,
          onClick: () => router.push(`/admin/items/${encodeURIComponent(item.id)}`),
        },
        {
          id: 'edit',
          label: 'Edit item',
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => router.push(`/admin/items/edit/${encodeURIComponent(item.id)}`),
        },
      ]
      if (item.status === 'Pending') {
        actions.push({
          id: 'approval',
          label: 'Review approval',
          icon: <ClipboardList className="h-4 w-4" />,
          onClick: () => router.push(`/admin/items/approval/${encodeURIComponent(item.id)}`),
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
    setConditionFilter('all')
    setCurrentPage(1)
  }, [])

  return (
    <div className="space-y-6 px-6 pt-6">
      {/* Page Header */}
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Items Listings</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg">
        <div className="flex gap-2 justify-between md:justify-end items-center">
          <div className="hidden md:flex gap-2 justify-end items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 border-black10 border"
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
            <SelectTrigger  className="w-36 bg-black10 border-none shadow-none rounded-lg">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
              <SelectItem value="Appliances">Appliances</SelectItem>
              <SelectItem value="Room Decor">Room Decor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={conditionFilter} onValueChange={(value) => {
            setConditionFilter(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-32 bg-black10 border-none shadow-none rounded-lg">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 w-32 bg-black10 border-none shadow-none rounded-lg">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="flex-1 w-32 bg-black10 border-none shadow-none rounded-lg">
              <Filter className="w-4 h-4 mr-2" />
              More
            </Button>
          </div>
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
                  <SheetTitle>Filter Items</SheetTitle>
                  <SheetDescription>Refine item listings with search and filter options.</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
                    <Input
                      placeholder="Search items..."
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
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Appliances">Appliances</SelectItem>
                      <SelectItem value="Room Decor">Room Decor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={conditionFilter} onValueChange={(value) => {
                    setConditionFilter(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
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
          onClick={() => router.push('/admin/items/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <AdminTableWithBulk
          columns={columns}
          data={filteredItems}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          paginationData={{
            currentItems: paginationData.currentItems,
            startIndex: paginationData.startIndex,
            endIndex: paginationData.endIndex,
            totalItems: paginationData.totalItems,
            totalPages: paginationData.totalPages
          }}
          pageNumbers={pageNumbers}
          statusBadgeStyles={statusBadgeStyles}
          getStatusBadge={getStatusBadge}
          onRowClick={handleRowClick}
          getRowActions={getRowActions}
          bulkActions={['approve', 'reject', 'delete', 'export']}
          onBulkAction={handleBulkAction}
        />
      </div>
    </div>
  )
}
