"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isEmailUnverifiedAuthError } from '@/lib/auth-api';
import { useLoginUser, useRequestPasswordReset, useResendEmailOtp } from '@/lib/mutations';
import { getDashboardPathByRole } from '@/lib/auth-redirects';

const Logo = "/Logo/Logosvg.svg"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Login = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const { mutateAsync: login, isPending } = useLoginUser()
    const { mutateAsync: resendOtp, isPending: isResendingOtp } = useResendEmailOtp()
    const { mutateAsync: requestReset, isPending: isRequestingReset } = useRequestPasswordReset()

    const {
        register,
        handleSubmit,
        watch,
        formState:{errors},
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            rememberMe: false,
        },
    });

    const handleRuns = async (data) =>{
        const email = data.email.trim().toLowerCase()
        try {
            const loginResponse = await login({
                email,
                password: data.password,
                remember_me: Boolean(data.rememberMe),
            })
            const roleFromResponse =
              loginResponse?.user?.role || loginResponse?.profile?.role || loginResponse?.role
            let role = roleFromResponse
            if (!role && typeof window !== 'undefined') {
              role = JSON.parse(localStorage.getItem('currentUser') || 'null')?.role
            }
            router.replace(getDashboardPathByRole(role))
        } catch (error) {
            if (isEmailUnverifiedAuthError(error)) {
                try {
                    await resendOtp({
                        email,
                        otp_type: 'email_verification',
                    })
                } catch {
                    // OTP page can resend if this fails.
                }
                if (typeof window !== 'undefined') {
                    localStorage.setItem('fhf-signup-email', email)
                }
                router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`)
                return
            }
            // Other errors: mutation onError shows toast.
        }
    }

    const handleForgotPassword = async () => {
        const enteredEmail = emailValue?.trim().toLowerCase()
        if (enteredEmail && EMAIL_PATTERN.test(enteredEmail)) {
          try {
            await requestReset({ email: enteredEmail })
          } catch {
            // Error handled in mutation with toast.
          }
          router.push(`/auth/reset-password?email=${encodeURIComponent(enteredEmail)}`)
          return
        }
        router.push('/auth/reset-password')
    }
    const emailValue = watch('email')

  return (
    <div className='w-full h-full flex-col flex-itc-juc'>
        <div className='space-y-7 md:space-y-9 w-full'>
            <div className="logo w-fit mx-auto h-[3.5rem]">
                <Image 
                    src={Logo}
                    alt="fhflogo"
                    width={200}
                    height={54}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className='space-y-7 w-full'>
                <div className="signinhead text-center space-y-2">
                    <h3 className='sign-head'>Sign in to FHF</h3>
                    <p className='sign-para text-gray'>Continue with Find-a-Home FUTA</p>
                </div>
 
                <form className="w-full " onSubmit={handleSubmit(handleRuns)} >
                    <div className='w-full space-y-3'>

                        <div className='w-full'>
                            <label className='labels block text-sm text-black/70 pb-1'>Email address *</label>
                            <input type={'email'} {...register("email", {
                              required: 'Email is required',
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Enter a valid email address',
                              },
                            })}  className={`rounded-md border border-black10 w-full h-[3rem] px-3  ${errors.email && 'border-red-500 '}`} placeholder='example@email.com'/>
                            <label className={`text-red-500 text-xs text-right font-medium italic tracking-wide ${errors.email && 'pt-1'}`}>
                                    {errors.email?.message}
                            </label>
                        </div>

                        <div className='w-full pt-5'>
                            <label className='labels block text-sm text-black/70 pb-1'>Password*</label>
                            <div className='relative'>
                                <input type={showPassword ? 'text' : 'password'} {...register("password", { required: 'Password is required' })}  className={`rounded-md border border-black10 w-full h-[3rem] px-3  ${errors.password && 'border-red-500 '}`} placeholder='*******'/>
                                <button
                                  type='button'
                                  onClick={() => setShowPassword((value) => !value)}
                                  className='right-3 top-[50%] -translate-y-[50%] text-lightGray absolute cursor-pointer'
                                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                  {showPassword ? <FaEyeSlash className='text-base' /> : <FaEye className='text-base' />}
                                </button>
                            </div>
                            <label className={`text-red-500 text-xs text-right font-medium italic tracking-wide ${errors.password && 'pt-1'}`}>
                                    {errors.password?.message}
                            </label>
                        </div>

                        <div className='flex-itc-jub'>
                            <div>
                                <div className='flex-itc gap-x-2'>
                                    <input type="checkbox" {...register('rememberMe')} className='cursor-pointer'/>
                                    <h6 className='text-black/70 text-sm'>Remember Me</h6>
                                </div>

                            </div>

                            <div className='cursor-pointer w-fit'>
                                <button
                                  type='button'
                                  onClick={handleForgotPassword}
                                  disabled={isRequestingReset}
                                  className='underline text-primary outline-offset-2 font-semibold text-sm disabled:text-black/40 disabled:no-underline'
                                >
                                  {isRequestingReset ? 'Requesting...' : 'Forgot Password?'}
                                </button>
                            </div>
                        </div>
                        

                        <div className='grid grid-cols-3 items-center pt-3'>
                            <div className='w-full h-[.5px] border-t border-t-black/70 '></div>
                            <h6 className='text-xs font-medium text-center text-black/70'>or</h6>
                            <div className='w-full h-[.5px] border-t border-t-black/70'></div>
                        </div>

                        {/* 
                        <div className="google-btn pt-1 w-full h-[3rem]">
                            <div className='rounded-md h-full w-full gap-x-2 border flex-itc-juc border-black/40 px-3 cursor-pointer'>
                                <FaGoogle/>
                                <h6 className='text-sm font-medium text-black/70'>Sign in with Google</h6>
                            </div>
                        </div>
                        */}
                        
                        <div className='pt-5 space-y-2'>
                            <Button
                              disabled={isPending || isResendingOtp}
                              className="text-white text-sm h-[3rem] font-medium bg-primary w-full rounded-full"
                            >
                              {isResendingOtp
                                ? 'Sending verification code...'
                                : isPending
                                  ? 'Signing In...'
                                  : 'Sign In'}
                            </Button>
                            <h6 className='text-center font-semibold text-sm md:hidden'>Don't have an account? <Link href={'/auth/signup/'}><span className='underline cursor-pointer outline-offset-2'>Sign Up</span></Link></h6>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login