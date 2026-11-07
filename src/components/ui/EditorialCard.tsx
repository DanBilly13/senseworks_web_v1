import type { ReactNode } from 'react'
import Link from 'next/link'

// The editorial card (Dan's pick, from an Awwwards-style reference): a
// hairline across the top, a small label row under it (an optional
// number and/or eyebrow on the left, an optional wave mark on the
// right), a big breath, an all-caps title, the body, then a text link or
// an outline button. Boxed (a filled card, the line inside its padding)
// or with no fill at all (the line is the only frame). The gaps shrink
// going down: 24 → 64 (48 on phones) → 24 → 32. Offered as "Card design:
// Editorial" by Sticky Split cards, Card Grid and the Case Study
// Carousel. The action sits at the foot, so cards stretched to a shared
// height keep their links in line.

export type EditorialSurface = 'none' | 'white' | 'dark' | 'accent'
export type EditorialMark = 'none' | 'wave'
export type EditorialLinkStyle = 'link' | 'button'
// The body's font: Text (Inter) or Display (our heading face, Aeonik,
// with tighter lines, as in the reference).
export type EditorialBodyFont = 'text' | 'display'

type Props = {
  // "01", "02"… when the cards are numbered.
  number?: string
  // The eyebrow. With a number, any leading dash ("— Ally") is dropped
  // and it reads "01 /ALLY" over two lines.
  label?: string
  mark?: EditorialMark
  title: string
  titleAs?: 'h2' | 'h3'
  titleSize?: 'h4' | 'h5' | 'h6'
  body?: string
  bodyFont?: EditorialBodyFont
  // No href: drawn as a plain span (the whole card is already a link).
  action?: { label: string; href?: string; style?: EditorialLinkStyle }
  surface?: EditorialSurface
  // A no-fill card on a dark background (white text and line).
  onDark?: boolean
  // Shown at the top: edge to edge on a boxed card, above the line on a
  // no-fill one.
  visual?: ReactNode
  // A boxed card's side padding (phones / from tablet).
  padX?: string
  className?: string
}

const SURFACE: Record<Exclude<EditorialSurface, 'none'>, string> = {
  white: 'border border-border bg-background text-foreground',
  dark: 'bg-foreground text-background',
  accent: 'bg-accent text-foreground',
}

// Regular-weight caps read smaller than bold, so each size choice draws a
// step up: H5 (the default) is drawn at H4 (22px phones, 28px desktop).
const TITLE_SIZE: Record<'h4' | 'h5' | 'h6', string> = { h4: 'text-h3', h5: 'text-h4', h6: 'text-h5' }

const WAVE_MASK = {
  maskImage: 'url(/senseworks-brandmark-pos.svg)',
  maskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskImage: 'url(/senseworks-brandmark-pos.svg)',
  WebkitMaskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
}

// "01" + "— Ally" → a bold "01" over a regular "/ALLY"; either alone as
// given. All in our heading face, regular weight, tightly spaced (the
// reference's labels), with just the number bold.
function Label({ number, label }: { number?: string; label?: string }) {
  const clean = number ? label?.replace(/^\s*[—–-]+\s*/, '') : label
  if (!number && !clean) return <span />
  return (
    <p className="font-heading text-eyebrow leading-snug font-normal tracking-tight uppercase">
      {number && <span className="block font-bold">{number}</span>}
      {clean && <span className="block">{number ? `/${clean}` : clean}</span>}
    </p>
  )
}

export function EditorialCard({
  number,
  label,
  mark = 'none',
  title,
  titleAs: Title = 'h3',
  titleSize = 'h5',
  body,
  bodyFont = 'text',
  action,
  surface = 'none',
  onDark,
  visual,
  padX = 'px-medium-large md:px-large',
  className,
}: Props) {
  const boxed = surface !== 'none'
  const light = surface === 'dark' || (!boxed && !!onDark)
  const actionClass =
    action?.style === 'button'
      ? 'rounded-full border border-current px-medium-large py-small-medium text-body-sm font-bold tracking-wide uppercase transition-opacity hover:opacity-70'
      : `text-body-sm font-medium underline underline-offset-4 ${light ? 'text-accent' : ''}`
  return (
    <div
      className={[
        'flex h-full flex-col',
        boxed ? `overflow-hidden rounded-lg ${SURFACE[surface]}` : light ? 'text-background' : 'text-foreground',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {visual && <div className={boxed ? '' : 'mb-medium-large'}>{visual}</div>}
      <div className={`flex flex-1 flex-col ${boxed ? `${padX} pt-card-top pb-large md:pt-large` : ''}`}>
        <div className="flex items-start justify-between gap-medium border-t border-current pt-medium-large">
          <Label number={number} label={label} />
          {mark === 'wave' && <span aria-hidden className="mt-xs h-3 w-10 shrink-0 bg-current" style={WAVE_MASK} />}
        </div>
        <Title className={`mt-stack font-heading leading-caps font-normal tracking-tighter text-balance uppercase ${TITLE_SIZE[titleSize]}`}>{title}</Title>
        {/* Full colour, at Large body size (19px phones, 22px from tablet):
            the sentence carries the card, the title is its label. */}
        {body && (
          <p
            className={`mt-medium-large text-body-xl whitespace-pre-line md:text-pretty ${bodyFont === 'display' ? 'font-heading leading-snug font-normal' : ''}`}
          >
            {body}
          </p>
        )}
        {action?.label && (
          <div className="mt-auto pt-large">
            {action.href ? (
              <Link href={action.href} className={`inline-block ${actionClass}`}>
                {action.label}
              </Link>
            ) : (
              <span className={`inline-block ${actionClass}`}>{action.label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
