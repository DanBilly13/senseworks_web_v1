import Image from 'next/image'
import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import { urlFor } from '@/lib/sanity/image'
import type { MediaField } from '@/lib/sanity/media'

type MediaBlockProps = {
  media?: MediaField
}

// Sanity image asset IDs encode their pixel dimensions in the ref itself
// (e.g. "image-<hash>-3240x1818-webp") — reading them here avoids a
// separate GROQ projection just to get width/height for the aspect ratio
// below.
function readImageDimensions(media: MediaField): { width: number; height: number } | null {
  const ref = (media?.image as { asset?: { _ref?: string } } | undefined)?.asset?._ref
  const match = ref?.match(/-(\d+)x(\d+)-/)
  if (!match) return null
  return { width: Number(match[1]), height: Number(match[2]) }
}

export function MediaBlock({ media }: MediaBlockProps) {
  const hasImage = media?.mediaType === 'image' && !!media.image
  const dimensions = hasImage ? readImageDimensions(media) : null

  // Unlike most blocks, this one has no content besides the media itself,
  // so it always renders. The gradient lives on this outer frame so it
  // stays visible in the margins around the image below, not just while
  // empty.
  return (
    <SectionShell>
      <div className="bg-accent-gradient relative aspect-media w-full overflow-hidden rounded-lg">
        {hasImage && dimensions ? (
          // Full width at its own aspect ratio (not cropped/scaled to
          // cover) — equal padding on three sides only, so it's flush
          // with and cropped by the frame's own bottom edge.
          <div className="p-2xl pb-0">
            <Image
              src={urlFor(media.image!).url()}
              alt={media?.alt ?? ''}
              width={dimensions.width}
              height={dimensions.height}
              sizes="100vw"
              className="h-auto w-full"
            />
          </div>
        ) : (
          <Media media={media} alt={media?.alt ?? ''} className="size-full" />
        )}
      </div>
    </SectionShell>
  )
}
