import { Fragment } from 'react'
import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import { BandFill, bandShellPadding, type BandProps } from '@/components/ui/BandFill'
import type { MediaField } from '@/lib/sanity/media'

// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type StatementSplitBlockProps = BandProps & {
  media?: MediaField
  text?: string
  closingText?: string
  imagePosition?: 'left' | 'right'
}

// A Statement beside a square image: a 50/50 split, the image 1:1 and
// the text in Statement's style (regular weight, --text-statement),
// centred on the image's height, with optional small text under it
// (e.g. who said a quote, in --text-body-xl). Mobile stacks them, image
// first.
export function StatementSplitBlock({ media, text, closingText, imagePosition = 'left', tone = 'none', ...band }: StatementSplitBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!text) return null
  const dark = tone === 'dark' || tone === 'accentDark'
  return (
    <BandFill tone={tone} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <div className="grid grid-cols-1 items-center gap-large md:grid-cols-2 md:gap-2xl">
          <Media
            media={media}
            alt={media?.alt ?? ''}
            className={`aspect-square w-full rounded-lg ${imagePosition === 'right' ? 'md:order-2' : ''}`}
          />
          <div className={`lg:w-19/20 ${dark ? 'text-background' : 'text-foreground'}`}>
            <p className="text-statement font-normal text-pretty">
              <Lines text={text} />
            </p>
            {closingText && (
              <p className="mt-large text-body-xl">
                <Lines text={closingText} />
              </p>
            )}
          </div>
        </div>
      </SectionShell>
    </BandFill>
  )
}

// Enter in Studio is a line break on the page.
function Lines({ text }: { text: string }) {
  return text.split('\n').map((line, i, lines) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ))
}
