/**
 * Image resizing operations using sharp/libvips
 */

import sharp, { type Sharp } from 'sharp';
import type { ResizeOperation } from './types.js';

/**
 * Apply resize operation to a sharp instance
 * Handles various resize modes: width-only, height-only, contain, cover, exact
 */
export async function applyResize(
  image: Sharp,
  operation: ResizeOperation
): Promise<Sharp> {
  const { mode, width, height, noUpscale, fit, kernel = 'lanczos3' } = operation;

  // Map kernel names to sharp kernel types
  const kernelMap = {
    nearest: sharp.kernel.nearest,
    cubic: sharp.kernel.cubic,
    mitchell: sharp.kernel.mitchell,
    lanczos2: sharp.kernel.lanczos2,
    lanczos3: sharp.kernel.lanczos3,
  };

  const resizeOptions: sharp.ResizeOptions = {
    kernel: kernelMap[kernel],
    withoutEnlargement: noUpscale ?? false,
  };

  switch (mode) {
    case 'width':
      if (!width) {
        throw new Error('Width is required for width mode');
      }
      return image.resize({
        width,
        ...resizeOptions,
      });

    case 'height':
      if (!height) {
        throw new Error('Height is required for height mode');
      }
      return image.resize({
        height,
        ...resizeOptions,
      });

    case 'contain':
      if (!width || !height) {
        throw new Error('Both width and height are required for contain mode');
      }
      return image.resize({
        width,
        height,
        fit: 'inside',
        ...resizeOptions,
      });

    case 'cover':
      if (!width || !height) {
        throw new Error('Both width and height are required for cover mode');
      }
      return image.resize({
        width,
        height,
        fit: 'cover',
        ...resizeOptions,
      });

    case 'exact':
      if (!width || !height) {
        throw new Error('Both width and height are required for exact mode');
      }
      return image.resize({
        width,
        height,
        fit: fit || 'fill',
        ...resizeOptions,
      });

    default:
      throw new Error(`Unknown resize mode: ${String(mode)}`);
  }
}

/**
 * Calculate output dimensions based on resize operation
 * Useful for preview and validation
 */
export function calculateResizeDimensions(
  operation: ResizeOperation,
  inputWidth: number,
  inputHeight: number
): { width: number; height: number } {
  const { mode, width, height, noUpscale } = operation;

  // Check if upscaling is prevented
  const preventUpscale = (targetW: number, targetH: number): { width: number; height: number } => {
    if (noUpscale && (targetW > inputWidth || targetH > inputHeight)) {
      return { width: inputWidth, height: inputHeight };
    }
    return { width: targetW, height: targetH };
  };

  switch (mode) {
    case 'width': {
      if (!width) throw new Error('Width is required');
      const aspectRatio = inputHeight / inputWidth;
      const targetHeight = Math.round(width * aspectRatio);
      return preventUpscale(width, targetHeight);
    }

    case 'height': {
      if (!height) throw new Error('Height is required');
      const aspectRatio = inputWidth / inputHeight;
      const targetWidth = Math.round(height * aspectRatio);
      return preventUpscale(targetWidth, height);
    }

    case 'contain': {
      if (!width || !height) throw new Error('Both dimensions required');
      const aspectRatio = inputWidth / inputHeight;
      const targetAspectRatio = width / height;

      let targetWidth = width;
      let targetHeight = height;

      if (aspectRatio > targetAspectRatio) {
        targetHeight = Math.round(width / aspectRatio);
      } else {
        targetWidth = Math.round(height * aspectRatio);
      }

      return preventUpscale(targetWidth, targetHeight);
    }

    case 'cover':
    case 'exact':
      if (!width || !height) throw new Error('Both dimensions required');
      return preventUpscale(width, height);

    default:
      throw new Error(`Unknown resize mode: ${String(mode)}`);
  }
}
