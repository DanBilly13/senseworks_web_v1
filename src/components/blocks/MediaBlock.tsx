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
          without the two conflicting in the same class list.

          Full-bleed and taller (3:4) on mobile, contained and 7:5 from
          md: up — same "-mx-large cancels SectionShell's own mobile
          px-large" trick as the mobile Hero card (SectionShell's
          default mobile padding — see its own px="default" comment).
          No explicit width utility: a plain block's width:auto already
          expands to fill (or, with the negative margin below,
          overflow) its container — adding w-full here would fight the
          negative margin (both non-auto, over-constrained) instead of
          cooperating with it. */}
      <div className="relative -mx-large aspect-media-portrait overflow-hidden rounded-none md:mx-0 md:aspect-media md:rounded-lg">
        <div className="absolute inset-0">
          <Media media={media} alt={headline || media?.alt || ''} className="size-full" />
        </div>
        <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
        <div
          className={[
            // 32px on mobile (this box is full-bleed, 0 section
            // padding, so this IS the only thing landing the text on
            // the site-wide 32px-from-edge line), tripled to 96px on
            // desktop, as before.
            'relative flex size-full flex-col justify-center p-large md:p-3xl',
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
