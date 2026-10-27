import { Fragment } from 'react'
import { SectionShell } from '@/components/ui/SectionShell'
import { BandFill, bandShellPadding, type BandProps } from '@/components/ui/BandFill'

// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type StatementBlockProps = BandProps & { text?: string }

// A big lead statement across the full content width: regular weight in
// the body font (Inter — Aeonik is only loaded in Medium and Bold), 26px
// on a phone up to 50px from 1920 (--text-statement). A paragraph, not a
// heading, so the page's heading order stays the Section Headlines'.
export function StatementBlock({ text, tone = 'none', ...band }: StatementBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!text) return null
  const dark = tone === 'inverse' || tone === 'accentDark'
  return (
    <BandFill tone={tone} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <p className={`text-statement font-normal text-pretty ${dark ? 'text-background' : 'text-foreground'}`}>
          {text.split('\n').map((line, i, lines) => (
            <Fragment key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </Fragment>
          ))}
        </p>
      </SectionShell>
    </BandFill>
  )
}
