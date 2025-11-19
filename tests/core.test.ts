/**
 * Basic tests for core functionality
 */

import { describe, it, expect } from 'vitest';
import { parseFilePath, buildNamingTokens, generateOutputFilename } from '../src/core/utils.js';
import { validatePipeline } from '../src/core/pipeline.js';
import type { Pipeline } from '../src/core/types.js';

describe('Utils', () => {
  describe('parseFilePath', () => {
    it('should parse file path correctly', () => {
      const result = parseFilePath('/path/to/image.jpg');
      expect(result.name).toBe('image');
      expect(result.ext).toBe('jpg');
      expect(result.base).toBe('image.jpg');
    });
  });

  describe('buildNamingTokens', () => {
    it('should build naming tokens', () => {
      const tokens = buildNamingTokens(
        '/path/to/image.jpg',
        'webp',
        { width: 1024, height: 768 },
        'test-preset',
        0
      );

      expect(tokens.base).toBe('image');
      expect(tokens.ext).toBe('webp');
      expect(tokens.w).toBe(1024);
      expect(tokens.h).toBe(768);
      expect(tokens.preset).toBe('test-preset');
      expect(tokens.idx).toBe(0);
    });
  });

  describe('generateOutputFilename', () => {
    it('should generate filename from pattern', () => {
      const filename = generateOutputFilename('{base}_{w}x{h}.{ext}', {
        base: 'image',
        ext: 'jpg',
        w: 1024,
        h: 768,
      });

      expect(filename).toBe('image_1024x768.jpg');
    });

    it('should handle preset token', () => {
      const filename = generateOutputFilename('{base}_{preset}.{ext}', {
        base: 'photo',
        ext: 'webp',
        preset: 'web-large',
      });

      expect(filename).toBe('photo_web-large.webp');
    });
  });
});

describe('Pipeline', () => {
  describe('validatePipeline', () => {
    it('should validate valid pipeline', () => {
      const pipeline: Pipeline = {
        name: 'test',
        pipeline: [
          { op: 'resize', mode: 'width', width: 1024 },
          { op: 'convert', format: 'jpg', quality: 85 },
        ],
      };

      const result = validatePipeline(pipeline);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate empty pipeline', () => {
      const pipeline: Pipeline = {
        pipeline: [],
      };

      const result = validatePipeline(pipeline);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should invalidate resize without required fields', () => {
      const pipeline: Pipeline = {
        pipeline: [
          { op: 'resize', mode: 'width' } as any,
        ],
      };

      const result = validatePipeline(pipeline);
      expect(result.valid).toBe(false);
    });

    it('should invalidate convert without format', () => {
      const pipeline: Pipeline = {
        pipeline: [
          { op: 'convert' } as any,
        ],
      };

      const result = validatePipeline(pipeline);
      expect(result.valid).toBe(false);
    });
  });
});
