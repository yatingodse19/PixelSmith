# PixelSmith ⚡

**Privacy-first, 100% browser-based image processor powered by WebAssembly**

> **🚀 WebAssembly Version** - This is the high-performance WebAssembly version that processes images entirely in your browser. No server, no uploads, lightning-fast performance!

PixelSmith is a powerful, client-side image processing tool that runs entirely in your browser using WebAssembly. It leverages industry-standard WASM libraries (Photon, MozJPEG, libwebp) to provide blazing-fast image resizing, format conversion, cropping, and compression—all without uploading your files anywhere.

---

## ⚡ Why WebAssembly?

| Feature | WebAssembly Version | Server Version |
|---------|---------------------|----------------|
| **Speed** | ⚡ ~150ms per image | ~800ms + network |
| **Privacy** | 🔒 100% browser-based | ⚠️ Server upload required |
| **Network** | ✅ Zero overhead | ❌ Upload + download |
| **Offline** | ✅ Works fully offline | ⚠️ Needs backend server |
| **Performance** | 🚀 4-10x faster | Baseline |
| **Infrastructure** | ✅ Zero cost (static) | 💰 Server costs |

---

## ✨ Features

### 🎨 Core Capabilities
- **Beautiful Web Interface** - Preset-first design with responsive 2-column layout, drag-and-drop file upload
- **Dark Mode** - Default dark theme with light mode toggle, persisted to localStorage
- **Mobile-Friendly** - Responsive design optimized for phones and tablets
- **WebAssembly Powered** - Near-native performance using Rust/WASM
- **100% Privacy** - Images never leave your device, EXIF automatically stripped
- **Batch Processing** - Process multiple images with progress tracking
- **Built-in Presets** - 8 ready-to-use workflows for common tasks (web optimization, social media, thumbnails, etc.)
- **Format Preservation** - Original format preserved by default (PNG stays PNG, JPEG stays JPEG)
- **HEIC/HEIF Support** - iOS photos automatically converted for processing
- **Works Offline** - No internet required after initial load
- **No Backend Needed** - Pure client-side, deploy to any static host

### 🖼️ Image Operations
- **Resize**
  - Modes: Width, Height, Contain, None (convert only)
  - Algorithm: Lanczos3 resampling (best quality)
  - Option: Prevent upscaling
- **Crop**
  - Edges: Top, Bottom, Left, Right
  - Modes: Pixels or Percentage (calculated based on actual image dimensions)
  - Multi-edge cropping support
- **Format Conversion**
  - **Auto (Default)** - Preserves original format (PNG stays PNG, JPEG stays JPEG, WebP stays WebP)
  - **JPEG** - Quality control (1-100) + **Progressive JPEG** support
  - **WebP** - Lossy compression with quality control (typically 25-35% smaller than JPEG)
  - **PNG** - Lossless compression
  - AVIF → WebP fallback (AVIF support coming soon)

### 🔒 Privacy & Metadata
- **Automatic EXIF Stripping** - Removes GPS, camera info, timestamps
- **Privacy-first Design** - All processing happens locally
- **Transparent UI** - Shows exactly what's happening to your images

### 🎯 Built-in Presets
All presets preserve original format by default (PNG stays PNG, JPEG stays JPEG):

**Web Optimization**
1. **Optimize for Web (800px)** - Resize to 800px, Quality 80, format preserved
2. **Optimize for Web (1024px)** - Resize to 1024px, Quality 85, format preserved
3. **Optimize for Web (1920px)** - Resize to 1920px, Quality 90, format preserved

**Thumbnails & Email**
4. **Create Thumbnail (300px)** - Resize to 300px, Quality 75, format preserved
5. **Optimize for Email (600px)** - Resize to 600px, Quality 70, format preserved

**Social Media**
6. **Social Media Square (1080×1080)** - Fit to 1080×1080, Quality 85, format preserved

**Format Conversion**
7. **Just Convert Format** - Keep original dimensions, convert to selected format only

