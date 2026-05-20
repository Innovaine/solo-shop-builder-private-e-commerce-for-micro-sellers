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
    twitterUrl: '',
    instagramUrl: '',
    facebookUrl: '',
  });

  const [charCounts, setCharCounts] = useState({
    displayName: 0,
    publicDescription: 0,
  });

  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>('');

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
            twitterUrl: shop.twitterUrl || '',
            instagramUrl: shop.instagramUrl || '',
            facebookUrl: shop.facebookUrl || '',
          });
          
          setCharCounts({
            displayName: displayName.length,
            publicDescription: publicDescription.length,
          });

          // Set current logo if exists
          if (shop.logoImageUrl || shop.logoUrl) {
            setCurrentLogoUrl(shop.logoImageUrl || shop.logoUrl);
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    }
    loadProfile();
  }, []);

  function handleInputChange(field: keyof typeof formData, value: string) {
    setFormData({ ...formData, [field]: value });
    if (field === 'displayName' || field === 'publicDescription') {
      setCharCounts({ ...charCounts, [field]: value.length });
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      // Upload logo first if image file selected
      if (imageFile) {
        const formDataImg = new FormData();
        formDataImg.append('logo', imageFile);

        const uploadRes = await fetch('/api/shops/branding', {
          method: 'PATCH',
          body: formDataImg,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || 'Failed to upload logo');
        }
      }

      // Update profile data
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
      
      // Reset image file state
      setImageFile(null);
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

            <div>
              <h2 className="text-lg font-semibold text-charcoal mb-5">Shop Logo</h2>
              
              <div className="space-y-2">
                <div className="flex gap-4 items-start">
                  <div className="w-32 h-32 bg-whisper border-2 border-dashed border-slate/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {currentLogoUrl ? (
                      <img src={currentLogoUrl} alt="Current logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-5xl">🏪</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate/80 mb-3">
                      Your shop logo is displayed on your public shop page and in customer communications.
                    </p>
                    <a
                      href="/dashboard/branding"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-charcoal rounded-md hover:bg-charcoal/90 transition-colors"
                    >
                      Change Logo in Branding Settings →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-charcoal mb-5">Social Links</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="twitterUrl" className="block text-sm font-medium text-charcoal">
                    Twitter (X)
                  </label>
                  <input
                    type="url"
                    id="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    className="w-full px-3 py-2.5 text-sm border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue/20 focus:border-slate-blue"
                  />
                  <div className="text-xs text-slate/80">
                    Link to your Twitter/X profile. Leave blank to hide this link from your shop.
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="instagramUrl" className="block text-sm font-medium text-charcoal">
                    Instagram
                  </label>
                  <input
                    type="url"
                    id="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full px-3 py-2.5 text-sm border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue/20 focus:border-slate-blue"
                  />
                  <div className="text-xs text-slate/80">
                    Link to your Instagram profile. Leave blank to hide this link from your shop.
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="facebookUrl" className="block text-sm font-medium text-charcoal">
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-3 py-2.5 text-sm border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue/20 focus:border-slate-blue"
                  />
                  <div className="text-xs text-slate/80">
                    Link to your Facebook page or business profile. Leave blank to hide this link from your shop.
                  </div>
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
                Your Public Shop Header
              </div>
            </div>
            <div className="bg-slate-blue text-white p-4 rounded-lg">
              <div className="flex gap-4 items-start mb-3">
                <div className="w-16 h-16 bg-whisper/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : currentLogoUrl ? (
                    <img src={currentLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-3xl">🏪</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">
                    {formData.displayName || 'Your shop name'}
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {formData.publicDescription || 'Tell customers about your shop...'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-3 border-t border-white/10 text-sm">
                {formData.twitterUrl && (
                  <a href={formData.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white">
                    🐦 Twitter
                  </a>
                )}
                {formData.instagramUrl && (
                  <a href={formData.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white">
                    📷 Instagram
                  </a>
                )}
                {formData.facebookUrl && (
                  <a href={formData.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-white">
                    📘 Facebook
                  </a>
                )}
              </div>
            </div>
            <div className="text-xs text-slate/60 mt-3 px-1">
              This is how customers see your shop page header and social links.
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
