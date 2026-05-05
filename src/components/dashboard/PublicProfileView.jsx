'use client'

import { MessageSquare, Star } from 'lucide-react'

const PROFILE_PRESETS = {
  student: {
    heading: 'Student Public Profile',
    subtitle: 'This is how other users see your profile, ratings, and comments.',
    name: 'Student User',
    roleLabel: 'Student',
    location: 'Akure, Ondo',
    bio: 'Friendly and responsive student. Keeps appointments and communicates clearly.',
    rating: 4.6,
    totalReviews: 28,
  },
  agent: {
    heading: 'Agent Public Profile',
    subtitle: 'This is your public-facing view shown to renters and buyers.',
    name: 'Verified Agent',
    roleLabel: 'Agent',
    location: 'Akure, Ondo',
    bio: 'Property agent focused on transparent listings and smooth viewing coordination.',
    rating: 4.7,
    totalReviews: 42,
  },
  seller: {
    heading: 'Seller Public Profile',
    subtitle: 'This is your public-facing view shown to service and marketplace users.',
    name: 'Trusted Seller',
    roleLabel: 'Seller',
    location: 'Akure, Ondo',
    bio: 'Reliable seller with fast response time and high quality deliveries.',
    rating: 4.8,
    totalReviews: 36,
  },
}

const COMMENTS_BY_ROLE = {
  student: [
    { id: 's1', author: 'Ada K.', rating: 5, text: 'Very polite and easy to coordinate with.' },
    { id: 's2', author: 'Kunle A.', rating: 4, text: 'Prompt payment and clear communication.' },
    { id: 's3', author: 'Ife M.', rating: 5, text: 'Smooth transaction from start to finish.' },
  ],
  agent: [
    { id: 'a1', author: 'Bola O.', rating: 5, text: 'Professional during inspection and follow-up.' },
    { id: 'a2', author: 'Tobi S.', rating: 4, text: 'Accurate listing details and transparent process.' },
    { id: 'a3', author: 'Femi I.', rating: 5, text: 'Helped me close quickly with no surprises.' },
  ],
  seller: [
    { id: 'r1', author: 'Sade A.', rating: 5, text: 'Service was exactly as described and on time.' },
    { id: 'r2', author: 'Mary U.', rating: 4, text: 'Good communication and fair pricing.' },
    { id: 'r3', author: 'James N.', rating: 5, text: 'Handled everything professionally.' },
  ],
}

const renderStars = (rating) => {
  const filled = Math.round(rating)
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

export default function PublicProfileView({ role = 'student' }) {
  const config = PROFILE_PRESETS[role] || PROFILE_PRESETS.student
  const comments = COMMENTS_BY_ROLE[role] || COMMENTS_BY_ROLE.student

  return (
    <div className="space-y-6 px-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{config.heading}</h1>
        <p className="mt-1 text-sm text-gray-600">{config.subtitle}</p>
      </div>

      <section className="rounded-xl border border-black10 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{config.name}</h2>
            <p className="text-sm text-gray-600">{config.roleLabel} • {config.location}</p>
            <p className="mt-3 max-w-2xl text-sm text-gray-700">{config.bio}</p>
          </div>
          <div className="rounded-lg border border-black10 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Average rating</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{config.rating.toFixed(1)}</span>
              {renderStars(config.rating)}
            </div>
            <p className="mt-1 text-sm text-gray-600">{config.totalReviews} total reviews</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-black10 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Ratings & Comments</h3>
        </div>
        <div className="space-y-4">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-lg border border-black10 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{comment.author}</p>
                {renderStars(comment.rating)}
              </div>
              <p className="mt-2 text-sm text-gray-700">{comment.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
