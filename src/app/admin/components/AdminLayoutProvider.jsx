'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { Toaster } from 'sonner'
import { AdminProvider } from '../context/AdminContext'

const AdminLayoutProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Generate breadcrumbs based on current path
  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment)
    
    if (pathSegments.length === 1 && pathSegments[0] === 'admin') {
      return ['Dashboards', 'Home']
    }
    
    const breadcrumbs = ['Dashboards']
    
    if (pathSegments.includes('properties')) {
      breadcrumbs.push('Properties')
      if (pathSegments.includes('add')) {
        breadcrumbs.push('Add Property')
      } else if (pathSegments.includes('edit')) {
        breadcrumbs.push('Edit Property')
      } else if (pathSegments.length > 2 && pathSegments[1] === 'properties' && pathSegments[2] !== 'add') {
        breadcrumbs.push('Property Details')
      }
    } else if (pathSegments.includes('items')) {
      breadcrumbs.push('Decluttered Items')
      if (pathSegments.includes('add')) {
        breadcrumbs.push('Add Item')
      } else if (pathSegments.includes('edit')) {
        breadcrumbs.push('Edit Item')
      } else if (pathSegments.length > 2 && pathSegments[1] === 'items' && pathSegments[2] !== 'add') {
        breadcrumbs.push('Item Details')
      }
    } else if (pathSegments.includes('services')) {
      breadcrumbs.push('Services')
    } else if (pathSegments.includes('users')) {
      breadcrumbs.push('Users')
    } else if (pathSegments.includes('transactions')) {
      breadcrumbs.push('Transactions')
      if (pathSegments.length > 2 && pathSegments[1] === 'transactions' && pathSegments[2] !== 'add') {
        breadcrumbs.push('Transaction Details')
      }
    } else if (pathSegments.includes('reports')) {
      breadcrumbs.push('Reports')
    } else if (pathSegments.includes('settings')) {
      breadcrumbs.push('Settings')
    } else {
      breadcrumbs.push('Home')
    }
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <AdminProvider>
      <div className="h-screen bg-white overflow-hidden w-full flex">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Header */}
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} breadcrumbs={breadcrumbs} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-white w-full">
            {children}
          </main>
        </div>
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          duration={4000}
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
            },
          }}
        />
      </div>
    </AdminProvider>
  )
}

export default AdminLayoutProvider


