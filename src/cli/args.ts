/**
 * CLI argument parsing and pipeline builder
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import type { Pipeline, PipelineOperation } from '../core/types.js';

/**
 * CLI arguments interface
 */
export interface CliArgs {
  input: string;
  output?: string;
  resize?: string;
  crop?: string;
  format?: string;
  quality?: number;
  progressive?: boolean;
  lossless?: boolean;
  strip?: boolean;
  noUpscale?: boolean;
  preset?: string;
  config?: string;
  concurrency?: number;
  verbose?: boolean;
  dryRun?: boolean;
  threads?: number;
  cq?: number;
  speed?: number;
}

/**
 * Parse CLI arguments
 */
export async function parseArgs(): Promise<CliArgs> {
  const argv = await yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('input', {
      alias: 'i',
      type: 'string',
      description: 'Input file or directory',
      demandOption: true,
    })
    .option('output', {
      alias: 'o',
      type: 'string',
      description: 'Output directory',
    })
    .option('resize', {
      alias: 'r',
      type: 'string',
      description: 'Resize mode: WxH, Wx, xH, contain:WxH, cover:WxH',
    })
    .option('crop', {
      alias: 'c',
      type: 'string',
      description: 'Crop: top:px, bottom:px, left:px, right:px, gravity:center',
    })
    .option('format', {
      alias: 'f',
      type: 'string',
      description: 'Output format: jpg, png, webp, avif',
    })
    .option('quality', {
      alias: 'q',
      type: 'number',
      description: 'Quality (0-100)',
      default: 85,
    })
    .option('progressive', {
      type: 'boolean',
      description: 'Enable progressive JPEG',
      default: false,
    })
    .option('lossless', {
      type: 'boolean',
      description: 'Enable lossless compression (WebP)',
      default: false,
    })
    .option('strip', {
      type: 'boolean',
      description: 'Strip metadata',
      default: true,
    })
    .option('no-upscale', {
      type: 'boolean',
      description: 'Prevent upscaling',
      default: false,
    })
    .option('preset', {
      alias: 'p',
      type: 'string',
      description: 'Use a built-in preset',
    })
    .option('config', {
      type: 'string',
      description: 'Path to custom config JSON file',
    })
    .option('concurrency', {
      type: 'number',
      description: 'Number of concurrent operations',
      default: 4,
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Verbose output',
      default: false,
    })
    .option('dry-run', {
      type: 'boolean',
      description: 'Dry run (no files written)',
      default: false,
    })
    .option('threads', {
      type: 'number',
      description: 'Number of threads (for AVIF)',
    })
    .option('cq', {
      type: 'number',
      description: 'Constant quality for AVIF',
    })
    .option('speed', {
      type: 'number',
      description: 'Speed preset for AVIF (0-9)',
    })
    .example('$0 -i ./input -o ./output --resize 1024x --format jpg', 'Resize to 1024px width')
    .example('$0 -i ./input --preset web-large-jpg-1024', 'Use a built-in preset')
    .example('$0 -i ./input --config recipe.json', 'Use a custom config file')
    .help('h')
    .alias('h', 'help')
    .version('1.0.0')
    .alias('V', 'version')
    .parseAsync();

  return argv as unknown as CliArgs;
}

/**
 * Build a pipeline from CLI arguments
 */
export function buildPipelineFromArgs(args: CliArgs): Pipeline {
  const operations: PipelineOperation[] = [];

  // Add metadata autorotate at the beginning
  operations.push({
    op: 'metadata',
    autorotate: true,
    strip: false, // Don't strip yet
  });

  // Add crop operation
  if (args.crop) {
    const cropOp = parseCropArg(args.crop);
    if (cropOp) {
      operations.push(cropOp);
    }
  }

  // Add resize operation
  if (args.resize) {
    const resizeOp = parseResizeArg(args.resize, args.noUpscale);
    if (resizeOp) {
      operations.push(resizeOp);
    }
  }

  // Add convert operation
  if (args.format) {
    operations.push({
      op: 'convert',
      format: args.format as 'jpg' | 'png' | 'webp' | 'avif',
      quality: args.quality,
      progressive: args.progressive,
      lossless: args.lossless,
      cq: args.cq,
      speed: args.speed,
    });
  }

  // Add final metadata stripping
  if (args.strip) {
    operations.push({
      op: 'metadata',
      strip: true,
    });
  }

  return {
    pipeline: operations,
    output: {
      dir: args.output,
    },
  };
}

/**
 * Parse resize argument
 */
function parseResizeArg(resize: string, noUpscale: boolean = false): PipelineOperation | null {
  // Pattern: WxH, Wx, xH, contain:WxH, cover:WxH, exact:WxH
  const patterns = [
    { regex: /^(\d+)x(\d+)$/, mode: 'exact' },
    { regex: /^(\d+)x$/, mode: 'width' },
    { regex: /^x(\d+)$/, mode: 'height' },
    { regex: /^contain:(\d+)x(\d+)$/, mode: 'contain' },
    { regex: /^cover:(\d+)x(\d+)$/, mode: 'cover' },
  ];

  for (const { regex, mode } of patterns) {
    const match = resize.match(regex);
    if (match) {
      const width = match[1] ? parseInt(match[1], 10) : undefined;
      const height = match[2] ? parseInt(match[2], 10) : undefined;

      return {
        op: 'resize',
        mode: mode as 'width' | 'height' | 'contain' | 'cover' | 'exact',
        width,
        height,
        noUpscale,
      };
    }
  }

  console.warn(`Invalid resize format: ${resize}`);
  return null;
}

/**
 * Parse crop argument
 */
function parseCropArg(crop: string): PipelineOperation | null {
  // Pattern: top:px, bottom:px, left:px, right:px, pct:10, gravity:center
  const edgeMatch = crop.match(/^(top|bottom|left|right):(\d+)$/);
  if (edgeMatch) {
    return {
      op: 'crop',
      edge: edgeMatch[1] as 'top' | 'bottom' | 'left' | 'right',
      value: parseInt(edgeMatch[2], 10),
    };
  }

  const pctMatch = crop.match(/^pct:(\d+)$/);
  if (pctMatch) {
    return {
      op: 'crop',
      edge: 'top', // Default to top for percentage
      percent: parseInt(pctMatch[1], 10),
    };
  }

  const gravityMatch = crop.match(/^gravity:(north|south|east|west|center|northeast|northwest|southeast|southwest)$/);
  if (gravityMatch) {
    return {
      op: 'crop',
      gravity: gravityMatch[1] as 'north' | 'south' | 'east' | 'west' | 'center',
    };
  }

  console.warn(`Invalid crop format: ${crop}`);
  return null;
}
