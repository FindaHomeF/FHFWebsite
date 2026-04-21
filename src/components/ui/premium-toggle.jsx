'use client'
import React, { useState, useEffect, useId } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Crown, AlertCircle } from 'lucide-react'

const PREMIUM_PRICE = 4000
const PREMIUM_DURATION_DAYS = 3

const PremiumToggle = ({ 
  listingId, 
  listingType, // 'apartment', 'service', 'item'
  currentPremium = false,
  premiumExpiry = null,
  onToggle,
  isAdmin = false,
  className = '',
  redirectToPayment = true
}) => {
  const router = useRouter()
  const premiumToggleId = useId()
  const [isPremium, setIsPremium] = useState(currentPremium)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (premiumExpiry) {
      const expiryDate = new Date(premiumExpiry)
      const now = new Date()
      setIsExpired(expiryDate < now)
      setIsPremium(currentPremium && !isExpired)
    } else {
      setIsPremium(currentPremium)
    }
  }, [currentPremium, premiumExpiry, isExpired])

  const handleToggle = async (checked) => {
    if (checked && !isPremium) {
      // Navigate to payment page if redirectToPayment is enabled
      if (redirectToPayment) {
        router.push(`/checkout/payment?type=premium&listingId=${listingId}&listingType=${listingType}&amount=${PREMIUM_PRICE}&duration=${PREMIUM_DURATION_DAYS}`)
      } else if (onToggle) {
        // Just toggle if no redirect
        onToggle(true)
        setIsPremium(true)
      }
    } else if (!checked && isPremium) {
      // Disable premium (this would typically require API call)
      setIsPremium(false)
      if (onToggle) {
        onToggle(false)
      }
    }
  }

  const getPremiumStatus = () => {
    if (isPremium && !isExpired) {
      return { text: 'Premium Active', color: 'text-green-600', bg: 'bg-green-50' }
    } else if (isExpired) {
      return { text: 'Premium Expired', color: 'text-orange-600', bg: 'bg-orange-50' }
    } else {
      return { text: 'Standard Listing', color: 'text-gray-600', bg: 'bg-gray-50' }
    }
  }

  const status = getPremiumStatus()

  // Don't show premium option for admin
  if (isAdmin) {
    return null
  }

  return (
    <div className={`border rounded-lg p-4 ${status.bg} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown className={`w-5 h-5 ${status.color}`} />
          <Label htmlFor={premiumToggleId} className="font-semibold text-gray-900">
            Premium Listing
          </Label>
        </div>
        <Switch
          id={premiumToggleId}
          checked={isPremium && !isExpired}
          onCheckedChange={handleToggle}
          disabled={isPremium && !isExpired && !onToggle}
        />
      </div>
      
      {isPremium && !isExpired && premiumExpiry && (
        <div className="text-sm text-gray-700 mb-2">
          <p>Premium expires: {new Date(premiumExpiry).toLocaleDateString()}</p>
        </div>
      )}

      {!isPremium && (
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            Boost your listing visibility for <strong>₦{PREMIUM_PRICE.toLocaleString()}</strong> for {PREMIUM_DURATION_DAYS} days
          </p>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Premium Benefits:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Featured placement in search results</li>
                <li>Higher visibility and more views</li>
                <li>Priority customer support</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {isExpired && (
        <div className="text-sm text-orange-700">
          Your premium listing has expired. Enable it again to renew.
        </div>
      )}
    </div>
  )
}

export default PremiumToggle

