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
