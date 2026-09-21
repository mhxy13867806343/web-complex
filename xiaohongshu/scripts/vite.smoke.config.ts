import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * 冒烟测试专用构建：把 App 打成 SSR bundle，供 Node + jsdom 执行。
 * ssr.noExternal 让 NutUI 一起被打包，避免 Node 下解析到 CJS 导致 named export 丢失。
 */
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: true,
    target: 'node',
  },
  build: {
    ssr: 'scripts/smoke-entry.tsx',
    outDir: '.smoke',
    emptyOutDir: true,
    minify: false,
  },
  server: { port: 5180 },
})
