'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const DEFAULT_TEMPLATE = `Hi {{customerName}},

Thank you for your order!

{{orderSummary}}

We'll send you a shipping notification once your order is on its way.

If you have any questions, please reply to this email.

Best regards,
{{shopName}}`;

export default function EmailTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);

  useEffect(() => {
    // Load current email template
    async function loadTemplate() {
      try {
        const res = await fetch('/api/shops');
        if (!res.ok) throw new Error('Failed to load shop data');
        const shop = await res.json();
        
        if (shop?.emailTemplateBody) {
          setTemplate(shop.emailTemplateBody);
        }
      } catch (err) {
        console.error('Error loading template:', err);
      }
    }
    loadTemplate();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/shops/email-template', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailTemplateBody: template }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update email template');
      }

      setSuccess('Email template updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setTemplate(DEFAULT_TEMPLATE);
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Email Template</h1>
          <p className="text-slate">Customize the order confirmation email sent to your customers</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-charcoal mb-4">Template Editor</h2>
                
                {error && (
                  <div className="bg-rose/10 border border-rose text-rose px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-emerald/10 border border-emerald text-emerald px-4 py-3 rounded mb-4">
                    {success}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-charcoal">Email Body</label>
                  <p className="text-xs text-slate">Available variables: {"{{customerName}}"}, {"{{shopName}}"}, {"{{orderSummary}}"}, {"{{trackingUrl}}"}</p>
                  <textarea
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-whisper rounded focus:outline-none focus:ring-2 focus:ring-slateBlue font-mono text-sm"
                    placeholder={DEFAULT_TEMPLATE}
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Template'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleReset}
                    className="bg-whisper text-charcoal hover:bg-slate/20"
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Preview */}
          <div>
            <h2 className="text-lg font-semibold text-charcoal mb-4">Preview</h2>
            <Card className="bg-white">
              <div className="border border-whisper rounded p-4">
                <div className="mb-4 pb-4 border-b border-whisper">
                  <p className="text-sm text-slate mb-1">From:</p>
                  <p className="text-sm font-medium text-charcoal">Your Shop Name &lt;orders@soloshop.example&gt;</p>
                </div>
                
                <div className="mb-4 pb-4 border-b border-whisper">
                  <p className="text-sm text-slate mb-1">To:</p>
                  <p className="text-sm font-medium text-charcoal">customer@example.com</p>
                </div>
                
                <div className="mb-4 pb-4 border-b border-whisper">
                  <p className="text-sm text-slate mb-1">Subject:</p>
                  <p className="text-sm font-medium text-charcoal">Order Confirmation</p>
                </div>

                <div className="prose prose-sm">
                  <pre className="whitespace-pre-wrap text-sm text-charcoal font-sans">
                    {template
                      .replace('{{customerName}}', 'John Doe')
                      .replace('{{shopName}}', 'Your Shop Name')
                      .replace('{{orderSummary}}', 'Order #ABC123\n- Product 1 × 2 = $40.00\n- Product 2 × 1 = $20.00\nTotal: $60.00')
                      .replace('{{trackingUrl}}', 'https://track.example.com/ABC123')}
                  </pre>
                </div>
              </div>
            </Card>

            <div className="mt-4 p-4 bg-amber/10 border border-amber rounded text-sm text-charcoal">
              <p className="font-medium mb-2">💡 Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-slate">
                <li>Keep it concise and friendly</li>
                <li>Always include order summary and tracking info</li>
                <li>Test by placing a real order</li>
                <li>Variables are automatically replaced when emails are sent</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
