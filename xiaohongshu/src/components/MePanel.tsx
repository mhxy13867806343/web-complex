import { Cell, CellGroup, Grid, GridItem, Toast } from '@nutui/nutui-react'
import { Edit, Order, Photograph, Star } from '@nutui/icons-react'

const ENTRIES = [
  { text: '收藏', icon: <Star width={22} height={22} color="#ff2442" /> },
  { text: '赞过', icon: <Photograph width={22} height={22} color="#ff2442" /> },
  { text: '笔记', icon: <Edit width={22} height={22} color="#ff2442" /> },
  { text: '订单', icon: <Order width={22} height={22} color="#ff2442" /> },
]

/**
 * 「我」页面
 * 真实的小红书在未登录时就是这个状态（没有个人资料数据），
 * 因此这里不做伪造，只保留登录入口与通用功能入口。
 */
export default function MePanel() {
  return (
    <div>
      <div className="me-header">
        <div className="me-user">
          <span className="me-avatar me-avatar-guest">?</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="me-name">未登录</div>
            <div className="me-id">登录后查看你的笔记、收藏与消息</div>
          </div>
          <button
            className="btn-login"
            onClick={() => Toast.show({ content: '登录入口（演示）', duration: 1.2 })}
          >
            登录 / 注册
          </button>
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
              </div>
            </GridItem>
          ))}
        </Grid>
      </div>

      <div className="me-cell-group">
        <CellGroup>
          <Cell title="我的购物车" extra="—" onClick={() => Toast.show({ content: '购物车（演示）', duration: 1 })} />
          <Cell title="优惠券" extra="—" onClick={() => Toast.show({ content: '优惠券（演示）', duration: 1 })} />
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
