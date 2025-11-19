/**
 * Core type definitions for PixelSmith image processing
 */

export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'heic' | 'heif';

export type ResizeMode = 'width' | 'height' | 'contain' | 'cover' | 'exact';

export type CropEdge = 'top' | 'bottom' | 'left' | 'right';

export type CropGravity = 'north' | 'south' | 'east' | 'west' | 'center' | 'northeast' | 'northwest' | 'southeast' | 'southwest';

/**
 * Resize operation configuration
 */
export interface ResizeOperation {
  op: 'resize';
  mode: ResizeMode;
  width?: number;
  height?: number;
  noUpscale?: boolean;
  fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  kernel?: 'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3';
}

/**
 * Crop operation configuration
 */
export interface CropOperation {
  op: 'crop';
  edge?: CropEdge;
  value?: number;
  percent?: number;
  gravity?: CropGravity;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}

/**
 * Convert/format operation configuration
 */
export interface ConvertOperation {
  op: 'convert';
  format: ImageFormat;
  quality?: number;
  progressive?: boolean;
  lossless?: boolean;
  cq?: number;
  speed?: number;
  chromaSubsampling?: '4:4:4' | '4:2:2' | '4:2:0';
}

/**
 * Metadata operation configuration
 */
export interface MetadataOperation {
  op: 'metadata';
  strip?: boolean;
  autorotate?: boolean;
  preserveFields?: string[];
}

/**
 * Union type of all possible operations
 */
export type PipelineOperation = ResizeOperation | CropOperation | ConvertOperation | MetadataOperation;

/**
 * Output configuration
 */
export interface OutputConfig {
  dir?: string;
  pattern?: string;
  overwrite?: boolean;
}

/**
 * Complete pipeline configuration
 */
export interface Pipeline {
  name?: string;
  pipeline: PipelineOperation[];
  output?: OutputConfig;
}

/**
 * Processing result for a single file
 */
export interface ProcessingResult {
  inputPath: string;
  outputPath?: string;
  success: boolean;
  error?: string;
  inputSize?: number;
  outputSize?: number;
  width?: number;
  height?: number;
  format?: string;
  duration?: number;
}

/**
 * Image metadata
 */
export interface ImageMetadata {
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  space?: string;
  channels?: number;
  depth?: string;
  density?: number;
  hasAlpha?: boolean;
  orientation?: number;
  isProgressive?: boolean;
}

/**
 * Processing options
 */
export interface ProcessingOptions {
  concurrency?: number;
  failFast?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

/**
 * Naming pattern tokens
 */
export interface NamingTokens {
  base: string;
  ext: string;
  w?: number;
  h?: number;
  fmt?: string;
  preset?: string;
  idx?: number;
  hash?: string;
  date?: string;
}
