import type { SanityImageSource } from '@sanity/image-url'
import Image from 'next/image'
import { SECTION_GAP_MB_CLASS, SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Button } from '@/components/ui/Button'
import { Media } from '@/components/ui/Media'
import { BAND_BG, type BandSpacing } from '@/components/ui/BandFill'
import { renderNumberedEyebrow } from '@/components/ui/numberedEyebrow'
import { EditorialCard, type EditorialBodyFont, type EditorialLinkStyle, type EditorialMark } from '@/components/ui/EditorialCard'
import { urlFor } from '@/lib/sanity/image'
import { hasImage, type MediaField } from '@/lib/sanity/media'

type Tone = 'none' | 'light' | 'dark' | 'accent' | 'accentGradient' | 'accentDark'
type CardTone = 'white' | 'dark' | 'accent' | 'none'

type Card = {
  _key?: string
  eyebrow?: string
  heading: string
  body?: string
  image?: SanityImageSource
  imageAlt?: string
  ctaLabel?: string
  ctaHref?: string
}

type Piece =
  | { _type: 'introPiece'; _key?: string; eyebrow?: string; headline?: string; body?: string; ctaLabel?: string; ctaHref?: string }
  | { _type: 'statementPiece'; _key?: string; text?: string }
  | { _type: 'textPiece'; _key?: string; heading?: string; body?: string }
  | { _type: 'listPiece'; _key?: string; heading?: string; items?: string[]; textSize?: ListTextSize }
  | {
      _type: 'cardsPiece'
      _key?: string
      cardDesign?: 'standard' | 'editorial'
      tone?: CardTone
      titleSize?: CardTitleSize
      numberedEyebrow?: boolean
      cardMark?: EditorialMark
      cardNumbers?: boolean
      linkStyle?: EditorialLinkStyle
      bodyFont?: EditorialBodyFont
      items?: Card[]
    }
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
// usual (text-body-lg).
const BODY_STYLE: Record<BodySize, string> = {
  body: 'text-body-lg',
  large: 'text-body-xl',
  // Old content saved before H5 was folded into Large body.
  h5: 'text-body-xl',
  // The Statement blocks' text (24–50px, regular weight).
  statement: 'text-statement font-normal',
}

const SECTION_BG: Record<Tone, string> = { none: '', light: 'bg-muted', ...BAND_BG }

// The List piece's "Text size": the block's Body style, or one of these.
type ListTextSize = 'inherit' | 'body' | 'large' | 'h5' | 'h4'
const LIST_TEXT: Record<Exclude<ListTextSize, 'inherit'>, string> = {
  body: 'text-body-lg',
  large: 'text-body-xl',
  // Old content saved before H5 was folded into Large body.
  h5: 'text-body-xl',
  h4: 'text-h4 font-medium',
}

// The Cards piece's "Card title size", and the gap that goes with each.
type CardTitleSize = 'h4' | 'h5' | 'h6'
const CARD_TITLE_CLASS: Record<CardTitleSize, string> = { h4: 'text-h4', h5: 'text-h5', h6: 'text-h6' }
const CARD_TITLE_GAP: Record<CardTitleSize, string> = { h4: 'gap-medium', h5: 'gap-small-medium', h6: 'gap-small-medium' }

const CARD_SURFACE: Record<Exclude<CardTone, 'none'>, string> = {
  white: 'border border-border bg-background',
  dark: 'bg-foreground',
  accent: 'bg-accent',
}

