'use client'

import { useParams } from 'next/navigation'
import PostedItemAnalytics from '@/components/dashboard/PostedItemAnalytics'

export default function AgentPropertyAnalyticsPage() {
  const params = useParams()
  const id = params?.id != null ? String(params.id) : ''
  return <PostedItemAnalytics context="agent" kind="property" id={id} backHref="/agent/properties" />
}
