import { Cell, CellGroup, Grid, GridItem, Toast } from '@nutui/nutui-react'
import { Edit, Order, Photograph, Star } from '@nutui/icons-react'

const ENTRIES = [
  { text: '收藏', icon: <Star width={22} height={22} color="#ff2442" />, value: '128' },
  { text: '赞过', icon: <Photograph width={22} height={22} color="#ff2442" />, value: '356' },
  { text: '笔记', icon: <Edit width={22} height={22} color="#ff2442" />, value: '24' },
  { text: '订单', icon: <Order width={22} height={22} color="#ff2442" />, value: '6' },
]

export default function MePanel() {
  return (
    <div>
      <div className="me-header">
        <div className="me-user">
          <span className="me-avatar" style={{ background: 'linear-gradient(135deg,#ffd0d9,#ff9fb2)' }}>
            🐰
          </span>
          <div>
            <div className="me-name">林小满</div>
            <div className="me-id">小红书号：8823771902</div>
          </div>
        </div>
        <div className="me-stats">
          <div className="me-stat">
            <b>126</b>
            <span>关注</span>
          </div>
          <div className="me-stat">
            <b>2.4 万</b>
            <span>粉丝</span>
          </div>
          <div className="me-stat">
            <b>8.9 万</b>
            <span>获赞与收藏</span>
          </div>
        </div>
      </div>

      <div className="me-grid">
        <Grid columns={4} gap={0} center>
          {ENTRIES.map((e) => (
            <GridItem
              key={e.text}
              text={e.text}
              onClick={() => Toast.show({ content: `打开「${e.text}」（演示）`, duration: 1.2 })}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {e.icon}
                <span style={{ fontSize: 13, fontWeight: 600 }}>{e.value}</span>
              </div>
            </GridItem>
          ))}
        </Grid>
      </div>

      <div className="me-cell-group">
        <CellGroup>
          <Cell title="我的购物车" extra="3 件" onClick={() => Toast.show({ content: '购物车（演示）', duration: 1 })} />
          <Cell title="优惠券" extra="2 张可用" onClick={() => Toast.show({ content: '优惠券（演示）', duration: 1 })} />
          <Cell title="收货地址" onClick={() => Toast.show({ content: '收货地址（演示）', duration: 1 })} />
        </CellGroup>
      </div>

      <div className="me-cell-group">
        <CellGroup>
          <Cell title="设置" onClick={() => Toast.show({ content: '设置（演示）', duration: 1 })} />
          <Cell title="帮助与客服" onClick={() => Toast.show({ content: '客服（演示）', duration: 1 })} />
        </CellGroup>
      </div>
    </div>
  )
}
