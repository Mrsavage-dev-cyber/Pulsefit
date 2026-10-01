import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the build works under GitHub Pages' /<repo>/ path and inside Capacitor.
  base: './',
  plugins: [react(), tailwindcss()],
})
