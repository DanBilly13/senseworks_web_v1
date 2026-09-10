import type { ReactNode } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

type WidthKey = 'sm' | 'md' | 'wide' | 'none'

type SectionIntroProps = {
  as: HeadingLevel
  eyebrow?: string
  heading?: string
  body?: string
  cta?: ReactNode
  align?: 'left' | 'center'
  maxWidth?: 'sm' | 'md' | 'none'
  // Overrides maxWidth for the heading only — e.g. a hero headline
  // that should run wider than its own subhead/CTA underneath it.
  // Defaults to whatever maxWidth already resolves to, so every
  // existing caller (which doesn't pass this) is unaffected.
  headingMaxWidth?: WidthKey
  // 'inverse' for light text on a dark/foreground-colored surface
  // (e.g. an image-overlay hero) — mirrors Button's inverse variant.
  tone?: 'default' | 'inverse'
}

const HEADING_TEXT_CLASS: Record<HeadingLevel, string> = {
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
}

// h1/h2 are bold; h3/h4 stay semibold.
const HEADING_WEIGHT_CLASS: Record<HeadingLevel, string> = {
  h1: 'font-bold',
  h2: 'font-bold',
  h3: 'font-semibold',
  h4: 'font-semibold',
}

const MAX_WIDTH_CLASS: Record<WidthKey, string> = {
  sm: 'max-w-prose-sm',
  md: 'max-w-prose-md',
  wide: 'max-w-wide',
  none: '',
}

export function SectionIntro({
  as: Heading,
  eyebrow,
  heading,
  body,
  cta,
  align = 'left',
  maxWidth = 'none',
  headingMaxWidth,
  tone = 'default',
}: SectionIntroProps) {
  // A block with neither an eyebrow nor a heading has no intro to show
  // (e.g. Stats Band's intro is entirely optional).
  if (!eyebrow && !heading) return null

  const eyebrowColor = tone === 'inverse' ? 'text-background/70' : 'text-muted-foreground'
  const headingColor = tone === 'inverse' ? 'text-background' : 'text-foreground'
  const bodyColor = tone === 'inverse' ? 'text-background/80' : 'text-muted-foreground'
  // h1/h2's body reads as a subtitle, not muted body copy — full
  // strength (same color as the heading itself), not the faded
  // bodyColor every h3/h4 body still uses.
  const isSubtitle = Heading === 'h1' || Heading === 'h2'

  // Width lives on each child, not this wrapping div, so the heading
  // can run wider than the body/eyebrow via headingMaxWidth — flexbox's
  // default `align-items: stretch` still fills each child out to the
  // container's width and then caps it at its own max-w-*, so this
  // renders identically to the old shared-wrapper-width approach for
  // every caller that doesn't pass headingMaxWidth.
  return (
    <div
      className={['flex flex-col gap-medium', align === 'center' ? 'items-center text-center' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow && (
        <p
          className={`text-caption font-semibold tracking-wide uppercase ${eyebrowColor} ${MAX_WIDTH_CLASS[maxWidth]}`}
        >
          {eyebrow}
        </p>
      )}
      {heading && (
        <Heading
          className={[
            HEADING_TEXT_CLASS[Heading],
            HEADING_WEIGHT_CLASS[Heading],
            'text-balance',
            headingColor,
            MAX_WIDTH_CLASS[headingMaxWidth ?? maxWidth],
            // Extra bump on top of the container's gap-medium, eyebrow
            // to heading only — text-box-trim (globals.css) tightened
            // every heading's own box, which made this specific gap
            // read tighter than the rest of the block's rhythm once
            // there was an eyebrow above it to compare against.
            eyebrow ? 'mt-small' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {heading}
        </Heading>
      )}
      {body && (
        <p
          className={[
            // h1/h2's body reads as a proper subtitle — bumped up to
            // h5 size (22px desktop, exactly 20px on mobile) and
            // medium weight, instead of plain body-lg. h3/h4 unchanged.
            isSubtitle ? 'text-h5 font-medium' : 'text-body-lg',
            isSubtitle ? headingColor : bodyColor,
            // Subtitle width is its own fixed rule (85% of the row,
            // desktop only — mobile has no spare width to give up),
            // not whatever maxWidth the caller passed for the eyebrow.
            isSubtitle ? 'md:max-w-subtitle' : MAX_WIDTH_CLASS[maxWidth],
            // Doubles the total heading-to-body gap (16px container
            // gap + this) from 24px to 48px, on top of the same
            // trimmed-box reasoning as the heading's own mt-small above.
            heading ? 'mt-large' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {body}
        </p>
      )}
      {cta && (
        // Doubles the body-to-button gap (16px container gap + this)
        // from 16px to 32px, same reasoning as the heading/body
        // mt-* bumps above. Only when there's a body to double the
        // gap from — a heading-to-button gap (no body) is untouched.
        <div className={body ? 'mt-medium' : ''}>{cta}</div>
      )}
    </div>
  )
}
