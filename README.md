# PixelSmith ⚡

**Privacy-first, 100% browser-based image processor powered by WebAssembly**

> **🚀 WebAssembly Branch** - This is the high-performance WebAssembly version that processes images entirely in your browser. No server, no uploads, lightning-fast performance!

PixelSmith is a powerful, client-side image processing tool that runs entirely in your browser using WebAssembly. It leverages the Photon library (Rust/WASM) to provide blazing-fast image resizing, format conversion, cropping, and compression—all without uploading your files anywhere.

---

## ⚡ Why WebAssembly?

| Feature | WebAssembly Version | Server Version |
|---------|---------------------|----------------|
| **Speed** | ⚡ ~150ms per image | ~800ms + network |
| **Privacy** | 🔒 100% browser-based | ⚠️ Server upload required |
| **Network** | ✅ Zero overhead | ❌ Upload + download |
| **Offline** | ✅ Works fully offline | ⚠️ Needs backend server |
| **Performance** | 🚀 4-10x faster | Baseline |

---

## ✨ Features

- **🎨 Beautiful Web Interface** - Drag-and-drop UI with real-time processing
- **⚡ WebAssembly Powered** - Near-native performance in your browser
- **🔒 100% Privacy** - Images never leave your device
- **📦 Batch Processing** - Process multiple images with progress tracking
- **🖼️ Image Operations**:
  - Resize (width, height, contain modes)
  - Crop (top, bottom, left, right edges)
  - Convert formats (JPG, PNG, WebP)
  - Quality control and compression
- **🎯 Built-in Presets** - Quick access to common workflows
- **🌐 Works Offline** - No internet required after initial load
- **⚙️ No Backend Needed** - Pure client-side processing

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

```bash
npm start
```

This will open the UI at **http://localhost:3000**

### 3. Process Images

1. Drag and drop images or click to select
2. Choose your settings (resize, crop, format)
3. Click "Process" - lightning-fast results! ⚡
4. Download individual images or bulk ZIP

That's it! No server setup required.

---

## 📋 Commands Reference

### Development

```bash
# Start the UI (development mode)
npm start
# or
npm run dev:ui

# Build everything (TypeScript + UI)
npm run build

# Watch TypeScript files (optional, for development)
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

### Production Build

```bash
# Build for production
npm run build

# Output will be in src/ui/dist/
# Deploy this folder to any static hosting service
```

---

## 🏗️ Architecture

### 100% Client-Side Processing

```
User's Browser
    ↓
Select Images
    ↓
WebAssembly (Photon) Processing
    ↓
Download Results (Blob URLs)
```

**No server involved!** All processing happens in the browser using WebAssembly.

### Technology Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Image Processing**: Photon (Rust/WebAssembly)
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)

---

## 🎯 Supported Operations

### Resize
- **Modes**: Width, Height, Contain, None (convert only)
- **Options**: Prevent upscaling
- **Algorithm**: Lanczos3 (best quality)

### Crop
- **Edges**: Top, Bottom, Left, Right
- **Units**: Pixels
- **Multi-edge**: Apply multiple crops simultaneously

### Format Conversion
- **Supported**: JPEG, PNG, WebP
- **Quality**: Adjustable (0-100)
- **Note**: AVIF automatically converts to WebP

---

## 📦 Bundle Size

| File | Size | Gzipped |
|------|------|---------|
| WASM Binary | 1.88 MB | ~600 KB |
| JavaScript | 347 KB | 108 KB |
| CSS | 31 KB | 6 KB |
| **Total** | ~2.26 MB | ~714 KB |

One-time download, then works fully offline!

---

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome | 91+ | ✅ Supported |
| Firefox | 89+ | ✅ Supported |
| Safari | 15+ | ✅ Supported |
| Edge | 91+ | ✅ Supported |

**Requirement**: WebAssembly SIMD (Baseline 2023)

---

## 📚 Documentation

- **[WebAssembly Implementation Guide](docs/WEBASSEMBLY.md)** - Complete technical documentation
- **[Changelog](CHANGELOG.md)** - Version history and release notes
- **[Documentation Index](docs/README.md)** - All documentation files

---

## 🔧 CLI (Optional)

The CLI still exists for command-line batch processing using Sharp (server-side):

```bash
# Build the CLI
npm run build

# Process a single image
node dist/cli/index.js process input.jpg --resize width:1024 --format webp

# Process a directory
node dist/cli/index.js batch ./photos --resize width:1024

# Use a preset
node dist/cli/index.js preset web-large-jpg-1024 input.png
```

**Note**: The CLI uses Sharp (not WebAssembly) and requires Node.js.

---

## 🚢 Deployment

Since this is a pure client-side app, you can deploy to any static hosting:

### Netlify
```bash
npm run build
# Drag src/ui/dist folder to Netlify
```

### Vercel
```bash
npm run build
# Deploy src/ui/dist folder
```

### GitHub Pages
```bash
npm run build
cd src/ui/dist
git init
git add -A
git commit -m "Deploy"
git push -f git@github.com:username/repo.git main:gh-pages
```

### Any Static Server
```bash
npm run build
# Serve src/ui/dist with nginx, Apache, etc.
```

---

## ⚠️ Limitations

Compared to the server-side version:

- **AVIF format**: Not supported (auto-converts to WebP)
- **Metadata operations**: Autorotate and strip EXIF not available
- **Progressive JPEG**: Not configurable
- **Large batches**: May be slower on low-end devices

For these features, use the server-side branch: `claude/review-markdown-files-*`

---

## 🔄 Branch Comparison

| Branch | Processing | Speed | Privacy | AVIF | Metadata |
|--------|------------|-------|---------|------|----------|
| **webassembly-*** | Browser (WASM) | ⚡⚡⚡⚡⚡ | 🔒🔒🔒 | ❌ | ❌ |
| **review-markdown-*** | Server (Sharp) | ⚡⚡⚡ | 🔒🔒 | ✅ | ✅ |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Credits

- **[Photon](https://github.com/silvia-odwyer/photon)** - WebAssembly image processing library
- **[React](https://react.dev/)** - UI framework
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yatingodse19/PixelSmith/issues)
- **Documentation**: [docs/](docs/)
- **WebAssembly Guide**: [docs/WEBASSEMBLY.md](docs/WEBASSEMBLY.md)

---

**Made with ❤️ for privacy • Powered by WebAssembly • 100% Open Source**
