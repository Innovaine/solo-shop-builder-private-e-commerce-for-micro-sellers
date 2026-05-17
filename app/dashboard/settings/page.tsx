'use client'

// FR-22: Account settings - password change
// Seller can set or change their password

import { useState } from 'react'
import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import Card from '@/components/ui/Card'
import Header from '@/components/ui/Header'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validate new password confirmation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPassword || undefined,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update password')
        setLoading(false)
        return
      }

      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-2xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Account Settings</h1>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Change Password</h2>
            <p className="text-sm text-slate mb-6">
              Set or update your password. You can use your password to sign in instead of the magic link.
            </p>

            {success && (
              <div className="bg-sage-50 border border-sage-200 rounded-md p-4 mb-6 text-sm text-sage-700">
                Password updated successfully!
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-md p-4 mb-6 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <FormField
                label="Current Password (if set)"
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Leave blank if you haven't set one yet"
                autoComplete="current-password"
              />

              <FormField
                label="New Password"
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
                helpText="Minimum 8 characters"
              />

              <FormField
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                autoComplete="new-password"
              />

              <Button
                type="submit"
                loading={loading}
                variant="primary"
                size="lg"
              >
                Update Password
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
