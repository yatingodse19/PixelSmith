/**
 * Image cropping operations
 */

import type { Sharp } from 'sharp';
import type { CropOperation, ImageMetadata } from './types.js';

/**
 * Apply crop operation to a sharp instance
 * Supports edge-based cropping, percentage cropping, and gravity-based cropping
 */
export async function applyCrop(
  image: Sharp,
  operation: CropOperation,
  metadata: ImageMetadata
): Promise<Sharp> {
  const { edge, value, percent, gravity, width, height, left, top } = operation;

  const imgWidth = metadata.width ?? 0;
  const imgHeight = metadata.height ?? 0;

  if (imgWidth === 0 || imgHeight === 0) {
    throw new Error('Image dimensions are required for cropping');
  }

  // Explicit extract with left, top, width, height
  if (left !== undefined && top !== undefined && width !== undefined && height !== undefined) {
    return image.extract({
      left,
      top,
      width,
      height,
    });
  }

  // Gravity-based cropping (center crop, etc.)
  if (gravity && width && height) {
    return image.resize({
      width,
      height,
      fit: 'cover',
      position: gravityToPosition(gravity),
    });
  }

  // Edge-based cropping (remove pixels from edges)
  if (edge && (value !== undefined || percent !== undefined)) {
    const cropValue = percent !== undefined
      ? calculatePercentCrop(edge, percent, imgWidth, imgHeight)
      : value ?? 0;

    return applyCropFromEdge(image, edge, cropValue, imgWidth, imgHeight);
  }

  throw new Error('Invalid crop operation: must specify either edge+value, gravity+dimensions, or explicit coordinates');
}

/**
 * Convert gravity string to sharp position
 */
function gravityToPosition(gravity: string): string {
  const gravityMap: Record<string, string> = {
    north: 'top',
    south: 'bottom',
    east: 'right',
    west: 'left',
    center: 'centre',
    northeast: 'right top',
    northwest: 'left top',
    southeast: 'right bottom',
    southwest: 'left bottom',
  };

  return gravityMap[gravity] ?? 'centre';
}

/**
 * Calculate pixel value from percentage
 */
function calculatePercentCrop(
  edge: string,
  percent: number,
  width: number,
  height: number
): number {
  const dimension = (edge === 'top' || edge === 'bottom') ? height : width;
  return Math.round((percent / 100) * dimension);
}

/**
 * Apply crop by removing pixels from a specific edge
 */
function applyCropFromEdge(
  image: Sharp,
  edge: string,
  cropValue: number,
  width: number,
  height: number
): Sharp {
  let extractOptions: { left: number; top: number; width: number; height: number };

  switch (edge) {
    case 'top':
      extractOptions = {
        left: 0,
        top: cropValue,
        width,
        height: Math.max(1, height - cropValue),
      };
      break;

    case 'bottom':
      extractOptions = {
        left: 0,
        top: 0,
        width,
        height: Math.max(1, height - cropValue),
      };
      break;

    case 'left':
      extractOptions = {
        left: cropValue,
        top: 0,
        width: Math.max(1, width - cropValue),
        height,
      };
      break;

    case 'right':
      extractOptions = {
        left: 0,
        top: 0,
        width: Math.max(1, width - cropValue),
        height,
      };
      break;

    default:
      throw new Error(`Unknown crop edge: ${edge}`);
  }

  return image.extract(extractOptions);
}
