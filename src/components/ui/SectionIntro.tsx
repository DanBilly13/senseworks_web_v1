import type { ReactNode } from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

type WidthKey = 'sm' | 'md' | 'lg' | 'wide' | 'subtitle' | 'none'

type SectionIntroProps = {
  as: HeadingLevel
  // Which heading level to LOOK like, when that should differ from the
  // real element in `as` — for a block that needs a particular level
  // in the page outline (e.g. an h2) but the visual size/weight/body
  // style of a lower one (an h3), so it matches its siblings. Defaults
  // to `as`, so every existing caller is unchanged.
  styleAs?: HeadingLevel
  // A plain string in every existing caller — widened to ReactNode so
  // a caller can compose something richer (e.g. Card Grid's numbered
  // badge on the eyebrow's leading word) without SectionIntro needing
  // to know anything about that structure itself.
  eyebrow?: ReactNode
  heading?: string
  body?: string
  cta?: ReactNode
  align?: 'left' | 'center'
  maxWidth?: 'sm' | 'md' | 'lg' | 'none'
  // Overrides maxWidth for the heading only — e.g. a hero headline
  // that should run wider than its own subhead/CTA underneath it.
  // Defaults to whatever maxWidth already resolves to, so every
  // existing caller (which doesn't pass this) is unaffected.
  headingMaxWidth?: WidthKey
  // 'inverse' for light text on a dark/foreground-colored surface
  // (e.g. an image-overlay hero) — mirrors Button's inverse variant.
  tone?: 'default' | 'inverse'
  // Overrides just the eyebrow's color (a Tailwind text-color class,
  // e.g. "text-accent") — for a caller that wants an accent-colored
  // kicker on top of an otherwise default/inverse tone, without
  // changing every other inverse-tone eyebrow sitewide.
  eyebrowColor?: string
  // Opt-in, default off: replaces the fixed mt-small/mt-large gap
  // bumps below with the heading's OWN rendered line-height (see
  // --text-h3--full-line-height etc. in globals.css) — for a caller
  // like Card Grid whose heading size actually varies per instance
  // (h3 vs h4), where a single fixed gap would suit only one of them.
  // Every other caller keeps the standard fixed gaps untouched.
  gapToLineHeight?: boolean
  // Opt-in: the heading drawn at the display size, the biggest on the
  // site, whatever its level (the "Headline size" field on Heroes and
  // Section Headline).
  display?: boolean
}

// The container below already contributes gap-medium (16px) between
// every child — so to make the TOTAL gap equal the heading's full line
// height (not line-height *plus* 16px), this only needs to supply the
// remainder on top of that base gap.
const HEADING_LINE_HEIGHT_GAP: Record<HeadingLevel, string> = {
  h1: 'calc(var(--text-h1--full-line-height) - var(--spacing-medium))',
  h2: 'calc(var(--text-h2--full-line-height) - var(--spacing-medium))',
  h3: 'calc(var(--text-h3--full-line-height) - var(--spacing-medium))',
  h4: 'calc(var(--text-h4--full-line-height) - var(--spacing-medium))',
}

// The new default (always on, not opt-in) — half the heading's own
// line-height, same "minus the container's base gap-medium" trick as
// the full version above, so the TOTAL visible gap equals exactly
// half the line-height rather than half-line-height-plus-16px.
// Replaces the old fixed mt-small/mt-large/mt-medium bumps, which
// didn't scale with the heading's own size at all. Exported so a
// caller that renders its own body/cta outside SectionIntro (e.g.
// Full Width Single, which needs a body size SectionIntro doesn't
// offer) can still apply this exact same gap, rather than a
// disconnected flat value drifting from it over time.
export const HALF_HEADING_LINE_HEIGHT_GAP: Record<HeadingLevel, string> = {
  h1: 'calc((var(--text-h1--full-line-height) / 2) - var(--spacing-medium))',
  h2: 'calc((var(--text-h2--full-line-height) / 2) - var(--spacing-medium))',
  h3: 'calc((var(--text-h3--full-line-height) / 2) - var(--spacing-medium))',
  h4: 'calc((var(--text-h4--full-line-height) / 2) - var(--spacing-medium))',
}

// The same two gaps for a display-size heading (see the `display` prop).
const DISPLAY_LINE_HEIGHT_GAP = 'calc(var(--text-display--full-line-height) - var(--spacing-medium))'
const HALF_DISPLAY_LINE_HEIGHT_GAP = 'calc((var(--text-display--full-line-height) / 2) - var(--spacing-medium))'

const HEADING_TEXT_CLASS: Record<HeadingLevel, string> = {
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
}

const HEADING_WEIGHT_CLASS: Record<HeadingLevel, string> = {
  h1: 'font-bold',
  h2: 'font-bold',
  h3: 'font-bold',
  h4: 'font-bold',
}

