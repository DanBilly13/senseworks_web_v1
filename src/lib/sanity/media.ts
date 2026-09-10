import type { SanityImageSource } from '@sanity/image-url'

export type MediaField = {
  mediaType?: 'image' | 'video' | 'lottie' | 'reactAnimation'
  alt?: string
  image?: SanityImageSource
  videoUrl?: string
  lottieUrl?: string
  animation?: string
} | null
