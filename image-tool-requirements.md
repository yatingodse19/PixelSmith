
# Local Image Resizer/Converter — Requirements

> **Working title:** PixelSmith (rename anytime)  
> **Owner:** yatin godse  
> **Version:** 1.0 (Draft)  
> **Goal:** Privacy‑first, ad‑free tool to resize, convert, crop, and compress images locally with optional bulk processing. Runs fully offline.

---

## 1) Problem & Goals

**Problem:** Most online image tools are ad‑heavy, slow, and risky for sensitive assets. We need a simple, reliable, *local* tool for image resizing, conversion, and cropping with bulk processing.

**Primary goals**
- 100% **local processing** (no uploads; keep assets private).
- **Fast** single and bulk operations for common tasks (resize, crop, convert, compress).
- **Simple UI**: drop files → pick actions → process → download/save.
- **Deterministic output**: predictable file names, sizes, and formats.
- **Cross‑platform**: macOS, Windows, Linux.

**Non‑goals** (MVP)
- Advanced creative editing (layers, brushes, masks).
- RAW development pipeline.
- Server deployment / multi‑user collaboration.

---

## 2) User Personas & Key Scenarios

**Persona A — Tech Manager / Producer (you)**
- Needs quick, consistent output for menu cards, signage, and social posts.
- Wants batch convert + resize with strict size caps.

**Persona B — Designer / Marketer**
- Prefers visual previews and presets for platforms.

**Persona C — Developer/Automation**
- Wants CLI/JSON config support to run in scripts.

**Scenarios**
1. Convert a **15 MB** image → **JPEG 1024 px width**, height auto, crop **top 200 px**.
2. Bulk: Select a folder of PNGs → resize to multiple sizes (e.g., 1024, 512) → output JPG/WebP with naming scheme.
3. Web‑optimized output: strip EXIF, enable progressive JPEG, quality target ~300 KB.

---

## 3) Functional Requirements (MVP)

### 3.1 Operations
- **Resize**
  - By width (px) with auto height (keep AR)
  - By height (px) with auto width
  - Fit inside bounding box (max W×H)
  - Optional **no upscale** toggle
- **Crop**
  - Fixed pixels from edges (Top/Bottom/Left/Right)
  - Percent crop (e.g., top 10%)
  - Anchor/gravity (North, South, East, West, Center)
- **Convert**
  - Formats: **JPG/JPEG, PNG, WebP, AVIF** (MVP), **HEIC/HEIF (decode)** if available
  - Color space handling: sRGB enforce (optional)
- **Compress**
  - JPEG quality (0–100), progressive toggle
  - WebP quality (0–100), lossless toggle
  - AVIF cq/quality & speed preset
  - Target file size (best‑effort iterative, optional)
- **Metadata**
  - Strip EXIF/ICC (default) or preserve
  - Auto‑rotate using EXIF orientation

### 3.2 Batch & Pipelines
- Process multiple files via **drag‑drop** or **folder select** (desktop mode).
- **Pipelines**: Apply steps in order (e.g., crop → resize → convert → compress → metadata).
- **Presets**
  - Built‑in: “Web Large 1024w JPG”, “Social Square 1080 JPG”, “Lossless PNG→WebP”, “Hi‑quality AVIF”.
  - User‑saved presets (JSON export/import).
- **Naming & Output**
  - Output folder chooser; mirror input tree (optional).
  - File naming: `{base}_{w}x{h}_{fmt}.{ext}` with tokens (base, width, height, date, hash, preset).

### 3.3 UX
- Single page interface: **Input → Actions → Preview → Process**.
- Live **preview** of first file and **before/after** size/estimates.
- Progress bar with per‑file status (Success / Skipped / Error).
- Error surfacing (unsupported codec, corrupt image).

### 3.4 CLI (optional but recommended)
- `pixelsmith -i ./in -o ./out --resize 1024x --crop top:200 --format jpg --quality 85 --strip`
- Accept **JSON recipe**: `pixelsmith --config recipe.json`

---

## 4) Non‑Functional Requirements

- **Privacy:** No network calls during processing. (Hard block unless user enables update check.)
- **Security:** No data telemetry. Local filesystem access only with user consent.
- **Performance:**
  - 20 × 4K images → processed under 60 sec on Apple Silicon M‑series (target).
  - WebAssembly SIMD if available.
