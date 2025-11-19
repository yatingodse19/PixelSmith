/**
 * Built-in presets for common image processing workflows
 * These are client-side presets that don't require a server
 */

import type { Pipeline } from './types';

export interface PresetDefinition {
  name: string;
  description: string;
  pipeline: Pipeline;
}

export const BUILT_IN_PRESETS: PresetDefinition[] = [
  {
    name: 'Web Large (JPEG 1024px)',
    description: 'Resize to 1024px width, JPEG quality 85 - Great for web images',
    pipeline: {
      pipeline: [
        { op: 'resize', mode: 'width', width: 1024, noUpscale: true },
        { op: 'convert', format: 'jpg', quality: 85 },
      ],
    },
  },
  {
    name: 'Web Medium (WebP 800px)',
    description: 'Resize to 800px width, WebP quality 80 - Smaller files, great quality',
    pipeline: {
      pipeline: [
        { op: 'resize', mode: 'width', width: 800, noUpscale: true },
        { op: 'convert', format: 'webp', quality: 80 },
      ],
    },
  },
  {
    name: 'Social Media Square (1080x1080)',
    description: 'Contain to 1080×1080 square, JPEG quality 85 - Instagram/Facebook',
    pipeline: {
      pipeline: [
        { op: 'resize', mode: 'contain', width: 1080, height: 1080, noUpscale: true },
        { op: 'convert', format: 'jpg', quality: 85 },
      ],
    },
  },
  {
    name: 'Thumbnail (300px)',
    description: 'Resize to 300px width, JPEG quality 75 - Fast loading thumbnails',
    pipeline: {
      pipeline: [
        { op: 'resize', mode: 'width', width: 300, noUpscale: true },
        { op: 'convert', format: 'jpg', quality: 75 },
      ],
    },
  },
  {
    name: 'High Quality WebP (1920px)',
    description: 'Resize to 1920px width, WebP quality 90 - Large screens, great compression',
    pipeline: {
      pipeline: [
        { op: 'resize', mode: 'width', width: 1920, noUpscale: true },
        { op: 'convert', format: 'webp', quality: 90 },
      ],
    },
  },
  {
    name: 'Email Friendly (600px)',
    description: 'Resize to 600px width, JPEG quality 70 - Small file size for emails',
    pipeline: {
      pipeline: [
        { op: 'resize', mode: 'width', width: 600, noUpscale: true },
        { op: 'convert', format: 'jpg', quality: 70 },
      ],
    },
  },
  {
    name: 'PNG to WebP',
    description: 'Convert PNG to WebP with quality 85 - Reduce file size significantly',
    pipeline: {
      pipeline: [
        { op: 'convert', format: 'webp', quality: 85 },
      ],
    },
  },
  {
    name: 'Compress JPEG',
    description: 'Re-compress JPEG to quality 75 - Reduce file size',
    pipeline: {
      pipeline: [
        { op: 'convert', format: 'jpg', quality: 75 },
      ],
    },
  },
];

/**
 * Get preset by name
 */
export function getPreset(name: string): PresetDefinition | undefined {
  return BUILT_IN_PRESETS.find(p => p.name === name);
}

/**
 * Get all preset names
 */
export function getPresetNames(): string[] {
  return BUILT_IN_PRESETS.map(p => p.name);
}
