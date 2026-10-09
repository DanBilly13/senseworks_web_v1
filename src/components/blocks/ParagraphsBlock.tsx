import { SectionShell } from '@/components/ui/SectionShell'
import { ItemHeading } from '@/components/ui/ItemHeading'

type ParagraphItem = { _type: 'paragraph'; title?: string; text?: string }
type EmptyColumn = { _type: 'emptyColumn' }
type ParagraphsBlockProps = {
  columns?: '3' | '4'
  titleSize?: 'h4' | 'h5' | 'h6'
  headingLayout?: 'stacked' | 'inline'
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  items?: (ParagraphItem | EmptyColumn)[]
}

const LG_COLS_CLASS: Record<'3' | '4', string> = {
  '3': 'lg:grid-cols-3',
  '4': 'lg:grid-cols-4',
}

// Text-only columns, laid out like Feature Grid (same grid, same title
// styles via ItemHeading) but with no icon and no card box. An "Empty
// column" item holds a column open on desktop so text can be pushed
// right (text, text, empty / empty, text, text); below desktop it's
// dropped, so the text just stacks. No intro of its own — pair it with
// a Section Headline above.
export function ParagraphsBlock({
  columns = '3',
  titleSize = 'h5',
  headingLayout = 'stacked',
  spacing = 'loose',
  items = [],
}: ParagraphsBlockProps) {
  // D7: a block with no text simply doesn't render.
  if (!items.some((item) => item._type === 'paragraph' && (item.title || item.text))) return null

  return (
    <SectionShell py={spacing}>
      <div className={`grid grid-cols-1 gap-2xl sm:grid-cols-2 ${LG_COLS_CLASS[columns]}`}>
        {items.map((item, index) => {
          if (item._type === 'emptyColumn') {
            return <div key={index} className="hidden lg:block" aria-hidden="true" />
          }
          // A blank line in the text field starts a new paragraph.
          const paragraphs = item.text?.split(/\n\s*\n/).filter(Boolean) ?? []
          if (!item.title) {
            return (
              <div key={index} className="flex flex-col gap-medium">
                {paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-body text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            )
          }
          // Inline runs the title into the first paragraph; any further
          // paragraphs follow as normal body text.
          const [first, ...rest] = headingLayout === 'inline' ? paragraphs : []
          const stackedText = headingLayout === 'inline' ? rest : paragraphs
          return (
            <div key={index} className="flex flex-col gap-medium">
              <ItemHeading
                as={titleSize}
                title={item.title}
                description={
                  headingLayout === 'inline'
                    ? first
                    : stackedText.length > 0 && (
                        <span className="flex flex-col gap-medium">
                          {stackedText.map((paragraph, i) => (
                            <span key={i}>{paragraph}</span>
                          ))}
                        </span>
                      )
                }
                layout={headingLayout}
              />
              {headingLayout === 'inline' &&
                rest.map((paragraph, i) => (
                  <p key={i} className="text-body text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
