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

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
