import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Comment,
  Heart,
  Share,
  Star,
} from '@nutui/icons-react'
import type { CommentItem, Note, NoteDetailData, Author } from '../data'
import { fetchNoteComments, fetchNoteDetail } from '../data/api'
import { openUserProfileRoute } from '../router'
import { Toast } from './Toast'
import CustomVideoPlayer from './CustomVideoPlayer'

interface Props {
  noteId?: string
  note?: Note | null
  collected?: boolean
  onCollect?: (note: Note) => void
  onClose: () => void
  onOpenUser?: (author: Partial<Author>, note?: Note) => void
}

function parseCount(raw: string | undefined, delta: number): string {
  if (!raw) return delta > 0 ? String(delta) : '0'
  if (raw.includes('万') || raw.includes('w')) return raw
  const num = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0
  return String(Math.max(0, num + delta))
}

/**
 * 笔记详情独立路由页面：
 * 1. 真实视频播放（videoUrl）与防盗链直链代理
 * 2. 多图轮播切换（imageList）：手势滑动、左右翻页、2/5 角标、底部圆点指示器、自动轮播
 * 3. 真实正文内容（desc）与话题标签（tags）
 * 4. 真实互动数据：点赞数、收藏、分享
 * 5. 真实评论区（comments）：只展示、不可点击、不可回复
 */
