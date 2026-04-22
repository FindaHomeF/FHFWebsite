'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye, MessageCircle, Calendar, TrendingUp } from 'lucide-react'
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const hashSeed = (s) => {
  let h = 0
  for (let i = 0; i < String(s).length; i += 1) h = (h << 5) - h + String(s).charCodeAt(i)
  return Math.abs(h)
}

const buildMock = (kind, id) => {
  const seed = hashSeed(`${kind}:${id}`)
  const baseViews = 400 + (seed % 900)
  const baseInquiries = 12 + (seed % 40)
  return {
    titleLabel: kind === 'property' ? 'Property' : kind === 'item' ? 'Listing' : 'Service',
    totalViews: baseViews,
    totalInquiries: baseInquiries,
    scheduledViewings: 4 + (seed % 12),
    applications: kind === 'property' ? 3 + (seed % 10) : seed % 8,
    conversionRate: Number((2 + (seed % 400) / 100).toFixed(1)),
    viewsData: [
      { date: 'Week 1', views: 80 + (seed % 40) },
      { date: 'Week 2', views: 100 + (seed % 50) },
      { date: 'Week 3', views: 90 + (seed % 45) },
      { date: 'Week 4', views: 110 + (seed % 55) },
    ],
    inquirySources: [
      { name: 'Platform Search', value: 55 + (seed % 25), color: '#3B82F6' },
      { name: 'Direct Link', value: 15 + (seed % 15), color: '#10B981' },
      { name: 'Featured', value: 10 + (seed % 12), color: '#F59E0B' },
    ],
    inquiriesByDay: [
      { day: 'Mon', inquiries: 2 + (seed % 6) },
      { day: 'Tue', inquiries: 3 + (seed % 7) },
      { day: 'Wed', inquiries: 2 + (seed % 5) },
      { day: 'Thu', inquiries: 4 + (seed % 8) },
      { day: 'Fri', inquiries: 5 + (seed % 9) },
      { day: 'Sat', inquiries: 2 + (seed % 4) },
      { day: 'Sun', inquiries: 1 + (seed % 4) },
    ],
  }
}

export default function PostedItemAnalytics({ context, kind, id, backHref }) {
  const [displayTitle, setDisplayTitle] = useState(`${kind === 'property' ? 'Property' : kind === 'item' ? 'Item' : 'Service'} #${id}`)

  const metrics = useMemo(() => buildMock(kind, id), [kind, id])

  useEffect(() => {
    if (typeof window === 'undefined' || !id) return
    try {
      if (kind === 'property') {
        const list = JSON.parse(localStorage.getItem('properties') || '[]')
        const found = list.find((p) => String(p.id) === String(id))
        if (found?.title) setDisplayTitle(found.title)
      } else if (kind === 'item') {
        const list = JSON.parse(localStorage.getItem('items') || '[]')
        const found = list.find((i) => String(i.id ?? i.itemId) === String(id))
        if (found?.title) setDisplayTitle(found.title)
      } else if (kind === 'service') {
        const list = JSON.parse(localStorage.getItem('services') || '[]')
        const found = list.find((s) => String(s.id) === String(id))
        if (found?.serviceName) setDisplayTitle(found.serviceName)
      }
    } catch {
      /* keep fallback title */
    }
  }, [kind, id])

  const contextLabel =
    context === 'student' ? 'Student' : context === 'agent' ? 'Agent' : 'Service provider'

  return (
    <div className="space-y-6 px-6 pb-12">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" type="button" asChild>
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <span className="text-sm text-gray-500">{contextLabel} analytics</span>
      </div>

      <div>
        <h1 className="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">{displayTitle}</h1>
        <p className="text-gray-600">
          Performance for this {metrics.titleLabel.toLowerCase()} (demo metrics — connect your API later).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Views</span>
            <Eye className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalViews}</p>
          <p className="mt-1 text-sm text-green-600">+12% vs prior period</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Inquiries</span>
            <MessageCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalInquiries}</p>
          <p className="mt-1 text-sm text-green-600">+8% vs prior period</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Scheduled</span>
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.scheduledViewings}</p>
          <p className="mt-1 text-sm text-gray-500">Viewings / visits</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Applications</span>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.applications}</p>
          <p className="mt-1 text-sm text-gray-500">Where applicable</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600">Conversion</span>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.conversionRate}%</p>
          <p className="mt-1 text-sm text-gray-500">Views → inquiries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold">Views over time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={metrics.viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-xl font-semibold">Inquiry sources</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={metrics.inquirySources}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                dataKey="value"
              >
                {metrics.inquirySources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold">Inquiries by day</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={metrics.inquiriesByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="inquiries" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
        <h2 className="mb-3 text-xl font-semibold">Tips</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Respond to inquiries within 24 hours to improve conversion.</li>
          <li>• Refresh photos and pricing seasonally to stay competitive.</li>
          <li>• Use clear titles and campus-relevant keywords in descriptions.</li>
        </ul>
      </div>
    </div>
  )
}
