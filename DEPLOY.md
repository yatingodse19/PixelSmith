# PixelSmith - Deployment Guide

Complete guide for building and deploying PixelSmith to production.

---

## 🏗️ Build Process

### Prerequisites
- Node.js 20+
- npm 10+

### Build Commands

```bash
# Clean previous builds
npm run clean

# Build for production
npm run build

# Preview the build locally
npm run preview
```

### Build Output

After running `npm run build`, the production-ready files will be in:

```
src/ui/dist/
├── index.html              # Entry point
├── assets/
│   ├── index-[hash].js     # ~295 KB (54 KB gzipped) - Main app
│   ├── vendor-react-[hash].js    # ~141 KB (45 KB gzipped) - React
│   ├── vendor-image-[hash].js    # ~97 KB (30 KB gzipped) - JSZip
│   ├── index-[hash].css    # ~31 KB (6 KB gzipped) - Styles
│   ├── photon_rs_bg.wasm   # 1.88 MB - Photon (resize/crop)
│   ├── webp_enc*.wasm      # 281-346 KB - WebP encoder
│   ├── mozjpeg_*.wasm      # 166-252 KB - MozJPEG encoder/decoder
│   └── webp_dec.wasm       # 138 KB - WebP decoder
```

**Total Bundle Size:**
- JavaScript: ~533 KB (129 KB gzipped) - split into 3 chunks
- CSS: ~31 KB (6 KB gzipped)
- WASM: ~3.1 MB total
- **First Load: ~3.7 MB uncompressed, ~1.1 MB gzipped**

**Note**: The bundle size warning is suppressed because WASM files are expected to be large. The JavaScript is properly code-split.

---

## 📦 What to Deploy

**Deploy the entire `src/ui/dist/` folder** to your static hosting provider.

This folder contains:
- ✅ Optimized HTML, CSS, JavaScript
- ✅ WebAssembly modules (WASM files)
- ✅ All necessary assets
- ✅ Ready for production

---

## 🚀 Deployment Options

### 1. Netlify (Recommended) ⭐

#### Option A: Drag & Drop
```bash
npm run build
# Go to https://app.netlify.com/drop
# Drag the src/ui/dist folder to the upload area
```

#### Option B: Netlify CLI
```bash
npm run build
npm install -g netlify-cli
netlify login
netlify deploy --dir=src/ui/dist --prod
```

#### Option C: Git Integration
1. Push code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `src/ui/dist`
   - **Node version**: `20`

**Netlify Configuration File** (optional):

Create `netlify.toml` in the root:
```toml
[build]
  command = "npm run build"
  publish = "src/ui/dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"

[[headers]]
  for = "/*.wasm"
  [headers.values]
    Content-Type = "application/wasm"
```

---

### 2. Vercel

```bash
npm run build
npm install -g vercel
vercel login
vercel --prod
```

When prompted:
- **Build Command**: `npm run build`
- **Output Directory**: `src/ui/dist`
- **Install Command**: `npm install`

**Vercel Configuration File** (optional):

Create `vercel.json` in the root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "src/ui/dist",
  "framework": null,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

### 3. Cloudflare Pages

#### Option A: Dashboard
1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Click "Create a project"
3. Connect your Git repository
4. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `src/ui/dist`
   - **Root directory**: `/`
   - **Node version**: `20`

#### Option B: Wrangler CLI
```bash
npm run build
npm install -g wrangler
wrangler pages deploy src/ui/dist --project-name=pixelsmith
```

---

### 4. GitHub Pages

```bash
# Build the app
npm run build

# Navigate to build output
cd src/ui/dist

# Initialize git in dist folder
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
git push -f git@github.com:YOUR_USERNAME/PixelSmith.git main:gh-pages

# Go to repository Settings > Pages
# Set source to: gh-pages branch, / (root)
```

**GitHub Actions Workflow** (automated deployment):

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./src/ui/dist
```

---

### 5. Static Server (nginx, Apache, etc.)

```bash
# Build the app
npm run build

