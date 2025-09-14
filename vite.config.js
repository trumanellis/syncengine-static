import { defineConfig } from 'vite'

export default defineConfig({
  root: 'packages/main-site',
  build: {
    outDir: '../../dist/main',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html'
    }
  },
  server: {
    port: 3000,
    fs: {
      allow: ['..', '../..']
    }
  },
  publicDir: '../../media'
})