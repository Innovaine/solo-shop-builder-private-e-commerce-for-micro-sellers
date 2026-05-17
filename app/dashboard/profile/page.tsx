'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    displayName: '',
    publicDescription: '',
  });

  const [charCounts, setCharCounts] = useState({
    displayName: 0,
    publicDescription: 0,
  });

  useEffect(() => {
    // Load current shop profile data
    async function loadProfile() {
      try {
        const res = await fetch('/api/shops');
        if (!res.ok) throw new Error('Failed to load shop data');
        const shop = await res.json();
        
        if (shop) {
          const displayName = shop.displayName || shop.name || '';
          const publicDescription = shop.publicDescription || '';
          
          setFormData({
            displayName,
            publicDescription,
          });
          
          setCharCounts({
            displayName: displayName.length,
            publicDescription: publicDescription.length,
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    }
    loadProfile();
  }, []);

  function handleInputChange(field: 'displayName' | 'publicDescription', value: string) {
    setFormData({ ...formData, [field]: value });
    setCharCounts({ ...charCounts, [field]: value.length });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate lengths
    if (formData.displayName.length > 100) {
      setError('Shop name must be 100 characters or less');
      setLoading(false);
      return;
    }

    if (formData.publicDescription.length > 500) {
      setError('Shop description must be 500 characters or less');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/shops/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully. Changes appear on your shop page immediately.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Seller Profile</h1>
          <p className="text-slate text-sm">Customize how your shop appears to customers</p>
        </div>

        <Card>
          {success && (
            <div className="bg-emerald/10 border border-emerald text-emerald px-4 py-3 rounded mb-6 text-sm">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose/10 border border-rose text-rose px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-charcoal mb-5">Shop Information</h2>
              
              <div className="space-y-2 mb-6">
                <label htmlFor="displayName" className="block text-sm font-medium text-charcoal">
                  Shop Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Your shop name"
                  maxLength={100}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue/20 focus:border-slate-blue"
                />
                <div className="text-xs text-slate/60">
                  {charCounts.displayName}/100 characters
                </div>
                <div className="text-xs text-slate/80 mt-1">
                  Your shop name appears on your public shop page and in order confirmations.
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="publicDescription" className="block text-sm font-medium text-charcoal">
                  Shop Description
                </label>
                <textarea
                  id="publicDescription"
                  value={formData.publicDescription}
                  onChange={(e) => handleInputChange('publicDescription', e.target.value)}
                  placeholder="Tell customers about your shop..."
                  maxLength={500}
                  rows={5}
                  className="w-full px-3 py-2.5 text-sm border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue/20 focus:border-slate-blue resize-vertical"
                />
                <div className="text-xs text-slate/60">
                  {charCounts.publicDescription}/500 characters
                </div>
                <div className="text-xs text-slate/80 mt-1">
                  This appears on your public shop page. Share what makes your shop special.
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="bg-white text-slate-blue border border-whisper hover:bg-slate/5"
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Preview Section */}
          <div className="mt-8 pt-8 border-t border-whisper">
            <div className="mb-3">
              <div className="text-xs font-semibold text-slate uppercase tracking-wide mb-3">
                Your Public Shop
              </div>
            </div>
            <div className="bg-slate-blue text-white p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-1">
                {formData.displayName || 'Your shop name'}
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {formData.publicDescription || 'Tell customers about your shop...'}
              </p>
            </div>
            <div className="text-xs text-slate/60 mt-3 px-1">
              This is how customers see your shop page header.
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
