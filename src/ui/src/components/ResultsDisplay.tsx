import React from 'react';
import JSZip from 'jszip';
import type { ProcessingResult } from '../types';

interface ResultsDisplayProps {
  results: ProcessingResult[];
  onClear: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onClear }) => {
  const [downloading, setDownloading] = React.useState(false);

  if (results.length === 0) return null;

  const successfulResults = results.filter(r => r.success && r.url);
  const failedResults = results.filter(r => !r.success);

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleDownloadAll = async () => {
    if (successfulResults.length === 0) {
      alert('No images to download');
      return;
    }

    if (successfulResults.length === 1) {
      // Single file - direct download
      const result = successfulResults[0];
      if (!result.url) return;

      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Multiple files - create ZIP
    setDownloading(true);
    try {
      const zip = new JSZip();

      // Fetch all blob URLs and add to zip
      for (const result of successfulResults) {
        if (!result.url) continue;

        const response = await fetch(result.url);
        const blob = await response.blob();

        zip.file(result.filename || `image_${Date.now()}.jpg`, blob);
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `pixelsmith_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } catch (error) {
      console.error('Failed to create ZIP:', error);
      alert('Failed to download all images. Try downloading individually.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Results</h2>
        <div className="flex gap-2">
          {successfulResults.length > 0 && (
            <button
              onClick={handleDownloadAll}
              disabled={downloading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating ZIP...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download All ({successfulResults.length})
                </>
              )}
            </button>
          )}
          <button
            onClick={onClear}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">✓ Success</p>
          <p className="text-2xl font-bold text-green-600">{successfulResults.length}</p>
        </div>
        {failedResults.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">✗ Failed</p>
            <p className="text-2xl font-bold text-red-600">{failedResults.length}</p>
          </div>
        )}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-blue-600">{results.length}</p>
        </div>
      </div>

      {/* Individual Results */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${
              result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {result.filename}
                </p>
                {result.success ? (
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {result.size && (
                      <p>Output size: {formatSize(result.size)}</p>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-red-600">
                    Error: {result.error || 'Unknown error'}
                  </p>
                )}
              </div>
              {result.success && result.url && (
                <a
                  href={result.url}
                  download={result.filename}
                  onClick={(e) => {
                    e.preventDefault();
                    const link = document.createElement('a');
                    link.href = result.url!;
                    link.download = result.filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              )}
            </div>
            {result.success && result.url && (
              <div className="mt-3">
                <img
                  src={result.url}
                  alt="Processed"
                  className="max-w-xs rounded border border-gray-200"
                  onError={(e) => {
                    console.error('Image failed to load:', result.url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
