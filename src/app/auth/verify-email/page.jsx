'use client'
import { useState, useEffect } from 'react'
import { Mail, CheckCircle2, Clock, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/app/components/global/Header'
import Footer from '@/app/components/global/Footer'
import { toast } from 'sonner'

const VerifyEmailPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('pending') // 'pending', 'verified', 'expired'
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Get email from URL params or localStorage
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const emailParam = params.get('email')
      const savedEmail = localStorage.getItem('fhf-signup-email')
      setEmail(emailParam || savedEmail || 'user@example.com')
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    if (status !== 'verified') return
    toast.success('Email confirmed. Please login with your details.')
    router.replace('/auth')
  }, [status, router])

  const handleResend = () => {
    setCountdown(60)
    toast.success('Verification email sent! Please check your inbox.')
    // In production, call API to resend verification email
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          {status === 'pending' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Verify Your Email Address
                </h1>
                <p className="text-gray-600">
                  We've sent a verification link to
                </p>
                <p className="text-primary font-semibold mt-1">{email}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 space-y-2">
                    <p className="font-medium">Next Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Check your email inbox (and spam folder)</li>
                      <li>Click on the verification link in the email</li>
                      <li>You'll be redirected back to complete your registration</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive the email?
                </p>
                <Button
                  onClick={handleResend}
                  disabled={countdown > 0}
                  variant="outline"
                  className="mr-3"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Email'}
                </Button>
                <Link href="/auth/signup">
                  <Button variant="outline">
                    Change Email Address
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Verification link expires in 24 hours</span>
              </div>
            </div>
          )}

          {status === 'verified' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Email Verified!
                </h1>
                <p className="text-gray-600">
                  Your email has been successfully verified
                </p>
              </div>

              <div className="pt-4">
                <Link href="/auth">
                  <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                    Continue to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {status === 'expired' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Verification Link Expired
                </h1>
                <p className="text-gray-600">
                  The verification link has expired. Please request a new one.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleResend}
                  className="bg-primary hover:bg-primary/90 w-full md:w-auto"
                >
                  Send New Verification Email
                </Button>
                <div>
                  <Link href="/auth/signup">
                    <Button variant="outline" className="w-full md:w-auto">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link href="/auth" className="text-sm text-gray-600 hover:text-primary">
              ← Back to Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default VerifyEmailPage

