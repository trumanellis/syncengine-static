import { defineConfig } from 'vite'

export default defineConfig({
  root: 'packages/eden-site',
  build: {
    outDir: '../../dist/eden',
    emptyOutDir: true
  },
  server: {
    port: 3002
  }
})