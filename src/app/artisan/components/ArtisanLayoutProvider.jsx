'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import ArtisanSidebar from './ArtisanSidebar'
import ArtisanHeader from './ArtisanHeader'
import { Toaster } from 'sonner'
import { ArtisanProvider } from '../context/ArtisanContext'

const ArtisanLayoutProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment)
    
    if (pathSegments.length === 1 && pathSegments[0] === 'artisan') {
      return ['Home']
    }
    
    const breadcrumbs = []
    
    if (pathSegments.includes('services')) {
      breadcrumbs.push('Services')
      if (pathSegments.includes('add')) {
        breadcrumbs.push('Add Service')
      } else if (pathSegments.includes('edit')) {
        breadcrumbs.push('Edit Service')
      } else if (pathSegments.length > 2 && pathSegments[1] === 'services' && pathSegments[2] !== 'add') {
        breadcrumbs.push('Service Details')
      }
    } else if (pathSegments.includes('bookings')) {
      breadcrumbs.push('Bookings')
    } else if (pathSegments.includes('payments')) {
      breadcrumbs.push('Payments & Transactions')
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
    <ArtisanProvider>
      <div className="h-screen bg-white overflow-hidden w-full flex">
        <ArtisanSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <ArtisanHeader onMenuClick={() => setSidebarOpen(true)} breadcrumbs={breadcrumbs} />
          
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
    </ArtisanProvider>
  )
}

export default ArtisanLayoutProvider

