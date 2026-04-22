'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import Filter from './Filter'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { motionTransition } from '@/lib/motion'

const Hero = ({placeholder, mainText, subText, btn1, btn2, cta1='#', cta2='#'}) => {
  return (
    <div className="w-full">
        <div className="w-[90%] mx-auto md:w-4/6 text-center space-y-3 md:space-y-5 mt-10 md:mt-0">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroTitle()}
              className="hero-head px-3 md:px-10"
            >
              {mainText}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroSubtitle()}
              className="hero-para text-graySec pb-3 md:pb-0"
            >
              {subText}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroCta()}
              className="hero-btns h-10 md:h-12 w-[90%] md:w-3/6 mx-auto flex gap-x-3"
            >
                <Button className="hero-btn bg-primary text-white hover:bg-secondary "><Link href={cta1}>{btn1}</Link></Button>
                <Button className="hero-btn bg-transparent border border-primary 
                text-primary hover:bg-blue-700/10"><Link href={cta2}>{btn2}</Link></Button>
            </motion.div>

            <div>
                <Filter placeholder={placeholder}/>
            </div>

            
        </div>
    </div>
  )
}

export default Hero