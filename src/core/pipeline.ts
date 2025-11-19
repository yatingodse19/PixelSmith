/**
 * Image processing pipeline engine
 * Orchestrates the execution of multiple operations in sequence
 */

import sharp from 'sharp';
import path from 'path';
import { stat } from 'fs/promises';
import type {
  Pipeline,
  ProcessingResult,
  ResizeOperation,
  CropOperation,
  ConvertOperation,
  MetadataOperation,
} from './types.js';
import { applyResize } from './resizeImage.js';
import { applyCrop } from './applyCrop.js';
import { applyConvert, getExtensionForFormat } from './convertFormat.js';
import { applyMetadata, getImageMetadata } from './metadata.js';
import { buildNamingTokens, generateOutputFilename, ensureDirectoryExists, parseFilePath } from './utils.js';

/**
 * Process a single image through the pipeline
 */
export async function processImage(
  inputPath: string,
  pipeline: Pipeline,
  outputDir?: string,
  index?: number
): Promise<ProcessingResult> {
  const startTime = Date.now();

  try {
    // Get input file stats
    const inputStats = await stat(inputPath);
    const inputSize = inputStats.size;

    // Get initial metadata
    let metadata = await getImageMetadata(inputPath);

    // Initialize sharp instance
    let image = sharp(inputPath, { failOnError: false });

    // Track output format and dimensions
    let outputFormat: string | undefined;
    let finalWidth = metadata.width;
    let finalHeight = metadata.height;

    // Apply each operation in sequence
    for (const operation of pipeline.pipeline) {
      switch (operation.op) {
        case 'metadata':
          image = applyMetadata(image, operation as MetadataOperation);
          break;

        case 'crop':
          image = await applyCrop(image, operation as CropOperation, metadata);
          // Update metadata after crop
          metadata = await image.metadata();
          finalWidth = metadata.width;
          finalHeight = metadata.height;
          break;

        case 'resize':
          image = await applyResize(image, operation as ResizeOperation);
          // Update metadata after resize
          metadata = await image.metadata();
          finalWidth = metadata.width;
          finalHeight = metadata.height;
          break;

        case 'convert':
          outputFormat = (operation as ConvertOperation).format;
          image = applyConvert(image, operation as ConvertOperation);
          break;

        default:
          console.warn(`Unknown operation: ${(operation as { op: string }).op}`);
      }
    }

    // Determine output path
    const outputPath = buildOutputPath(
      inputPath,
      outputDir ?? pipeline.output?.dir,
      pipeline.output?.pattern,
      outputFormat,
      { width: finalWidth ?? 0, height: finalHeight ?? 0 },
      pipeline.name,
      index
    );

    // Ensure output directory exists
    await ensureDirectoryExists(path.dirname(outputPath));

    // Write output file
    await image.toFile(outputPath);

    // Get output file size
    const outputStats = await stat(outputPath);
    const outputSize = outputStats.size;

    const duration = Date.now() - startTime;

    return {
      inputPath,
      outputPath,
      success: true,
      inputSize,
      outputSize,
      width: finalWidth,
      height: finalHeight,
      format: outputFormat ?? metadata.format,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      inputPath,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      duration,
    };
  }
}

/**
 * Process multiple images in parallel with concurrency control
 */
export async function processBatch(
  inputPaths: string[],
  pipeline: Pipeline,
  outputDir?: string,
  concurrency: number = 4
): Promise<ProcessingResult[]> {
  const results: ProcessingResult[] = [];
  const queue: Promise<ProcessingResult>[] = [];

  for (let i = 0; i < inputPaths.length; i++) {
    const inputPath = inputPaths[i];

    // Add to queue
    const task = processImage(inputPath, pipeline, outputDir, i);
    queue.push(task);

    // Process in batches
    if (queue.length >= concurrency || i === inputPaths.length - 1) {
      const batchResults = await Promise.all(queue);
      results.push(...batchResults);
      queue.length = 0; // Clear queue
    }
  }

  return results;
}

/**
 * Build output file path based on pattern and tokens
 */
function buildOutputPath(
  inputPath: string,
  outputDir: string | undefined,
  pattern: string | undefined,
  outputFormat: string | undefined,
  dimensions: { width: number; height: number },
  presetName: string | undefined,
  index: number | undefined
): string {
  const parsed = parseFilePath(inputPath);

  // Determine output directory
  const outDir = outputDir ?? parsed.dir;

  // Determine output format
  const format = outputFormat ?? parsed.ext;
  const ext = getExtensionForFormat(format);

  // Build tokens
  const tokens = buildNamingTokens(
    inputPath,
    format,
    dimensions,
    presetName,
    index
  );

  // Generate filename from pattern or use default
  let filename: string;
  if (pattern) {
    filename = generateOutputFilename(pattern, tokens);
    // Ensure filename has extension
    if (!filename.includes('.')) {
      filename = `${filename}.${ext}`;
    }
  } else {
    // Default pattern: {base}_{w}x{h}.{ext}
    filename = `${parsed.name}_${dimensions.width}x${dimensions.height}.${ext}`;
  }

  return path.join(outDir, filename);
}

/**
 * Validate pipeline configuration
 */
export function validatePipeline(pipeline: Pipeline): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!pipeline.pipeline || pipeline.pipeline.length === 0) {
    errors.push('Pipeline must contain at least one operation');
  }

  for (const operation of pipeline.pipeline) {
    if (!operation.op) {
      errors.push('Each operation must have an "op" field');
      continue;
    }

    // Validate operation-specific fields
    switch (operation.op) {
      case 'resize': {
        const resize = operation as ResizeOperation;
        if (!resize.mode) {
          errors.push('Resize operation requires "mode" field');
        }
        if ((resize.mode === 'width' || resize.mode === 'contain' || resize.mode === 'cover' || resize.mode === 'exact') && !resize.width) {
          errors.push(`Resize mode "${resize.mode}" requires "width" field`);
        }
        if ((resize.mode === 'height' || resize.mode === 'contain' || resize.mode === 'cover' || resize.mode === 'exact') && !resize.height) {
          errors.push(`Resize mode "${resize.mode}" requires "height" field`);
        }
        break;
      }

      case 'convert': {
        const convert = operation as ConvertOperation;
        if (!convert.format) {
          errors.push('Convert operation requires "format" field');
        }
        break;
      }

      case 'crop':
      case 'metadata':
        // These have optional fields, so basic validation passes
        break;

      default:
        errors.push(`Unknown operation type: "${(operation as { op: string }).op}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
