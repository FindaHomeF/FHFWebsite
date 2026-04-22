"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { MOTION_DELAY, motionTransition } from '@/lib/motion'

const CounterNumber = ({ end, duration = 2000, suffix = "+" }) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef(null)

  useEffect(() => {
    const animateCount = () => {
      const startTime = Date.now()
      const startValue = 0

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

      const updateCount = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        const easedProgress = easeOutQuart(progress)
        const currentCount = Math.floor(startValue + (end - startValue) * easedProgress)
        
        setCount(currentCount)

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        } else {
          setCount(end)
        }
      }

      requestAnimationFrame(updateCount)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateCount()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [hasAnimated, duration, end])

  return (
    <h3 ref={counterRef} className="text-2xl md:text-4xl font-bold text-primary">
      {count}{suffix}
    </h3>
  )
}

const About = () => {
  return (
    <div className="w-full">
        <div className="w-[90%] md:w-5/6 mx-auto space-y-7" id="transform">
            <div className="md:flex justify-between gap-x-20 space-y-2">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={motionTransition.inView()}
                  className="section-head md:w-3/6"
                >
                    Revolutionizing Student Housing at FUTA
                </motion.h3>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={motionTransition.inView(MOTION_DELAY.block1)}
                  className="section-para md:text-base md:w-3/6 text-gray"
                >
                    We've streamlined the entire off-campus living experience into one powerful platform. From finding verified accommodations to connecting with trusted service providers and discovering affordable essentials—everything you need is right here.
                </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={motionTransition.inView(MOTION_DELAY.block2)}
            >
                <div className="flex justify-between max-w-full gap-x-3 items-stretch flex-shrink-0">
                    <div className="md:border-l-2 border-l border-l-black space-y-1 px-3 md:px-5 hidden md:block md:w-2/6 pt-3 hover:border-l-primary transition-colors duration-300">
                        <CounterNumber end={10} duration={2000} suffix="+" />
                        <h6 className="uppercase font-semibold text-xs md:text-base text-gray">ITEMS SOLD</h6>
                    </div>
                    <div className="md:border-l-2 border-l border-l-black space-y-1 px-3 md:px-5 w-3/6 md:w-2/6 pt-3 hover:border-l-primary transition-colors duration-300">
                        <CounterNumber end={30} duration={2200} suffix="+" />
                        <h6 className="uppercase font-semibold text-xs md:text-base text-gray">Trusted Agents, Landlords, and Service Providers</h6>
                    </div>
                    <div className="md:border-l-2 border-l border-l-black space-y-1 px-3 md:px-5 w-3/6 md:w-2/6 pt-3 hover:border-l-primary transition-colors duration-300">
                        <CounterNumber end={200} duration={2500} suffix="+" />
                        <h6 className="uppercase font-semibold text-xs md:text-base text-gray">Students Provided with Accommodation Options</h6>
                    </div>
                </div>
            </motion.div>
            
        </div>

    </div>
  )
}

export default About