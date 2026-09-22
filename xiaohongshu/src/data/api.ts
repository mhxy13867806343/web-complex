import type { Note, NoteDetailData, CommentItem, Author, UserProfileData } from './index'
import { STATIC_CHANNELS, STATIC_FEEDS, getStaticFeed } from './staticFeeds'
import { generateDynamicComments } from './commentsGenerator'

/**
 * 数据接口层（/api/xhs/*）
 *
 * 智能环境判断：
 * 1. 静态演示环境（如 GitHub Pages `*.github.io`、静态托管）：
 *    零外部请求、零 404！直接由客户端丰富数据集与专属分类生成引擎驱动，保证控制台零报错。
 * 2. 本地开发与私有 Node 环境（localhost 或配置了有效 VITE_API_BASE 的环境）：
 *    请求同源或远程 /api/xhs/* 实时抓取小红书最新笔记、多图和评论。
 */

export interface FeedResult {
  channel: string
  channelId: string
  fetchedAt: string
  count: number
  notes: Note[]
  page?: number
  cached?: boolean
  stale?: boolean
}

export interface ChannelItem {
  name: string
  id: string
  originalId?: string
}

// 记录各频道的分页状态，用于上拉无限加载
const channelPageMap = new Map<string, number>()

/** 判断当前是否运行在纯静态托管环境（如 GitHub Pages） */
export function isStaticEnvironment(): boolean {
  if (typeof window === 'undefined') return true
  // 显式指定了远程后端 API，则走远程
  if (import.meta.env?.VITE_API_BASE) return false
  const host = window.location.hostname
  // 本地开发环境（有本地代理服务支持 /api/xhs/*）
  if (['localhost', '127.0.0.1', '0.0.0.0'].includes(host)) return false
  // 静态托管环境（如 GitHub Pages、Gitee 等，无 Node 运行环境）
  if (host.endsWith('github.io') || host.endsWith('gitee.io')) return true
  if (import.meta.env?.PROD && !import.meta.env?.VITE_API_BASE) return true
  return false
}

function getApiBase(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }
  return ''
}

/** 静态环境下构建单篇笔记完整详情（零网络请求、零 404） */
function buildStaticNoteDetail(id: string, fallbackNote?: Partial<Note>): NoteDetailData {
  let note = fallbackNote
  if (!note || !note.title) {
    for (const ch of Object.keys(STATIC_FEEDS)) {
      const found = STATIC_FEEDS[ch].find((n) => n.id === id)
      if (found) {
        note = found
        break
      }
    }
  }

  const title = note?.title || '小红书精选笔记'
  const cover = note?.cover || ''
  const rawLikes = String(note?.likes || '582')
  const isVideo = note?.type === 'video'
  const numLikes = parseInt(rawLikes.replace(/[^0-9]/g, '') || '100', 10)

  return {
    id,
    title,
    desc: `${title}\n\n生活里的治愈瞬间，认真记录每一个美好细节✨\n欢迎在评论区一起交流探讨～\n#小红书 #日常分享 #生活记录 #精选推荐`,
    type: isVideo ? 'video' : 'normal',
    imageList: cover ? [cover] : [],
    videoUrl: '',
    tags: ['生活记录', '好物推荐', '日常分享'],
    interactInfo: {
      likedCount: rawLikes,
      collectedCount: String(Math.max(16, Math.round(numLikes * 0.35))),
      commentCount: String(Math.max(12, Math.round(numLikes * 0.18))),
      shareCount: '19',
    },
    user: note?.author || {
      name: '小红书精选博主',
      avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/60fae49403408d92e68f4952.jpg',
    },
  }
}

/** 拉取频道分类 */
export async function fetchChannels(signal?: AbortSignal) {
  // 静态环境（如 GitHub Pages）直接返回静态分类，避免发出无意义且必 404 的网络请求
  if (isStaticEnvironment()) {
    return { fetchedAt: new Date().toISOString(), channels: STATIC_CHANNELS }
  }

  const base = getApiBase()
  const url = base ? `${base.replace(/\/$/, '')}/api/xhs/channels` : '/api/xhs/channels'
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (res.ok) {
      return (await res.json()) as { fetchedAt: string; channels: ChannelItem[] }
    }
  } catch {
    /* 降级到静态兜底分类 */
  }
  return { fetchedAt: new Date().toISOString(), channels: STATIC_CHANNELS }
}

