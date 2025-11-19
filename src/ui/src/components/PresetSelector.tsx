import React, { useState } from 'react';
import type { Pipeline } from '../types';
import { BUILT_IN_PRESETS, getPreset } from '../presets';

interface PresetSelectorProps {
  onPresetSelected: (pipeline: Pipeline) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onPresetSelected }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const handlePresetChange = (presetName: string) => {
    if (!presetName) return;

    setSelectedPreset(presetName);

    const preset = getPreset(presetName);
    if (preset) {
      console.log(`[Preset] Loading: ${preset.name}`);
      onPresetSelected(preset.pipeline);
    } else {
      console.error('Preset not found:', presetName);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Quick Presets</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose a preset workflow
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="input-field"
        >
          <option value="">Select a preset...</option>
          {BUILT_IN_PRESETS.map((preset) => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
        {selectedPreset && (
          <p className="text-xs text-green-600 bg-green-50 p-2 rounded mt-2">
            ✓ {BUILT_IN_PRESETS.find(p => p.name === selectedPreset)?.description}
          </p>
        )}
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-medium">Available presets:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-500">
          {BUILT_IN_PRESETS.map((preset) => (
            <li key={preset.name}>
              <strong>{preset.name}:</strong> {preset.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
