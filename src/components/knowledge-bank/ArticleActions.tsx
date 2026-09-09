'use client'
import { useState } from 'react'
import { LikeFilled, LikeOutlined, ShareAltOutlined } from '@ant-design/icons'
import { IconButton } from '@/components/ui/IconButton'
import { useLike } from './LikeProvider'

// Note on scope: Like is a per-visitor toggle (via LikeProvider,
// localStorage-backed) — not a shared, cross-visitor count. A real
// shared counter needs a write path back to Sanity (an API route with
// a write-scoped token), which is a deliberate follow-up decision
// (where that token lives, e.g. Vercel project env vars — never
// .env.local, which stays public-identifiers-only per this repo's
// convention) rather than something to bolt on quietly here.
export function ArticleActions() {
  const { liked, toggleLike } = useLike()
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ url })
      } catch {
        // User cancelled the native share sheet — not an error.
      }
      return
    }
    await navigator.clipboard.writeText(url)
    setShareStatus('copied')
    setTimeout(() => setShareStatus('idle'), 2000)
  }

  return (
    <div className="flex items-center gap-small">
      <IconButton
        icon={liked ? <LikeFilled /> : <LikeOutlined />}
        active={liked}
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike this article' : 'Like this article'}
      />
      <IconButton
        icon={<ShareAltOutlined />}
        onClick={share}
        aria-label="Share this article"
        label={shareStatus === 'copied' ? 'Copied!' : undefined}
      />
    </div>
  )
}
