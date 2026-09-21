/**
 * 生产 / 预览服务器：同时托管静态构建产物 + /api/xhs/* 实时接口。
 *
 * 用法：
 *   npm run build      # 先打出 dist/
 *   npm run start      # 再用本脚本起服务（默认 5173，可用 PORT 改）
 *
 * 为什么需要它：纯静态部署没有 /api，页面会明确提示「接口不可用」而不是显示假数据。
 * 这个脚本把 dist/ 当静态资源发出来，并把 /api/xhs/* 转给 buildXhsHandler()
 * （和开发环境用的是同一套抓取逻辑，见 vite-xhs-data.mjs）。
 */
import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { fileURLToPath } from 'node:url'
import { buildXhsHandler } from './vite-xhs-data.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const PORT = Number(process.env.PORT) || 5173
const HOST = process.env.HOST || '0.0.0.0'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

const API_PREFIX = '/api/xhs'
const xhsHandler = buildXhsHandler()

function sendStatic(req, res, urlPath) {
  // 去掉查询串，规范化，禁止越界
  let rel = decodeURIComponent(urlPath.split('?')[0])
  if (rel === '/' || rel === '') rel = '/index.html'
  const filePath = path.normalize(path.join(DIST, rel))
  if (!filePath.startsWith(DIST)) {
    res.statusCode = 403
    return res.end('forbidden')
  }
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      // SPA 兜底：非资源请求都回 index.html
      if (!path.extname(filePath)) {
        return fs.readFile(path.join(DIST, 'index.html'), (e2, b2) => {
          if (e2) {
            res.statusCode = 404
            return res.end('not found')
          }
          res.setHeader('Content-Type', MIME['.html'])
          res.end(b2)
        })
      }
      res.statusCode = 404
      return res.end('not found')
    }
    const ext = path.extname(filePath)
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
    res.setHeader('Cache-Control', 'public, max-age=300')
    res.end(buf)
  })
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url || '/', `http://localhost:${PORT}`)
  if (u.pathname.startsWith(API_PREFIX)) {
    // 把 /api/xhs 前缀去掉后交给 handler（connect 风格：req.url 是子路径）
    req.url = u.pathname.slice(API_PREFIX.length) + u.search
    return xhsHandler(req, res)
  }
  sendStatic(req, res, u.pathname)
})

server.listen(PORT, HOST, () => {
  console.log(`\n  ➜  小红书探索页已启动`)
  console.log(`      本地：http://localhost:${PORT}`)
  console.log(`      接口：http://localhost:${PORT}${API_PREFIX}/channels\n`)
})
