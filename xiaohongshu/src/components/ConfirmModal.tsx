interface ConfirmModalProps {
  visible: boolean
  title?: string
  content: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  theme?: 'light' | 'dark'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  visible,
  title = '提示',
  content,
  confirmText = '确定',
  cancelText = '取消',
  danger = true,
  theme = 'dark',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!visible) return null

  return (
    <div className={`xhs-confirm-backdrop ${theme}`} onClick={onCancel}>
      <div className={`xhs-confirm-card ${theme}`} onClick={(e) => e.stopPropagation()}>
        <div className="xhs-confirm-title">{title}</div>
        <div className="xhs-confirm-content">{content}</div>
        <div className="xhs-confirm-actions">
          <button type="button" className="xhs-confirm-btn cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`xhs-confirm-btn confirm ${danger ? 'danger' : ''}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
