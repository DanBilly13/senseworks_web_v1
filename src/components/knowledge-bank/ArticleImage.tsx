import Image from 'next/image'
import type { SanityImageSource } from '@sanity/image-url'
import { urlFor, readImageDimensions } from '@/lib/sanity/image'

// The "new big media item" for articles: unlike the generic `Media`
// component (which force-crops everything into the site's fixed
// --aspect-media box via object-cover), these images — an inherited
// cover banner today, screenshots inline in the body — arrive at
// whatever aspect ratio they were designed at and often carry their
// own baked-in text, so cropping them is actively wrong, not just a
// stylistic choice. This renders at the image's own real ratio (read
// from the asset ref) at full width, no crop.
export function ArticleImage({
  image,
  alt,
  className = '',
}: {
  image: SanityImageSource
  alt: string
  className?: string
}) {
  const dimensions = readImageDimensions(image)
  // No dimensions to size the box with — rather than guess a ratio
  // and risk distorting the image, skip rendering it.
  if (!dimensions) return null

  return (
    <Image
      src={urlFor(image).width(1600).url()}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      sizes="100vw"
      className={`h-auto w-full ${className}`}
    />
  )
}
