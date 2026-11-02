import { SectionShell } from '@/components/ui/SectionShell'

type ContactDetail = { _key?: string; label?: string; value: string; href?: string }
type ContactRow = { _key?: string; title: string; details?: ContactDetail[]; sideTitle?: string; sideText?: string }

type ContactRowsBlockProps = {
  eyebrow?: string
  rows?: ContactRow[]
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

// Ruled rows of contact details: each row's title big on the left,
// its labelled details in the middle (the value in large type, a link
// when it has one), an optional person to ask on the right. Phones
// stack it: title, details, side.
export function ContactRowsBlock({ eyebrow, rows, spacing }: ContactRowsBlockProps) {
  if (!rows?.length) return null
  return (
    <SectionShell py={spacing}>
      {eyebrow && <p className="mb-xl text-caption font-bold tracking-wider text-muted-foreground uppercase">{eyebrow}</p>}
      <div className="flex flex-col gap-2xl">
        {rows.map((row, i) => (
          <div
            key={row._key ?? i}
            className="grid grid-cols-1 gap-large border-t border-foreground pt-large md:grid-cols-12 md:gap-xl"
          >
            <h2 className="text-h2 font-bold md:col-span-4">{row.title}</h2>
            <dl className="flex flex-col gap-large md:col-span-5">
              {row.details?.map((d, k) => (
                <div key={d._key ?? k} className="flex flex-col gap-xs">
                  {d.label && <dt className="text-caption font-bold tracking-wider text-muted-foreground uppercase">{d.label}</dt>}
                  <dd className="text-h5 font-medium whitespace-pre-line">
                    {d.href ? (
                      <a href={d.href} className="underline decoration-1 underline-offset-4 hover:decoration-2">
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            {(row.sideTitle || row.sideText) && (
              <div className="flex flex-col gap-xs text-body-sm md:col-span-3 md:text-right">
                {row.sideTitle && <p className="font-bold">{row.sideTitle}</p>}
                {row.sideText && <p className="whitespace-pre-line text-muted-foreground">{row.sideText}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
