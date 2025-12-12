import React from 'react';
import type { Pipeline } from '../types';

interface SettingsPanelProps {
  pipeline: Pipeline;
  onChange: (pipeline: Pipeline) => void;
  embedded?: boolean; // NEW: Whether panel is embedded in another component
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ pipeline, onChange, embedded = false }) => {
  const [resizeMode, setResizeMode] = React.useState<string>('none');
  const [resizeWidth, setResizeWidth] = React.useState<number>(1024);
  const [resizeHeight, setResizeHeight] = React.useState<number>(768);
  const [outputFormat, setOutputFormat] = React.useState<string>('auto');
  const [quality, setQuality] = React.useState<number>(85);
  const [noUpscale, setNoUpscale] = React.useState<boolean>(true);

  // Enhanced crop options
  const [enableCrop, setEnableCrop] = React.useState<boolean>(false);
  const [cropMode, setCropMode] = React.useState<'pixels' | 'percent'>('pixels');
  const [cropTop, setCropTop] = React.useState<number>(0);
  const [cropBottom, setCropBottom] = React.useState<number>(0);
  const [cropLeft, setCropLeft] = React.useState<number>(0);
  const [cropRight, setCropRight] = React.useState<number>(0);

  // Privacy & metadata options
  const [progressive, setProgressive] = React.useState<boolean>(false);
  const [stripMetadata, setStripMetadata] = React.useState<boolean>(true); // Always true by default

  const updatePipeline = () => {
    const operations: Pipeline['pipeline'] = [];

    // Add crop operations if enabled
    if (enableCrop) {
      if (cropTop > 0) {
        operations.push({ op: 'crop', edge: 'top', value: cropTop, mode: cropMode });
      }
      if (cropBottom > 0) {
        operations.push({ op: 'crop', edge: 'bottom', value: cropBottom, mode: cropMode });
      }
      if (cropLeft > 0) {
        operations.push({ op: 'crop', edge: 'left', value: cropLeft, mode: cropMode });
      }
      if (cropRight > 0) {
        operations.push({ op: 'crop', edge: 'right', value: cropRight, mode: cropMode });
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
      progressive,
      stripMetadata,
    });

    onChange({
      ...pipeline,
      pipeline: operations,
    });
  };

  React.useEffect(() => {
    updatePipeline();
  }, [resizeMode, resizeWidth, resizeHeight, outputFormat, quality, enableCrop, cropMode, cropTop, cropBottom, cropLeft, cropRight, noUpscale, progressive, stripMetadata]);

  return (
    <div className={embedded ? 'space-y-6' : 'bg-white rounded-xl shadow-lg p-6 space-y-6'}>
      {!embedded && <h2 className="text-2xl font-bold text-gray-800">1. Configure Settings</h2>}

      {/* Resize Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span>📐</span> Resize
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resize Mode
          </label>
          <select
            value={resizeMode}
            onChange={(e) => setResizeMode(e.target.value)}
            className="input-field"
          >
            <option value="none">No Resize (keep original size)</option>
            <option value="width">Resize by Width</option>
            <option value="height">Resize by Height</option>
            <option value="contain">Fit in Box (width × height)</option>
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
        <div className="flex items-center gap-3">
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
            {/* Crop Mode Toggle */}
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm font-medium text-gray-700">Crop by:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cropMode"
                  value="pixels"
                  checked={cropMode === 'pixels'}
                  onChange={() => setCropMode('pixels')}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">Pixels</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cropMode"
                  value="percent"
                  checked={cropMode === 'percent'}
                  onChange={() => setCropMode('percent')}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-gray-700">Percentage</span>
              </label>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Remove from each edge {cropMode === 'pixels' ? '(in pixels)' : '(in percentage)'}:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⬆️ From Top
                </label>
                <input
                  type="number"
                  value={cropTop === 0 ? '' : cropTop}
                  onChange={(e) => setCropTop(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  max={cropMode === 'pixels' ? 4000 : 100}
                  placeholder="0"
                />
                <span className="text-xs text-gray-500 ml-1">
                  {cropMode === 'pixels' ? 'px' : '%'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⬇️ From Bottom
                </label>
                <input
                  type="number"
                  value={cropBottom === 0 ? '' : cropBottom}
                  onChange={(e) => setCropBottom(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  max={cropMode === 'pixels' ? 4000 : 100}
                  placeholder="0"
                />
                <span className="text-xs text-gray-500 ml-1">
                  {cropMode === 'pixels' ? 'px' : '%'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⬅️ From Left
                </label>
                <input
                  type="number"
                  value={cropLeft === 0 ? '' : cropLeft}
                  onChange={(e) => setCropLeft(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  max={cropMode === 'pixels' ? 4000 : 100}
                  placeholder="0"
                />
                <span className="text-xs text-gray-500 ml-1">
                  {cropMode === 'pixels' ? 'px' : '%'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ➡️ From Right
                </label>
                <input
                  type="number"
                  value={cropRight === 0 ? '' : cropRight}
                  onChange={(e) => setCropRight(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  max={cropMode === 'pixels' ? 4000 : 100}
                  placeholder="0"
                />
                <span className="text-xs text-gray-500 ml-1">
                  {cropMode === 'pixels' ? 'px' : '%'}
                </span>
              </div>
            </div>

            {cropMode === 'percent' && (
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
                ℹ️ Percentage values are calculated based on actual image dimensions
              </p>
            )}

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
            <option value="auto">Keep Original Format (PNG/JPEG/WebP)</option>
            <option value="jpg">JPEG (lossy, smaller files)</option>
            <option value="webp">WebP (lossy, best compression)</option>
            <option value="png">PNG (lossless, larger files)</option>
          </select>
          {outputFormat === 'auto' && (
            <p className="text-xs text-green-600 bg-green-50 p-2 rounded mt-2">
              ✅ <strong>Original format preserved</strong> - PNG stays PNG, JPEG stays JPEG. Quality applies to lossy formats.
            </p>
          )}
          {outputFormat === 'webp' && (
            <p className="text-xs text-green-600 bg-green-50 p-2 rounded mt-2">
              ✅ <strong>WebP format</strong> - Typically 25-35% smaller than JPEG at same quality. Great for web!
            </p>
          )}
          {outputFormat === 'png' && (
            <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded mt-2">
              ℹ️ <strong>PNG is lossless</strong> - Quality slider has no effect. Best for graphics with transparency.
            </p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${outputFormat === 'jpg' || outputFormat === 'webp' || outputFormat === 'auto' ? 'text-gray-700' : 'text-gray-400'}`}>
            Quality: <span className={outputFormat === 'jpg' || outputFormat === 'webp' || outputFormat === 'auto' ? 'text-primary-600 font-bold' : 'text-gray-400 font-bold'}>{quality}</span>
            {outputFormat === 'png' && <span className="text-xs ml-2">(not used for PNG)</span>}
            {outputFormat === 'auto' && <span className="text-xs ml-2 text-gray-500">(applies to lossy formats)</span>}
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
            <span>Lower (smaller file)</span>
            <span>Higher (better quality)</span>
          </div>
        </div>
      </div>

      {/* Privacy & Metadata */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span>🔒</span> Privacy & Metadata
        </h3>

        <div className="space-y-3">
          {/* Progressive JPEG */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={progressive}
              onChange={(e) => setProgressive(e.target.checked)}
              disabled={outputFormat !== 'jpg'}
              className={`w-4 h-4 rounded ${outputFormat === 'jpg' ? 'text-primary-600 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            />
            <div className="flex-1">
              <span className={`text-sm font-medium ${outputFormat === 'jpg' ? 'text-gray-700' : 'text-gray-400'}`}>
                Progressive JPEG
              </span>
              <p className="text-xs text-gray-500">
                Loads gradually (top to bottom). Slightly larger files but better user experience.
                {outputFormat !== 'jpg' && <span className="text-amber-600"> (JPEG only)</span>}
              </p>
            </div>
          </label>

          {/* Strip EXIF Metadata */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={stripMetadata}
              onChange={(e) => setStripMetadata(e.target.checked)}
              className="w-4 h-4 rounded text-primary-600 cursor-pointer"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                Strip EXIF Metadata <span className="text-blue-600 text-xs">(Recommended)</span>
              </span>
              <p className="text-xs text-gray-500">
                Removes camera info, GPS location, timestamps for privacy. Enabled by default.
              </p>
            </div>
          </label>

          <div className={`border-l-4 p-3 rounded mt-2 ${stripMetadata ? 'bg-green-50 border-green-400' : 'bg-amber-50 border-amber-400'}`}>
            <p className={`text-xs ${stripMetadata ? 'text-green-800' : 'text-amber-800'}`}>
              {stripMetadata ? (
                <>✓ <strong>Privacy-first:</strong> EXIF metadata will be removed from processed images.</>
              ) : (
                <>⚠️ <strong>Privacy notice:</strong> EXIF metadata will be preserved. This may include GPS location, camera info, and timestamps.</>
              )}
            </p>
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
