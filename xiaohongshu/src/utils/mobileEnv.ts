const STORAGE_KEY = 'xhs_mobile_page'

/** 以设备环境判断：手机 UA 直接进页面，桌面浏览器先弹窗确认 */
export function isMobileEnvironment() {
  if (typeof window === 'undefined') return true
  const ua = navigator.userAgent || ''
  return /Android|iPhone|iPad|iPod|Mobile|HarmonyOS/i.test(ua)
}

export function hasEnteredMobilePage() {
  if (typeof window === 'undefined') return false
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return true
  } catch {
    /* ignore */
  }
  return new URLSearchParams(window.location.search).get('view') === 'mobile'
}

export function markMobilePage() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
  document.documentElement.classList.add('xhs-mobile-page')
}

export function clearMobilePageMark() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function applyMobilePageClass() {
  if (typeof document === 'undefined') return
  if (isMobileEnvironment() || hasEnteredMobilePage()) {
    document.documentElement.classList.add('xhs-mobile-page')
  }
}
