import React, { useEffect, useState } from 'react';
import type { Pipeline } from '../types';

interface PresetSelectorProps {
  onPresetSelected: (pipeline: Pipeline) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onPresetSelected }) => {
  const [presets, setPresets] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const response = await fetch('/api/presets');
      const data = await response.json();
      setPresets(data.presets || []);
    } catch (error) {
      console.error('Failed to fetch presets:', error);
    }
  };

  const handlePresetChange = async (presetName: string) => {
    if (!presetName) return;

    setSelectedPreset(presetName);
    setLoading(true);

    try {
      const response = await fetch(`/api/presets/${presetName}`);
      const pipeline = await response.json();
      onPresetSelected(pipeline);
    } catch (error) {
      console.error('Failed to load preset:', error);
      alert('Failed to load preset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Presets</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="input-field"
          disabled={loading}
        >
          <option value="">Select a preset...</option>
          {presets.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-medium">Available presets:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-500">
          <li>web-large-jpg-1024: 1024px width, JPG 85</li>
          <li>social-square-1080: 1080×1080 square</li>
          <li>png-to-webp-lossless: Lossless WebP</li>
          <li>hq-avif: High-quality AVIF</li>
          <li>crop-top-web-1024: Crop + resize</li>
        </ul>
      </div>
    </div>
  );
};
