import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// NutUI 全量样式（本示例直接全量引入，生产可配合 unplugin 做按需引入）
import '@nutui/nutui-react/dist/style.css'
import './styles/global.css'
import './styles/app.css'

import App from './App'

const container = document.getElementById('root')
if (!container) {
  throw new Error('未找到 #root 挂载节点')
}

// 打印当前部署版本信息，方便确认线上最新版本已生效
console.log(
  '%c[小红书探索页]%c 运行环境: ' +
    (window.location.hostname.endsWith('github.io') ? 'GitHub Pages 静态模式（无 404 纯前端沙箱）' : '本地/独立服务模式') +
    ' | 版本构建: 2026.09.22-v3',
  'background:#ff2442;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold;',
  'color:#666;'
)

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
