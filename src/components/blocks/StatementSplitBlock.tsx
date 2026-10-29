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
  imagePosition?: 'left' | 'right'
}

// A Statement beside a square image: a 50/50 split, the image 1:1 and
// the text in Statement's style (regular weight, --text-statement),
// centred on the image's height. Mobile stacks them, image first.
export function StatementSplitBlock({ media, text, imagePosition = 'left', tone = 'none', ...band }: StatementSplitBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!text) return null
  const dark = tone === 'inverse' || tone === 'accentDark'
  return (
    <BandFill tone={tone} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <div className="grid grid-cols-1 items-center gap-large md:grid-cols-2 md:gap-2xl">
          <Media
            media={media}
            alt={media?.alt ?? ''}
            className={`aspect-square w-full rounded-lg ${imagePosition === 'right' ? 'md:order-2' : ''}`}
          />
          <p className={`text-statement font-normal text-pretty ${dark ? 'text-background' : 'text-foreground'}`}>
            {text.split('\n').map((line, i, lines) => (
              <Fragment key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        </div>
      </SectionShell>
    </BandFill>
  )
}
