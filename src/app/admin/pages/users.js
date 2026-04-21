'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Search, Filter, Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AdminTableWithBulk from '../components/AdminTableWithBulk'
import { useRouter } from 'next/navigation'

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "08012345678",
    role: "student",
    status: "Active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    propertiesCount: 0,
    avatar: "/hero-image.jpeg"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "08023456789",
    role: "agent",
    status: "Active",
    joinDate: "2024-01-10",
    lastActive: "1 day ago",
    propertiesCount: 5,
    avatar: "/hero-image.jpeg"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "08034567890",
    role: "artisan",
    status: "Pending",
    joinDate: "2024-01-18",
    lastActive: "3 days ago",
    propertiesCount: 0,
    avatar: "/hero-image.jpeg"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "08045678901",
    role: "student",
    status: "Inactive",
    joinDate: "2024-01-05",
    lastActive: "1 week ago",
    propertiesCount: 0,
    avatar: "/hero-image.jpeg"
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    phone: "08056789012",
    role: "agent",
    status: "Active",
    joinDate: "2023-12-20",
    lastActive: "5 minutes ago",
    propertiesCount: 12,
    avatar: "/hero-image.jpeg"
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    phone: "08067890123",
    role: "artisan",
    status: "Active",
    joinDate: "2024-01-12",
    lastActive: "6 hours ago",
    propertiesCount: 0,
    avatar: "/hero-image.jpeg"
  }
]

// Mock data for sub-admins
const mockSubAdmins = [
  {
    id: "SA002",
    name: "Jane Manager",
    email: "jane@example.com",
    phone: "08098765432",
    role: "admin",
    status: "Active",
    joinDate: "2024-02-01",
    lastActive: "30 minutes ago",
    avatar: "/hero-image.jpeg",
    propertiesCount: 0,
    isSubAdmin: true
  }
]

const UsersPage = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Get users from localStorage or use mock data
  const [users, setUsers] = useState(mockUsers)
  const [subAdmins, setSubAdmins] = useState(mockSubAdmins)

  // Merge localStorage data with mock data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const storedSubAdmins = JSON.parse(localStorage.getItem('subAdmins') || '[]')
      
      if (storedUsers.length > 0) {
        setUsers([...mockUsers, ...storedUsers.filter(su => !mockUsers.find(mu => mu.id === su.id))])
      }
      
      if (storedSubAdmins.length > 0) {
        setSubAdmins([...mockSubAdmins, ...storedSubAdmins.filter(sa => !mockSubAdmins.find(msa => msa.id === sa.id))])
      }
    }
  }, [])

  // Combine users and sub-admins
  const allUsers = useMemo(() => [...users, ...subAdmins], [users, subAdmins])

  // Filter users
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm)
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [allUsers, searchTerm, statusFilter, roleFilter])

  // Pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      currentUsers,
      totalPages,
      currentPage,
      totalItems: filteredUsers.length,
      startIndex,
      endIndex
    }
  }, [filteredUsers, currentPage, itemsPerPage])

  const handleRowClick = useCallback((user) => {
    router.push(`/admin/users/${encodeURIComponent(user.id)}`)
  }, [router])

  const handleBulkAction = useCallback((action, selectedIds) => {
    console.log('Bulk action:', action, selectedIds)
    // Add your bulk action logic here
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setStatusFilter('all')
    setRoleFilter('all')
    setCurrentPage(1)
  }, [])

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
    {
      key: 'user',
      label: 'User',
      width: 'w-72',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src={user.avatar || '/hero-image.jpeg'}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-gray-900 truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      width: 'w-32',
      render: (user) => (
        <span className="text-sm text-gray-900">{user.phone}</span>
      )
    },
    {
      key: 'role',
      label: 'Role',
      width: 'w-32',
      render: (user) => (
        <Badge className={
          user.role === 'student' ? 'bg-blue-100 text-blue-800' :
          user.role === 'agent' ? 'bg-purple-100 text-purple-800' :
          user.role === 'artisan' ? 'bg-orange-100 text-orange-800' :
          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
          user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
          user.role === 'support' ? 'bg-green-100 text-green-800' :
          user.role === 'analyst' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('-', ' ')}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-32'
    },
    {
      key: 'properties',
      label: 'Properties',
      width: 'w-24',
      render: (user) => (
        <span className="text-sm text-gray-900">{user.propertiesCount}</span>
      )
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      width: 'w-32',
      render: (user) => (
        <span className="text-sm text-gray-500">{user.lastActive}</span>
      )
    }
  ]

  return (
    <div className="space-y-6 px-6 pb-12">
      {/* Page Header */}
      <div className="bg-white pt-6">
        <div className='flex-itc-jub !block md:!flex'>
          <div className="flex-shrink-0 pb-5 md:pb-0">
            <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-1.5 justify-between md:justify-start !text-sm">
            <div className="hidden md:flex items-center gap-1.5 !text-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
              <Input
                placeholder="Search users..."
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
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={(value) => {
              setRoleFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-32 bg-black10 border-none shadow-none rounded-lg">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="artisan">Artisan</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
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
                    <SheetTitle>Filter Users</SheetTitle>
                    <SheetDescription>Refine the users list using search and filter options.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black33" />
                      <Input
                        placeholder="Search users..."
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
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={roleFilter} onValueChange={(value) => {
                      setRoleFilter(value)
                      setCurrentPage(1)
                    }}>
                      <SelectTrigger className="w-full bg-black10 border-none shadow-none rounded-lg">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="artisan">Artisan</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="analyst">Analyst</SelectItem>
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
              onClick={() => router.push('/admin/subadmins/add')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sub-Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white">
        <AdminTableWithBulk
          columns={columns}
          paginationData={{
            currentUsers: paginationData.currentUsers,
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
          onRowClick={handleRowClick}
          getStatusBadge={(status) => {
            const variants = {
              Active: 'bg-green-600 text-white',
              Pending: 'bg-yellow-600 text-white',
              Suspended: 'bg-orange-600 text-white',
              Inactive: 'bg-red-600 text-white',
            }
            return (
              <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
                {status}
              </Badge>
            )
          }}
          bulkActions={['approve', 'suspend', 'delete', 'export']}
          onBulkAction={handleBulkAction}
        />
      </div>
    </div>
  )
}

export default UsersPage

