import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Toast } from '@nutui/nutui-react'

interface Props {
  src: string
  poster?: string
  title?: string
  onLike?: () => void
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function CustomVideoPlayer({ src, poster, title, onLike }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [rateOpen, setRateOpen] = useState(false)
  const [volumeOpen, setVolumeOpen] = useState(false)
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])

  const hideControlsTimer = useRef<number | null>(null)
  const longPressTimer = useRef<number | null>(null)
  const lastTapTime = useRef(0)
  const isDraggingProgress = useRef(false)
  const menuOpenRef = useRef(false)

  const RATES = [0.75, 1, 1.25, 1.5, 2]

  // 自动隐藏控制栏
  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideControlsTimer.current) {
      window.clearTimeout(hideControlsTimer.current)
    }
    if (isPlaying && !isDraggingProgress.current && !menuOpenRef.current) {
      hideControlsTimer.current = window.setTimeout(() => {
        setShowControls(false)
      }, 2500)
    }
  }, [isPlaying])

  useEffect(() => {
    resetHideTimer()
    return () => {
      if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current)
    }
  }, [resetHideTimer])

  // 播放 / 暂停切换
  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    } else {
      v.pause()
      setIsPlaying(false)
      setShowControls(true)
    }
  }, [])

  const closeMenus = () => {
    menuOpenRef.current = false
    setRateOpen(false)
    setVolumeOpen(false)
  }

  const openMenu = (which: 'rate' | 'volume') => {
    const nextRate = which === 'rate' ? !rateOpen : false
    const nextVolume = which === 'volume' ? !volumeOpen : false
    menuOpenRef.current = nextRate || nextVolume
    setRateOpen(nextRate)
    setVolumeOpen(nextVolume)
    setShowControls(true)
    if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current)
  }

  const selectRate = (rate: number) => {
    const v = videoRef.current
    if (!v) return
    v.playbackRate = rate
    setPlaybackRate(rate)
    closeMenus()
    Toast.show({ content: `${rate}x 倍速播放`, duration: 1 })
    resetHideTimer()
  }

  const selectVolume = (next: number) => {
    const v = videoRef.current
    if (!v) return
    const value = Math.min(1, Math.max(0, next))
    v.volume = value
    v.muted = value === 0
    setVolume(value)
    setIsMuted(value === 0)
  }

  // 全屏切换
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const c = containerRef.current
    if (!c) return
    if (!document.fullscreenElement) {
      c.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
    resetHideTimer()
  }

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  // 双击点赞动画触发
  const triggerHeart = (clientX: number, clientY: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const newHeart = { id: Date.now() + Math.random(), x, y }
    setHearts((prev) => [...prev, newHeart])
    onLike?.()
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id))
    }, 900)
  }

  // 处理单击 / 双击仲裁
  const handleVideoAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (menuOpenRef.current) {
      closeMenus()
      resetHideTimer()
      return
    }
    const now = Date.now()
    if (now - lastTapTime.current < 280) {
      // 双击：触发红心点赞
      triggerHeart(e.clientX, e.clientY)
      lastTapTime.current = 0
    } else {
      lastTapTime.current = now
      // 延迟检测单击播放 / 暂停
      setTimeout(() => {
        if (Date.now() - lastTapTime.current >= 280 && lastTapTime.current !== 0) {
          togglePlay()
        }
      }, 280)
    }
  }

  // 长按 2.0x 快进开始
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.video-bottom-bar, button, input')) return
    longPressTimer.current = window.setTimeout(() => {
      const v = videoRef.current
      if (v) {
        v.playbackRate = 2.0
        setIsLongPressing(true)
      }
    }, 450)
  }

  // 长按结束：恢复原倍速
  const handlePointerUp = () => {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    if (isLongPressing) {
      const v = videoRef.current
      if (v) {
        v.playbackRate = playbackRate
      }
      setIsLongPressing(false)
    }
  }

  // 进度条定位
  const seekByRatio = (ratio: number) => {
    const v = videoRef.current
    if (!v || !duration) return
    const target = Math.max(0, Math.min(duration, ratio * duration))
    v.currentTime = target
    setCurrentTime(target)
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const bar = progressBarRef.current
    if (!bar) return
    const rect = bar.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    seekByRatio(ratio)
    resetHideTimer()
  }

  const handleProgressTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    isDraggingProgress.current = true
    setShowControls(true)
    const bar = progressBarRef.current
    if (!bar) return
    const rect = bar.getBoundingClientRect()
    const ratio = (e.touches[0].clientX - rect.left) / rect.width
    seekByRatio(ratio)
  }

  const handleProgressTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const bar = progressBarRef.current
    if (!bar) return
    const rect = bar.getBoundingClientRect()
    const ratio = (e.touches[0].clientX - rect.left) / rect.width
    seekByRatio(ratio)
  }

  const handleProgressTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    isDraggingProgress.current = false
    resetHideTimer()
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={`custom-video-container${isFullscreen ? ' is-fullscreen' : ''}`}
      onMouseMove={resetHideTimer}
      onClick={handleVideoAreaClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={resetHideTimer}
    >
      <video
        ref={videoRef}
        className="custom-video-core"
        src={src}
        poster={poster || undefined}
        title={title}
        controls={false}
        autoPlay
        playsInline
        loop
        onTimeUpdate={() => {
          if (!isDraggingProgress.current && videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration)
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* 长按 2 倍速顶部浮层提示 */}
      {isLongPressing && (
        <div className="video-speedup-badge">
          <span className="speedup-icon">▶▶</span>
          <span>2.0x 快速播放中</span>
        </div>
      )}

      {/* 暂停时中央半透明播放大按钮 */}
      {!isPlaying && (
        <div
          className="video-center-play-btn"
          onClick={(e) => {
            e.stopPropagation()
            togglePlay()
          }}
          aria-label="播放"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
      )}

      {/* 双击点赞飘出的小红书红心 */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="video-doubletap-heart"
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff2442">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      {/* 底部控制栏 */}
      <div
        className={`video-bottom-bar${showControls ? ' visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 交互进度条（支持点击和触摸拖拽） */}
        <div
          ref={progressBarRef}
          className="video-progress-wrap"
          onClick={handleProgressBarClick}
          onTouchStart={handleProgressTouchStart}
          onTouchMove={handleProgressTouchMove}
          onTouchEnd={handleProgressTouchEnd}
        >
          <div className="video-progress-bg">
            <div
              className="video-progress-current"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="video-progress-thumb" />
            </div>
          </div>
        </div>

        {/* 控制条按钮区 */}
        <div className="video-controls-row">
          <div className="video-ctrl-left">
            {/* 播放 / 暂停 */}
            <button
              type="button"
              className="video-ctrl-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1.5" />
                  <rect x="14" y="4" width="4" height="16" rx="1.5" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              )}
            </button>

            {/* 时间显示 */}
            <span className="video-time-label">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="video-ctrl-right">
            <div className="video-pop-anchor">
              {rateOpen && (
                <div className="video-pop-menu" onClick={(e) => e.stopPropagation()}>
                  {RATES.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      className={`video-pop-item${playbackRate === rate ? ' active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        selectRate(rate)
                      }}
                    >
                      {`${rate}x`}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="video-ctrl-btn video-rate-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  openMenu('rate')
                }}
                title="选择倍速"
                aria-label="选择倍速"
                aria-expanded={rateOpen}
              >
                {playbackRate === 1 ? '倍速' : `${playbackRate}x`}
              </button>
            </div>

            <div className="video-pop-anchor">
              {volumeOpen && (
                <div className="video-pop-menu video-volume-menu" onClick={(e) => e.stopPropagation()}>
                  <span className="video-volume-value">{Math.round((isMuted ? 0 : volume) * 100)}</span>
                  <input
                    type="range"
                    className="video-volume-slider"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    aria-label="音量"
                    onChange={(e) => selectVolume(Number(e.target.value))}
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <button
                type="button"
                className="video-ctrl-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  openMenu('volume')
                }}
                title="选择音量"
                aria-label={isMuted ? '音量，当前静音' : '选择音量'}
                aria-expanded={volumeOpen}
              >
                {isMuted || volume === 0 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                  </svg>
                )}
              </button>
            </div>

            {/* 全屏 */}
            <button
              type="button"
              className="video-ctrl-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? '退出全屏' : '全屏'}
            >
              {isFullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6m-6 0l6-6M9 21H3v-6m6 0l-6 6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
