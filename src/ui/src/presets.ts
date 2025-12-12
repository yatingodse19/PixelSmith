/**
 * Built-in presets for common image processing workflows
 * These are client-side presets that don't require a server
 */

import type { Pipeline } from './types';

export interface PresetDefinition {
  name: string;
  shortName?: string; // Shorter name for dropdown display
  description: string;
  actions?: string[]; // What will happen - shown in preview
  special?: 'convert-only' | 'custom'; // Special handling flags
  pipeline?: Pipeline; // Optional for special presets
}

export interface PresetCategory {
  category: string;
  presets: PresetDefinition[];
}

// Categorized presets for the new UI
export const PRESET_CATEGORIES: PresetCategory[] = [
  {
    category: 'Web Optimization',
    presets: [
      {
        name: 'Optimize for Web (800px, JPEG)',
        shortName: '800px JPEG Quality 80',
        description: 'Smaller size, great for mobile',
        actions: [
          'Resize to 800px width',
          'Convert to JPEG format (80% quality)',
          'Remove metadata for privacy'
        ],
        pipeline: {
          pipeline: [
            { op: 'resize', mode: 'width', width: 800, noUpscale: true },
            { op: 'convert', format: 'jpg', quality: 80, stripMetadata: true },
          ],
        },
      },
      {
        name: 'Optimize for Web (1024px, JPEG)',
        shortName: '1024px JPEG Quality 85',
        description: 'Perfect for websites and blogs',
        actions: [
          'Resize to 1024px width',
          'Convert to JPEG format (85% quality)',
          'Remove metadata for privacy'
        ],
        pipeline: {
          pipeline: [
            { op: 'resize', mode: 'width', width: 1024, noUpscale: true },
            { op: 'convert', format: 'jpg', quality: 85, stripMetadata: true },
          ],
        },
      },
      {
        name: 'Optimize for Web (1920px, JPEG)',
        shortName: '1920px JPEG Quality 90',
        description: 'Large screens with excellent quality',
        actions: [
          'Resize to 1920px width',
          'Convert to JPEG format (90% quality)',
          'Remove metadata for privacy'
        ],
        pipeline: {
          pipeline: [
            { op: 'resize', mode: 'width', width: 1920, noUpscale: true },
            { op: 'convert', format: 'jpg', quality: 90, stripMetadata: true },
          ],
        },
      },
    ],
  },
  {
    category: 'Thumbnails & Email',
    presets: [
      {
        name: 'Create Thumbnail (300px, JPEG)',
        shortName: '300px Thumbnail JPEG Quality 75',
        description: 'Small preview images',
        actions: [
          'Resize to 300px width',
          'Convert to JPEG format (75% quality)',
          'Remove metadata for privacy'
        ],
        pipeline: {
          pipeline: [
            { op: 'resize', mode: 'width', width: 300, noUpscale: true },
            { op: 'convert', format: 'jpg', quality: 75, stripMetadata: true },
          ],
        },
      },
      {
        name: 'Optimize for Email (600px, JPEG)',
        shortName: '600px Email JPEG Quality 70',
        description: 'Small file size for email attachments',
        actions: [
          'Resize to 600px width',
          'Convert to JPEG format (70% quality)',
          'Remove metadata for privacy'
        ],
        pipeline: {
          pipeline: [
            { op: 'resize', mode: 'width', width: 600, noUpscale: true },
            { op: 'convert', format: 'jpg', quality: 70, stripMetadata: true },
          ],
        },
      },
    ],
  },
  {
    category: 'Social Media',
    presets: [
      {
        name: 'Social Media Square (1080x1080)',
        shortName: '1080x1080 Square JPEG Quality 85',
        description: 'Perfect for Instagram and Facebook',
        actions: [
          'Fit to 1080×1080 square',
          'Convert to JPEG format (85% quality)',
          'Remove metadata for privacy'
        ],
        pipeline: {
          pipeline: [
            { op: 'resize', mode: 'contain', width: 1080, height: 1080, noUpscale: true },
            { op: 'convert', format: 'jpg', quality: 85, stripMetadata: true },
          ],
        },
      },
    ],
  },
  {
    category: 'Format Conversion',
    presets: [
      {
        name: 'Just Convert Format',
        shortName: 'Convert Format Only',
        description: 'Change format without resizing',
        actions: [
          'Keep original dimensions',
          'Convert to selected format',
          'Remove metadata for privacy'
        ],
        special: 'convert-only',
        // No fixed pipeline - user selects format dynamically
      },
    ],
  },
  {
    category: 'Advanced',
    presets: [
      {
        name: 'Custom Settings',
        shortName: 'Full Control (Advanced)',
        description: 'Configure all options manually',
        actions: [
          'Full control over all settings',
          'Resize, crop, format, quality, metadata'
        ],
        special: 'custom',
        // No pipeline - shows SettingsPanel
      },
    ],
  },
];

// Legacy flat list for backwards compatibility (CLI, old code)
export const BUILT_IN_PRESETS: PresetDefinition[] = PRESET_CATEGORIES.flatMap(
  category => category.presets
).filter(preset => preset.pipeline); // Exclude special presets without fixed pipelines

/**
 * Get preset by name (searches across all categories)
 */
export function getPreset(name: string): PresetDefinition | undefined {
  for (const category of PRESET_CATEGORIES) {
    const preset = category.presets.find(p => p.name === name);
    if (preset) return preset;
  }
  return undefined;
}

/**
 * Get preset by name (legacy function for backwards compatibility)
 */
export function getPresetByName(name: string): PresetDefinition | undefined {
  return getPreset(name);
}

/**
 * Get all preset names
 */
export function getPresetNames(): string[] {
  return PRESET_CATEGORIES.flatMap(category =>
    category.presets.map(p => p.name)
  );
}

/**
 * Get all categories
 */
export function getCategories(): PresetCategory[] {
  return PRESET_CATEGORIES;
}
