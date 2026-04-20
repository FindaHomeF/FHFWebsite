'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, FileSpreadsheet, Edit, Ban, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThumbnailGallery from '@/app/components/global/ThumbnailGallery';
import { toast } from 'sonner';
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const ItemDetailsPage = ({ itemId }) => {
  const router = useRouter();
  const params = useParams();
  const id = itemId || params?.id;
  
  // Default item data
  const defaultItem = {
    id: '#D001',
    title: 'Wooden Study Desk',
    sellerName: 'John Doe',
    category: 'Furniture',
    price: '₦ 15,000',
    condition: 'Good',
    location: 'North Gate, Akure',
    description: 'High-quality wooden study desk in excellent condition. Perfect for students.',
    status: 'Active',
    images: [
      '/declutter1.png',
      '/declutter1.png',
      '/declutter1.png',
      '/declutter1.png',
      '/declutter1.png',
    ]
  };

  const [item, setItem] = useState(defaultItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Load item data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const items = JSON.parse(localStorage.getItem('items') || '[]');
      const foundItem = items.find(p => p.id === id);
      
      if (foundItem) {
        setItem(foundItem);
      }
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleDownloadExcel = () => {
    console.log('Downloading Excel...');
  };

  const handleDownloadCSV = () => {
    console.log('Downloading CSV...');
  };

  const handleEditItem = () => {
    router.push(`/admin/items/edit/${encodeURIComponent(item.id)}`);
  };

  const handleDisable = () => {
    try {
      setIsUpdating(true);
      const items = JSON.parse(localStorage.getItem('items') || '[]');
      const itemIndex = items.findIndex(p => p.id === item.id);
      
      if (itemIndex !== -1) {
        items[itemIndex].status = 'Inactive';
        localStorage.setItem('items', JSON.stringify(items));
        
        setItem({ ...item, status: 'Inactive' });
        toast.success('Item disabled successfully!');
        setIsUpdating(false);
      }
    } catch (error) {
      toast.error('Failed to disable item');
      setIsUpdating(false);
    }
  };

  const handleEnable = () => {
    try {
      setIsUpdating(true);
      const items = JSON.parse(localStorage.getItem('items') || '[]');
      const itemIndex = items.findIndex(p => p.id === item.id);
      
      if (itemIndex !== -1) {
        items[itemIndex].status = 'Active';
        localStorage.setItem('items', JSON.stringify(items));
        
        setItem({ ...item, status: 'Active' });
        toast.success('Item enabled successfully!');
        setIsUpdating(false);
      }
    } catch (error) {
      toast.error('Failed to enable item');
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    try {
      setIsUpdating(true);
      const items = JSON.parse(localStorage.getItem('items') || '[]');
      const filteredItems = items.filter(p => p.id !== item.id);
      localStorage.setItem('items', JSON.stringify(filteredItems));
      
      toast.success('Item deleted successfully!');
      setIsDeleteDialogOpen(false);
      router.push('/admin/items');
    } catch (error) {
      toast.error('Failed to delete item');
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-lg shadow-sm max-h-screen">
        <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-8 pt-4 border-b backdrop-blur-md px-6 border-b-black10">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-3 py-2 bg-transparent border border-black33 shadow-sm text-primary hover:bg-primary hover:text-white"
            >
              <Download className="w-4 h-4" />
              Download Excel
            </Button>
            
            <Button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-3 py-2 bg-transparent border border-black33 shadow-sm text-primary hover:bg-primary hover:text-white"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download CSV
            </Button>
            
            <Button
              onClick={handleEditItem}
              className="bg-primary hover:bg-tertiary text-white flex items-center gap-2 px-4 py-2"
              disabled={isUpdating}
            >
              <Edit className="w-4 h-4" />
              Edit Item
            </Button>
            
            {item.status === 'Active' ? (
              <Button
                variant="destructive"
                onClick={handleDisable}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2"
                disabled={isUpdating}
              >
                <Ban className="w-4 h-4" />
                Disable
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleEnable}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 text-white"
                  disabled={isUpdating}
                >
                  <CheckCircle className="w-4 h-4" />
                  Enable
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2"
                  disabled={isUpdating}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
            
            <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <ThumbnailGallery
              images={item.images}
              selectedIndex={selectedImage}
              onSelect={setSelectedImage}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h2>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="text-gray-900">{item.title}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Seller:</span>
                  <span className="text-gray-900">{item.sellerName}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="text-gray-900">{item.category}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="text-gray-900 font-semibold">{item.price}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Condition:</span>
                  <span className="text-gray-900">{item.condition}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="text-gray-900">{item.location}</span>
                </div>
                
                <div className="flex justify-between items-start py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Description:</span>
                  <span className="text-gray-900 text-right max-w-xs">{item.description}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === 'Active' 
                      ? 'bg-green-600 text-white' 
                      : item.status === 'Inactive'
                      ? 'bg-red-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete item?'
        description='This action cannot be undone.'
        confirmText='Delete item'
        onConfirm={handleDelete}
        isConfirming={isUpdating}
      />
    </div>
  );
};

export default ItemDetailsPage;
