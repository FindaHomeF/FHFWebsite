'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { useRequestPasswordReset, useResetPasswordWithOtp } from '@/lib/mutations'

const Logo = '/Logo/Logosvg.svg'
const OTP_PATTERN = /^[A-Z0-9]{8}$/
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
const DEFAULT_RESEND_COOLDOWN_SECONDS = 20 * 60

const formatCountdown = (seconds) => {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${mins}:${secs}`
}

const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { mutateAsync: requestReset, isPending: isRequestingReset } = useRequestPasswordReset()
  const { mutateAsync: resetPassword, isPending: isResettingPassword } = useResetPasswordWithOtp()

  const initialEmail = useMemo(() => searchParams.get('email') || '', [searchParams])
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendHint, setResendHint] = useState('You can request up to 3 OTPs per hour. Check spam before resending.')

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: initialEmail,
      otpCode: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const email = watch('email')
  const otpCode = watch('otpCode')
  const newPassword = watch('newPassword')

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

  const handleRequestOtp = async () => {
    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail) return

    try {
      await requestReset({ email: normalizedEmail })
      startTimer(DEFAULT_RESEND_COOLDOWN_SECONDS)
      setResendHint('OTP sent. Wait before requesting another code.')
    } catch (error) {
      const retryAfterSeconds = Number(error?.meta?.retryAfter)
      if (error?.status === 429) {
        startTimer(retryAfterSeconds || DEFAULT_RESEND_COOLDOWN_SECONDS)
        setResendHint('Too many OTP requests. Please wait for cooldown and check spam.')
      }
    }
  }

  const handleResetPassword = async (data) => {
    try {
      await resetPassword({
        email: data.email.trim().toLowerCase(),
        otpCode: data.otpCode.trim().toUpperCase(),
        newPassword: data.newPassword,
        newPasswordConfirm: data.confirmNewPassword,
      })
      router.push('/auth')
    } catch {
      // Error handled in mutation.
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
            <h3 className='sign-head'>Reset Password</h3>
            <p className='sign-para text-black/70'>
              Request a password reset OTP and set a new secure password.
            </p>
          </div>
        </div>
      </div>

      <div className='w-full md:w-4/6 md:border-l border-l-black/30 h-full'>
        <div className='w-5/6 mx-auto pt-5 md:py-10'>
          <div className='w-full md:w-5/6 space-y-5'>
            <h3 className='sign-head text-center md:text-left'>Complete password reset</h3>

            <form className='w-full space-y-4' onSubmit={handleSubmit(handleResetPassword)}>
              <div>
                <label className='labels block text-sm text-black/70 pb-1'>Email Address *</label>
                <input
                  type='email'
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  className={`rounded-md border border-black10 w-full h-[2.8rem] px-3 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder='example@email.com'
                />
                <p className='text-red-500 text-xs pt-1'>{errors.email?.message}</p>
              </div>

              <Button
                type='button'
                variant='outline'
                onClick={handleRequestOtp}
                disabled={isRequestingReset || countdown > 0 || !email}
                className='w-full h-[2.8rem] rounded-full'
              >
                {isRequestingReset
                  ? 'Requesting OTP...'
                  : countdown > 0
                  ? `Resend OTP in ${formatCountdown(countdown)}`
                  : 'Request / Resend OTP'}
              </Button>
              <p className='text-xs text-black/50 -mt-2'>{resendHint}</p>

              <div>
                <label className='labels block text-sm text-black/70 pb-1'>8-character OTP *</label>
                <input
                  type='text'
                  maxLength={8}
                  value={otpCode}
                  onChange={(event) =>
                    setValue(
                      'otpCode',
                      event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
                      { shouldValidate: true }
                    )
                  }
                  className={`rounded-md border border-black10 w-full h-[2.8rem] px-3 tracking-[0.25em] text-center ${errors.otpCode ? 'border-red-500' : ''}`}
                  placeholder='A1B2C3D4'
                />
                <p className='text-red-500 text-xs pt-1'>{errors.otpCode?.message}</p>
                <input
                  type='hidden'
                  {...register('otpCode', {
                    required: 'OTP is required',
                    validate: (value) => OTP_PATTERN.test(value || '') || 'OTP must be 8 uppercase alphanumeric characters',
                  })}
                />
                <p className='text-xs text-black/50 pt-1'>OTP expires in 15 minutes and is single-use.</p>
              </div>

              <div>
                <label className='labels block text-sm text-black/70 pb-1'>New Password *</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('newPassword', {
                      required: 'New password is required',
                      pattern: {
                        value: PASSWORD_PATTERN,
                        message: 'Use 8+ chars with upper, lower, number, and special char',
                      },
                    })}
                    className={`rounded-md border border-black10 w-full h-[2.8rem] px-3 ${errors.newPassword ? 'border-red-500' : ''}`}
                    placeholder='*******'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((value) => !value)}
                    className='right-3 top-[50%] -translate-y-[50%] text-lightGray absolute cursor-pointer'
                    aria-label={showPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showPassword ? <FaEyeSlash className='text-base' /> : <FaEye className='text-base' />}
                  </button>
                </div>
                <p className='text-red-500 text-xs pt-1'>{errors.newPassword?.message}</p>
              </div>

              <div>
                <label className='labels block text-sm text-black/70 pb-1'>Confirm New Password *</label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmNewPassword', {
                      required: 'Confirm your new password',
                      validate: (value) => value === newPassword || 'Passwords do not match',
                    })}
                    className={`rounded-md border border-black10 w-full h-[2.8rem] px-3 ${errors.confirmNewPassword ? 'border-red-500' : ''}`}
                    placeholder='*******'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className='right-3 top-[50%] -translate-y-[50%] text-lightGray absolute cursor-pointer'
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <FaEyeSlash className='text-base' /> : <FaEye className='text-base' />}
                  </button>
                </div>
                <p className='text-red-500 text-xs pt-1'>{errors.confirmNewPassword?.message}</p>
              </div>

              <div className='pt-2 space-y-2'>
                <Button disabled={isResettingPassword} className='text-white text-sm h-[2.8rem] font-medium bg-primary w-full rounded-full'>
                  {isResettingPassword ? 'Resetting Password...' : 'Reset Password'}
                </Button>
                <Link href='/auth' className='block'>
                  <Button type='button' variant='ghost' className='w-full h-[2.8rem] rounded-full'>
                    Back to Login
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
