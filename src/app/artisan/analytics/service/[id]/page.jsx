'use client'

import { useParams } from 'next/navigation'
import PostedItemAnalytics from '@/components/dashboard/PostedItemAnalytics'

export default function ArtisanServiceAnalyticsPage() {
  const params = useParams()
  const id = params?.id != null ? String(params.id) : ''
  return <PostedItemAnalytics context="artisan" kind="service" id={id} backHref="/artisan/services" />
}
