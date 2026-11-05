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
  | { _type: 'introPiece'; _key?: string; eyebrow?: string; headline?: string; body?: string; ctaLabel?: string; ctaHref?: string }
  | { _type: 'statementPiece'; _key?: string; text?: string }
  | { _type: 'textPiece'; _key?: string; heading?: string; body?: string }
  | { _type: 'cardsPiece'; _key?: string; tone?: CardTone; numberedEyebrow?: boolean; items?: Card[] }
  | { _type: 'buttonPiece'; _key?: string; ctaLabel?: string; ctaHref?: string }

type StickySplitBlockProps = {
  media?: MediaField
  items?: Piece[]
  imagePosition?: 'left' | 'right'
  bodySize?: BodySize
  tone?: Tone
  paddingTop?: BandSpacing
  paddingBottom?: BandSpacing
  spacing?: BandSpacing
}

type BodySize = 'body' | 'large' | 'h5' | 'statement'
// "Body style": the Intro and Text pieces' body. Body is SectionIntro's
// usual (text-body-lg, medium weight on mobile).
const BODY_STYLE: Record<BodySize, string> = {
  body: 'text-body-lg font-medium md:font-normal',
  large: 'text-body-xl',
  h5: 'text-h5 font-medium',
  // The Statement blocks' text (26–50px, regular weight).
  statement: 'text-statement font-normal',
}

const SECTION_BG: Record<Tone, string> = { none: '', light: 'bg-muted', ...BAND_BG }

const CARD_SURFACE: Record<CardTone, string> = {
  white: 'border border-border bg-background',
  dark: 'bg-foreground',
  accent: 'bg-accent',
}

// A square image beside a column of text pieces, 50/50. From md the
// image is sticky (.sticky-split-media in globals.css: centred on the
// screen, clear of the header) so it stays put while the
// pieces scroll past, and lets go when the text column ends. The text
// starts a third of the way down the image (.sticky-split-text). Mobile
// stacks them, image first, nothing sticky. Pieces are 64px apart (the
// intro-to-content gap); within one, the usual 16px text rhythm.
export function StickySplitBlock({
  media,
  items = [],
  imagePosition = 'left',
  bodySize = 'body',
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
  const firstIntro = items.findIndex((p) => p._type === 'introPiece')

  const piece = (p: Piece, index: number) => {
    switch (p._type) {
      case 'introPiece':
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
            bodyStyleClassName={BODY_STYLE[bodySize] ?? BODY_STYLE.body}
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
      case 'statementPiece':
        if (!p.text) return null
        return (
          <p
            key={p._key ?? index}
            className={`text-statement font-normal text-pretty whitespace-pre-line ${dark ? 'text-background' : 'text-foreground'}`}
          >
            {p.text}
          </p>
        )
      case 'textPiece':
        if (!p.heading && !p.body) return null
        return (
          <div key={p._key ?? index} className={`flex flex-col gap-medium ${dark ? 'text-background' : 'text-foreground'}`}>
            {p.heading && <h3 className="text-h5 font-medium whitespace-pre-line">{p.heading}</h3>}
            {p.body && (
              <p className={`${BODY_STYLE[bodySize] ?? BODY_STYLE.body} whitespace-pre-line ${dark ? 'text-background/80' : 'text-muted-foreground'}`}>
                {p.body}
              </p>
            )}
          </div>
        )
      case 'cardsPiece': {
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
      case 'buttonPiece':
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
        <div className={`sticky-split-col ${right ? 'md:order-2' : ''}`}>
          <div className={`sticky-split-media ${right ? '' : 'md:ml-auto'}`}>
            <Media media={media} alt={media?.alt ?? ''} className="aspect-square w-full rounded-xl" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
        <div className="sticky-split-text flex flex-col gap-2xl">{items.map(piece)}</div>
      </div>
    </SectionShell>
  )
}
