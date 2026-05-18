'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';

export default function BrandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    primaryColor: '#3B4C63',
    accentColor: '#10B981',
    logoUrl: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    // Load current branding data
    async function loadBranding() {
      try {
        const res = await fetch('/api/shops');
        if (!res.ok) throw new Error('Failed to load shop data');
        const shop = await res.json();
        
        if (shop) {
          setFormData({
            primaryColor: shop.primaryColor || '#3B4C63',
            accentColor: shop.accentColor || '#10B981',
            logoUrl: shop.logoUrl || '',
          });
          // Set preview from existing uploaded logo
          if (shop.logoImageUrl) {
            setLogoPreview(shop.logoImageUrl);
          }
        }
      } catch (err) {
        console.error('Error loading branding:', err);
      }
    }
    loadBranding();
  }, []);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo file must be less than 2MB');
      return;
    }

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Logo must be a PNG or JPEG image');
      return;
    }

    setLogoFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Use FormData for file upload
      const formDataObj = new FormData();
      formDataObj.append('primaryColor', formData.primaryColor);
      formDataObj.append('accentColor', formData.accentColor);
      formDataObj.append('logoUrl', formData.logoUrl);
      
      if (logoFile) {
        formDataObj.append('logo', logoFile);
      }

      const res = await fetch('/api/shops/branding', {
        method: 'PATCH',
        body: formDataObj, // No Content-Type header - browser sets multipart/form-data
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update branding');
      }

      const updatedShop = await res.json();
      setSuccess('Branding updated successfully');
      
      // Update preview with new uploaded logo
      if (updatedShop.logoImageUrl) {
        setLogoPreview(updatedShop.logoImageUrl);
      }
      
      setLogoFile(null);
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
          <h1 className="text-4xl font-bold text-charcoal mb-2">Shop Branding</h1>
          <p className="text-slate">Customize your shop's visual identity with colors and logo</p>
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

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="primaryColor" className="text-sm font-semibold text-charcoal">Primary Color</label>
                <p className="text-xs text-slate">Main brand color (headers, navigation)</p>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    id="primaryColor-picker"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="h-12 w-20 rounded border border-whisper cursor-pointer"
                  />
                  <FormField
                    label=""
                    id="primaryColor"
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#3B4C63"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="accentColor" className="text-sm font-semibold text-charcoal">Accent Color</label>
                <p className="text-xs text-slate">Secondary color (buttons, highlights)</p>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    id="accentColor-picker"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="h-12 w-20 rounded border border-whisper cursor-pointer"
                  />
                  <FormField
                    label=""
                    id="accentColor"
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    placeholder="#10B981"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label htmlFor="logoUpload" className="text-sm font-semibold text-charcoal">Upload Logo</label>
              <p className="text-xs text-slate">Upload a square PNG or JPEG (max 2MB, displayed at 40x40px)</p>
              <input
                type="file"
                id="logoUpload"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleLogoChange}
                className="block w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald file:text-white hover:file:bg-emerald/90 cursor-pointer"
              />
            </div>

            {/* Logo Preview */}
            {logoPreview && (
              <div className="border border-whisper rounded p-4 bg-white">
                <p className="text-sm font-medium text-charcoal mb-2">Logo Preview:</p>
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-24 w-24 object-contain border border-whisper rounded"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.alt = 'Failed to load logo';
                  }}
                />
              </div>
            )}

            <FormField
              label="Logo URL (Optional)"
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              helpText="Or provide an external logo URL (HTTPS required)"
            />

            {/* Color Preview */}
            <div className="border border-whisper rounded p-4 bg-white">
              <p className="text-sm font-medium text-charcoal mb-3">Color Preview:</p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div
                    className="h-20 rounded border border-whisper flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    Primary
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    className="h-20 rounded border border-whisper flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: formData.accentColor }}
                  >
                    Accent
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Branding'}
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
