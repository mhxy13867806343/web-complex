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
import type { CommentItem, Note, NoteDetailData } from '../data'
import { fetchNoteComments, fetchNoteDetail } from '../data/api'
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
 * 1. 真实视频播放（videoUrl）与防盗链直链代理
 * 2. 多图轮播切换（imageList）：手势滑动、左右翻页、2/5 角标、底部圆点指示器、自动轮播
 * 3. 真实正文内容（desc）与话题标签（tags）
 * 4. 真实互动数据：点赞数（likes: "787"）、收藏、分享
 * 5. 真实评论区（comments）：头像、昵称、评论内容、时间属地、主回复嵌套、点赞互动
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

  // 评论相关
  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentsCount, setCommentsCount] = useState(0)
  const [inputComment, setInputComment] = useState('')
  const [replyTarget, setReplyTarget] = useState('')
  const commentsSectionRef = useRef<HTMLDivElement>(null)

  // 轮播控制
  const touchStart = useRef({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const isTouching = useRef(false)

  useEffect(() => {
    if (!note) {
      setDetail(null)
      setComments([])
      setCommentsCount(0)
      setCurrentImgIndex(0)
      setLiked(false)
      setLikeDelta(0)
      setFollowing(false)
      setInputComment('')
      setReplyTarget('')
      return
    }

    setCurrentImgIndex(0)
    setLiked(false)
    setLikeDelta(0)
    setFollowing(false)
    setLoadingDetail(true)

    const ac = new AbortController()

    // 并行请求详情与评论
    Promise.all([
      fetchNoteDetail(note.id, note.noteUrl, ac.signal),
      fetchNoteComments(note.id, note.title, ac.signal),
    ])
      .then(([detailRes, commentsRes]) => {
        setDetail(detailRes)
        setComments(commentsRes.comments)
        setCommentsCount(commentsRes.count || commentsRes.comments.length)
      })
      .catch(() => {
        /* 保持优雅降级 */
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

  // 评论点赞交互
  const toggleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const nextLiked = !c.liked
          const num = parseInt(c.likes.replace(/[^\d]/g, ''), 10) || 10
          return {
            ...c,
            liked: nextLiked,
            likes: nextLiked ? `${num + 1}` : `${Math.max(0, num - 1)}`,
          }
        }
        return c
      })
    )
  }

  const toggleSubCommentLike = (commentId: string, subId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId && c.subComments) {
          return {
            ...c,
            subComments: c.subComments.map((sub) => {
              if (sub.id === subId) {
                const nextLiked = !sub.liked
                const num = parseInt(sub.likes.replace(/[^\d]/g, ''), 10) || 10
                return {
                  ...sub,
                  liked: nextLiked,
                  likes: nextLiked ? `${num + 1}` : `${Math.max(0, num - 1)}`,
                }
              }
              return sub
            }),
          }
        }
        return c
      })
    )
  }

  // 发送评论
  const submitComment = () => {
    const text = inputComment.trim()
    if (!text) return
    const newComment: CommentItem = {
      id: `user_${Date.now()}`,
      user: {
        name: '我',
        avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/6497121fbbeea8114fed42bd.jpg',
      },
      content: replyTarget ? `@${replyTarget} ${text}` : text,
      time: '刚刚',
      location: '广东',
      likes: '0',
      subComments: [],
    }
    setComments((prev) => [newComment, ...prev])
    setCommentsCount((c) => c + 1)
    setInputComment('')
    setReplyTarget('')
    Toast.show({ content: '评论已发布', duration: 1.2 })
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
          {/* 顶部媒体区：视频直接播放 / 图集多图轮播（含 2/5、小圆点、自动滚动） */}
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
                    <button
                      className="carousel-arrow carousel-arrow-left"
                      onClick={() => setCurrentImgIndex((i) => (i - 1 + images.length) % images.length)}
                      aria-label="上一张"
                    >
                      <ArrowLeft width={16} height={16} />
                    </button>
                    <button
                      className="carousel-arrow carousel-arrow-right"
                      onClick={() => setCurrentImgIndex((i) => (i + 1) % images.length)}
                      aria-label="下一张"
                    >
                      <ArrowRight width={16} height={16} />
                    </button>

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

          {/* 真实评论区（完全还原截图视觉） */}
          <div className="detail-comments-wrap" ref={commentsSectionRef}>
            <div className="comments-header">
              共 {commentsCount} 条评论
            </div>

            <div className="comments-list">
              {comments.map((item) => (
                <div className="comment-thread" key={item.id}>
                  {/* 主评论 */}
                  <div className="comment-item">
                    <img className="comment-avatar" src={item.user.avatar} alt="" referrerPolicy="no-referrer" />
                    <div className="comment-content-area">
                      <div className="comment-author-name">{item.user.name}</div>
                      <div className="comment-text">{item.content}</div>
                      <div className="comment-meta">
                        <span className="comment-date-loc">{item.time} {item.location}</span>
                        <div className="comment-meta-actions">
                          <span
                            className={`comment-like-btn${item.liked ? ' liked' : ''}`}
                            onClick={() => toggleCommentLike(item.id)}
                          >
                            {item.liked ? <HeartFill width={14} height={14} color="#ff2442" /> : <Heart width={14} height={14} />}
                            <span className="comment-like-count">{item.likes}</span>
                          </span>
                          <span
                            className="comment-reply-btn"
                            onClick={() => {
                              setReplyTarget(item.user.name)
                              Toast.show({ content: `回复 @${item.user.name}`, duration: 1 })
                            }}
                          >
                            <Comment width={14} height={14} />
                            <span>{item.subComments?.length ? item.subComments.length : '回复'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 子评论（楼中楼回复） */}
                  {item.subComments && item.subComments.length > 0 && (
                    <div className="sub-comments-list">
                      {item.subComments.map((sub) => (
                        <div className="comment-item sub-comment-item" key={sub.id}>
                          <img className="comment-avatar sub-avatar" src={sub.user.avatar} alt="" referrerPolicy="no-referrer" />
                          <div className="comment-content-area">
                            <div className="comment-author-name">{sub.user.name}</div>
                            <div className="comment-text">{sub.content}</div>
                            <div className="comment-meta">
                              <span className="comment-date-loc">{sub.time} {sub.location}</span>
                              <div className="comment-meta-actions">
                                <span
                                  className={`comment-like-btn${sub.liked ? ' liked' : ''}`}
                                  onClick={() => toggleSubCommentLike(item.id, sub.id)}
                                >
                                  {sub.liked ? <HeartFill width={13} height={13} color="#ff2442" /> : <Heart width={13} height={13} />}
                                  <span className="comment-like-count">{sub.likes}</span>
                                </span>
                                <span
                                  className="comment-reply-btn"
                                  onClick={() => {
                                    setReplyTarget(sub.user.name)
                                    Toast.show({ content: `回复 @${sub.user.name}`, duration: 1 })
                                  }}
                                >
                                  <Comment width={13} height={13} />
                                  <span>回复</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部真实互动栏：输入框、点赞数（likes: "787"）、收藏、评论直达、分享 */}
        <div className="detail-bar">
          <div className="detail-input-wrap">
            <input
              className="detail-input"
              type="text"
              placeholder={replyTarget ? `回复 @${replyTarget}…` : '说点什么…'}
              value={inputComment}
              onChange={(e) => setInputComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitComment()
              }}
            />
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

          {/* 评论按钮，点击平滑滚动到底部评论区 */}
          <div
            className="detail-action-btn"
            onClick={() => {
              commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <Comment width={20} height={20} />
            <span className="detail-action-count">{commentsCount || detail?.interactInfo?.commentCount || '评论'}</span>
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
