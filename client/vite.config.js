import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 10000,  // Set a specific port
    host: true,   // Allows access from any host (important for deployment)
  },
  preview: {
    port: 10000,  // Ensures `vite preview` runs on the same port
    host: true,
  },
  build: {
    outDir: "dist",  // Ensure output directory is correct
  }
})