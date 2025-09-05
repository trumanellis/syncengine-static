import { defineConfig } from 'vite'

export default defineConfig({
  root: 'packages/temples-site',
  build: {
    outDir: '../../dist/temples',
    emptyOutDir: true
  },
  server: {
    port: 3001
  }
})