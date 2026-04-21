"use client"
import Image from "next/image"
import { FaLinkedin, FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";
import MouseFollowIcon from "./MouseFollowIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Logo = "/Logo/Logosvg.svg"

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-black33"> 
      {/* Main Footer Content */}
      <div className="w-[90%] md:w-[90%] mx-auto py-12 md:py-16">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="logo-container w-fit relative -left-8">
              <Image 
                src={Logo}
                alt="Find-a-Home FUTA Logo"
                width={240}
                height={110}
                className="object-contain"
              />
            </div>
            <p className="text-gray-600 text-base leading-relaxed pr-4">
              Experience stress-free living with our fully furnished, all-inclusive apartments, designed for students and professionals.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-primary flex-shrink-0" />
                <span className="text-sm">North Gate, Akure, Ondo State</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span className="text-sm">+234 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span className="text-sm">info@findahomefuta.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="/apartments" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    Apartments
                  </Link>
                </MouseFollowIcon>
              </li>
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="/decluttering" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    Declutter
                  </Link>
                </MouseFollowIcon>
              </li>
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="/service" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    Services
                  </Link>
                </MouseFollowIcon>
              </li>
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="/about" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    About Us
                  </Link>
                </MouseFollowIcon>
              </li>
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    Contact
                  </Link>
                </MouseFollowIcon>
              </li>
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="/ambassador" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    Student Ambassador
                  </Link>
                </MouseFollowIcon>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="lg:col-span-2">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="/privacy-policy" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </MouseFollowIcon>
              </li>
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="/terms-of-use" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    Terms of Use
                  </Link>
                </MouseFollowIcon>
              </li>
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="/faq" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    FAQ
                  </Link>
                </MouseFollowIcon>
              </li>
              <li>
                <MouseFollowIcon icon={GoArrowUpRight} iconSize={14}>
                  <Link href="#" className="text-gray-600 hover:text-primary transition-colors text-sm">
                    Testimonials
                  </Link>
                </MouseFollowIcon>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4">
            <h3 className="text-gray-900 font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for the latest listings and updates.
            </p>
            <form className="space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="h-11 bg-white"
                aria-label="Email address"
              />
              <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-gray-900 font-semibold text-sm mb-3">Follow Us</h4>
              <div className="flex items-center gap-3">
                <MouseFollowIcon icon={FaLinkedin} iconSize={18}>
                  <Link 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center group transition-all"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="text-primary group-hover:text-white transition-colors" size={18} />
                  </Link>
                </MouseFollowIcon>
                
                <MouseFollowIcon icon={FaWhatsapp} iconSize={18}>
                  <Link 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center group transition-all"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="text-primary group-hover:text-white transition-colors" size={18} />
                  </Link>
                </MouseFollowIcon>
                
                <MouseFollowIcon icon={FaInstagram} iconSize={18}>
                  <Link 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center group transition-all"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-primary group-hover:text-white transition-colors" size={18} />
                  </Link>
                </MouseFollowIcon>
                
                <MouseFollowIcon icon={FaFacebook} iconSize={18}>
                  <Link 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center group transition-all"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="text-primary group-hover:text-white transition-colors" size={18} />
                  </Link>
                </MouseFollowIcon>
                
                <MouseFollowIcon icon={FaTwitter} iconSize={18}>
                  <Link 
                    href="#" 
                    className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center group transition-all"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="text-primary group-hover:text-white transition-colors" size={18} />
                  </Link>
                </MouseFollowIcon>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black33 bg-white">
        <div className="w-[90%] md:w-5/6 mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Find-a-Home FUTA. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms-of-use" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer