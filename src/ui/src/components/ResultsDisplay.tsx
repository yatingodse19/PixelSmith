import React from 'react';
import type { ProcessingResult } from '../types';

interface ResultsDisplayProps {
  results: ProcessingResult[];
  onClear: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onClear }) => {
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Results</h2>
        <button onClick={onClear} className="btn-secondary text-sm">
          Clear
        </button>
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
                  className="btn-primary text-sm whitespace-nowrap"
                >
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
