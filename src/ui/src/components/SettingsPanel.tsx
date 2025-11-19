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
  const [cropTop, setCropTop] = React.useState<number>(0);
  const [stripMetadata, setStripMetadata] = React.useState<boolean>(true);
  const [progressive, setProgressive] = React.useState<boolean>(false);

  const updatePipeline = () => {
    const operations: Pipeline['pipeline'] = [];

    // Add metadata autorotate
    operations.push({ op: 'metadata', autorotate: true });

    // Add crop if specified
    if (cropTop > 0) {
      operations.push({ op: 'crop', edge: 'top', value: cropTop });
    }

    // Add resize
    if (resizeMode === 'width') {
      operations.push({ op: 'resize', mode: 'width', width: resizeWidth, noUpscale: true });
    } else if (resizeMode === 'height') {
      operations.push({ op: 'resize', mode: 'height', height: resizeHeight, noUpscale: true });
    } else if (resizeMode === 'contain') {
      operations.push({
        op: 'resize',
        mode: 'contain',
        width: resizeWidth,
        height: resizeHeight,
        noUpscale: true,
      });
    }

    // Add convert
    operations.push({
      op: 'convert',
      format: outputFormat,
      quality,
      progressive: progressive && outputFormat === 'jpg',
    });

    // Strip metadata
    if (stripMetadata) {
      operations.push({ op: 'metadata', strip: true });
    }

    onChange({
      ...pipeline,
      pipeline: operations,
    });
  };

  React.useEffect(() => {
    updatePipeline();
  }, [resizeMode, resizeWidth, resizeHeight, outputFormat, quality, cropTop, stripMetadata, progressive]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      {/* Resize Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Resize</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode
          </label>
          <select
            value={resizeMode}
            onChange={(e) => setResizeMode(e.target.value)}
            className="input-field"
          >
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
      </div>

      {/* Crop Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Crop</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crop from top (px)
          </label>
          <input
            type="number"
            value={cropTop}
            onChange={(e) => setCropTop(parseInt(e.target.value) || 0)}
            className="input-field"
            min="0"
            max="4000"
          />
        </div>
      </div>

      {/* Format Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Format & Compression</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="input-field"
          >
            <option value="jpg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="avif">AVIF</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality: {quality}
          </label>
          <input
            type="range"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-full"
            min="1"
            max="100"
          />
        </div>

        {outputFormat === 'jpg' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="progressive"
              checked={progressive}
              onChange={(e) => setProgressive(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <label htmlFor="progressive" className="text-sm font-medium text-gray-700">
              Progressive JPEG
            </label>
          </div>
        )}
      </div>

      {/* Metadata Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Metadata</h3>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="strip"
            checked={stripMetadata}
            onChange={(e) => setStripMetadata(e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded"
          />
          <label htmlFor="strip" className="text-sm font-medium text-gray-700">
            Strip EXIF metadata
          </label>
        </div>
      </div>
    </div>
  );
};
