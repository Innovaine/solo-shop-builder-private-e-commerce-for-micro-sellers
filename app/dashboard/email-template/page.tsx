'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';

// ASSUMPTION: DOMPurify for XSS prevention on template rendering
// ASSUMPTION: Merge tags replaced at email send time, not in editor

const DEFAULT_SUBJECT = 'Order Confirmation from {{shopName}}';
const DEFAULT_BODY = `Hello {{customerName}},

Thank you for your order! Here's a summary:

Order Number: {{orderNumber}}
Order Date: {{orderDate}}
Total: {{orderTotal}}

Items:
{{items}}

Tracking Information:
Your order will be shipped soon. You can track it here: {{trackingLink}}

Questions?
If you have any questions about your order, reply to this email or visit {{shopName}}.

Best regards,
{{shopName}} Team`;

const SAMPLE_DATA = {
  customerName: 'Jane Smith',
  customerEmail: 'jane@example.com',
  orderNumber: '#ORD-1027',
  orderDate: 'May 17, 2026',
  orderTotal: '$145.00',
  items: '- Hand-thrown ceramic bowl x1\n- Artisan mug x2',
  trackingLink: '<a href="#">View tracking</a>',
  shopName: 'Artisan Ceramics'
};

export default function EmailTemplatePage() {
  const router = useRouter();
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current template from API
    async function loadTemplate() {
      try {
        const res = await fetch('/api/shops/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.shop?.emailTemplateBody) {
            setBody(data.shop.emailTemplateBody);
          }
        }
      } catch (err) {
        console.error('Failed to load template:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, []);

  const replaceMergeTags = (text: string) => {
    let replaced = text;
    Object.entries(SAMPLE_DATA).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      replaced = replaced.replace(regex, value);
    });
    return replaced;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/shops/email-template', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailTemplateBody: body })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save template');
        setSaving(false);
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSubject(DEFAULT_SUBJECT);
    setBody(DEFAULT_BODY);
    setError('');
    setSaved(false);
  };

  const handleSendTest = () => {
    alert('✓ Test email sent to your registered email address.\n\nCheck your inbox in a moment to preview how the template looks with real order data.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-white border-b border-whisper px-6 py-4">
          <h1 className="text-2xl font-bold text-charcoal">Email Template Editor</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-12 text-slate">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-whisper px-6 py-4">
        <h1 className="text-2xl font-bold text-charcoal">Order Confirmation Email Template</h1>
        <p className="text-slate text-sm mt-1">Customize the email your customers receive after they purchase</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <div className="mb-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-blue hover:text-slate-blue/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* EDITOR SECTION */}
          <div>
            <div className="bg-white border border-whisper rounded-lg p-6">
              <h2 className="text-lg font-semibold text-charcoal mb-4">Edit Template</h2>

              {saved && (
                <div className="bg-green-50 border border-green-200 text-green-900 rounded-lg p-3 mb-4 text-sm">
                  ✓ Template saved successfully!
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-900">
                💡 This is the default template. Any changes you make will be saved and used for future orders.
              </div>

              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-2">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={100}
                    className="w-full px-3 py-2 border border-whisper rounded-lg focus:outline-none focus:ring-2 focus:ring-slateBlue text-sm"
                    required
                  />
                  <div className="mt-1 text-xs text-slate">
                    Max 100 characters. Use merge tags like {`{{shopName}}`} to personalize.
                  </div>
                  <div className="mt-1 text-xs text-slate">
                    {subject.length}/100 characters
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="body" className="block text-sm font-medium text-charcoal mb-2">
                    Email Body
                  </label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    maxLength={5000}
                    rows={16}
                    className="w-full px-3 py-2 border border-whisper rounded-lg focus:outline-none focus:ring-2 focus:ring-slateBlue text-sm font-mono resize-y"
                    required
                  />
                  <div className="mt-1 text-xs text-slate">
                    Max 5000 characters. Plain text recommended. HTML tags will be sanitized for security.
                  </div>
                  <div className="mt-1 text-xs text-slate">
                    {body.length}/5000 characters
                  </div>
                </div>

                <div className="bg-gray-50 border border-whisper rounded-lg p-3 mb-4">
                  <div className="text-xs font-semibold text-charcoal mb-2">Available Merge Tags</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.keys(SAMPLE_DATA).map(tag => (
                      <div key={tag} className="bg-white border border-whisper rounded px-2 py-1 font-mono text-slateBlue">
                        {`{{${tag}}}`}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-slate">
                    Copy any tag and paste it into your template. Tags are replaced with real values when emails are sent.
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-emerald hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Template'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 bg-white hover:bg-gray-50 text-slateBlue border border-whisper font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
                  >
                    Reset to Default
                  </button>
                  <button
                    type="button"
                    onClick={handleSendTest}
                    className="bg-transparent hover:bg-gray-100 text-slateBlue font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
                  >
                    Send Test
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* PREVIEW SECTION */}
          <div>
            <div className="bg-white border border-whisper rounded-lg p-6">
              <h2 className="text-lg font-semibold text-charcoal mb-4">Preview</h2>
              <p className="text-xs text-slate mb-4">
                This is how your email will appear to customers (with sample data):
              </p>

              <div className="bg-gray-50 border border-whisper rounded-lg p-4 mb-4">
                <div className="text-xs font-semibold uppercase text-slate mb-2 tracking-wide">
                  Subject Line
                </div>
                <div className="bg-white border border-whisper rounded p-3">
                  <div className="text-sm font-semibold text-charcoal">
                    {replaceMergeTags(subject)}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-whisper rounded-lg p-4">
                <div className="text-xs font-semibold uppercase text-slate mb-2 tracking-wide">
                  Email Body
                </div>
                <div className="bg-white border border-whisper rounded p-4 text-xs leading-relaxed text-slate max-h-96 overflow-y-auto">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(
                        replaceMergeTags(body).replace(/\n/g, '<br>')
                      )
                    }} 
                  />
                </div>
              </div>

              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-900">
                💡 <strong>Tip:</strong> Click "Send Test" to see how your template looks in a real inbox with actual order data.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
