import { useState } from 'react'
import { Dialog } from '@nutui/nutui-react'
import {
  clearMobilePageMark,
  hasEnteredMobilePage,
  isMobileEnvironment,
  markMobilePage,
} from '../utils/mobileEnv'

/**
 * 桌面环境先问是否进入移动端页面。
 * 「是」写入标记并带上 view=mobile 进入移动端布局；
 * 「否」刷新，标记不保留，弹窗会再次出现。
 */
export default function MobileEnvDialog() {
  const [visible, setVisible] = useState(
    () => !isMobileEnvironment() && !hasEnteredMobilePage()
  )

  return (
    <Dialog
      title="提示"
      visible={visible}
      confirmText="是"
      cancelText="否"
      closeOnOverlayClick={false}
      closeIcon={false}
      lockScroll
      onConfirm={() => {
        markMobilePage()
        const url = new URL(window.location.href)
        url.searchParams.set('view', 'mobile')
        window.location.assign(url.toString())
      }}
      onCancel={() => {
        setVisible(true)
        clearMobilePageMark()
        window.location.reload()
      }}
    >
      当前不是移动端环境，是否进入移动端页面？
    </Dialog>
  )
}
