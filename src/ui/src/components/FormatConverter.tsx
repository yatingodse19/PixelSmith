import React from 'react';

interface FormatConverterProps {
  format: 'jpg' | 'png' | 'webp';
  quality: number;
  onFormatChange: (format: 'jpg' | 'png' | 'webp') => void;
  onQualityChange: (quality: number) => void;
}

export const FormatConverter: React.FC<FormatConverterProps> = ({
  format,
  quality,
  onFormatChange,
  onQualityChange,
}) => {
  const isLossyFormat = format === 'jpg' || format === 'webp';

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-md font-semibold text-gray-700">Format Settings</h3>

      {/* Format Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Convert To:
        </label>
        <select
          value={format}
          onChange={(e) => onFormatChange(e.target.value as 'jpg' | 'png' | 'webp')}
          className="input-field"
        >
          <option value="jpg">JPEG (smaller, lossy)</option>
          <option value="webp">WebP (smallest, lossy, best for web)</option>
          <option value="png">PNG (larger, lossless, best for graphics)</option>
        </select>

        {/* Format hints */}
        {format === 'webp' && (
          <p className="text-xs text-green-600 bg-green-50 p-2 rounded mt-2">
            ✅ <strong>WebP recommended</strong> - Typically 25-35% smaller than JPEG at the same quality
          </p>
        )}
        {format === 'png' && (
          <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
            ℹ️ <strong>PNG is lossless</strong> - Best for graphics with text or transparency. Larger file size.
          </p>
        )}
        {format === 'jpg' && (
          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2">
            ℹ️ <strong>JPEG is universal</strong> - Supported everywhere, good balance of size and quality
          </p>
        )}
      </div>

      {/* Quality Slider (only for lossy formats) */}
      {isLossyFormat && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality: <span className="text-primary-600 font-bold">{quality}</span>
          </label>
          <input
            type="range"
            value={quality}
            onChange={(e) => onQualityChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-primary-600"
            min="1"
            max="100"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low (smaller file)</span>
            <span>High (better quality)</span>
          </div>

          {/* Quality recommendations */}
          <div className="mt-2 text-xs text-gray-600">
            <p className="font-medium mb-1">💡 Recommendations:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>85</strong> - Excellent balance (recommended)</li>
              <li><strong>70-80</strong> - Good for web, smaller files</li>
              <li><strong>90+</strong> - Near-perfect quality, larger files</li>
            </ul>
          </div>
        </div>
      )}

      {!isLossyFormat && (
        <p className="text-sm text-gray-500 italic">
          PNG is always lossless - quality setting not applicable
        </p>
      )}
    </div>
  );
};
