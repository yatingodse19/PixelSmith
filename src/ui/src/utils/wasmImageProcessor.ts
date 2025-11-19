/**
 * WebAssembly-based client-side image processing using Photon
 *
 * This module provides 100% client-side image processing with no server uploads.
 * All processing happens in the browser using WebAssembly for near-native performance.
 *
 * Supported operations:
 * - Resize (width, height, contain modes)
 * - Crop (top, bottom, left, right edges)
 * - Format conversion (JPEG, PNG, WebP)
 * - Quality/compression settings
 *
 * Note: AVIF format is not supported by Photon yet, will fall back to WebP.
 */

import initPhoton, {
  PhotonImage,
  resize,
  crop,
  SamplingFilter,
} from '@silvia-odwyer/photon';

// WASM initialization state
let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;

/**
 * Initialize the Photon WASM module
 * This must be called before any image processing operations
 */
async function ensureWasmInitialized(): Promise<void> {
  if (wasmInitialized) {
    return;
  }

  if (wasmInitPromise) {
    // Already initializing, wait for it
    return wasmInitPromise;
  }

  wasmInitPromise = (async () => {
    try {
      console.log('[WASM] Initializing Photon WebAssembly module...');
      await initPhoton();
      wasmInitialized = true;
      console.log('[WASM] Photon initialized successfully');
    } catch (error) {
      console.error('[WASM] Failed to initialize Photon. Details:', error);
      if (error instanceof Error) {
        console.error('[WASM] Error message:', error.message);
        console.error('[WASM] Error stack:', error.stack);
      }
      wasmInitPromise = null; // Allow retry
      throw new Error(`Failed to initialize WebAssembly module: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  })();

  return wasmInitPromise;
}

export interface ProcessingOptions {
  resize?: {
    mode: 'width' | 'height' | 'contain' | 'none';
    width?: number;
    height?: number;
    noUpscale?: boolean;
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  format?: 'jpg' | 'png' | 'webp' | 'avif';
  quality?: number;
}

export interface ProcessingResult {
  success: boolean;
  filename: string;
  url?: string;
  size?: number;
  error?: string;
}

/**
 * Load an image file into a PhotonImage
 */
async function loadImage(file: File): Promise<PhotonImage> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  return PhotonImage.new_from_byteslice(uint8Array);
}

/**
 * Apply crop operations to an image
 */
function applyCrop(
  img: PhotonImage,
  cropOptions: { top?: number; bottom?: number; left?: number; right?: number }
): PhotonImage {
  let currentImg = img;
  let width = currentImg.get_width();
  let height = currentImg.get_height();

  // Apply crops sequentially
  if (cropOptions.top && cropOptions.top > 0) {
    const cropTop = Math.min(cropOptions.top, height - 1);
    currentImg = crop(currentImg, 0, cropTop, width, height);
    height = currentImg.get_height();
  }

  if (cropOptions.bottom && cropOptions.bottom > 0) {
    width = currentImg.get_width();
    height = currentImg.get_height();
    const newHeight = Math.max(1, height - cropOptions.bottom);
    currentImg = crop(currentImg, 0, 0, width, newHeight);
    height = currentImg.get_height();
  }

  if (cropOptions.left && cropOptions.left > 0) {
    width = currentImg.get_width();
    height = currentImg.get_height();
    const cropLeft = Math.min(cropOptions.left, width - 1);
    currentImg = crop(currentImg, cropLeft, 0, width, height);
    width = currentImg.get_width();
  }

  if (cropOptions.right && cropOptions.right > 0) {
    width = currentImg.get_width();
    height = currentImg.get_height();
    const newWidth = Math.max(1, width - cropOptions.right);
    currentImg = crop(currentImg, 0, 0, newWidth, height);
  }

  return currentImg;
}

/**
 * Apply resize operation to an image
 */
function applyResize(
  img: PhotonImage,
  resizeOptions: { mode: string; width?: number; height?: number; noUpscale?: boolean }
): PhotonImage {
  if (resizeOptions.mode === 'none') {
    return img;
  }

  const currentWidth = img.get_width();
  const currentHeight = img.get_height();
  let targetWidth = currentWidth;
  let targetHeight = currentHeight;

  switch (resizeOptions.mode) {
    case 'width':
      if (resizeOptions.width) {
        if (resizeOptions.noUpscale && resizeOptions.width > currentWidth) {
          return img;
        }
        targetWidth = resizeOptions.width;
        targetHeight = Math.round((currentHeight / currentWidth) * targetWidth);
      }
      break;

    case 'height':
      if (resizeOptions.height) {
        if (resizeOptions.noUpscale && resizeOptions.height > currentHeight) {
          return img;
        }
        targetHeight = resizeOptions.height;
        targetWidth = Math.round((currentWidth / currentHeight) * targetHeight);
      }
      break;

    case 'contain':
      if (resizeOptions.width && resizeOptions.height) {
        const widthRatio = resizeOptions.width / currentWidth;
        const heightRatio = resizeOptions.height / currentHeight;
        const ratio = Math.min(widthRatio, heightRatio);

        if (resizeOptions.noUpscale && ratio > 1) {
          return img;
        }

        targetWidth = Math.round(currentWidth * ratio);
        targetHeight = Math.round(currentHeight * ratio);
      }
      break;
  }

  // Use Lanczos3 for best quality (same as Sharp default)
  return resize(img, targetWidth, targetHeight, SamplingFilter.Lanczos3);
}

/**
 * Convert PhotonImage to output format
 *
 * LIMITATION: Photon's WebP encoder doesn't support quality parameter.
 * It uses lossless compression which produces larger files but perfect quality.
 * For smaller files, use JPEG with quality control.
 */
function getImageBytes(img: PhotonImage, format: string, quality: number): Uint8Array {
  switch (format) {
    case 'jpg':
    case 'jpeg':
      // JPEG supports quality control (1-100)
      return img.get_bytes_jpeg(quality);

    case 'webp':
      // WARNING: Photon's get_bytes_webp() doesn't accept quality parameter
      // Uses lossless compression - larger files, perfect quality
      console.warn('[WASM] WebP using lossless compression (quality control not available in Photon)');
      return img.get_bytes_webp();

    case 'avif':
      // AVIF not supported by Photon, fall back to WebP (lossless)
      console.warn('AVIF format not supported by WebAssembly processor, using WebP lossless instead');
      return img.get_bytes_webp();

    case 'png':
    default:
      // PNG is always lossless
      return img.get_bytes();
  }
}

/**
 * Get file extension for output format
 */
function getFileExtension(format: string): string {
  if (format === 'avif') return 'webp'; // AVIF fallback
  if (format === 'jpg') return 'jpg';
  if (format === 'jpeg') return 'jpg';
  return format;
}

/**
 * Get MIME type for output format
 */
function getMimeType(format: string): string {
  if (format === 'avif') return 'image/webp'; // AVIF fallback
  if (format === 'jpg' || format === 'jpeg') return 'image/jpeg';
  if (format === 'webp') return 'image/webp';
  return 'image/png';
}

/**
 * Process a single image file with WebAssembly
 */
export async function processImageWASM(
  file: File,
  options: ProcessingOptions
): Promise<ProcessingResult> {
  try {
    // Ensure WASM is initialized before processing
    await ensureWasmInitialized();

    console.log(`[WASM] Processing ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    const startTime = performance.now();

    // Load image
    let img = await loadImage(file);
    console.log(`[WASM] Loaded image: ${img.get_width()}x${img.get_height()}`);

    // Apply crop if specified
    if (options.crop) {
      img = applyCrop(img, options.crop);
      console.log(`[WASM] Cropped to: ${img.get_width()}x${img.get_height()}`);
    }

    // Apply resize if specified
    if (options.resize) {
      img = applyResize(img, options.resize);
      console.log(`[WASM] Resized to: ${img.get_width()}x${img.get_height()}`);
    }

    // Convert to output format
    const format = options.format || 'png';
    const quality = options.quality || 80;
    const outputBytes = getImageBytes(img, format, quality);

    // Create blob and URL
    const mimeType = getMimeType(format);
    const blob = new Blob([outputBytes], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Generate output filename
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const ext = getFileExtension(format);
    const filename = `${baseName}_processed.${ext}`;

    const endTime = performance.now();
    const processingTime = (endTime - startTime).toFixed(0);
    console.log(`[WASM] Processed in ${processingTime}ms, output: ${(blob.size / 1024).toFixed(1)} KB`);

    // Free memory
    img.free();

    return {
      success: true,
      filename,
      url,
      size: blob.size,
    };
  } catch (error) {
    console.error(`[WASM] Error processing ${file.name}:`, error);
    return {
      success: false,
      filename: file.name,
      error: error instanceof Error ? error.message : 'Processing failed',
    };
  }
}

/**
 * Process multiple images in parallel with concurrency control
 */
export async function processBatchWASM(
  files: File[],
  options: ProcessingOptions,
  concurrency: number = 4,
  onProgress?: (current: number, total: number) => void
): Promise<ProcessingResult[]> {
  // Ensure WASM is initialized before batch processing
  await ensureWasmInitialized();

  const results: ProcessingResult[] = [];
  const total = files.length;
  let completed = 0;

  console.log(`[WASM] Starting batch processing: ${total} images, concurrency: ${concurrency}`);
  const batchStartTime = performance.now();

  // Process in batches with concurrency limit
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(file => processImageWASM(file, options))
    );

    results.push(...batchResults);
    completed += batch.length;

    if (onProgress) {
      onProgress(completed, total);
    }
  }

  const batchEndTime = performance.now();
  const totalTime = ((batchEndTime - batchStartTime) / 1000).toFixed(2);
  const avgTime = ((batchEndTime - batchStartTime) / total).toFixed(0);
  console.log(`[WASM] Batch completed in ${totalTime}s (avg ${avgTime}ms per image)`);

  return results;
}
