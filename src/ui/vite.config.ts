import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
  ],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ['@silvia-odwyer/photon', '@jsquash/webp', '@jsquash/jpeg'],
  },
  build: {
    outDir: '../../dist',  // Output to root dist/ folder
    emptyOutDir: true,
    target: 'esnext',
    // Suppress chunk size warnings (WASM bundles are expected to be large)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          // React and core UI libraries
          'vendor-react': ['react', 'react-dom'],
          // Image processing libraries (separate chunk)
          'vendor-image': ['jszip'],
        },
      },
    },
  },
});
