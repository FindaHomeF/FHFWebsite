'use client'

import { ChevronDown, Eye, LogOut, MessageCircle, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLogoutUser } from '@/lib/mutations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DashboardProfileMenu({
  profileLabel = 'Profile menu',
  initial = 'U',
  profileHref = '/',
  messagesHref,
  publicProfileHref,
}) {
  const router = useRouter()
  const { mutateAsync: logoutUser, isPending: isLoggingOut } = useLogoutUser()

  const handleLogout = async () => {
    const accessToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('fhf-access-token') || localStorage.getItem('access_token')
        : null
    const refreshToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('fhf-refresh-token') || localStorage.getItem('refresh_token')
        : null

    try {
      await logoutUser({
        accessToken,
        refreshToken,
      })
    } catch {
      // Local auth storage is cleared in mutation fallback for auth failures.
    } finally {
      router.push('/auth')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-auto px-2 py-1 text-tertiary hover:bg-black10"
          aria-label={profileLabel}
        >
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-tertiary text-sm font-medium">{initial}</span>
          </div>
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-[500] w-56 overflow-hidden rounded-lg border border-black33 bg-white py-1 text-gray-900 shadow-md backdrop-blur-none"
      >
        <DropdownMenuItem
          className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
          onClick={() => router.push(profileHref)}
        >
          <UserRound className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        {messagesHref ? (
          <DropdownMenuItem
            className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
            onClick={() => router.push(messagesHref)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
          </DropdownMenuItem>
        ) : null}

        {publicProfileHref ? (
          <DropdownMenuItem
            className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
            onClick={() => router.push(publicProfileHref)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Public Profile View
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem
          className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
