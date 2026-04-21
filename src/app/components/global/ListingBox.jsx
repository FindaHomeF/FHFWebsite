"use client"
import { useState } from "react"
import Image from "next/image"
import { HiOutlineMapPin } from "react-icons/hi2";
import { MdBed } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { FaBath } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { BsHouseAddFill } from "react-icons/bs";
import { BsHouse } from "react-icons/bs";
import { FaWalking } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa6";
import { MdCall } from "react-icons/md";
import { Users } from "lucide-react";
import Link from "next/link";
import Wishlist from "./Buttons/WishlistBtn";
import ShareButton from "./Buttons/ShareButton";
import FloatingChat from "@/app/sp/components/FloatingChat";
import { MOTION_INTERACTION_CLASS } from '@/lib/motion'

const ListingBox = ({image, propertyId = "1", item = null, itemIndex = 0}) => {
  const [showChat, setShowChat] = useState(false)
  
  // Create unique default item based on propertyId and index
  const defaultItem = {
    id: `default-${propertyId}-${itemIndex}`,
    propertyId: propertyId,
    title: `Property ${propertyId}`,
    price: 120000,
    category: "Single Rooms",
    location: "North Gate, Akure",
    image: image,
    roommatesNeeded: null,
    currentRoommates: null,
    totalCapacity: null
  };

  const displayItem = item || defaultItem;
  const isPremium = displayItem.featured || displayItem.premium;
  const inventory = displayItem.inventory !== undefined ? displayItem.inventory : null;
  const isLowInventory = inventory !== null && inventory <= 3 && inventory > 0;
  const isOutOfStock = inventory !== null && inventory === 0;

  return (
    <div className={`listings-box w-full shadow shadow-black10 rounded-xl bg-white overflow-visible border group border-black33 transition-all ${MOTION_INTERACTION_CLASS} hover:-translate-y-1 hover:shadow-lg ${isOutOfStock ? 'opacity-60' : ''}`}>
        <div className="listing-image h-[10rem] md:h-[13.75rem] relative overflow-hidden rounded-t-xl">
            <Link
            href={`/sp/${displayItem.propertyId}`}
            >
                <Image
                    src={displayItem.image || image}
                    alt="apartment main media"
                    height={300}    
                    width={300}
                    className={`object-fit h-full w-full relative group-hover:scale-105 transition-all ${MOTION_INTERACTION_CLASS}`}
                />
            </Link>
            <Wishlist item={displayItem} itemType="apartment" />
            {isPremium && (
              <Button className="absolute top-2 left-2 h-5 md:h-6 px-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-xs font-bold border-2 border-white shadow-lg z-10">
                ⭐ Premium
              </Button>
            )}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between items-center px-2 z-10">
              <Button className="h-4 md:h-6 px-2 bg-secondary rounded-full text-xs font-medium">Verified</Button>
              {isLowInventory && (
                <Button className="h-4 md:h-6 px-2 bg-secondary border border-white text-white rounded-full text-xs font-medium shadow-lg">
                  Only {inventory} left
                </Button>
              )}
              {isOutOfStock && (
                <Button className="h-4 md:h-6 px-2 bg-red-500 text-white rounded-full text-xs font-medium shadow-lg">
                  Out of Stock
                </Button>
              )}
            </div>
        </div>

        <div className="listing-info rounded-b-xl bg-white p-3">
            <div className="info-top w-full">
                <div className="md:w-5/6 mx-auto text-center">
                <Link
                href={`/sp/${propertyId}`}
                >
                    <h5 className="text-black uppercase line-clamp-2 text-base md:text-lg font-bold truncate">
                    Marble Lodge
                    </h5>
                </Link>
                   
                    <div className="flex w-full gap-x-1">
                        <HiOutlineMapPin className="text-base min-w-1/6"/>
                        <p className="text-xs text-tertiary truncate">8, Deeper Life, NorthGate, Akure</p>
                    </div>
                </div>
                <h4 className="price w-5/6 mx-auto text-center text-secondary text-base md:text-text-lg font-semibold">NGN 120,000</h4>
                
            </div>

            <div className="info-bottom my-3 grid grid-cols-3 md:text-base text-lightSec text-sm">
                <div className=" border-r-2  flex justify-center items-center flex-col">
                    <div className="flex items-center gap-x-1 md:gap-x-2 ">2<MdBed className="text-sm md:text-xl text-tertiary"/> </div>
                    <h6 className=" text-xs">Bedrooms</h6>
                </div>
                <div className=" border-r-2 flex justify-center items-center flex-col">
                    <div className="flex items-center gap-x-1 md:gap-x-2 ">10h<FaRegLightbulb  className="text-sm md:text-xl text-tertiary"/> </div>
                    <h6 className=" text-xs">Electricity</h6>
                </div>
                <div>
                    <div className=" flex justify-center items-center flex-col">
                        <div className="flex items-center gap-x-1 md:gap-x-2">1<FaBath className="text-sm md:text-xl text-tertiary"/> </div>
                        <h6 className=" text-xs">Bathroom</h6>
                    </div>
                </div>
            </div>

            <div className="space-y-2 text-lightSec text-sm">
                <div className="flex justify-between ">
                    <div className="flex gap-x-1 items-center w-3/6">
                        <BsHouse className="text-secondary text-xs"/>
                        <h6 className="truncate"> Single Room</h6>
                    </div>

                    <div className="flex gap-x-1 items-center w-3/6">
                        <BsHouseAddFill className="text-secondary text-xs"/>
                        <h6 className="truncate">Posted 3hrs ago</h6>
                    </div>
                </div>
                {displayItem.roommatesNeeded && displayItem.roommatesNeeded > 0 && (
                    <div className="flex items-center gap-x-1">
                        <Users size={14} className="text-primary"/>
                        <h6 className="text-xs text-gray-600">
                            {displayItem.roommatesNeeded} roommate{displayItem.roommatesNeeded > 1 ? 's' : ''} needed
                        </h6>
                    </div>
                )}
                <div className="flex gap-x-1 items-center">
                    <FaWalking className="text-secondary"/>
                    <h6 className="truncate"> 3 minutes to the gate</h6>
                </div>
                <div className="flex items-center gap-x-2">
                    <h6 className="hidden md:block">Agent's Rating </h6>
                    <h6 className="md:hidden">Rating </h6>
                    <div className="flex gap-x-1 md:gap-x-2">
                        {[...Array(5)].map((_, index)=>(
                            <FaStar className={`text-secondary text-xs md:text-base`} key={index}/>
                        ))}
                    </div>
                        
                </div>
                
            </div>

            <div className="flex justify-between w-full gap-x-3 text-sm font-medium my-3 mb-2 md:mb-5 md:my-5">
                <Button 
                    onClick={() => setShowChat(true)}
                    className="w-3/6 rounded-full text-white bg-primary hidden md:block"
                >
                    Quick Contact
                </Button>
                <Button 
                    onClick={() => setShowChat(true)}
                    className="w-fit md:hidden rounded-full text-white bg-primary"
                >
                    <MdCall/>
                </Button>
                <ShareButton 
                    shareUrl={`/sp/${propertyId}`}
                    className="w-fit md:w-3/6"
                />
            </div>
        </div>
        
        <FloatingChat
            isOpen={showChat}
            onClose={() => setShowChat(false)}
            agentName="Property Agent"
            propertyTitle={displayItem.title || "Marble Lodge"}
        />
    </div>
  )
}

export default ListingBox