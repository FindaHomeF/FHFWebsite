'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, FileSpreadsheet, Edit, Ban, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThumbnailGallery from '@/app/components/global/ThumbnailGallery';
import { toast } from 'sonner';
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const PropertyDetailsPage = ({ propertyId }) => {
  const router = useRouter();
  const params = useParams();
  const id = propertyId || params?.id;
  
  // Default property data
  const defaultProperty = {
    id: '1',
    title: 'Marble Lodge',
    category: 'Self Contain',
    location: 'Southgate, Akure',
    price: '₦ 200,000',
    condition: 'Good',
    room: 1,
    bathroom: 1,
    kitchen: 1,
    description: 'A one bedroom apartment with a toilet and bathroom',
    propertyOwner: '',
    status: 'Active',
    images: [
      '/hero-image.jpeg',
      '/hero-image.jpeg',
      '/hero-image.jpeg',
      '/hero-image.jpeg',
      '/hero-image.jpeg',
    ]
  };

  const [property, setProperty] = useState(defaultProperty);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Load property data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const properties = JSON.parse(localStorage.getItem('properties') || '[]');
      const foundProperty = properties.find(p => p.id === id);
      
      if (foundProperty) {
        setProperty(foundProperty);
      }
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleDownloadExcel = () => {
    // Implement Excel download functionality
    console.log('Downloading Excel...');
  };

  const handleDownloadCSV = () => {
    // Implement CSV download functionality
    console.log('Downloading CSV...');
  };

  const handleEditProperty = () => {
    router.push(`/admin/properties/edit/${property.id}`);
  };

  const handleDisable = () => {
    try {
      setIsUpdating(true);
      const properties = JSON.parse(localStorage.getItem('properties') || '[]');
      const propertyIndex = properties.findIndex(p => p.id === property.id);
      
      if (propertyIndex !== -1) {
        properties[propertyIndex].status = 'Inactive';
        localStorage.setItem('properties', JSON.stringify(properties));
        
        // Update local state
        setProperty({ ...property, status: 'Inactive' });
        toast.success('Property disabled successfully!');
        setIsUpdating(false);
      }
    } catch (error) {
      toast.error('Failed to disable property');
      setIsUpdating(false);
    }
  };

  const handleEnable = () => {
    try {
      setIsUpdating(true);
      const properties = JSON.parse(localStorage.getItem('properties') || '[]');
      const propertyIndex = properties.findIndex(p => p.id === property.id);
      
      if (propertyIndex !== -1) {
        properties[propertyIndex].status = 'Active';
        localStorage.setItem('properties', JSON.stringify(properties));
        
        // Update local state
        setProperty({ ...property, status: 'Active' });
        toast.success('Property enabled successfully!');
        setIsUpdating(false);
      }
    } catch (error) {
      toast.error('Failed to enable property');
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    try {
      setIsUpdating(true);
      const properties = JSON.parse(localStorage.getItem('properties') || '[]');
      const filteredProperties = properties.filter(p => p.id !== property.id);
      localStorage.setItem('properties', JSON.stringify(filteredProperties));
      
      toast.success('Property deleted successfully!');
      setIsDeleteDialogOpen(false);
      router.push('/admin/properties');
    } catch (error) {
      toast.error('Failed to delete property');
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation Bar */}
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
              onClick={handleEditProperty}
              className="bg-primary hover:bg-tertiary text-white flex items-center gap-2 px-4 py-2"
              disabled={isUpdating}
            >
              <Edit className="w-4 h-4" />
              Edit Property
            </Button>
            
            {property.status === 'Active' ? (
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 ">
          {/* Left Section - Images */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
            
            {/* Main Image */}
            <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={property.images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <ThumbnailGallery
              images={property.images}
              selectedIndex={selectedImage}
              onSelect={setSelectedImage}
            />
          </div>

          {/* Right Section - Property Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
            
            <div className="space-y-4">
              {/* Property Details List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="text-gray-900">{property.title}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="text-gray-900">{property.category}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="text-gray-900">{property.location}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="text-gray-900 font-semibold">{property.price}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Condition:</span>
                  <span className="text-gray-900">{property.condition}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Room:</span>
                  <span className="text-gray-900">{property.room}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Bathroom & toilet:</span>
                  <span className="text-gray-900">{property.bathroom}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Kitchen:</span>
                  <span className="text-gray-900">{property.kitchen}</span>
                </div>
                
                <div className="flex justify-between items-start py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Description:</span>
                  <span className="text-gray-900 text-right max-w-xs">{property.description}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Property Owner:</span>
                  <span className="text-gray-900">{property.propertyOwner || 'Not specified'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'Active' 
                      ? 'bg-green-600 text-white' 
                      : property.status === 'Inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
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
        title='Delete property?'
        description='This action cannot be undone.'
        confirmText='Delete property'
        onConfirm={handleDelete}
        isConfirming={isUpdating}
      />
    </div>
  );
};

export default PropertyDetailsPage;

