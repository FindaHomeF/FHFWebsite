'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AdminTable from '@/app/admin/components/AdminTable';

const SubAdminsPage = () => {
  const router = useRouter();

  // Mock data for sub-admins
  const mockSubAdmins = [
    {
      id: "SA001",
      name: "Admin Smith",
      email: "admin@example.com",
      phone: "08012345678",
      role: "super-admin",
      status: "Active",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      avatar: "/hero-image.jpeg",
      permissions: ["properties", "users", "services", "items"]
    },
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
      permissions: ["properties", "users"]
    },
    {
      id: "SA003",
      name: "John Moderator",
      email: "john@example.com",
      phone: "08076543210",
      role: "moderator",
      status: "Active",
      joinDate: "2024-02-15",
      lastActive: "1 day ago",
      avatar: "/hero-image.jpeg",
      permissions: ["properties", "items"]
    },
    {
      id: "SA004",
      name: "Sarah Support",
      email: "sarah@example.com",
      phone: "08065432109",
      role: "support",
      status: "Pending",
      joinDate: "2024-03-01",
      lastActive: "Never",
      avatar: "/hero-image.jpeg",
      permissions: ["users"]
    },
    {
      id: "SA005",
      name: "Mike Analyst",
      email: "mike@example.com",
      phone: "08054321098",
      role: "analyst",
      status: "Inactive",
      joinDate: "2024-03-10",
      lastActive: "5 days ago",
      avatar: "/hero-image.jpeg",
      permissions: ["analytics"]
    },
    {
      id: "SA006",
      name: "Lisa Admin",
      email: "lisa@example.com",
      phone: "08043210987",
      role: "admin",
      status: "Active",
      joinDate: "2024-03-15",
      lastActive: "3 hours ago",
      avatar: "/hero-image.jpeg",
      permissions: ["properties", "services"]
    }
  ];

  const [subAdmins, setSubAdmins] = useState(mockSubAdmins);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const itemsPerPage = 10;

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('subAdmins') || '[]');
      if (stored.length > 0) {
        setSubAdmins([...mockSubAdmins, ...stored]);
      }
    }
  }, []);

  // Filter sub-admins
  const filteredSubAdmins = useMemo(() => {
    return subAdmins.filter(subAdmin => {
      const matchesSearch = 
        subAdmin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subAdmin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subAdmin.phone.includes(searchTerm)
      
      const matchesStatus = statusFilter === 'all' || subAdmin.status === statusFilter
      const matchesRole = roleFilter === 'all' || subAdmin.role === roleFilter
      
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [subAdmins, searchTerm, statusFilter, roleFilter])

  // Pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredSubAdmins.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentSubAdmins = filteredSubAdmins.slice(startIndex, endIndex)

    return {
      currentSubAdmins,
      totalPages,
      currentPage,
      totalItems: filteredSubAdmins.length,
      startIndex,
      endIndex
    }
  }, [filteredSubAdmins, currentPage, itemsPerPage])

  const handleRowClick = useCallback((subAdmin) => {
    router.push(`/admin/subadmins/${encodeURIComponent(subAdmin.id)}`)
  }, [router])

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

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setStatusFilter('all')
    setRoleFilter('all')
    setCurrentPage(1)
  }, [])

  const columns = [
    {
      key: 'admin',
      label: 'Sub-Admin',
      width: 'w-80',
      render: (subAdmin) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <img
              src={subAdmin.avatar || '/hero-image.jpeg'}
              alt={subAdmin.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{subAdmin.name}</div>
            <div className="text-sm text-gray-500 truncate">{subAdmin.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      width: 'w-40',
      render: (subAdmin) => (
        <Badge className={
          subAdmin.role === 'super-admin' ? 'bg-red-100 text-red-800' :
          subAdmin.role === 'admin' ? 'bg-purple-100 text-purple-800' :
          subAdmin.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
          subAdmin.role === 'support' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }>
          {subAdmin.role.charAt(0).toUpperCase() + subAdmin.role.slice(1)}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: 'w-32',
      render: (subAdmin) => subAdmin.status
    },
    {
      key: 'permissions',
      label: 'Permissions',
      width: 'w-48',
      render: (subAdmin) => (
        <div className="flex flex-wrap gap-1">
          {subAdmin.permissions.slice(0, 2).map((perm) => (
            <span key={perm} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
              {perm}
            </span>
          ))}
          {subAdmin.permissions.length > 2 && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
              +{subAdmin.permissions.length - 2}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      width: 'w-40',
      render: (subAdmin) => (
        <span className="text-sm text-gray-500">{subAdmin.lastActive}</span>
      )
    }
  ]

  return (
    <div className="space-y-6 px-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sub-Admins</h1>
          <p className="text-sm text-gray-600 mt-1">Manage all sub-administrators</p>
        </div>
        <Button 
          className="bg-primary text-white hover:bg-primary/90"
          onClick={() => router.push('/admin/subadmins/add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sub-Admin
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={(value) => {
              setRoleFilter(value)
              setCurrentPage(1)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-shrink-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear
            </Button>

            <Button 
              className="bg-primary text-white hover:bg-primary/90 flex-shrink-0"
              onClick={() => document.getElementById('download')?.click()}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
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
                  <SheetTitle>Filter Sub-Admins</SheetTitle>
                  <SheetDescription>Use search and filters to narrow sub-admin records.</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={(value) => {
                    setStatusFilter(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={roleFilter} onValueChange={(value) => {
                    setRoleFilter(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="super-admin">Super Admin</SelectItem>
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
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        paginationData={paginationData}
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
            Inactive: 'bg-red-600 text-white',
          }
          return (
            <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
              {status}
            </Badge>
          )
        }}
        emptyMessage="No sub-admin records match your current filters."
      />
    </div>
  )
}

export default SubAdminsPage
