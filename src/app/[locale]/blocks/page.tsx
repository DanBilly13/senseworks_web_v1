import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import type { PageBlock } from '@/lib/sanity/getPage'
import { getClientLogos } from '@/lib/sanity/clients'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { HeroTextBlock } from '@/components/blocks/HeroTextBlock'
import { SectionHeadlineBlock } from '@/components/blocks/SectionHeadlineBlock'
import { FeatureSplitBlock } from '@/components/blocks/FeatureSplitBlock'
import { FeatureSplitDarkBlock } from '@/components/blocks/FeatureSplitDarkBlock'
import { FeatureGridBlock } from '@/components/blocks/FeatureGridBlock'
import { FeatureListBlock } from '@/components/blocks/FeatureListBlock'
import { CardGridBlock } from '@/components/blocks/CardGridBlock'
import { LogoCloudBlock } from '@/components/blocks/LogoCloudBlock'
import { TestimonialCarouselBlock } from '@/components/blocks/TestimonialCarouselBlock'
import { TestimonialLargeBlock } from '@/components/blocks/TestimonialLargeBlock'
import { CaseStudyGridBlock } from '@/components/blocks/CaseStudyGridBlock'
import { StatsBandBlock } from '@/components/blocks/StatsBandBlock'
import { PricingBlock } from '@/components/blocks/PricingBlock'
import { ComparisonTableBlock } from '@/components/blocks/ComparisonTableBlock'
import { CtaBannerBlock } from '@/components/blocks/CtaBannerBlock'
import { DarkBannerBlock } from '@/components/blocks/DarkBannerBlock'
import { BentoGridBlock } from '@/components/blocks/BentoGridBlock'
import { MediaBlock } from '@/components/blocks/MediaBlock'
import { FaqAccordionBlock } from '@/components/blocks/FaqAccordionBlock'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Button } from '@/components/ui/Button'

const EYEBROW = 'Lorem Ipsum'
const HEADING = 'Lorem ipsum dolor sit amet consectetur'
const BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
const BODY_LONG =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

// This page is a dev-only visual index of every block component and
// its variants — not a real CMS page — so it deliberately renders
// components directly with hardcoded Lorem Ipsum props rather than
// going through Sanity content.
function GroupHeading({ children }: { children: string }) {
  return (
    <div className="mx-auto w-full max-w-page px-medium-large pt-3xl pb-medium-large">
      <h2 className="text-h3 font-semibold text-foreground">{children}</h2>
    </div>
  )
}

// `type` is the exact Sanity `_type` / BlockRenderer key for this
// block — the identifier to use when specifying what goes on a page
// (in a migration script, or telling an agent what to add), not just
// a display label. `variant` calls out the prop value that produces
// this specific instance, when more than one instance shares a type.
function BlockCaption({ name, type, variant }: { name: string; type: string; variant?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-page items-center gap-medium-large px-medium-large py-medium">
      <span className="shrink-0 text-caption font-semibold text-muted-foreground uppercase">
        {name}
      </span>
      <code className="shrink-0 rounded-sm bg-muted px-small py-xs font-mono text-caption text-foreground">
        {type}
        {variant ? ` — ${variant}` : ''}
      </code>
      <hr className="h-px w-full flex-1 border-0 bg-border" />
    </div>
  )
}

