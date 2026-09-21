import type { ChannelItem, FeedResult } from './api'
import type { Note } from './index'

export const FALLBACK_CHANNELS: ChannelItem[] = [
  { name: '穿搭', id: 'homefeed.fashion_v3' },
  { name: '美食', id: 'homefeed.food_v3' },
  { name: '彩妆', id: 'homefeed.cosmetics_v3' },
  { name: '影视', id: 'homefeed.movie_and_tv_v3' },
  { name: '职场', id: 'homefeed.career_v3' },
  { name: '情感', id: 'homefeed.love_v3' },
  { name: '家居', id: 'homefeed.household_product_v3' },
  { name: '游戏', id: 'homefeed.gaming_v3' },
  { name: '旅行', id: 'homefeed.travel_v3' },
  { name: '健身', id: 'homefeed.fitness_v3' },
  { name: '视频', id: 'homefeed.video' },
]

export const FALLBACK_NOTES: Note[] = [
  {
    id: '6804a608000000001b02008f',
    title: '春日复古温柔系穿搭 🌸 奶油色针织开衫日常搭配指南',
    cover: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    coverWidth: 3,
    coverHeight: 4,
    type: 'normal',
    likes: '2.8万',
    author: {
      name: '每日穿搭日记',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    noteUrl: 'https://www.xiaohongshu.com/explore',
  },
  {
    id: '6804a608000000001b020090',
    title: '在家也能复刻！超治愈的日式芝士舒芙蕾松饼 🥞',
    cover: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80',
    coverWidth: 4,
    coverHeight: 5,
    type: 'normal',
    likes: '1.9万',
    author: {
      name: '小森食光',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    },
    noteUrl: 'https://www.xiaohongshu.com/explore',
  },
  {
    id: '6804a608000000001b020091',
    title: '沉浸式书房改造 🌿 6㎡ 打造高效率办公与阅读角落',
    cover: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80',
    coverWidth: 3,
    coverHeight: 4,
    type: 'normal',
    likes: '9650',
    author: {
      name: '独居生活家',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    noteUrl: 'https://www.xiaohongshu.com/explore',
  },
  {
    id: '6804a608000000001b020092',
    title: '云南小众自驾路线 🚗 穿越大理与香格里拉的绝美秘境',
    cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80',
    coverWidth: 3,
    coverHeight: 4,
    type: 'normal',
    likes: '3.4万',
    author: {
      name: '山野寻迹',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    noteUrl: 'https://www.xiaohongshu.com/explore',
  },
  {
    id: '6804a608000000001b020093',
    title: '低饱和日常清冷白开水妆容 🧊 伪素颜干货教程',
    cover: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    coverWidth: 4,
    coverHeight: 5,
    type: 'normal',
    likes: '1.2万',
    author: {
      name: '美妆研究所',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    noteUrl: 'https://www.xiaohongshu.com/explore',
  },
  {
    id: '6804a608000000001b020094',
    title: '职场高情商沟通术：怎么汇报才能让领导眼前一亮？',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    coverWidth: 3,
    coverHeight: 4,
    type: 'normal',
    likes: '8420',
    author: {
      name: '职场向上生',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    },
    noteUrl: 'https://www.xiaohongshu.com/explore',
  },
  {
    id: '6804a608000000001b020095',
    title: '新手在家徒手燃脂塑形 🏃‍♀️ 20分钟全身暴汗跟练',
    cover: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    coverWidth: 3,
    coverHeight: 4,
    type: 'video',
    likes: '4.6万',
    author: {
      name: '活力运动日记',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    noteUrl: 'https://www.xiaohongshu.com/explore',
  },
  {
    id: '6804a608000000001b020096',
    title: 'Switch 必玩的 10 款独立神作 🎮 随时随地停不下来！',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    coverWidth: 4,
    coverHeight: 5,
    type: 'normal',
    likes: '1.5万',
    author: {
      name: '极客小食堂',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    },
    noteUrl: 'https://www.xiaohongshu.com/explore',
  },
]

export function getFallbackFeed(channel: string): FeedResult {
  return {
    channel: channel || '推荐',
    channelId: 'fallback_channel',
    fetchedAt: new Date().toISOString(),
    count: FALLBACK_NOTES.length,
    notes: FALLBACK_NOTES,
    cached: true,
  }
}
