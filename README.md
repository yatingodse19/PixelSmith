# PixelSmith

**Privacy-first, offline image resizer, converter, and batch processor**

PixelSmith is a powerful, local-only image processing tool built with Node.js and TypeScript. It leverages the high-performance `sharp` library (libvips) to provide fast, reliable image resizing, format conversion, cropping, and compression—all without uploading your files anywhere.

## Features

- **Graphical User Interface** - Beautiful web-based UI with drag-and-drop
- **100% Local Processing** - No uploads, no cloud, complete privacy
- **Batch Processing** - Process multiple images efficiently with concurrency control
- **Multiple Operations**:
  - Resize (width, height, contain, cover, exact)
  - Crop (edge-based, percentage, gravity)
  - Convert formats (JPG, PNG, WebP, AVIF)
  - Compress with quality control
  - Metadata handling (strip/preserve EXIF)
- **Built-in Presets** - Ready-to-use configurations for common tasks
- **Custom Pipelines** - Chain operations with JSON configurations
- **Fast Performance** - Powered by libvips for efficient processing
- **Cross-platform** - Works on macOS, Windows, and Linux

## Installation

### Prerequisites

- Node.js 20+ installed

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

## Usage

PixelSmith offers two interfaces: a modern **Web UI** for visual, drag-and-drop processing, and a powerful **CLI** for automation and scripting.

### 🎨 Web UI (Recommended for most users)

The graphical interface provides an intuitive way to process images with real-time preview and batch support.

**Start the Web UI:**

```bash
npm start:ui
```

Then open your browser to **http://localhost:3000**

**Features:**
- **Drag & Drop** - Simply drag images into the browser
- **Visual Controls** - Adjust resize, crop, format, and quality with sliders and dropdowns
- **Preset Selector** - Quick access to common configurations
- **Live Results** - See processed images immediately with before/after comparison
- **Batch Processing** - Process multiple images at once
- **Privacy Indicator** - Always shows that processing is 100% local

**Quick Start:**
1. Drag and drop images onto the upload area
2. Choose a preset or customize settings in the right panel
3. Click "Process Images" button
4. Download your processed images

---

### 💻 CLI Commands

For automation, scripting, and advanced users.

#### Basic Usage

```bash
# Resize image to 1024px width
npm start -- -i input.jpg -o ./output --resize 1024x --format jpg

# Convert PNG to WebP
npm start -- -i input.png --format webp --quality 90

# Crop and resize
npm start -- -i input.jpg --crop top:200 --resize 1024x --format jpg --quality 85
```

#### Using Presets

```bash
# List available presets
npm start -- --list-presets

# Use a built-in preset
npm start -- -i ./images -o ./output --preset web-large-jpg-1024
```

#### Batch Processing

```bash
# Process entire directory
npm start -- -i ./input-folder -o ./output-folder --resize 1024x --format jpg --quality 85

# With custom concurrency
npm start -- -i ./images -o ./output --preset social-square-1080 --concurrency 8
```

#### Advanced Options

```bash
# Full example with all options
npm start -- \
  -i ./input \
  -o ./output \
  --resize contain:1920x1080 \
  --crop top:100 \
  --format jpg \
  --quality 85 \
  --progressive \
  --strip \
  --no-upscale \
  --concurrency 4 \
  --verbose
```

### Custom Configuration Files

Create a JSON configuration file:

```json
{
  "name": "my-custom-preset",
  "pipeline": [
    { "op": "metadata", "autorotate": true },
    { "op": "crop", "edge": "top", "value": 200 },
    { "op": "resize", "mode": "width", "value": 1024, "noUpscale": true },
    { "op": "convert", "format": "jpg", "quality": 85, "progressive": true },
    { "op": "metadata", "strip": true }
  ],
  "output": {
    "pattern": "{base}_processed.jpg"
  }
}
```

Then use it:

```bash
npm start -- -i ./images -o ./output --config my-preset.json
```

