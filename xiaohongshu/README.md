# 小红书探索页移动端复刻

基于 **React 19 + TypeScript + Vite + NutUI-React** 的移动端 H5，1:1 还原小红书「发现」页的信息流体验。

> **只做「发现」页。** 首页 / 购物 / 消息 / 我的都需要登录态才有真实数据，与其摆假数据占位，不如不做。
>
> **数据全部实时抓取，没有任何静态快照。** 频道分类和笔记都通过运行时的 `/api/xhs/*` 接口现抓，
> 所以**刷新页面 = 拿到新数据**。抓取逻辑见 `scripts/xhs-client.mjs` 与 `scripts/vite-xhs-data.mjs`。

## 技术栈

| 项 | 版本 | 说明 |
| --- | --- | --- |
| React | 19.3 | UI 框架 |
| TypeScript | 5.9 | 严格模式 |
| Vite | 7.3 | 构建工具 |
| @nutui/nutui-react | 3.1.0 | 移动端组件库 |
| @nutui/icons-react | 3.0.2 | NutUI 官方图标（NutUI 传递依赖，已提升为直接依赖） |

> **注意**：NutUI React 稳定版（3.x）的 peerDependencies 只声明到 React 18，
> 安装需要 `--legacy-peer-deps`。实测 React 19.3 下渲染与交互正常。

## 快速开始

```bash
npm install --legacy-peer-deps

npm run dev      # 开发（带 /api/xhs 实时接口）；默认 5173，被占用会自动顺延
npm run build    # 类型检查 + 生产构建，产物在 dist/
npm run start    # 生产：托管 dist/ + /api/xhs（默认 PORT=5173，可 PORT=xxxx 改）
npm run smoke    # jsdom 渲染冒烟测试
npm run login    # 保存小红书登录 Cookie（可选，见下）
```

桌面浏览器打开会渲染成一台居中「手机」；手机或窄屏下铺满全屏。

## 数据是实时的（核心设计）

原先数据是构建前抓好的 JSON 快照，打进包里 —— 浏览器刷新只是重读同一份 JSON，数据永远不变。
现已**彻底删除静态快照**（`notes.json` / `channels.json` 等），改成运行时接口：

```
GET /api/xhs/channels            -> { fetchedAt, channels: [{ name, id }] }
GET /api/xhs/feed?channel=推荐   -> { channel, channelId, fetchedAt, count, notes: Note[] }
```

接口层在两处复用**同一套**抓取逻辑（`vite-xhs-data.mjs` 导出的 `buildXhsHandler()`）：

| 环境 | 实现 | 说明 |
| --- | --- | --- |
| 开发 | `scripts/vite-xhs-data.mjs`（Vite 插件） | `configureServer` 里挂中间件 |
| 生产 | `scripts/server.mjs`（`npm run start`） | 托管 `dist/` + 把 `/api/xhs` 转给同一个 handler |

如果部署成**没有 `/api` 的纯静态站点**，页面会明确提示「接口不可用」，而不是回退到假数据。

前端调用见 `src/data/api.ts`（内存缓存 `FEED_TTL=30s`，避免切回同一频道时重复请求）。

## 抓取实现与三个坑

1. **不要用 Node 内置 `fetch`**。小红书 WAF 会做 TLS 指纹识别，`undici` 的请求被 302 到 `/login`，拿不到正文；
   改用 `child_process.execFile('curl', ...)` 就正常返回 200 页面（见 `xhs-client.mjs` 的 `httpGet()`）。
2. **匿名访问会间歇性被要求登录**。整体是放行的，但短时高频请求后会被风控，全站 302 到登录页，
   通常过一会儿自行恢复。遇到整片 302 时：① 等一会儿重试；② 或配好登录 Cookie。
3. **「视频」频道 id 有坑**。SSR 给的 `homefeed.video_v3` 无论带不带登录都返回 0 条，
   换成 `homefeed.video` 才有数据。修正表在 `xhs-client.mjs` 的 `CHANNEL_ID_FIX`。

### 频道数据需要登录（可选）

```bash
npm run login            # macOS 会自动读系统剪贴板
npm run login -- --check # 校验；--show 看脱敏摘要；--clear 删除
```

拿到 Cookie：浏览器登录 `https://www.xiaohongshu.com/explore` → `F12` → Network → 刷新 →
点 `explore` 请求 → Request Headers → 复制整行 `cookie:` 值 → 终端 `npm run login`。
脚本会先校验登录态再写入 `.xhs-cookie`（权限 600，已 gitignore）。

