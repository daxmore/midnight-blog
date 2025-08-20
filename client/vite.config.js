import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:2500',
        changeOrigin: true,
      },
    }
  },
  build: {
    chunkSizeWarningLimit: 600, // Increase the warning limit (optional)
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@heroicons/react', 'framer-motion', 'lucide-react', 'react-icons'],
          'vendor-editor': ['@tiptap/core', '@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-image', '@tiptap/extension-placeholder'],
        }
      }
    }
  }
})
