
import Decluttered from "../components/home/Decluttered";
import Features from "../components/home/Features";
import About from "../components/home/About";
import Footer from "../components/global/Footer";
import Header from "../components/global/Header";
import HeroSection from "../components/home/HeroSection";
import Listings from "../components/home/Listings";
import Testimonials from "../components/home/Testimonials";
import Unlock from "../components/home/Unlock";
import Steps from "../components/home/Steps";
import RevealOnScroll from "@/components/ui/reveal-on-scroll";
import { motionSectionDelay } from '@/lib/motion'



const HomePage = () => {
  // const [loading, setLoading] = useState(true);

  return (
      <div className="bg-white w-full overflow-x-hidden scroll-smooth transition-all ease-linear duration-500">
        {/* {loading?
          <Loader container={container} item={item} Logo={Logo}/>
          : */}
        <main className="space-y-16 md:space-y-16">
          <div className="space-y-10">
            <Header/>
            <HeroSection/>
          </div>
          <RevealOnScroll><About/></RevealOnScroll>
          <RevealOnScroll delay={motionSectionDelay(2.5)}><Features/></RevealOnScroll>
          <RevealOnScroll delay={motionSectionDelay(4)}><Listings/></RevealOnScroll>
          <RevealOnScroll delay={motionSectionDelay(5)}><Steps/></RevealOnScroll>
          <RevealOnScroll delay={motionSectionDelay(6)}><Decluttered/></RevealOnScroll>
          <RevealOnScroll delay={motionSectionDelay(7)}><Testimonials/></RevealOnScroll>
          <RevealOnScroll delay={motionSectionDelay(8)}><Unlock/></RevealOnScroll>
        </main>
        {/* } */}
        <footer>
          <Footer/>
        </footer>
      </div>
  )
}

export default HomePage