/** 拉取某个流的笔记 */
export async function fetchFeed(
  channel: string,
  opts: { signal?: AbortSignal; more?: boolean } = {}
) {
  const ch = channel || '推荐'
  let page = channelPageMap.get(ch) || 1
  if (opts.more) {
    page += 1
    channelPageMap.set(ch, page)
  } else {
    page = 1
    channelPageMap.set(ch, 1)
  }

  // 静态环境直接返回离线数据流
  if (isStaticEnvironment()) {
    return { ...getStaticFeed(ch, page, 10), page }
  }

  const base = getApiBase()
  const qs = new URLSearchParams({ channel: ch })
  if (opts.more) qs.set('fresh', '1')
  qs.set('page', String(page))
  qs.set('pageSize', '10')
  qs.set('action', opts.more ? 'loadmore' : 'refresh')
  qs.set('t', String(Date.now()))
  const path = `/api/xhs/feed?${qs.toString()}`
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path
  try {
    const res = await fetch(url, { signal: opts.signal, headers: { Accept: 'application/json' } })
    if (res.ok) {
      const data = (await res.json()) as FeedResult
      return { ...data, page }
    }
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') throw err
    /* 遇到风控或超时优雅回退到内存数据集，保证页面不白屏不报错 */
  }
  return { ...getStaticFeed(ch, page, 10), page }
}

/** 抓取笔记完整详情（多图列表、视频播放直链、正文描述、话题标签、点赞数等） */
export async function fetchNoteDetail(
  id: string,
  noteUrl?: string,
  fallbackNote?: Partial<Note>,
  signal?: AbortSignal
): Promise<NoteDetailData> {
  // 静态环境（GitHub Pages 等无后端运行环境），直接生成详情，彻底避免 404
  if (isStaticEnvironment()) {
    return buildStaticNoteDetail(id, fallbackNote)
  }

  const base = getApiBase()
  const qs = new URLSearchParams({ id })
  if (noteUrl) qs.set('url', noteUrl)
  const path = `/api/xhs/note?${qs.toString()}`
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path

  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (res.ok) {
      return (await res.json()) as NoteDetailData
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e
  }

  return buildStaticNoteDetail(id, fallbackNote)
}

/** 获取笔记评论列表（支持根据笔记主题动态匹配、主评论、二级回复嵌套与点赞） */
export async function fetchNoteComments(
  noteId: string,
  title?: string,
  tags?: string[],
  commentCount?: string,
  signal?: AbortSignal
): Promise<{ count: number; comments: CommentItem[] }> {
  // 静态环境（GitHub Pages 等无后端环境），直接由客户端动态生成丰富专属评论，彻底避免 404
  if (isStaticEnvironment()) {
    return generateDynamicComments(noteId, title, tags, commentCount)
  }

  const base = getApiBase()
  const qs = new URLSearchParams({ note_id: noteId })
  if (title) qs.set('title', title)
  if (tags && tags.length > 0) qs.set('tags', tags.join(','))
  if (commentCount) qs.set('comment_count', commentCount)
  const path = `/api/xhs/comments?${qs.toString()}`
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path

  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (res.ok) {
      return (await res.json()) as { count: number; comments: CommentItem[] }
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e
  }

  // 后端未启动或遇到 404 时优雅降级到客户端引擎生成
  return generateDynamicComments(noteId, title, tags, commentCount)
}

/**
 * 获取小红书原站博主个人主页直链（带 xsec_token 与完整安全参数）
 */
export function getUserProfileUrl(
  author: Partial<Author> & { name?: string; avatar?: string; userId?: string; userUrl?: string; xsecToken?: string },
  fallbackNoteUrl?: string
): string {
  if (author.userUrl) return author.userUrl
  const avatar = author.avatar || ''
  const avatarIdMatch = avatar.match(/avatar\/([a-f0-9]{24})/i)
  const userId = author.userId || (avatarIdMatch ? avatarIdMatch[1] : '5d69dbca00000000010081fc')

  let token = author.xsecToken || ''
  if (!token && fallbackNoteUrl) {
    const m = fallbackNoteUrl.match(/xsec_token=([^&]+)/)
    if (m) token = m[1]
  }
  if (!token) {
    token = 'AB4kerAPQbqA3B57WFZrBlh4vxcaETaAeHyHiZfvRLaz4='
  }

  return `https://www.xiaohongshu.com/user/profile/${userId}?xsec_token=${encodeURIComponent(token)}&xsec_source=pc_feed`
}

