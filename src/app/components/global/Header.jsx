'use client'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import WishlistPanel from "./WishlistPanel"
import CartPanel from "./CartPanel"
import UserNotificationCenter from "./UserNotificationCenter"

const Logo = "/Logo/Logosvg.svg"
const LogoM = "/fhfmenu2.png"
import {ButtonGS} from "./Buttons/ButtonGS"
import { FaAngleDown } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import { FaWarehouse } from "react-icons/fa";
import { useState } from "react"
import { LuWarehouse } from "react-icons/lu";
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Header = () => {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [isDesktopProductsOpen, setIsDesktopProductsOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  const desktopNavItemClass =
    "relative h-full flex items-center after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 focus-within:after:scale-x-100"

  const handleTestimonialsClick = (event, closeMobileMenu = false) => {
    if (closeMobileMenu) {
      setActive(false)
    }

    if (pathname !== '/') {
      return
    }

    const testimonialsSection = document.getElementById('testimonials')
    if (!testimonialsSection) {
      return
    }

    event.preventDefault()
    const yOffset = 96
    const targetTop = testimonialsSection.getBoundingClientRect().top + window.scrollY - yOffset
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    })
    window.history.replaceState(null, '', '#testimonials')
  }

  return (
    <div className="header-outer w-[95%] mx-auto font-medium -mb-10 md:mb-0 relative">
      <div className="header-inner w-full flex justify-between 
      items-center md:my-5 my-4 max-lg:-mt-6">
        <Link href={'/'} className='w-1/6 hidden md:block'>
          <motion.div className="logo-container w-full " layoutId='logo-animate'>
            <Image src={Logo}
            alt="fhflogo"
            width={200}
            height={54}
            />
          </motion.div>
        </Link>

        <Link href={'/'}>
          <div className="overflow-hidden relative -left-5 md:hidden">
            <Image src={LogoM}
            alt="fhflogo"
            width={200}
            height={54}
            className="w-32 object-cover h-auto"
            />
          </div>
        </Link>

        <div className="menu-outer w-auto hidden md:block">
          <ul className="menu-inner h-10 px-5  uppercase gap-x-7 text-sm font-medium tracking-wide cursor-pointer flex w-full items-center">
            <Link href='/about'><li className={desktopNavItemClass}>About Us</li></Link>
            <Link href='/contact'><li className={desktopNavItemClass}>Contact</li></Link>
            <li
              className={`z-10 relative group transition-all ease-linear duration-300 ${desktopNavItemClass} ${isDesktopProductsOpen ? 'after:scale-x-100' : ''}`}
              onMouseEnter={() => setIsDesktopProductsOpen(true)}
              onMouseLeave={() => setIsDesktopProductsOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-x-2 relative min-h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-expanded={isDesktopProductsOpen}
                aria-controls="desktop-products-menu"
                onClick={() => setIsDesktopProductsOpen((prev) => !prev)}
                onBlur={(event) => {
                  if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) {
                    setIsDesktopProductsOpen(false)
                  }
                }}
              >
                PRODUCTS <FaAngleDown aria-hidden="true" />
              </button>
              <ul
                id="desktop-products-menu"
                className={`absolute left-0 top-full transition-all ease-linear duration-300 text-white bg-tertiary space-y-2 border-t-2 border-t-secondary w-fit px-3 py-2 text-nowrap ${
                  isDesktopProductsOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto opacity-0 pointer-events-none'
                }`}
              >
                <Link 
                className="cursor-pointer"
                href={'/apartments'}><li >Apartment Listings</li></Link>
                <Link 
                className="cursor-pointer"
                href={'/service'} ><li className="mt-2">Hire for a service</li></Link>
                <Link 
                className="cursor-pointer"
                href={'/decluttering'} ><li className="mt-2">decluttering</li></Link>
              </ul>
            </li>
            <Link href={'/#testimonials'} onClick={handleTestimonialsClick}><li className={desktopNavItemClass}>Testimonial</li></Link>
          </ul>
        </div>

        <div className="text-base md:flex items-center gap-x-2 w-fit hidden ">
          <Link href="/auth">
            <Button className="bg-transparent shadow-none text-black flex 
            items-center gap-x-2 hover:bg-transparent group h-[3.375rem] w-fit uppercase">
              Login <GoArrowUpRight className="group-hover:animate-bounce" />
            </Button>
          </Link>
          {/* <ButtonGS content="Explore"/> */}
          <WishlistPanel />
          <CartPanel />
          <UserNotificationCenter />
        </div>

        <button
          type="button"
          className="md:hidden z-20 text-primary"
          onClick={() => setActive(!active)}
          aria-label={active ? 'Close mobile menu' : 'Open mobile menu'}
          aria-expanded={active}
          aria-controls="mobile-nav-menu"
        >
          {active?<LuWarehouse size={30}/>:<FaWarehouse size={30} />}
        </button>
      </div>

      <div
        id="mobile-nav-menu"
        className={`mobile-menu fixed w-screen bg-white top-0 ${active?"left-0":"left-full"} h-screen z-10 transition-all ease-linear duration-300`}
      >
        <div className="mobile-menu-inner py-16 w-5/6 space-y-10 mx-auto h-full flex flex-col justify-center items-center">

          <div className="menu-outer w-full h-full text-center md:hidden">
            <ul className="menu-inner font-medium uppercase flex flex-col h-full justify-evenly items-center gap-y-7">
              <Link href={'/'} onClick={() => setActive(false)}>
                <li>Home</li>
              </Link>
              <Link href={'/about'} onClick={() => setActive(false)}>
                <li>About</li>
              </Link>
              <li className="z-10 relative group">
                <button
                  type="button"
                  className="flex items-center gap-x-2"
                  aria-expanded={isMobileProductsOpen}
                  aria-controls="mobile-products-menu"
                  onClick={() => setIsMobileProductsOpen((prev) => !prev)}
                >
                  PRODUCTS <FaAngleDown aria-hidden="true" />
                </button>
                <ul
                  id="mobile-products-menu"
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg transition-all space-y-2 py-2 min-w-[180px] ${
                    isMobileProductsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <Link href={'/apartments'} onClick={() => setActive(false)}>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Apartment Listings</li>
                  </Link>
                  <Link href={'/service'} onClick={() => setActive(false)}>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Hire for a service</li>
                  </Link>
                  <Link href={'/decluttering'} onClick={() => setActive(false)}>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Decluttering</li>
                  </Link>
                </ul>
              </li>
              <Link href={'/#testimonials'} onClick={(event) => handleTestimonialsClick(event, true)}><li>Testimonial</li></Link>
              <Link href={'/contact'} onClick={() => setActive(false)}><li>Contact Us</li></Link>
            </ul>
          </div>

          <div className="logo-container w-full flex justify-center md:hidden">
            <Image src={Logo}
              alt="fhflogo"
              width={200}
              height={54}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Header