# PixelSmith Documentation

Welcome to the PixelSmith documentation! This directory contains detailed guides and technical documentation for developers and advanced users.

## 📚 Available Documentation

### [WEBASSEMBLY.md](./WEBASSEMBLY.md)
**WebAssembly Implementation Guide** - Comprehensive documentation for the client-side processing implementation.

**Topics covered:**
- Why WebAssembly? Performance comparison and architecture
- Technical stack: Photon library overview
- Supported operations and limitations
- Detailed processing pipeline
- Performance benchmarks
- Memory management
- Browser compatibility
- Deployment guide
- Development workflow
- Troubleshooting
- Future enhancements

**Target audience**: Developers implementing or maintaining the WebAssembly version

---

## 🔀 Branch Documentation

### Main Branches

#### `claude/review-markdown-files-*` (Original)
- **Architecture**: Express server + Sharp (libvips) backend
- **Processing**: Server-side
- **Performance**: ~800ms per image (including network overhead)
- **Supported formats**: JPEG, PNG, WebP, AVIF
- **Metadata**: Full support (autorotate, strip EXIF)

#### `claude/webassembly-client-side-processing-*` (WebAssembly)
- **Architecture**: Browser-only with Photon (Rust/WASM)
- **Processing**: Client-side (100% local)
- **Performance**: ~150ms per image (zero network overhead)
- **Supported formats**: JPEG, PNG, WebP (AVIF → WebP fallback)
- **Metadata**: Limited (WASM constraint)

---

## 📖 Other Documentation Files

Located in the project root:

### Core Documentation
- **[../README.md](../README.md)** - Project overview, quick start, installation
- **[../CHANGELOG.md](../CHANGELOG.md)** - Version history and release notes
- **[../CLAUDE.md](../CLAUDE.md)** - Instructions for AI-assisted development

### Requirements & Design
- **[../image-tool-requirements.md](../image-tool-requirements.md)** - Product requirements and specifications
- **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - System architecture and design decisions
- **[../PRESETS.md](../PRESETS.md)** - Preset system documentation
- **[../CONTRIBUTING.md](../CONTRIBUTING.md)** - How to contribute to PixelSmith

---

## 🎯 Quick Links

### For End Users
- [Installation Guide](../README.md#installation)
- [Usage Guide](../README.md#usage)
- [Preset Reference](../PRESETS.md)

### For Developers
- [Architecture Overview](../ARCHITECTURE.md)
- [WebAssembly Guide](./WEBASSEMBLY.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Development Setup](../README.md#development)

### For Contributors
- [Code Style Guide](../CONTRIBUTING.md#code-style)
- [Testing Guide](../CONTRIBUTING.md#testing)
- [Pull Request Process](../CONTRIBUTING.md#pull-requests)

---

## 🔍 Finding What You Need

**Want to...**

- **Understand the WebAssembly implementation?** → Read [WEBASSEMBLY.md](./WEBASSEMBLY.md)
- **See what changed in each version?** → Check [CHANGELOG.md](../CHANGELOG.md)
- **Learn the architecture?** → Read [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Use PixelSmith?** → Start with [README.md](../README.md)
- **Contribute code?** → Follow [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Work with AI tools?** → See [CLAUDE.md](../CLAUDE.md)

---

## 📝 Documentation Standards

When adding new documentation:

1. **Use Markdown** with GitHub-flavored syntax
2. **Include examples** for complex concepts
3. **Add a table of contents** for long documents
4. **Link related documents** for cross-referencing
5. **Update this README** when adding new docs

---

## 🤝 Contributing to Documentation

Documentation improvements are always welcome! If you:

- Find unclear explanations
- Spot errors or outdated information
- Want to add examples or tutorials
- Have suggestions for better organization

Please:
1. Open an issue describing the problem
2. Or submit a pull request with the fix
3. Follow the [Contributing Guidelines](../CONTRIBUTING.md)

---

## 📧 Support

If you can't find what you're looking for:

1. Check the [GitHub Issues](https://github.com/yatingodse19/PixelSmith/issues)
2. Search the documentation with Ctrl+F
3. Open a new issue with the "documentation" label

---

**Last Updated**: 2025-11-19
**PixelSmith Version**: 2.0.0
