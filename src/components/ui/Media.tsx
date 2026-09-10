'use client'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { urlFor } from '@/lib/sanity/image'
import type { MediaField } from '@/lib/sanity/media'
import type { ReactNode } from 'react'
import { ANIMATION_COMPONENTS, type AnimationName } from '@/components/animations'

// Lazy-loaded: lottie-web (lottie-react's underlying engine) probes
// canvas support as a side effect of being imported at all, which
// both crashes under jsdom (no real canvas) and would otherwise ship
// the whole animation engine to every page using Media, even ones
// that never render a Lottie asset. Deferring the import until a
// Lottie media item actually renders avoids both.
const Lottie = dynamic(() => import('lottie-react').then((mod) => mod.Lottie), { ssr: false })

type MediaProps = {
  media?: MediaField
  alt: string
  className: string
  fit?: 'cover' | 'contain'
  sizes?: string
  fallback?: ReactNode
  ariaHidden?: boolean
  // 'none' opts out of the placeholder fill — e.g. a logo mark that
  // should sit directly on the page, not look like a card.
  background?: 'gradient' | 'none'
}

export function Media({
  media,
  alt,
  className,
  fit = 'cover',
  sizes,
  fallback,
  ariaHidden,
  background = 'gradient',
}: MediaProps) {
  const resolvedAlt = media?.alt || alt
  const AnimationComponent =
    media?.mediaType === 'reactAnimation' && media.animation
      ? ANIMATION_COMPONENTS[media.animation as AnimationName]
      : undefined
  const hasAsset =
    (media?.mediaType === 'image' && !!media.image) ||
    (media?.mediaType === 'video' && !!media.videoUrl) ||
    (media?.mediaType === 'lottie' && !!media.lottieUrl) ||
    !!AnimationComponent

  const fitClassName = fit === 'contain' ? 'object-contain' : 'object-cover'

  return (
    <div
      className={`relative overflow-hidden ${background === 'gradient' ? 'bg-accent-gradient' : ''} ${className}`}
      role={hasAsset ? undefined : 'img'}
      aria-label={hasAsset ? undefined : resolvedAlt}
      aria-hidden={ariaHidden || undefined}
    >
      {!hasAsset && fallback && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {fallback}
        </div>
      )}
      {media?.mediaType === 'image' && media.image && (
        <Image
          src={urlFor(media.image).url()}
          alt={resolvedAlt}
          fill
          sizes={sizes ?? '100vw'}
          className={`size-full ${fitClassName}`}
        />
      )}
      {media?.mediaType === 'video' && media.videoUrl && (
        <video
          src={media.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          aria-label={resolvedAlt}
          className={`absolute inset-0 size-full ${fitClassName}`}
        />
      )}
      {media?.mediaType === 'lottie' && media.lottieUrl && (
        <Lottie src={media.lottieUrl} autoplay loop className="absolute inset-0 size-full" />
      )}
      {/* Centered, not stretched — an animation has its own intrinsic
          size (usually smaller than this box), unlike image/video
          which are meant to fill it edge to edge. */}
      {AnimationComponent && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <AnimationComponent />
        </div>
      )}
    </div>
  )
}
