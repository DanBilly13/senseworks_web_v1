import { SectionShell } from '@/components/ui/SectionShell'
import { BandFill, bandShellPadding, type BandProps } from '@/components/ui/BandFill'

// tone/paddingTop/paddingBottom/spacing: the optional full screen width
// background, see ui/BandFill.
type BodyColumnsBlockProps = BandProps & {
  columns?: '1' | '2' | '3'
  // For columns with a title: stacked above the text, or inline — run
  // into the start of the first paragraph, bold, at the text's size.
  headingLayout?: 'stacked' | 'inline'
  titleSize?: 'h3' | 'h4' | 'h5'
  items?: { title?: string; text?: string }[]
}

const TITLE_SIZE_CLASS: Record<'h3' | 'h4' | 'h5', string> = {
  h3: 'text-h3',
  h4: 'text-h4',
  h5: 'text-h5',
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
export function BodyColumnsBlock({
  columns = '2',
  headingLayout = 'stacked',
  titleSize = 'h4',
  items = [],
  tone = 'none',
  ...band
}: BodyColumnsBlockProps) {
  const filled = items.filter((item) => item?.text?.trim() || item?.title?.trim())
  // D7: a block with no content simply doesn't render.
  if (!filled.length) return null
  const dark = tone === 'inverse' || tone === 'accentDark'
  return (
    <BandFill tone={tone} {...band}>
      <SectionShell {...bandShellPadding({ tone, ...band })}>
        <div className={`grid grid-cols-1 gap-y-medium-large lg:gap-x-editorial ${LG_COLS_CLASS[columns]}`}>
          {filled.map((item, index) => {
            // A plain-text field: Enter starts a new paragraph.
            const paragraphs = (item.text ?? '').split('\n').filter(Boolean)
            const textColor = dark ? 'text-background' : 'text-foreground'
            const inline = headingLayout === 'inline' && !!item.title
            return (
              <div key={index} className="flex flex-col gap-medium">
                {item.title && !inline && (
                  <h3 className={`${TITLE_SIZE_CLASS[titleSize]} font-bold text-balance ${textColor}`}>{item.title}</h3>
                )}
                {inline && !paragraphs.length && (
                  <p className={`text-body-xl font-bold ${textColor}`}>{item.title}</p>
                )}
                {paragraphs.map((paragraph, i) => (
                  <p key={i} className={`text-body-xl ${textColor}`}>
                    {inline && i === 0 && (
                      <>
                        <strong className="font-bold">{item.title}</strong>{' '}
                      </>
                    )}
                    {paragraph}
                  </p>
                ))}
              </div>
            )
          })}
        </div>
      </SectionShell>
    </BandFill>
  )
}
