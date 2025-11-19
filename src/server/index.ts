/**
 * Express server for PixelSmith web UI
 * Provides REST API for image processing operations
 */

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { processImage, processBatch, validatePipeline } from '../core/pipeline.js';
import { listPresets, loadPreset } from '../cli/presets.js';
import type { Pipeline } from '../core/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/tiff'];
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'ui', 'dist')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));
app.use('/output', express.static(path.join(__dirname, '..', '..', 'output')));

/**
 * GET /api/presets - List all available presets
 */
app.get('/api/presets', async (_req: Request, res: Response) => {
  try {
    const presets = await listPresets();
    res.json({ presets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list presets' });
  }
});

/**
 * GET /api/presets/:name - Get a specific preset
 */
app.get('/api/presets/:name', async (req: Request, res: Response) => {
  try {
    const preset = await loadPreset(req.params.name);
    res.json(preset);
  } catch (error) {
    res.status(404).json({ error: 'Preset not found' });
  }
});

/**
 * POST /api/process - Process a single image
 */
app.post('/api/process', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const pipeline: Pipeline = JSON.parse(req.body.pipeline || '{"pipeline":[]}');

    // Validate pipeline
    const validation = validatePipeline(pipeline);
    if (!validation.valid) {
      res.status(400).json({ error: 'Invalid pipeline', details: validation.errors });
      return;
    }

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '..', '..', 'output');
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    // Process the image
    const result = await processImage(
      req.file.path,
      pipeline,
      outputDir
    );

    // Clean up uploaded file
    try {
      await unlink(req.file.path);
    } catch (e) {
      console.warn('Failed to delete uploaded file:', e);
    }

    if (result.success && result.outputPath) {
      // Return relative path for frontend
      const relativePath = `/output/${path.basename(result.outputPath)}`;
      res.json({
        ...result,
        outputUrl: relativePath
      });
    } else {
      res.status(500).json({ error: result.error || 'Processing failed' });
    }
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({
      error: 'Failed to process image',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/process-batch - Process multiple images
 */
app.post('/api/process-batch', upload.array('images', 50), async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ error: 'No image files provided' });
      return;
    }

    const pipeline: Pipeline = JSON.parse(req.body.pipeline || '{"pipeline":[]}');

    // Validate pipeline
    const validation = validatePipeline(pipeline);
    if (!validation.valid) {
      res.status(400).json({ error: 'Invalid pipeline', details: validation.errors });
      return;
    }

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '..', '..', 'output');
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    // Process all images
    const inputPaths = req.files.map(f => f.path);
    const results = await processBatch(
      inputPaths,
      pipeline,
      outputDir,
      parseInt(req.body.concurrency || '4', 10)
    );

    // Clean up uploaded files
    for (const file of req.files) {
      try {
        await unlink(file.path);
      } catch (e) {
        console.warn('Failed to delete uploaded file:', e);
      }
    }

    // Add output URLs to results
    const resultsWithUrls = results.map(r => ({
      ...r,
      outputUrl: r.outputPath ? `/output/${path.basename(r.outputPath)}` : undefined
    }));

    res.json({ results: resultsWithUrls });
  } catch (error) {
    console.error('Batch processing error:', error);
    res.status(500).json({
      error: 'Failed to process images',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/validate - Validate a pipeline configuration
 */
app.post('/api/validate', (req: Request, res: Response): void => {
  try {
    const pipeline: Pipeline = req.body;
    const validation = validatePipeline(pipeline);
    res.json(validation);
  } catch (error) {
    res.status(400).json({
      error: 'Invalid pipeline format',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Serve React app for all other routes
app.get('*', (_req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '..', 'ui', 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎨 PixelSmith UI Server running at:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`\n📁 Privacy Notice: All processing is local. No data is uploaded to the internet.`);
});

export default app;