- **Reliability:** Atomic writes to avoid partial files; safe overwrite option.
- **Accessibility:** Keyboard operable, proper labels, color‑contrast AA.
- **Internationalization:** English MVP; i18n hooks.

---

## 5) Architecture Options

### Option A — **Pure Browser PWA (Offline‑first)**
- **Stack:** TypeScript + Vite, React (or Svelte), Web Workers, **WebAssembly** codecs, OffscreenCanvas.
- **Codecs/Processing:**
  - **Squoosh codecs (WASM):** MozJPEG, WebP, AVIF
  - **wasm‑imagemagick** for broad feature fallback (heavier)
  - Canvas for basic resize/crop when acceptable
- **Pros:** No install, runs in any modern browser, sandboxed, easy sharing.
- **Cons:** Limited direct folder access (File System Access API works best in Chromium), HEIC may be tricky; memory caps.

### Option B — **Desktop App (Tauri recommended)**
- **Stack:** Tauri (Rust shell) + React/TS frontend; optional **libvips** via native plugin for speed.
- **Pros:** Direct filesystem, better performance, system dialogs, smaller footprint than Electron, true offline.
- **Cons:** Native build pipeline; more packaging complexity than PWA.

### Option C — **Node.js + CLI + Minimal UI**
- **Stack:** Node.js + **sharp** (libvips) for processing; Express + minimal web UI (local only) if needed.
- **Pros:** Fast, proven; integrates with scripts; good for batch/automation.
- **Cons:** Requires Node runtime; browser preview is via local server.

> **Recommendation:** Start with **Option C (Node + sharp)** for fastest MVP and solid bulk performance, then add a **Tauri wrapper** later for a polished desktop experience. Offer a light **PWA** for on‑the‑go single‑file jobs.

---

## 6) Tech Stack (proposed MVP)

- **Core:** Node.js 20+, TypeScript
- **Image engine:** **sharp** (libvips) for resize/convert/compress
- **CLI:** yargs/commander + chalk + ora (progress)
- **Local UI (optional):** Vite + React; communicates with Node via local IPC/HTTP (localhost only)
- **Packaging (desktop path):** Tauri for cross‑platform installers
- **Config:** JSON recipes + .env for defaults
- **Testing:** Vitest/Jest; sample golden images for visual regression

---

## 7) Supported Formats (MVP)

- **Decode:** JPG/JPEG, PNG, WebP, AVIF, TIFF; (HEIC/HEIF *decode* if libheif available)
- **Encode:** JPG/JPEG, PNG, WebP, AVIF
- **Color:** sRGB output (default), attach/strip ICC profile option

---

## 8) Detailed Behavior

### 8.1 Resize
- Modes: width‑only, height‑only, contain, cover, exact (with crop), no‑upscale.
- Lanczos3 kernel default; fast bilinear option for speed.

### 8.2 Crop
- Pixels from edges; percentages; gravity anchors.
- Smart cover fit (center crop to fill target rectangle).

### 8.3 Compression
- JPEG: quality, progressive, trellis (if supported), chroma‑subsample 4:2:0.
- WebP: quality, lossless, near‑lossless.
- AVIF: cq, speed, subsample, max threads.

### 8.4 Metadata & Rotation
- Strip EXIF by default; optional preserve list (DateTime, GPS, Copyright).
- Auto‑rotate using EXIF orientation.

### 8.5 Naming Strategy
- Tokens: `{base}`, `{ext}`, `{w}`, `{h}`, `{fmt}`, `{preset}`, `{hash}`, `{idx}`.
- Example: `banner_{w}x{h}_{fmt}.jpg` → `banner_1024x576_jpg.jpg`.

### 8.6 Failure Handling
- Skip corrupt files; write error log (CSV/JSON) with reasons.
- Partial failures do not stop the batch; summary at end.

---

## 9) UX Outline (MVP)

1. **Top bar**: App name, Preset selector (dropdown), Save/Load preset.
2. **Drop zone**: Drag‑drop files/folders; shows list with size & format.
3. **Actions panel** (left):
   - Resize (width/height/box, no‑upscale)
   - Crop (px or %; gravity)
   - Convert (target format)
   - Compression (quality, progressive, speed)
   - Metadata (strip/preserve; auto‑rotate)
