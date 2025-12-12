import React from 'react';

interface QuickGuideProps {
  selectedPreset: string;
}

export const QuickGuide: React.FC<QuickGuideProps> = ({ selectedPreset }) => {
  // Get context-aware tips based on selected preset
  const getContextualTips = (): string[] => {
    if (selectedPreset.includes('Web')) {
      return [
        'WebP format gives 25-35% smaller files than JPEG',
        'Quality 85 is perfect for web - good balance',
        'Enable crop to remove unwanted edges',
        '1024px width works great for most websites'
      ];
    } else if (selectedPreset.includes('Convert')) {
      return [
        'PNG is lossless but larger file size',
        'JPEG/WebP are lossy - adjust quality slider',
        'WebP offers best compression with great quality',
        'Always preview before batch converting'
      ];
    } else if (selectedPreset.includes('Thumbnail')) {
      return [
        'Thumbnails load faster with lower quality',
        '300px is perfect for preview images',
        'JPEG at quality 75 is great for thumbnails',
        'Batch process multiple images at once'
      ];
    } else if (selectedPreset.includes('Email')) {
      return [
        '600px width keeps email attachments small',
        'Quality 70 reduces file size significantly',
        'Most email clients support JPEG best',
        'Keep files under 1MB for email compatibility'
      ];
    } else if (selectedPreset.includes('Social')) {
      return [
        '1080×1080 is perfect for Instagram posts',
        'Facebook and Instagram prefer square images',
        'Quality 85 looks great on mobile screens',
        'Use crop to focus on the important part'
      ];
    } else if (selectedPreset.includes('Custom')) {
      return [
        'Experiment with different settings',
        'Preview results before batch processing',
        'Save time by creating custom presets',
        'Use "No upscale" to avoid quality loss'
      ];
    }

    // Default tips
    return [
      'Use presets for common tasks',
      'WebP format gives best compression',
      'Quality 85 is a good balance',
      'Batch process multiple images at once'
    ];
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <div>
            <p className="font-semibold text-green-900 text-sm">
              Privacy Protected ⚡ WebAssembly
            </p>
            <p className="text-green-700 text-xs mt-1">
              Lightning-fast processing directly in your browser. Your images never leave your device.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tips (Context-Aware) */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 text-sm mb-3 flex items-center gap-2">
          <span>💡</span> Quick Tips
        </h3>
        <ul className="space-y-2 text-xs text-blue-800">
          {getContextualTips().map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Features Overview */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
        <h3 className="font-semibold text-purple-900 text-sm mb-3 flex items-center gap-2">
          <span>✨</span> Features
        </h3>
        <ul className="space-y-2 text-xs text-purple-800">
          <li className="flex items-start gap-2">
            <span className="text-purple-600">✓</span>
            <span>Resize with multiple modes (width, height, contain)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">✓</span>
            <span>Crop from any edge (top, bottom, left, right)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">✓</span>
            <span>Convert to JPEG, PNG, or WebP with quality control</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">✓</span>
            <span>Automatic EXIF metadata removal for privacy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">✓</span>
            <span>Progressive JPEG for better loading experience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600">✓</span>
            <span>Batch processing with real-time progress</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