// Trying Medium instead of Bold specifically for light text on a dark
// background — white-on-dark optically reads heavier than the same
// weight in dark-on-light (an old print-typography effect, not a
// rendering bug — see the WebKit font-smoothing attempt this replaced,
// which didn't actually move the needle on modern macOS). Only the
// inverse tone steps down; default-tone headings are unaffected.
const INVERSE_HEADING_WEIGHT_CLASS = 'font-medium'

const MAX_WIDTH_CLASS: Record<WidthKey, string> = {
  sm: 'max-w-prose-sm',
  md: 'max-w-prose-md',
  lg: 'max-w-prose-lg',
  wide: 'max-w-wide',
  // Same 85%-of-row token the h1/h2 subtitle body already uses below,
  // desktop-only so mobile keeps its full width.
  subtitle: 'md:max-w-subtitle',
  none: '',
}

export function SectionIntro({
  as: Heading,
  styleAs,
  eyebrow,
  heading,
  body,
  cta,
  align = 'left',
  maxWidth = 'none',
  headingMaxWidth,
  tone = 'default',
  eyebrowColor,
  gapToLineHeight = false,
  display = false,
}: SectionIntroProps) {
  // A block with neither an eyebrow nor a heading has no intro to show
  // (e.g. Stats Band's intro is entirely optional).
  if (!eyebrow && !heading) return null

  const resolvedEyebrowColor = eyebrowColor ?? (tone === 'inverse' ? 'text-background/70' : 'text-muted-foreground')
  const headingColor = tone === 'inverse' ? 'text-background' : 'text-foreground'
  const bodyColor = tone === 'inverse' ? 'text-background/80' : 'text-muted-foreground'
  // h1/h2's body reads as a subtitle, not muted body copy — full
  // strength (same color as the heading itself), not the faded
  // bodyColor every h3/h4 body still uses.
  const styleLevel = styleAs ?? Heading
  const isSubtitle = styleLevel === 'h1' || styleLevel === 'h2'
  const lineHeightGap = gapToLineHeight
    ? display
      ? DISPLAY_LINE_HEIGHT_GAP
      : HEADING_LINE_HEIGHT_GAP[styleLevel]
    : undefined
  const halfLineHeightGap = display ? HALF_DISPLAY_LINE_HEIGHT_GAP : HALF_HEADING_LINE_HEIGHT_GAP[styleLevel]

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
          className={`text-caption font-bold tracking-wider uppercase ${resolvedEyebrowColor} ${MAX_WIDTH_CLASS[maxWidth]}`}
        >
          {eyebrow}
        </p>
      )}
      {heading && (
        <Heading
          className={[
            display ? 'text-display' : HEADING_TEXT_CLASS[styleLevel],
            tone === 'inverse' ? INVERSE_HEADING_WEIGHT_CLASS : HEADING_WEIGHT_CLASS[styleLevel],
            'text-balance',
            headingColor,
            MAX_WIDTH_CLASS[headingMaxWidth ?? maxWidth],
          ]
            .filter(Boolean)
            .join(' ')}
          // Half the heading's own line-height by default (was a fixed
          // mt-small bump) — gapToLineHeight steps this up to the FULL
          // line-height instead, for a caller whose heading needs even
          // more breathing room above it.
          style={eyebrow ? { marginTop: gapToLineHeight ? lineHeightGap : halfLineHeightGap } : undefined}
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
            // Medium weight on mobile only (Dan's asking to try it) —
            // reverts to normal at desktop. h1/h2's subtitle treatment
            // is already font-medium unconditionally, unaffected.
            isSubtitle ? 'text-h5 font-medium' : 'text-body-lg font-medium md:font-normal',
            isSubtitle ? headingColor : bodyColor,
            // Subtitle width is its own fixed rule (85% of the row,
            // desktop only — mobile has no spare width to give up),
            // not whatever maxWidth the caller passed for the eyebrow.
            isSubtitle ? 'md:max-w-subtitle' : MAX_WIDTH_CLASS[maxWidth],
          ]
            .filter(Boolean)
            .join(' ')}
          // Same half/full line-height choice as the heading's own gap
          // above, just keyed off the heading's presence instead of the
          // eyebrow's.
          style={heading ? { marginTop: gapToLineHeight ? lineHeightGap : halfLineHeightGap } : undefined}
        >
          {body}
        </p>
      )}
      {cta && (
        // Same half-the-heading's-line-height gap as above, only when
        // there's a body above it to apply it from — a heading-to-
        // button gap (no body) is untouched, same as before.
        <div style={body ? { marginTop: halfLineHeightGap } : undefined}>{cta}</div>
      )}
    </div>
  )
}
