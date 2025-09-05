import { defineConfig } from 'vite'

export default defineConfig({
  root: 'packages/main-site',
  build: {
    outDir: '../../dist/main',
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
})