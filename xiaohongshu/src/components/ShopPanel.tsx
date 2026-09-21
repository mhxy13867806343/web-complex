import { useMemo, useState } from 'react'
import {
  Address,
  Cascader,
  CountDown,
  Price,
  SearchBar,
  SideBar,
  SideBarItem,
  Tag,
  Toast,
  type CascaderOption,
} from '@nutui/nutui-react'
import { ArrowDown, Clock, Coupon, Location } from '@nutui/icons-react'
import { COUPONS, GOODS_LIST, type Goods } from '../mock/notes'
import { REGION, SHOP_CATEGORIES } from '../mock/region'

/** 秒杀结束时间：进入页面后 3 小时 */
const END_TIME = Date.now() + 3 * 3600 * 1000

export default function ShopPanel() {
  const [addrVisible, setAddrVisible] = useState(false)
  const [address, setAddress] = useState('北京市 北京市 朝阳区')
  const [skuVisible, setSkuVisible] = useState(false)
  const [skuGoods, setSkuGoods] = useState<Goods | null>(null)
  const [gotCoupons, setGotCoupons] = useState<string[]>([])
  const [category, setCategory] = useState(0)

  /** 把商品的规格数组转换成 Cascader 需要的树形结构 */
  const skuOptions = useMemo<CascaderOption[]>(() => {
    if (!skuGoods) return []
    const build = (level: number): CascaderOption[] => {
      const spec = skuGoods.sku[level]
      if (!spec) return []
      const isLast = level === skuGoods.sku.length - 1
      return spec.values.map((v) => ({
        text: v,
        value: `${spec.name}-${v}`,
        children: isLast ? undefined : build(level + 1),
      }))
    }
    return build(0)
  }, [skuGoods])

  const goods = useMemo(() => {
    // 这里用「分类序号 % 商品数」模拟不同分类下的商品
    if (category === 0) return GOODS_LIST
    return GOODS_LIST.filter((_, i) => i % SHOP_CATEGORIES.length === category - 1)
  }, [category])

  return (
    <div>
      {/* ---------- 顶部：地址 + 搜索 ---------- */}
      <div className="shop-header">
        <div className="shop-addr" onClick={() => setAddrVisible(true)}>
          <Location width={14} height={14} color="#fff" />
          <span className="shop-addr-text">配送至 · {address}</span>
          <ArrowDown width={12} height={12} color="#fff" />
        </div>
        <SearchBar className="shop-search" shape="round" placeholder="搜索商品 / 店铺" />
      </div>

      {/* ---------- 限时秒杀（NutUI CountDown） ---------- */}
      <div className="shop-block">
        <div className="shop-block-title">
          <div className="seckill-head">
            <h3>限时秒杀</h3>
            <Clock width={16} height={16} color="#ff2442" />
          </div>
          <div className="seckill-cd">
            距结束
            <CountDown className="cd-box-text" endTime={END_TIME} format="HH:mm:ss" />
          </div>
        </div>
        <div className="seckill-list">
          {GOODS_LIST.map((g) => (
            <div className="seckill-item" key={g.id}>
              <div
                className="sk-cover"
                style={{
                  background: `linear-gradient(135deg, ${g.cover[0]}, ${g.cover[1]})`,
                }}
              >
                {g.emoji}
              </div>
              <div className="sk-name ellipsis-2">{g.name}</div>
              <div className="sk-price">
                <Price price={g.price} size="normal" color="#ff2442" thousands symbol="¥" />
                <span className="sk-origin">¥{g.origin}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- 优惠券（NutUI Tag + 自定义券样式） ---------- */}
      <div className="shop-block">
        <div className="shop-block-title">
          <h3>
            <Coupon width={16} height={16} color="#ff2442" /> 领券中心
          </h3>
          <span className="more">全部优惠券 ›</span>
        </div>
        <div className="coupons">
          {COUPONS.map((c) => {
            const got = gotCoupons.includes(c.id)
            return (
              <div className={`coupon${got ? ' got' : ''}`} key={c.id}>
                <div className="coupon-amount">
                  <small>¥</small>
                  {c.amount}
                </div>
                <div className="coupon-info">
                  <div className="coupon-name">
                    {c.threshold > 0 ? `满 ${c.threshold} 可用` : '无门槛'}
                  </div>
                  <div className="coupon-exp">{c.name} · {c.expire} 到期</div>
                </div>
                <button
                  className="coupon-btn"
                  disabled={got}
                  onClick={() => {
                    if (got) return
                    setGotCoupons((prev) => [...prev, c.id])
                    Toast.show({ content: `已领取 ${c.amount} 元券`, duration: 1.2 })
                  }}
                >
                  {got ? '已领取' : '领取'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ---------- 分类 + 商品列表（NutUI SideBar） ---------- */}
      <div className="shop-main">
        <div className="shop-side">
          <SideBar value={category} onChange={(v) => setCategory(Number(v))}>
            {SHOP_CATEGORIES.map((c) => (
              <SideBarItem key={c.value} title={c.title} value={c.value} />
            ))}
          </SideBar>
        </div>

        <div className="shop-goods">
          {goods.length === 0 && <div className="empty-box">该分类暂无商品</div>}
          {goods.map((g) => (
            <div className="goods-item" key={g.id}>
              <div
                className="goods-cover"
                style={{
                  background: `linear-gradient(135deg, ${g.cover[0]}, ${g.cover[1]})`,
                }}
              >
                {g.emoji}
              </div>
              <div className="goods-info">
                <div className="goods-name ellipsis-2">{g.name}</div>
                <div className="goods-tags">
                  {g.tags.map((t) => (
                    <Tag key={t} type="danger" plain round>
                      {t}
                    </Tag>
                  ))}
                </div>
                <div className="goods-bottom">
                  <div>
                    <Price price={g.price} size="normal" color="#ff2442" thousands symbol="¥" />
                    <div className="goods-sold">已售 {g.sold}</div>
                  </div>
                  <button
                    className="btn-buy"
                    onClick={() => {
                      setSkuGoods(g)
                      setSkuVisible(true)
                    }}
                  >
                    选规格
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- 地址选择（NutUI Address） ---------- */}
      <Address
        visible={addrVisible}
        type="cascader"
        options={REGION}
        height="60%"
        onChange={(_value, pathNodes) => {
          const text = (pathNodes || []).map((n) => n.text).filter(Boolean).join(' ')
          if (text) setAddress(text)
          setAddrVisible(false)
          Toast.show({ content: `已切换到 ${text || address}`, duration: 1.2 })
        }}
        onClose={() => setAddrVisible(false)}
      />

      {/* ---------- 规格选择（NutUI Cascader 多级选择） ---------- */}
      <Cascader
        visible={skuVisible}
        options={skuOptions}
        title={skuGoods ? `选择 ${skuGoods.name.slice(0, 8)}… 的规格` : '选择规格'}
        closeable
        onChange={(_value, pathNodes) => {
          const picked = (pathNodes || []).map((n) => n.text).filter(Boolean).join(' / ')
          if (picked) {
            setSkuVisible(false)
            Toast.show({ content: `已选择：${picked}`, duration: 1.5 })
          }
        }}
        onClose={() => setSkuVisible(false)}
      />
    </div>
  )
}
