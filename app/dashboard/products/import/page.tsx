'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImportResult {
  success: boolean;
  imported: number;
  errors: number;
  errorDetails: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export default function ImportProductsPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setError('');
    setResult(null);
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File must be smaller than 10MB');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Import failed');
        setUploading(false);
        return;
      }

      setResult(data);
      setUploading(false);
    } catch (err: any) {
      setError(err.message || 'Import failed');
      setUploading(false);
    }
  };

  const downloadErrorReport = () => {
    if (!result || !result.errorDetails || result.errorDetails.length === 0) return;
    
    const csvContent = [
      'Row,Field,Error',
      ...result.errorDetails.map(err => 
        `${err.row},"${err.field}","${err.message.replace(/"/g, '""')}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-errors-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (result) {
    const hasErrors = result.errors > 0;
    const totalRows = result.imported + result.errors;
    
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-white border-b border-whisper px-6 py-6">
          <h1 className="text-3xl font-bold text-charcoal">Import Results</h1>
          <p className="text-slate text-sm mt-1">Summary of your CSV product import</p>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white border border-whisper rounded-lg p-8">
            {/* Result Summary Banner */}
            {hasErrors ? (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-5 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">⚠️</div>
                  <div className="text-lg font-bold text-amber-900">Import Complete with Errors</div>
                </div>
                <div className="text-sm text-amber-900">
                  <strong>{result.imported} products imported successfully</strong>, but {result.errors} rows had issues and were skipped. 
                  Please review the errors below and re-upload those items.
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-5 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">✅</div>
                  <div className="text-lg font-bold text-emerald-900">Import Successful</div>
                </div>
                <div className="text-sm text-emerald-900">
                  All {result.imported} products have been imported successfully!
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`${result.imported > 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-whisper'} border rounded-lg p-4 text-center`}>
                <div className={`text-4xl font-bold mb-1 ${result.imported > 0 ? 'text-emerald-700' : 'text-slate'}`}>
                  {result.imported}
                </div>
                <div className="text-xs text-slate uppercase tracking-wide font-semibold">Imported</div>
              </div>
              <div className={`${result.errors > 0 ? 'bg-rose-50 border-rose-300' : 'bg-gray-50 border-whisper'} border rounded-lg p-4 text-center`}>
                <div className={`text-4xl font-bold mb-1 ${result.errors > 0 ? 'text-rose-700' : 'text-slate'}`}>
                  {result.errors}
                </div>
                <div className="text-xs text-slate uppercase tracking-wide font-semibold">Failed</div>
              </div>
              <div className="bg-gray-50 border border-whisper rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-charcoal mb-1">{totalRows}</div>
                <div className="text-xs text-slate uppercase tracking-wide font-semibold">Total Rows</div>
              </div>
            </div>

            {/* Error Details */}
            {result.errorDetails && result.errorDetails.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-charcoal mb-4">Issues Found ({result.errors})</h2>
                <div className="bg-rose-50 border border-rose-200 rounded-lg overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    {result.errorDetails.map((err, idx) => (
                      <div key={idx} className="border-b border-rose-200 last:border-b-0 p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="bg-rose-200 text-rose-900 text-xs font-semibold px-3 py-1.5 rounded">
                              Row {err.row}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-rose-900 mb-2">
                              <strong className="text-rose-800">Field: {err.field}</strong>
                            </div>
                            <div className="text-sm text-rose-800">{err.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mt-4">
                  <div className="text-xs text-amber-900">
                    💡 <strong>Next Steps:</strong> Fix the errors above in your CSV file, then re-upload. 
                    The {result.imported} products that imported successfully are already in your shop and visible to customers.
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {hasErrors && (
                <button
                  onClick={downloadErrorReport}
                  className="bg-slate-blue hover:bg-slate-blue/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  📥 Download Error Report (CSV)
                </button>
              )}
              <button
                onClick={() => router.push('/dashboard/products/import')}
                className="bg-white hover:bg-gray-50 border border-whisper text-charcoal font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Upload New File
              </button>
              <button
                onClick={() => router.push('/dashboard/products')}
                className="bg-emerald hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex-1"
              >
                View All Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-whisper px-6 py-4">
        <h1 className="text-2xl font-bold text-charcoal">Import Products from CSV</h1>
        <p className="text-slate text-sm mt-1">Upload a CSV file to quickly add products to your shop</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border border-whisper rounded-lg p-6 sm:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-4 mb-6">
              <strong>Import Failed</strong>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label htmlFor="csvFile" className="block text-sm font-medium text-charcoal mb-2">
                Upload CSV File
              </label>
              
              {!file ? (
                <div
                  className={`border-2 border-dashed ${
                    dragOver ? 'border-emerald bg-green-50' : 'border-whisper bg-gray-50'
                  } rounded-lg p-10 text-center cursor-pointer hover:border-slateBlue hover:bg-blue-50 transition-all`}
                  onClick={() => document.getElementById('csvFile')?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div className="text-4xl mb-3">📄</div>
                  <div className="text-charcoal font-semibold mb-1">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-slate text-xs">
                    CSV file (max 10MB)
                  </div>
                  <input
                    type="file"
                    id="csvFile"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileInputChange}
                    required
                  />
                </div>
              ) : (
                <div className="bg-white border border-whisper rounded-lg p-4 flex items-center gap-3">
                  <div className="text-2xl">✓</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-charcoal">{file.name}</div>
                    <div className="text-xs text-slate mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="bg-red-100 text-rose hover:bg-red-200 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-whisper rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-charcoal mb-3">Expected CSV Format</h3>
              <p className="text-xs text-slate mb-3">
                Your CSV must have headers in the first row:
              </p>
              <ul className="space-y-2 text-xs">
                <li className="pb-2 border-b border-gray-200">
                  <strong className="text-charcoal">title</strong> <span className="text-rose">*</span> 
                  <span className="text-slate ml-2">— Product name (max 200 chars)</span>
                </li>
                <li className="pb-2 border-b border-gray-200">
                  <strong className="text-charcoal">price</strong> <span className="text-rose">*</span> 
                  <span className="text-slate ml-2">— Price in USD (e.g., 19.99)</span>
                </li>
                <li className="pb-2 border-b border-gray-200">
                  <strong className="text-charcoal">description</strong> <span className="text-rose">*</span> 
                  <span className="text-slate ml-2">— Description (max 1000 chars)</span>
                </li>
                <li className="pb-2 border-b border-gray-200">
                  <strong className="text-charcoal">category</strong> <span className="text-rose">*</span> 
                  <span className="text-slate ml-2">— Handmade, Vintage, Supplies, or Other</span>
                </li>
                <li>
                  <strong className="text-charcoal">image_url</strong> 
                  <span className="text-slate ml-2">— Public image URL (optional)</span>
                </li>
              </ul>
              <p className="text-xs text-slate mt-3">
                * = required. Invalid rows will be reported as errors but won't block the import.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!file || uploading}
                className="flex-1 bg-emerald hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {uploading ? 'Importing...' : 'Import Products'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-white hover:bg-gray-50 text-slateBlue border border-whisper font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
