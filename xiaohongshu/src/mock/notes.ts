/**
 * 笔记 mock 数据
 * 封面不使用任何外部图片素材，统一由 CSS 渐变 + emoji 渲染，保证零版权风险。
 */

export interface Author {
  name: string
  emoji: string
  bg: string
}

export interface Note {
  id: string
  title: string
  desc: string
  /** 封面主视觉 emoji */
  emoji: string
  /** 封面渐变色 [起, 止] */
  cover: [string, string]
  /** 封面高宽比，用于瀑布流错落排布 */
  ratio: number
  author: Author
  likes: number
  comments: number
  collected: boolean
  /** 所属频道 */
  channel: string
  location?: string
  /** 是否为视频笔记 */
  video?: boolean
}

export const CHANNELS = [
  '推荐',
  '穿搭',
  '美食',
  '彩妆',
  '影视',
  '职场',
  '情感',
  '家居',
  '游戏',
  '旅行',
  '健身',
  '数码',
] as const

export type Channel = (typeof CHANNELS)[number]

interface Seed {
  t: string
  d: string
  e: string
  c: [string, string]
  r: number
  a: string
  ae: string
  ch: Channel
  loc?: string
  v?: boolean
}

const SEEDS: Seed[] = [
  { t: '秋天的第一件毛衣，温柔到犯规', d: '奶杏色真的太衬肤色了，配上直筒牛仔裤刚刚好～', e: '🧥', c: ['#f8d7a3', '#e9a97b'], r: 1.33, a: '林小满', ae: '🐰', ch: '穿搭' },
  { t: '十分钟搞定的一人食早餐', d: '牛油果吐司 + 溏心蛋，开启元气满满的一天', e: '🥑', c: ['#c7e9b0', '#8fc98a'], r: 1.0, a: '阿橙', ae: '🍊', ch: '美食' },
  { t: '奶油杏子妆，素颜感天花板', d: '重点是腮红要打在苹果肌最高处，晕开！', e: '💄', c: ['#fbc2d4', '#f08ca8'], r: 1.33, a: 'Yuki', ae: '🌸', ch: '彩妆' },
  { t: '这部悬疑片我刷了三遍', d: '结尾十分钟直接封神，剧透不了一点', e: '🎬', c: ['#b8c6e8', '#7c8fc4'], r: 0.75, a: '看电影的老张', ae: '🎭', ch: '影视' },
  { t: '打工人通勤包里都装了什么', d: '极简但不将就，每样都是精挑细选', e: '👜', c: ['#d9c7f0', '#a98fd6'], r: 1.33, a: 'Kelly', ae: '💼', ch: '职场' },
  { t: '成年人的情绪自救指南', d: '允许自己偶尔不开心，也是一种能力', e: '🌙', c: ['#a5b8e0', '#6d7fc4'], r: 1.0, a: '晚安计划', ae: '🌛', ch: '情感' },
  { t: '35㎡ 出租屋改造前后对比', d: '预算 3000 块，房东看了都说想涨租', e: '🛋️', c: ['#f5e0c0', '#d9b98c'], r: 1.33, a: '小户型研究所', ae: '🏠', ch: '家居' },
  { t: '开荒第一天的快乐谁懂', d: '这游戏真的会上瘾，装备词条太上头了', e: '🎮', c: ['#b0e0e6', '#6fb3c4'], r: 0.75, a: '游戏宅日常', ae: '🕹️', ch: '游戏' },
  { t: '大理三日记，治愈系风景', d: '洱海边骑单车，风都是自由的味道', e: '🏞️', c: ['#a8d8ea', '#6aa9c9'], r: 1.33, a: '在路上的猫', ae: '🐈', ch: '旅行', loc: '云南·大理' },
  { t: '每天十分钟的核心训练', d: '坚持一个月，腰线真的会回来', e: '🏋️', c: ['#ffd6a5', '#ff9f80'], r: 1.0, a: '铁馆日记', ae: '💪', ch: '健身' },
  { t: '2000 档降噪耳机横评', d: '通勤党闭眼入，音质和舒适度都在线', e: '🎧', c: ['#c9d6e8', '#8fa3c9'], r: 1.0, a: '数码小卖部', ae: '🎵', ch: '数码' },
  { t: '周末露营装备清单（附价格）', d: '第一次露营别乱买，这几样就够', e: '⛺️', c: ['#d4e8c2', '#98c48c'], r: 1.33, a: '户外阿飞', ae: '🏕️', ch: '旅行', loc: '浙江·莫干山' },
  { t: '白衬衫的七种穿法', d: '一件顶七件，衣柜里必须有姓名', e: '👔', c: ['#e8e8f0', '#b8b8cc'], r: 1.33, a: '林小满', ae: '🐰', ch: '穿搭' },
  { t: '在家复刻网红舒芙蕾', d: '第三次终于成功了！蛋白打发是关键', e: '🍰', c: ['#fce1c4', '#e8b58c'], r: 1.0, a: '阿橙', ae: '🍊', ch: '美食' },
  { t: '伪素颜三件套，学生党友好', d: '全套不到 200，妆感清透不假面', e: '🧴', c: ['#f9d5e0', '#e39fbe'], r: 1.33, a: 'Yuki', ae: '🌸', ch: '彩妆' },
  { t: '通勤地铁上的阅读清单', d: '这五本都能一口气读完，不费脑', e: '📚', c: ['#d8c3a5', '#a89070'], r: 0.75, a: '看电影的老张', ae: '🎭', ch: '影视' },
  { t: '会议室里别再说的三句话', d: '换个说法，专业感立刻不一样', e: '📊', c: ['#c8d8f0', '#8fa8d8'], r: 1.0, a: 'Kelly', ae: '💼', ch: '职场' },
  { t: '一个人也要好好吃饭', d: '今天的晚餐：番茄牛腩面，暖到心里', e: '🍜', c: ['#ffd0b0', '#f09a7a'], r: 1.0, a: '晚安计划', ae: '🌛', ch: '美食' },
  { t: '奶油风客厅的配色公式', d: '70% 白 + 20% 木 + 10% 跳色，不会错', e: '🪴', c: ['#f0e6d8', '#c8b49c'], r: 1.33, a: '小户型研究所', ae: '🏠', ch: '家居' },
  { t: '手残党也能通关的副本攻略', d: '跟着这个站位走，零失误过 boss', e: '⚔️', c: ['#c0d0f0', '#7f95d0'], r: 0.75, a: '游戏宅日常', ae: '🕹️', ch: '游戏' },
  { t: '青岛海边的小众机位', d: '避开人从众，这几个点随手一拍都出片', e: '🌊', c: ['#a0d4e8', '#5fa0c0'], r: 1.33, a: '在路上的猫', ae: '🐈', ch: '旅行', loc: '山东·青岛' },
  { t: '晨跑三个月身体变化实录', d: '不追求配速，先把习惯养起来', e: '🏃', c: ['#ffe0b0', '#ffa880'], r: 1.0, a: '铁馆日记', ae: '💪', ch: '健身' },
  { t: '桌面改造：无线化真的会上瘾', d: '线少了，心情也跟着清爽起来', e: '🖥️', c: ['#c5d5e5', '#8ba0bd'], r: 1.0, a: '数码小卖部', ae: '🎵', ch: '数码' },
  { t: '秋日氛围感穿搭公式', d: '大地色系叠加，随便穿都很有质感', e: '🍂', c: ['#f0d8b0', '#d0a878'], r: 1.33, a: '林小满', ae: '🐰', ch: '穿搭' },
]

