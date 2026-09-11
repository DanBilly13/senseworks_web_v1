import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type MediaBlockProps = {
  media?: MediaField
}

export function MediaBlock({ media }: MediaBlockProps) {
  // Unlike most blocks, this one has no content besides the media
  // itself, so it always renders. Scale/Position (on the media object
  // itself, in Studio) let an editor back an image or animation off
  // 100%/cover if they want the frame's gradient showing around it,
  // rather than this block special-casing that layout in code.
  return (
    <SectionShell>
      <Media media={media} alt={media?.alt ?? ''} className="aspect-media w-full rounded-lg" />
    </SectionShell>
  )
}
