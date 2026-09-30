import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type StatItem = { value: string; label: string }
type StatsBandBlockProps = {
  eyebrow?: string
  heading?: string
  body?: string
  items?: StatItem[]
  spacing?: 'loose' | 'medium' | 'tight'
}

export function StatsBandBlock({
  eyebrow,
  heading,
  body,
  items = [],
  spacing = 'loose',
}: StatsBandBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <SectionShell py={spacing} className="flex flex-col gap-2xl">
      <SectionIntro
        as="h2"
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        align="center"
        maxWidth="md"
      />
      <div className="grid grid-cols-2 gap-large lg:grid-cols-4 lg:divide-x lg:divide-border">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-small px-medium-large text-center"
          >
            <span className="text-h1 font-semibold text-foreground">{item.value}</span>
            <span className="text-body text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