export default async function BlocksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Real logo images, unlike everything else on this page — Logo
  // Cloud has no text fallback, only images, so Lorem Ipsum names
  // alone would render as empty slots.
  const [home, clientLogos] = await Promise.all([getPage('home', locale), getClientLogos()])

  if (!home) notFound()

  const header = home.blocks.find((block) => block._type === 'headerBlock')
  const footer = home.blocks.find((block) => block._type === 'footerBlock')

  return (
    <>
      {header && <BlockRenderer blocks={[header as PageBlock]} />}

      <div className="mx-auto w-full max-w-page px-medium-large py-2xl">
        <p className="text-caption font-semibold text-muted-foreground uppercase">
          Internal — Component Library
        </p>
        <p className="mt-small max-w-prose-md text-body text-muted-foreground">
          Every block we&rsquo;ve built, and its variants, rendered with Lorem Ipsum placeholder
          content for visual QA. Not real page content.
        </p>
      </div>

      <GroupHeading>Hero</GroupHeading>
      <BlockCaption name="Hero — Split" type="heroBlock" variant='layout: "split"' />
      <HeroBlock
        layout="split"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption name="Hero — Image Overlay" type="heroBlock" variant='layout: "imageOverlay"' />
      <HeroBlock
        layout="imageOverlay"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption name="Hero — Text Only" type="heroTextBlock" />
      <HeroTextBlock eyebrow={EYEBROW} headline={HEADING} subhead={BODY} ctaLabel="Lorem ipsum" ctaHref="#" />

      <GroupHeading>Section Dividers</GroupHeading>
      <BlockCaption name="Section Headline — Center" type="sectionHeadlineBlock" variant='align: "center"' />
      <SectionHeadlineBlock
        eyebrow={EYEBROW}
        headline={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        align="center"
      />
      <BlockCaption name="Section Headline — Left" type="sectionHeadlineBlock" variant='align: "left"' />
      <SectionHeadlineBlock eyebrow={EYEBROW} headline={HEADING} body={BODY} align="left" />

      <GroupHeading>Feature Sections</GroupHeading>
      <BlockCaption name="Feature Split — Image Left" type="featureSplitBlock" variant='imagePosition: "left"' />
      <FeatureSplitBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        imagePosition="left"
      />
      <BlockCaption name="Feature Split — Image Right" type="featureSplitBlock" variant='imagePosition: "right"' />
      <FeatureSplitBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        imagePosition="right"
      />
      <BlockCaption name="Feature Split — Dark" type="featureSplitDarkBlock" />
      <FeatureSplitDarkBlock heading={HEADING} subhead="Lorem ipsum dolor sit amet" body={BODY} ctaLabel="Lorem ipsum" ctaHref="#" />
      <BlockCaption name="Feature Grid" type="featureGridBlock" />
      <FeatureGridBlock
        items={[
          { title: 'Lorem ipsum dolor', description: BODY, ctaLabel: 'Lorem ipsum', ctaHref: '#' },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption name="Feature List" type="featureListBlock" />
      <FeatureListBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        items={[
          { label: 'Lorem ipsum dolor sit amet', body: BODY },
          { label: 'Consectetur adipiscing elit', body: BODY },
        ]}
      />
      <BlockCaption name="Card Grid — 3 Columns" type="cardGridBlock" variant='columns: "3"' />
      <CardGridBlock
        columns="3"
        items={[
          { eyebrow: '01 — Lorem', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 — Ipsum', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 — Dolor', heading: 'Adipiscing elit sed', body: BODY },
        ]}
      />
      <BlockCaption name="Card Grid — 4 Columns" type="cardGridBlock" variant='columns: "4"' />
      <CardGridBlock
        columns="4"
        items={[
          { eyebrow: '01 — Lorem', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 — Ipsum', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 — Dolor', heading: 'Adipiscing elit sed', body: BODY },
          { eyebrow: '04 — Sit', heading: 'Do eiusmod tempor', body: BODY },
        ]}
      />

      <GroupHeading>Social Proof</GroupHeading>
      <BlockCaption name="Logo Cloud" type="logoCloudBlock" />
      <LogoCloudBlock logos={clientLogos} />
      <BlockCaption name="Testimonial Carousel" type="testimonialCarouselBlock" />
      <TestimonialCarouselBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        items={[
          { quote: BODY, authorName: 'Lorem Ipsum', authorRole: 'Lorem, Ipsum' },
          { quote: BODY, authorName: 'Dolor Sit', authorRole: 'Dolor, Sit' },
          { quote: BODY, authorName: 'Amet Consectetur', authorRole: 'Amet, Consectetur' },
        ]}
      />
      <BlockCaption name="Testimonial — Large" type="testimonialLargeBlock" />
      <TestimonialLargeBlock quote={BODY_LONG} authorName="Lorem Ipsum" authorRole="Lorem, Ipsum" />
      <BlockCaption name="Case Study Card Grid" type="caseStudyGridBlock" />
      <CaseStudyGridBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        items={[
          {
            companyName: 'Lorem Ipsum',
            quote: BODY,
            personName: 'Lorem Ipsum',
            personRole: 'Lorem, Ipsum',
            ctaLabel: 'Lorem ipsum',
            ctaHref: '#',
          },
          {
            companyName: 'Dolor Sit',
            quote: BODY,
            personName: 'Dolor Sit',
            personRole: 'Dolor, Sit',
            ctaLabel: 'Lorem ipsum',
            ctaHref: '#',
          },
          {
            companyName: 'Amet Consectetur',
            quote: BODY,
            personName: 'Amet Consectetur',
            personRole: 'Amet, Consectetur',
            ctaLabel: 'Lorem ipsum',
            ctaHref: '#',
          },
        ]}
      />
      <BlockCaption name="Stats Band" type="statsBandBlock" />
      <StatsBandBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        items={[
          { value: '00%', label: 'Lorem ipsum dolor' },
          { value: '000+', label: 'Sit amet consectetur' },
          { value: '00%', label: 'Adipiscing elit sed' },
          { value: '00M', label: 'Do eiusmod tempor' },
        ]}
      />

      <GroupHeading>Conversion</GroupHeading>
      <BlockCaption name="Pricing Cards" type="pricingBlock" />
      <PricingBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        plans={[
          {
            name: 'Lorem',
            description: BODY,
            features: ['Lorem ipsum dolor', 'Sit amet consectetur', 'Adipiscing elit sed'],
            ctaLabel: 'Lorem ipsum',
            ctaHref: '#',
            featured: false,
          },
          {
            name: 'Ipsum',
            description: BODY,
            features: [
              'Lorem ipsum dolor',
              'Sit amet consectetur',
              'Adipiscing elit sed',
              'Do eiusmod tempor',
            ],
            ctaLabel: 'Lorem ipsum',
            ctaHref: '#',
            featured: true,
          },
        ]}
      />
      <BlockCaption name="Comparison Table" type="comparisonTableBlock" />
      <ComparisonTableBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        columns={[{ label: 'Lorem' }, { label: 'Ipsum', highlighted: true }, { label: 'Dolor' }]}
        rows={[
          { label: 'Lorem ipsum dolor', cells: [{ type: 'check' }, { type: 'check' }, { type: 'cross' }] },
          { label: 'Sit amet consectetur', cells: [{ type: 'cross' }, { type: 'check' }, { type: 'check' }] },
          {
            label: 'Adipiscing elit sed',
            cells: [{ type: 'partial' }, { type: 'check' }, { type: 'text', text: 'Lorem' }],
          },
        ]}
      />
      <BlockCaption name="CTA Banner — Inverse" type="ctaBannerBlock" variant='tone: "inverse"' />
      <CtaBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        secondaryCtaLabel="Lorem ipsum"
        secondaryCtaHref="#"
        tone="inverse"
      />
      <BlockCaption name="CTA Banner — Accent" type="ctaBannerBlock" variant='tone: "accent"' />
      <CtaBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        tone="accent"
      />
      <BlockCaption name="Dark Banner" type="darkBannerBlock" />
      <DarkBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        items={[
          { title: 'Lorem ipsum dolor', description: BODY },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />

      <GroupHeading>Media &amp; Content</GroupHeading>
      <BlockCaption name="Bento Grid" type="bentoGridBlock" />
      <BentoGridBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        columns="3"
        items={[
          { heading: 'Lorem ipsum', body: BODY, size: 'large' },
          { heading: 'Dolor sit', body: BODY, size: 'normal' },
          { heading: 'Amet consectetur', body: BODY, size: 'tall' },
          { heading: 'Adipiscing elit', body: BODY, size: 'normal' },
        ]}
      />
      <BlockCaption name="Media" type="mediaBlock" />
      <MediaBlock />
      <BlockCaption
        name="Media — React Animation (Upload Queue Loop)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "uploadQueueLoop"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'uploadQueueLoop' }} />
      <BlockCaption
        name="Media — React Animation (Integration Card Stack)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "integrationCardStack"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'integrationCardStack' }} />
      <BlockCaption
        name="Media — React Animation (Bevis Sidebar)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "bevisSidebarAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'bevisSidebarAnimation' }} />
      <BlockCaption
        name="Media — React Animation (Settings Form)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "settingsFormAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'settingsFormAnimation' }} />

      <GroupHeading>Support</GroupHeading>
      <BlockCaption name="FAQ Accordion" type="faqAccordionBlock" />
      <FaqAccordionBlock
        heading={HEADING}
        items={[
          { question: 'Lorem ipsum dolor sit amet?', answer: BODY },
          { question: 'Consectetur adipiscing elit?', answer: BODY },
          { question: 'Sed do eiusmod tempor incididunt?', answer: BODY },
        ]}
      />

      <GroupHeading>Primitives</GroupHeading>
      <div className="mx-auto w-full max-w-page px-medium-large pb-medium-large">
        <p className="max-w-prose-md text-body text-muted-foreground">
          The shared pieces every block above is built from — check here before asking for a new
          one-off eyebrow/heading/body/CTA layout or button style.
        </p>
      </div>

      <BlockCaption
        name="Section Intro — H1, Left"
        type="@/components/ui/SectionIntro"
        variant='as: "h1", align: "left"'
      />
      <SectionShell>
        <SectionIntro
          as="h1"
          eyebrow={EYEBROW}
          heading={HEADING}
          body={BODY}
          cta={<Button href="#">Lorem ipsum</Button>}
        />
      </SectionShell>

      <BlockCaption
        name="Section Intro — H2, Center"
        type="@/components/ui/SectionIntro"
        variant='as: "h2", align: "center"'
      />
      <SectionShell>
        <SectionIntro
          as="h2"
          eyebrow={EYEBROW}
          heading={HEADING}
          body={BODY}
          align="center"
          maxWidth="md"
          cta={<Button href="#">Lorem ipsum</Button>}
        />
      </SectionShell>

      <BlockCaption name="Section Intro — H3, No Eyebrow" type="@/components/ui/SectionIntro" variant='as: "h3"' />
      <SectionShell>
        <SectionIntro as="h3" heading={HEADING} body={BODY} />
      </SectionShell>

      <BlockCaption
        name="Section Intro — H4, With Eyebrow and Body"
        type="@/components/ui/SectionIntro"
        variant='as: "h4"'
      />
      <SectionShell>
        <SectionIntro as="h4" eyebrow="01 — Lorem Ipsum" heading={HEADING} body={BODY} />
      </SectionShell>

      <BlockCaption
        name="Section Intro — Inverse Tone"
        type="@/components/ui/SectionIntro"
        variant='tone: "inverse"'
      />
      <SectionShell sectionClassName="bg-foreground" pad="both">
        <SectionIntro
          as="h2"
          eyebrow={EYEBROW}
          heading={HEADING}
          body={BODY}
          tone="inverse"
          cta={
            <Button href="#" variant="filled-light">
              Lorem ipsum
            </Button>
          }
        />
      </SectionShell>

      <BlockCaption
        name="Button — Variants"
        type="@/components/ui/Button"
        variant='variant: "filled-dark" | "filled-accent" | "filled-light" | "ghost"'
      />
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-medium-large px-medium-large py-2xl">
        <Button href="#" variant="filled-dark">
          Lorem ipsum
        </Button>
        <Button href="#" variant="filled-accent">
          Lorem ipsum
        </Button>
        <Button href="#" variant="filled-light">
          Lorem ipsum
        </Button>
        <Button href="#" variant="ghost">
          Lorem ipsum
        </Button>
      </div>

      <BlockCaption name="Button — Sizes" type="@/components/ui/Button" variant='size: "sm" | "md"' />
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-medium-large px-medium-large py-2xl">
        <Button href="#" size="sm">
          Lorem ipsum
        </Button>
        <Button href="#" size="md">
          Lorem ipsum
        </Button>
      </div>

      <BlockCaption
        name="Button — Animated Hover"
        type="@/components/ui/Button"
        variant="animated: true — hover to see"
      />
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-medium-large px-medium-large py-2xl">
        <Button href="#" animated>
          Lorem ipsum
        </Button>
      </div>

      {footer && <BlockRenderer blocks={[footer as PageBlock]} />}
    </>
  )
}
