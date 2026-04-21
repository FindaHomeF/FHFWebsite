import { Suspense } from 'react'
import EmailOtpForm from '@/app/components/auth/EmailOtpForm'

const VerifyOtpPage = () => {
  return (
    <div className='w-full'>
      <Suspense fallback={<div className='w-full h-screen bg-white' />}>
        <EmailOtpForm />
      </Suspense>
    </div>
  )
}

export default VerifyOtpPage
