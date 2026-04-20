'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, FileSpreadsheet, CheckCircle, XCircle, Trash2, ExternalLink, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const ServiceDetailsPage = ({ serviceId }) => {
  const router = useRouter();
  const params = useParams();
  const id = serviceId || params?.id;

  // Default service data
  const defaultService = {
    id: "1",
    serviceName: "Tech Repair Services",
    providerName: "John Smith",
    category: "Electronics Repair",
    location: "North Gate, Akure",
    phone: "08012345678",
    email: "john@techrepair.com",
    description: "Professional electronics repair services for all your devices. We specialize in repairing smartphones, laptops, and tablets with quick turnaround times.",
    status: "Active",
    profileImage: "/hero-image.jpeg",
    profileLink: "https://example.com/profile/johnsmith",
    isTopRated: true,
    isPremium: true,
    isApproved: true,
    rating: 4.8,
    joinDate: "January 15, 2024",
    servicesRendered: 127
  };

  const [service, setService] = useState(defaultService);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Load service data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const services = JSON.parse(localStorage.getItem('services') || '[]');
      const foundService = services.find(s => s.id === id);

      if (foundService) {
        setService(foundService);
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

  const handleApprove = () => {
    try {
      setIsUpdating(true);
      const services = JSON.parse(localStorage.getItem('services') || '[]');
      const serviceIndex = services.findIndex(s => s.id === service.id);

      if (serviceIndex !== -1) {
        services[serviceIndex].status = 'Active';
        localStorage.setItem('services', JSON.stringify(services));

        setService({ ...service, status: 'Active' });
        toast.success('Service approved successfully!');
        setIsUpdating(false);
      }
    } catch (error) {
      toast.error('Failed to approve service');
      setIsUpdating(false);
    }
  };

  const handleReject = () => {
    try {
      setIsUpdating(true);
      const services = JSON.parse(localStorage.getItem('services') || '[]');
      const filteredServices = services.filter(s => s.id !== service.id);
      localStorage.setItem('services', JSON.stringify(filteredServices));

      setIsRejectDialogOpen(false)
      toast.success('Service rejected successfully!');
      router.push('/admin/services');
    } catch (error) {
      toast.error('Failed to reject service');
      setIsUpdating(false);
    }
  };

  const handleDisable = () => {
    try {
      setIsUpdating(true);
      
      // Get services from localStorage
      const services = JSON.parse(localStorage.getItem('services') || '[]');
      
      // If no services in storage, create empty array
      if (!services || services.length === 0) {
        // If service is from default/defaultService, just update local state
        setService({ ...service, status: 'Inactive' });
        toast.success('Service disabled successfully!');
        setIsUpdating(false);
        return;
      }

      // Find the service in the array
      const serviceIndex = services.findIndex(s => s.id === service.id);
      
      if (serviceIndex !== -1) {
        // Update the service in the array
        services[serviceIndex].status = 'Inactive';
        localStorage.setItem('services', JSON.stringify(services));

        // Update local state
        setService({ ...service, status: 'Inactive' });
        toast.success('Service disabled successfully!');
        setIsUpdating(false);
      } else {
        // Service not found in localStorage, just update local state
        setService({ ...service, status: 'Inactive' });
        toast.success('Service disabled successfully!');
        setIsUpdating(false);
      }
    } catch (error) {
      console.error('Error disabling service:', error);
      toast.error('Failed to disable service');
      setIsUpdating(false);
    }
  };

  const handleEnable = () => {
    try {
      setIsUpdating(true);
      
      // Get services from localStorage
      const services = JSON.parse(localStorage.getItem('services') || '[]');
      
      // If no services in storage, just update local state
      if (!services || services.length === 0) {
        setService({ ...service, status: 'Active' });
        toast.success('Service enabled successfully!');
        setIsUpdating(false);
        return;
      }

      // Find the service in the array
      const serviceIndex = services.findIndex(s => s.id === service.id);
      
      if (serviceIndex !== -1) {
        // Update the service in the array
        services[serviceIndex].status = 'Active';
        localStorage.setItem('services', JSON.stringify(services));

        // Update local state
        setService({ ...service, status: 'Active' });
        toast.success('Service enabled successfully!');
        setIsUpdating(false);
      } else {
        // Service not found in localStorage, just update local state
        setService({ ...service, status: 'Active' });
        toast.success('Service enabled successfully!');
        setIsUpdating(false);
      }
    } catch (error) {
      console.error('Error enabling service:', error);
      toast.error('Failed to enable service');
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    try {
      setIsUpdating(true);
      const services = JSON.parse(localStorage.getItem('services') || '[]');
      const filteredServices = services.filter(s => s.id !== service.id);
      localStorage.setItem('services', JSON.stringify(filteredServices));

      setIsDeleteDialogOpen(false)
      toast.success('Service deleted successfully!');
      router.push('/admin/services');
    } catch (error) {
      toast.error('Failed to delete service');
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
            
            {service.status === 'Pending' ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isUpdating}
                  className="border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-2 px-4 py-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
              </>
            ) : service.status === 'Active' ? (
              <Button
                onClick={handleDisable}
                disabled={isUpdating}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 flex items-center gap-2 px-4 py-2"
              >
                <Ban className="w-4 h-4" />
                Disable
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isUpdating}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2 px-4 py-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
                <Button
                  onClick={handleEnable}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Enable
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Left Section - Profile Image and Basic Info */}
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Profile Image</h2>
              <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={service.profileImage || '/hero-image.jpeg'}
                  alt={service.providerName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              
            </div>

            {/* About Provider */}
            {service.description && service.profileLink &&(
              <>
              <div className="pt-2">
                <span className="font-medium text-gray-700 block mb-2">About Provider:</span>
                <p className="text-gray-900 text-sm leading-relaxed">{service.description}</p>
              </div>
                <div className="">
                  <a
                    href={service.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary text-sm hover:underline"
                  >
                    View Profile
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Right Section - Service Information */}
          <div className="space-y-6">
                         {/* Header with Badges */}
             <div className="pb-4 border-b border-dashed border-black33">
               <div className="flex items-end justify-between gap-3 mb-2">
                 <h1 className="text-2xl font-bold text-gray-900">{service.serviceName}</h1>
                 <div className="flex gap-2">
                   {service.isTopRated && (
                     <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                       ⭐ Top Rated
                     </span>
                   )}
                   {service.isPremium && (
                     <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                       💎 Premium
                     </span>
                   )}
                 </div>
               </div>
               <div className="flex items-center gap-4 mt-2">
                 <p className="text-gray-600 text-sm">Service ID: {service.id}</p>
               </div>
             </div>

                         {/* Service Details */}
             <div className="space-y-4">
               {/* Rating and Services Rendered */}
               {(service.rating || service.servicesRendered) && (
                 <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                   <span className="font-medium text-gray-700">Rating:</span>
                   <div className="flex items-center gap-2 text-gray-900">
                     {service.rating && (
                       <div className="flex items-center gap-1">
                         <span className="text-sm font-medium">{service.rating}</span>
                         <span className="text-sm">⭐</span>
                       </div>
                     )}
                     {service.rating && service.servicesRendered && <span>•</span>}
                     {service.servicesRendered && (
                       <span className="text-sm">({service.servicesRendered})</span>
                     )}
                   </div>
                 </div>
               )}

               <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                 <span className="font-medium text-gray-700">Provider Name:</span>
                 <span className="text-gray-900">{service.providerName}</span>
               </div>

               <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                 <span className="font-medium text-gray-700">Category:</span>
                 <span className="text-gray-900">{service.category}</span>
               </div>

               <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                 <span className="font-medium text-gray-700">Location:</span>
                 <span className="text-gray-900">{service.location}</span>
               </div>

               <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                 <span className="font-medium text-gray-700">Phone:</span>
                 <span className="text-gray-900">{service.phone}</span>
               </div>

               <div className="flex justify-between items-start py-2 border-b border-dashed border-black33">
                 <span className="font-medium text-gray-700">Email:</span>
                 <span className="text-gray-900 text-right break-all max-w-xs">{service.email}</span>
               </div>

               <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                 <span className="font-medium text-gray-700">Status:</span>
                 <div className="flex items-center gap-2">
                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                     service.status === 'Active'
                       ? 'bg-green-600 text-white'
                       : service.status === 'Inactive'
                       ? 'bg-red-600 text-white'
                       : 'bg-yellow-600 text-white'
                   }`}>
                     {service.status}
                   </span>
                   {service.isApproved && (
                     <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       ✓ Approved
                     </span>
                   )}
                 </div>
               </div>

               <div className="flex justify-between items-center py-2">
                 <span className="font-medium text-gray-700">Joined Date:</span>
                 <span className="text-gray-900">{service.joinDate || 'N/A'}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      <ConfirmActionDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        title='Reject service?'
        description='This action cannot be undone.'
        confirmText='Reject service'
        onConfirm={handleReject}
        isConfirming={isUpdating}
      />

      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete service?'
        description='This action cannot be undone.'
        confirmText='Delete service'
        onConfirm={handleDelete}
        isConfirming={isUpdating}
      />
    </div>
  );
};

export default ServiceDetailsPage;
