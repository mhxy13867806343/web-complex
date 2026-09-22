import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
// @ts-ignore —— 插件是 .mjs，没有类型声明
import xhsDataServer from './scripts/vite-xhs-data.mjs'

export default defineConfig({
  base: './',
  plugins: [react(), xhsDataServer()],
  resolve: {
    alias: [
      {
        find: 'react-dom-original',
        replacement: fileURLToPath(new URL('./node_modules/react-dom/index.js', import.meta.url)),
      },
      {
        find: /^react-dom$/,
        replacement: fileURLToPath(new URL('./src/shims/react-dom.ts', import.meta.url)),
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  server: {
    host: true,
    port: 5173,
  },
})
