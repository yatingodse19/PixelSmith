# ARCHITECTURE.md — System Architecture

This document describes the architecture of the Local Image Resizer/Converter Tool (“PixelSmith”).

---

# 1. High-Level Overview
PixelSmith is a **local-only**, privacy‑focused image processing engine built on:
- **Node.js + TypeScript** (core + CLI)
- **sharp/libvips** for high-performance image ops
- Optional **React/Vite UI**
- Optional **Tauri** desktop build

---

# 2. Core Components

## 2.1 Core Image Engine (`/src/core`)
Responsibilities:
- Decode input images
- Apply pipeline operations (crop → resize → convert → compress → metadata)
- Write output files to disk
- Produce metadata: width, height, file size

Key files:
```
resizeImage.ts
applyCrop.ts
convertFormat.ts
optimizeJpeg.ts
optimizeWebp.ts
optimizeAvif.ts
metadata.ts
```

---

# 3. Pipeline Architecture

Each request is processed as a **pipeline** of steps defined in JSON or CLI flags.

### Pipeline Example
```
[
  { op: "crop", edge: "top", value: 200 },
  { op: "resize", mode: "width", value: 1024 },
  { op: "convert", format: "jpg", quality: 85 }
]
```

### Execution Flow
1. Load → Decode  
2. Normalize (rotate via EXIF)  
3. Apply each step in order  
4. Write file  
5. Output metadata + logs  

---

# 4. CLI Architecture (`/src/cli`)
- Parses flags (yargs/commander)
- Translates flags → pipeline JSON
- Runs parallel processing queue (concurrency = CPU cores)
- Logs progress and errors

CLI supports:
- Resize
- Crop
- Convert
- Compression
- Metadata stripping
- Batch operations
- Recipes (`--config file.json`)

---

# 5. UI Architecture (`/src/ui`)
Optional lightweight UI:
- Dropzone for files/folders
- Settings panel (resize/crop/convert/compress)
- Live preview  
- Preset selection  
- Progress bar  
- Save options  
- Offline PWA capability (optional)  

Built using:
- React + Vite  
- Web Workers for non-blocking processing  
- Optional WASM codecs for browser-only mode  

---

# 6. Desktop Architecture (Optional Tauri)
Tauri shell:
- Rust-powered performance
- Secure FS access
- Small binary (<10MB)
- Bridges UI ↔ Node core or Rust processing plugin

---

# 7. Preset & Config Engine
Presets are stored in:
```
/config/presets/*.json
```

Each preset includes:
- pipeline
- output pattern
- metadata/directives

---

# 8. Logging & Error Handling
- Processing errors logged per-file  
- Failures DO NOT stop the entire batch  
- Summary printed at end  

Error types:
- Corrupted image
- Unsupported format
- Write failure
- Memory limit exceeded (rare with libvips)

---

# 9. Performance Strategy
- libvips streaming for minimal RAM use  
- Parallel job queue  
- Skip processing if already below target size  
- Use fast resize kernels when acceptable  
- Optional WASM SIMD acceleration (browser)

---

# 10. Security Model
- No external calls  
- No analytics  
- No image uploads  
- Strict file system sandboxing for UI/PWA  
- Desktop app signed & notarized (optional)

---

# 11. Future Extensions
- Watch-folder automation  
- Multi-output pipeline (generate 1024, 512, 256 at once)  
- Watermarking  
- HEIC/HEIF encoding (license check required)  
