import Header from '@/app/components/global/Header'
import Footer from '@/app/components/global/Footer'
import FooterCta from '@/app/components/global/FooterCta'
import ContactHero from './components/ContactHero'
import ContactForm from './components/ContactForm'
import ContactInfo from './components/ContactInfo'
import ContactMap from './components/ContactMap'
import RevealOnScroll from '@/components/ui/reveal-on-scroll'
import { motionSectionDelay } from '@/lib/motion'

const ContactPage = () => {
  return (
    <div className="bg-white w-full overflow-x-hidden 
        scroll-smooth transition-all ease-linear duration-500">
        <main>
          <Header/>
          <RevealOnScroll><ContactHero /></RevealOnScroll>
          
          <div className="w-[90%] md:w-5/6 mx-auto py-16 space-y-16">
            {/* Contact Form and Info */}
            <RevealOnScroll delay={motionSectionDelay(3)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                <ContactForm />
                <ContactInfo />
              </div>
            </RevealOnScroll>

            {/* Map */}
            <RevealOnScroll delay={motionSectionDelay(5)}><ContactMap /></RevealOnScroll>
          </div>

          <RevealOnScroll delay={motionSectionDelay(7)}><FooterCta/></RevealOnScroll>
        </main>
        <footer>
          <Footer/>
        </footer>
    </div>
  )
}

export default ContactPage

// Generate metadata
export const metadata = {
  title: 'Contact Us - Find-a-Home FUTA',
  description: 'Get in touch with Find-a-Home FUTA. We are here to help you find your perfect student accommodation.',
}