/**
 * 客户端发起真实 HTTP 请求获取博主详情数据与作品流（GET /api/xhs/user?id=...）
 */
export async function fetchUserProfileApi(
  userId: string,
  author?: Author,
  fallbackNotes: Note[] = [],
  signal?: AbortSignal
): Promise<UserProfileData> {
  // 静态托管环境（如 GitHub Pages）回退到客户端动态聚合
  if (isStaticEnvironment()) {
    return buildUserProfile(author || { name: '小红书博主', avatar: '', userId }, fallbackNotes)
  }

  const base = getApiBase()
  const qs = new URLSearchParams()
  if (userId) qs.set('id', userId)
  if (author?.name) qs.set('name', author.name)
  if (author?.avatar) qs.set('avatar', author.avatar)
  if (author?.xsecToken) qs.set('token', author.xsecToken)

  const path = `/api/xhs/user?${qs.toString()}`
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path

  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (res.ok) {
      return (await res.json()) as UserProfileData
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e
  }

  return buildUserProfile(author || { name: '小红书博主', avatar: '', userId }, fallbackNotes)
}

/**
 * 构建并聚合指定博主的高保真个人主页数据（含头像、红薯号、IP属地、粉丝/获赞统计、作品列表与原站跳转链接）
 */
export function buildUserProfile(
  author: Author,
  knownNotes: Note[] = []
): UserProfileData {
  const avatar = author.avatar || ''
  const avatarIdMatch = avatar.match(/avatar\/([a-f0-9]{24})/i)
  const userId = author.userId || (avatarIdMatch ? avatarIdMatch[1] : '5d69dbca00000000010081fc')
  const userToken = author.xsecToken || 'AB4kerAPQbqA3B57WFZrBlh4vxcaETaAeHyHiZfvRLaz4='
  const userUrl = author.userUrl || `https://www.xiaohongshu.com/user/profile/${userId}?xsec_token=${userToken}&xsec_source=pc_feed`
  const redId = author.redId || userId.slice(0, 10)

  // 聚合该博主的笔记作品：
  // 1. 优先匹配同一作者名字或相同 userId 的笔记
  const matched = knownNotes.filter(
    (n) => n.author.name === author.name || (n.author.userId && n.author.userId === userId)
  )

  let notes = [...matched]
  // 2. 若作品不足 4 条，从现有瀑布流中补齐精选作品，保证主页作品丰富不空洞
  if (notes.length < 4 && knownNotes.length > 0) {
    const others = knownNotes.filter((n) => !notes.some((m) => m.id === n.id))
    notes = [...notes, ...others.slice(0, 8 - notes.length)]
  }

  // 依据博主姓名或 ID 生成稳定的博主数据
  const seed = (author.name || '小红书博主').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const follows = author.follows || String(15 + (seed % 80))
  const fans = author.fans || (seed % 3 === 0 ? `${(1.2 + (seed % 20) * 0.3).toFixed(1)}万` : String(230 + (seed % 900)))
  const likedAndCollected = author.likedAndCollected || `${(3.5 + (seed % 30) * 0.8).toFixed(1)}万`
  const ipLocations = ['广东', '上海', '北京', '浙江', '江苏', '四川', '山东', '湖北', '福建']
  const ipLocation = author.ipLocation || ipLocations[seed % ipLocations.length]

  const bios = [
    '热爱生活，记录日常美好与灵感 ✨ 合作请私信',
    '分享穿搭 / 美食 / 治愈系日常 🌿 每天都要开开心心呀',
    '专注分享实用好物与真实测评 ☕️ 愿所有美好如期而至',
    '生活碎片收集者 📸 每一刻都有它的意义',
    '热爱烘焙与厨房的烟火气 🍞 愿美食治愈你的每一天',
  ]
  const desc = author.desc || bios[seed % bios.length]

  return {
    userId,
    name: author.name,
    avatar,
    redId,
    ipLocation,
    desc,
    tags: ['🍠 优质创作者', '生活精选博主'],
    gender: seed % 2 === 0 ? 'female' : 'male',
    follows,
    fans,
    likedAndCollected,
    userUrl,
    notes,
  }
}

