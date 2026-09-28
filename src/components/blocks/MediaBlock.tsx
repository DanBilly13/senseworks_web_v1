import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type MediaBlockProps = {
  media?: MediaField
  eyebrow?: string
  headline?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  align?: 'left' | 'center'
}

export function MediaBlock({ media, eyebrow, headline, body, ctaLabel, ctaHref, align = 'left' }: MediaBlockProps) {
  const hasOverlay = Boolean(eyebrow || headline || body || (ctaLabel && ctaHref))

  // Plain media, no text — the original, still-common case. Scale/
  // Position (on the media object itself, in Studio) let an editor
  // back an image or animation off 100%/cover if they want the
  // frame's gradient showing around it, rather than this block
  // special-casing that layout in code.
  if (!hasOverlay) {
    return (
      <SectionShell>
        <Media media={media} alt={media?.alt ?? ''} className="aspect-media w-full rounded-lg" />
      </SectionShell>
    )
  }

  return (
    <SectionShell>
      {/* Same structure as Hero's "image overlay" layout: an absolute
          media layer, a flat scrim (not directional — keeps light text
          legible regardless of where it sits), then the copy as a
          normal relative sibling on top. This box owns the aspect
          ratio/rounding instead of Media itself, since Media's own
          root is `relative` and can't also take `absolute` from here
          without the two conflicting in the same class list. */}
      <div className="relative aspect-media w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0">
          <Media media={media} alt={headline || media?.alt || ''} className="size-full" />
        </div>
        <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
        <div
          className={[
            // Tripled from px-medium-large/py-large (24px/32px) to
            // 96px on desktop — kept back to the smaller value on
            // mobile (md:), since tripling it there would leave almost
            // no room for the actual text on a narrow screen.
            'relative flex size-full flex-col justify-center p-medium-large md:p-3xl',
            align === 'center' ? 'items-center' : 'items-start',
          ].join(' ')}
        >
          <SectionIntro
            as="h2"
            eyebrow={eyebrow}
            heading={headline}
            body={body}
            align={align}
            maxWidth="md"
            tone="inverse"
            cta={
              ctaLabel &&
              ctaHref && (
                <Button href={ctaHref} variant="filled-light">
                  {ctaLabel}
                </Button>
              )
            }
          />
        </div>
      </div>
    </SectionShell>
  )
}
