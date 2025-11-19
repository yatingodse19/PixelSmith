# CLAUDE.md — Image Resizer/Converter Tool

## 1. Project Context
This project is a **privacy‑first**, offline image processing tool for resizing, converting, cropping, and compressing images (single or bulk).  

Key objectives:
- 100% local processing (no uploads).
- Simple UI and/or CLI workflow.
- Batch capabilities with predictable output.
- Cross‑platform support (macOS / Windows / Linux).

## 2. Setup & Environment
### Dependencies
- Node.js 20+
- TypeScript
- Image engine: `sharp` (libvips)
- Optional desktop wrapper: Tauri
- Optional PWA/WebAssembly pipeline

### Install (CLI mode)
```bash
npm install
npm run build
npm start
```

### Folder Structure (MVP)
```
/src
  /cli        # CLI entrypoint
  /ui         # Web UI (optional)
  /core       # image processing logic
/tests        # tests & golden images
/config       # presets & recipes
```

## 3. Key Commands
- `npm run build` — build TypeScript
- `npm test` — run test suite
- `npm run lint` — code style
- `pixelsmith --help` — CLI help

## 4. Code Style & Conventions
- ES Modules everywhere.
- TypeScript strict mode.
- Clear naming: resizeImage(), applyCrop(), etc.
- Comments explain **why**, not what.
- One function per responsibility.

## 5. Workflow & Branching
- `main` = stable branch.
- Use `feature/*` branches.
- PRs must include tests + updated docs.
- Conventional Commits: `feat:`, `fix:`, etc.
- Version tags: `v1.0.0`, `v1.1.0`…

## 6. Architecture Summary
- Core engine (sharp/libvips).
- Optional UI with drag‑drop + presets.
- Configurable pipelines for batch processing.
- Token‑based naming: `{base}_{w}x{h}_{fmt}.{ext}`.

## 7. Known Pitfalls
- HEIC decoding depends on platform support.
- Large batches require concurrency management.
- Web UI (PWA) may need file system API permissions.

## 8. Testing Strategy
- Unit tests for each operation.
- Integration tests for pipelines.
- Golden image pixel‑diff verification.
- Performance checks (e.g., 50 images < 60 sec).

## 9. Instructions for Claude Code
- Refer to this CLAUDE.md before making changes.
- Ask clarifying questions for image pipeline logic.
- Maintain TypeScript strictness.
- Ensure tests + docs updated for any major change.
- Respect privacy rules: no network/telemetry additions.

## 10. See Also
- requirements.md — full product spec
- PRESETS.md — preset definitions (optional)
- CONTRIBUTING.md — contribution rules (optional)

> Privacy Note: No external API calls. Entire app must run offline.
