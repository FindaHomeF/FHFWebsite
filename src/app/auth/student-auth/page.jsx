import SignUpForm from '@/app/components/auth/SignUpForm'

const Student = () => {
  return (
    <div className="w-full">
        <SignUpForm 
            head={'Sign Up as a Student'}
            role={'student'}
        />
    </div>
  )
}

export default Student