4. **Preview pane** (right): before/after toggle; est. output size.
5. **Footer**: Output folder, naming pattern, Process button, progress bar.

---

## 10) CLI Spec (Draft)

```bash
pixelsmith \
  --input ./in \
  --output ./out \
  --resize "1024x" \
  --crop "top:200" \
  --format jpg \
  --quality 85 \
  --progressive \
  --strip \
  --no-upscale
```

**Flags**
- `--resize <WxH|Wx|xH|contain:WxH|cover:WxH>`
- `--crop <top:px|bottom:px|left:px|right:px|pct:10|gravity:north>`
- `--format <jpg|png|webp|avif>`
- `--quality <0..100>`
- `--progressive` (JPEG)
- `--strip` (remove metadata)
- `--preset <name>` / `--config <file.json>`
- `--no-upscale`
- `--threads <n>`

**JSON recipe example**
```json
{
  "pipeline": [
    { "op": "crop", "edge": "top", "value": 200 },
    { "op": "resize", "mode": "width", "value": 1024, "noUpscale": true },
    { "op": "convert", "format": "jpg", "quality": 85, "progressive": true },
    { "op": "metadata", "strip": true, "autorotate": true }
  ],
  "output": { "dir": "./out", "pattern": "{base}_{w}x{h}.{fmt}" }
}
```

---

## 11) Performance Plan
- Use **libvips** (via sharp) — streaming, low memory.
- Enable **concurrency** with queue sized to CPU cores.
- Optional **WebAssembly SIMD** path for PWA build (Squoosh codecs).
- Cache decoded headers to skip no‑ops (e.g., already ≤ target width).

---

## 12) Security & Privacy
- No external requests by default (disable update checks).
- Sandboxed PWA; desktop app signed; code‑signed builds.
- Local logs only; user can purge logs/cache.

---

## 13) Packaging & Distribution
- **Node CLI:** publish as npm package (`npx pixelsmith`).
- **Desktop:** Tauri bundles for macOS (universal), Windows (MSI), Linux (AppImage/deb/rpm).
- **PWA:** Installable (Add to Home Screen); offline cache via Service Worker.

---

## 14) Testing
- Unit tests for operations; golden‑file comparisons (pixel diff tolerance).
- Sample corpus: landscape, portrait, transparency, large HEIC, CMYK JPEG.
- Benchmark suite (time, memory, output size) per preset.

---

## 15) Roadmap
- **v1.0 (MVP):** Resize/convert/crop, presets, batch, CLI, basic UI.
- **v1.1:** Target‑size encoder (binary search), watermark/overlay, multiple output sizes per pass.
- **v1.2:** Watch‑folder automation, HEIC encode (if licensing OK), ICC management UI.
- **v2.0:** Full desktop app, preset sharing, plugin hooks.

---

## 16) Open Questions
- Must **HEIC decode** be mandatory in MVP? (Licensing & platform constraints.)
- Prefer **PWA first** or **Node CLI first**?
- Any enterprise‑grade constraints (code‑signing, notarization, auto‑updates)?

---

## 17) Acceptance Criteria (MVP)
- Can process a **15 MB** source → **JPEG 1024w** with **top crop 200 px** under **1s** on Apple Silicon.
- Batch: **50 images** mixed formats → JPEG/WebP in **<60s** with zero crashes.
- No network calls made during processing (verified by instrumentation).

---

### Appendix: Example sharp pipeline (pseudo‑code)
```ts
import sharp from 'sharp'

async function process(input, outDir) {
  const topCrop = 200
  const width = 1024
  const quality = 85

  const img = sharp(input, { failOn: 'none' })
    .rotate() // EXIF auto‑rotate
    .extract({ left: 0, top: topCrop, width: null, height: null }) // top crop; compute height after metadata

  const meta = await img.metadata()
  const h = Math.max(1, (meta.height ?? 0) - topCrop)
  const w = meta.width ?? 0

  await sharp(input)
    .rotate()
    .extract({ left: 0, top: topCrop, width: w, height: h })
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, progressive: true, mozjpeg: true })
    .toFile(`${outDir}/output.jpg`)
}
```
