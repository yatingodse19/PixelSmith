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

  const successCount = results.filter(r => r.success).length;
  const failedCount = results.length - successCount;
  const totalInputSize = results.reduce((sum, r) => sum + (r.inputSize || 0), 0);
  const totalOutputSize = results.reduce((sum, r) => sum + (r.outputSize || 0), 0);
  const savings = totalInputSize > 0 ? ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1) : '0';

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleDownloadAll = async () => {
    const successfulResults = results.filter(r => r.success && r.outputUrl);

    if (successfulResults.length === 0) {
      alert('No images to download');
      return;
    }

    if (successfulResults.length === 1) {
      // Single file - direct download
      const url = `http://localhost:3001${successfulResults[0].outputUrl}`;
      const link = document.createElement('a');
      link.href = url;
      link.download = successfulResults[0].outputPath?.split('/').pop() || 'image';
      link.click();
      return;
    }

    // Multiple files - create ZIP
    setDownloading(true);
    try {
      const zip = new JSZip();

      // Fetch all images and add to zip
      for (const result of successfulResults) {
        if (!result.outputUrl) continue;

        const url = `http://localhost:3001${result.outputUrl}`;
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = result.outputPath?.split('/').pop() || `image_${Date.now()}.jpg`;

        zip.file(filename, blob);
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `pixelsmith_${Date.now()}.zip`;
      link.click();

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
          {successCount > 0 && (
            <button
              onClick={handleDownloadAll}
              disabled={downloading}
              className="btn-primary text-sm flex items-center gap-2"
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
                  Download All ({successCount})
                </>
              )}
            </button>
          )}
          <button onClick={onClear} className="btn-secondary text-sm">
            Clear
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Success</p>
          <p className="text-2xl font-bold text-green-600">{successCount}</p>
        </div>
        {failedCount > 0 && (
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600">{failedCount}</p>
          </div>
        )}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Input Size</p>
          <p className="text-2xl font-bold text-blue-600">{formatSize(totalInputSize)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Saved</p>
          <p className="text-2xl font-bold text-purple-600">{savings}%</p>
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
                  {result.inputPath.split('/').pop() || result.inputPath}
                </p>
                {result.success ? (
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {result.width && result.height && (
                      <p>Dimensions: {result.width}×{result.height}</p>
                    )}
                    {result.inputSize && result.outputSize && (
                      <p>
                        Size: {formatSize(result.inputSize)} → {formatSize(result.outputSize)}
                        {' '}
                        ({((1 - result.outputSize / result.inputSize) * 100).toFixed(1)}% smaller)
                      </p>
                    )}
                    {result.duration && <p>Processed in {result.duration}ms</p>}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-red-600">
                    Error: {result.error || 'Unknown error'}
                  </p>
                )}
              </div>
              {result.success && result.outputUrl && (
                <a
                  href={`http://localhost:3001${result.outputUrl}`}
                  download
                  className="btn-primary text-sm whitespace-nowrap flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              )}
            </div>
            {result.success && result.outputUrl && (
              <div className="mt-3">
                <img
                  src={`http://localhost:3001${result.outputUrl}`}
                  alt="Processed"
                  className="max-w-xs rounded border border-gray-200"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
