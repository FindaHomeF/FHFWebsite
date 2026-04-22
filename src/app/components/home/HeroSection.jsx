'use client'

import Image from "next/image"
import {ButtonGS, FindaHome} from "../global/Buttons/ButtonGS"
import { abhayaLibre } from '@/lib/fonts'
import { motion } from "framer-motion"
import { motionTransition } from '@/lib/motion'

const Intro = '/hero-image.jpeg'
const PlayBtn = '/play.svg'
import { CiCircleChevDown } from "react-icons/ci";
import Link from "next/link"

const HeroSection = () => {
  return (
    <div className="hero-outer w-full space-y-10 md:bg-transparent md:h-fit h-[85vh] flex md:block justify-center items-center">
        <div className="hero-inner w-[90%] md:w-4/6 mx-auto text-center space-y-2 md:space-y-3 pt-3 md:pt-12 md:bg-none">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroTitle()}
              className={`${abhayaLibre.className} text-5xl md:text-[5.3rem] md:leading-[5.3rem] font-bold `}
            >
              Your Perfect Student Home Awaits
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroSubtitle()}
              className="md:text-2xl text-base md:leading-[2.1rem] text-graySec"
            >
                The trusted platform connecting FUTA students with verified properties, reliable service providers, and affordable essentials. Find your ideal accommodation in minutes, not weeks.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition.heroCta()}
              className="hero-btns flex flex-col md:flex-row gap-y-3 pt-4 md:pt-2 gap-x-3 items-center w-full !justify-center"
            >
                <ButtonGS cta="/apartments"/>
                <FindaHome/>
            </motion.div>
            <div className="md:hidden pt-20 flex justify-center items-center w-full">
                <Link href="#transform"><CiCircleChevDown className="animate-bounce text-5xl text-primaryOpacity"/></Link>
            </div>
        </div>

        <div className="hero-video-outer w-5/6 mx-auto hidden md:block">
            <div className="relative hero-video w-full overflow-hidden rounded-2xl h-[40rem]">
                <Image
                    src={Intro}
                    alt={'FHF intro welcoming students to their accomodation solution landing page'}
                    width={1280}
                    height={640}
                    className='w-full h-full object-cover'
                />
                <div className="">
                    <Image
                        src={PlayBtn}
                        height={80}
                        width={100}
                        alt='play-btn'
                        className="object-cover absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default HeroSection