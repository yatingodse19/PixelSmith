# Changelog

All notable changes to PixelSmith will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-12-13

### 🎨 Major: UI/UX Redesign - Preset-First Approach

This release focuses on simplifying the user interface based on feedback that the previous design was too technical and overwhelming for non-technical users.

#### Added

- **Format Preservation (Auto-Detection)** (`src/ui/src/utils/wasmImageProcessor.ts`)
  - New `'auto'` format option preserves original image format
  - PNG stays PNG (preserves transparency)
  - JPEG stays JPEG (preserves compression characteristics)
  - WebP stays WebP (preserves modern format)
  - Intelligent format detection based on file extension via `detectFormatFromFile()`
  - All presets now use format preservation by default

- **Crop by Pixels or Percentage** (`src/ui/src/components/SettingsPanel.tsx`)
  - Toggle between pixel-based and percentage-based cropping
  - Percentage values calculated based on actual image dimensions at processing time
  - Real-time conversion: `getPixelValue()` in WASM processor
  - UI shows appropriate units (px or %) based on selected mode
  - Max values adjust automatically (4000px or 100%)

- **Preset-First UI Design** (`src/ui/src/components/PresetSelector.tsx`)
  - Categorized preset dropdown (Web Optimization, Thumbnails & Email, Social Media, etc.)
  - Live preview of actions that will be performed
  - Optional crop addon with pixels/percentage toggle
  - "Custom Settings" preset for advanced users with full control

- **2-Column Responsive Layout** (`src/ui/src/App.tsx`)
  - Left column: Configuration options (preset selector)
  - Right column: Upload, process button, and results
  - Mobile-friendly: Stacks vertically on screens < 768px
  - Bottom section: 3 info boxes (Privacy, Quick Tips, Features)

- **Context-Aware Tips** (`src/ui/src/components/QuickGuide.tsx`)
  - Tips change based on selected preset
  - Different guidance for Web, Thumbnail, Email, Social, Convert, and Custom presets
  - Split into 3 separate boxes: Privacy, Quick Tips, Features
  - Color-coded with green (privacy), blue (tips), purple (features)

- **Strip EXIF Metadata Toggle** (`src/ui/src/components/SettingsPanel.tsx`)
  - Made optional instead of always-on
  - Enabled by default for privacy
  - Visual indicator shows privacy status (green/amber)
  - Warning message when disabled about GPS/metadata preservation

#### Changed

- **Preset Organization** (`src/ui/src/presets.ts`)
  - Reorganized into 5 categories:
    - Web Optimization (3 presets: 800px, 1024px, 1920px)
    - Thumbnails & Email (2 presets: 300px, 600px)
    - Social Media (1 preset: 1080×1080)
    - Format Conversion (1 preset: Just Convert Format)
    - Advanced (1 preset: Custom Settings)
  - All presets changed from explicit JPEG/WebP to `format: 'auto'`
  - Updated preset descriptions to reflect format preservation

- **Custom Settings Panel Improvements** (`src/ui/src/components/SettingsPanel.tsx`)
  - Resize mode default changed from `'width'` to `'none'` (no default selection)
  - Output format default changed from `'jpg'` to `'auto'` (preserve format)
  - Crop enable checkbox moved next to "Crop" label (not far right)
  - Improved field labels for clarity:
    - "Resize Mode" with clear option names
    - "Output Format" with format characteristics
    - "Quality" with contextual notes
  - Added embedded mode support via `embedded` prop

- **README.md Documentation**
  - Complete rewrite of "Using the Application" section
  - Documented preset-first workflow (select preset → upload → process)
  - Added 2-column layout description
  - Updated Built-in Presets section with categorized list
  - Expanded Format Conversion section with Auto mode explanation
  - Added crop by pixels/percentage documentation
  - Included use cases for each format option

#### Fixed

