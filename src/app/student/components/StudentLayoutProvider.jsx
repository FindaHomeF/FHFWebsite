'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import StudentSidebar from './StudentSidebar'
import StudentHeader from './StudentHeader'
import { Toaster } from 'sonner'
import { StudentProvider } from '../context/StudentContext'

const StudentLayoutProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment)
    
    if (pathSegments.length === 1 && pathSegments[0] === 'student') {
      return ['Home']
    }
    
    const breadcrumbs = []
    
    if (pathSegments.includes('properties')) {
      breadcrumbs.push('Properties')
      if (pathSegments.includes('add')) {
        breadcrumbs.push('Add Property')
      }
    } else if (pathSegments.includes('decluttering')) {
      breadcrumbs.push('Decluttering')
      if (pathSegments.includes('add')) {
        breadcrumbs.push('Add Item')
      }
    } else if (pathSegments.includes('bookings')) {
      breadcrumbs.push('Bookings')
    } else if (pathSegments.includes('roommate-finder')) {
      breadcrumbs.push('Roommate Finder')
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
    <StudentProvider>
      <div className="h-screen bg-white overflow-hidden w-full flex">
        <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <StudentHeader onMenuClick={() => setSidebarOpen(true)} breadcrumbs={breadcrumbs} />
          
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
    </StudentProvider>
  )
}

export default StudentLayoutProvider

