/**
 * Preset management for CLI
 */

import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Pipeline } from '../core/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the presets directory path
 */
function getPresetsDir(): string {
  // Go up from dist/cli to project root, then to config/presets
  return path.join(__dirname, '..', '..', 'config', 'presets');
}

/**
 * Load a preset by name
 */
export async function loadPreset(name: string): Promise<Pipeline> {
  const presetsDir = getPresetsDir();
  const presetPath = path.join(presetsDir, `${name}.json`);

  try {
    const content = await readFile(presetPath, 'utf-8');
    const preset = JSON.parse(content) as Pipeline;
    return preset;
  } catch (error) {
    throw new Error(`Failed to load preset "${name}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Load a custom preset from a file path
 */
export async function loadCustomPreset(filePath: string): Promise<Pipeline> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const preset = JSON.parse(content) as Pipeline;
    return preset;
  } catch (error) {
    throw new Error(`Failed to load custom preset from "${filePath}": ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * List all available built-in presets
 */
export async function listPresets(): Promise<string[]> {
  const presetsDir = getPresetsDir();

  try {
    const files = await readdir(presetsDir);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Failed to list presets:', error);
    return [];
  }
}