# Copy to web server
scp -r src/ui/dist/* user@server:/var/www/pixelsmith/

# Or rsync
rsync -avz --delete src/ui/dist/ user@server:/var/www/pixelsmith/
```

**nginx Configuration**:
```nginx
server {
    listen 80;
    server_name pixelsmith.example.com;
    root /var/www/pixelsmith;
    index index.html;

    # Enable gzip
    gzip on;
    gzip_types text/css application/javascript application/wasm;
    gzip_min_length 1000;

    # Cache WASM files
    location ~* \.wasm$ {
        add_header Content-Type application/wasm;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Cache static assets
    location ~* \.(js|css)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache Configuration** (.htaccess):
```apache
# Enable gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/wasm
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType application/wasm "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
</IfModule>

# SPA routing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

### 6. Docker (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/src/ui/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t pixelsmith .
docker run -p 8080:80 pixelsmith
```

---

## 🔍 Verification

After deployment, verify:

### 1. Check WASM Loading
Open browser DevTools Console:
```
[WASM] Initializing Photon WebAssembly module...
[WASM] Photon initialized successfully
```

### 2. Test Image Processing
1. Upload an image
2. Click "Process"
3. Check for:
   - ✅ No console errors
   - ✅ Processing completes successfully
   - ✅ Download works

### 3. Check Performance
- First load: ~1-2 seconds (WASM download)
- Subsequent loads: <500ms (cached)
- Image processing: ~100-200ms per image

### 4. Test Offline
1. Process an image once (to cache WASM)
2. Disconnect internet
3. Reload page
4. Should still work!

---

## 🐛 Troubleshooting

### Build Warnings

#### "Some chunks are larger than 500 kB"
✅ **Fixed!** The Vite config now:
- Splits code into vendor chunks (React, JSZip)
- Sets `chunkSizeWarningLimit: 1000`
- WASM files are expected to be large

#### "npm warn deprecated"
⚠️ These are upstream dependency warnings and don't affect functionality:
- `eslint@8` → Will upgrade to v9 in future
- `glob@7`, `inflight`, `rimraf@3` → Used by dependencies

#### Security vulnerabilities
```bash
# Check vulnerabilities
npm audit

# Auto-fix (may cause breaking changes)
npm audit fix

# Manual review recommended
npm audit fix --dry-run
```

### Deployment Issues

#### WASM files not loading
- ✅ Check MIME type: Should be `application/wasm`
- ✅ Check CORS headers if using CDN
- ✅ Ensure files are not gzipped twice

#### 404 errors on refresh
- ✅ Configure SPA routing (see nginx/Apache configs above)
- ✅ Set up redirects: `/*` → `/index.html` (200)

#### Large bundle size
- ✅ Already optimized with code splitting
- ✅ Enable gzip/brotli compression on server
- ✅ WASM files are expected to be large (1-2 MB)

---

## 📊 Performance Optimization

### Enable Compression
Most hosting providers enable gzip automatically. Verify:
```bash
curl -H "Accept-Encoding: gzip" -I https://your-site.com/
# Should see: Content-Encoding: gzip
```

### CDN Configuration
If using a CDN:
- ✅ Cache WASM files with long TTL (1 year)
- ✅ Cache JS/CSS with content-based hashing
- ✅ Set proper MIME types

### Service Worker (Future)
Consider adding a service worker for:
- Offline support
- Faster subsequent loads
- Background WASM loading

---

## 📈 Monitoring

### Recommended Tools
- **Lighthouse**: Check performance, accessibility
- **WebPageTest**: Measure load time
- **Chrome DevTools**: Network tab for bundle analysis

### Expected Scores
- **Performance**: 90-100
- **Accessibility**: 95-100
- **Best Practices**: 90-100
- **SEO**: 90-100

---

## 🔄 Continuous Deployment

### Netlify
- ✅ Auto-deploy on push to `main`
- ✅ Preview deployments for PRs
- ✅ Rollback support

### Vercel
- ✅ Auto-deploy on push
- ✅ Branch previews
- ✅ Edge network

### GitHub Actions
- ✅ Full control over build process
- ✅ Custom deployment targets
- ✅ Multi-environment support

---

## 💰 Hosting Costs

| Provider | Free Tier | Bandwidth | Notes |
|----------|-----------|-----------|-------|
| **Netlify** | ✅ 100 GB/month | Generous | Recommended |
| **Vercel** | ✅ 100 GB/month | Good | Great DX |
| **Cloudflare Pages** | ✅ Unlimited | Unlimited | Best for global |
| **GitHub Pages** | ✅ 100 GB/month | Fair | Simple |

All providers offer **free static hosting** - perfect for PixelSmith!

---

## 📞 Support

If you encounter deployment issues:
- Check this guide thoroughly
- Review [GitHub Issues](https://github.com/yatingodse19/PixelSmith/issues)
- Check browser console for errors
- Verify Node.js version (20+)

---

**Happy Deploying! 🚀**
