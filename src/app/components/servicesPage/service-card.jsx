"use client"
import { Star, Clock12, MapPin } from 'lucide-react'
import { ButtonGS } from '../global/Buttons/ButtonGS'
import { IoBookmarksOutline, IoBookmarks } from 'react-icons/io5'
import { LiaShareAltSolid } from "react-icons/lia";
import { useWishlist } from '@/contexts/WishlistContext';
import Link from 'next/link';
import { MOTION_INTERACTION_CLASS } from '@/lib/motion'

const ServiceCard = ({ service = null }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const defaultService = {
    id: 1,
    serviceId: "1",
    title: "John Doe",
    category: "Carpenter",
    location: "South Gate",
    rating: 4.7,
    reviews: 120,
    responseTime: "2 hours",
    price: 10000
  };

  const displayService = service || defaultService;
  const inWishlist = isInWishlist(displayService.id, 'service');

  const handleWishlistToggle = () => {
    const wishlistItem = {
      ...displayService,
      type: 'service'
    };

    if (inWishlist) {
      removeFromWishlist(displayService.id, 'service');
    } else {
      addToWishlist(wishlistItem);
    }
  };

  return (
    <div className={`w-full bg-grayBg py-5 md:py-10 px-3 md:px-4
    border border-black/20 rounded-xl flex-shrink-0 overflow-visible transition-all ${MOTION_INTERACTION_CLASS} hover:-translate-y-1 hover:shadow-lg`}>
        <div className='relative w-20 h-20 md:w-32 md:h-32 mx-auto
        bg-lighterGray rounded-full'>
            <div className='absolute bottom-0 md:bottom-[0.4rem] right-4 
            w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary'/>
        </div>

        <div>
            <Link href={`/service/${displayService.serviceId || displayService.id}`}>
                <h3 className='mt-3 font-medium text-xl md:text-2xl text-center hover:text-primary transition-colors cursor-pointer'>
                    {displayService.title}
                </h3>
            </Link>

            <h3 className='text-sm md:text-base text-center'>
                {displayService.category}
            </h3>

            <div className='mt-3 w-full flex-itc-jub flex-nowrap gap-3'>
                <div className="flex-itc gap-1 md:gap-2">
                    <MapPin 
                    color="var(--secondary)" 
                    strokeWidth={1.5}
                    className='max-md:w-4 '
                    size={15}
                    />
                    <p className="text-black/60 text-nowrap  text-[10px] md:text-sm">
                        {displayService.location}
                    </p>
                </div>

                <div className="flex-itc gap-1 md:gap-2">
                    <Star 
                    color="var(--secondary)" 
                    strokeWidth={1.5}
                    className='max-md:w-4'
                    size={15}
                    />
                    <p className="text-black/60 text-nowrap text-[10px] md:text-sm">
                        {displayService.rating} <span className=''>({displayService.reviews || 120} Reviews)</span>
                    </p>
                </div>
            </div>

            <div className="mt-2 flex-itc gap-1 md:gap-2">
                <Clock12 
                color="var(--secondary)" 
                strokeWidth={1.5}
                size={15}
                className='max-md:w-4'
                />
                <p className="text-black/60 text-[10px] md:text-sm max-md:font-medium">
                    Responses within {displayService.responseTime || '2 hours'}
                </p>
            </div>

            <div className='mt-2 md:mt-3'>
                <p className='text-center font-medium
                 text-sm md:text-base text-primary text-nowrap'>
                    Starting at NGN {(displayService.price || 10000).toLocaleString()}
                </p>
            </div>

            <div className='mt-4 flex-itc flex-col 
            min-[350px]:flex-row gap-2 md:gap-3 max-w-full overflow-hidden'>
                <div className='w-5/6 md:w-4/6'>
                    <ButtonGS
                        content="View Profile"
                        uppercase={false}
                        cta={`/service/${displayService.serviceId || displayService.id}`}
                        className={` max-lg:py-2 max-lg:rounded-xl max-lg:h-fit
                        max-lg:!w-fit md:!w-full min-w-full max-lg:text-xs`}
                    />
                </div>

                <div className='w-fit flex-itc gap-1.5 md:gap-3'>
                    <button onClick={handleWishlistToggle} className="cursor-pointer">
                      {inWishlist ? (
                        <IoBookmarks size={22} className='max-lg:w-4 text-secondary' />
                      ) : (
                        <IoBookmarksOutline size={22} className='max-lg:w-4' />
                      )}
                    </button>
                    <LiaShareAltSolid size={27}
                        className='max-lg:w-5 cursor-pointer' 
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default ServiceCard
