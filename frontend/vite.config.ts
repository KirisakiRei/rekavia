import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks - separate large libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor'
            }
            if (id.includes('lucide-react') || id.includes('@radix-ui')) {
              return 'ui-vendor'
            }
            if (id.includes('@dnd-kit')) {
              return 'dnd-vendor'
            }
            if (id.includes('react-player') || id.includes('yet-another-react-lightbox') || id.includes('embla-carousel')) {
              return 'media-vendor'
            }
            if (id.includes('hls.js') || id.includes('dashjs')) {
              return 'video-vendor'
            }
          }
          // Separate editor utils into its own chunk
          if (id.includes('src/pages/cms/sapatamu/editor/editor-utils')) {
            return 'editor-utils'
          }
        },
      },
    },
  },
})
