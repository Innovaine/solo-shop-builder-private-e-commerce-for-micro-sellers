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

  if (result) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="bg-white border-b border-whisper px-6 py-4">
          <h1 className="text-2xl font-bold text-charcoal">Import Complete</h1>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white border border-whisper rounded-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-whisper">
                <span className="text-slate text-sm">Products Imported</span>
                <span className="text-charcoal text-lg font-semibold">{result.imported}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate text-sm">Errors</span>
                <span className="text-charcoal text-lg font-semibold">{result.errors}</span>
              </div>
            </div>

            {result.errorDetails && result.errorDetails.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-red-900 mb-2">
                  Issues to review:
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.errorDetails.map((err, idx) => (
                    <div key={idx} className="text-xs text-red-800 border-b border-red-100 pb-2 last:border-0">
                      Row {err.row}, {err.field}: {err.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => router.push('/dashboard/products')}
              className="w-full bg-emerald hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              View Products
            </button>
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
