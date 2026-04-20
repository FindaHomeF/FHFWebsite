import SignUpForm from '@/app/components/auth/SignUpForm'

const Agent = () => {
  return (
    <div className="w-full">
        <SignUpForm
            head={'Sign Up as a Property Agent'}
            role={'agent'}
        />
    </div>
  )
}

export default Agent