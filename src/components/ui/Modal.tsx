'use client'
import { useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children?: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-medium-large"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-prose-sm flex-col gap-medium rounded-lg bg-background p-large"
      >
        <div className="flex items-center justify-between gap-medium">
          {title && <h3 className="text-h4 font-semibold text-foreground">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-large items-center justify-center rounded-full text-foreground hover:bg-muted"
          >
            <CloseOutlined />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
