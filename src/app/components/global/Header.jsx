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
import { useEffect, useState } from "react"
import { LuWarehouse } from "react-icons/lu";
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, ShoppingCart, User, X } from "lucide-react"

const Header = () => {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [isDesktopProductsOpen, setIsDesktopProductsOpen] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [signedInRoute, setSignedInRoute] = useState('/student')
  const [isHydrated, setIsHydrated] = useState(false)
  const desktopNavItemClass =
    "relative h-full flex items-center after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 focus-within:after:scale-x-100"

  useEffect(() => {
    setIsHydrated(true)

    const syncAuthState = () => {
      const hasAccessToken = localStorage.getItem('fhf-access-token') || localStorage.getItem('access_token')
      const hasRefreshToken = localStorage.getItem('fhf-refresh-token') || localStorage.getItem('refresh_token')
      setIsSignedIn(Boolean(hasAccessToken || hasRefreshToken))

      const storedUser = localStorage.getItem('currentUser')
      if (!storedUser) {
        setSignedInRoute('/student')
        return
      }

      try {
        const parsedUser = JSON.parse(storedUser)
        const userRole = String(parsedUser?.role || '').toLowerCase()
        if (userRole === 'admin' || userRole === 'support') {
          setSignedInRoute('/admin')
          return
        }
        if (userRole === 'agent') {
          setSignedInRoute('/agent')
          return
        }
        if (userRole === 'artisan') {
          setSignedInRoute('/artisan')
          return
        }
        setSignedInRoute('/student')
      } catch {
        setSignedInRoute('/student')
      }
    }

    syncAuthState()
    window.addEventListener('storage', syncAuthState)
    window.addEventListener('focus', syncAuthState)
    window.addEventListener('fhf-auth-cleared', syncAuthState)

    return () => {
      window.removeEventListener('storage', syncAuthState)
      window.removeEventListener('focus', syncAuthState)
      window.removeEventListener('fhf-auth-cleared', syncAuthState)
    }
  }, [])

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
      <div className="header-inner w-full flex justify-between items-center md:my-5 my-4 max-lg:-mt-6 md:flex-nowrap">
        <Link href={'/'} className='hidden md:block md:flex-shrink-0'>
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

        <div className="menu-outer w-auto hidden md:flex md:flex-1 md:justify-center">
          <ul className="menu-inner h-10 px-5 uppercase gap-x-7 text-sm font-medium tracking-wide cursor-pointer flex w-auto items-center justify-center">
            <Link href='/about'><li className={desktopNavItemClass}>About Us</li></Link>
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
            <Link href='/contact'><li className={desktopNavItemClass}>Contact</li></Link>
          </ul>
        </div>

        <div className="text-base md:flex items-center gap-x-2 w-fit hidden md:flex-shrink-0">
          {isSignedIn ? (
            <Link href={signedInRoute}>
              <Button
                type="button"
                aria-label="Open dashboard"
                className="bg-transparent shadow-none text-black flex items-center justify-center hover:bg-black10 h-10 w-10 rounded-full"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button className="bg-transparent shadow-none text-black flex 
              items-center gap-x-2 hover:bg-transparent group h-[3.375rem] w-fit uppercase">
                Login <GoArrowUpRight className="group-hover:animate-bounce" />
              </Button>
            </Link>
          )}
          {/* <ButtonGS content="Explore"/> */}
          {isHydrated ? (
            <>
              <WishlistPanel />
              <CartPanel />
              {isSignedIn ? <UserNotificationCenter /> : null}
            </>
          ) : (
            <>
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  className="relative rounded-full w-10 h-10 p-0 border-none shadow-none"
                  aria-label="Open wishlist"
                >
                  <Heart className="w-7 h-7" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  className="relative rounded-full w-10 h-10 p-0 border-none shadow-none"
                  aria-label="Open cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </Link>
            </>
          )}
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
        className={`md:hidden fixed inset-0 z-30 transition-opacity duration-300 ${active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <button
          type="button"
          aria-label="Close mobile menu overlay"
          className="absolute inset-0 bg-black/25"
          onClick={() => setActive(false)}
        />
        <div className={`absolute top-0 right-0 h-full w-screen max-w-none bg-white shadow-xl transition-transform duration-300 ${active ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="px-5 py-4 border-b border-black10 flex items-center justify-between">
            <Image src={Logo} alt="fhflogo" width={140} height={38} className="h-auto w-28" />
            <button
              type="button"
              onClick={() => setActive(false)}
              className="w-9 h-9 rounded-full border border-black10 flex items-center justify-center text-primary"
              aria-label="Close mobile menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="px-5 py-5">
            <ul className="space-y-2 text-sm font-semibold uppercase tracking-wide">
              <li>
                <Link href="/" onClick={() => setActive(false)} className="block rounded-lg px-3 py-3 hover:bg-black10">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={() => setActive(false)} className="block rounded-lg px-3 py-3 hover:bg-black10">
                  About
                </Link>
              </li>
              <li className="rounded-lg border border-black10">
                <button
                  type="button"
                  className="w-full px-3 py-3 flex items-center justify-between"
                  aria-expanded={isMobileProductsOpen}
                  aria-controls="mobile-products-menu"
                  onClick={() => setIsMobileProductsOpen((prev) => !prev)}
                >
                  <span>Products</span>
                  <FaAngleDown aria-hidden="true" className={`transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>
                <ul
                  id="mobile-products-menu"
                  className={`overflow-hidden transition-all duration-300 ${isMobileProductsOpen ? 'max-h-52 pb-2' : 'max-h-0'}`}
                >
                  <li>
                    <Link href="/apartments" onClick={() => setActive(false)} className="block px-5 py-2 text-xs text-gray-700 hover:text-primary">
                      Apartment Listings
                    </Link>
                  </li>
                  <li>
                    <Link href="/service" onClick={() => setActive(false)} className="block px-5 py-2 text-xs text-gray-700 hover:text-primary">
                      Hire for a service
                    </Link>
                  </li>
                  <li>
                    <Link href="/decluttering" onClick={() => setActive(false)} className="block px-5 py-2 text-xs text-gray-700 hover:text-primary">
                      Decluttering
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/#testimonials" onClick={(event) => handleTestimonialsClick(event, true)} className="block rounded-lg px-3 py-3 hover:bg-black10">
                  Testimonial
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => setActive(false)} className="block rounded-lg px-3 py-3 hover:bg-black10">
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Header