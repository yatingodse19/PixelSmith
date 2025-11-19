import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FileDropzone } from './components/FileDropzone';
import { SettingsPanel } from './components/SettingsPanel';
import { PresetSelector } from './components/PresetSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingOverlay } from './components/LoadingOverlay';
import type { Pipeline, ProcessingResult } from './types';
import { processImageWASM, processBatchWASM, type ProcessingOptions } from './utils/wasmImageProcessor';

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline>({
    pipeline: [
      { op: 'resize', mode: 'width', width: 1024, noUpscale: true },
      { op: 'convert', format: 'jpg', quality: 85 },
    ],
  });
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
          toast.success('✓ Image processed successfully!', {
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
          `✓ Processed ${successful} image(s) successfully${failed > 0 ? ` (${failed} failed)` : ''}`,
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

  const handlePresetSelected = (newPipeline: Pipeline) => {
    setPipeline(newPipeline);
    toast.success(`Preset "${newPipeline.name}" loaded`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
        theme="light"
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎨 PixelSmith
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Privacy-first image processing • 100% browser-based • WebAssembly powered
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">🔒 All Local</p>
              <p className="text-xs text-gray-500">No internet required</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - File Upload */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                1. Select Images
              </h2>
              <FileDropzone onFilesSelected={handleFilesSelected} />
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected files ({selectedFiles.length}):
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        {file.name}
                        <span className="text-gray-400">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Process Button */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                3. Process Images
              </h2>
              <button
                onClick={handleProcess}
                disabled={processing || selectedFiles.length === 0}
                className={`
                  w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200
                  ${processing || selectedFiles.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
              {selectedFiles.length === 0 && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Select images to begin
                </p>
              )}
            </div>

            {/* Results */}
            {results.length > 0 && (
              <ResultsDisplay results={results} onClear={handleClearResults} />
            )}
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <PresetSelector onPresetSelected={handlePresetSelected} />
            <SettingsPanel pipeline={pipeline} onChange={setPipeline} />

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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            PixelSmith v1.0.0 • Built with ♥️ for privacy •
            <a href="https://github.com/yatingodse19/PixelSmith" className="text-primary-600 hover:underline ml-1">
              Open Source
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
