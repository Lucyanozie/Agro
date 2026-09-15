import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import process from 'node:process'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  build: {
    rollupOptions: {
      output: {
        // Charts only appear on the farmer analytics screens — keep them out
        // of the entry chunk so first paint stays small.
        manualChunks: {
          charts: ['recharts'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
