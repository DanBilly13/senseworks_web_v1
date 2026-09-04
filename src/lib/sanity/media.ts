import type { SanityImageSource } from '@sanity/image-url'

export type MediaField = {
  mediaType?: 'image' | 'video' | 'lottie'
  alt?: string
  image?: SanityImageSource
  videoUrl?: string
  lottieUrl?: string
} | null
