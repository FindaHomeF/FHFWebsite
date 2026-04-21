'use client'

import { GoVerified } from "react-icons/go";
import { LuMessageSquareLock } from "react-icons/lu";
import { FaRegHandshake } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { GoArrowUpRight } from "react-icons/go";
import { useState } from "react";

const CONTENT_BY_VARIANT = {
  marketplace: {
    title: "How Our Marketplace Works",
    description:
      "Simple, safe, and student-friendly. Whether you're buying essentials for your new place or selling items you no longer need, our secure platform makes it easy. Connect with fellow FUTA students, negotiate fairly, and complete transactions with confidence.",
    primaryLabel: "For Buyers",
    secondaryLabel: "For Sellers",
    primarySteps: [
      {
        icon: <GoVerified />,
        head: "Browse Quality Items",
        sub: "Explore verified listings with detailed photos and honest descriptions from fellow students.",
      },
      {
        icon: <LuMessageSquareLock />,
        head: "Connect Securely",
        sub: "Message sellers safely through our platform. Negotiate prices and arrange meetups.",
      },
      {
        icon: <FaRegHandshake />,
        head: "Complete Your Purchase",
        sub: "Meet in safe locations, inspect items, and complete transactions with peace of mind.",
      },
    ],
    primaryCta: "Start Shopping",
    secondaryCta: "List an Item",
  },
  services: {
    title: "How Services Work for Students and Providers",
    description:
      "Students can quickly find trusted professionals for accommodation needs, while service providers can showcase their expertise and get real jobs from verified users on campus.",
    primaryLabel: "For Students",
    secondaryLabel: "For Service Providers",
    primarySteps: [
      {
        icon: <GoVerified />,
        head: "Find Verified Professionals",
        sub: "Browse trusted providers by category, ratings, and availability to pick the right fit quickly.",
      },
      {
        icon: <LuMessageSquareLock />,
        head: "Request and Confirm",
        sub: "Contact providers, agree on scope and pricing, then schedule with clear expectations.",
      },
      {
        icon: <FaRegHandshake />,
        head: "Get the Job Done",
        sub: "Receive the service, confirm completion, and leave a review to help other students choose better.",
      },
    ],
    secondarySteps: [
      {
        icon: <GoVerified />,
        head: "Create a Strong Profile",
        sub: "List your skills, service areas, and pricing so students can discover and trust your offering.",
      },
      {
        icon: <LuMessageSquareLock />,
        head: "Respond and Manage Requests",
        sub: "Receive student requests, clarify details, and confirm bookings through the platform workflow.",
      },
      {
        icon: <FaRegHandshake />,
        head: "Deliver and Grow",
        sub: "Provide quality work, earn ratings, and build repeat demand from student referrals and reviews.",
      },
    ],
    primaryCta: "Find a Provider",
    secondaryCta: "List a Service",
  },
}

const How = ({ variant = "marketplace" }) => {
    const [isPrimaryAudience, setIsPrimaryAudience] = useState(true)
    const content = CONTENT_BY_VARIANT[variant] || CONTENT_BY_VARIANT.marketplace
    const secondarySteps = content.secondarySteps || content.primarySteps
    const activeSteps = isPrimaryAudience ? content.primarySteps : secondarySteps


  return (
    <div className="full">
        <div className="mx-auto w-[90%] md:w-5/6 space-y-7 pb-10">
            <div className="">
                <div className='text-center space-y-3'>
                    <h3 className="section-head">{content.title}</h3>
                    <p className='section-para mx-auto lg:w-4/6 pb-3'>
                        {content.description}
                    </p>
                    
                    <div className="h-12 lg:w-[30%] mt-3 mx-auto flex  
                    justify-center gap-x-5 text-base font-semibold 
                    transition-all ease-in-out duration-300">
                        <Button className={`h-full text-primary bg-lightGray 
                        capitalize rounded-full w-3/6 hover:text-white 
                        transition-all ease-in-out duration-300 cursor-pointer
                        ${isPrimaryAudience && 'bg-secondary text-white'}`} onClick={()=>setIsPrimaryAudience(true)}>
                            {content.primaryLabel}</Button>
                        <Button className={`h-full text-primary bg-lightGray 
                        capitalize rounded-full w-3/6 hover:bg-darkBlue/10 
                        transition-all ease-in-out duration-300 cursor-pointer
                        ${!isPrimaryAudience && 'bg-secondary'}`} onClick={()=>setIsPrimaryAudience(false)}>
                            {content.secondaryLabel}</Button>
                    </div>
                </div>

                
                <div className='w-full my-14'>
                    <div className="grid grid-cols-1 lg:grid-cols-3 max-lg:gap-7 gap-x-10 transition-all ease-in-out duration-300">
                        {activeSteps.map((how, index)=>(
                            <div className={`space-y-3 flex flex-col justify-start items-center text-center ${isPrimaryAudience ? 'text-black' : 'text-secondary'}`} key={index}>
                                <h6 className={`${isPrimaryAudience ? 'text-primary' : 'text-secondary'} text-2xl md:text-4xl`}>{how.icon}</h6>
                                <div className="space-y-1 md:space-y-2">
                                    <h5 className="text-base md:text-xl font-medium">{how.head}</h5>
                                    <p className="text-sm font-normal">{how.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-12 lg:w-2/6 mx-auto flex justify-center 
                gap-x-5 text-base font-semibold">
                    <Button className="bg-primary h-full text-white hover:bg-primary/70 
                    transition-all duration-300 ease-in-out
                    rounded-full w-3/6 flex items-center gap-x-2">{content.primaryCta}
                        <span className="bg-white h-5 w-5 rounded-full 
                        flex justify-center items-center">
                        <GoArrowUpRight className="text-xs text-primary" /></span>
                    </Button>

                    <Button className="bg-transparent h-full border border-primary text-primary
                     hover:bg-primary hover:text-white transition-all duration-300 ease-in-out rounded-full w-3/6">{content.secondaryCta}</Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default How