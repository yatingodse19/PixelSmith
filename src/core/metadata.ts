/**
 * Image metadata handling operations
 */

import type { Sharp } from 'sharp';
import sharp from 'sharp';
import type { MetadataOperation, ImageMetadata } from './types.js';

/**
 * Get image metadata from a file path
 */
export async function getImageMetadata(filePath: string): Promise<ImageMetadata> {
  const image = sharp(filePath);
  const metadata = await image.metadata();

  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: metadata.size,
    space: metadata.space,
    channels: metadata.channels,
    depth: metadata.depth,
    density: metadata.density,
    hasAlpha: metadata.hasAlpha,
    orientation: metadata.orientation,
    isProgressive: metadata.isProgressive,
  };
}

/**
 * Apply metadata operations to a sharp instance
 * Handles EXIF stripping, auto-rotation, and selective metadata preservation
 */
export function applyMetadata(
  image: Sharp,
  operation: MetadataOperation
): Sharp {
  const { strip = true, autorotate = true, preserveFields } = operation;

  // Auto-rotate based on EXIF orientation
  // This should be done early in the pipeline, before other transformations
  if (autorotate) {
    image = image.rotate();
  }

  // Strip metadata (EXIF, ICC profiles, etc.)
  if (strip) {
    // If specific fields should be preserved, we'd need to extract and re-apply them
    // For MVP, we simply strip all metadata
    if (preserveFields && preserveFields.length > 0) {
      // Note: Sharp doesn't have built-in selective metadata preservation
      // This would require reading EXIF, filtering, and rewriting
      // For MVP, we'll just strip everything if strip=true
      console.warn('Selective metadata preservation not yet implemented; stripping all metadata');
    }

    image = image.withMetadata({
      orientation: undefined, // Remove orientation tag after rotation
    });
  } else {
    // Keep metadata
    image = image.withMetadata();
  }

  return image;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Check if a file is a supported image format
 */
export function isSupportedImageFormat(filePath: string): boolean {
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.tif', '.heic', '.heif'];
  const ext = filePath.toLowerCase().slice(filePath.lastIndexOf('.'));
  return supportedExtensions.includes(ext);
}
