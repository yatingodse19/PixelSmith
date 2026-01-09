import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesSelected, multiple = true }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.heic']
    },
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
        transition-all duration-200
        ${isDragActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-102'
          : 'border-gray-400 dark:border-gray-500 hover:border-primary-400 dark:hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <svg
          className={`w-16 h-16 ${isDragActive ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {isDragActive ? (
          <p className="text-lg font-medium text-primary-600 dark:text-primary-400">
            Drop your images here...
          </p>
        ) : (
          <>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Drag and Drop Images Here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports JPG, PNG, WebP, AVIF, TIFF, HEIC
              {multiple && ' (multiple files supported)'}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
