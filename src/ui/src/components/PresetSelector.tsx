import React, { useState, useEffect } from 'react';
import type { Pipeline } from '../types';
import { PRESET_CATEGORIES, getPreset, type PresetDefinition } from '../presets';
import { FormatConverter } from './FormatConverter';
import { SettingsPanel } from './SettingsPanel';

interface PresetSelectorProps {
  onPipelineChange: (pipeline: Pipeline) => void;
  onPresetNameChange: (name: string) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onPipelineChange,
  onPresetNameChange,
}) => {
  // State management
  const [selectedPresetName, setSelectedPresetName] = useState<string>(''); // Empty by default - user must select
  const [cropEnabled, setCropEnabled] = useState<boolean>(false);
  const [cropMode, setCropMode] = useState<'pixels' | 'percent'>('pixels'); // Crop by pixels or percentage
  const [cropTop, setCropTop] = useState<number>(0);
  const [cropBottom, setCropBottom] = useState<number>(0);
  const [cropLeft, setCropLeft] = useState<number>(0);
  const [cropRight, setCropRight] = useState<number>(0);
  const [convertFormat, setConvertFormat] = useState<'jpg' | 'png' | 'webp'>('webp');
  const [convertQuality, setConvertQuality] = useState<number>(85);

  const currentPreset = getPreset(selectedPresetName);

  // Build pipeline whenever settings change
  useEffect(() => {
    buildAndUpdatePipeline();
  }, [
    selectedPresetName,
    cropEnabled,
    cropMode,
    cropTop,
    cropBottom,
    cropLeft,
    cropRight,
    convertFormat,
    convertQuality,
  ]);

  const buildAndUpdatePipeline = () => {
    const preset = getPreset(selectedPresetName);
    if (!preset) return;

    // For custom settings, don't build pipeline here (managed by SettingsPanel)
    if (preset.special === 'custom') {
      onPresetNameChange(selectedPresetName);
      return;
    }

    const operations: any[] = [];

    // Add crop operations first (if enabled)
    if (cropEnabled) {
      // Convert percentage to pixels if needed (assume base 1000px for percentage calculations)
      const getPixelValue = (value: number) => {
        if (cropMode === 'percent') {
          // Convert percentage to pixels (10% = 100px at 1000px base)
          // This is approximate - actual conversion happens during processing based on real image dimensions
          return Math.round(value * 10); // 10% -> 100px
        }
        return value;
      };

      if (cropTop > 0) operations.push({ op: 'crop', edge: 'top', value: getPixelValue(cropTop) });
      if (cropBottom > 0) operations.push({ op: 'crop', edge: 'bottom', value: getPixelValue(cropBottom) });
      if (cropLeft > 0) operations.push({ op: 'crop', edge: 'left', value: getPixelValue(cropLeft) });
      if (cropRight > 0) operations.push({ op: 'crop', edge: 'right', value: getPixelValue(cropRight) });
    }

    // Add preset-specific operations
    if (preset.special === 'convert-only') {
      // Just Convert: only format conversion
      operations.push({
        op: 'convert',
        format: convertFormat,
        quality: convertQuality,
        stripMetadata: true,
      });
    } else if (preset.pipeline) {
      // Regular preset: add all operations from preset
      operations.push(...preset.pipeline.pipeline);
    }

    const newPipeline: Pipeline = {
      name: preset.name,
      pipeline: operations,
    };

    onPipelineChange(newPipeline);
    onPresetNameChange(selectedPresetName);
  };

  const handlePresetChange = (presetName: string) => {
    if (!presetName) return; // Don't process empty selection
    setSelectedPresetName(presetName);
  };

  const handleResetCrop = () => {
    setCropTop(0);
    setCropBottom(0);
    setCropLeft(0);
    setCropRight(0);
  };

  // Generate dynamic action preview based on current settings
  const getActionPreview = (): string[] => {
    if (!currentPreset) return [];

    const actions = [...(currentPreset.actions || [])];

    // Add crop actions if enabled
    if (cropEnabled && (cropTop > 0 || cropBottom > 0 || cropLeft > 0 || cropRight > 0)) {
      const suffix = cropMode === 'percent' ? '%' : 'px';
      const cropParts: string[] = [];
      if (cropTop > 0) cropParts.push(`${cropTop}${suffix} from top`);
      if (cropBottom > 0) cropParts.push(`${cropBottom}${suffix} from bottom`);
      if (cropLeft > 0) cropParts.push(`${cropLeft}${suffix} from left`);
      if (cropRight > 0) cropParts.push(`${cropRight}${suffix} from right`);

      if (cropParts.length > 0) {
        actions.unshift(`Remove ${cropParts.join(', ')}`);
      }
    }

    // Update format-specific actions for "Just Convert"
    if (currentPreset.special === 'convert-only') {
      return [
        'Keep original dimensions',
        `Convert to ${convertFormat.toUpperCase()} format${convertFormat !== 'png' ? ` (${convertQuality}% quality)` : ''}`,
        'Remove metadata for privacy',
      ];
    }

    return actions;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">1. Choose What To Do</h2>

      {/* Preset Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Task:
        </label>
        <select
          value={selectedPresetName}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="input-field text-base"
        >
          <option value="">-- Please select a task --</option>
          {PRESET_CATEGORIES.map((category) => (
            <optgroup key={category.category} label={category.category}>
              {category.presets.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.shortName || preset.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {!selectedPresetName && (
          <p className="text-sm text-gray-500 mt-2 italic">
            👆 Choose a task to get started
          </p>
        )}
        {currentPreset && (
          <p className="text-sm text-gray-600 mt-2 italic">
            {currentPreset.description}
          </p>
        )}
      </div>

      {/* Action Preview (only show when preset is selected) */}
      {selectedPresetName && currentPreset && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p className="font-semibold text-green-900 text-sm mb-2 flex items-center gap-2">
            <span>✓</span> What will happen:
          </p>
          <ul className="space-y-1">
            {getActionPreview().map((action, index) => (
              <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conditional Content Based on Preset Type */}

      {/* Format Converter (for "Just Convert Format") */}
      {currentPreset?.special === 'convert-only' && (
        <FormatConverter
          format={convertFormat}
          quality={convertQuality}
          onFormatChange={setConvertFormat}
          onQualityChange={setConvertQuality}
        />
      )}

      {/* Settings Panel (for "Custom Settings") */}
      {currentPreset?.special === 'custom' && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded mb-4">
            ⚙️ <strong>Advanced Mode:</strong> You have full control over all settings below.
          </p>
          <SettingsPanel
            embedded={true}
            pipeline={{ pipeline: [] }}
            onChange={onPipelineChange}
          />
        </div>
      )}

      {/* Crop Addon (available for all presets except Custom Settings) */}
      {currentPreset?.special !== 'custom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cropEnabled}
                onChange={(e) => setCropEnabled(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                ✂️ Add Crop (optional)
              </span>
            </label>

            {cropEnabled && (
              <button
                onClick={handleResetCrop}
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                Reset crop values
              </button>
            )}
          </div>

          {cropEnabled && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {/* Crop Mode Toggle */}
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs font-medium text-gray-700">Crop by:</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="cropMode"
                      value="pixels"
                      checked={cropMode === 'pixels'}
                      onChange={(e) => setCropMode('pixels')}
                      className="w-3 h-3 text-primary-600"
                    />
                    <span className="text-xs text-gray-700">Pixels</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="cropMode"
                      value="percent"
                      checked={cropMode === 'percent'}
                      onChange={(e) => setCropMode('percent')}
                      className="w-3 h-3 text-primary-600"
                    />
                    <span className="text-xs text-gray-700">Percentage</span>
                  </label>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-3">
                Remove {cropMode === 'pixels' ? 'pixels' : 'percentage'} from each edge:
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
                    value={cropBottom}
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
                    value={cropLeft}
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
                    value={cropRight}
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
                  ℹ️ Percentage values are approximate and calculated based on image dimensions
                </p>
              )}
            </div>
          )}

          {!cropEnabled && (
            <p className="text-xs text-gray-500 italic">
              💡 Enable crop to remove unwanted edges or borders from images
            </p>
          )}
        </div>
      )}
    </div>
  );
};
