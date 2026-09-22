import { useEffect, useRef, useState } from 'react'
import { Popup } from '@nutui/nutui-react'
import {
  ArrowLeft,
  ArrowRight,
  Comment,
  Heart,
  HeartFill,
  Share,
  Star,
  StarFill,
} from '@nutui/icons-react'
import type { Note, NoteDetailData } from '../data'
import { fetchNoteDetail } from '../data/api'
import { Toast } from './Toast'

interface Props {
  note: Note | null
  collected: boolean
  onCollect: (note: Note) => void
  onClose: () => void
}

function parseCount(raw: string | undefined, delta: number): string {
  if (!raw) return delta > 0 ? String(delta) : '0'
  if (raw.includes('万') || raw.includes('w')) return raw
  const num = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0
  return String(Math.max(0, num + delta))
}

/**
 * 笔记详情弹窗：
 * 1. 真实视频播放（videoUrl）
 * 2. 多图轮播切换（imageList）：手势滑动、左右翻页、2/5 角标、底部圆点指示器
 * 3. 真实正文内容（desc）与话题标签（tags）
 * 4. 真实互动数据：点赞数（likes: "787"）、收藏、评论、分享
 */
export default function NoteDetail({ note, collected, onCollect, onClose }: Props) {
  const [coverBroken, setCoverBroken] = useState(false)
  const [avatarBroken, setAvatarBroken] = useState(false)
  const [detail, setDetail] = useState<NoteDetailData | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeDelta, setLikeDelta] = useState(0)
  const [following, setFollowing] = useState(false)

  // 手势滑动图集
  const touchStart = useRef({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const isTouching = useRef(false)

  useEffect(() => {
    if (!note) {
      setDetail(null)
      setCurrentImgIndex(0)
      setLiked(false)
      setLikeDelta(0)
      setFollowing(false)
      return
    }

    setCurrentImgIndex(0)
    setLiked(false)
    setLikeDelta(0)
    setFollowing(false)
    setLoadingDetail(true)

    const ac = new AbortController()
    fetchNoteDetail(note.id, note.noteUrl, ac.signal)
      .then((res) => {
        setDetail(res)
      })
      .catch(() => {
        /* 保持兜底状态 */
      })
      .finally(() => {
        setLoadingDetail(false)
      })

    return () => ac.abort()
  }, [note])

  const isVideo = note ? (note.type === 'video' || detail?.type === 'video' || !!detail?.videoUrl) : false
  const images = (detail?.imageList && detail.imageList.length > 0) ? detail.imageList : (note ? [note.cover] : [])
  const currentLikes = parseCount(detail?.interactInfo?.likedCount || note?.likes, likeDelta)
  const currentCollects = parseCount(detail?.interactInfo?.collectedCount || '0', collected ? 1 : 0)

  // 多图轮播自动滚动（每 3 秒自动滚动到下一张，鼠标悬停或手指按住时自动暂停）
  useEffect(() => {
    if (images.length <= 1 || isVideo || isHovered) return

    const timer = setInterval(() => {
      if (isTouching.current) return
      setCurrentImgIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [images.length, isVideo, isHovered])

  if (!note) return null

  const onTouchStart = (e: React.TouchEvent) => {
    isTouching.current = true
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    isTouching.current = false
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        // 向左划：下一张（循环）
        setCurrentImgIndex((i) => (i + 1) % images.length)
      } else if (dx > 0) {
        // 向右划：上一张（循环）
        setCurrentImgIndex((i) => (i - 1 + images.length) % images.length)
      }
    }
  }

  const getVideoSrc = (rawUrl?: string) => {
    if (!rawUrl) return ''
    if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      return `/api/xhs/video?url=${encodeURIComponent(rawUrl)}`
    }
    return rawUrl.replace(/^http:/, 'https:')
  }

  return (
    <Popup
      visible={!!note}
      position="bottom"
      round
      closeable
      closeIconPosition="top-left"
      closeIcon={<ArrowLeft width={20} height={20} />}
      style={{ height: '92%' }}
      onClose={onClose}
    >
      <div className="detail">
        <div className="detail-scroll">
          {/* 顶部媒体区：视频直接播放 / 图集多图轮播（含 2/5 与小圆点） */}
          <div className="detail-media-container">
            {isVideo && detail?.videoUrl ? (
              <div className="detail-video-wrap">
                <video
                  className="detail-video-player"
                  src={getVideoSrc(detail.videoUrl)}
                  poster={note.cover}
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            ) : isVideo && !detail?.videoUrl ? (
              <div className="detail-video-wrap">
                <img
                  className="detail-cover-img"
                  src={note.cover}
                  alt={note.title}
                  referrerPolicy="no-referrer"
                  onError={() => setCoverBroken(true)}
                />
                <div className="video-loading-badge">
                  {loadingDetail ? '正在解析小红书视频源…' : '视频笔记'}
                </div>
              </div>
            ) : (
              <div
                className="carousel-wrap"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="carousel-track"
                  style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
                >
                  {images.map((src, i) => (
                    <div className="carousel-slide" key={i}>
                      {coverBroken ? (
                        <div className="detail-cover-fallback">
                          <span>🍠</span>
                          <em>图片加载失败</em>
                        </div>
                      ) : (
                        <img
                          src={src}
                          alt={note.title}
                          referrerPolicy="no-referrer"
                          onError={() => setCoverBroken(true)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {images.length > 1 && (
                  <>
                    {/* 右上角页码标：如 2/5 */}
                    <div className="carousel-counter">
                      {currentImgIndex + 1}/{images.length}
                    </div>

                    {/* 左右翻页箭头 */}
                    {currentImgIndex > 0 && (
                      <button
                        className="carousel-arrow carousel-arrow-left"
                        onClick={() => setCurrentImgIndex((i) => i - 1)}
                        aria-label="上一张"
                      >
                        <ArrowLeft width={16} height={16} />
                      </button>
                    )}
                    {currentImgIndex < images.length - 1 && (
                      <button
                        className="carousel-arrow carousel-arrow-right"
                        onClick={() => setCurrentImgIndex((i) => i + 1)}
                        aria-label="下一张"
                      >
                        <ArrowRight width={16} height={16} />
                      </button>
                    )}

                    {/* 底部指示圆点：● ● ● ● ● */}
                    <div className="carousel-dots">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={`carousel-dot${i === currentImgIndex ? ' active' : ''}`}
                          onClick={() => setCurrentImgIndex(i)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 笔记正文与话题 */}
          <div className="detail-body">
            <h2 className="detail-title">{note.title}</h2>

            <div className="detail-tags">
              <span className="detail-tag">{isVideo ? '视频笔记' : '图文笔记'}</span>
            </div>

            {/* 真实正文内容 */}
            {detail?.desc ? (
              <div className="detail-desc">
                {detail.desc.split('\n').map((para, i) =>
                  para.trim() ? <p key={i}>{para}</p> : null
                )}
              </div>
            ) : loadingDetail ? (
              <div className="detail-desc placeholder">正在加载笔记详细正文…</div>
            ) : (
              <div className="detail-desc placeholder">分享生活的美好瞬间 ✨</div>
            )}

            {/* 话题标签 */}
            {detail?.tags && detail.tags.length > 0 && (
              <div className="detail-tags-list">
                {detail.tags.map((tag, i) => (
                  <span key={i} className="detail-tag-item">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="detail-meta-row">
              <span className="detail-pub-time">
                {detail?.time ? `发布于 ${new Date(detail.time).toLocaleDateString()}` : '刚刚'}
              </span>
              <a
                className="btn-open-link"
                href={note.noteUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => Toast.show({ content: '跳转小红书原站', duration: 1.2 })}
              >
                在原站打开 ↗
              </a>
            </div>
          </div>

          {/* 作者信息栏 */}
          <div className="detail-author">
            {avatarBroken || !note.author.avatar ? (
              <span className="avatar-emoji" style={{ background: '#f0f0f0' }}>
                {note.author.name.slice(0, 1)}
              </span>
            ) : (
              <img
                className="avatar-img avatar-img-lg"
                src={detail?.user?.avatar || note.author.avatar}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setAvatarBroken(true)}
              />
            )}
            <span className="detail-author-name">{detail?.user?.name || note.author.name}</span>
            <button
              className={`btn-follow${following ? ' following' : ''}`}
              onClick={() => {
                setFollowing(!following)
                Toast.show({ content: !following ? '已关注作者' : '已取消关注', duration: 1.2 })
              }}
            >
              {following ? '已关注' : '关注'}
            </button>
          </div>
        </div>

        {/* 底部真实互动栏：点赞数（likes: "787"）、收藏、评论、分享 */}
        <div className="detail-bar">
          <div className="detail-input-wrap">
            <span className="detail-input">说点什么…</span>
          </div>

          {/* 点赞按钮与点赞数展示 */}
          <div
            className={`detail-action-btn${liked ? ' liked' : ''}`}
            onClick={() => {
              const nextLiked = !liked
              setLiked(nextLiked)
              setLikeDelta((d) => (nextLiked ? d + 1 : d - 1))
              Toast.show({ content: nextLiked ? '点赞成功' : '取消点赞', duration: 1 })
            }}
          >
            {liked ? <HeartFill width={20} height={20} color="#ff2442" /> : <Heart width={20} height={20} />}
            <span className="detail-action-count">{currentLikes}</span>
          </div>

          {/* 收藏 */}
          <div
            className={`detail-action-btn${collected ? ' collected' : ''}`}
            onClick={() => onCollect(note)}
          >
            {collected ? <StarFill width={20} height={20} color="#f5a623" /> : <Star width={20} height={20} />}
            <span className="detail-action-count">{currentCollects}</span>
          </div>

          {/* 评论 */}
          <div
            className="detail-action-btn"
            onClick={() => Toast.show({ content: '评论区需要登录后参与', duration: 1.2 })}
          >
            <Comment width={20} height={20} />
            <span className="detail-action-count">{detail?.interactInfo?.commentCount || '评论'}</span>
          </div>

          {/* 分享 */}
          <div
            className="detail-action-btn"
            onClick={() => {
              if (navigator.clipboard) {
                void navigator.clipboard.writeText(window.location.href)
              }
              Toast.show({ content: '链接已复制', duration: 1.2 })
            }}
          >
            <Share width={20} height={20} />
            <span className="detail-action-count">{detail?.interactInfo?.shareCount || '分享'}</span>
          </div>
        </div>
      </div>
    </Popup>
  )
}
