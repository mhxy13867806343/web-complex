import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
// @ts-ignore —— 插件是 .mjs，没有类型声明
import xhsDataServer from './scripts/vite-xhs-data.mjs'

export default defineConfig({
  plugins: [react(), xhsDataServer()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
