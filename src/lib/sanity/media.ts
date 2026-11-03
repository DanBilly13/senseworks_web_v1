import type { SanityImageSource } from '@sanity/image-url'

export type MediaScale = 100 | 80 | 60
export type MediaAlign = 'center' | 'top' | 'bottom' | 'left' | 'right'

export type MediaField = {
  mediaType?: 'image' | 'video' | 'lottie' | 'reactAnimation'
  alt?: string
  image?: SanityImageSource
  videoUrl?: string
  lottieUrl?: string
  animation?: string
  scale?: MediaScale
  align?: MediaAlign
} | null

// Has a picture actually been chosen? A cleared image field can keep an
// empty image object (no asset), and urlFor() can't build a URL from it.
export function hasImage(image: SanityImageSource | null | undefined): image is SanityImageSource {
  return !!(image as { asset?: { _ref?: string; url?: string } } | null | undefined)?.asset
}

// Is there anything to show? Clearing a picture in Studio leaves the
// media object behind (its type, scale and position) with nothing in it,
// so `if (media)` isn't enough: a block that draws a tint, a taller
// height or a column for its image checks this instead.
export function hasMedia(media: MediaField | undefined): media is NonNullable<MediaField> {
  if (!media) return false
  switch (media.mediaType) {
    case 'image':
      return hasImage(media.image)
    case 'video':
      return !!media.videoUrl
    case 'lottie':
      return !!media.lottieUrl
    case 'reactAnimation':
      return !!media.animation
    default:
      return false
  }
}
