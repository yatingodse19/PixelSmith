/**
 * PixelSmith Core - Image Processing Engine
 * Exports all core functionality for image processing
 */

// Type definitions
export type {
  ImageFormat,
  ResizeMode,
  CropEdge,
  CropGravity,
  ResizeOperation,
  CropOperation,
  ConvertOperation,
  MetadataOperation,
  PipelineOperation,
  OutputConfig,
  Pipeline,
  ProcessingResult,
  ImageMetadata,
  ProcessingOptions,
  NamingTokens,
} from './types.js';

// Core operations
export { applyResize, calculateResizeDimensions } from './resizeImage.js';
export { applyCrop } from './applyCrop.js';
export { applyConvert, getExtensionForFormat, isSupportedOutputFormat } from './convertFormat.js';
export { applyMetadata, getImageMetadata, formatFileSize, isSupportedImageFormat } from './metadata.js';

// Pipeline engine
export { processImage, processBatch, validatePipeline } from './pipeline.js';

// Utilities
export {
  generateOutputFilename,
  parseFilePath,
  generateFileHash,
  getDateString,
  buildNamingTokens,
  ensureDirectoryExists,
  getImageFiles,
  sanitizeFilename,
} from './utils.js';
