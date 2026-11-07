import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { EditorialCard, type EditorialSurface } from '@/components/ui/EditorialCard'

// PREVIEW of the editorial card (ui/EditorialCard) with real Home v4 copy,
// boxed and with no fill, before it's offered in Sticky Split, Card Grid,
// Case Study cards and a block of its own. Internal (noindex, see layout).

const ROLES = [
  { label: '01\n/Ally', title: 'Answers in seconds.', body: 'What the standard says and what stands out in the data – with sources.' },
  { label: '02\n/Our experts', title: 'On hand in minutes.', body: "Former auditors on the platform, the methodology and smarter ways of working. Often before you've thought to ask." },
  { label: '03\n/You', title: 'The call is yours. Always.', body: 'You interpret the findings, make the judgment and turn insight into value for the client.' },
]

const LONG = [
  { label: '— Audit', title: 'From risk assessment to filing before lunch.', body: 'Senseworks brings the whole audit process into one connected workflow, from risk assessment to digital filing with the Swedish Companies Registration Office.' },
  { label: '— Analytics', title: 'From sample testing to the whole population without breaking a sweat.', body: '25+ ready-made analyses, from general ledger to tax account.' },
]

const RETORA = {
  src: 'https://cdn.sanity.io/images/rm507cjs/production/336ec772e3c794f6d8a826c52c6c1765ef79c022-628x941.png?rect=0,120,628,449&w=900',
  alt: 'Tomas Randér',
}

function Label({ children }: { children: string }) {
  return <p className="mb-large text-eyebrow font-bold tracking-wider text-muted-foreground uppercase">{children}</p>
}

function Roles({ surface, onDark, mark }: { surface: EditorialSurface; onDark?: boolean; mark?: 'dot' | 'wave' }) {
  return (
    <div className="grid grid-cols-1 gap-2xl md:grid-cols-3 md:gap-large">
      {ROLES.map((r) => (
        <EditorialCard key={r.title} {...r} surface={surface} onDark={onDark} mark={mark} />
      ))}
    </div>
  )
}

export default async function CardsPreview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <>
      <SiteHeader locale={locale} path={`/${locale}/blocks/cards`} />
      <main>
        <SectionShell py="medium" pt="medium">
          <h1 className="text-h2">Editorial cards — preview</h1>
          <p className="mt-medium max-w-prose-md text-body-lg text-muted-foreground">
            The same card, with no fill and boxed: a line, a small label (and a mark), a big gap, an all-caps title, the
            body, a button or link. Real copy from Home v4.
          </p>
        </SectionShell>

        <SectionShell py="medium">
          <Label>1 · No fill, with a dot</Label>
          <Roles surface="none" mark="dot" />
        </SectionShell>

        <SectionShell py="medium">
          <Label>2 · Boxed, dark, with our wave mark</Label>
          <Roles surface="dark" mark="wave" />
        </SectionShell>

        <SectionShell py="medium">
          <Label>3 · Boxed, white</Label>
          <Roles surface="white" mark="dot" />
        </SectionShell>

        <section className="bg-foreground">
          <SectionShell py="medium" pt="medium">
            <p className="mb-large text-eyebrow font-bold tracking-wider text-background/60 uppercase">4 · No fill on a dark background</p>
            <Roles surface="none" onDark mark="dot" />
          </SectionShell>
        </section>

        <SectionShell py="medium" pt="medium">
          <Label>5 · Case study cards: the chips become the label</Label>
          <div className="grid grid-cols-1 gap-large md:grid-cols-3">
            <EditorialCard
              surface="dark"
              image={RETORA}
              label={'Audit · Analytics'}
              mark="wave"
              title="Retora Revision & Rådgivning"
              body="Replaced manual Excel analytics and duplicate work with real-time, multi-user audit collaboration."
              cta={{ label: 'Read their story →', href: `/${locale}/customer-stories/retora`, kind: 'link' }}
            />
            <EditorialCard
              surface="white"
              image={RETORA}
              label={'Audit\n/Analytics'}
              title="Retora Revision & Rådgivning"
              body="Replaced manual Excel analytics and duplicate work with real-time, multi-user audit collaboration."
              cta={{ label: 'Read their story', href: `/${locale}/customer-stories/retora` }}
            />
            <EditorialCard
              surface="none"
              image={RETORA}
              label={'Audit · Analytics'}
              mark="dot"
              title="Retora Revision & Rådgivning"
              body="Replaced manual Excel analytics and duplicate work with real-time, multi-user audit collaboration."
              cta={{ label: 'Read their story →', href: `/${locale}/customer-stories/retora`, kind: 'link' }}
            />
          </div>
        </SectionShell>

        <SectionShell py="loose">
          <Label>6 · Longer copy in caps (the worry)</Label>
          <div className="grid grid-cols-1 gap-2xl md:grid-cols-2 md:gap-large">
            {LONG.map((c) => (
              <EditorialCard key={c.title} {...c} titleSize="h4" mark="dot" cta={{ label: 'Read more', href: '#' }} />
            ))}
          </div>
        </SectionShell>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
