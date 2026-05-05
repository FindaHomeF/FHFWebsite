'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useResendEmailOtp, useVerifyEmailOtp } from '@/lib/mutations'
import { toast } from 'sonner'

const Logo = '/Logo/Logosvg.svg'

const formatCountdown = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

const OTP_PATTERN = /^[A-Z0-9]{8}$/
const DEFAULT_RESEND_COOLDOWN_SECONDS = 20 * 60

const EmailOtpForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyEmailOtp()
  const { mutateAsync: resendOtp, isPending: isResending } = useResendEmailOtp()

  const email = useMemo(() => {
    const fromUrl = searchParams.get('email')
    if (fromUrl) return fromUrl
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fhf-signup-email') || ''
    }
    return ''
  }, [searchParams])

  const [otp, setOtp] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [resendHint, setResendHint] = useState('You can request up to 3 OTPs per hour. Check spam before resending.')

  const startTimer = (seconds) => {
    setCountdown(Math.max(0, Number(seconds) || 0))
  }

  useEffect(() => {
    if (countdown <= 0) return
    const timer = window.setTimeout(() => {
      setCountdown((value) => Math.max(value - 1, 0))
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [countdown])

  const handleVerify = async (event) => {
    event.preventDefault()
    const normalizedOtp = otp.trim().toUpperCase()
    if (!email || !OTP_PATTERN.test(normalizedOtp)) return

    try {
      await verifyOtp({
        email: email.trim().toLowerCase(),
        otpCode: normalizedOtp,
      })
      toast.success('Email confirmed. Please login with your details.')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fhf-signup-role')
      }
      router.replace('/auth')
    } catch {
      // Handled with mutation onError toast.
    }
  }

  const handleResend = async () => {
    if (!email || countdown > 0) return
    try {
      await resendOtp({
        email: email.trim().toLowerCase(),
        otp_type: 'email_verification',
      })
      startTimer(DEFAULT_RESEND_COOLDOWN_SECONDS)
      setResendHint('OTP sent. For security, wait before requesting another code.')
    } catch (error) {
      const retryAfterSeconds = Number(error?.meta?.retryAfter)
      if (error?.status === 429) {
        startTimer(retryAfterSeconds || DEFAULT_RESEND_COOLDOWN_SECONDS)
        setResendHint('Too many OTP requests. Please wait for cooldown and check your spam folder.')
      }
    }
  }

  return (
    <div className='md:flex h-screen'>
      <div className='w-full sticky md:relative top-0 shadow-sm md:shadow-none z-10 bg-white md:w-2/6 border-b md:border-b-0 border-b-black/30'>
        <div className='w-full text-center md:text-left md:w-5/6 mx-auto pt-10 pb-5 md:py-10'>
          <div className='w-full space-y-3 md:space-y-7'>
            <div className='logo w-fit mx-auto md:mx-0 h-[2.8rem]'>
              <Image src={Logo} alt='fhflogo' width={200} height={54} className='w-full h-full object-cover' />
            </div>
            <h3 className='sign-head'>Verify Your Email</h3>
            <p className='sign-para text-black/70'>
              Enter the 8-character OTP sent to your email to activate your account.
            </p>
          </div>
        </div>
      </div>

      <div className='w-full md:w-4/6 md:border-l border-l-black/30 h-full'>
        <div className='w-5/6 mx-auto pt-5 md:py-10'>
          <div className='w-full md:w-5/6 space-y-6'>
            <div>
              <h3 className='sign-head text-center md:text-left'>Email Verification OTP</h3>
              <p className='text-sm text-black/60 mt-1 break-all'>
                {email ? email : 'Missing email. Please return to signup and try again.'}
              </p>
            </div>

            <form className='space-y-5' onSubmit={handleVerify}>
              <div>
                <label className='labels block text-sm text-black/70 pb-1'>8-character OTP</label>
                <input
                  type='text'
                  inputMode='text'
                  maxLength={8}
                  value={otp}
                  onChange={(event) =>
                    setOtp(
                      event.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, '')
                    )
                  }
                  className='rounded-md border border-black10 w-full h-[2.8rem] px-3 tracking-[0.3em] text-center text-lg'
                  placeholder='A1B2C3D4'
                />
                <p className='text-xs text-black/50 pt-2'>
                  OTP is case-sensitive, expires in 1 hour, and account locks after 5 failed attempts.
                </p>
                <p className='text-xs text-black/50 pt-1'>{resendHint}</p>
              </div>

              <Button
                type='submit'
                disabled={isVerifying || !OTP_PATTERN.test(otp.trim()) || !email}
                className='text-white text-sm h-[2.8rem] font-medium bg-primary w-full rounded-full'
              >
                {isVerifying ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>

            <div className='space-y-3'>
              <Button
                type='button'
                variant='outline'
                onClick={handleResend}
                disabled={isResending || countdown > 0 || !email}
                className='w-full h-[2.8rem] rounded-full'
              >
                {isResending ? 'Sending...' : countdown > 0 ? `Resend OTP in ${formatCountdown(countdown)}` : 'Resend OTP'}
              </Button>
              <Link href='/auth/signup' className='block'>
                <Button type='button' variant='ghost' className='w-full h-[2.8rem] rounded-full'>
                  Back to Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailOtpForm
