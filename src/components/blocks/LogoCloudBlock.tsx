import { SectionShell } from '@/components/ui/SectionShell'

type LogoCloudItem = { name: string }
type LogoCloudBlockProps = {
  logos?: LogoCloudItem[]
}

export function LogoCloudBlock({ logos = [] }: LogoCloudBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!logos.length) return null

  return (
    <SectionShell py="large" sectionClassName="border-b border-border" className="overflow-hidden">
      <div
        className="logo-marquee-track flex w-max items-center gap-2xl"
        style={{ animationDuration: `${logos.length * 4}s` }}
      >
        {[...logos, ...logos].map((logo, index) => (
          <div
            key={index}
            className="h-xl w-3xl shrink-0 rounded-md bg-muted"
            role="img"
            aria-label={logo.name}
            aria-hidden={index >= logos.length ? true : undefined}
          />
        ))}
      </div>
    </SectionShell>
  )
}