## CLI Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--input` | `-i` | Input file or directory (required) | - |
| `--output` | `-o` | Output directory | Same as input |
| `--resize` | `-r` | Resize: WxH, Wx, xH, contain:WxH, cover:WxH | - |
| `--crop` | `-c` | Crop: top:px, bottom:px, left:px, right:px | - |
| `--format` | `-f` | Output format: jpg, png, webp, avif | - |
| `--quality` | `-q` | Quality (0-100) | 85 |
| `--progressive` | - | Enable progressive JPEG | false |
| `--lossless` | - | Enable lossless compression (WebP) | false |
| `--strip` | - | Strip metadata | true |
| `--no-upscale` | - | Prevent upscaling | false |
| `--preset` | `-p` | Use built-in preset | - |
| `--config` | - | Path to custom JSON config | - |
| `--concurrency` | - | Number of concurrent operations | 4 |
| `--verbose` | `-v` | Verbose output | false |
| `--dry-run` | - | Dry run (no files written) | false |

## Built-in Presets

### web-large-jpg-1024
Resize to 1024px width, JPG quality 85, progressive, strip metadata
```bash
npm start -- -i input.jpg --preset web-large-jpg-1024
```

### social-square-1080
Resize to 1080x1080 (contain), JPG quality 90
```bash
npm start -- -i input.jpg --preset social-square-1080
```

### png-to-webp-lossless
Convert PNG to lossless WebP
```bash
npm start -- -i input.png --preset png-to-webp-lossless
```

### hq-avif
Resize to 1600px width, high-quality AVIF
```bash
npm start -- -i input.jpg --preset hq-avif
```

### crop-top-web-1024
Crop top 200px, resize to 1024px width, JPG quality 80
```bash
npm start -- -i input.jpg --preset crop-top-web-1024
```

## File Naming Patterns

Output files can use tokens in patterns:

- `{base}` - Original filename without extension
- `{ext}` - Output file extension
- `{w}` - Output width
- `{h}` - Output height
- `{fmt}` - Output format
- `{preset}` - Preset name
- `{idx}` - File index (for batch)
- `{hash}` - File hash (8 chars)
- `{date}` - Current date (YYYYMMDD)

Example: `{base}_{w}x{h}.{ext}` → `photo_1024x768.jpg`

## Supported Formats

### Input
- JPG/JPEG
- PNG
- WebP
- AVIF
- TIFF
- HEIC/HEIF (decode, if available)

### Output
- JPG/JPEG
- PNG
- WebP
- AVIF
- TIFF

## Development

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run dev & npm test
```

### Lint Code

```bash
npm run lint
```

### Clean Build

```bash
npm run clean
npm run build
```

## Project Structure

```
/src
  /core        # Core image processing engine
    types.ts   # TypeScript type definitions
    resizeImage.ts
    applyCrop.ts
    convertFormat.ts
    metadata.ts
    pipeline.ts
    utils.ts
    logger.ts
    index.ts
  /cli         # CLI interface
    index.ts   # Main CLI entry point
    args.ts    # Argument parsing
    presets.ts # Preset management
/config
  /presets     # Built-in preset JSON files
/tests         # Unit and integration tests
```

## Performance

- Uses libvips streaming for minimal memory usage
- Concurrent processing with configurable worker count
- Efficient batch processing
- Example: 50 × 4K images → JPG 1024px in ~30-60s on modern hardware

## Privacy & Security

- **100% local** - No network calls during processing
- **No telemetry** - No data collection or tracking
- **No uploads** - All files stay on your machine
- **Open source** - Review the code yourself

## Roadmap

See `image-tool-requirements.md` for the complete feature roadmap.

**v1.0 (MVP)** - Current
- Resize, convert, crop, compress
- Presets and batch processing
- CLI interface

**v1.1** (Planned)
- Target file size optimization
- Watermark/overlay support
- Multiple output sizes per pass

**v1.2** (Planned)
- Watch folder automation
- ICC profile management UI
- Web UI (optional)

**v2.0** (Future)
- Desktop app (Tauri)
- Preset sharing
- Plugin system

## Contributing

See `CONTRIBUTING.md` for contribution guidelines.

## License

MIT

## Author

Yatin Godse

---

**Note:** This tool is designed for privacy and runs entirely offline. No image data ever leaves your computer.