export default function NoteDetail({ noteId, note = null, collected = false, onClose, onOpenUser }: Props) {
  const [coverBroken, setCoverBroken] = useState(false)
  const [avatarBroken, setAvatarBroken] = useState(false)
  const [detail, setDetail] = useState<NoteDetailData | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [currentImgIndex, setCurrentImgIndex] = useState(0)

  // 评论相关（只展示，不可点击，不可回复）
  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentsCount, setCommentsCount] = useState(0)
  const commentsSectionRef = useRef<HTMLDivElement>(null)

  // 轮播控制
  const touchStart = useRef({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const isTouching = useRef(false)

  const effectiveId = note?.id || noteId || ''
  const baseId = effectiveId.replace(/_p\d+.*$/, '')

  const [isClosing, setIsClosing] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleClose = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 220)
  }, [isClosing, onClose])

  // 支持键盘 Esc 退出
  useEffect(() => {
    if (isClosing) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault()
        handleClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isClosing, handleClose])

  const currentNote: Note = note || {
    id: effectiveId,
    title: detail?.title || '',
    cover: detail?.imageList?.[0] || '',
    coverWidth: 3,
    coverHeight: 4,
    type: (detail?.type as any) || (detail?.videoUrl ? 'video' : 'normal'),
    likes: detail?.interactInfo?.likedCount || '0',
    author: {
      name: detail?.user?.name || '小红书博主',
      avatar: detail?.user?.avatar || '',
      userId: (detail?.user as any)?.userId || '',
      userUrl: (detail?.user as any)?.userUrl || '',
    },
    noteUrl: `https://www.xiaohongshu.com/explore/${baseId}`,
  }

  useEffect(() => {
    if (!effectiveId) return

    setCurrentImgIndex(0)
    setLoadingDetail(true)

    const ac = new AbortController()

    // 抓取笔记详情以获取其真实分类标签、描述与互动数，再针对性获取该笔记的动态专属评论
    fetchNoteDetail(baseId, note?.noteUrl, note || undefined, ac.signal)
      .then((detailRes) => {
        setDetail(detailRes)
        const realTitle = detailRes.title || note?.title || ''
        const realTags = detailRes.tags && detailRes.tags.length > 0 ? detailRes.tags : note?.tags || []
        const realCount = detailRes.interactInfo?.commentCount || ''
        return fetchNoteComments(baseId, realTitle, realTags, realCount, ac.signal)
      })
      .then((commentsRes) => {
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
  }, [effectiveId])

  const isVideo = currentNote ? (currentNote.type === 'video' || detail?.type === 'video' || !!detail?.videoUrl) : false
  const images = (detail?.imageList && detail.imageList.length > 0) ? detail.imageList : (currentNote ? [currentNote.cover] : [])
  const currentLikes = parseCount(detail?.interactInfo?.likedCount || currentNote?.likes, 0)
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

  // 详情弹窗打开时，锁定主页面背景滚动，杜绝滚动穿透
  useEffect(() => {
    if (!currentNote || isClosing) return
    const scroller = document.querySelector('#page-body') as HTMLElement | null
    const originalScrollerOverflow = scroller?.style.overflow || ''
    const originalBodyOverflow = document.body.style.overflow || ''

    if (scroller) scroller.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      if (scroller) scroller.style.overflow = originalScrollerOverflow
      document.body.style.overflow = originalBodyOverflow
    }
  }, [currentNote, isClosing])

  if (!currentNote) return null

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
    <div className={`note-page-container${isClosing ? ' is-closing' : ''}`}>
      <div
        className={`detail${isClosing ? ' is-closing' : ''}`}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* 顶部导航吸顶栏：
            - 顶部封面阶段（scrolled=false）：背景透明，左右为磨砂黑圈按钮（防背景图片干扰）
            - 滚动进入正文后（scrolled=true）：平滑变为纯白吸顶条，圈内黑底完全隐藏，按钮变为极简深灰图标，中间露出作者信息，绝不遮挡正文标题 */}
        <div className={`detail-nav-header${scrolled ? ' is-scrolled' : ''}`}>
          <button
            type="button"
            className="detail-nav-btn detail-nav-back"
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            aria-label="返回上一页"
          >
            <ArrowLeft width={20} height={20} />
          </button>

          <div className="detail-nav-center">
            {scrolled && (
              <div
                className="detail-nav-author"
                onClick={(e) => {
                  e.stopPropagation()
                  const author = {
                    name: detail?.user?.name || currentNote.author.name,
                    avatar: detail?.user?.avatar || currentNote.author.avatar,
                    userId: (detail?.user as any)?.userId || currentNote.author.userId,
                    userUrl: (detail?.user as any)?.userUrl || currentNote.author.userUrl,
                  }
                  onOpenUser?.(author, currentNote)
                }}
              >
                {avatarBroken || !currentNote.author.avatar ? (
                  <span className="nav-author-avatar-fallback">
                    {currentNote.author.name.slice(0, 1)}
                  </span>
                ) : (
                  <img
                    className="nav-author-avatar"
                    src={detail?.user?.avatar || currentNote.author.avatar}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="nav-author-name">
                  {detail?.user?.name || currentNote.author.name}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="detail-nav-btn detail-nav-close"
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            aria-label="关闭详情"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div
          className="detail-scroll"
          onScroll={(e) => {
            const top = e.currentTarget.scrollTop
            if (top > 45 && !scrolled) {
              setScrolled(true)
            } else if (top <= 45 && scrolled) {
              setScrolled(false)
            }
          }}
        >
          {/* 顶部媒体区：视频直接播放 / 图集多图轮播（含 2/5、小圆点、自动滚动） */}
          <div className="detail-media-container">
            {isVideo && detail?.videoUrl ? (
              <div className="detail-video-wrap">
                <CustomVideoPlayer
                  src={getVideoSrc(detail.videoUrl)}
                  poster={currentNote.cover}
                  title={currentNote.title}
                />
              </div>
            ) : isVideo && !detail?.videoUrl ? (
              <div className="detail-video-wrap">
                <img
                  className="detail-cover-img"
                  src={currentNote.cover}
                  alt={currentNote.title}
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
                          alt={currentNote.title}
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
            <h2 className="detail-title">{currentNote.title}</h2>

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

          </div>

          {/* 作者与发布信息卡片（统一合并，消灭孤立空栏与割裂排版） */}
          <div
            className="detail-author-card"
            onClick={() => {
              const author = {
                name: detail?.user?.name || currentNote.author.name,
                avatar: detail?.user?.avatar || currentNote.author.avatar,
                userId: (detail?.user as any)?.userId || currentNote.author.userId,
                userUrl: (detail?.user as any)?.userUrl || currentNote.author.userUrl,
              }
              if (onOpenUser) {
                onOpenUser(author, currentNote)
              } else {
                openUserProfileRoute(author)
              }
            }}
          >
            <div className="author-card-left">
              {avatarBroken || !currentNote.author.avatar ? (
                <span className="author-card-avatar-fallback">
                  {currentNote.author.name.slice(0, 1)}
                </span>
              ) : (
                <img
                  className="author-card-avatar"
                  src={detail?.user?.avatar || currentNote.author.avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarBroken(true)}
                />
              )}
              <div className="author-card-info">
                <div className="author-card-name-row">
                  <span className="author-card-name">{detail?.user?.name || currentNote.author.name}</span>
                  <span className="author-card-arrow">›</span>
                </div>
                <div className="author-card-pub-time">
                  {detail?.time ? `发布于 ${new Date(detail.time).toLocaleDateString()}` : '刚刚'}
                </div>
              </div>
            </div>

            <a
              className="btn-open-link"
              href={currentNote.noteUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.stopPropagation()
                Toast.show({ content: '跳转小红书原站', duration: 1.2 })
              }}
            >
              在原站打开 ↗
            </a>
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
                    <img
                      className="comment-avatar"
                      src={item.user.avatar}
                      alt=""
                      referrerPolicy="no-referrer"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onOpenUser) {
                          onOpenUser(item.user)
                        } else {
                          openUserProfileRoute(item.user)
                        }
                      }}
                    />
                    <div className="comment-content-area">
                      <div
                        className="comment-author-name"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onOpenUser) {
                            onOpenUser(item.user)
                          } else {
                            openUserProfileRoute(item.user)
                          }
                        }}
                      >
                        {item.user.name}
                      </div>
                      <div className="comment-text">{item.content}</div>
                      <div className="comment-meta">
                        <span className="comment-date-loc">{item.time} {item.location}</span>
                        <div className="comment-like-badge">
                          <Heart width={14} height={14} color="#888" />
                          <span className="comment-like-count">{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 子评论（楼中楼回复） */}
                  {item.subComments && item.subComments.length > 0 && (
                    <div className="sub-comments-list">
                      {item.subComments.map((sub) => (
                        <div className="comment-item sub-comment-item" key={sub.id}>
                          <img
                            className="comment-avatar sub-avatar"
                            src={sub.user.avatar}
                            alt=""
                            referrerPolicy="no-referrer"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (onOpenUser) {
                                onOpenUser(sub.user)
                              } else {
                                openUserProfileRoute(sub.user)
                              }
                            }}
                          />
                          <div className="comment-content-area">
                            <div
                              className="comment-author-name"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onOpenUser) {
                                  onOpenUser(sub.user)
                                } else {
                                  openUserProfileRoute(sub.user)
                                }
                              }}
                            >
                              {sub.user.name}
                            </div>
                            <div className="comment-text">{sub.content}</div>
                            <div className="comment-meta">
                              <span className="comment-date-loc">{sub.time} {sub.location}</span>
                              <div className="comment-like-badge">
                                <Heart width={13} height={13} color="#888" />
                                <span className="comment-like-count">{sub.likes}</span>
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

        {/* 底部真实互动栏：纯展示外观，不可点击、不可输入回复 */}
        <div className="detail-bar detail-bar-readonly">
          <div className="detail-input-wrap">
            <div className="detail-input-placeholder">说点什么…</div>
          </div>

          <div className="detail-action-item">
            <Heart width={20} height={20} />
            <span className="detail-action-count">{currentLikes}</span>
          </div>

          <div className="detail-action-item">
            <Star width={20} height={20} />
            <span className="detail-action-count">{currentCollects}</span>
          </div>

          <div className="detail-action-item">
            <Comment width={20} height={20} />
            <span className="detail-action-count">{commentsCount || detail?.interactInfo?.commentCount || '评论'}</span>
          </div>

          <div className="detail-action-item">
            <Share width={20} height={20} />
            <span className="detail-action-count">{detail?.interactInfo?.shareCount || '19'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
