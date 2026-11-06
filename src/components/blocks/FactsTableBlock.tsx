import { SECTION_GAP_MB_CLASS, SectionShell } from '@/components/ui/SectionShell'
import { ItemHeading } from '@/components/ui/ItemHeading'
import { BAND_BG, type BandSpacing } from '@/components/ui/BandFill'

type Tone = 'none' | 'light' | 'dark' | 'accent' | 'accentGradient' | 'accentDark'

type FactsTableItem = { _key?: string; eyebrow?: string; title?: string; body?: string }

type FactsTableBlockProps = {
  items?: FactsTableItem[]
  titleSize?: 'h3' | 'h4' | 'h5'
  tone?: Tone
  paddingTop?: BandSpacing
  paddingBottom?: BandSpacing
  spacing?: BandSpacing
}

const SECTION_BG: Record<Tone, string> = { none: '', light: 'bg-muted', ...BAND_BG }

const COLS_CLASS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

// A ruled table of 2–4 equal columns: each column's eyebrow in the top
// row, its title (and optional body) in the row under it. Each column
// is a subgrid of the table's two rows from md, so the eyebrow row
// lines up across columns however much each title wraps. Mobile stacks
// the columns, each still eyebrow over title, divided by a rule.
export function FactsTableBlock({
  items = [],
  titleSize = 'h4',
  tone = 'none',
  paddingTop,
  paddingBottom,
  spacing = 'loose',
}: FactsTableBlockProps) {
  const shown = items.filter((item) => item.title).slice(0, 4)
  // D7: a block with no content simply doesn't render.
  if (!shown.length) return null
  const dark = tone === 'dark' || tone === 'accentDark'
  const line = dark ? 'border-background/40' : 'border-foreground'
  const unset: BandSpacing = tone === 'none' ? 'none' : 'medium'

  return (
    <SectionShell
      px="boxed"
      pt={paddingTop ?? unset}
      py={paddingBottom ?? unset}
      sectionClassName={`${SECTION_BG[tone]} ${SECTION_GAP_MB_CLASS[spacing]}`}
    >
      <div className={`grid grid-cols-1 overflow-hidden rounded-xl border ${line} ${COLS_CLASS[Math.max(2, shown.length)]}`}>
        {shown.map((item, i) => (
          <div
            key={item._key ?? i}
            className={`grid md:row-span-2 md:grid-rows-subgrid ${i > 0 ? `border-t md:border-t-0 md:border-l ${line}` : ''}`}
          >
            <p
              className={`border-b px-medium py-medium-large text-eyebrow md:px-medium-large font-bold tracking-wider uppercase ${line} ${dark ? 'text-background/70' : 'text-muted-foreground'}`}
            >
              {item.eyebrow || ' '}
            </p>
            <ItemHeading
              as={titleSize}
              title={<span className="whitespace-pre-line">{item.title}</span>}
              description={item.body ? <span className="whitespace-pre-line">{item.body}</span> : undefined}
              tone={dark ? 'inverse' : 'default'}
              className="px-medium py-large md:px-medium-large"
            />
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
