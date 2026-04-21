"use client"
import DeclutteredBox from "../global/DeclutteredBox"
import { SeeAll } from "../global/Buttons/ButtonGS"
import { CardScroll, CardWrapper } from "@/components/ui/card-grid";

const Declutter = '/declutter1.png'

const Featured = () => {
  return (
    <div className="full bg-primary py-16">
        <div className="mx-auto w-[90%] max-w-full md:w-5/6 space-y-7 text-center">
            <div>
                <h3 className="section-head text-center text-white">Hot Deals This Week</h3>
                <p className="text-white/80 text-base text-lighterGray md:text-lg mt-2">
                  Top picks from our marketplace. Quality items at unbeatable student prices.
                </p>
            </div>
            <CardScroll>
                {[...Array(4)].map((_, index)=>(
                    <CardWrapper key={index} minWidth="min-w-[280px] md:min-w-0">
                        <DeclutteredBox image={Declutter} itemIndex={index + 100} />
                    </CardWrapper>
                ))}
            </CardScroll>
            <div className="mx-auto w-full flex justify-center items-center mt-5 md:mt-12">
                <SeeAll 
                    whiteBorder 
                    cta="/decluttering/all"
                    filterType="featured"
                />
            </div>
        </div>

    </div>
  )
}

export default Featured