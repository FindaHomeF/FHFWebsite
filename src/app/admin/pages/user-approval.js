'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const UserApprovalPage = ({ userId }) => {
  const router = useRouter();
  const params = useParams();
  const id = userId || params?.id;

  const defaultUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "08012345678",
    role: "student",
    status: "Pending",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    propertiesCount: 0,
    avatar: "/hero-image.jpeg",
    location: "South Gate, Akure",
    verified: false,
    enrollmentNumber: "FUT/2024/001"
  };

  const [user, setUser] = useState(defaultUser);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.id === id);
      if (foundUser) {
        setUser(foundUser);
      }
    }
  }, [id]);

  const handleBack = () => router.back();
  const handleDownloadExcel = () => console.log('Downloading Excel...');
  const handleDownloadCSV = () => console.log('Downloading CSV...');

  const handleApprove = () => {
    try {
      setIsUpdating(true);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex].status = 'Active';
        localStorage.setItem('users', JSON.stringify(users));
        setUser({ ...user, status: 'Active' });
        toast.success('User approved successfully!');
        setTimeout(() => router.push('/admin/users'), 1500);
      }
      setIsUpdating(false);
    } catch (error) {
      toast.error('Failed to approve user');
      setIsUpdating(false);
    }
  };

  const handleReject = () => {
    try {
      setIsUpdating(true);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
      setIsRejectDialogOpen(false)
      toast.success('User rejected successfully!');
      router.push('/admin/users');
    } catch (error) {
      toast.error('Failed to reject user');
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-lg shadow-sm max-h-screen overflow-y-auto pb-28">
        <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-8 pt-4 border-b backdrop-blur-md px-6 border-b-black10">
          <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleDownloadExcel} className="flex items-center gap-2 px-3 py-2 bg-transparent border border-black33 shadow-sm text-primary hover:bg-primary hover:text-white">
              <Download className="w-4 h-4" />
              Download Excel
            </Button>
            
            <Button onClick={handleDownloadCSV} className="flex items-center gap-2 px-3 py-2 bg-transparent border border-black33 shadow-sm text-primary hover:bg-primary hover:text-white">
              <FileSpreadsheet className="w-4 h-4" />
              Download CSV
            </Button>
            
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(true)} disabled={isUpdating} className="border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-2 px-4 py-2">
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
            
            <Button onClick={handleApprove} disabled={isUpdating} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2">
              <CheckCircle className="w-4 h-4" />
              Approve
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Profile Picture</h2>
              <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                <img src={user.avatar || '/hero-image.jpeg'} alt={user.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="pb-4 border-b border-dashed border-black33">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-gray-600 text-sm">User ID: {user.id}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900 text-right break-all max-w-xs">{user.email}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="text-gray-900">{user.phone}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                <span className="font-medium text-gray-700">Role:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                  user.role === 'agent' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Active' ? 'bg-green-600 text-white' :
                  user.status === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {user.status}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                <span className="font-medium text-gray-700">Location:</span>
                <span className="text-gray-900">{user.location || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                <span className="font-medium text-gray-700">Join Date:</span>
                <span className="text-gray-900">{user.joinDate || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-700">Last Active:</span>
                <span className="text-gray-900">{user.lastActive || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmActionDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        title='Reject user?'
        description='This action cannot be undone.'
        confirmText='Reject user'
        onConfirm={handleReject}
        isConfirming={isUpdating}
      />
    </div>
  );
};

export default UserApprovalPage;
