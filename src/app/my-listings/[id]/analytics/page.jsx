'use client'
import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, TrendingUp, MessageCircle, Calendar, Download } from 'lucide-react'
import Header from '@/app/components/global/Header'
import Footer from '@/app/components/global/Footer'
import { useItem, useItemViewStats } from '@/contexts/DataContext'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const mockAnalytics = {
  overview: {
    totalViews: 245,
    totalInquiries: 12,
    conversionRate: 4.9,
    avgViewsPerDay: 12.25
  },
  viewsData: [
    { date: 'Jan 15', views: 5 },
    { date: 'Jan 16', views: 8 },
    { date: 'Jan 17', views: 12 },
    { date: 'Jan 18', views: 15 },
    { date: 'Jan 19', views: 20 },
    { date: 'Jan 20', views: 18 },
    { date: 'Jan 21', views: 25 }
  ],
  inquiriesData: [
    { date: 'Jan 15', inquiries: 1 },
    { date: 'Jan 16', inquiries: 2 },
    { date: 'Jan 17', inquiries: 1 },
    { date: 'Jan 18', inquiries: 3 },
    { date: 'Jan 19', inquiries: 2 },
    { date: 'Jan 20', inquiries: 1 },
    { date: 'Jan 21', inquiries: 2 }
  ]
}

export default function ItemAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const { data: itemData } = useItem(id)
  const { data: viewStats, isLoading: isViewStatsLoading } = useItemViewStats(id)

  const analytics = useMemo(() => {
    const safeTotalViews = Number(viewStats?.total_views ?? 0)
    const safeViews24h = Number(viewStats?.views_24h ?? 0)
    const safeUniqueViewers = Number(viewStats?.unique_viewers ?? 0)
    const safeUniqueViewers24h = Number(viewStats?.unique_viewers_24h ?? 0)

    return {
      ...mockAnalytics,
      overview: {
        totalViews: safeTotalViews || mockAnalytics.overview.totalViews,
        uniqueViewers: safeUniqueViewers || mockAnalytics.overview.totalViews,
        views24h: safeViews24h || mockAnalytics.overview.avgViewsPerDay,
        uniqueViewers24h: safeUniqueViewers24h || mockAnalytics.overview.totalInquiries,
      },
    }
  }, [viewStats])

  return (
    <div className="bg-white w-full overflow-x-hidden scroll-smooth transition-all ease-linear duration-500">
      <Header />
      <main className="min-h-screen py-8 md:py-12">
        <div className="w-[90%] mx-auto max-w-7xl">
          <button
            onClick={() => router.push('/my-listings')}
            className="inline-flex items-center text-primary hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Listings
          </button>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Item Analytics</h1>
              <p className="text-gray-600">{itemData?.title || 'Listing'}</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Views</span>
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {isViewStatsLoading ? '...' : analytics.overview.totalViews}
              </p>
              <p className="text-sm text-gray-500 mt-1">From listing view stats</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Unique Viewers</span>
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {isViewStatsLoading ? '...' : analytics.overview.uniqueViewers}
              </p>
              <p className="text-sm text-gray-500 mt-1">From listing view stats</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Views (24h)</span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {isViewStatsLoading ? '...' : analytics.overview.views24h}
              </p>
              <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Unique (24h)</span>
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {isViewStatsLoading ? '...' : analytics.overview.uniqueViewers24h}
              </p>
              <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Views Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Inquiries Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.inquiriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inquiries" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Your listing is performing well! Consider adding more photos to increase views.</li>
              <li>• Update your description with more keywords to improve search visibility.</li>
              <li>• Share your listing on social media to reach more potential buyers.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
