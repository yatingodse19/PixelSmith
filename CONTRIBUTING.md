# CONTRIBUTING.md — Contribution Guidelines

Thank you for contributing to the Image Resizer/Converter Tool!

---

## 1. Branching Model
- `main` → stable, production‑ready.
- `develop` (optional) → integration branch.
- Feature branches:
  ```
  feature/<feature-name>
  bugfix/<issue>
  chore/<task>
  ```
- PRs must originate from non‑main branches.

---

## 2. Commit Style — Conventional Commits
Examples:
- `feat: add AVIF encode support`
- `fix: handle HEIC decode failure`
- `docs: update presets documentation`
- `refactor: clean resize pipeline`

---

## 3. Code Requirements
- All code must be TypeScript (strict mode).
- Keep functions small and isolated.
- No `any`; use proper types.
- No external telemetry or API calls.
- Follow file naming:
  ```
  resizeImage.ts
  convertFormat.ts
  applyCrop.ts
  ```

---

## 4. Tests
Every PR must include:
- Unit tests for added logic
- Integration tests if pipeline behavior changes
- Pixel‑diff tests for transformations
- Performance checks for large batch changes

Run tests:
```
npm test
```

---

## 5. Documentation Updates
If a PR changes:
- presets  
- CLI flags  
- architecture  
- processing engine  

You MUST update corresponding `.md` files:
- `PRESETS.md`
- `CLAUDE.md`
- `ARCHITECTURE.md`

---

## 6. Code Review Rules
- PR must pass CI tests.
- Code must be understandable without guessing.
- Refactor if something takes too long to explain.
- Avoid overly complex pipelines—keep logic pure.

---

## 7. Security & Privacy
- This tool is **100% local**.
- You may NOT:
  - add analytics
  - call third‑party APIs
  - log user images
  - upload anything externally

---

## 8. Checklist Before Merging
- [ ] Tests added/updated  
- [ ] Docs updated  
- [ ] No untyped values  
- [ ] No dead code  
- [ ] Performance not degraded  
- [ ] No network calls added  

---

Happy contributing! 🎉
