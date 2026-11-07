import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { EditorialCard, type EditorialMark, type EditorialSurface } from '@/components/ui/EditorialCard'
import { StoryCard, type StoryCardData } from '@/components/customer-stories/StoryCard'
import { CardGridBlock } from '@/components/blocks/CardGridBlock'
import { StickySplitBlock } from '@/components/blocks/StickySplitBlock'

// PREVIEW of the editorial card (ui/EditorialCard) with real Home v4 copy,
// boxed and with no fill, and the real Card Grid and Sticky Split blocks
// set to Card design: Editorial. Internal (noindex, see layout).

const ROLES = [
  { label: '— Ally', title: 'Answers in seconds.', body: 'What the standard says and what stands out in the data – with sources.' },
  { label: '— Our experts', title: 'On hand in minutes.', body: "Former auditors on the platform, the methodology and smarter ways of working. Often before you've thought to ask." },
  { label: '— You', title: 'The call is yours. Always.', body: 'You interpret the findings, make the judgment and turn insight into value for the client.' },
]

const LONG = [
  { label: '— Audit', title: 'From risk assessment to filing before lunch.', body: 'Senseworks brings the whole audit process into one connected workflow, from risk assessment to digital filing with the Swedish Companies Registration Office.' },
  { label: '— Analytics', title: 'From sample testing to the whole population without breaking a sweat.', body: '25+ ready-made analyses, from general ledger to tax account.' },
]

const RETORA: StoryCardData = {
  companyName: 'Retora Revision & Rådgivning',
  slug: 'retora',
  summary: 'Replaced manual Excel analytics and duplicate work with real-time, multi-user audit collaboration.',
  products: ['audit', 'analytics'],
  coverImage: { _type: 'image', asset: { _type: 'reference', _ref: 'image-336ec772e3c794f6d8a826c52c6c1765ef79c022-628x941-png' } },
}

function Label({ children }: { children: string }) {
  return <p className="mb-large text-eyebrow font-heading font-bold text-muted-foreground uppercase">{children}</p>
}

function Roles({ surface, onDark, mark, numbers }: { surface: EditorialSurface; onDark?: boolean; mark?: EditorialMark; numbers?: boolean }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 md:gap-large ${surface === 'none' ? 'gap-xl' : 'gap-medium'}`}>
      {ROLES.map((r, i) => (
        <EditorialCard key={r.title} {...r} number={numbers ? String(i + 1).padStart(2, '0') : undefined} surface={surface} onDark={onDark} mark={mark} />
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
          <Label>1 · No fill, numbered, no mark</Label>
          <Roles surface="none" numbers />
        </SectionShell>

        <SectionShell py="medium">
          <Label>2 · Boxed, dark, numbered, wave mark</Label>
          <Roles surface="dark" mark="wave" numbers />
        </SectionShell>

        <SectionShell py="medium">
          <Label>3 · Boxed, white, eyebrow only</Label>
          <Roles surface="white" />
        </SectionShell>

        <section className="bg-foreground">
          <SectionShell py="medium" pt="medium">
            <p className="mb-large text-eyebrow font-heading font-bold text-background/60 uppercase">4 · No fill on a dark background</p>
            <Roles surface="none" onDark mark="wave" numbers />
          </SectionShell>
        </section>

        <SectionShell py="medium" pt="medium">
          <Label>5 · Case study cards: the products become the label (dark + wave, white + button, no fill)</Label>
          <div className="grid grid-cols-1 gap-large md:grid-cols-3">
            <StoryCard story={RETORA} locale={locale} editorial={{ surface: 'dark', mark: 'wave', linkStyle: 'link' }} />
            <StoryCard story={RETORA} locale={locale} editorial={{ surface: 'white', linkStyle: 'button' }} />
            <StoryCard story={RETORA} locale={locale} editorial={{ surface: 'none', linkStyle: 'link' }} />
          </div>
        </SectionShell>

        <SectionShell py="loose">
          <Label>6 · Longer copy in caps (the worry)</Label>
          <div className="grid grid-cols-1 gap-2xl md:grid-cols-2 md:gap-large">
            {LONG.map((c) => (
              <EditorialCard key={c.title} {...c} titleSize="h4" action={{ label: 'Read more', href: '#', style: 'button' }} />
            ))}
          </div>
        </SectionShell>
        <SectionShell py="none" pt="medium">
          <Label>7 · The real Card Grid block: Editorial, no fill, numbered, text links</Label>
        </SectionShell>
        <CardGridBlock
          cardDesign="editorial"
          tone="none"
          cardNumbers
          columns="3"
          spacing="medium"
          items={ROLES.map((r) => ({ eyebrow: r.label, heading: r.title, body: r.body, ctaLabel: 'Read more →', ctaHref: '#' }))}
        />

        <SectionShell py="none" pt="medium">
          <Label>8 · The real Sticky Split block: Editorial cards, boxed dark, wave mark</Label>
        </SectionShell>
        <StickySplitBlock
          items={[
            { _type: 'textPiece', _key: 't', heading: 'Three roles. One team. Better audits.' },
            {
              _type: 'cardsPiece',
              _key: 'c',
              cardDesign: 'editorial',
              tone: 'dark',
              cardMark: 'wave',
              cardNumbers: true,
              items: ROLES.map((r, i) => ({ _key: String(i), eyebrow: r.label, heading: r.title, body: r.body })),
            },
          ]}
        />
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
