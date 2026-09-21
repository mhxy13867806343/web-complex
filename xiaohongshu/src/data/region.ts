import type { CascaderOption } from '@nutui/nutui-react'

/**
 * 省市区数据（用于 NutUI Address 组件演示）
 * 结构遵循 CascaderOption：{ value, text, children }
 */
export const REGION: CascaderOption[] = [
  {
    value: '110000',
    text: '北京市',
    children: [
      {
        value: '110100',
        text: '北京市',
        children: [
          { value: '110105', text: '朝阳区' },
          { value: '110106', text: '海淀区' },
          { value: '110101', text: '东城区' },
          { value: '110102', text: '西城区' },
        ],
      },
    ],
  },
  {
    value: '310000',
    text: '上海市',
    children: [
      {
        value: '310100',
        text: '上海市',
        children: [
          { value: '310101', text: '黄浦区' },
          { value: '310104', text: '徐汇区' },
          { value: '310115', text: '浦东新区' },
        ],
      },
    ],
  },
  {
    value: '440000',
    text: '广东省',
    children: [
      {
        value: '440300',
        text: '深圳市',
        children: [
          { value: '440304', text: '福田区' },
          { value: '440305', text: '南山区' },
          { value: '440303', text: '罗湖区' },
        ],
      },
      {
        value: '440100',
        text: '广州市',
        children: [
          { value: '440106', text: '天河区' },
          { value: '440104', text: '越秀区' },
        ],
      },
    ],
  },
  {
    value: '330000',
    text: '浙江省',
    children: [
      {
        value: '330100',
        text: '杭州市',
        children: [
          { value: '330106', text: '西湖区' },
          { value: '330108', text: '滨江区' },
          { value: '330102', text: '上城区' },
        ],
      },
      {
        value: '330200',
        text: '宁波市',
        children: [
          { value: '330203', text: '海曙区' },
          { value: '330206', text: '北仑区' },
        ],
      },
    ],
  },
  {
    value: '510000',
    text: '四川省',
    children: [
      {
        value: '510100',
        text: '成都市',
        children: [
          { value: '510107', text: '武侯区' },
          { value: '510104', text: '锦江区' },
          { value: '510105', text: '青羊区' },
        ],
      },
    ],
  },
]
