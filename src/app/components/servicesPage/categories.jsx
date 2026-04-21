"use client"
import React, { useState } from 'react'
import { SeeAll } from '../global/Buttons/ButtonGS'
import ServiceCard from './service-card'
import { Button } from '@/components/ui/button'
import { CardScroll, CardWrapper } from "@/components/ui/card-grid";

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState("Cleaning Services");

  const categories = [
    "Cleaning Services",
    "Moving & Transportation",
    "Electrical Work",
    "Plumbing Services",
    "Carpentry & Furniture",
    "Interior Decoration",
    "Others"
  ];

  return (
    <div>
        <div className='mt-12 w-[90%] max-w-full mx-auto space-y-7'>
          <div className=''>
            <h3 className='font-semibold text-center mt-12 md:mt-16 
            text-2xl md:text-4xl lg:text-[40px]'>
            Categories
            </h3>

            <div className="overflow-x-auto">
              <div className="mt-8 flex flex-nowrap justify-center items-center gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`cat-btn ${
                      activeCategory === category
                        ? "text-white !bg-secondary"
                        : ""
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
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
              filterType="category"
              filterValue={activeCategory}
            />
          </div>
        </div>
    </div>
  )
}

export default Categories