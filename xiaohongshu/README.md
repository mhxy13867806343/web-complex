# 小红书探索页移动端复刻

基于 **React 19 + TypeScript + Vite + NutUI-React** 的移动端 H5 应用，1:1 还原小红书「探索 / 发现」页的信息流体验，
并附一个购物频道用来展示 NutUI 的电商组件能力。

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
```

桌面浏览器打开时会渲染成一台居中「手机」；手机或窄屏下铺满全屏。

## 目录结构

```
xiaohongshu/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx              入口（全量引入 NutUI 样式）
    ├── App.tsx               手机外壳 + 四个页面切换
    ├── styles/
    │   ├── global.css        基础样式、手机壳、底部导航
    │   └── app.css           业务模块样式
    ├── mock/
    │   ├── notes.ts          笔记 / 商品 / 优惠券 mock 数据
    │   └── region.ts         省市区数据、购物分类
    └── components/
        ├── Explore.tsx       探索页：搜索 + 主 Tab + 频道 + 瀑布流 + 无限加载
        ├── Waterfall.tsx     双列瀑布流（按累计高度分配列）
        ├── NoteCard.tsx      笔记卡片
        ├── NoteDetail.tsx    笔记详情（Popup 全屏）
        ├── ShopPanel.tsx     购物页：地址 / 倒计时 / 优惠券 / 规格选择
        ├── MessagePanel.tsx  消息页
        ├── MePanel.tsx       我的页
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

- **零外部素材**：所有封面、头像均由 CSS 渐变 + emoji 渲染，不引用任何图片、字体或第三方素材；
- **无路由依赖**：页面切换用 `useState` 管理，保持依赖精简；
- **瀑布流**：按「累计高度最小优先」把卡片分入两列，视觉错落且两列高度接近；
- **加载更多**：`InfiniteLoading` 监听 `.page-body` 滚动容器，触底追加一轮mock数据（最多 3 轮）。

## 验证情况

- `tsc --noEmit` 类型检查通过（严格模式）；
- `vite build` 生产构建通过（884 个模块，JS 408 kB / CSS 311 kB，gzip 后 134 kB / 38 kB）；
- jsdom 环境下对四个页面做了渲染冒烟：探索页、购物页、消息页、我的页均正常挂载，
  Tabbar、瀑布流卡片、倒计时、侧边栏、Price、Tag 等关键节点均正确输出。
