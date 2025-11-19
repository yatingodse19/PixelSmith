import React from 'react';
import type { Pipeline } from '../types';

interface SettingsPanelProps {
  pipeline: Pipeline;
  onChange: (pipeline: Pipeline) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ pipeline, onChange }) => {
  const [resizeMode, setResizeMode] = React.useState<string>('width');
  const [resizeWidth, setResizeWidth] = React.useState<number>(1024);
  const [resizeHeight, setResizeHeight] = React.useState<number>(768);
  const [outputFormat, setOutputFormat] = React.useState<string>('jpg');
  const [quality, setQuality] = React.useState<number>(85);
  const [noUpscale, setNoUpscale] = React.useState<boolean>(true);

  // Enhanced crop options
  const [enableCrop, setEnableCrop] = React.useState<boolean>(false);
  const [cropTop, setCropTop] = React.useState<number>(0);
  const [cropBottom, setCropBottom] = React.useState<number>(0);
  const [cropLeft, setCropLeft] = React.useState<number>(0);
  const [cropRight, setCropRight] = React.useState<number>(0);

  const updatePipeline = () => {
    const operations: Pipeline['pipeline'] = [];

    // Add crop operations if enabled
    if (enableCrop) {
      if (cropTop > 0) {
        operations.push({ op: 'crop', edge: 'top', value: cropTop });
      }
      if (cropBottom > 0) {
        operations.push({ op: 'crop', edge: 'bottom', value: cropBottom });
      }
      if (cropLeft > 0) {
        operations.push({ op: 'crop', edge: 'left', value: cropLeft });
      }
      if (cropRight > 0) {
        operations.push({ op: 'crop', edge: 'right', value: cropRight });
      }
    }

    // Add resize (only if not 'none')
    if (resizeMode === 'width') {
      operations.push({ op: 'resize', mode: 'width', width: resizeWidth, noUpscale });
    } else if (resizeMode === 'height') {
      operations.push({ op: 'resize', mode: 'height', height: resizeHeight, noUpscale });
    } else if (resizeMode === 'contain') {
      operations.push({
        op: 'resize',
        mode: 'contain',
        width: resizeWidth,
        height: resizeHeight,
        noUpscale,
      });
    }
    // If resizeMode === 'none', skip resize operation entirely

    // Add convert
    operations.push({
      op: 'convert',
      format: outputFormat,
      quality,
    });

    onChange({
      ...pipeline,
      pipeline: operations,
    });
  };

  React.useEffect(() => {
    updatePipeline();
  }, [resizeMode, resizeWidth, resizeHeight, outputFormat, quality, enableCrop, cropTop, cropBottom, cropLeft, cropRight, noUpscale]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">2. Configure Settings</h2>

      {/* Resize Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span>📐</span> Resize
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode
          </label>
          <select
            value={resizeMode}
            onChange={(e) => setResizeMode(e.target.value)}
            className="input-field"
          >
            <option value="none">None (convert only)</option>
            <option value="width">Width Only</option>
            <option value="height">Height Only</option>
            <option value="contain">Contain (fit in box)</option>
          </select>
        </div>

        {(resizeMode === 'width' || resizeMode === 'contain') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width (px)
            </label>
            <input
              type="number"
              value={resizeWidth}
              onChange={(e) => setResizeWidth(parseInt(e.target.value) || 1024)}
              className="input-field"
              min="1"
              max="8192"
            />
          </div>
        )}

        {(resizeMode === 'height' || resizeMode === 'contain') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Height (px)
            </label>
            <input
              type="number"
              value={resizeHeight}
              onChange={(e) => setResizeHeight(parseInt(e.target.value) || 768)}
              className="input-field"
              min="1"
              max="8192"
            />
          </div>
        )}

        {resizeMode !== 'none' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="noUpscale"
              checked={noUpscale}
              onChange={(e) => setNoUpscale(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <label htmlFor="noUpscale" className="text-sm font-medium text-gray-700">
              Prevent upscaling (don't enlarge small images)
            </label>
          </div>
        )}
      </div>

      {/* Enhanced Crop Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <span>✂️</span> Crop
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={enableCrop}
              onChange={(e) => setEnableCrop(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Enable</span>
          </label>
        </div>

        {enableCrop && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-3">
              Remove pixels from each edge (in pixels):
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⬆️ From Top
                </label>
                <input
                  type="number"
                  value={cropTop}
                  onChange={(e) => setCropTop(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  max="4000"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⬇️ From Bottom
                </label>
                <input
                  type="number"
                  value={cropBottom}
                  onChange={(e) => setCropBottom(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  max="4000"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⬅️ From Left
                </label>
                <input
                  type="number"
                  value={cropLeft}
                  onChange={(e) => setCropLeft(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  max="4000"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ➡️ From Right
                </label>
                <input
                  type="number"
                  value={cropRight}
                  onChange={(e) => setCropRight(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  max="4000"
                  placeholder="0"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setCropTop(0);
                setCropBottom(0);
                setCropLeft(0);
                setCropRight(0);
              }}
              className="text-xs text-gray-600 hover:text-gray-800 underline"
            >
              Reset all crop values
            </button>
          </div>
        )}
      </div>

      {/* Format Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span>🖼️</span> Format & Compression
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="input-field"
          >
            <option value="jpg">JPEG (lossy, quality control)</option>
            <option value="webp">WebP (lossy, quality control, smaller files)</option>
            <option value="png">PNG (lossless, larger files)</option>
            <option value="avif">AVIF → WebP (auto-converted)</option>
          </select>
          {outputFormat === 'webp' && (
            <p className="text-xs text-green-600 bg-green-50 p-2 rounded mt-2">
              ✅ <strong>WebP with quality control</strong> - Typically 25-35% smaller than JPEG at the same quality. Great for web use!
            </p>
          )}
          {outputFormat === 'avif' && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded mt-2">
              ⚠️ AVIF not supported yet - will auto-convert to WebP with quality control
            </p>
          )}
          {outputFormat === 'png' && (
            <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
              ℹ️ PNG is always lossless - Quality slider has no effect. Best for graphics with text or transparency.
            </p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${outputFormat === 'jpg' || outputFormat === 'webp' || outputFormat === 'avif' ? 'text-gray-700' : 'text-gray-400'}`}>
            Quality: <span className={outputFormat === 'jpg' || outputFormat === 'webp' || outputFormat === 'avif' ? 'text-primary-600 font-bold' : 'text-gray-400 font-bold'}>{quality}</span>
            {outputFormat === 'png' && <span className="text-xs ml-2">(not used for PNG)</span>}
          </label>
          <input
            type="range"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            disabled={outputFormat === 'png'}
            className={`w-full h-2 rounded-lg appearance-none ${outputFormat !== 'png' ? 'cursor-pointer bg-gray-200 accent-primary-600' : 'cursor-not-allowed bg-gray-100 opacity-50'}`}
            min="1"
            max="100"
          />
          <div className={`flex justify-between text-xs mt-1 ${outputFormat !== 'png' ? 'text-gray-500' : 'text-gray-400'}`}>
            <span>Low (smaller file)</span>
            <span>High (better quality)</span>
          </div>
        </div>
      </div>

      {/* WebAssembly Info */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-sm text-blue-800">
          ⚡ <strong>WebAssembly-powered:</strong> All processing happens in your browser.
          Images never leave your device!
        </p>
      </div>
    </div>
  );
};
