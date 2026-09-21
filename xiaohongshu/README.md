# 小红书探索页移动端复刻

基于 **React 19 + TypeScript + Vite + NutUI-React** 的移动端 H5 应用，1:1 还原小红书「探索 / 发现」页的信息流体验，
并附一个购物频道用来展示 NutUI 的电商组件能力。

> **数据来源**：探索页的信息流**和 11 个频道流**都是从小红书线上真实抓取的
> （标题、封面、作者、点赞数全部真实），抓取脚本见 `scripts/fetch-notes.mjs`，
> 结果落在 `src/data/notes.json`（推荐流）与 `src/data/channels.json`（频道流）。
> 购物页商品、消息页会话属于「演示数据」（真实商品/私信需要登录态），页面上有明确标识。

## 技术栈

| 项 | 版本 | 说明 |
| --- | --- | --- |
| React | 19.3 | UI 框架 |
| TypeScript | 5.9 | 严格模式 |
| Vite | 7.3 | 构建工具 |
| @nutui/nutui-react | 3.1.0 | 京东零售前端团队的移动端组件库 |
| @nutui/icons-react | 3.0.2 | NutUI 官方图标（NutUI 内部依赖，已提升为直接依赖） |

> **注意**：NutUI React 稳定版（3.x / 4.0-beta）的 peerDependencies 只声明到 React 18，
> 因此安装时需要 `--legacy-peer-deps`。实测 React 19.3 下渲染与交互均正常。

## 快速开始

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:5173
npm run build    # 类型检查 + 生产构建，产物在 dist/
npm run preview  # 预览构建产物
npm run smoke    # jsdom 渲染冒烟测试（推荐流 + 11 个频道 + 四个主 Tab）
npm run login    # 保存小红书登录 Cookie（可选，见下）
npm run fetch:notes          # 抓取推荐流 8 轮 + 各频道 3 轮
npm run fetch:notes -- 12    # 推荐流抓 12 轮
```

桌面浏览器打开时会渲染成一台居中「手机」；手机或窄屏下铺满全屏。

## 真实数据抓取

`scripts/xhs-client.mjs` 是共用的抓取客户端，`scripts/fetch-notes.mjs` 是命令行入口。
流程：

1. 请求 `https://www.xiaohongshu.com/explore`，从返回 HTML 里正则抠出 `window.__INITIAL_STATE__`；
2. 取 `state.feed.feeds`（当前流的笔记）和 `state.feed.channels.categories`（频道 id + 名称）；
3. 归一化成 `{ id, title, cover, coverWidth, coverHeight, type, likes, author, noteUrl }`；
4. 每个频道再请求 `?channel_id=<id>&channel_type=web_explore_feed`，同法解析；
5. 写入 `src/data/notes.json`（推荐流）与 `src/data/channels.json`（按频道分组的笔记）。

常用参数：

| 参数 | 说明 |
| --- | --- |
| `--rounds N` | 推荐流抓 N 轮（也可直接写 `npm run fetch:notes -- 12`） |
| `--channel-rounds N` | 每个频道抓 N 轮，默认 3 |
| `--only 美食,视频` | 只刷指定频道，其余沿用本地数据 |
| `--no-recommend` | 不刷推荐流，只刷频道 |
| `--no-channels` | 不刷频道，只刷推荐流 |
| `--max-channel N` | 每个频道最多保留 N 条（滚动窗口，默认 150，防止文件无限膨胀） |
| `--cookie "a1=..."` | 临时指定登录 Cookie |

### 三个关键的坑

- **不要用 Node 内置 `fetch`**。小红书 WAF 会做 TLS 指纹识别，`undici` 的请求会被 302 到 `/login`，
  拿不到正文；改用 `child_process.execFile('curl', ...)` 就正常返回 200 的页面。脚本里 `httpGet()` 就是这么实现的。
- **匿名访问会间歇性被要求登录**。实测小红书对匿名访客整体放行，但短时间高频请求后会被风控，
  全站（连首页）302 到登录页，通常过一段时间自行恢复。遇到整片 302 时的做法：
  ① 等一会儿再跑；② 或按下一节配好登录 Cookie，稳定拿到数据。
- **封面图不用带 Referer**。`sns-webpic-qc.xhscdn.com` 的图直连可下，但前端 `<img>` 仍加上
  `referrerPolicy="no-referrer"` 以防后续策略收紧。

### 频道数据需要登录（可选）

若匿名抓取被风控挡住，执行一次：

```bash
npm run login          # macOS 会自动读系统剪贴板
```

拿到 Cookie 的方法：浏览器打开 `https://www.xiaohongshu.com/explore` 并确认已登录 →
`F12` → Network → 刷新 → 点对 `explore` 的请求 → Request Headers → 复制 `cookie:` 整行的值 → 回终端执行 `npm run login`。
脚本会先校验登录态（打一次探索页 + 一次频道页）再写入 `.xhs-cookie`（权限 600，已 gitignore）。
其它命令：`npm run login -- --check` 校验、`--show` 看脱敏摘要、`--clear` 删除。

### 已抓到什么 / 抓不到什么

| 内容 | 状态 | 处理方式 |
| --- | --- | --- |
| 「推荐」流 | ✅ 真实 333 条 | 直接展示 |
| 11 个频道流 | ✅ 真实 1073 条 | 点频道 chip 切换，各有独立的真实笔记 |
| 「关注」「附近」Tab | ❌ 需登录 + 定位 | 显示登录提示，列表留空（如实标注，不编造） |
| 笔记正文、评论 | ❌ 需登录 | 详情页只展示真实的封面/标题/作者/点赞，正文位置给出「去小红书查看原文」的跳转链接 |
| 商品、优惠券、私信 | ❌ 需登录 | 购物页/消息页为演示数据，页面顶部有 demo banner |

