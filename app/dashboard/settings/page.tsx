'use client'

// FR-22: Account settings - password change
// Seller can set or change their password

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Card } from '@/components/ui/Card'
import Header from '@/components/ui/Header'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

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
        {/* Back button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Button>
        </div>

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

        {/* FR-20: Account Deletion */}
        <Card className="mt-8 border-rose">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-rose mb-4">Delete Account</h2>
            <p className="text-sm text-slate mb-6">
              Permanently delete your account and all associated data. This action cannot be undone.
              All your shops, products, and orders will be deleted.
            </p>

            <Button
              variant="ghost"
              onClick={async () => {
                if (!confirm('Are you absolutely sure? This will permanently delete your account, all shops, products, and orders. This action cannot be undone.')) {
                  return
                }

                if (!confirm('Last confirmation: Type DELETE to confirm account deletion')) {
                  return
                }

                setDeleting(true)
                try {
                  const response = await fetch('/api/account/delete', {
                    method: 'POST',
                  })

                  if (!response.ok) {
                    const data = await response.json()
                    alert(data.error || 'Failed to delete account')
                    setDeleting(false)
                    return
                  }

                  // Redirect to homepage after successful deletion
                  window.location.href = '/'
                } catch {
                  alert('Network error. Please try again.')
                  setDeleting(false)
                }
              }}
              disabled={deleting}
              className="bg-rose text-white hover:bg-rose/90"
            >
              {deleting ? 'Deleting Account...' : 'Delete Account'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
