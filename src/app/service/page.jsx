import React from 'react'
import Header from '../components/global/Header'
import HeroSection from '../components/service/HeroSection'
import Footer from '../components/global/Footer'
import Filter from '../components/global/Filter'
import AvailableServices from '../components/servicesPage/available-services'
import TopRatedProfessionals from '../components/servicesPage/top-rated-professionals'
import Categories from '../components/servicesPage/categories'
import LatestListings from '../components/servicesPage/latest-listings'
import How from '../components/decluttering/How'
import Testimonials from '../components/home/Testimonials'
import FooterCta from '../components/global/FooterCta'

const page = () => {
  return (
    <div className="bg-white w-full overflow-x-hidden 
    scroll-smooth transition-all ease-linear duration-500">
    <main className="space-y-16 md:space-y-16">
      <div className="space-y-10">
        <Header/>
        <HeroSection
        showScrollDownButton={false}
        />
        <div className='w-[90%] mx-auto md:w-4/6'>
          <Filter  placeholder={'What apartment are you looking for?'}/>
        </div>  

        <div>
          <AvailableServices/>
          <TopRatedProfessionals/>
          <Categories/>
          <LatestListings/>
          <div className='py-10 mt-8 lg:mt-20'>
            <How variant="services" />
          </div>
          <div className='lg:mt-10'>
            <Testimonials />
          </div>
          <FooterCta/>
        </div>
      </div>
    </main>
    {/* } */}
    <footer>
      <Footer/>
    </footer>
  </div>
  )
}

export default page

export const metadata = {
  title: 'Service Providers - Find-a-Home FUTA',
  description: 'Connect with verified service providers for all your accommodation needs. From movers to maintenance—trusted professionals backed by student reviews.',
}