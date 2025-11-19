#!/usr/bin/env node

/**
 * PixelSmith CLI - Main entry point
 * Privacy-first, offline image resizer and converter
 */

import { stat } from 'fs/promises';
import ora from 'ora';
import { parseArgs, buildPipelineFromArgs } from './args.js';
import { loadPreset, loadCustomPreset, listPresets } from './presets.js';
import { processBatch, validatePipeline, getImageFiles } from '../core/index.js';
import {
  configureLogger,
  LogLevel,
  logError,
  logInfo,
  logSuccess,
  logWarning,
  logResult,
  logBatchSummary,
} from '../core/logger.js';

/**
 * Main CLI function
 */
async function main(): Promise<void> {
  try {
    // Parse command-line arguments
    const args = await parseArgs();

    // Configure logger
    configureLogger({
      level: args.verbose ? LogLevel.DEBUG : LogLevel.INFO,
      verbose: args.verbose,
      silent: false,
    });

    // Determine pipeline source
    let pipeline;
    if (args.config) {
      // Load custom config file
      logInfo(`Loading custom config from: ${args.config}`);
      pipeline = await loadCustomPreset(args.config);
    } else if (args.preset) {
      // Load built-in preset
      logInfo(`Loading preset: ${args.preset}`);
      pipeline = await loadPreset(args.preset);
    } else {
      // Build pipeline from CLI arguments
      pipeline = buildPipelineFromArgs(args);
    }

    // Validate pipeline
    const validation = validatePipeline(pipeline);
    if (!validation.valid) {
      logError('Invalid pipeline configuration:');
      validation.errors.forEach(error => logError(`  - ${error}`));
      process.exit(1);
    }

    // Determine input files
    const inputStat = await stat(args.input);
    let inputFiles: string[] = [];

    if (inputStat.isDirectory()) {
      logInfo(`Scanning directory: ${args.input}`);
      inputFiles = await getImageFiles(args.input, false);
      logInfo(`Found ${inputFiles.length} image(s)`);
    } else if (inputStat.isFile()) {
      inputFiles = [args.input];
    } else {
      logError('Input must be a file or directory');
      process.exit(1);
    }

    if (inputFiles.length === 0) {
      logWarning('No images found to process');
      process.exit(0);
    }

    // Dry run check
    if (args.dryRun) {
      logWarning('DRY RUN MODE - No files will be written');
    }

    // Show processing info
    logInfo(`Processing ${inputFiles.length} image(s)...`);
    if (pipeline.name) {
      logInfo(`Using pipeline: ${pipeline.name}`);
    }
    logInfo(`Concurrency: ${args.concurrency}`);

    // Start spinner
    const spinner = ora({
      text: 'Processing images...',
      color: 'cyan',
    }).start();

    // Process images
    const results = await processBatch(
      inputFiles,
      pipeline,
      args.output,
      args.concurrency
    );

    spinner.stop();

    // Log results
    if (args.verbose) {
      results.forEach(result => logResult(result));
    }

    // Log summary
    logBatchSummary(results);

    // Check for failures
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      logWarning(`${failed.length} file(s) failed to process`);
      if (!args.verbose) {
        logInfo('Use --verbose to see detailed error messages');
      }
      process.exit(1);
    }

    logSuccess('All images processed successfully!');
  } catch (error) {
    logError('Fatal error:', error as Error);
    process.exit(1);
  }
}

// Handle special commands
const args = process.argv.slice(2);
if (args.includes('--list-presets')) {
  listPresets()
    .then(presets => {
      console.log('Available presets:');
      presets.forEach(preset => console.log(`  - ${preset}`));
    })
    .catch(error => {
      logError('Failed to list presets:', error as Error);
      process.exit(1);
    });
} else {
  // Run main CLI
  main().catch(error => {
    logError('Unhandled error:', error as Error);
    process.exit(1);
  });
}