**Advanced**
8. **Custom Settings** - Full control over resize, crop, format, quality, and metadata

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 20+ (LTS recommended)
- **npm**: 10+ (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/yatingodse19/PixelSmith.git
cd PixelSmith

# Install dependencies
npm install
```

### Running the Application

```bash
# Start the development server
npm start
```

This will:
1. Build the TypeScript files
2. Start the Vite dev server at **http://localhost:3000**
3. Open your browser automatically

### Using the Application

**Simple Preset-First Workflow:**

1. **Select a Preset** (Left Column)
   - Choose from 8 built-in presets organized by category
   - See live preview of actions that will be performed
   - Optionally enable crop (pixels or percentage mode)
   - For advanced users: Select "Custom Settings" for full control

2. **Upload Images** (Right Column)
   - Drag and drop files onto the upload area
   - Or click to browse and select files
   - Supports: JPEG, PNG, WebP, GIF, BMP, HEIC/HEIF (iOS)
   - Upload single or multiple images for batch processing

3. **Process**
   - Click "Process" button
   - Watch progress bar for batch processing
   - View results with file size information

4. **Download**
   - Download individual images
   - Or download all as ZIP file

**Custom Settings (Advanced):**
When you select "Custom Settings" preset, you get full control:
- **Resize**: Choose mode (none/width/height/contain) and dimensions
- **Crop**: Enable and set values for each edge (pixels or percentage)
- **Format**: Select output format (auto/JPEG/WebP/PNG)
  - **Auto (Default)**: Preserves original format
- **Quality**: Adjust slider (1-100, disabled for PNG)
- **Progressive JPEG**: Enable for gradual loading (JPEG only)
- **Strip EXIF**: Optional privacy protection (enabled by default)

---

## 📋 Commands Reference

### Development

```bash
# Start the UI (development mode with hot reload)
npm start
# or
npm run dev:ui

# Watch TypeScript files (optional, for library development)
npm run dev

# Build everything (TypeScript + UI production build)
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Production Build

```bash
# Build for production
npm run build

# Output location: dist/
# Contains optimized HTML, CSS, JS, and WASM files
# Ready to deploy to any static hosting service
```

### Build Output

After running `npm run build`, you'll get:

```
dist/
├── index.html                 # Entry point
├── assets/
│   ├── index-[hash].js        # ~765 KB (144 KB gzipped) - Main application
│   ├── index-[hash].css       # ~31 KB (6 KB gzipped) - Styles
│   ├── photon_rs_bg.wasm      # 1.88 MB - Photon (resize/crop)
│   ├── webp_enc.wasm          # 281 KB - WebP encoder
│   ├── webp_enc_simd.wasm     # 346 KB - WebP encoder (SIMD optimized)
│   ├── mozjpeg_enc.wasm       # 252 KB - MozJPEG encoder
│   └── mozjpeg_dec.wasm       # 166 KB - MozJPEG decoder
```

---

## 🏗️ Architecture

### 100% Client-Side Processing

```
User's Browser
    ↓
Select Images (File API)
    ↓
Decode with Browser/WASM
    ↓
Process with Photon (Rust/WASM)
    ↓
Encode with @jsquash/webp or @jsquash/jpeg
    ↓
Generate Blob URLs
    ↓
Download Results
```

**No server involved!** All processing happens in the browser using WebAssembly.

### Technology Stack

#### Frontend
- **React 18** - UI framework with hooks
- **TypeScript** - Strict mode for type safety
- **Vite 5** - Fast build tool with HMR
- **Tailwind CSS 3** - Utility-first styling
- **JSZip** - Client-side ZIP creation

#### WebAssembly Libraries
- **[@silvia-odwyer/photon](https://github.com/silvia-odwyer/photon)** - Rust-based image manipulation (resize, crop, filters)
- **[@jsquash/webp](https://github.com/jamsinclair/jSquash)** - Google libwebp (lossy WebP compression with quality control)
- **[@jsquash/jpeg](https://github.com/jamsinclair/jSquash)** - MozJPEG encoder (progressive JPEG, better compression)

#### Build Tools
- **vite-plugin-wasm** - WASM file handling
- **vite-plugin-top-level-await** - Async WASM initialization

---

## 🎯 Supported Operations

### Resize
- **Modes**:
  - `width`: Resize by width, maintain aspect ratio
  - `height`: Resize by height, maintain aspect ratio
  - `contain`: Fit within dimensions, maintain aspect ratio
  - `none`: No resizing (format conversion only)
- **Options**:
  - No upscale: Prevents enlarging images beyond original size
- **Algorithm**: Lanczos3 (industry-standard, best quality)

### Crop
- **Modes**:
  - **Pixels**: Crop by exact pixel values (e.g., 100px from top)
  - **Percentage**: Crop by percentage of image dimensions (e.g., 10% from top calculated on actual image size)
- **Edges**: Top, Bottom, Left, Right
- **Multi-edge**: Apply multiple crops in one operation
- **Order**: Top → Bottom → Left → Right (automatic)
- **Validation**: Prevents invalid crops (< 1px remaining)
- **Calculation**: Percentage values are calculated based on actual image dimensions at processing time

### Format Conversion

#### Auto (Default - Format Preservation)
- **Behavior**: Preserves original image format
  - PNG files stay PNG (preserves transparency)
  - JPEG files stay JPEG (preserves compression)
  - WebP files stay WebP (preserves modern format)
- **Quality**: Applies to lossy formats (JPEG, WebP), ignored for PNG
- **Use case**: Best for general optimization while maintaining format characteristics

#### JPEG
- **Encoder**: MozJPEG (industry-standard, used by Google/Facebook)
- **Quality**: 1-100 (higher = better quality, larger file)
- **Progressive**: Optional (gradual loading, slightly larger files)
- **Compression**: ~5-10% better than standard JPEG encoder
- **EXIF**: Automatically stripped for privacy
- **Use case**: Convert any image to JPEG for maximum compatibility

#### WebP
- **Encoder**: Google libwebp
- **Quality**: 1-100 (lossy compression)
- **Typical savings**: 25-35% smaller than JPEG at same quality
- **Browser support**: Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
- **Use case**: Best compression for modern browsers

#### PNG
- **Encoder**: Photon (lossless compression)
- **Best for**: Graphics, text, transparency
- **Note**: Quality slider has no effect (lossless format)
- **Use case**: Convert images requiring transparency or lossless quality

---

## 📦 Bundle Size

| Component | Uncompressed | Gzipped | Description |
|-----------|--------------|---------|-------------|
| **JavaScript** | 765 KB | 145 KB | React app + UI |
| **CSS** | 31 KB | 6 KB | Tailwind styles |
| **Photon WASM** | 1,881 KB | ~600 KB | Resize/crop/filters |
| **WebP WASM** | 346 KB | ~120 KB | WebP encoder (SIMD) |
| **MozJPEG WASM** | 418 KB | ~150 KB | JPEG encoder/decoder |
| **Total (First Load)** | ~3.44 MB | ~1.02 MB | One-time download |

### Performance Notes
- ✅ WASM files cached by browser (only downloaded once)
- ✅ SIMD-optimized encoders auto-selected on supported browsers
- ✅ Lazy loading: WASM modules loaded on first use
- ✅ Offline-ready: Works without internet after first visit

---

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status | Notes |
|---------|-----------------|--------|-------|
| **Chrome** | 91+ | ✅ Fully Supported | Best performance (SIMD) |
| **Firefox** | 89+ | ✅ Fully Supported | Good performance |
| **Safari** | 15+ | ✅ Fully Supported | iOS 15+ supported |
| **Edge** | 91+ | ✅ Fully Supported | Chromium-based |
| **Opera** | 77+ | ✅ Fully Supported | Chromium-based |

**Requirements**:
- WebAssembly support
- WebAssembly SIMD (optional, provides 2-3x speedup)
- JavaScript enabled
- Modern ES6+ features

---

## 🚢 Deployment

Since this is a pure client-side app, you can deploy to **any static hosting service**:

### Netlify (Recommended)

```bash
# Build the app
npm run build

# Option 1: Drag and drop
# Go to https://app.netlify.com/drop
# Drag dist folder

# Option 2: Netlify CLI
npm install -g netlify-cli
netlify deploy --dir=dist --prod
```

### Vercel

```bash
# Build the app
npm run build

# Deploy with Vercel CLI
npm install -g vercel
vercel --prod
# When prompted, set output directory to: dist
```

### GitHub Pages

```bash
# Build the app
npm run build

# Deploy to gh-pages branch
cd dist
git init
git add -A
git commit -m "Deploy to GitHub Pages"
git push -f git@github.com:YOUR_USERNAME/PixelSmith.git main:gh-pages

# Enable GitHub Pages in repository settings
# Source: gh-pages branch
```

### Cloudflare Pages

```bash
# Build the app
npm run build

# Connect your GitHub repo to Cloudflare Pages
# Build command: npm run build
# Build output directory: dist
```

### Any Static Server

```bash
# Build the app
npm run build

# Serve dist with any static server:
# - nginx
# - Apache
# - Caddy
# - Python: python -m http.server -d dist
# - Node.js: npx serve dist
```

---

## ⚙️ Configuration

### Vite Configuration

The build is configured in `src/ui/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [
    react(),
    wasm(),           // WASM file handling
    topLevelAwait(),  // Async WASM initialization
  ],
  optimizeDeps: {
    // Exclude WASM packages from pre-bundling
    exclude: ['@silvia-odwyer/photon', '@jsquash/webp', '@jsquash/jpeg'],
  },
  build: {
    target: 'esnext',  // Modern JS for best WASM support
  },
});
```

### TypeScript Configuration

Strict mode enabled for type safety (`src/ui/tsconfig.json`):

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

---

## 🔧 Development Tips

### Hot Module Replacement (HMR)

Vite provides instant updates during development:

```bash
npm start
# Edit files in src/ui/src/
# Browser updates automatically
```

### Debugging

Open browser DevTools and check Console for logs:

```
[WASM] Initializing Photon WebAssembly module...
[WASM] Photon initialized successfully
[WASM] Processing image.jpg (2.5 MB)
[WASM] Loaded image: 4032x3024
[WASM] Resized to: 1024x768
[WASM] Encoding WebP with quality 85
[WASM] Processed in 142ms, output: 156.3 KB
```

### Performance Profiling

Use Chrome DevTools Performance tab:
1. Start recording
2. Process an image
3. Stop recording
4. Look for WASM execution time

Expected performance:
- Image decode: 20-50ms
- Resize (Photon): 30-80ms
- WebP encode: 40-100ms
- **Total**: ~100-200ms per image

---

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Project context and architecture for Claude Code
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

---

## ⚠️ Current Limitations

The following features are **not yet supported** in the WebAssembly version:

| Feature | Status | Workaround |
|---------|--------|------------|
| **AVIF format** | ❌ Not supported | Auto-converts to WebP with quality control |
| **EXIF autorotate** | ❌ Not supported | Most browsers auto-rotate on display |

**Note**: The following features were previously listed as limitations but are **now fully supported**:
- ✅ Progressive JPEG (added with MozJPEG)
- ✅ Strip EXIF metadata (automatic, always enabled)
- ✅ WebP quality control (added with @jsquash/webp)
- ✅ HEIC/HEIF support (added with heic2any for iOS mobile)
- ✅ Dark mode (default dark theme with toggle)

---

## 🆚 Comparison with Server Version

| Feature | WebAssembly (This Branch) | Server (Sharp) |
|---------|--------------------------|----------------|
| **Processing Location** | Browser (WASM) | Server (Node.js) |
| **Speed** | ⚡⚡⚡⚡⚡ ~150ms | ⚡⚡⚡ ~800ms + network |
| **Privacy** | 🔒 100% client-side | ⚠️ Uploads to server |
| **Deployment** | Static hosting ($0) | Needs server ($$$) |
| **Offline** | ✅ Full support | ❌ Requires server |
| **Progressive JPEG** | ✅ Supported | ✅ Supported |
| **WebP Quality** | ✅ Lossy + quality | ✅ Lossy + quality |
| **Strip EXIF** | ✅ Automatic | ✅ Optional |
| **AVIF Format** | ❌ WebP fallback | ✅ Full support |
| **Autorotate** | ❌ Not supported | ✅ Supported |
| **HEIC/HEIF** | ✅ Auto-converts to JPEG | ✅ Supported |
| **Dark Mode** | ✅ Default dark theme | ❌ N/A |

**Recommendation**: Use WebAssembly version unless you specifically need AVIF or autorotate.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linter: `npm run lint`
6. Build: `npm run build` (ensure it succeeds)
7. Commit with conventional commit format: `git commit -m "feat: add amazing feature"`
8. Push to branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 🐛 Troubleshooting

### "Failed to initialize WebAssembly module"

**Problem**: WASM files not loading properly

**Solutions**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite src/ui/node_modules/.vite

# Reinstall dependencies
npm install

# Restart dev server
npm start
```

### "Expected magic word 00 61 73 6d"

**Problem**: Vite pre-bundling WASM packages

**Solution**: Already fixed in `vite.config.ts` with:
```typescript
optimizeDeps: {
  exclude: ['@silvia-odwyer/photon', '@jsquash/webp', '@jsquash/jpeg'],
}
```

### Blank page when processing

**Problem**: Blob URL issues or result display bug

**Solution**:
1. Check browser console for errors
2. Ensure you're using a modern browser (Chrome 91+, Firefox 89+, Safari 15+)
3. Try a different image format

### Images not downloading

**Problem**: Popup blocker or browser permissions

**Solution**:
1. Allow popups for the site
2. Check browser console for blocked downloads
3. Try using the "Download All as ZIP" option instead

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

**Summary**: Free to use, modify, and distribute. No warranty provided.

---

## 🙏 Credits

### WebAssembly Libraries
- **[Photon](https://github.com/silvia-odwyer/photon)** by [@silvia-odwyer](https://github.com/silvia-odwyer) - Rust/WASM image processing
- **[jSquash](https://github.com/jamsinclair/jSquash)** by [@jamsinclair](https://github.com/jamsinclair) - Browser-focused image codecs (WebP, MozJPEG)
- **[MozJPEG](https://github.com/mozilla/mozjpeg)** by Mozilla - Industry-standard JPEG encoder
- **[libwebp](https://chromium.googlesource.com/webm/libwebp)** by Google - WebP encoder/decoder
- **[heic2any](https://github.com/nichenqin/heic2any)** - HEIC/HEIF to JPEG/PNG conversion for iOS support

### Frontend
- **[React](https://react.dev/)** - UI framework
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling framework
- **[JSZip](https://stuk.github.io/jszip/)** - ZIP file creation

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yatingodse19/PixelSmith/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yatingodse19/PixelSmith/discussions)
- **Documentation**: [docs/](docs/) (when available)

---

## 🗺️ Roadmap

### Planned Features
- [ ] AVIF support (when browser WASM encoder available)
- [ ] EXIF autorotate (add exif-js library)
- [ ] WebP lossless mode toggle
- [ ] Custom preset saving (localStorage)
- [ ] Image comparison slider (before/after)
- [ ] Watermark support
- [ ] Batch preset application
- [ ] PWA support (offline installation)

### Under Consideration
- [x] ~~HEIC/HEIF support~~ ✅ Added in v2.2.0
- [ ] PDF to image conversion
- [ ] SVG optimization
- [ ] GIF optimization
- [ ] Image filters (brightness, contrast, saturation)

---

## 📊 Stats

- **Bundle Size**: ~3.4 MB uncompressed, ~1 MB gzipped
- **Processing Speed**: ~100-200ms per image (average)
- **Browser Support**: Chrome 91+, Firefox 89+, Safari 15+, Edge 91+
- **Privacy**: 100% client-side, no tracking, no analytics
- **Cost**: $0 to deploy (static hosting)

---

**Made with ❤️ for privacy • Powered by WebAssembly • 100% Open Source**

**⭐ If you find this useful, please star the repository!**
