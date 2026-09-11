'use client'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { urlFor } from '@/lib/sanity/image'
import type { MediaAlign, MediaField } from '@/lib/sanity/media'
import type { ReactNode } from 'react'
import { ANIMATION_COMPONENTS, type AnimationName } from '@/components/animations'
import { ScaledCanvas } from '@/components/animations/ScaledCanvas'

// Lazy-loaded: lottie-web (lottie-react's underlying engine) probes
// canvas support as a side effect of being imported at all, which
// both crashes under jsdom (no real canvas) and would otherwise ship
// the whole animation engine to every page using Media, even ones
// that never render a Lottie asset. Deferring the import until a
// Lottie media item actually renders avoids both.
const Lottie = dynamic(() => import('lottie-react').then((mod) => mod.Lottie), { ssr: false })

// Video/Lottie always fill the frame edge-to-edge — Scale/Position in
// the Sanity `media` object only apply to images and React animations
// (see objects/media.ts). This maps `align` to a flex anchor for the
// box those two render inside once Scale takes them below 100%.
const ALIGN_CLASSES: Record<MediaAlign, string> = {
  center: 'items-center justify-center',
  top: 'items-start justify-center',
  bottom: 'items-end justify-center',
  left: 'items-center justify-start',
  right: 'items-center justify-end',
}

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
  const animationEntry =
    media?.mediaType === 'reactAnimation' && media.animation
      ? ANIMATION_COMPONENTS[media.animation as AnimationName]
      : undefined
  const hasAsset =
    (media?.mediaType === 'image' && !!media.image) ||
    (media?.mediaType === 'video' && !!media.videoUrl) ||
    (media?.mediaType === 'lottie' && !!media.lottieUrl) ||
    !!animationEntry

  const fitClassName = fit === 'contain' ? 'object-contain' : 'object-cover'

  // Only image and reactAnimation honor Scale/Position — video and
  // Lottie always fill the frame (see objects/media.ts).
  const scale = media?.mediaType === 'image' || media?.mediaType === 'reactAnimation' ? (media.scale ?? 100) : 100
  const alignClassName = ALIGN_CLASSES[media?.align ?? 'center']

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
        scale === 100 ? (
          <Image
            src={urlFor(media.image).url()}
            alt={resolvedAlt}
            fill
            sizes={sizes ?? '100vw'}
            className={`size-full ${fitClassName}`}
          />
        ) : (
          // Below 100%, the image is a sized box anchored within the
          // frame rather than edge-to-edge — object-contain so it's
          // never cropped, matching the point of scaling it down.
          <div className={`absolute inset-0 flex ${alignClassName}`}>
            <div className="relative" style={{ width: `${scale}%`, height: `${scale}%` }}>
              <Image
                src={urlFor(media.image).url()}
                alt={resolvedAlt}
                fill
                sizes={sizes ?? '100vw'}
                className="size-full object-contain"
              />
            </div>
          </div>
        )
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
      {/* Centered by default, not stretched. Scale shrinks the box the
          animation fills, and Position moves that box's anchor within
          the frame. A fixed-canvas animation (has `canvas` metadata)
          renders inside ScaledCanvas, which scales its whole authored
          composition — including any deliberate crop — to fit that
          box; anything else (e.g. UploadQueueLoop's own flexible
          panel) renders at its own intrinsic, already-responsive
          size. */}
      {animationEntry && (
        <div className={`absolute inset-0 flex ${alignClassName}`} aria-hidden="true">
          <div style={{ width: `${scale}%` }}>
            {animationEntry.canvas ? (
              <ScaledCanvas canvasWidth={animationEntry.canvas.width} canvasHeight={animationEntry.canvas.height}>
                <animationEntry.component />
              </ScaledCanvas>
            ) : (
              <animationEntry.component />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