- **Crop Input "0" Sticking Issue** ([#517ac7a](https://github.com/yatingodse19/PixelSmith/commit/517ac7a))
  - Input fields no longer show "0" when empty
  - Changed controlled input to show empty string when value is 0
  - Makes it easier to type new crop values
  - Applied to all 4 crop inputs (top, bottom, left, right)

- **Crop Percentage Calculation** ([#19c0737](https://github.com/yatingodse19/PixelSmith/commit/19c0737))
  - Fixed incorrect hardcoded multiplier (was 10x regardless of image size)
  - Now calculates percentage based on actual image dimensions
  - Example: 50% from top on 1000px image = 500px (not 500px always)
  - Moved calculation from PresetSelector to WASM processor for accuracy
  - Added console logging for debugging: `[WASM] Converting 10% to 100px (dimension: 1000px)`

#### Technical Details

**Format Preservation Flow:**
```typescript
// Before (explicit format conversion)
{ op: 'convert', format: 'jpg', quality: 85 }

// After (format preservation)
{ op: 'convert', format: 'auto', quality: 85 }

// At processing time
if (format === 'auto') {
  format = detectFormatFromFile(file.name); // 'jpg' | 'png' | 'webp'
}
```

**Crop Percentage Calculation:**
```typescript
// Before (WRONG - hardcoded multiplier)
const pixels = value * 10; // 10% always = 100px

// After (CORRECT - uses actual dimension)
const pixels = Math.round((value / 100) * dimension);
// 10% of 1000px = 100px
// 10% of 500px = 50px
```

**UI Layout Structure:**
```
┌─────────────────────────────────────┐
│           Header                     │
├──────────────────┬──────────────────┤
│  Left Column     │  Right Column     │
│  - Presets       │  - Upload         │
│  - Crop (opt)    │  - Process        │
│                  │  - Results        │
├──────────────────┴──────────────────┤
│  Privacy | Tips | Features          │
│  (3 info boxes side-by-side)        │
└─────────────────────────────────────┘
```

#### Migration Notes

**For End Users:**
- No breaking changes - existing workflow still works
- New preset-first approach is simpler but old settings still accessible
- Format is now preserved by default (PNG stays PNG)
- Crop by percentage available for easier edge removal

**For Developers:**
- `format: 'auto'` is now the default in all presets
- Crop operations now include optional `mode: 'pixels' | 'percent'`
- SettingsPanel accepts `embedded?: boolean` prop for layout flexibility
- README updated with latest workflow and features

---

## [2.0.0] - 2025-11-19

### 🚀 Major: WebAssembly Client-Side Processing

This is a **major rewrite** that eliminates server-side processing and moves all image operations to the browser using WebAssembly.

#### Added

- **WebAssembly Processing Engine** (`src/ui/src/utils/wasmImageProcessor.ts`)
  - 100% client-side image processing using Photon (Rust/WASM)
  - 4-10x faster than previous server-based approach
  - Zero network overhead - images never leave the browser
  - Real-time progress tracking (not simulated)
  - Parallel batch processing with configurable concurrency

- **Photon Library Integration** (`@silvia-odwyer/photon v0.3.3`)
  - High-performance Rust image library compiled to WebAssembly
  - Supports JPEG, PNG, WebP formats
  - 5 sampling algorithms (Nearest, Triangle, CatmullRom, Gaussian, Lanczos3)
  - Automatic memory management with `.free()` cleanup

- **Documentation**
  - Comprehensive WebAssembly guide (`docs/WEBASSEMBLY.md`)
  - Architecture documentation
  - Performance benchmarks
  - Migration guide
  - Troubleshooting section

#### Changed

- **App.tsx**: Replaced server API calls with WASM processing
  - `handleProcess()` now calls `processImageWASM()` / `processBatchWASM()`
  - Added `pipelineToProcessingOptions()` converter
  - Updated progress tracking to use real callbacks instead of simulated intervals

- **UI Messages**:
  - Header: "100% browser-based • WebAssembly powered"
  - Privacy notice: "Privacy Protected ⚡ WebAssembly"
  - Emphasized lightning-fast processing

- **Build Output**:
  - WASM binary now included: `photon_rs_bg-[hash].wasm` (1.88 MB)
  - Total bundle size increased by ~2 MB (gzipped: ~600 KB)

#### Improved

- **Performance**:
  - Single image: ~150ms (was ~800ms) - **5.3x faster**
  - Batch (10 images): ~500ms (was ~3000ms) - **6x faster**
  - No network latency or serialization overhead

- **Privacy**:
  - Images **never** uploaded to server
  - 100% offline capability (after initial page load)
  - True client-side processing (not just marketing claim)

- **User Experience**:
  - Instant feedback - processing starts immediately
  - Real progress bar based on actual completed images
  - No delay between 100% and success notification

#### Limitations

- **AVIF format**: Not supported by Photon (automatically falls back to WebP)
- **Metadata operations**: autorotate and strip not available (WASM limitation)
- **Progressive JPEG**: Not configurable in Photon
- **Browser compatibility**: Requires WebAssembly SIMD (Chrome 91+, Firefox 89+, Safari 15+)

#### Technical Details

**Processing Flow:**
```
OLD: Browser → Server (Sharp) → Browser
     [~800ms + network overhead]

NEW: Browser (Photon/WASM)
     [~150ms, zero network]
```

**Memory Management:**
- Input images decoded to RGBA (4x original size)
- Peak memory: ~2x decoded size during processing
- Automatic cleanup with `PhotonImage.free()`

**Concurrency:**
- Default: 4 parallel operations
- Respects `navigator.hardwareConcurrency`
- Batch processing with progress callbacks

---

## [1.1.0] - 2025-11-19

### Added

- **"No Resize" Mode**: Added "None (convert only)" option in resize mode dropdown
  - Allows format-only conversion without resizing
  - Skips resize operation entirely for faster processing
  - Hides resize-specific controls when selected

### Fixed

- **Progress Bar Issues**:
  - Single images now show indeterminate spinner instead of instant 100%
  - Removed simulated progress interval that caused delay after 100%
  - Progress now reflects actual processing state

### Changed

- **LoadingOverlay Component**:
  - Shows progress bar only for multiple images (`total > 1`)
  - Shows indeterminate spinner for single images
  - Improved UX with contextual messages

---

## [1.0.0] - 2025-11-19

### Initial Release

#### Features

- **Modern Web GUI** with React + Vite + Tailwind CSS
- **Drag-and-drop** file upload with visual feedback
- **Preset System**: 5 built-in presets for common operations
- **Comprehensive Image Operations**:
  - Resize: width, height, contain modes
  - Crop: top, bottom, left, right edges
  - Convert: JPEG, PNG, WebP, AVIF
  - Quality/compression control
  - Metadata: autorotate, strip EXIF

#### User Interface

- **FileDropzone**: Drag-and-drop + click to upload
- **SettingsPanel**: Visual controls for all operations
  - Resize mode selector
  - 2×2 crop grid (top, bottom, left, right)
  - Format selector with quality slider
  - "Prevent upscaling" checkbox

- **PresetSelector**: Quick access to common workflows
  - web-large-jpg-1024
  - social-square-1080
  - png-to-webp-lossless
  - hq-avif
  - crop-top-web-1024

- **ResultsDisplay**:
  - Grid view of processed images
  - Individual download buttons
  - Bulk download (ZIP for multiple images)
  - Success/error status for each image

- **Toast Notifications** (react-toastify):
  - Success, error, and info messages
  - Bottom-right positioning
  - Auto-dismiss with progress bar

- **Loading Overlay**:
  - Full-screen overlay during processing
  - Dual-ring spinner with pulsing center
  - Progress bar for batch operations
  - Shimmer animation

#### Backend

- **Express Server** (port 3001):
  - `/api/process` - Single image processing
  - `/api/process-batch` - Batch processing with concurrency
  - `/api/presets` - List available presets
  - `/api/presets/:name` - Get specific preset
  - Multer for file upload handling
  - Static file serving for results

- **Core Processing Engine** (Sharp/libvips):
  - Pipeline architecture for chaining operations
  - Validation and error handling
  - Concurrency control for batch processing
  - Metadata preservation options

#### CLI

- **Command-line Interface** (yargs):
  - `pixelsmith process <input> [options]`
  - `pixelsmith batch <dir> [options]`
  - `pixelsmith preset <name> <input>`
  - Support for all GUI operations
  - Ora spinners + chalk colors

#### Configuration

- **5 Built-in Presets** (JSON):
  ```
  config/presets/
  ├── web-large-jpg-1024.json
  ├── social-square-1080.json
  ├── png-to-webp-lossless.json
  ├── hq-avif.json
  └── crop-top-web-1024.json
  ```

#### Documentation

- **README.md**: Project overview, quick start, features
- **image-tool-requirements.md**: Detailed product requirements
- **ARCHITECTURE.md**: Technical architecture and design
- **PRESETS.md**: Preset definitions and usage
- **CONTRIBUTING.md**: Contribution guidelines
- **CLAUDE.md**: Instructions for AI-assisted development

#### Testing

- **Test Suite** with Jest:
  - Unit tests for core operations
  - Integration tests for pipeline
  - Test coverage for resize, crop, convert

#### Developer Experience

- **TypeScript** (strict mode):
  - Full type safety
  - Interface definitions for all data structures
  - IntelliSense support

- **Hot Module Replacement**:
  - Vite HMR for instant UI updates
  - Nodemon for server auto-restart

- **Code Quality**:
  - ESLint configuration
  - Prettier formatting
  - Git hooks with Husky (optional)

#### Privacy & Security

- **Privacy-First Design**:
  - Local-only processing (in v1.0, server-side but local)
  - No telemetry or analytics
  - No external API calls
  - All processing happens on user's machine

- **Security**:
  - Input validation for all operations
  - File type checking (magic numbers)
  - Size limits for uploads
  - CORS configuration

#### Cross-Platform

- **Supported Platforms**:
  - macOS (Intel + Apple Silicon)
  - Windows (x64)
  - Linux (x64, ARM64)

- **Supported Browsers**:
  - Chrome/Edge 90+
  - Firefox 88+
  - Safari 14+

---

## Versioning Strategy

- **Major (X.0.0)**: Breaking changes, major rewrites (e.g., WebAssembly migration)
- **Minor (x.X.0)**: New features, non-breaking changes
- **Patch (x.x.X)**: Bug fixes, small improvements

---

## Migration Notes

### From 1.x to 2.0 (WebAssembly)

**For End Users:**
- No action required
- Expect much faster processing
- AVIF format will automatically convert to WebP

**For Developers:**
- Server-side API endpoints remain functional but are no longer used by GUI
- To use WASM version: checkout `claude/webassembly-client-side-processing-*` branch
- To use server version: checkout `claude/review-markdown-files-*` branch

**Breaking Changes:**
- AVIF format support removed (WebP fallback)
- Metadata operations (autorotate, strip) not available in WASM version
- Progressive JPEG option not configurable

---

## Roadmap

### Planned for 2.1.0
- [ ] Web Workers for true multi-threading
- [ ] Drag reordering for pipeline operations
- [ ] Custom preset creation in GUI
- [ ] Keyboard shortcuts

### Planned for 2.2.0
- [ ] AVIF support via alternative WASM library
- [ ] Metadata preservation (EXIF, ICC profiles)
- [ ] Advanced filters and effects

### Planned for 3.0.0
- [ ] Desktop app with Tauri
- [ ] PWA with offline support
- [ ] GPU acceleration (WebGPU)

---

**Repository**: https://github.com/yatingodse19/PixelSmith
**License**: MIT
