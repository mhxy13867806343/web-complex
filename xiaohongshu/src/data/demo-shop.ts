/**
 * 购物页演示数据
 *
 * ⚠️ 这里是为了演示 NutUI 电商组件（Address / CountDown / Cascader / Price / Tag）
 * 而编写的示意数据，不是抓取自真实商城的商品。小红书真实商品数据需要登录态，
 * 匿名抓不到，因此购物页只作为「组件能力演示」存在，界面上也做了标注。
 */

export interface Goods {
  id: string
  name: string
  price: number
  origin: number
  emoji: string
  cover: [string, string]
  tags: string[]
  /** 规格选项，用于生成 Cascader 级联选择 */
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
    sku: [{ name: '色号', values: ['#01 奶油杏', '#02 蜜桃粉', '#03 玫瑰豆沙'] }],
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

/** 购物页左侧分类 */
export const SHOP_CATEGORIES = [
  { title: '今日推荐', value: 0 },
  { title: '服饰穿搭', value: 1 },
  { title: '美妆个护', value: 2 },
  { title: '数码家电', value: 3 },
  { title: '家居生活', value: 4 },
]
