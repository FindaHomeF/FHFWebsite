'use client'
import Image from 'next/image';
import { useForm } from 'react-hook-form'
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import StudentIdInput from '@/components/ui/student-id-input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterUser } from '@/lib/mutations';
import { validateStudentId } from '@/lib/studentIdValidation';

const Logo = "/Logo/Logosvg.svg"



const getRoleFromHeading = (heading = '') => {
    const value = heading.toLowerCase()
    if (value.includes('student')) return 'student'
    if (value.includes('agent')) return 'agent'
    if (value.includes('artisan')) return 'artisan'
    return 'student'
}

const normalizePhoneNumber = (value = '') => {
    const cleaned = value.trim()
    if (cleaned.startsWith('+234')) return cleaned
    if (/^0\d{10}$/.test(cleaned)) return `+234${cleaned.slice(1)}`
    return cleaned
}

const SignUpForm = ({head, role: roleProp}) => {
    const router = useRouter()
    const role = roleProp || getRoleFromHeading(head)
    const { mutateAsync: registerUser, isPending } = useRegisterUser()

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState:{errors},
    } = useForm({
        defaultValues: {
            role,
        },
        mode: 'onTouched',
        reValidateMode: 'onChange',
    });
    
    const [studentIdValidation, setStudentIdValidation] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const isStudentSignup = role === 'student';
    const isArtisanSignup = role === 'artisan';
    const studentIdValue = watch('studentIdNumber');

    const handleSignUp = async (data) => {
        if (isStudentSignup && !studentIdValidation?.isValid) {
            return
        }

        const payload = {
            first_name: data.fname.trim(),
            last_name: data.lname.trim(),
            email: data.email.trim().toLowerCase(),
            phone_number: normalizePhoneNumber(data.phone),
            role,
            password: data.password,
            password_confirm: data.confirmPassword,
        }

        if (isStudentSignup) {
            payload.student_id_number = data.studentIdNumber?.trim()
        }
        if (isArtisanSignup) {
            payload.artisan_nin = data.artisanNin?.trim()
        }

        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('fhf-signup-role', role)
            }
            await registerUser(payload)
            if (typeof window !== 'undefined') {
                localStorage.setItem('fhf-signup-email', payload.email)
            }
            router.push(`/auth/verify-otp?email=${encodeURIComponent(payload.email)}`)
        } catch (error) {
            // Temporary fallback requested: continue to OTP flow on backend 500.
            if (error?.status === 500) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('fhf-signup-email', payload.email)
                }
                router.push(`/auth/verify-otp?email=${encodeURIComponent(payload.email)}`)
            }
        }
    }

  return (
    <div>
        <div className='md:flex h-screen'>
            <div className='w-full sticky md:relative top-0 shadow-sm md:shadow-none z-10 bg-white md:w-2/6 border-b md:border-b-0 border-b-black/30'>
                <div className='w-full text-center md:text-left md:w-5/6 mx-auto pt-10 pb-5 md:py-10'>
                    <div className='w-full space-y-3 md:space-y-7'>
                        <div className="logo w-fit mx-auto md:mx-0 h-[2.8rem]">
                            <Image 
                                src={Logo}
                                alt="fhflogo"
                                width={200}
                                height={54}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h3 className='sign-head'>{head}</h3>

                    </div>
                </div>
            </div>



            <div className='w-full md:w-4/6 md:border-l border-l-black/30 h-full'>
                <div className='w-5/6 mx-auto pt-5 md:py-10'>

                    <div className='w-full md:w-5/6 space-y-5'>
                        <h3 className='sign-head text-center md:text-left'>Kindly fill your details</h3>
                    

                        <form className="w-full " onSubmit={handleSubmit(handleSignUp)} >
                            <div className='w-full space-y-3 relative'>

                                <div className='w-full'>
                                    <label className='labels block text-sm text-black/70 pb-1'>First Name *</label>
                                    <input type={'text'} {...register("fname", { required: 'First name is required' })}  className={`rounded-md border border-black10 w-full h-[2.8rem] px-3  ${errors.fname && 'border-red-500 '}`} placeholder='John'/>
                                    <label className={`text-red-500 text-xs text-right font-medium italic tracking-wide ${errors.fname && 'pt-1'}`}>
                                            {errors.fname?.message}
                                    </label>
                                </div>

                                <div className='w-full'>
                                    <label className='labels block text-sm text-black/70 pb-1'>Last Name *</label>
                                    <input type={'text'} {...register("lname", { required: 'Last name is required' })}  className={`rounded-md border border-black10 w-full h-[2.8rem] px-3  ${errors.lname && 'border-red-500 '}`} placeholder='Doe'/>
                                    <label className={`text-red-500 text-xs text-right font-medium italic tracking-wide ${errors.lname && 'pt-1'}`}>
                                            {errors.lname?.message}
                                    </label>
                                </div>

                                <div className='w-full'>
                                    <label className='labels block text-sm text-black/70 pb-1'>Email Address *</label>
                                    <input type={'email'} {...register("email", {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Enter a valid email address',
                                        },
                                    })}  className={`rounded-md border border-black10 w-full h-[2.8rem] px-3  ${errors.email && 'border-red-500 '}`} placeholder='example@email.com'/>
                                    <label className={`text-red-500 text-xs text-right font-medium italic tracking-wide ${errors.email && 'pt-1'}`}>
                                            {errors.email?.message}
                                    </label>
                                </div>

                                <div className='w-full'>
                                    <label className='labels block text-sm text-black/70 pb-1'>Phone Number *</label>
                                    <input type={'text'} {...register("phone", {
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^(\+234\d{10}|0\d{10})$/,
                                            message: 'Use +234XXXXXXXXXX or 0XXXXXXXXXX format',
                                        },
                                    })}  className={`rounded-md border border-black10 w-full h-[2.8rem] px-3  ${errors.phone && 'border-red-500 '}`} placeholder='08012345678'/>
                                    <label className={`text-red-500 text-xs text-right font-medium italic tracking-wide ${errors.phone && 'pt-1'}`}>
                                            {errors.phone?.message}
                                    </label>
                                </div>

                                {isStudentSignup && (
                                  <div className='w-full'>
                                    <label className='labels block text-sm text-black/70 pb-1'>Student ID Number *</label>
                                    <StudentIdInput
                                      value={studentIdValue || ''}
                                      onChange={(e) => {
                                        setValue('studentIdNumber', e.target.value, { shouldValidate: true });
                                      }}
                                      onValidationChange={setStudentIdValidation}
                                      placeholder="CYS/19/0575"
                                      className='w-full border-black10'
                                      error={errors.studentIdNumber?.message}
                                    />
                                    <input
                                      type="hidden"
                                      {...register('studentIdNumber', {
                                        required: isStudentSignup ? 'Student ID number is required' : false,
                                        validate: (value) => {
                                          if (!isStudentSignup) return true
                                          const result = validateStudentId(value || '')
                                          return result.isValid || result.error || 'Enter a valid student ID format'
                                        },
                                      })}
                                    />
                                  </div>
                                )}

                                {isArtisanSignup && (
                                  <div className='w-full'>
                                    <label className='labels block text-sm text-black/70 pb-1'>NIN *</label>
                                    <input
                                      type='text'
                                      inputMode='numeric'
                                      maxLength={11}
                                      {...register('artisanNin', {
                                        required: 'NIN is required',
                                        minLength: {
                                          value: 11,
                                          message: 'NIN must be 11 digits',
                                        },
                                        maxLength: {
                                          value: 11,
                                          message: 'NIN must be 11 digits',
                                        },
                                        pattern: {
                                          value: /^\d+$/,
                                          message: 'NIN must contain numbers only',
                                        },
                                      })}
                                      className={`rounded-md border border-black10 w-full h-[2.8rem] px-3 ${errors.artisanNin && 'border-red-500 '}`}
                                      placeholder='12345678901'
                                    />
                                    <label className={`text-red-500 text-xs text-right font-medium italic tracking-wide ${errors.artisanNin && 'pt-1'}`}>
                                      {errors.artisanNin?.message}
                                    </label>
                                  </div>
                                )}

                                <div className='w-full relative h-fit'>
                                    <label className='labels block text-sm text-black/70 pb-1'>Password *</label>
                                    <div className='relative'>
                                        <input type={showPassword ? 'text' : 'password'} {...register("password", {
                                            required: 'Password is required',
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                                                message: 'Use 8+ chars, upper, lower, number, and special char',
                                            },
                                        })}  className={`rounded-md border border-black10 w-full h-[2.8rem] px-3 relative  ${errors.password && 'border-red-500 '}`} placeholder='*******'/>
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

                                <div className='w-full relative h-fit'>
                                    <label className='labels block text-sm text-black/70 pb-1 relative'>Confirm Password *</label>
                                    <div className='relative'>
                                        <input type={showConfirmPassword ? 'text' : 'password'} {...register("confirmPassword", {
                                            required: 'Confirm your password',
                                            validate: (value) => value === watch('password') || 'Passwords do not match',
                                        })}  className={`rounded-md border border-black10 w-full h-[2.8rem] px-3 relative  ${errors.confirmPassword && 'border-red-500 '}`} placeholder='*******'/>
                                        <button
                                          type='button'
                                          onClick={() => setShowConfirmPassword((value) => !value)}
                                          className='right-3 top-[50%] -translate-y-[50%] text-lightGray absolute cursor-pointer'
                                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                        >
                                          {showConfirmPassword ? <FaEyeSlash className='text-base' /> : <FaEye className='text-base' />}
                                        </button>
                                    </div>
                                    <label className={`text-red-500 text-xs text-right font-medium italic tracking-wide ${errors.confirmPassword && 'pt-1'}`}>
                                            {errors.confirmPassword?.message}
                                    </label>
                                </div>

                                <div className='pt-5'>
                                    <Button disabled={isPending} className="text-white text-sm h-[2.8rem] font-medium bg-primary w-full rounded-full">
                                        {isPending ? 'Submitting...' : 'Submit'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SignUpForm