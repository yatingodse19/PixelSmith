/**
 * Image format conversion and compression operations
 */

import type { Sharp } from 'sharp';
import type { ConvertOperation } from './types.js';

/**
 * Apply format conversion and compression to a sharp instance
 * Supports JPG, PNG, WebP, AVIF with quality settings
 */
export function applyConvert(
  image: Sharp,
  operation: ConvertOperation
): Sharp {
  const { format, quality = 85, progressive, lossless, cq, speed, chromaSubsampling } = operation;

  switch (format) {
    case 'jpg':
    case 'jpeg':
      return image.jpeg({
        quality,
        progressive: progressive ?? false,
        chromaSubsampling: chromaSubsampling ?? '4:2:0',
        mozjpeg: true, // Use MozJPEG for better compression
      });

    case 'png':
      return image.png({
        quality,
        compressionLevel: 9,
        progressive: progressive ?? false,
      });

    case 'webp':
      return image.webp({
        quality,
        lossless: lossless ?? false,
        nearLossless: false,
        smartSubsample: true,
      });

    case 'avif':
      return image.avif({
        quality: cq ?? quality,
        effort: speed !== undefined ? 9 - speed : 5, // Convert speed (0-9) to effort (0-9, where higher = slower/better)
        chromaSubsampling: chromaSubsampling ?? '4:2:0',
      });

    case 'tiff':
      return image.tiff({
        quality,
        compression: 'jpeg',
      });

    default:
      throw new Error(`Unsupported output format: ${format}`);
  }
}

/**
 * Get file extension for a given format
 */
export function getExtensionForFormat(format: string): string {
  const extensionMap: Record<string, string> = {
    jpg: 'jpg',
    jpeg: 'jpg',
    png: 'png',
    webp: 'webp',
    avif: 'avif',
    tiff: 'tiff',
    heic: 'heic',
    heif: 'heif',
  };

  return extensionMap[format] ?? format;
}

/**
 * Validate if a format is supported for encoding
 */
export function isSupportedOutputFormat(format: string): boolean {
  const supported = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff'];
  return supported.includes(format.toLowerCase());
}
