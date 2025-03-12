import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
    build: {
    outDir: "dist", // Ensure output directory is 'dist'
    emptyOutDir: true,
    rollupOptions: {
      input: "index.html",
    },
  },
})