const AVATAR_BG = ['#ffd6a5', '#b8e0d2', '#f5c2d6', '#c8d8f0', '#e8d8f0', '#ffe0b0']

/** 依据索引生成稳定的假数据 */
function buildNote(seed: Seed, i: number): Note {
  // 用索引做伪随机，保证每次渲染数据一致
  const r = (n: number) => ((i * 37 + n * 17) % 100) / 100
  return {
    id: `note-${i + 1}`,
    title: seed.t,
    desc: seed.d,
    emoji: seed.e,
    cover: seed.c,
    ratio: seed.r,
    author: {
      name: seed.a,
      emoji: seed.ae,
      bg: AVATAR_BG[i % AVATAR_BG.length],
    },
    likes: Math.floor(120 + r(1) * 9800),
    comments: Math.floor(3 + r(2) * 480),
    collected: false,
    channel: seed.ch,
    location: seed.loc,
    video: seed.v,
  }
}

export const NOTES: Note[] = SEEDS.map(buildNote)

/** 顶部发现页的推荐专题 */
export const TOPICS = [
  { id: 't1', name: '秋日穿搭图鉴', emoji: '🍂', hot: '2.4 亿次浏览' },
  { id: 't2', name: '一人食灵感', emoji: '🍳', hot: '1.8 亿次浏览' },
  { id: 't3', name: '小家改造计划', emoji: '🛠️', hot: '9862 万次浏览' },
  { id: 't4', name: '通勤不将就', emoji: '🚇', hot: '7623 万次浏览' },
]

/** 购物频道商品（用于展示 NutUI 电商组件能力） */
export interface Goods {
  id: string
  name: string
  price: number
  origin: number
  emoji: string
  cover: [string, string]
  tags: string[]
  /** 规格选项 */
  sku: { name: string; values: string[] }[]
  sold: number
}

export const GOODS_LIST: Goods[] = [
  {
    id: 'g1',
    name: '云朵感 · 美利奴羊毛针织开衫',
    price: 299,
    origin: 459,
    emoji: '🧥',
    cover: ['#f8d7a3', '#e9a97b'],
    tags: ['限时秒杀', '包邮'],
    sku: [
      { name: '颜色', values: ['奶杏色', '雾霾蓝', '燕麦白'] },
      { name: '尺码', values: ['S', 'M', 'L'] },
    ],
    sold: 3821,
  },
  {
    id: 'g2',
    name: '奶油杏子 · 三件套彩妆礼盒',
    price: 189,
    origin: 288,
    emoji: '💄',
    cover: ['#fbc2d4', '#f08ca8'],
    tags: ['满 199 减 30', '赠小样'],
    sku: [
      { name: '色号', values: ['#01 奶油杏', '#02 蜜桃粉', '#03 玫瑰豆沙'] },
    ],
    sold: 1290,
  },
  {
    id: 'g3',
    name: '静音降噪蓝牙耳机 Pro',
    price: 799,
    origin: 1099,
    emoji: '🎧',
    cover: ['#c9d6e8', '#8fa3c9'],
    tags: ['12 期免息', '以旧换新'],
    sku: [
      { name: '颜色', values: ['月光白', '曜石黑'] },
      { name: '版本', values: ['标准版', '降噪版'] },
    ],
    sold: 654,
  },
]

export const COUPONS = [
  { id: 'c1', amount: 30, threshold: 199, name: '全品类满减券', expire: '2026-10-07' },
  { id: 'c2', amount: 50, threshold: 399, name: '服饰专享券', expire: '2026-10-01' },
  { id: 'c3', amount: 8, threshold: 0, name: '无门槛新人券', expire: '2026-09-30' },
]
