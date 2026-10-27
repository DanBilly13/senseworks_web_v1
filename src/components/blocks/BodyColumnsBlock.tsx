import { SectionShell } from '@/components/ui/SectionShell'
import { BandFill, bandShellPadding, type BandProps } from '@/components/ui/BandFill'

// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type BodyColumnsBlockProps = BandProps & {
  columns?: '1' | '2' | '3'
  items?: { text?: string }[]
}

const LG_COLS_CLASS: Record<'1' | '2' | '3', string> = {
  '1': 'lg:grid-cols-1',
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
}

// Large body text (18px on a phone up to 22px, --text-body-xl) in equal
// columns with a wide gutter that grows with the screen (60–120px,
// --spacing-editorial), no titles — after the Awwwards course page Dan
// referenced. Below 1024px the columns stack. Pairs with a Statement.
export function BodyColumnsBlock({ columns = '2', items = [], tone = 'none', ...band }: BodyColumnsBlockProps) {
  const filled = items.filter((item) => item?.text?.trim())
  // D7: a block with no content simply doesn't render.
  if (!filled.length) return null
  const dark = tone === 'inverse' || tone === 'accentDark'
  return (
    <BandFill tone={tone} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <div className={`grid grid-cols-1 gap-y-medium-large lg:gap-x-editorial ${LG_COLS_CLASS[columns]}`}>
          {filled.map((item, index) => (
            <div key={index} className="flex flex-col gap-medium">
              {/* A plain-text field: Enter starts a new paragraph. */}
              {item
                .text!.split('\n')
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i} className={`text-body-xl ${dark ? 'text-background' : 'text-foreground'}`}>
                    {paragraph}
                  </p>
                ))}
            </div>
          ))}
        </div>
      </SectionShell>
    </BandFill>
  )
}
