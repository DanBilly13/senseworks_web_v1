'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type LikeContextValue = { liked: boolean; toggleLike: () => void }
const LikeContext = createContext<LikeContextValue | null>(null)

// Single source of truth for "liked" so the top and bottom
// ArticleActions instances on the same article page (D-ending-with-
// byline-again) stay in sync — each holding its own local state would
// let one show liked while the other doesn't, from the same click.
export function LikeProvider({
  articleSlug,
  children,
}: {
  articleSlug: string
  children: ReactNode
}) {
  const storageKey = `liked:${articleSlug}`
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    // Deliberately an effect, not lazy useState init: this renders
    // server-side (no window), so the initial paint must match on
    // both server and client to avoid a hydration mismatch — the real
    // value only exists client-side, synced in right after mount.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
      setLiked(window.localStorage.getItem(storageKey) === '1')
    } catch {
      // Private-browsing / storage-blocked contexts just start unliked.
    }
  }, [storageKey])

  function toggleLike() {
    setLiked((prev) => {
      const next = !prev
      try {
        window.localStorage.setItem(storageKey, next ? '1' : '0')
      } catch {
        // Nothing to persist to if storage is unavailable — the
        // toggle still works for the rest of this page view.
      }
      return next
    })
  }

  return <LikeContext.Provider value={{ liked, toggleLike }}>{children}</LikeContext.Provider>
}

export function useLike() {
  const context = useContext(LikeContext)
  if (!context) throw new Error('useLike must be used within a LikeProvider')
  return context
}
