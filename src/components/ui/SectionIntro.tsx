import { Fragment, type ReactNode } from 'react'
import { TypingText } from '@/components/ui/TypingText'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

type WidthKey = 'sm' | 'md' | 'lg' | 'wide' | 'subtitle' | 'fourFifths' | 'threeFifths' | 'none'

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
  // The same for the body — overrides both maxWidth and the h1/h2
  // subtitle's own 85% rule. Unset keeps those.
  bodyMaxWidth?: WidthKey
  // 'inverse' for light text on a dark/foreground-colored surface
  // (e.g. an image-overlay hero) — mirrors Button's inverse variant.
  tone?: 'default' | 'inverse'
  // Overrides just the eyebrow's color (a Tailwind text-color class,
  // e.g. "text-accent") — for a caller that wants an accent-colored
  // kicker on top of an otherwise default/inverse tone, without
  // changing every other inverse-tone eyebrow sitewide.
  eyebrowColor?: string
  // Opt-in: the heading drawn at the display size, the biggest on the
  // site, whatever its level (the "Headline size" field on Heroes and
  // Section Headline).
  display?: boolean
  // Extra classes on the heading itself — e.g. Hero Image Overlay
  // Card's rules above and below the headline.
  headingClassName?: string
  // The same, on the body — e.g. Hero Image Overlay Card's 50% card,
  // whose body runs out to the rules' edge.
  bodyClassName?: string
  // Overrides the total gap between the heading and the body (a CSS
  // length) — e.g. a ruled headline that wants a set distance from its
  // rule rather than the usual half-line-height.
  bodyGap?: string
  // The same, for the gap between the eyebrow and the heading.
  headingGap?: string
  // The same, for the gap between the body and the call to action.
  ctaGap?: string
  // A hero's "Typing effect": the heading types itself out once on load
  // (ui/TypingText), with a cursor in typingCursorClassName's color
  // (the text's own color when unset).
  typing?: boolean
  typingCursorClassName?: string
  // false keeps the regular body style under an h1/h2-sized heading,
  // instead of the bigger subtitle treatment (Feature Split at H2).
  subtitleBody?: boolean
}

// The site-wide eyebrow/heading/body/cta gap: half the heading's own
// line-height, so it scales with the heading size. The container below
// already contributes gap-medium (16px) between every child, so this
// supplies only the remainder, making the TOTAL visible gap exactly
// half the line-height rather than half-line-height-plus-16px.
// (There used to be an opt-in full-line-height variant; Card Grid,
// Feature Split and the Hero card used it and read too loose, so all
// now follow this one rule.) Replaces the old fixed mt-small/mt-large/mt-medium bumps, which
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

// The same gap for a display-size heading (see the `display` prop).
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

const MAX_WIDTH_CLASS: Record<WidthKey, string> = {
  sm: 'max-w-prose-sm',
  md: 'max-w-prose-md',
  lg: 'max-w-prose-lg',
  wide: 'max-w-wide',
  // Same 85%-of-row token the h1/h2 subtitle body already uses below,
  // desktop-only so mobile keeps its full width.
  subtitle: 'md:max-w-subtitle',
  // 80% of the row, desktop only, likewise.
  fourFifths: 'md:max-w-four-fifths',
  threeFifths: 'md:max-w-three-fifths',
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
  bodyMaxWidth,
  tone = 'default',
  eyebrowColor,
  display = false,
  headingClassName,
  bodyClassName,
  bodyGap,
  headingGap,
  ctaGap,
  typing = false,
  typingCursorClassName,
  subtitleBody = true,
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
  const isSubtitle = subtitleBody && (styleLevel === 'h1' || styleLevel === 'h2')
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
            // Bold on dark backgrounds too (a Medium trial for light-on-
            // dark text was reverted at Dan's request). Display is Aeonik
            // Medium (loaded as weight 600, see layout.tsx), at Dan's request.
            display ? 'font-semibold' : HEADING_WEIGHT_CLASS[styleLevel],
            'text-balance',
            headingColor,
            MAX_WIDTH_CLASS[headingMaxWidth ?? maxWidth],
            headingClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          // Half the heading's own line-height (see above).
          style={eyebrow ? { marginTop: headingGap ? `calc(${headingGap} - var(--spacing-medium))` : halfLineHeightGap } : undefined}
        >
          {typing ? (
            <TypingText text={heading} cursorClassName={typingCursorClassName} />
          ) : (
            // A line break typed in the field (Section Headline's is a
            // multi-line text field) is a literal "\n", which HTML would
            // collapse, so it becomes a real <br>.
            heading.split('\n').map((line, i, lines) => (
              <Fragment key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </Fragment>
            ))
          )}
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
            bodyMaxWidth ? MAX_WIDTH_CLASS[bodyMaxWidth] : isSubtitle ? 'md:max-w-subtitle' : MAX_WIDTH_CLASS[maxWidth],
            bodyClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          // Same gap as the heading's own above, keyed off the
          // heading's presence instead of the eyebrow's.
          // The container already adds gap-medium between children, so a
          // bodyGap override supplies only the rest of it.
          style={heading ? { marginTop: bodyGap ? `calc(${bodyGap} - var(--spacing-medium))` : halfLineHeightGap } : undefined}
        >
          {body}
        </p>
      )}
      {cta && (
        // Same half-the-heading's-line-height gap as above, only when
        // there's a body above it to apply it from — a heading-to-
        // button gap (no body) is untouched, same as before.
        <div style={body ? { marginTop: ctaGap ? `calc(${ctaGap} - var(--spacing-medium))` : halfLineHeightGap } : undefined}>
          {cta}
        </div>
      )}
    </div>
  )
}
