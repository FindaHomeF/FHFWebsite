import React from 'react'
import { SeeAll } from '../global/Buttons/ButtonGS'
import ServiceCard from './service-card'
import { CardScroll, CardWrapper } from "@/components/ui/card-grid";

const LatestListings = () => {
  return (
    <div>
        <div className='mt-12 md:mt-16 w-[90%] max-w-full mx-auto space-y-7'>
            <div className='text-center space-y-3'>
                <h3 className='font-semibold text-center mt-12 md:mt-16 
                text-2xl md:text-4xl lg:text-[40px]'>
                Recently Added Professionals</h3>
                <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                  New service providers just joined our platform. Discover fresh talent ready to help with your accommodation needs.
                </p>
            </div>

            <CardScroll>
              {[...Array(4)].map((_, index) => (
                <CardWrapper key={index} minWidth="min-w-[280px] md:min-w-0">
                  <ServiceCard />
                </CardWrapper>
              ))}
            </CardScroll>

            <div className="mx-auto w-full flex justify-center items-center mt-5 md:mt-12">
                <SeeAll 
                    cta="/service/all"
                    filterType="recent"
                />
            </div>

        </div>
    </div>
  )
}

export default LatestListings