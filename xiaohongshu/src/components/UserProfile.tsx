import { useEffect, useState } from 'react'
import { Popup } from '@nutui/nutui-react'
import { ArrowLeft, Share } from '@nutui/icons-react'
import type { Note, UserProfileData } from '../data'
import { Toast } from './Toast'
import NoteCard from './NoteCard'

interface Props {
  profile: UserProfileData | null
  visible: boolean
  onClose: () => void
  onOpenNote: (note: Note) => void
}

export default function UserProfile({ profile, visible, onClose, onOpenNote }: Props) {
  const [activeTab, setActiveTab] = useState<'notes' | 'collects'>('notes')
  const [following, setFollowing] = useState(false)
  const [avatarBroken, setAvatarBroken] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // 每次打开新博主时重置状态
  useEffect(() => {
    if (profile) {
      setFollowing(false)
      setAvatarBroken(false)
      setActiveTab('notes')
      setScrolled(false)
      setIsClosing(false)
    }
  }, [profile?.userId, profile?.name])

  // 锁定主页面背景滚动，避免滚动穿透
  useEffect(() => {
    if (!visible || isClosing) return
    const scroller = document.querySelector('#page-body') as HTMLElement | null
    const originalScrollerOverflow = scroller?.style.overflow || ''
    const originalBodyOverflow = document.body.style.overflow || ''

    if (scroller) scroller.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      if (scroller) scroller.style.overflow = originalScrollerOverflow
      document.body.style.overflow = originalBodyOverflow
    }
  }, [visible, isClosing])

  if (!profile) return null

  const handleClose = () => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 280)
  }

  const handleCopyRedId = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(profile.redId).catch(() => {})
    }
    Toast.show({ content: `已复制小红书号：${profile.redId}`, duration: 1.5 })
  }

  const notes = profile.notes || []
  // 双列瀑布流分列
  const leftCol = notes.filter((_, i) => i % 2 === 0)
  const rightCol = notes.filter((_, i) => i % 2 !== 0)

  return (
    <Popup
      visible={visible}
      position="bottom"
      round
      className={`user-profile-popup ${isClosing ? 'is-closing' : ''}`}
      onClose={handleClose}
      style={{ height: '100%', borderRadius: 0 }}
    >
      <div className="user-profile-container">
        {/* 顶部动态吸顶导航栏 */}
        <div className={`profile-nav-bar ${scrolled ? 'nav-scrolled' : ''}`}>
          <button
            type="button"
            className="profile-nav-btn profile-nav-back"
            onClick={handleClose}
            aria-label="返回"
          >
            <ArrowLeft width={18} height={18} />
          </button>

          <div className="profile-nav-title">
            {scrolled && (
              <div className="profile-nav-user-preview">
                {!avatarBroken && profile.avatar && (
                  <img
                    src={profile.avatar}
                    alt=""
                    className="profile-nav-mini-avatar"
                    referrerPolicy="no-referrer"
                  />
                )}
                <span className="profile-nav-name">{profile.name}</span>
              </div>
            )}
          </div>

          <div className="profile-nav-actions">
            <a
              className="profile-nav-btn profile-nav-link"
              href={profile.userUrl}
              target="_blank"
              rel="noreferrer"
              title="在小红书原站打开主页"
              onClick={() => Toast.show({ content: '跳转小红书原站个人主页', duration: 1.2 })}
            >
              <Share width={16} height={16} />
            </a>
          </div>
        </div>

        {/* 主滚动区 */}
        <div
          className="profile-scroll-body"
          onScroll={(e) => {
            const top = e.currentTarget.scrollTop
            if (top > 50 && !scrolled) setScrolled(true)
            else if (top <= 50 && scrolled) setScrolled(false)
          }}
        >
          {/* 头部背景 Banner 与博主基础信息 */}
          <div className="profile-header-card">
            <div
              className="profile-banner-bg"
              style={{
                backgroundImage: profile.avatar ? `url(${profile.avatar})` : 'none',
              }}
            />
            <div className="profile-banner-mask" />

            <div className="profile-info-content">
              <div className="profile-avatar-row">
                <div className="profile-avatar-wrap">
                  {avatarBroken || !profile.avatar ? (
                    <div className="profile-avatar-fallback">
                      {profile.name.slice(0, 1)}
                    </div>
                  ) : (
                    <img
                      className="profile-avatar-img"
                      src={profile.avatar}
                      alt={profile.name}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarBroken(true)}
                    />
                  )}
                </div>

                <div className="profile-action-buttons">
                  <button
                    type="button"
                    className={`btn-profile-follow ${following ? 'following' : ''}`}
                    onClick={() => {
                      setFollowing(!following)
                      Toast.show({
                        content: !following ? '已关注博主' : '已取消关注',
                        duration: 1.2,
                      })
                    }}
                  >
                    {following ? '已关注' : '+ 关注'}
                  </button>

                  <button
                    type="button"
                    className="btn-profile-msg"
                    onClick={() => Toast.show({ content: '私信对话通道已就绪', duration: 1.2 })}
                  >
                    发消息
                  </button>
                </div>
              </div>

              <div className="profile-name-row">
                <h1 className="profile-name">{profile.name}</h1>
                {profile.gender === 'female' && <span className="gender-badge female">♀</span>}
                {profile.gender === 'male' && <span className="gender-badge male">♂</span>}
              </div>

              <div className="profile-id-row">
                <span className="profile-red-id" onClick={handleCopyRedId}>
                  小红书号：{profile.redId}
                  <em className="copy-icon">⎘</em>
                </span>
                {profile.ipLocation && (
                  <span className="profile-ip-loc">IP属地：{profile.ipLocation}</span>
                )}
              </div>

              {profile.desc && <div className="profile-desc">{profile.desc}</div>}

              {profile.tags && profile.tags.length > 0 && (
                <div className="profile-tags-row">
                  {profile.tags.map((tag, idx) => (
                    <span key={idx} className="profile-tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 获赞/粉丝数据 */}
              <div className="profile-stats-row">
                <div className="profile-stat-item">
                  <strong className="profile-stat-val">{profile.follows}</strong>
                  <span className="profile-stat-lbl">关注</span>
                </div>
                <div className="profile-stat-item">
                  <strong className="profile-stat-val">{profile.fans}</strong>
                  <span className="profile-stat-lbl">粉丝</span>
                </div>
                <div className="profile-stat-item">
                  <strong className="profile-stat-val">{profile.likedAndCollected}</strong>
                  <span className="profile-stat-lbl">获赞与收藏</span>
                </div>
              </div>

              {/* 原站直跳链接 */}
              <div className="profile-official-link-row">
                <a
                  className="profile-official-link"
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

          {/* 内容 Tabs */}
          <div className="profile-tabs-bar">
            <button
              type="button"
              className={`profile-tab-item ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              笔记 <span>{notes.length}</span>
            </button>
            <button
              type="button"
              className={`profile-tab-item ${activeTab === 'collects' ? 'active' : ''}`}
              onClick={() => setActiveTab('collects')}
            >
              收藏
            </button>
          </div>

          {/* 笔记双列瀑布流 */}
          {activeTab === 'notes' && (
            <div className="profile-notes-grid">
              {notes.length === 0 ? (
                <div className="profile-empty-state">
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
          )}

          {/* 收藏 Tab */}
          {activeTab === 'collects' && (
            <div className="profile-empty-state collects-empty">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <p>作者设置了收藏内容仅自己可见</p>
            </div>
          )}
        </div>
      </div>
    </Popup>
  )
}
