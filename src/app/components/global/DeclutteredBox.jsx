"use client"
import { MdSell } from "react-icons/md";
import { CiHeart,CiShare2  } from "react-icons/ci";
import { ShoppingCart } from "lucide-react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WishlistBtn from "./Buttons/WishlistBtn";
import ShareButton from "./Buttons/ShareButton";
import { useCart } from "@/contexts/CartContext";
import { MOTION_INTERACTION_CLASS } from '@/lib/motion'


const DeclutteredBox = ({image, border, item = null, itemIndex = 0}) => {
  const { addToCart } = useCart();

  // Create unique default item based on index to prevent duplicates
  const defaultItem = {
    id: `default-${itemIndex}`,
    itemId: `${itemIndex}`,
    title: `Wooden Bed Frame ${itemIndex > 0 ? itemIndex : ''}`,
    price: 10000,
    condition: "Good",
    image: image
  };

  const displayItem = item || defaultItem;
  const inventory = displayItem.inventory !== undefined ? displayItem.inventory : null;
  const isLowInventory = inventory !== null && inventory <= 3 && inventory > 0;
  const isOutOfStock = inventory !== null && inventory === 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart({
        ...displayItem,
        type: 'decluttered'
      });
    }
  };

  return (
    <div className={`declutter-box-outer group bg-grayBg rounded-2xl overflow-visible w-full transition-all ${MOTION_INTERACTION_CLASS} hover:-translate-y-1 hover:shadow-lg ${border && 'border border-borderGray'} shadow-sm shadow-borderOpacity ${isOutOfStock ? 'opacity-60' : ''}`}>
        <div className="w-full rounded-t-2xl overflow-hidden h-[14rem] relative">
            <Link
            href={`/decluttering/${displayItem.itemId || 1}`}
            >
                <Image
                src={displayItem.image || image}
                width={300}
                height={220}
                alt='declutter-media-representation'
                className={`object-cover w-full h-full 
                group-hover:scale-105 transition-all 
                ${MOTION_INTERACTION_CLASS}`}
                />
            </Link>
            
            <WishlistBtn item={displayItem} itemType="decluttered" />
            {isLowInventory && (
              <Button className="absolute bottom-2 right-2 h-4 md:h-6 px-2 bg-orange-500 text-white rounded-full text-xs font-bold border border-white shadow-lg z-10">
                Only {inventory} left
              </Button>
            )}
            {isOutOfStock && (
              <Button className="absolute bottom-2 right-2 h-4 md:h-6 px-2 bg-red-500 text-white rounded-full text-xs font-bold border border-white shadow-lg z-10">
                Out of Stock
              </Button>
            )}
        </div>
        <div className='text-center space-y-2 py-5 font-medium px-3 rounded-b-2xl bg-grayBg'>
            <Link
                href={`/decluttering/${displayItem.itemId || 1}`}
            >
                <h4 className='text-lg md:text-xl '>
                    {displayItem.title}
                </h4>
            </Link>
            <h5 className=' text-base md:text-lg text-primary'>NGN {(displayItem.price || 10000).toLocaleString()}</h5>
            <h6 className=' text-sm md:text-sm text-textSecondary flex gap-x-1 justify-center items-center'><MdSell className='text-secondaryVariant text-lg rotate-90'/>Condition: {displayItem.condition || 'Good'}</h6>
            
            <div className="flex justify-between w-full gap-x-2 text-sm font-medium pt-3 pb-2">
                <Button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-3/6 rounded-full text-white bg-secondary hover:bg-secondary/90 flex items-center justify-center gap-1 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden md:inline text-xs">{isOutOfStock ? 'Unavailable' : 'Cart'}</span>
                </Button>
                <ShareButton
                    shareUrl={`/decluttering/${displayItem.itemId}`}
                    className="w-3/6 rounded-full text-primary border border-borderGray bg-transparent flex items-center gap-x-2 justify-center text-xs"
                    iconOnly={true}
                />
            </div>
        </div>
    </div>
  )
}

export default DeclutteredBox