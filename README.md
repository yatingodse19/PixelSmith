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
- **Beautiful Web Interface** - Drag-and-drop UI with real-time processing
- **WebAssembly Powered** - Near-native performance using Rust/WASM
- **100% Privacy** - Images never leave your device, EXIF automatically stripped
- **Batch Processing** - Process multiple images with progress tracking
- **Built-in Presets** - 8 ready-to-use workflows for common tasks
- **Works Offline** - No internet required after initial load
- **No Backend Needed** - Pure client-side, deploy to any static host

### 🖼️ Image Operations
- **Resize**
  - Modes: Width, Height, Contain, None (convert only)
  - Algorithm: Lanczos3 resampling (best quality)
  - Option: Prevent upscaling
- **Crop**
  - Edges: Top, Bottom, Left, Right
  - Multi-edge cropping support
- **Format Conversion**
  - **JPEG** - Quality control (1-100) + **Progressive JPEG** support
  - **WebP** - Lossy compression with quality control (typically 25-35% smaller than JPEG)
  - **PNG** - Lossless compression
  - AVIF → WebP fallback (AVIF support coming soon)

### 🔒 Privacy & Metadata
- **Automatic EXIF Stripping** - Removes GPS, camera info, timestamps
- **Privacy-first Design** - All processing happens locally
- **Transparent UI** - Shows exactly what's happening to your images

### 🎯 Built-in Presets
1. **Web Large (JPEG 1024px)** - Resize to 1024px, JPEG 85
2. **Web Medium (WebP 800px)** - Resize to 800px, WebP 80 (smaller files)
3. **Social Media Square (1080x1080)** - Perfect for Instagram/Facebook
4. **Thumbnail (300px)** - Fast-loading thumbnails
5. **High Quality WebP (1920px)** - Large screens with great compression
6. **Email Friendly (600px)** - Small file size for emails
7. **PNG to WebP** - Convert and compress
8. **Compress JPEG** - Re-compress to reduce file size

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

1. **Upload Images**
   - Drag and drop files onto the upload area
   - Or click to browse and select files
   - Supports: JPEG, PNG, WebP, GIF, BMP

2. **Choose a Preset** (Optional)
   - Select from 8 built-in presets for common workflows
   - Or configure custom settings below

3. **Configure Settings**
   - **Resize**: Choose mode (width/height/contain/none) and dimensions
   - **Crop**: Enable and set pixel values for each edge
   - **Format**: Select output format (JPEG/WebP/PNG)
   - **Quality**: Adjust slider (disabled for PNG, enabled for JPEG/WebP)
   - **Progressive JPEG**: Enable for gradual loading (JPEG only)
   - **Strip EXIF**: Always enabled for privacy

4. **Process**
   - Click "Process" button
   - Watch progress bar for batch processing
   - View results with before/after comparison

5. **Download**
   - Download individual images
   - Or download all as ZIP file

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
- **Edges**: Top, Bottom, Left, Right (in pixels)
- **Multi-edge**: Apply multiple crops in one operation
- **Order**: Top → Bottom → Left → Right (automatic)
- **Validation**: Prevents invalid crops (< 1px remaining)

### Format Conversion

#### JPEG
- **Encoder**: MozJPEG (industry-standard, used by Google/Facebook)
- **Quality**: 1-100 (higher = better quality, larger file)
- **Progressive**: Optional (gradual loading, slightly larger files)
- **Compression**: ~5-10% better than standard JPEG encoder
- **EXIF**: Automatically stripped for privacy

#### WebP
- **Encoder**: Google libwebp
- **Quality**: 1-100 (lossy compression)
- **Typical savings**: 25-35% smaller than JPEG at same quality
- **Browser support**: Chrome 23+, Firefox 65+, Safari 14+, Edge 18+

#### PNG
- **Encoder**: Photon (lossless compression)
- **Best for**: Graphics, text, transparency
- **Note**: Quality slider has no effect (lossless format)

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
- [ ] HEIC/HEIF support
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
