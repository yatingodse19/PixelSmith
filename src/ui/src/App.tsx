import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FileDropzone } from './components/FileDropzone';
import { PresetSelector } from './components/PresetSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingOverlay } from './components/LoadingOverlay';
import { QuickGuide } from './components/QuickGuide';
import { useTheme } from './contexts/ThemeContext';
import type { Pipeline, ProcessingResult } from './types';
import { processImageWASM, processBatchWASM, type ProcessingOptions } from './utils/wasmImageProcessor';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline>({
    pipeline: [
      { op: 'resize', mode: 'width', width: 1024, noUpscale: true },
      { op: 'convert', format: 'webp', quality: 85, stripMetadata: true },
    ],
  });
  const [selectedPresetName, setSelectedPresetName] = useState<string>(''); // Empty by default
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number } | undefined>();
  const [results, setResults] = useState<ProcessingResult[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    toast.success(`${files.length} image(s) selected`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  // Convert Pipeline to ProcessingOptions for WASM processor
  const pipelineToProcessingOptions = (pipeline: Pipeline): ProcessingOptions => {
    const options: ProcessingOptions = {};

    for (const op of pipeline.pipeline) {
      if (op.op === 'resize') {
        options.resize = {
          mode: op.mode || 'none',
          width: op.width,
          height: op.height,
          noUpscale: op.noUpscale,
        };
      } else if (op.op === 'crop') {
        if (!options.crop) {
          options.crop = {};
        }
        if (op.edge === 'top') options.crop.top = op.value;
        if (op.edge === 'bottom') options.crop.bottom = op.value;
        if (op.edge === 'left') options.crop.left = op.value;
        if (op.edge === 'right') options.crop.right = op.value;
        // Set crop mode (pixels or percent) - default to pixels if not specified
        if (op.mode) options.crop.mode = op.mode as 'pixels' | 'percent';
      } else if (op.op === 'convert') {
        options.format = op.format as 'jpg' | 'png' | 'webp' | 'avif';
        options.quality = op.quality;
      }
    }

    return options;
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select images first', {
        position: 'top-center',
      });
      return;
    }

    setProcessing(true);
    setResults([]);
    setProcessingProgress({ current: 0, total: selectedFiles.length });

    try {
      const options = pipelineToProcessingOptions(pipeline);

      if (selectedFiles.length === 1) {
        // Single file processing with WASM
        setProcessingProgress({ current: 1, total: 1 });

        const result = await processImageWASM(selectedFiles[0], options);
        setResults([result]);

        if (result.success) {
          toast.success('Image processed successfully!', {
            position: 'bottom-right',
            autoClose: 3000,
          });
        } else {
          throw new Error(result.error || 'Processing failed');
        }
      } else {
        // Batch processing with WASM
        const results = await processBatchWASM(
          selectedFiles,
          options,
          4, // concurrency
          (current, total) => {
            setProcessingProgress({ current, total });
          }
        );

        setResults(results);

        const successful = results.filter(r => r.success).length;
        const failed = results.length - successful;

        toast.success(
          `Processed ${successful} image(s) successfully${failed > 0 ? ` (${failed} failed)` : ''}`,
          {
            position: 'bottom-right',
            autoClose: 5000,
          }
        );
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        position: 'bottom-right',
        autoClose: 5000,
      });
    } finally {
      setProcessing(false);
      setProcessingProgress(undefined);
    }
  };

  const handleClearResults = () => {
    setResults([]);
    toast.info('Results cleared', {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const handlePipelineChange = (newPipeline: Pipeline) => {
    setPipeline(newPipeline);
  };

  const handlePresetNameChange = (name: string) => {
    setSelectedPresetName(name);
    // Don't show toast on preset change - only on processing success/error
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={processing}
        message={selectedFiles.length === 1 ? 'Processing your image...' : `Processing ${selectedFiles.length} images...`}
        progress={processingProgress}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                PixelSmith
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Fast, private image processing powered by WebAssembly
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">All Local</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">No internet required</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2-Column Layout: Configuration | Upload & Process */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Configuration Options */}
          <div className="space-y-6">
            <PresetSelector
              onPipelineChange={handlePipelineChange}
              onPresetNameChange={handlePresetNameChange}
            />
          </div>

          {/* Right Column: Upload, Process & Results */}
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>Upload Images</span>
              </h2>
              <FileDropzone onFilesSelected={handleFilesSelected} />

              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected files ({selectedFiles.length}):
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        {file.name}
                        <span className="text-gray-400 dark:text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Process Button - Inline with selected files */}
                  <button
                    onClick={handleProcess}
                    disabled={processing || selectedFiles.length === 0}
                    className={`
                      w-full mt-4 py-3 rounded-lg font-semibold text-base transition-all duration-200
                      ${processing || selectedFiles.length === 0
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Process ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
                    )}
                  </button>
                </div>
              )}

              {/* Show disabled CTA when no files selected */}
              {selectedFiles.length === 0 && (
                <button
                  disabled
                  className="w-full mt-4 py-3 rounded-lg font-semibold text-base bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                >
                  Select Images to Process
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results - Full Width Section */}
        {results.length > 0 && (
          <ResultsDisplay results={results} onClear={handleClearResults} />
        )}

        {/* Bottom: Info Boxes in 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickGuide selectedPreset={selectedPresetName} />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            PixelSmith v1.0.0 - Built with care for privacy -
            <a href="https://github.com/yatingodse19/PixelSmith" className="text-primary-600 dark:text-primary-400 hover:underline ml-1">
              Open Source
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
