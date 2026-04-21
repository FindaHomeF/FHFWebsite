"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { motionTransition } from '@/lib/motion'

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: "Taiwo Omotola",
    role: "Computer Science Student",
    image: "/testimony.png",
    rating: 5,
    text: "Find-a-Home made my accommodation search so easy! The platform is user-friendly and I found the perfect apartment near campus within days. The verified listings gave me peace of mind.",
  },
  {
    id: 2,
    name: "Adebayo Johnson",
    role: "Engineering Student",
    image: "/favour.PNG",
    rating: 5,
    text: "I was able to declutter my old furniture and make some extra cash through this platform. The process was seamless and the buyers were genuine. Highly recommended!",
  },
  {
    id: 3,
    name: "Chioma Nwankwo",
    role: "Medical Student",
    image: "/babs.PNG",
    rating: 5,
    text: "The service provider feature is brilliant! I connected with a reliable carpenter who helped furnish my new apartment. Professional, affordable, and trustworthy.",
  },
  {
    id: 4,
    name: "Olumide Peters",
    role: "Postgraduate Student",
    image: "/alex.PNG",
    rating: 5,
    text: "As an international student, finding accommodation was stressful. Find-a-Home simplified everything. The detailed listings and responsive agents made my transition smooth.",
  },
  {
    id: 5,
    name: "Blessing Okafor",
    role: "Architecture Student",
    image: "/demilade.PNG",
    rating: 4,
    text: "Great platform for student housing! Found a comfortable apartment with amazing roommates. The price comparison feature helped me stay within my budget.",
  },
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [direction, setDirection] = useState(0)

  // Auto-slide functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000) // Change slide every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isHovered])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const currentTestimonial = testimonials[currentIndex]

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-secondary/5" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative w-[90%] lg:w-5/6 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-5 md:mb-7 scroll-mt-24" id="testimonials">
          <div className="inline-block mb-4">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            What Our Students Say
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Real experiences from students who found their perfect accommodation
          </p>
        </div>

        {/* Testimonial Slider Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Content Area with Fixed Height */}
          <div className="relative min-h-[500px] md:min-h-[400px] flex items-center">
            {/* Navigation Buttons - Fixed Position */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="relative h-full w-full max-w-6xl mx-auto px-4">
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-auto
                    w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-lg 
                    flex items-center justify-center
                    text-primary hover:bg-primary hover:text-white
                    transition-all duration-300 hover:scale-110
                    border border-gray-100"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={28} strokeWidth={2.5} />
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-auto
                    w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-lg 
                    flex items-center justify-center
                    text-primary hover:bg-primary hover:text-white
                    transition-all duration-300 hover:scale-110
                    border border-gray-100"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={28} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Testimonial Cards */}
            <div className="w-full px-4 md:px-16 lg:px-20">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={motionTransition.testimonialSlide}
                  className="relative"
                >
                  {/* Card */}
                  <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-8
                    border border-black33 backdrop-blur-sm max-w-4xl mx-auto">
                    
                    {/* Quote Mark */}
                    <div className="absolute -top-6 left-8 md:left-12 w-12 h-12 md:w-16 md:h-16 
                      bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl md:text-4xl text-white font-serif">"</span>
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center items-center gap-1.5 mb-8 pt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={24}
                          className={`transition-all duration-300 ${
                            i < currentTestimonial.rating
                              ? "fill-secondary text-secondary"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-center text-gray-700 text-lg md:text-xl lg:text-2xl 
                      leading-relaxed mb-10 md:mb-12 font-light">
                      {currentTestimonial.text}
                    </p>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8 rounded-full" />

                    {/* Author */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden 
                          border-4 border-white shadow-lg ring-4 ring-primary/10">
                                <Image
                            src={currentTestimonial.image}
                            alt={currentTestimonial.name}
                            fill
                                    className="object-cover"
                                />
                            </div>
                                </div>
                      <div className="text-center">
                        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-sm md:text-base text-gray-500 font-medium">
                          {currentTestimonial.role}
                        </p>
                        </div>
                    </div>
                </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center gap-2.5 mt-5 md:mt-7">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-10 h-2.5 rounded-full"
                    : "bg-gray-300 w-2.5 h-2.5 rounded-full hover:bg-gray-400 hover:w-6"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

        </div>
    </div>
    </section>
  )
}

export default Testimonials