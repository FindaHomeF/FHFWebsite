'use client'
import React, { useState, useMemo, useCallback } from 'react'
import { Search, Filter, Download, Plus, MoreHorizontal, TrendingUp, DollarSign, CreditCard, Clock, XCircle, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AdminTableWithBulk from '../components/AdminTableWithBulk'
import StatsCard from '../components/StatsCard'

// Mock data for transactions
const mockTransactions = [
  {
    id: "#1234",
    name: "John Doe",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Card",
    date: "12/12/2025",
    status: "Completed"
  },
  {
    id: "#1235",
    name: "Jane Smith",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Transfer",
    date: "12/12/2025",
    status: "Pending"
  },
  {
    id: "#1236",
    name: "Mike Johnson",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Wallet",
    date: "12/12/2025",
    status: "Failed"
  },
  {
    id: "#1237",
    name: "Sarah Wilson",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Card",
    date: "12/12/2025",
    status: "Completed"
  },
  {
    id: "#1238",
    name: "David Brown",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Transfer",
    date: "12/12/2025",
    status: "Pending"
  },
  {
    id: "#1239",
    name: "Lisa Anderson",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Wallet",
    date: "12/12/2025",
    status: "Completed"
  },
  {
    id: "#1240",
    name: "Robert Taylor",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Card",
    date: "12/12/2025",
    status: "Pending"
  },
  {
    id: "#1241",
    name: "Emily Davis",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Transfer",
    date: "12/12/2025",
    status: "Failed"
  },
  {
    id: "#1242",
    name: "James Martinez",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Card",
    date: "12/12/2025",
    status: "Completed"
  },
  {
    id: "#1243",
    name: "Jennifer Brown",
    paymentType: "Service Payment",
    amount: "₦200,000",
    paymentMethod: "Wallet",
    date: "12/12/2025",
    status: "Completed"
  }
]

const TransactionsPage = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Mock statistics
  const stats = useMemo(() => ({
    totalRevenue: '₦3,900,000.96',
    totalTransactions: 128,
    pendingTransactions: '5 (₦200,000.86)',
    failedTransactions: '2 (₦30,000.52)'
  }), [])

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
      const matchesType = typeFilter === 'all' || transaction.paymentType === typeFilter
      const matchesMethod = methodFilter === 'all' || transaction.paymentMethod === methodFilter
      
      return matchesSearch && matchesStatus && matchesType && matchesMethod
    })
  }, [mockTransactions, searchTerm, statusFilter, typeFilter, methodFilter])

  // Pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

    return {
      currentTransactions,
      totalPages,
      currentPage,
      totalItems: filteredTransactions.length,
      startIndex,
      endIndex
    }
  }, [filteredTransactions, currentPage, itemsPerPage])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const handlePrevious = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentPage(prev => Math.min(paginationData.totalPages, prev + 1))
  }, [paginationData.totalPages])

  const pageNumbers = useMemo(() => {
    const pages = []
    const totalPages = paginationData.totalPages
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    
    return pages
  }, [currentPage, paginationData.totalPages])

  const columns = [
    { key: 'id', label: 'ID', width: 'w-20' },
    { key: 'name', label: 'Name', width: 'w-32', truncate: true },
    { key: 'paymentType', label: 'Payment Type', width: 'w-40', truncate: true },
    { key: 'amount', label: 'Amount', width: 'w-32', fontMedium: true },
    { key: 'paymentMethod', label: 'Payment Method', width: 'w-36' },
    { key: 'date', label: 'Date', width: 'w-32' },
    { key: 'status', label: 'Status', width: 'w-32' }
  ]

  const getStatusBadge = useCallback((status) => {
    const variants = {
      Completed: 'bg-green-600 text-white',
      Pending: 'bg-yellow-600 text-white',
      Failed: 'bg-red-600 text-white',
    }
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }, [])

  const handleRowClick = useCallback((transaction) => {
    router.push(`/admin/transactions/${encodeURIComponent(transaction.id)}`)
  }, [router])

  const getRowActions = useCallback(
    (transaction) => [
      {
        id: 'view',
        label: 'View transaction',
        icon: <Eye className="h-4 w-4" />,
        onClick: () => router.push(`/admin/transactions/${encodeURIComponent(transaction.id)}`),
      },
    ],
    [router]
  )

  const handleBulkAction = useCallback((action, selectedIds) => {
    console.log('Bulk action:', action, selectedIds)
    // Add your bulk action logic here
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setStatusFilter('all')
    setTypeFilter('all')
    setMethodFilter('all')
    setDateFilter('all')
    setCurrentPage(1)
  }, [])

  return (
    <div className="space-y-6 px-6 pb-12 pt-6">
            {/* Stats Cards */}
            <div className="inline-grid min-w-full md:min-w-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-auto max-w-full">
                <StatsCard
                title="Total Revenue"
                value={stats.totalRevenue}
                change={11.01}
                icon={DollarSign} 
                color="blue"
                />
                <StatsCard
                title="Total Transactions"
                value={stats.totalTransactions}
                change={-0.03}
                icon={TrendingUp}
                color="orange"
                />
                <StatsCard
                title="Pending Transactions"
                value={stats.pendingTransactions}
                change={15.03}
                icon={Clock}
                color="blue"
                />
                <StatsCard
                title="Failed Transactions"
                value={stats.failedTransactions}
                change={6.08}
                icon={XCircle}
                color="orange"
                />
            </div>

            {/* Page Header */}
            <div className="bg-white pt-10 md:pt-0">
                <div className='flex-itc-jub'>
                  <div className="flex-shrink-0">
                      <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
                  </div>

                  {/* Search and Filters */}
                  <div className="hidden md:flex items-center gap-1.5 !text-sm">
                      <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
                      <Input
                          placeholder="Search transactions..."
                          value={searchTerm}
                          onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setCurrentPage(1)
                          }}
                          className="pl-10 border-black10 border w-48"
                      />
                      </div>

                      <Select value={dateFilter} onValueChange={(value) => {
                      setDateFilter(value)
                      setCurrentPage(1)
                      }}>
                      <SelectTrigger className="w-32 bg-black10 border-none shadow-none rounded-lg">
                          <SelectValue placeholder="Date" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Date</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                      </Select>

                      <Select value={typeFilter} onValueChange={(value) => {
                      setTypeFilter(value)
                      setCurrentPage(1)
                      }}>
                      <SelectTrigger className="w-32 bg-black10 border-none shadow-none rounded-lg">
                          <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Type</SelectItem>
                          <SelectItem value="Service Payment">Service Payment</SelectItem>
                          <SelectItem value="Subscription">Subscription</SelectItem>
                      </SelectContent>
                      </Select>

                      <Select value={methodFilter} onValueChange={(value) => {
                      setMethodFilter(value)
                      setCurrentPage(1)
                      }}>
                      <SelectTrigger className="w-32 bg-black10 border-none shadow-none rounded-lg">
                          <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Method</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Transfer">Transfer</SelectItem>
                          <SelectItem value="Wallet">Wallet</SelectItem>
                      </SelectContent>
                      </Select>

                      <Select value={statusFilter} onValueChange={(value) => {
                      setStatusFilter(value)
                      setCurrentPage(1)
                      }}>
                      <SelectTrigger className="w-32 bg-black10 border-none shadow-none rounded-lg">
                          <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
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
                          <SheetTitle>Filter Transactions</SheetTitle>
                          <SheetDescription>
                            Use filters to narrow transaction results quickly.
                          </SheetDescription>
                        </SheetHeader>

                        <div className="mt-6 space-y-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
                            <Input
                              placeholder="Search transactions..."
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                              }}
                              className="pl-10 border-black10 border w-full"
                            />
                          </div>

                          <Select value={dateFilter} onValueChange={(value) => {
                            setDateFilter(value)
                            setCurrentPage(1)
                          }}>
                            <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                              <SelectValue placeholder="Date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Date</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="week">This Week</SelectItem>
                              <SelectItem value="month">This Month</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select value={typeFilter} onValueChange={(value) => {
                            setTypeFilter(value)
                            setCurrentPage(1)
                          }}>
                            <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Type</SelectItem>
                              <SelectItem value="Service Payment">Service Payment</SelectItem>
                              <SelectItem value="Subscription">Subscription</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select value={methodFilter} onValueChange={(value) => {
                            setMethodFilter(value)
                            setCurrentPage(1)
                          }}>
                            <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                              <SelectValue placeholder="Method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Method</SelectItem>
                              <SelectItem value="Card">Card</SelectItem>
                              <SelectItem value="Transfer">Transfer</SelectItem>
                              <SelectItem value="Wallet">Wallet</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select value={statusFilter} onValueChange={(value) => {
                            setStatusFilter(value)
                            setCurrentPage(1)
                          }}>
                            <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="pt-3 flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                              onClick={clearFilters}
                            >
                              Clear
                            </Button>
                            <Button
                              type="button"
                              className="flex-1"
                              onClick={() => setIsMobileFiltersOpen(false)}
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm">
                <AdminTableWithBulk
                columns={columns}
                paginationData={{
                    currentTransactions: paginationData.currentTransactions,
                    startIndex: paginationData.startIndex,
                    endIndex: paginationData.endIndex,
                    totalItems: paginationData.totalItems,
                    totalPages: paginationData.totalPages
                }}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                pageNumbers={pageNumbers}
                getStatusBadge={getStatusBadge}
                onRowClick={handleRowClick}
                getRowActions={getRowActions}
                bulkActions={['approve', 'reject', 'export']}
                onBulkAction={handleBulkAction}
                />
            </div>
    </div>
    )
}

export default TransactionsPage
