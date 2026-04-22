import Hero from "../components/aboutPage/Hero"
import Mad from "../components/aboutPage/Mad"
import Mission from "../components/aboutPage/Mission"
import Revolution from "../components/aboutPage/Revolution"
import Team from "../components/aboutPage/Team"
import Values from "../components/aboutPage/Values"
import Footer from "../components/global/Footer"
import FooterCta from "../components/global/FooterCta"
import Header from "../components/global/Header"
import Testimonials from "../components/home/Testimonials"
import RevealOnScroll from "@/components/ui/reveal-on-scroll"
import { motionSectionDelay } from '@/lib/motion'


const page = () => {
  return (
    <div className="bg-white w-full overflow-x-hidden scroll-smooth transition-all ease-linear duration-500">
        <Header/>
        <main className="space-y-16 md:space-y-16 pt-3 md:pt-16">
            <Hero/>
            <RevealOnScroll><Revolution/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(3)}><Mission/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(5)}><Values/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(6)}><Team/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(7)}><Mad/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(8)}><Testimonials/></RevealOnScroll>
            <RevealOnScroll delay={motionSectionDelay(9)}><FooterCta/></RevealOnScroll>
        </main>
        <footer>
          <Footer/>
        </footer>
    </div>
  )
}

export default page

export const metadata = {
  title: 'About Us - Find-a-Home FUTA',
  description: 'Learn about Find-a-Home FUTA. Built by FUTA students, for FUTA students. Transforming student housing in Akure, one home at a time.',
}