'use client'
import { useState } from 'react'
import { Shield, Key, Smartphone, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Header from '@/app/components/global/Header'
import Footer from '@/app/components/global/Footer'
import TwoFactorAuth from '@/app/components/auth/TwoFactorAuth'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useChangePassword } from '@/lib/mutations'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

const SecuritySettingsPage = () => {
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useChangePassword()
  const [show2FA, setShow2FA] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showRevokeAllConfirm, setShowRevokeAllConfirm] = useState(false)
  const [showRevokeSessionConfirm, setShowRevokeSessionConfirm] = useState(false)
  const [pendingRevokeSessionId, setPendingRevokeSessionId] = useState(null)
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Akure, Nigeria',
      lastActive: '2 hours ago',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Akure, Nigeria',
      lastActive: '5 days ago',
      current: false
    }
  ])
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChangePassword = async (e) => {
    e.preventDefault()
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
      toast.error('You are not authenticated. Please log in again.')
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
      // Mutation handles error feedback.
    }
  }

  const handleRevokeSession = (sessionId) => {
    if (!sessionId) return
    setActiveSessions(activeSessions.filter(s => s.id !== sessionId))
    setShowRevokeSessionConfirm(false)
    setPendingRevokeSessionId(null)
    toast.success('Session revoked')
  }

  const requestRevokeSession = (sessionId) => {
    setPendingRevokeSessionId(sessionId)
    setShowRevokeSessionConfirm(true)
  }

  const handleRevokeAll = () => {
    setActiveSessions(activeSessions.filter(s => s.current))
    setShowRevokeAllConfirm(false)
    toast.success('All other sessions revoked')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Security Settings
          </h1>
          <p className="text-gray-600">Manage your account security and privacy</p>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Key className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Change Password</h2>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
              </div>
              <Button onClick={() => setShowChangePassword(true)} variant="outline">
                Change Password
              </Button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Two-Factor Authentication</h2>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${true ? 'text-green-600' : 'text-gray-500'}`}>
                  {true ? 'Enabled' : 'Disabled'}
                </span>
                <Button onClick={() => setShow2FA(true)} variant="outline">
                  {true ? 'Manage' : 'Enable'}
                </Button>
              </div>
            </div>
            {true && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p className="text-sm text-green-800">
                  2FA is protecting your account. Use your authenticator app to generate codes when logging in.
                </p>
              </div>
            )}
          </div>

          {/* Login Alerts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Login Alerts</h2>
                  <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                </div>
              </div>
              <Switch
                checked={loginAlerts}
                onCheckedChange={setLoginAlerts}
              />
            </div>
            {loginAlerts && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                You'll receive email notifications for new logins from unrecognized devices or locations.
              </div>
            )}
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Active Sessions</h2>
                  <p className="text-sm text-gray-600">Manage devices where you're logged in</p>
                </div>
              </div>
              {activeSessions.filter(s => !s.current).length > 0 && (
                <Button variant="outline" onClick={() => setShowRevokeAllConfirm(true)} className="text-red-600 border-red-200 hover:bg-red-50">
                  Revoke All Others
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{session.device}</span>
                      {session.current && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-0.5">
                      <p>{session.location}</p>
                      <p>Last active: {session.lastActive}</p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestRevokeSession(session.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Change Password Dialog */}
        <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password *</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowChangePassword(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isChangingPassword} className="bg-primary hover:bg-primary/90">
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 2FA Dialog */}
        <TwoFactorAuth
          isOpen={show2FA}
          onClose={() => setShow2FA(false)}
          currentStatus={true}
        />

        <ConfirmActionDialog
          open={showRevokeAllConfirm}
          onOpenChange={setShowRevokeAllConfirm}
          title='Revoke all other sessions?'
          description='You will need to log in again on other devices.'
          confirmText='Revoke sessions'
          onConfirm={handleRevokeAll}
        />

        <ConfirmActionDialog
          open={showRevokeSessionConfirm}
          onOpenChange={setShowRevokeSessionConfirm}
          title='Revoke this session?'
          description='The selected device will be signed out immediately.'
          confirmText='Revoke session'
          onConfirm={() => handleRevokeSession(pendingRevokeSessionId)}
        />
      </main>
      <Footer />
    </div>
  )
}

export default SecuritySettingsPage

