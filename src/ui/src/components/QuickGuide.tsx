import React from 'react';

interface QuickGuideProps {
  selectedPreset: string;
}

export const QuickGuide: React.FC<QuickGuideProps> = ({ selectedPreset }) => {
  // Get context-aware tips based on selected preset
  const getContextualTips = (): string[] => {
    if (selectedPreset.includes('Web')) {
      return [
        'Original format is preserved (PNG/JPEG/WebP)',
        'Quality 85 is perfect for web',
        'Enable crop to remove unwanted edges',
      ];
    } else if (selectedPreset.includes('Convert')) {
      return [
        'PNG is lossless but larger file size',
        'WebP offers best compression',
        'Always preview before batch converting',
      ];
    } else if (selectedPreset.includes('Thumbnail')) {
      return [
        '300px is perfect for preview images',
        'Original format preserved, just resized',
        'Batch process multiple images at once',
      ];
    } else if (selectedPreset.includes('Email')) {
      return [
        '600px width keeps attachments small',
        'Quality 70 reduces file size significantly',
        'Keep files under 1MB for compatibility',
      ];
    } else if (selectedPreset.includes('Social')) {
      return [
        '1080x1080 is perfect for Instagram',
        'Quality 85 looks great on mobile',
        'Use crop to focus on the important part',
      ];
    } else if (selectedPreset.includes('Custom')) {
      return [
        'Full control over all settings',
        'Preview results before batch processing',
        'Use "No upscale" to avoid quality loss',
      ];
    }

    // Default tips
    return [
      'Select a task to get started',
      'Original format is always preserved',
      'Batch process multiple images at once',
    ];
  };

  return (
    <>
      {/* Privacy Notice Box - Reduced prominence */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 h-full">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5"
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
            <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
              100% Private
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              Images never leave your device
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tips Box - Reduced prominence */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 h-full">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">
          Tips
        </h3>
        <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
          {getContextualTips().map((tip, index) => (
            <li key={index} className="flex items-start gap-1.5">
              <span className="text-gray-400 dark:text-gray-500 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Features Box - Reduced prominence */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 h-full">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-2">
          Features
        </h3>
        <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <li className="flex items-start gap-1.5">
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span>Resize, crop, and convert</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span>Preserves or changes format</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span>Removes EXIF metadata</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span>Batch processing</span>
          </li>
        </ul>
      </div>
    </>
  );
};
