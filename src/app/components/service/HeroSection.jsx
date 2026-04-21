'use client'

import {ButtonGS, FindaHome} from "../global/Buttons/ButtonGS"
import { abhayaLibre } from '@/lib/fonts'
import { CiCircleChevDown } from "react-icons/ci";
import Link from "next/link"
import { motion } from "framer-motion"
import { motionTransition } from '@/lib/motion'

const HeroSection = ({
  showScrollDownButton = true,
  mainText = 'Verified Service Providers at Your Fingertips',
  subText = 'From movers to maintenance experts—access trusted professionals backed by real student reviews. Quality service, fair prices, guaranteed satisfaction.',
  primaryButtonText = 'LIST A SERVICE',
  secondaryButtonText = 'BROWSE CATEGORIES',
  primaryCta = '/auth',
  secondaryCta = '/service/all',
  scrollTarget = '#feat',
}) => {
  return (
    <div className="hero-outer w-full space-y-10 md:bg-transparent md:h-fit flex md:block justify-center items-center">
        <div className="hero-inner w-[90%] md:w-4/6 mx-auto text-center space-y-2 md:space-y-3 pt-3 md:pt-12 md:bg-none">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroTitle()}
              className={`${abhayaLibre.className} text-5xl px-3 md:px-10 md:text-[5.3rem] md:leading-[5.3rem] font-bold `}
            >
                {mainText}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroSubtitle()}
              className="md:text-2xl text-base md:leading-[2.1rem] text-graySec"
            >
                {subText}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroCta()}
              className="hero-btns flex pt-4 md:pt-2 gap-x-3 
            items-center w-[90%] mx-auto !justify-center"
            >
                <ButtonGS
                content={primaryButtonText}
                cta={primaryCta}
                />
                <FindaHome
                content={secondaryButtonText}
                cta={secondaryCta}
                />
            </motion.div>
            {showScrollDownButton &&
                <div className="md:hidden pt-20 flex justify-center items-center w-full">
                    <Link href={scrollTarget}>
                        <CiCircleChevDown 
                        className="animate-bounce text-5xl text-primaryOpacity"
                        />
                    </Link>
                </div>
            }
        </div>
    </div>
  )
}

export default HeroSection