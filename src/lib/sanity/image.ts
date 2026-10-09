import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// For CSS mask-image: the same asset URL, routed through this site
// (see the rewrite in next.config.ts) so the browser treats it as
// same-origin and actually applies the mask.
export function maskUrlFor(source: SanityImageSource): string {
  return urlFor(source).url().replace('https://cdn.sanity.io/images/', '/sanity-images/')
}

// One colour slot of an uploaded SVG icon (its black lines, its white
// parts, or its accent), as a mask — see the route handler and svgLayer.
export function iconLayerUrlFor(source: SanityImageSource, layer: 'ink' | 'paper' | 'accent'): string {
  return `${maskUrlFor(source)}?layer=${layer}`
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
