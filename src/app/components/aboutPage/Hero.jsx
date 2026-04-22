
"use client"
import { motion } from "framer-motion"
import { MOTION_DELAY, motionTransition } from '@/lib/motion'

const Hero = () => {
  return (
    <div className="w-full">
        <div className="w-[90%] mx-auto md:w-4/6 text-center space-y-4 mt-10 md:mt-0">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroTitle()}
              className="hero-head px-5 md:px-10 leading-normal"
            >
              Transforming Student Housing in Akure, One Home at a Time
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.inView(MOTION_DELAY.block1)}
              className="hero-para text-lg md:text-xl"
            >
              Built by FUTA students, for FUTA students. We understand your challenges because we've lived them.
            </motion.p>
        </div>
    </div>
  )
}

export default Hero