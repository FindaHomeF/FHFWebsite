'use client'
import { useState } from 'react'
import { Save, Bell, Shield, Mail, Globe, Database, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useChangePassword } from '@/lib/mutations'

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

// Mock settings data
const mockSettings = {
  general: {
    siteName: 'Find-a-Home FUTA',
    siteDescription: 'The trusted platform connecting FUTA students with verified properties',
    siteUrl: 'https://findahomefuta.com',
    adminEmail: 'admin@findahomefuta.com',
    supportEmail: 'support@findahomefuta.com',
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    loginAttempts: 5,
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@findahomefuta.com',
    smtpPassword: '••••••••',
    fromName: 'Find-a-Home FUTA',
    fromEmail: 'noreply@findahomefuta.com',
  },
};

export default function SettingsPage() {
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useChangePassword()
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState(mockSettings)
  const [isLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Settings updated successfully')
    }, 1000)
  }

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (!PASSWORD_PATTERN.test(passwordData.newPassword)) {
      toast.error('Use 8+ chars with uppercase, lowercase, number, and special character')
      return
    }

    const accessToken = localStorage.getItem('fhf-access-token') || localStorage.getItem('access_token')
    if (!accessToken) {
      toast.error('Session expired. Please log in again.')
      return
    }

    try {
      await changePassword({
        accessToken,
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        newPasswordConfirm: passwordData.confirmPassword,
      })
      setShowChangePassword(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      // Error handled by mutation.
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'email', name: 'Email', icon: Mail },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header Section with Title and Save Button */}
        <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-6 pt-4 border-b border-black10 px-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your platform configuration</p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-black10 sticky top-[5.5rem] bg-white z-10">
          <nav className="px-6 flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Section */}
        <div className="p-6 pb-28">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminName">Full Name *</Label>
                  <Input id="adminName" defaultValue="Admin User" />
                </div>
                <div>
                  <Label htmlFor="adminEmail">Email *</Label>
                  <Input id="adminEmail" type="email" defaultValue="admin@findahomefuta.com" />
                </div>
                <div>
                  <Label htmlFor="adminPhone">Phone Number</Label>
                  <Input id="adminPhone" type="tel" placeholder="08012345678" />
                </div>
                <div>
                  <Label htmlFor="adminRole">Role</Label>
                  <Input id="adminRole" value="Super Admin" disabled className="bg-gray-100" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="adminBio">Bio</Label>
                  <textarea
                    id="adminBio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-black10">
                <Button className="bg-primary hover:bg-primary/90">Save Profile Changes</Button>
              </div>
            </div>
          </div>
          )}

          {/* General Settings */}
          {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <Input
                value={settings.general.siteName}
                onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site URL
              </label>
              <Input
                value={settings.general.siteUrl}
                onChange={(e) => handleSettingChange('general', 'siteUrl', e.target.value)}
                placeholder="Enter site URL"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={settings.general.siteDescription}
                onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Enter site description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <Input
                type="email"
                value={settings.general.adminEmail}
                onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
                placeholder="Enter admin email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <Input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) => handleSettingChange('general', 'supportEmail', e.target.value)}
                placeholder="Enter support email"
              />
            </div>
          </div>
          </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
            <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-500">Send notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-500">Send notifications via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-500">Send push notifications to mobile apps</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.pushNotifications}
                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
                <p className="text-sm text-gray-500">Send weekly summary reports</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.weeklyReports}
                onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Monthly Reports</h4>
                <p className="text-sm text-gray-500">Send monthly summary reports</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.monthlyReports}
                onChange={(e) => handleSettingChange('notifications', 'monthlyReports', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            </div>
          </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
            <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                placeholder="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Policy
              </label>
              <Select 
                value={settings.security.passwordPolicy} 
                onValueChange={(value) => handleSettingChange('security', 'passwordPolicy', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weak">Weak</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="strong">Strong</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <Input
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                placeholder="5"
              />
            </div>
            <div className="border border-black10 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900">Password Management</h4>
              <p className="text-sm text-gray-500 mt-1">
                Update your admin password using your current password.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </Button>
            </div>
            </div>
          </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Email Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <Input
                value={settings.email.smtpHost}
                onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
              </label>
              <Input
                type="number"
                value={settings.email.smtpPort}
                onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                placeholder="587"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Username
              </label>
              <Input
                value={settings.email.smtpUsername}
                onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
                placeholder="noreply@findahomefuta.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Password
              </label>
              <Input
                type="password"
                value={settings.email.smtpPassword}
                onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <Input
                value={settings.email.fromName}
                onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                placeholder="Find-a-Home FUTA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Email
              </label>
              <Input
                type="email"
                value={settings.email.fromEmail}
                onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                placeholder="noreply@findahomefuta.com"
              />
            </div>
          </div>
            <div className="mt-6">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Test Email Configuration
              </Button>
            </div>
          </div>
          )}
        </div>
      </div>

      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="adminCurrentPassword">Current Password *</Label>
              <Input
                id="adminCurrentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(event) => setPasswordData({ ...passwordData, currentPassword: event.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="adminNewPassword">New Password *</Label>
              <Input
                id="adminNewPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(event) => setPasswordData({ ...passwordData, newPassword: event.target.value })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must include uppercase, lowercase, number, and special character.
              </p>
            </div>
            <div>
              <Label htmlFor="adminConfirmPassword">Confirm New Password *</Label>
              <Input
                id="adminConfirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(event) => setPasswordData({ ...passwordData, confirmPassword: event.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isChangingPassword} className="bg-primary hover:bg-primary/90">
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

