/**
 * Utility functions for file naming, path handling, and token replacement
 */

import path from 'path';
import { createHash } from 'crypto';
import type { NamingTokens } from './types.js';

/**
 * Generate output filename based on pattern and tokens
 * Supports tokens: {base}, {ext}, {w}, {h}, {fmt}, {preset}, {idx}, {hash}, {date}
 */
export function generateOutputFilename(
  pattern: string,
  tokens: NamingTokens
): string {
  let filename = pattern;

  // Replace all tokens
  const replacements: Record<string, string> = {
    '{base}': tokens.base,
    '{ext}': tokens.ext,
    '{w}': tokens.w?.toString() ?? '',
    '{h}': tokens.h?.toString() ?? '',
    '{fmt}': tokens.fmt ?? '',
    '{preset}': tokens.preset ?? '',
    '{idx}': tokens.idx?.toString() ?? '',
    '{hash}': tokens.hash ?? '',
    '{date}': tokens.date ?? '',
  };

  for (const [token, value] of Object.entries(replacements)) {
    filename = filename.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), value);
  }

  return filename;
}

/**
 * Extract base name and extension from a file path
 */
export function parseFilePath(filePath: string): { dir: string; base: string; ext: string; name: string } {
  const parsed = path.parse(filePath);
  return {
    dir: parsed.dir,
    base: parsed.base,
    ext: parsed.ext.slice(1), // Remove leading dot
    name: parsed.name,
  };
}

/**
 * Generate hash from file path for unique naming
 */
export function generateFileHash(filePath: string, length: number = 8): string {
  const hash = createHash('md5').update(filePath).digest('hex');
  return hash.slice(0, length);
}

/**
 * Get current date string in YYYYMMDD format
 */
export function getDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Build naming tokens from file info and processing metadata
 */
export function buildNamingTokens(
  inputPath: string,
  outputFormat?: string,
  dimensions?: { width: number; height: number },
  presetName?: string,
  index?: number
): NamingTokens {
  const parsed = parseFilePath(inputPath);

  return {
    base: parsed.name,
    ext: outputFormat ?? parsed.ext,
    w: dimensions?.width,
    h: dimensions?.height,
    fmt: outputFormat,
    preset: presetName,
    idx: index,
    hash: generateFileHash(inputPath),
    date: getDateString(),
  };
}

/**
 * Ensure output directory exists (create if needed)
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  const { mkdir } = await import('fs/promises');
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Get list of image files from a directory
 */
export async function getImageFiles(dirPath: string, recursive: boolean = false): Promise<string[]> {
  const { readdir } = await import('fs/promises');
  const files: string[] = [];

  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory() && recursive) {
      const subFiles = await getImageFiles(fullPath, recursive);
      files.push(...subFiles);
    } else if (entry.isFile() && isSupportedExtension(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Check if file extension is supported
 */
function isSupportedExtension(filename: string): boolean {
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.tif', '.heic', '.heif'];
  const ext = path.extname(filename).toLowerCase();
  return supportedExtensions.includes(ext);
}

/**
 * Sanitize filename to remove invalid characters
 */
export function sanitizeFilename(filename: string): string {
  // Remove or replace invalid filename characters
  return filename.replace(/[<>:"|?*]/g, '_').replace(/\\/g, '_');
}
