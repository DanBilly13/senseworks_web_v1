'use client'
import { useEffect, useRef, useState } from 'react'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type PlayOnScrollMediaProps = {
  media?: MediaField
  alt: string
  className: string
  fit?: 'cover' | 'contain'
}

// How much of the frame has to be on screen before it starts.
const VISIBLE_SHARE = 0.6

// Holds a video or React animation on its first frame until 60% of it
// is on screen, then plays it (once started it carries on; an
// animation still pauses off screen as usual, see Media) — so a hero's
// showcase starts where the visitor is actually looking at it, rather
// than already part-way through. A frame taller than the window
// counts as in view once it fills 60% of the window instead, or it
// could never start. No-op for image/Lottie media.
export function PlayOnScrollMedia({ media, alt, className, fit }: PlayOnScrollMediaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const windowHeight = entry.rootBounds?.height ?? window.innerHeight
        if (entry.intersectionRatio >= VISIBLE_SHARE || entry.intersectionRect.height >= windowHeight * VISIBLE_SHARE) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])

  return (
    <div ref={ref}>
      <Media media={media} alt={alt} className={className} fit={fit} paused={!inView} />
    </div>
  )
}
