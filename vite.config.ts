import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Served from the root of https://neurocortexlabs.github.io/, not a repo
  // subpath, because the repo is the organization's root Pages site. A custom
  // domain later would need no change here.
  base: '/',
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
