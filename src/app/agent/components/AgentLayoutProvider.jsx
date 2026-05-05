'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AgentSidebar from './AgentSidebar'
import AgentHeader from './AgentHeader'
import { Toaster } from 'sonner'
import { AgentProvider } from '../context/AgentContext'

const AgentLayoutProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment)
    
    if (pathSegments.length === 1 && pathSegments[0] === 'agent') {
      return ['Home']
    }
    
    const breadcrumbs = []
    
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
    } else if (pathSegments.includes('bookings')) {
      breadcrumbs.push('Bookings')
    } else if (pathSegments.includes('payments')) {
      breadcrumbs.push('Payments & Escrow')
    } else if (pathSegments.includes('public-profile')) {
      breadcrumbs.push('Public Profile View')
    } else if (pathSegments.includes('profile')) {
      breadcrumbs.push('Profile')
    } else {
      breadcrumbs.push('Home')
    }
    
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <AgentProvider>
      <div className="h-screen bg-white overflow-hidden w-full flex">
        <AgentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <AgentHeader onMenuClick={() => setSidebarOpen(true)} breadcrumbs={breadcrumbs} />
          
          <main className="flex-1 overflow-y-auto bg-white w-full pt-6">
            {children}
          </main>
        </div>
        
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
    </AgentProvider>
  )
}

export default AgentLayoutProvider

