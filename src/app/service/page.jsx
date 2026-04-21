import React from 'react'
import Header from '../components/global/Header'
import Hero from '../components/global/Hero'
import Footer from '../components/global/Footer'
import AvailableServices from '../components/servicesPage/available-services'
import TopRatedProfessionals from '../components/servicesPage/top-rated-professionals'
import Categories from '../components/servicesPage/categories'
import LatestListings from '../components/servicesPage/latest-listings'
import How from '../components/decluttering/How'
import Testimonials from '../components/home/Testimonials'
import FooterCta from '../components/global/FooterCta'
import RevealOnScroll from '@/components/ui/reveal-on-scroll'
import { motionSectionDelay } from '@/lib/motion'

const page = () => {
  return (
    <div className="bg-white w-full overflow-x-hidden scroll-smooth transition-all ease-linear duration-500">
        <Header/>
        <main className="space-y-16 md:space-y-20 pt-3 md:pt-16">
          <Hero
            placeholder={'Search providers by trade, name, or location...'}
            mainText={'Verified Service Providers at Your Fingertips'}
            subText={'From movers to maintenance experts—access trusted professionals backed by real student reviews. Quality service, fair prices, guaranteed satisfaction.'}
            btn1={'LIST A SERVICE'}
            btn2={'BROWSE CATEGORIES'}
            cta1={'/auth'}
            cta2={'/service/all'}
          />
          <div>
            <RevealOnScroll><AvailableServices/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(3)}><TopRatedProfessionals/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(5)}><Categories/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(6)}><LatestListings/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(7)}>
              <div className='py-10 mt-8 lg:mt-20'>
                <How variant="services" />
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(8)}>
              <div className='lg:mt-10'>
                <Testimonials />
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(9)}><FooterCta/></RevealOnScroll>
          </div>
        </main>
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