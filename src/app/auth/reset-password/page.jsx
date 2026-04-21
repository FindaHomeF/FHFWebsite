import { Suspense } from 'react'
import ResetPasswordForm from '@/app/components/auth/ResetPasswordForm'

const ResetPasswordPage = () => {
  return (
    <div className='w-full'>
      <Suspense fallback={<div className='w-full h-screen bg-white' />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}

export default ResetPasswordPage