各频道条数：
穿搭 99、美食 102、彩妆 94、影视 74、职场 87、情感 78、家居 117、游戏 79、旅行 105、健身 93、视频 145。
想加量就多跑几轮：`npm run fetch:notes -- --channel-rounds 6`。

> ⚠ 官方 SSR 给出的「视频」频道 id 是 `homefeed.video_v3`，实测该 id 无论带不带登录态都返回 0 条，
> 换成 `homefeed.video` 才有数据（视频占比约 50%，明显高于其它频道的 30~40%）。
> 这个修正记录在 `scripts/xhs-client.mjs` 的 `CHANNEL_ID_FIX` 里。

## 目录结构

```
xiaohongshu/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── .xhs-cookie                登录 Cookie（gitignore，npm run login 生成）
├── scripts/
│   ├── xhs-client.mjs          共用抓取客户端（curl 请求 + SSR 解析 + 归一化）
│   ├── fetch-notes.mjs         抓取入口：推荐流 + 各频道流
│   ├── login.mjs               保存/校验登录 Cookie
│   ├── smoke-entry.tsx         冒烟测试挂载入口
│   ├── smoke.mjs               jsdom 冒烟驱动
│   └── vite.smoke.config.ts    冒烟用的 SSR 构建配置
└── src/
    ├── main.tsx              入口（全量引入 NutUI 样式）
    ├── App.tsx               手机外壳 + 四个页面切换
    ├── styles/
    │   ├── global.css        基础样式、手机壳、底部导航
    │   └── app.css           业务模块样式
    ├── data/
    │   ├── notes.json        抓取产物：推荐流真实笔记
    │   ├── channels.json     抓取产物：11 个频道各自的真实笔记
    │   ├── index.ts          对外导出 Note / NOTES / CHANNEL_FEEDS / PAGE_SIZE
    │   ├── demo-shop.ts      购物页演示数据（商品 / 优惠券 / 分类）
    │   └── region.ts         省市区数据
    └── components/
        ├── Explore.tsx       探索页：搜索 + 主 Tab + 频道 chips + 瀑布流 + 无限加载
        ├── Waterfall.tsx     双列瀑布流（按真实封面宽高比估算高度分配列）
        ├── NoteCard.tsx      笔记卡片（真实封面/头像，加载失败降级为占位）
        ├── NoteDetail.tsx    笔记详情（Popup 全屏）
        ├── ShopPanel.tsx     购物页：地址 / 倒计时 / 优惠券 / 规格选择
        ├── MessagePanel.tsx  消息页
        ├── MePanel.tsx       我的页（未登录态，不编造用户信息）
        └── BottomTabBar.tsx  底部导航（含中间发布按钮）
```

## 用到了哪些 NutUI 组件

| 分类 | 组件 |
| --- | --- |
| 导航 | `Tabs` / `Tabs.TabPane`、`Tabbar` / `Tabbar.Item`、`SideBar` / `SideBarItem` |
| 表单与展示 | `SearchBar`、`Price`、`Tag`、`Cell` / `CellGroup`、`Grid` / `GridItem`、`Empty` |
| 反馈与浮层 | `Popup`、`Toast`、`InfiniteLoading` |
| 电商能力 | `Address`（省市区地址选择）、`CountDown`（限时秒杀倒计时）、`Cascader`（多级规格选择） |
| 其他 | `SafeArea`（Tabbar 底部安全区）、`@nutui/icons-react` 图标 |

### 电商场景说明

购物页集中演示了 NutUI 面向电商的特性：

- **地址选择**：`Address` + `type="cascader"`，三级省市区联动；
- **倒计时**：`CountDown` 渲染秒杀剩余时间（`format="HH:mm:ss"`）；
- **规格选择**：`Cascader` 把商品的「颜色 / 尺码」等规格转成多级联动选择；
- **优惠券**：券面用自定义样式 + `Tag` / `Price` 组合，领取后走 `Toast` 反馈；
- **价格**：统一用 `Price` 组件，支持千分位与货币符号。

## 实现约定

- **真实优先**：能抓到的数据一律用真实的，抓不到的就明确标出来，不拿假数据充数；
- **频道 chips 只列有数据的频道**：`CHANNEL_FEEDS` 会过滤掉 `notes` 为空的频道，避免点进去看到空列表；
- **零外部素材**：不引用任何本地图片、字体或第三方素材，图片全部来自线上 CDN；
- **无路由依赖**：页面切换用 `useState` 管理，保持依赖精简；
- **瀑布流**：用真实封面的 `coverWidth / coverHeight` 估算卡片高度，按「累计高度最小优先」分入两列；
- **加载更多**：`InfiniteLoading` 监听 `.page-body` 滚动容器，触底追加一页（每页 12 条）。
  推荐流与各频道流共用同一套分页状态，切频道时重置。

## 验证情况

- `tsc --noEmit` 类型检查通过（严格模式）；
- `vite build` 生产构建通过（902 个模块，JS 1.22 MB / CSS 313 kB，gzip 后 377 kB / 39 kB；
  体积主要来自 1400+ 条真实笔记数据，其中 NutUI 自身约占 190 kB gzip；
  数据全是精选过的真实内容，若要压缩可调小 `--max-channel` 后重新抓取）；
- `npm run smoke` 在 jsdom 中真实挂载 App：
  - 推荐流渲染出 72 个真实 CDN 图片节点，横幅「共 333 条真实笔记」；
  - 逐个点击 11 个频道 chip，每个频道都渲染出 72 个封面、横幅条数与该频道真实条数一致、频道 id 正确；
  - 切回「推荐」后数据正确；
  - 购物 / 消息 / 我 三个主 Tab 点击切换后均正常渲染。
