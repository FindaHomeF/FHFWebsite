import DCategories from '../components/decluttering/DCategories'
import Featured from '../components/decluttering/Featured'
import How from '../components/decluttering/How'
import Recent from '../components/decluttering/Recent'
import Footer from '../components/global/Footer'
import FooterCta from '../components/global/FooterCta'
import Header from '../components/global/Header'
import Hero from '../components/global/Hero'
import Testimonials from '../components/home/Testimonials'

const page = () => {
  return (
    <div className="bg-white w-full overflow-x-hidden scroll-smooth transition-all ease-linear duration-500">
        <Header/>
        <main className="space-y-16 md:space-y-20 pt-3 md:pt-16">
            <Hero
                placeholder={'Search furniture, appliances, books, and more...'}
                mainText={'Declutter & Find Essentials'}
                subText={'Sell items you no longer need and discover affordable pre-owned essentials from trusted FUTA students.'}
                btn1={'List an Item'}
                btn2={'Browse Categories'}  
                cta2='#categories'
            />
            <Recent/>
            <Featured/>
            <DCategories/>
            <How/>
            <Testimonials/>
            <FooterCta/>
        </main>
        <footer>
          <Footer/>
        </footer>
    </div>
  )
}

export default page

export const metadata = {
  title: 'Student Marketplace - Find-a-Home FUTA',
  description: 'Buy and sell quality pre-owned items within the FUTA community. Furniture, appliances, books, and more. Budget-friendly, eco-conscious, student-focused.',
}