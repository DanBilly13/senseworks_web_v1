import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type CardGridItem = {
  eyebrow: string
  heading: string
  body?: string
}
type CardGridBlockProps = {
  columns?: '1' | '2' | '3' | '4'
  items?: CardGridItem[]
  dark?: boolean
}

const GRID_COLS_CLASS: Record<'1' | '2' | '3' | '4', string> = {
  '1': '',
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

// No eyebrow/heading/body of its own — pair it with a separate intro
// block (e.g. Section Headline) above it when one's needed.
export function CardGridBlock({ columns = '3', items = [], dark = false }: CardGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell>
      {/* Grid's default align-items: stretch makes every card in a row
          match the tallest one, on desktop's multi-column row — no
          extra height/flex wiring needed for that. Single column on
          mobile just stacks them at their own natural heights instead. */}
      <div className={`grid grid-cols-1 gap-large ${GRID_COLS_CLASS[columns]}`}>
        {items.map((item, index) => (
          <div
            key={index}
            className={
              dark
                ? 'flex flex-col rounded-lg bg-foreground p-large'
                : 'flex flex-col rounded-lg border border-border bg-background p-large'
            }
          >
            <SectionIntro
              as="h4"
              eyebrow={item.eyebrow}
              heading={item.heading}
              body={item.body}
              tone={dark ? 'inverse' : 'default'}
            />
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
