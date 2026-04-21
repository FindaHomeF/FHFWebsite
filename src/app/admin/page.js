'use client'
import { useState, useEffect } from 'react'
import { Home, Package, Wrench, DollarSign } from 'lucide-react'
import StatsCard from './components/StatsCard'
import RevenueChart from './components/RevenueChart'
import RevenueDistributionChart from './components/RevenueDistributionChart'
import CategoryChart from './components/CategoryChart'
import ListingSection from './components/ListingSection'
import ItemListingSection from './components/ItemListingSection'
import ServiceListingSection from './components/ServiceListingSection'
import UserListingSection from './components/UserListingSection'
import TransactionListingSection from './components/TransactionListingSection'

// Mock data - replace with actual API calls
const mockStats = {
  totalProperties: 0,
  totalItems: 0,
  totalServices: 0,
  totalRevenue: '₦0.00',
  }

  const apartmentData = [
  { name: 'Studio', value: 25, color: 'var(--primary)' },
  { name: '1 Bedroom', value: 45, color: 'var(--primary)' },
  { name: '2 Bedroom', value: 35, color: 'var(--primary)' },
  { name: '3 Bedroom', value: 20, color: 'var(--primary)' },
  { name: 'Shortlets', value: 60, color: 'var(--primary)' },
]

const itemData = [
  { name: 'Electronics', value: 25, color: 'var(--tertiary)' },
  { name: 'Furniture', value: 45, color: 'var(--tertiary)' },
  { name: 'Home Appliances', value: 35, color: 'var(--tertiary)' },
  { name: 'Kitchen Items', value: 20, color: 'var(--tertiary)' },
  { name: 'Shortlets', value: 60, color: 'var(--tertiary)' },
]

const serviceData = [
  { name: 'Plumbing', value: 25, color: 'var(--secondary)' },
  { name: 'Cleaning', value: 45, color: 'var(--secondary)' },
  { name: 'Electrical', value: 35, color: 'var(--secondary)' },
  { name: 'Capentry', value: 20, color: 'var(--secondary)' },
  { name: 'Moving', value: 60, color: 'var(--secondary)' },
]
export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setStats(mockStats)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto px-6 pt-6">  
      <div className="space-y-6 mb-14">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Properties"
            value={stats.totalProperties}
            color="blue"
            icon={Home}
            change={-10}
          />
          <StatsCard
            title="Total Items"
            value={stats.totalItems}
            color="orange"
            icon={Package}
            change={0}
          />
          <StatsCard
            title="Total Services"
            value={stats.totalServices}
            color="blue"
            icon={Wrench}
            change={-10}
          />
          <StatsCard
            title="Total Revenue"
            value={stats.totalRevenue}
            color="orange"
            icon={DollarSign}
            change={10}
          />
        </div>

        {/* Revenue Charts */}
        <div className="">
          <RevenueChart />
        </div>

        {/* Category Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueDistributionChart />
          <CategoryChart title="Top Apartment Categories"  color={"var(--primary)"} data={apartmentData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart title="Top Decluttered Item Categories" color={"var(--tertiary)"} data={itemData} />
          <CategoryChart title="Top Service Categories" color={"var(--secondary)"} data={serviceData} />  
        </div>

        {/* Listings and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListingSection 
            title="Property Listings" 
            emptyMessage="No Listing Available" 
          />
          <ItemListingSection 
            title="Item Listings" 
          />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">     
          
        <ServiceListingSection 
            title="Service Listings" 
          />
          <UserListingSection 
            title="Users" 
          />
        </div>
        
        <div className=''>
          <TransactionListingSection 
              title="Transactions" 
            />
        </div> 
      </div>
    </div>
  )
}

