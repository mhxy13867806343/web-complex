# web-complex

WorkBuddy 前端小游戏集合与应用 —— 纯静态、零依赖、单文件 HTML，打开即玩。

## 🌐 在线预览体验 (Online Preview)

GitHub Pages 已部署上线，点击下方链接直接在线体验：

- 🎮 **[游戏与应用总目录](https://mhxy13867806343.github.io/web-complex/)**（推荐）
- 📱 **[小红书探索页（GitHub Pages 在线版）](https://mhxy13867806343.github.io/web-complex/xiaohongshu/)**
- ⚡ **[小红书探索页（Node 实时后端完整版）](https://xhs-explore.app.workbuddy.host/)**
- 📲 **[移动端 H5 游戏专区](https://mhxy13867806343.github.io/web-complex/WorkBuddy/h5/)**
- 🖥️ **[桌面端 PC 游戏专区](https://mhxy13867806343.github.io/web-complex/WorkBuddy/pc/)**

---

- 本地入口页面：[`main.html`](main.html) / [`index.html`](index.html)
- H5 端（移动端）：[`WorkBuddy/h5/`](WorkBuddy/h5/index.html)
- PC 端（桌面端）：[`WorkBuddy/pc/`](WorkBuddy/pc/index.html)

## 目录结构

```
web-complex/
├── main.html                 共用目录页（总入口）
├── README.md
├── LICENSE.md                许可证（中文）
├── LICENSE-EN.md             许可证（英文，最终解释版本）
├── xiaohongshu/              小红书探索页复刻（React 19 + TS + Vite + NutUI-React）
└── WorkBuddy/
    ├── h5/                   移动端：触屏 + 竖屏
    │   ├── index.html        H5 游戏列表
    │   └── games/
    │       ├── 2048.html
    │       ├── 球球分类.html
    │       ├── 木块拼图.html
    │       └── 贪吃蛇.html
    ├── pc/                   桌面端：鼠标 + 键盘
    │   ├── index.html        PC 游戏列表
    │   └── games/
    │       ├── 数独.html
    │       ├── 麻将连连看.html
    │       ├── 华容道.html
    │       └── 泡泡龙.html
    └── shared/               共用资源
        ├── audio.js          WebAudio 实时合成音效库（WB.sfx）
        └── theme.css         共用深色主题样式
```

## 游戏清单

| 端 | 游戏 | 玩法要点 |
| --- | --- | --- |
| H5 | 2048 | 滑动合并数字，支持撤销一步、最高分记录 |
| H5 | 球球分类 | 同色球归拢入管，可整摞搬运，支持撤销与加管 |
| H5 | 木块拼图 | 10×10 棋盘拖块填充，整行整列消除，连消加分 |
| H5 | 贪吃蛇 | 滑动或方向键操控，金色果子 5 倍分，速度递增 |
| PC | 数独 | 四档难度、唯一解生成、笔记模式、提示与检查 |
| PC | 麻将连连看 | 144 张标准龟形牌阵，提示 / 撤销 / 洗牌 |
| PC | 华容道 | 3×3 / 4×4 / 5×5 滑块复原，点击整排推动 |
| PC | 泡泡龙 | 瞄准发射三消，悬空掉落，每 6 发下压一行 |
| PC | 城市外卖骑手模拟器 | 俯视角送餐接单，限时送达，座驾升级，车流避障 |
| PC | 恐龙快打 | 横版清版动作，四角色，连招拾物关底 BOSS |
| PC | 打砖块 | 挡板接球清砖，五档关卡，多道具掉落 |
| PC | 俄罗斯方块 | 七种经典方块，旋转硬降，行满消除加速 |
| PC | 扫雷 | 经典 Windows 规则，翻开避雷，插旗标记，笑脸重开 |

## 运行方式

### WorkBuddy 游戏（无需构建）

```bash
# 直接用浏览器打开
open main.html

# 或起一个本地静态服务
python3 -m http.server 8080
# 然后访问 http://localhost:8080/main.html
```

### 小红书探索页（支持本地开发与在线预览）

```bash
cd xiaohongshu
npm install --legacy-peer-deps    # NutUI 的 peer 依赖只声明到 React 18，需要该参数
npm run dev                       # 终端打印地址（5173 被占会自动顺延，以终端为准）
# 或本地生产预览：npm run build && npm run start
```

- **在线预览（GitHub Pages）**：[直接体验入口](https://mhxy13867806343.github.io/web-complex/xiaohongshu/)（推到 `main` 后由 `.github/workflows/deploy.yml` 自动构建发布）。笔记地址用 `#/explore/笔记id`，不要写成 `github.io/explore/笔记id`。
- **全功能独立在线服务**：[https://xhs-explore.app.workbuddy.host/](https://xhs-explore.app.workbuddy.host/)（含实时 Node 抓取后端）。
- 桌面端打开会渲染成一台居中的「手机」，窄屏或手机浏览器下铺满全屏。

## 实现约定

- 每个游戏是**单文件 HTML**，内联样式与脚本，可独立分发；
- 画面统一用 **Canvas** 绘制，不使用任何图片素材；
- 音效由 `WorkBuddy/shared/audio.js` 通过 **WebAudio 实时合成**，不加载音频文件；
- 不引入第三方字体、图标库或游戏引擎；
- 移动端游戏适配竖屏与触摸（滑动 / 点按），桌面端游戏适配鼠标与键盘。

## 玩法来源

游戏玩法参考 [Puzzle Level](https://puzzlelevel.com/) 等公开益智站点中的经典玩法。
玩法规则本身不受版权保护，本仓库的代码、绘制与音效均为原创实现。

## 许可证

MIT，详见 [`LICENSE.md`](LICENSE.md)（中文）与 [`LICENSE-EN.md`](LICENSE-EN.md)（英文，以英文版为准）。
