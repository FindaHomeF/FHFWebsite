'use client'
import { useState } from 'react'
import { Shield, QrCode, Key, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const TwoFactorAuth = ({ isOpen, onClose, currentStatus = false }) => {
  const [step, setStep] = useState('setup') // 'setup', 'verify', 'complete'
  const [qrCode, setQrCode] = useState('data:image/png;base64,...') // Mock QR code
  const [secretKey, setSecretKey] = useState('JBSWY3DPEHPK3PXP') // Mock secret
  const [verificationCode, setVerificationCode] = useState('')
  const [isDisableConfirmOpen, setIsDisableConfirmOpen] = useState(false)
  const [backupCodes] = useState([
    '1234-5678',
    '2345-6789',
    '3456-7890',
    '4567-8901',
    '5678-9012',
    '6789-0123',
    '7890-1234',
    '8901-2345'
  ])

  const handleEnable = () => {
    // In production, generate QR code and secret from backend
    setStep('verify')
    toast.success('Scan the QR code with your authenticator app')
  }

  const handleVerify = () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }
    // In production, verify with backend
    setStep('complete')
    toast.success('2FA enabled successfully!')
  }

  const handleDisable = () => {
    // In production, disable via backend
    toast.success('2FA disabled')
    setIsDisableConfirmOpen(false)
    onClose()
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account
          </DialogDescription>
        </DialogHeader>

        {step === 'setup' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>Scan the QR code to link your account</li>
                <li>Enter the verification code to enable 2FA</li>
                <li>Use codes from the app for future logins</li>
              </ul>
            </div>

            {currentStatus ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">2FA is currently enabled</span>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setIsDisableConfirmOpen(true)}
                  className="w-full"
                >
                  Disable 2FA
                </Button>
              </div>
            ) : (
              <Button onClick={handleEnable} className="w-full bg-primary hover:bg-primary/90">
                <Shield className="h-4 w-4 mr-2" />
                Enable 2FA
              </Button>
            )}
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg mb-4">
                <QrCode className="h-32 w-32 text-gray-400" />
                {/* In production: <img src={qrCode} alt="QR Code" /> */}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Scan this QR code with your authenticator app
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Secret Key:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{secretKey}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(secretKey)
                        toast.success('Copied to clipboard')
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="verificationCode">Enter 6-digit verification code *</Label>
              <Input
                id="verificationCode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('setup')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerify} className="flex-1 bg-primary hover:bg-primary/90">
                Verify & Enable
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">2FA Enabled Successfully!</h3>
              <p className="text-sm text-gray-600">
                Your account is now protected with two-factor authentication
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Backup Codes</h4>
              <p className="text-xs text-yellow-800 mb-3">
                Save these codes in a safe place. You can use them to access your account if you lose your device.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-white p-2 rounded font-mono text-xs text-center border border-yellow-200">
                    {code}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join('\n'))
                  toast.success('Backup codes copied to clipboard')
                }}
                className="w-full"
              >
                Copy All Codes
              </Button>
            </div>

            <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
              Done
            </Button>
          </div>
        )}

        <DialogFooter>
          {step !== 'complete' && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ConfirmActionDialog
      open={isDisableConfirmOpen}
      onOpenChange={setIsDisableConfirmOpen}
      title='Disable 2FA?'
      description='This reduces your account security.'
      confirmText='Disable 2FA'
      onConfirm={handleDisable}
    />
    </>
  )
}

export default TwoFactorAuth

