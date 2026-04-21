'use client'

import { useParams } from 'next/navigation'
import PostedItemAnalytics from '@/components/dashboard/PostedItemAnalytics'

export default function AgentItemAnalyticsPage() {
  const params = useParams()
  const id = params?.id != null ? String(params.id) : ''
  return <PostedItemAnalytics context="agent" kind="item" id={id} backHref="/agent/items" />
}
