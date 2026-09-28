'use client'
import { useEffect, useState } from 'react'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type PlayOnScrollMediaProps = {
  media?: MediaField
  alt: string
  className: string
  fit?: 'cover' | 'contain'
}

// Holds a video on its first frame until the visitor scrolls the
// page at all, then plays — for a video sitting in normal page flow
// (not visibility-gated like ScrollRevealStage's reveal), so it
// doesn't start decoding/playing before anyone's actually engaged
// with the page. No-op for image/lottie/reactAnimation media — the
// `paused` prop Media accepts only affects native <video>.
export function PlayOnScrollMedia({ media, alt, className, fit }: PlayOnScrollMediaProps) {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    if (hasScrolled) return
    const onScroll = () => setHasScrolled(true)
    window.addEventListener('scroll', onScroll, { passive: true, once: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [hasScrolled])

  return <Media media={media} alt={alt} className={className} fit={fit} paused={!hasScrolled} />
}
