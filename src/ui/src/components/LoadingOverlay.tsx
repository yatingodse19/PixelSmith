import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: {
    current: number;
    total: number;
  };
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Processing...',
  progress
}) => {
  if (!isVisible) return null;

  const progressPercentage = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        {/* Animated Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-20 h-20 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600"></div>

            {/* Inner pulsing circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-primary-100 rounded-full animate-pulse flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {message}
        </h3>

        {/* Progress Info */}
        {progress && (
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Processing <span className="font-semibold text-primary-600">{progress.current}</span> of{' '}
                <span className="font-semibold text-primary-600">{progress.total}</span> images
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              </div>
            </div>

            {/* Percentage */}
            <p className="text-center text-sm font-medium text-gray-700">
              {progressPercentage}% Complete
            </p>
          </div>
        )}

        {/* Tip */}
        <p className="text-xs text-gray-500 text-center mt-4">
          ✨ All processing happens locally on your device
        </p>
      </div>

      {/* Add shimmer animation to CSS */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};
