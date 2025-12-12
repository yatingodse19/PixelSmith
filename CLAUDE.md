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

## 4. Development Workflow
### UI Development
```bash
npm run dev:ui      # Start Vite dev server (hot reload)
npm run build:ui    # Production build
npm run preview     # Preview production build
```

### CLI Development
```bash
npm run dev         # TypeScript watch mode
npm run build       # Build CLI + UI
npm test           # Run tests in watch mode
npm run test:run   # Run tests once
```

## 5. Code Style & Conventions
- ES Modules everywhere.
- TypeScript strict mode.
- Clear naming: resizeImage(), applyCrop(), etc.
- Comments explain **why**, not what.
- One function per responsibility.

## 6. UI Development Guidelines
### React Component Patterns
- Functional components with hooks (no class components).
- Keep components small and focused (< 200 lines).
- Co-locate styles when using Tailwind utilities.
- Use react-dropzone for file uploads.
- Toast notifications via react-toastify for user feedback.

### State Management
- useState/useReducer for local component state.
- Lift state up when shared between components.
- No global state library (keep it simple for MVP).

### Vite Configuration
- WASM support via vite-plugin-wasm.
- Top-level await enabled for ES module compatibility.
- React Fast Refresh for instant hot reload.

### TailwindCSS Conventions
- Use utility classes over custom CSS.
- Mobile-first responsive design.
- Dark mode support optional for MVP.

## 7. Workflow & Branching
- `main` = stable branch.
- Use `feature/*` branches.
- PRs must include tests + updated docs.
- Conventional Commits: `feat:`, `fix:`, etc.
- Version tags: `v1.0.0`, `v1.1.0`…

## 8. Architecture Summary
- Core engine (sharp/libvips).
- Optional UI with drag‑drop + presets.
- Configurable pipelines for batch processing.
- Token‑based naming: `{base}_{w}x{h}_{fmt}.{ext}`.

## 9. WebAssembly Integration
### Browser-Side Processing
- Uses `@silvia-odwyer/photon` for WASM-based image operations.
- `@jsquash/jpeg` and `@jsquash/webp` for format conversion.
- Processing happens entirely in browser (no server uploads).

### WASM Module Loading
- Modules load asynchronously on first use.
- Use top-level await for cleaner async initialization.
- Handle loading errors gracefully with fallback messages.

### Performance Considerations
- WASM is fast but has initialization overhead.
- Batch operations benefit from worker threads (future enhancement).
- Memory management: release ImageData after processing.

## 10. Error Handling Patterns
### User-Facing Errors
- Use react-toastify for non-blocking notifications.
- Error messages should be actionable (e.g., "Unsupported format. Try JPEG, PNG, or WebP").
- Never expose internal stack traces to users.

### File Processing Errors
- Log per-file errors but continue batch processing.
- Collect failed files and show summary at end.
- Validate file types before processing.

### Network & WASM Errors
- Gracefully handle WASM module loading failures.
- Provide offline-friendly error messages.
- No silent failures—always notify user.

## 11. Known Pitfalls
- HEIC decoding depends on platform support.
- Large batches require concurrency management.
- Web UI (PWA) may need file system API permissions.

## 12. Testing Strategy
### Testing Framework
- Vitest for unit and integration tests.
- Pixelmatch for visual regression (golden images).
- Run `npm test` for watch mode, `npm run test:run` for CI.

### Test Organization
- Unit tests: One test file per module (`core.test.ts`).
- Integration tests: Test full pipelines end-to-end.
- Golden images: Store in `/tests/fixtures/` for comparison.

### What to Test
- Image processing operations (resize, crop, convert).
- Error handling (invalid inputs, unsupported formats).
- Pipeline execution order and data flow.
- WASM module loading and fallbacks.

### Performance Testing
- Benchmark: 50 images should process in < 60 seconds.
- Memory: No leaks during batch operations.
- Visual diffs: Pixel-perfect output matches expected.

## 13. Instructions for Claude Code
- Refer to this CLAUDE.md before making changes.
- Ask clarifying questions for image pipeline logic.
- Maintain TypeScript strictness.
- Ensure tests + docs updated for any major change.
- Respect privacy rules: no network/telemetry additions.
- Follow React/Vite conventions for UI changes.
- Test WASM integration thoroughly in browser environment.

## 14. See Also
- [image-tool-requirements.md](image-tool-requirements.md) — full product spec
- [PRESETS.md](PRESETS.md) — preset definitions
- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution rules
- [ARCHITECTURE.md](ARCHITECTURE.md) — detailed system architecture
- [DEPLOY.md](DEPLOY.md) — deployment guidelines
- [docs/WEBASSEMBLY.md](docs/WEBASSEMBLY.md) — WebAssembly integration details

> Privacy Note: No external API calls. Entire app must run offline.
