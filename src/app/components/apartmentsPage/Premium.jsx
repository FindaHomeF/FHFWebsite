"use client"
import ListingBox from "../global/ListingBox"
import { SeeAll } from "../global/Buttons/ButtonGS"
import { CardScroll, CardWrapper } from "@/components/ui/card-grid";

const List1 = '/listing1.png';
const List2 = '/listing2.png';
const List3 = '/listing3.png';
const List4 = '/listing4.png';

const Premium = () => {
  return (
    <div className="full bg-primary py-16">
        <div className="mx-auto w-[90%] max-w-full md:w-5/6 space-y-7 text-center">
            <div>
                <h3 className="section-head text-center text-white">Premium Student Living</h3>
                <p className="text-lighterGray text-base md:text-lg mt-2">
                  Top-rated apartments designed for students who want the best. Fully furnished, modern amenities, and prime locations.
                </p>
            </div>
            <CardScroll>
                {[List1, List2, List3, List4].map((list, index)=>(
                    <CardWrapper key={index} minWidth="min-w-[280px] md:min-w-0">
                        <ListingBox image={list} propertyId={`${index + 20}`} itemIndex={index + 700} />
                    </CardWrapper>
                ))}
            </CardScroll>
            <div className="mx-auto w-full flex justify-center items-center mt-5 md:mt-12">
                <SeeAll 
                    border="white"
                    cta="/apartments/all"
                    filterType="featured"
                />
            </div>
        </div>

    </div>
  )
}

export default Premium