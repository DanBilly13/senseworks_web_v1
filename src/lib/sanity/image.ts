import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Sanity image asset IDs encode their pixel dimensions in the ref
// itself (e.g. "image-<hash>-1752x810-png") — reading them here avoids
// a separate GROQ projection just to get width/height for rendering an
// image at its own real aspect ratio (no crop), rather than guessing
// or forcing it into an unrelated fixed box. Shared by MediaBlock and
// the Knowledge Bank's article images — anywhere a real, uncropped
// aspect ratio matters more than a fixed decorative frame.
export function readImageDimensions(
  image: SanityImageSource | null | undefined,
): { width: number; height: number } | null {
  const ref = (image as { asset?: { _ref?: string } } | null | undefined)?.asset?._ref
  const match = ref?.match(/-(\d+)x(\d+)-/)
  if (!match) return null
  return { width: Number(match[1]), height: Number(match[2]) }
}
