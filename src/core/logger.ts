/**
 * Logging utilities for PixelSmith
 */

import chalk from 'chalk';
import type { ProcessingResult } from './types.js';
import { formatFileSize } from './metadata.js';

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  verbose: boolean;
  silent: boolean;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  level: LogLevel.INFO,
  verbose: false,
  silent: false,
};

let config: LoggerConfig = { ...defaultConfig };

/**
 * Configure logger
 */
export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Log error message
 */
export function logError(message: string, error?: Error): void {
  if (config.silent || config.level < LogLevel.ERROR) return;
  console.error(chalk.red('✖'), chalk.red(message));
  if (error && config.verbose) {
    console.error(chalk.gray(error.stack ?? error.message));
  }
}

/**
 * Log warning message
 */
export function logWarning(message: string): void {
  if (config.silent || config.level < LogLevel.WARN) return;
  console.warn(chalk.yellow('⚠'), chalk.yellow(message));
}

/**
 * Log info message
 */
export function logInfo(message: string): void {
  if (config.silent || config.level < LogLevel.INFO) return;
  console.log(chalk.blue('ℹ'), message);
}

/**
 * Log success message
 */
export function logSuccess(message: string): void {
  if (config.silent || config.level < LogLevel.INFO) return;
  console.log(chalk.green('✓'), chalk.green(message));
}

/**
 * Log debug message
 */
export function logDebug(message: string): void {
  if (config.silent || config.level < LogLevel.DEBUG) return;
  console.log(chalk.gray('→'), chalk.gray(message));
}

/**
 * Log processing result
 */
export function logResult(result: ProcessingResult): void {
  if (config.silent) return;

  if (result.success) {
    const inputSize = result.inputSize ? formatFileSize(result.inputSize) : 'unknown';
    const outputSize = result.outputSize ? formatFileSize(result.outputSize) : 'unknown';
    const compression = result.inputSize && result.outputSize
      ? ((1 - result.outputSize / result.inputSize) * 100).toFixed(1)
      : '0';
    const duration = result.duration ? `${result.duration}ms` : '';

    logSuccess(
      `${result.inputPath} → ${result.outputPath} (${inputSize} → ${outputSize}, ${compression}% reduction, ${duration})`
    );

    if (config.verbose && result.width && result.height) {
      logDebug(`  Dimensions: ${result.width}×${result.height}, Format: ${result.format ?? 'unknown'}`);
    }
  } else {
    logError(`Failed to process ${result.inputPath}: ${result.error ?? 'unknown error'}`);
  }
}

/**
 * Log batch summary
 */
export function logBatchSummary(results: ProcessingResult[]): void {
  if (config.silent) return;

  const total = results.length;
  const successful = results.filter(r => r.success).length;
  const failed = total - successful;

  const totalInputSize = results.reduce((sum, r) => sum + (r.inputSize ?? 0), 0);
  const totalOutputSize = results.reduce((sum, r) => sum + (r.outputSize ?? 0), 0);
  const totalDuration = results.reduce((sum, r) => sum + (r.duration ?? 0), 0);

  console.log('\n' + chalk.bold('Processing Summary:'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(`Total files: ${total}`);
  console.log(chalk.green(`Successful: ${successful}`));
  if (failed > 0) {
    console.log(chalk.red(`Failed: ${failed}`));
  }
  console.log(`Total input size: ${formatFileSize(totalInputSize)}`);
  console.log(`Total output size: ${formatFileSize(totalOutputSize)}`);
  if (totalInputSize > 0) {
    const savings = ((1 - totalOutputSize / totalInputSize) * 100).toFixed(1);
    console.log(`Total savings: ${formatFileSize(totalInputSize - totalOutputSize)} (${savings}%)`);
  }
  console.log(`Total duration: ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(chalk.gray('─'.repeat(50)));
}

/**
 * Create a simple progress indicator
 */
export function createProgressLogger(total: number): (current: number) => void {
  if (config.silent) return () => {};

  return (current: number) => {
    const percent = ((current / total) * 100).toFixed(1);
    const bar = createProgressBar(current, total, 30);
    process.stdout.write(`\r${chalk.cyan(bar)} ${current}/${total} (${percent}%)`);
    if (current === total) {
      process.stdout.write('\n');
    }
  };
}

/**
 * Create a text progress bar
 */
function createProgressBar(current: number, total: number, width: number): string {
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}
