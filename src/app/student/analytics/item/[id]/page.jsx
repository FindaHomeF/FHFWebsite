'use client'

import { useParams } from 'next/navigation'
import PostedItemAnalytics from '@/components/dashboard/PostedItemAnalytics'

export default function StudentItemAnalyticsPage() {
  const params = useParams()
  const id = params?.id != null ? String(params.id) : ''
  return <PostedItemAnalytics context="student" kind="item" id={id} backHref="/student/decluttering" />
}
