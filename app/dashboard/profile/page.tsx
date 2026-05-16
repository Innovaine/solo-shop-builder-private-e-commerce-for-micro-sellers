'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    description: '',
    instagramUrl: '',
    facebookUrl: '',
    twitterUrl: '',
  });

  useEffect(() => {
    // ASSUMPTION: Fetch current shop profile data
    async function loadProfile() {
      try {
        const res = await fetch('/api/shops');
        if (!res.ok) throw new Error('Failed to load shop data');
        const shop = await res.json();
        
        if (shop) {
          setFormData({
            description: shop.description || '',
            instagramUrl: shop.instagramUrl || '',
            facebookUrl: shop.facebookUrl || '',
            twitterUrl: shop.twitterUrl || '',
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    }
    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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

      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Seller Profile</h1>
          <p className="text-slate">Customize your public-facing shop profile and social links</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose/10 border border-rose text-rose px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-emerald/10 border border-emerald text-emerald px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-charcoal">Shop Description</label>
              <p className="text-xs text-slate">Tell customers about your shop (displayed on your storefront)</p>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border border-whisper rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                placeholder="We craft hand-made leather goods using traditional techniques..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal">Instagram URL</label>
                <p className="text-xs text-slate">Your Instagram profile link</p>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-whisper rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                  placeholder="https://instagram.com/yourshop"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal">Facebook URL</label>
                <p className="text-xs text-slate">Your Facebook page link</p>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-whisper rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                  placeholder="https://facebook.com/yourshop"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-charcoal">Twitter URL</label>
              <p className="text-xs text-slate">Your Twitter profile link</p>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                className="w-full px-3 py-2 border border-whisper rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
                placeholder="https://twitter.com/yourshop"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="bg-whisper text-charcoal hover:bg-slate/20"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
