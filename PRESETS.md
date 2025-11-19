# PRESETS.md — Image Processing Presets

This file defines reusable presets (“recipes”) for the image resizer/converter tool.

---

## ⭐ Built-in Presets (MVP)

### 1. Web Large JPG (1024w)
```
{
  "name": "web-large-jpg-1024",
  "pipeline": [
    { "op": "resize", "mode": "width", "value": 1024, "noUpscale": true },
    { "op": "convert", "format": "jpg", "quality": 85, "progressive": true },
    { "op": "metadata", "strip": true, "autorotate": true }
  ],
  "output": { "pattern": "{base}_1024w.jpg" }
}
```

### 2. Social Square 1080 JPG
```
{
  "name": "social-square-1080",
  "pipeline": [
    { "op": "resize", "mode": "contain", "width": 1080, "height": 1080 },
    { "op": "convert", "format": "jpg", "quality": 90 },
    { "op": "metadata", "strip": true }
  ],
  "output": { "pattern": "{base}_1080sq.jpg" }
}
```

### 3. Lossless PNG → WebP
```
{
  "name": "png-to-webp-lossless",
  "pipeline": [
    { "op": "convert", "format": "webp", "lossless": true }
  ],
  "output": { "pattern": "{base}.webp" }
}
```

### 4. High‑Quality AVIF
```
{
  "name": "hq-avif",
  "pipeline": [
    { "op": "resize", "mode": "width", "value": 1600 },
    { "op": "convert", "format": "avif", "cq": 25, "speed": 4 },
    { "op": "metadata", "strip": true }
  ],
  "output": { "pattern": "{base}_avif.avif" }
}
```

---

## 📁 Custom Preset Guidelines
- Must define a `pipeline` (sequence of ops).
- Ops must be valid: `resize`, `crop`, `convert`, `compress`, `metadata`.
- `output.pattern` supports tokens:
  `{base}`, `{ext}`, `{w}`, `{h}`, `{fmt}`, `{preset}`, `{idx}`, `{hash}`.

---

## 🔧 Example Advanced Preset — Crop Top + Resize + Web Optimize
```
{
  "name": "crop-top-web-1024",
  "pipeline": [
    { "op": "crop", "edge": "top", "value": 200 },
    { "op": "resize", "mode": "width", "value": 1024 },
    { "op": "convert", "format": "jpg", "quality": 80, "progressive": true }
  ],
  "output": { "pattern": "{base}_1024_crop.jpg" }
}
```
