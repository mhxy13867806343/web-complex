import { useEffect, useState } from 'react'
import { ArrowLeft, Loading, Share } from '@nutui/icons-react'
import type { Note, UserProfileData } from '../data'
import { fetchUserProfileApi } from '../data/api'
import { Toast } from './Toast'
import NoteCard from './NoteCard'

interface Props {
  userId: string
  knownNotes?: Note[]
  onBack: () => void
  onOpenNote: (note: Note) => void
}

export default function UserPage({ userId, knownNotes = [], onBack, onOpenNote }: Props) {
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [avatarBroken, setAvatarBroken] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // 进入页面时仅凭 userId 发起真实的 HTTP 请求拉取用户详情数据
  useEffect(() => {
    if (!userId) return
    const ac = new AbortController()
    setLoading(true)

    fetchUserProfileApi(userId, undefined, knownNotes, ac.signal)
      .then((data) => {
        setProfile(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setLoading(false)
      })

    return () => ac.abort()
  }, [userId])

  const handleBack = () => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      onBack()
    }, 240)
  }

  const handleCopyRedId = () => {
    if (profile?.redId && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(profile.redId).catch(() => {})
    }
    Toast.show({ content: `已复制小红书号：${profile?.redId}`, duration: 1.5 })
  }

  const notes = profile?.notes || []
  const leftCol = notes.filter((_, i) => i % 2 === 0)
  const rightCol = notes.filter((_, i) => i % 2 !== 0)

  return (
    <div className={`user-page-container ${isClosing ? 'is-closing' : ''}`}>
      {/* 顶部动态吸顶导航条 */}
      <div className={`user-page-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <button
          type="button"
          className="user-page-nav-btn user-page-back-btn"
          onClick={handleBack}
          aria-label="返回"
        >
          <ArrowLeft width={18} height={18} />
        </button>

        <div className="user-page-nav-title">
          {scrolled && profile && (
            <div className="user-page-nav-preview">
              {!avatarBroken && profile.avatar && (
                <img
                  src={profile.avatar}
                  alt=""
                  className="user-page-nav-avatar"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="user-page-nav-name">{profile.name}</span>
            </div>
          )}
        </div>

        <div className="user-page-nav-actions">
          {profile?.userUrl && (
            <a
              className="user-page-nav-btn"
              href={profile.userUrl}
              target="_blank"
              rel="noreferrer"
              title="在原站打开"
              onClick={() => Toast.show({ content: '跳转小红书原站个人主页', duration: 1.2 })}
            >
              <Share width={16} height={16} />
            </a>
          )}
        </div>
      </div>

      {/* 页面主滚动区 */}
      <div
        className="user-page-scroll"
        onScroll={(e) => {
          const top = e.currentTarget.scrollTop
          if (top > 50 && !scrolled) setScrolled(true)
          else if (top <= 50 && scrolled) setScrolled(false)
        }}
      >
        {loading ? (
          <div className="user-page-loading">
            <Loading className="user-page-spinner" />
            <span>正在加载用户详情…</span>
          </div>
        ) : profile ? (
          <>
            {/* 头部资料卡片 */}
            <div className="user-header-card">
              <div
                className="user-banner-bg"
                style={{
                  backgroundImage: profile.avatar ? `url(${profile.avatar})` : 'none',
                }}
              />
              <div className="user-banner-mask" />

              <div className="user-info-content">
                <div className="user-avatar-row">
                  <div className="user-avatar-wrap">
                    {avatarBroken || !profile.avatar ? (
                      <div className="user-avatar-fallback">
                        {profile.name.slice(0, 1)}
                      </div>
                    ) : (
                      <img
                        className="user-avatar-img"
                        src={profile.avatar}
                        alt={profile.name}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarBroken(true)}
                      />
                    )}
                  </div>
                </div>

                <div className="user-name-row">
                  <h1 className="user-name">{profile.name}</h1>
                  {profile.gender === 'female' && <span className="gender-badge female">♀</span>}
                  {profile.gender === 'male' && <span className="gender-badge male">♂</span>}
                </div>

                <div className="user-id-row">
                  <span className="user-red-id" onClick={handleCopyRedId}>
                    小红书号：{profile.redId}
                    <em className="copy-icon">⎘</em>
                  </span>
                  {profile.ipLocation && (
                    <span className="user-ip-loc">IP属地：{profile.ipLocation}</span>
                  )}
                </div>

                {profile.desc && <div className="user-desc">{profile.desc}</div>}

                {profile.tags && profile.tags.length > 0 && (
                  <div className="user-tags-row">
                    {profile.tags.map((tag, idx) => (
                      <span key={idx} className="user-tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 统计指标 */}
                <div className="user-stats-row">
                  <div className="user-stat-item">
                    <strong className="user-stat-val">{profile.follows}</strong>
                    <span className="user-stat-lbl">关注</span>
                  </div>
                  <div className="user-stat-item">
                    <strong className="user-stat-val">{profile.fans}</strong>
                    <span className="user-stat-lbl">粉丝</span>
                  </div>
                  <div className="user-stat-item">
                    <strong className="user-stat-val">{profile.likedAndCollected}</strong>
                    <span className="user-stat-lbl">获赞与收藏</span>
                  </div>
                </div>

                {/* 原站直跳链接 */}
                <div className="user-official-link-row">
                  <a
                    className="user-official-link"
                    href={profile.userUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => Toast.show({ content: '在浏览器中打开小红书原站主页', duration: 1.2 })}
                  >
                    访问小红书原站个人主页 ↗
                  </a>
                </div>
              </div>
            </div>

            {/* 作品 Tab（仅展示笔记） */}
            <div className="user-tabs-bar">
              <div className="user-tab-item active">
                笔记 <span>{notes.length}</span>
              </div>
            </div>

            {/* 笔记双列瀑布流 */}
            <div className="user-notes-grid">
              {notes.length === 0 ? (
                <div className="user-empty-state">
                  <span>🍠</span>
                  <p>暂无公开笔记</p>
                </div>
              ) : (
                <div className="waterfall">
                  <div className="waterfall-col">
                    {leftCol.map((note) => (
                      <NoteCard key={note.id} note={note} onOpen={onOpenNote} />
                    ))}
                  </div>
                  <div className="waterfall-col">
                    {rightCol.map((note) => (
                      <NoteCard key={note.id} note={note} onOpen={onOpenNote} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="user-page-empty">
            <p>未能获取博主信息</p>
          </div>
        )}
      </div>
    </div>
  )
}
