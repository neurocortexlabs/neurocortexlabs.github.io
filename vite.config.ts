import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The site is served from https://aaronhhsi.github.io/neurocortex-labs/, so assets
// need the repo name as a prefix. If we ever point a custom domain at Pages,
// change this back to '/'.
const BASE = '/neurocortex-labs/'

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    // The source is public anyway, and readable stack traces from the live
    // site are worth more than the extra kilobytes.
    sourcemap: true,
  },
})
