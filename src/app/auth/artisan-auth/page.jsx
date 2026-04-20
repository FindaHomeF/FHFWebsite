import SignUpForm from "../../components/auth/SignUpForm"

const Artisan = () => {
  return (
    <div className="w-full">
        <SignUpForm 
            head={'Sign Up as an Artisan'}
            role={'artisan'}
        />
    </div>
  )
}

export default Artisan