import type { SanityImageSource } from '@sanity/image-url'
import Image from 'next/image'
import { SECTION_GAP_MB_CLASS, SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Button } from '@/components/ui/Button'
import { Media } from '@/components/ui/Media'
import { BAND_BG, type BandSpacing } from '@/components/ui/BandFill'
import { renderNumberedEyebrow } from '@/components/ui/numberedEyebrow'
import { urlFor } from '@/lib/sanity/image'
import { hasImage, type MediaField } from '@/lib/sanity/media'

type Tone = 'none' | 'light' | 'dark' | 'accent' | 'accentGradient' | 'accentDark'
type CardTone = 'white' | 'dark' | 'accent'

type Card = { _key?: string; eyebrow?: string; heading: string; body?: string; image?: SanityImageSource; imageAlt?: string }

type Piece =
  | { _type: 'intro'; _key?: string; eyebrow?: string; headline?: string; body?: string; ctaLabel?: string; ctaHref?: string }
  | { _type: 'text'; _key?: string; heading?: string; body?: string }
  | { _type: 'cards'; _key?: string; tone?: CardTone; numberedEyebrow?: boolean; items?: Card[] }
  | { _type: 'button'; _key?: string; ctaLabel?: string; ctaHref?: string }

type StickySplitBlockProps = {
  media?: MediaField
  items?: Piece[]
  imagePosition?: 'left' | 'right'
  tone?: Tone
  paddingTop?: BandSpacing
  paddingBottom?: BandSpacing
  spacing?: BandSpacing
}

const SECTION_BG: Record<Tone, string> = { none: '', light: 'bg-muted', ...BAND_BG }

const CARD_SURFACE: Record<CardTone, string> = {
  white: 'border border-border bg-background',
  dark: 'bg-foreground',
  accent: 'bg-accent',
}

// A square image beside a column of text pieces, 50/50. From md the
// image is sticky (.sticky-split-media in globals.css: just under the
// header, and never taller than the screen) so it stays put while the
// pieces scroll past, and lets go when the text column ends. Mobile
// stacks them, image first, nothing sticky. Pieces are 64px apart (the
// intro-to-content gap); within one, the usual 16px text rhythm.
export function StickySplitBlock({
  media,
  items = [],
  imagePosition = 'left',
  tone = 'none',
  paddingTop,
  paddingBottom,
  spacing = 'loose',
}: StickySplitBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null
  const dark = tone === 'dark' || tone === 'accentDark'
  const buttonVariant = dark ? 'filled-accent' : 'filled-dark'
  const unset: BandSpacing = tone === 'none' ? 'none' : 'medium'
  const right = imagePosition === 'right'
  const firstIntro = items.findIndex((p) => p._type === 'intro')

  const piece = (p: Piece, index: number) => {
    switch (p._type) {
      case 'intro':
        return (
          <SectionIntro
            key={p._key ?? index}
            // The first Intro is the section's heading; any later one is
            // a sub-heading, at the same size.
            as={index === firstIntro ? 'h2' : 'h3'}
            styleAs="h3"
            eyebrow={p.eyebrow}
            heading={p.headline}
            body={p.body}
            bodyClassName="whitespace-pre-line"
            maxWidth="none"
            tone={dark ? 'inverse' : 'default'}
            eyebrowColor={dark ? 'text-accent' : undefined}
            cta={
              p.ctaLabel && p.ctaHref ? (
                <Button href={p.ctaHref} variant={buttonVariant}>
                  {p.ctaLabel}
                </Button>
              ) : undefined
            }
          />
        )
      case 'text':
        if (!p.heading && !p.body) return null
        return (
          <div key={p._key ?? index} className={`flex flex-col gap-medium ${dark ? 'text-background' : 'text-foreground'}`}>
            {p.heading && <h3 className="text-h5 font-medium">{p.heading}</h3>}
            {p.body && (
              <p className={`text-body-lg whitespace-pre-line ${dark ? 'text-background/80' : 'text-muted-foreground'}`}>
                {p.body}
              </p>
            )}
          </div>
        )
      case 'cards': {
        const cardTone = p.tone ?? 'white'
        if (!p.items?.length) return null
        return (
          <div key={p._key ?? index} className="flex flex-col gap-medium">
            {p.items.map((card, i) => (
              <div key={card._key ?? i} className={`flex flex-col rounded-lg px-medium-large py-large md:px-large ${CARD_SURFACE[cardTone]}`}>
                <SectionIntro
                  as="h4"
                  eyebrow={card.eyebrow ? renderNumberedEyebrow(card.eyebrow, !!p.numberedEyebrow, cardTone === 'dark') : undefined}
                  heading={card.heading}
                  body={card.body}
                  bodyClassName="whitespace-pre-line"
                  maxWidth="none"
                  tone={cardTone === 'dark' ? 'inverse' : 'default'}
                  eyebrowColor={cardTone === 'dark' ? 'text-accent' : p.numberedEyebrow ? 'text-foreground' : undefined}
                />
                {hasImage(card.image) && (
                  <div className="relative mt-large aspect-media w-full overflow-hidden rounded-md bg-accent-gradient">
                    <Image
                      src={urlFor(card.image!).url()}
                      alt={card.imageAlt || ''}
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
      case 'button':
        if (!p.ctaLabel || !p.ctaHref) return null
        return (
          <div key={p._key ?? index}>
            <Button href={p.ctaHref} variant={buttonVariant}>
              {p.ctaLabel}
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <SectionShell
      pt={paddingTop ?? unset}
      py={paddingBottom ?? unset}
      sectionClassName={`${SECTION_BG[tone]} ${SECTION_GAP_MB_CLASS[spacing]}`}
    >
      {/* The grid's default stretch makes the image's column as tall as
          the text's, so the image has room to stick inside it. */}
      <div className="grid grid-cols-1 gap-large md:grid-cols-2 md:gap-2xl">
        <div className={right ? 'md:order-2' : ''}>
          <div className={`sticky-split-media ${right ? '' : 'md:ml-auto'}`}>
            <Media media={media} alt={media?.alt ?? ''} className="aspect-square w-full rounded-xl" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
        <div className="flex flex-col gap-2xl">{items.map(piece)}</div>
      </div>
    </SectionShell>
  )
}