## 交互细节

- **频道 chips 单行横向滚动**：补齐桌面端三种操作 —— 按住鼠标拖动（pointer events）、
  滚轮（原生 `wheel` 监听、`passive:false`）、悬停左右翻页箭头；并做两侧渐隐提示。
  选中频道时该 chip 会**自动滚动到可视区中间**。
- **上拉加载 + 下拉刷新**：上拉用 NutUI `InfiniteLoading`（`target=".page-body"`），
  先把本地没展示完的翻出来、翻完再从接口续一页；下拉见 `src/hooks/usePullToRefresh.ts`。
- **顶栏整体吸顶**：`header + 下拉刷新提示区 + 频道 chips` 包在 `.sticky-top` 里，
  滚多远都能直接切频道。
- **Toast 自实现**（`src/components/Toast.tsx`）：NutUI 的 `Toast.show` 内部用 React 18 的
  `ReactDOM.render`，在 React 19 下会抛 `reactRender is not a function`，故改为声明式实现。

## 目录结构

```
xiaohongshu/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── .xhs-cookie                登录 Cookie（gitignore，npm run login 生成）
├── scripts/
│   ├── xhs-client.mjs         共用抓取客户端（curl 请求 + SSR 解析 + 归一化）
│   ├── vite-xhs-data.mjs      /api/xhs/* 实现（buildXhsHandler）；dev 下作为 Vite 插件
│   ├── server.mjs             生产服务：托管 dist/ + 同一套 /api/xhs
│   ├── login.mjs              保存/校验登录 Cookie
│   ├── smoke-entry.tsx        冒烟测试挂载入口（stub fetch 后断言渲染）
│   ├── smoke.mjs              jsdom 冒烟驱动
│   └── vite.smoke.config.ts   冒烟用的 SSR 构建配置
└── src/
    ├── main.tsx               入口（全量引入 NutUI 样式）
    ├── App.tsx                手机外壳（只挂发现页 + ToastHost）
    ├── styles/
    │   ├── global.css         基础样式 + 手机壳 + 滚动容器
    │   └── app.css            业务模块样式（含 .sticky-top 吸顶、chips、ptr 等）
    ├── data/
    │   ├── index.ts           只有 Note 类型 + PAGE_SIZE（无静态数据）
    │   └── api.ts             fetchChannels() / fetchFeed() + 30s 内存缓存
    ├── hooks/
    │   └── usePullToRefresh.ts  下拉刷新（touch + mouse，阈值 55px）
    └── components/
        ├── Explore.tsx        发现页：顶栏 + 频道 chips + 瀑布流 + 无限加载 + 下拉刷新
        ├── ChannelChips.tsx   频道 chips（横滑 / 拖动 / 滚轮 / 箭头 / 自动居中）
        ├── Waterfall.tsx      双列瀑布流（按真实封面宽高比分配列）
        ├── NoteCard.tsx       笔记卡片（真实封面/头像，加载失败降级占位）
        ├── NoteDetail.tsx     笔记详情（全屏浮层）
        └── Toast.tsx          轻提示（React 19 兼容实现）
```

## 用到的 NutUI 组件

`SearchBar`、`Empty`、`Loading`、`InfiniteLoading`、`Popup`，以及 `@nutui/icons-react` 图标。

## 验证情况

- `tsc --noEmit` 严格模式通过；`vite build` 通过（产物 JS gzip 约 92 kB / CSS gzip 约 38 kB）。
- `npm run smoke` 在 jsdom 中真实挂载 App（stub `fetch` 返回接口数据）：
  - chips 数量 = 推荐 + 抓到的频道数，左右翻页箭头 = 2；
  - 逐个切频道后封面 `<img>` > 0，切回「推荐」后卡片正常；
  - 断言已无购物/消息/我的/底部导航/数据横幅等旧模块残留。
- 数据层直连实抓：`probe(explore)` → 200、11 个频道、推荐流 20+ 条真实封面与真实点赞数。

## 环境提示

- 若 dev server 曾跑过**旧版本代码**后出现「`does not provide an export named ...`」或某个 `.ts` 报 500，
  那是 Vite 的模块图/缓存处于半更新状态。**删除 `node_modules/.vite` 后重启 `npm run dev`**、
  再硬刷新浏览器（Cmd+Shift+R）即可，源码本身没有问题。
- 本仓库的 `xiaohongshu/` 不含任何图片/字体素材，封面与头像全部来自线上 CDN。