// A square image beside a column of text pieces, 50/50. From md the
// image is sticky (.sticky-split-media in globals.css: centred on the
// screen, clear of the header) so it stays put while the
// pieces scroll past, and lets go when the text column ends. The text
// starts a third of the way down the image and ends a third of the way
// up from its bottom (.sticky-split-text). Mobile
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
            {p.heading && <h3 className="text-h4 font-bold whitespace-pre-line md:text-h5 md:font-medium">{p.heading}</h3>}
            {p.body && (
              <p className={`${BODY_STYLE[bodySize] ?? BODY_STYLE.body} whitespace-pre-line ${dark ? 'text-background/80' : 'text-muted-foreground'}`}>
                {p.body}
              </p>
            )}
          </div>
        )
      case 'listPiece': {
        const list = (p.items ?? []).filter(Boolean)
        if (!list.length) return null
        const rule = dark ? 'border-background/40' : 'border-foreground'
        const size = p.textSize && p.textSize !== 'inherit' ? LIST_TEXT[p.textSize] : (BODY_STYLE[bodySize] ?? BODY_STYLE.body)
        return (
          <div key={p._key ?? index} className={`flex flex-col gap-medium ${dark ? 'text-background' : 'text-foreground'}`}>
            {p.heading && <h3 className="text-h4 font-bold whitespace-pre-line md:text-h5 md:font-medium">{p.heading}</h3>}
            {/* A bullet per line, a thin rule above each and below the last. */}
            <ul className={`border-b ${rule}`}>
              {list.map((line, i) => (
                <li key={i} className={`flex items-center gap-medium border-t py-medium ${rule} ${size}`}>
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )
      }
      case 'cardsPiece': {
        const titleSize = p.titleSize ?? 'h5'
        const CardTitle = titleSize
        if (!p.items?.length) return null
        if (p.cardDesign === 'editorial') {
          const surface = p.tone ?? 'white'
          return (
            // Equal heights on phones, as the standard cards; no-fill cards
            // need more air between them than boxed ones.
            <div
              key={p._key ?? index}
              className={`grid auto-rows-fr md:auto-rows-auto ${surface === 'none' ? 'gap-xl' : 'gap-medium'}`}
            >
              {p.items.map((card, i) => (
                <EditorialCard
                  key={card._key ?? i}
                  surface={surface}
                  onDark={dark}
                  number={p.cardNumbers ? String(i + 1).padStart(2, '0') : undefined}
                  label={card.eyebrow}
                  mark={p.cardMark}
                  title={card.heading}
                  titleSize={titleSize}
                  body={card.body}
                  bodyFont={p.bodyFont}
                  action={card.ctaLabel && card.ctaHref ? { label: card.ctaLabel, href: card.ctaHref, style: p.linkStyle } : undefined}
                  visual={
                    hasImage(card.image) ? (
                      <div className="relative aspect-media w-full bg-accent-gradient">
                        <Image src={urlFor(card.image!).url()} alt={card.imageAlt || ''} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
                      </div>
                    ) : undefined
                  }
                />
              ))}
            </div>
          )
        }
        // A Standard card has no "No fill"; it falls back to White.
        const cardTone = p.tone && p.tone !== 'none' ? p.tone : 'white'
        return (
          // Phones: every card as tall as the tallest (spare space at the
          // foot).
          <div key={p._key ?? index} className="grid auto-rows-fr gap-medium md:auto-rows-auto">
            {p.items.map((card, i) => (
              <div
                key={card._key ?? i}
                className={`flex flex-col rounded-lg px-medium-large pt-card-top pb-large md:px-large md:pt-large ${CARD_SURFACE[cardTone]}`}
              >
                {/* Eyebrow, title and body as SectionIntro draws them, but at
                    any of H4–H6 (SectionIntro stops at H4); the gaps follow
                    the title size, about half its line-height. */}
                <div className={`flex flex-col ${CARD_TITLE_GAP[titleSize]}`}>
                  {card.eyebrow && (
                    <p
                      className={`text-eyebrow font-heading font-bold uppercase ${titleSize === 'h4' ? '' : 'mb-xs md:mb-0'} ${cardTone === 'dark' ? 'text-accent' : p.numberedEyebrow ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {renderNumberedEyebrow(card.eyebrow, !!p.numberedEyebrow, cardTone === 'dark')}
                    </p>
                  )}
                  <CardTitle className={`${CARD_TITLE_CLASS[titleSize]} font-bold text-balance ${cardTone === 'dark' ? 'text-background' : 'text-foreground'}`}>
                    {card.heading}
                  </CardTitle>
                  {card.body && (
                    <p
                      className={`text-body-lg whitespace-pre-line md:text-pretty ${cardTone === 'dark' ? 'text-background/80' : 'text-muted-foreground'}`}
                    >
                      {card.body}
                    </p>
                  )}
                </div>
                {card.ctaLabel && card.ctaHref && (
                  <a
                    href={card.ctaHref}
                    className={`mt-medium-large self-start text-body-sm font-medium underline underline-offset-4 ${cardTone === 'dark' ? 'text-accent' : 'text-foreground'}`}
                  >
                    {card.ctaLabel}
                  </a>
                )}
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
        <div className="sticky-split-text flex flex-col gap-stack">{items.map(piece)}</div>
      </div>
    </SectionShell>
  )
}
