'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, FileSpreadsheet, CheckCircle, XCircle, Ban, LockOpen, Mail, Phone, MapPin, Calendar, User, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { validateStudentId } from '@/lib/studentIdValidation';
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'
import { useUnlockLockedUserAccount } from '@/lib/mutations'

const UserDetailsPage = ({ userId }) => {
  const router = useRouter();
  const params = useParams();
  const id = userId || params?.id;

  // Default user data
  const defaultUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "08012345678",
    role: "student",
    status: "Active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    propertiesCount: 0,
    avatar: "/hero-image.jpeg",
    location: "South Gate, Akure",
    address: "123 Campus Road",
    verified: true,
    enrollmentNumber: "FUT/2024/001",
    department: "Computer Science"
  };

  const [user, setUser] = useState(defaultUser);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutateAsync: unlockLockedUserAccount, isPending: isUnlockingAccount } = useUnlockLockedUserAccount()

  const currentUser = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('currentUser') || 'null')
    : null

  const hasUnlockPermission = Boolean(
    currentUser &&
    (
      currentUser?.role === 'admin' ||
      currentUser?.role === 'support' ||
      currentUser?.role === 'subadmin' ||
      currentUser?.isSubAdmin === true ||
      currentUser?.is_sub_admin === true
    )
  )

  const isAccountLocked = Boolean(
    user?.is_locked ||
    user?.isLocked ||
    user?.locked_until ||
    user?.lockedUntil ||
    Number(user?.failed_login_attempts || 0) >= 5 ||
    Number(user?.failed_otp_attempts || 0) >= 5
  )

  // Load user data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to find user in localStorage users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      let foundUser = users.find(u => u.id === id);

      // If not found, try sub-admins
      if (!foundUser) {
        const subAdmins = JSON.parse(localStorage.getItem('subAdmins') || '[]');
        foundUser = subAdmins.find(u => u.id === id);
      }

      // If still not found, check mockUsers
      if (!foundUser) {
        const mockUsers = [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "08012345678",
            role: "student",
            status: "Active",
            joinDate: "2024-01-15",
            lastActive: "2 hours ago",
            propertiesCount: 0,
            avatar: "/hero-image.jpeg",
            location: "South Gate, Akure",
            address: "123 Campus Road",
            verified: true,
            enrollmentNumber: "FUT/2024/001",
            department: "Computer Science"
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "08023456789",
            role: "agent",
            status: "Active",
            joinDate: "2024-01-10",
            lastActive: "1 day ago",
            propertiesCount: 5,
            avatar: "/hero-image.jpeg",
            location: "North Gate, Akure",
            address: "456 Campus Road",
            verified: true
          },
          {
            id: "3",
            name: "Mike Johnson",
            email: "mike@example.com",
            phone: "08034567890",
            role: "artisan",
            status: "Pending",
            joinDate: "2024-01-18",
            lastActive: "3 days ago",
            propertiesCount: 0,
            avatar: "/hero-image.jpeg",
            location: "East Gate, Akure",
            address: "789 Campus Road",
            verified: false
          },
          {
            id: "4",
            name: "Sarah Wilson",
            email: "sarah@example.com",
            phone: "08045678901",
            role: "student",
            status: "Inactive",
            joinDate: "2024-01-05",
            lastActive: "1 week ago",
            propertiesCount: 0,
            avatar: "/hero-image.jpeg",
            location: "West Gate, Akure",
            address: "321 Campus Road",
            verified: true,
            enrollmentNumber: "FUT/2024/002",
            department: "Engineering"
          },
          {
            id: "5",
            name: "David Brown",
            email: "david@example.com",
            phone: "08056789012",
            role: "agent",
            status: "Active",
            joinDate: "2023-12-20",
            lastActive: "5 minutes ago",
            propertiesCount: 12,
            avatar: "/hero-image.jpeg",
            location: "Central, Akure",
            address: "654 Campus Road",
            verified: true
          },
          {
            id: "6",
            name: "Lisa Anderson",
            email: "lisa@example.com",
            phone: "08067890123",
            role: "artisan",
            status: "Active",
            joinDate: "2024-01-12",
            lastActive: "6 hours ago",
            propertiesCount: 0,
            avatar: "/hero-image.jpeg",
            location: "South Gate, Akure",
            address: "987 Campus Road",
            verified: false
          }
        ];
        foundUser = mockUsers.find(u => u.id === id);
      }

      // If still not found, check mockSubAdmins
      if (!foundUser) {
        const mockSubAdmins = [
          {
            id: "SA002",
            name: "Jane Manager",
            email: "jane@example.com",
            phone: "08098765432",
            role: "admin",
            status: "Active",
            joinDate: "2024-02-01",
            lastActive: "30 minutes ago",
            avatar: "/hero-image.jpeg",
            propertiesCount: 0,
            isSubAdmin: true,
            location: "Central, Akure",
            address: "Office Building",
            verified: true
          }
        ];
        foundUser = mockSubAdmins.find(u => u.id === id);
      }

      if (foundUser) {
        setUser(foundUser);
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

  const handleSuspend = () => {
    try {
      setIsUpdating(true);
      // Try users first
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      let userIndex = users.findIndex(u => u.id === user.id);
      let isSubAdmin = false;
      
      // If not found in users, try subAdmins
      if (userIndex === -1) {
        users = JSON.parse(localStorage.getItem('subAdmins') || '[]');
        userIndex = users.findIndex(u => u.id === user.id);
        isSubAdmin = true;
      }
      
      if (userIndex !== -1) {
        // User found in localStorage
        users[userIndex].status = 'Suspended';
        users[userIndex].suspended = true;
        users[userIndex].suspendedAt = new Date().toISOString();
        if (isSubAdmin) {
          localStorage.setItem('subAdmins', JSON.stringify(users));
        } else {
          localStorage.setItem('users', JSON.stringify(users));
        }
        setUser({ ...user, status: 'Suspended', suspended: true, suspendedAt: users[userIndex].suspendedAt });
        toast.success(`${isSubAdmin ? 'Sub-admin' : 'User'} suspended successfully! They will not be able to perform any actions on the app.`);
      } else {
        // User not in localStorage, add it
        const newUser = {
          ...user,
          status: 'Suspended',
          suspended: true,
          suspendedAt: new Date().toISOString()
        };
        users.push(newUser);
        if (user.id.startsWith('SA')) {
          localStorage.setItem('subAdmins', JSON.stringify(users));
        } else {
          localStorage.setItem('users', JSON.stringify(users));
        }
        setUser(newUser);
        toast.success('User suspended successfully! They will not be able to perform any actions on the app.');
      }
      
      setIsUpdating(false);
    } catch (error) {
      toast.error('Failed to suspend user');
      setIsUpdating(false);
    }
  };

  const handleActivate = () => {
    try {
      setIsUpdating(true);
      // Try users first
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      let userIndex = users.findIndex(u => u.id === user.id);
      let isSubAdmin = false;
      
      // If not found in users, try subAdmins
      if (userIndex === -1) {
        users = JSON.parse(localStorage.getItem('subAdmins') || '[]');
        userIndex = users.findIndex(u => u.id === user.id);
        isSubAdmin = true;
      }
      
      if (userIndex !== -1) {
        // User found in localStorage
        users[userIndex].status = 'Active';
        users[userIndex].suspended = false;
        users[userIndex].suspendedAt = null;
        if (isSubAdmin) {
          localStorage.setItem('subAdmins', JSON.stringify(users));
        } else {
          localStorage.setItem('users', JSON.stringify(users));
        }
        setUser({ ...user, status: 'Active', suspended: false, suspendedAt: null });
        toast.success(`${isSubAdmin ? 'Sub-admin' : 'User'} activated successfully! They can now perform actions on the app.`);
      } else {
        // User not in localStorage, add it
        const newUser = {
          ...user,
          status: 'Active',
          suspended: false,
          suspendedAt: null
        };
        users.push(newUser);
        if (user.id.startsWith('SA')) {
          localStorage.setItem('subAdmins', JSON.stringify(users));
        } else {
          localStorage.setItem('users', JSON.stringify(users));
        }
        setUser(newUser);
        toast.success('User activated successfully! They can now perform actions on the app.');
      }
      
      setIsUpdating(false);
    } catch (error) {
      toast.error('Failed to activate user');
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    try {
      setIsUpdating(true);
      // Try users first
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      let userIndex = users.findIndex(u => u.id === user.id);
      
      // If not found in users, try subAdmins
      if (userIndex === -1) {
        users = JSON.parse(localStorage.getItem('subAdmins') || '[]');
        userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
          const filteredUsers = users.filter(u => u.id !== user.id);
          localStorage.setItem('subAdmins', JSON.stringify(filteredUsers));
          setIsDeleteDialogOpen(false)
          toast.success('Sub-admin deleted successfully!');
          router.push('/admin/users');
        }
      } else {
        const filteredUsers = users.filter(u => u.id !== user.id);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        setIsDeleteDialogOpen(false)
        toast.success('User deleted successfully!');
        router.push('/admin/users');
      }
    } catch (error) {
      toast.error('Failed to delete user');
      setIsUpdating(false);
    }
  };

  const handleUnlockAccount = async () => {
    const accessToken =
      localStorage.getItem('fhf-access-token') || localStorage.getItem('access_token')
    if (!accessToken) {
      toast.error('Session expired. Please log in again.')
      return
    }

    try {
      await unlockLockedUserAccount({
        userId: user.id,
        accessToken,
      })

      const unlockedUser = {
        ...user,
        is_locked: false,
        isLocked: false,
        locked_until: null,
        lockedUntil: null,
        failed_login_attempts: 0,
        failed_otp_attempts: 0,
      }
      setUser(unlockedUser)
    } catch {
      // Error toast handled by mutation.
    }
  }

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
            
            {user.status === 'Active' ? (
              <Button
                onClick={handleSuspend}
                disabled={isUpdating}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 flex items-center gap-2 px-4 py-2"
              >
                <Ban className="w-4 h-4" />
                Suspend Account
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isUpdating}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2 px-4 py-2"
                >
                  <XCircle className="w-4 h-4" />
                  Delete
                </Button>
                <Button
                  onClick={handleActivate}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-4 py-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Activate Account
                </Button>
              </>
            )}

            {hasUnlockPermission && isAccountLocked && (
              <Button
                onClick={handleUnlockAccount}
                disabled={isUnlockingAccount}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2"
              >
                <LockOpen className="w-4 h-4" />
                {isUnlockingAccount ? 'Unlocking...' : 'Unlock Account'}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Profile Picture</h2>
              <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={user.avatar || '/hero-image.jpeg'}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="pb-4 border-b border-dashed border-black33">
              <div className="flex items-end justify-between gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                {user.verified && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Verified
                  </span>
                )}
              </div>
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
                  user.role === 'agent' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Active'
                    ? 'bg-green-600 text-white'
                    : user.status === 'Pending'
                    ? 'bg-yellow-600 text-white'
                    : user.status === 'Suspended'
                    ? 'bg-orange-600 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {user.status}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                <span className="font-medium text-gray-700">Location:</span>
                <span className="text-gray-900">{user.location || 'N/A'}</span>
              </div>

              {user.role === 'student' && (user.studentIdNumber || user.enrollmentNumber) && (
                <div className="flex justify-between items-start py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Student ID:</span>
                  <div className="text-right max-w-xs">
                    <span className="text-gray-900">{user.studentIdNumber || user.enrollmentNumber}</span>
                    {user.studentIdNumber && (() => {
                      const validation = validateStudentId(user.studentIdNumber);
                      if (validation.isValid && validation.isExpired) {
                        return (
                          <div className="mt-2 flex items-center gap-2 justify-end">
                            <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Flagged: {validation.yearsSinceAdmission} years since admission
                            </Badge>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    {user.studentIdValidation?.flagged && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        Admission: {user.studentIdValidation.admissionYear} ({user.studentIdValidation.yearsSinceAdmission} years ago)
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                <span className="font-medium text-gray-700">Properties Listed:</span>
                <span className="text-gray-900">{user.propertiesCount}</span>
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
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete user?'
        description='This action cannot be undone.'
        confirmText='Delete user'
        onConfirm={handleDelete}
        isConfirming={isUpdating}
      />
    </div>
  );
};

export default UserDetailsPage;
