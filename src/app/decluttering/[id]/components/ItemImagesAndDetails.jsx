"use client"
import React from 'react'
import ItemImageGallery from './ItemImageGallery'
import ItemDetails from './ItemDetails'
import { useItem } from '@/contexts/DataContext'

const DEMO_ITEM = {
    id: 0,
    itemId: 0,
    title: 'Wooden Study Desk',
    category: 'Furniture',
    price: 15000,
    condition: 'Good',
    status: 'ACTIVE',
    location: 'North Gate, Akure',
    ownerName: 'John Doe',
    owner_name: 'John Doe',
    description: `High-quality wooden study desk in excellent condition. Perfect for students.
Comes with a spacious drawer and smooth surface. Dimensions: 120cm x 60cm x 75cm.
No scratches or damages. Ready for immediate pickup.`,
    images: ['/declutter1.png', '/declutter1.png', '/declutter1.png', '/declutter1.png'],
}

const ItemImagesAndDetails = ({ itemId }) => {
    const { data: item } = useItem(itemId)

    const resolvedItem = item || DEMO_ITEM
    const imagePaths = Array.isArray(resolvedItem.images) && resolvedItem.images.length > 0
        ? resolvedItem.images
        : DEMO_ITEM.images

    return (
        <div className="md:mt-5 w-90p-mx-auto">
            <div className='flex flex-col lg:flex-row gap-x-10 lg:mt-8 gap-y-8'>
                {/* Image Gallery Component */}
                <ItemImageGallery images={imagePaths} />

                {/* Item Details Component */}
                <ItemDetails itemId={itemId} itemData={resolvedItem} />
            </div>
        </div>
    );
};

export default ItemImagesAndDetails;

