import { getClientLogos } from '@/lib/sanity/clients'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'
import { HeroBlock } from '@/components/blocks/HeroBlock'
import { HeroBackdropBlock } from '@/components/blocks/HeroBackdropBlock'
import { HeroImageOverlayCardBlock } from '@/components/blocks/HeroImageOverlayCardBlock'
import { HeroTextBlock } from '@/components/blocks/HeroTextBlock'
import { SectionHeadlineBlock } from '@/components/blocks/SectionHeadlineBlock'
import { FeatureSplitBlock } from '@/components/blocks/FeatureSplitBlock'
import { FeatureSplitDarkBlock } from '@/components/blocks/FeatureSplitDarkBlock'
import { FiftyFiftyBannerBlock } from '@/components/blocks/FiftyFiftyBannerBlock'
import { StepsBlock } from '@/components/blocks/StepsBlock'
import { FeatureGridBlock } from '@/components/blocks/FeatureGridBlock'
import { ParagraphsBlock } from '@/components/blocks/ParagraphsBlock'
import { FeatureListBlock } from '@/components/blocks/FeatureListBlock'
import { CardGridBlock } from '@/components/blocks/CardGridBlock'
import { ImageGridBlock } from '@/components/blocks/ImageGridBlock'
import { StatementBlock } from '@/components/blocks/StatementBlock'
import { BodyColumnsBlock } from '@/components/blocks/BodyColumnsBlock'
import { StackAnimationBlock } from '@/components/blocks/StackAnimationBlock'
import { LogoCloudBlock } from '@/components/blocks/LogoCloudBlock'
import { TestimonialCarouselBlock } from '@/components/blocks/TestimonialCarouselBlock'
import { TestimonialLargeBlock } from '@/components/blocks/TestimonialLargeBlock'
import { CaseStudyGridBlock } from '@/components/blocks/CaseStudyGridBlock'
import { StatBarsBlock } from '@/components/blocks/StatBarsBlock'
import { StatsBandBlock } from '@/components/blocks/StatsBandBlock'
import { PricingBlock } from '@/components/blocks/PricingBlock'
import { ComparisonTableBlock } from '@/components/blocks/ComparisonTableBlock'
import { CtaBannerBlock } from '@/components/blocks/CtaBannerBlock'
import { DarkBannerBlock } from '@/components/blocks/DarkBannerBlock'
import { FullWidthSingleBlock } from '@/components/blocks/FullWidthSingleBlock'
import { HorizontalScrollStackBlock } from '@/components/blocks/HorizontalScrollStackBlock'
import { BentoGridBlock } from '@/components/blocks/BentoGridBlock'
import { HorizontalScrollStackMediumBlock } from '@/components/blocks/HorizontalScrollStackMediumBlock'
import { MediaBlock } from '@/components/blocks/MediaBlock'
import { MediaCarouselBlock } from '@/components/blocks/MediaCarouselBlock'
import { ReleaseCardsBlock } from '@/components/blocks/ReleaseCardsBlock'
import { ReleaseTimelineBlock } from '@/components/blocks/ReleaseTimelineBlock'
import { FaqAccordionBlock } from '@/components/blocks/FaqAccordionBlock'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Button } from '@/components/ui/Button'
import { MenuShowcase } from './MenuShowcase'

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
    <div className="mx-auto w-full max-w-page px-medium-large md:px-gutter pt-3xl pb-medium-large">
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
    <div className="mx-auto flex w-full max-w-page items-center gap-medium-large px-medium-large md:px-gutter py-medium">
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

const RELEASE_CARDS = [
  { tag: 'analysis' as const, title: 'Lorem ipsum dolor sit amet', description: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '1 Oct 2026', team: [{ name: 'Lorem Ipsum' }, { name: 'Dolor Sit' }, { name: 'Amet Elit' }] },
  { tag: 'audit' as const, title: 'Ut enim ad minim veniam', description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', date: '24 Sep 2026' },
  { tag: 'customerService' as const, title: 'Duis aute irure dolor', description: 'In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', date: '17 Sep 2026', stage: 'rollingOut' as const },
]

// Dated relative to today, so the showcase always has this month, a
// month still within the last six, and one behind "Show earlier".
const monthsAgo = (months: number, day: number) => {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months, day)).toISOString().slice(0, 10)
}
const TIMELINE_RELEASES = [
  { _id: 't1', tag: 'customerService' as const, title: 'Duis aute irure dolor', description: 'In reprehenderit in voluptate velit esse cillum dolore.', stage: 'rollingOut' as const },
  { _id: 't2', tag: 'analysis' as const, ai: true, title: 'Lorem ipsum dolor sit amet', description: 'Consectetur adipiscing elit, sed do eiusmod tempor.', stage: 'shipped' as const, date: monthsAgo(0, 2) },
  { _id: 't3', tag: 'audit' as const, title: 'Ut enim ad minim veniam', description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip.', stage: 'shipped' as const, date: monthsAgo(1, 24) },
  { _id: 't4', tag: 'audit' as const, title: 'Excepteur sint occaecat', description: 'Cupidatat non proident, sunt in culpa qui officia.', stage: 'shipped' as const, date: monthsAgo(1, 10) },
  { _id: 't5', tag: 'analysis' as const, title: 'Sed ut perspiciatis', description: 'Unde omnis iste natus error sit voluptatem.', stage: 'shipped' as const, date: monthsAgo(8, 15) },
  { _id: 't6', tag: 'audit' as const, title: 'Nemo enim ipsam', description: 'Voluptatem quia voluptas sit aspernatur aut odit.', stage: 'development' as const },
]

const CAROUSEL_SLIDES = [
  { title: 'Lorem ipsum dolor.', body: 'Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { title: 'Ut enim ad minim.', body: 'Veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', note: 'Lorem ipsum fine print.' },
  { title: 'Duis aute irure.', body: 'Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
  { title: 'Excepteur sint.', body: 'Occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
]

const STORY_CARDS = [
  { companyName: 'Lorem Ipsum', slug: 'lorem', products: ['audit'], summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.' },
  { companyName: 'Dolor Sit', slug: 'dolor', products: ['audit', 'analytics'], summary: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.' },
  { companyName: 'Amet Consectetur', slug: 'amet', products: ['analytics'], summary: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.' },
  { companyName: 'Adipiscing Elit', slug: 'adipiscing', products: ['audit'], summary: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.' },
]

export default async function BlocksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Real logo images, unlike everything else on this page — Logo
  // Cloud has no text fallback, only images, so Lorem Ipsum names
  // alone would render as empty slots.
  const clientLogos = await getClientLogos()

  return (
    <>
      <SiteHeader locale={locale} path={`/${locale}/blocks`} />

      <div className="mx-auto w-full max-w-page px-medium-large md:px-gutter py-2xl">
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
      <BlockCaption name="Hero — 50/50 Split" type="heroBlock" variant='layout: "splitEven"' />
      <HeroBlock
        layout="splitEven"
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
      <BlockCaption
        name="Hero — Image Overlay Card (experimental, dark 50%)"
        type="heroImageOverlayCardBlock"
        variant='cardBackground: "dark", cardWidth: "50"'
      />
      <HeroImageOverlayCardBlock
        cardBackground="dark"
        cardWidth="50"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Hero — Image Overlay Card (dark 50%, rules around the headline + Senseworks mark)"
        type="heroImageOverlayCardBlock"
        variant='cardBackground: "dark", cardWidth: "50", headlineRules: true, showBrandmark: true'
      />
      <HeroImageOverlayCardBlock
        cardBackground="dark"
        cardWidth="50"
        headlineRules
        showBrandmark
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Hero — Image Overlay Card (experimental, gradient 100%)"
        type="heroImageOverlayCardBlock"
        variant='cardBackground: "gradient", cardWidth: "100"'
      />
      <HeroImageOverlayCardBlock
        cardBackground="gradient"
        cardWidth="100"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Hero — Image Overlay Card (experimental, dark desktop / gradient mobile card)"
        type="heroImageOverlayCardBlock"
        variant='cardBackground: "dark", cardBackgroundMobile: "gradient", cardWidth: "100"'
      />
      <HeroImageOverlayCardBlock
        cardBackground="dark"
        cardBackgroundMobile="gradient"
        cardWidth="100"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Hero — Image Overlay Card (experimental, accent tone around video)"
        type="heroImageOverlayCardBlock"
        variant='cardBackground: "dark", cardWidth: "50", tone: "accent"'
      />
      <HeroImageOverlayCardBlock
        cardBackground="dark"
        cardWidth="50"
        tone="accent"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Hero — Image Overlay Card (experimental, gradient tone around video)"
        type="heroImageOverlayCardBlock"
        variant='cardBackground: "dark", cardWidth: "50", tone: "gradient"'
      />
      <HeroImageOverlayCardBlock
        cardBackground="dark"
        cardWidth="50"
        tone="gradient"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Hero — Scroll Reveal (experimental, full-width media, keep scrolling)"
        type="heroBlock"
        variant='layout: "scrollReveal", mediaWidth: "full"'
      />
      <HeroBlock
        layout="scrollReveal"
        mediaWidth="full"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Hero — Scroll Reveal (experimental, content-width media, keep scrolling)"
        type="heroBlock"
        variant='layout: "scrollReveal", mediaWidth: "content"'
      />
      <HeroBlock
        layout="scrollReveal"
        mediaWidth="content"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Hero — Backdrop (experimental, gradient bg)"
        type="heroBackdropBlock"
        variant='backgroundType: "gradient"'
      />
      <HeroBackdropBlock
        backgroundType="gradient"
        textTone="dark"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Hero — Backdrop (experimental, color bg)"
        type="heroBackdropBlock"
        variant='backgroundType: "color"'
      />
      <HeroBackdropBlock
        backgroundType="color"
        backgroundColor="foreground"
        textTone="light"
        eyebrow={EYEBROW}
        headline={HEADING}
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption name="Hero — Text Only" type="heroTextBlock" />
      <HeroTextBlock eyebrow={EYEBROW} headline={HEADING} subhead={BODY} ctaLabel="Lorem ipsum" ctaHref="#" />
      {/* The background options: Light, Dark (accent eyebrow and button), Accent. */}
      <HeroTextBlock eyebrow={EYEBROW} headline={HEADING} subhead={BODY} ctaLabel="Lorem ipsum" ctaHref="#" boundary={false} tone="default" />
      <HeroTextBlock eyebrow={EYEBROW} headline={HEADING} subhead={BODY} ctaLabel="Lorem ipsum" ctaHref="#" boundary={false} tone="inverse" />
      <HeroTextBlock eyebrow={EYEBROW} headline={HEADING} subhead={BODY} ctaLabel="Lorem ipsum" ctaHref="#" boundary={false} tone="accent" />
      <BlockCaption name="Hero — Text, Typing effect (display, dark)" type="heroTextBlock" variant='typingHeadline: true, headlineSize: "display", tone: "inverse"' />
      <HeroTextBlock
        eyebrow={EYEBROW}
        headline="More genius. Less grunt."
        subhead={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        boundary={false}
        tone="inverse"
        headlineSize="display"
        typingHeadline
      />

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
      <BlockCaption name="Section Headline — H1 size" type="sectionHeadlineBlock" variant='size: "h1"' />
      <SectionHeadlineBlock eyebrow={EYEBROW} headline={HEADING} body={BODY} size="h1" />

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
      <BlockCaption name="50/50 Banner — Image Right" type="fiftyFiftyBannerBlock" variant='imagePosition: "right"' />
      <FiftyFiftyBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Get started"
        ctaHref="#"
        imagePosition="right"
      />
      <BlockCaption name="50/50 Banner — Image Left" type="fiftyFiftyBannerBlock" variant='imagePosition: "left"' />
      <FiftyFiftyBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Get started"
        ctaHref="#"
        imagePosition="left"
      />
      <BlockCaption name="Steps" type="stepsBlock" />
      <SectionHeadlineBlock eyebrow={EYEBROW} headline="How it works" body={BODY} spacing="tight" />
      <StepsBlock
        items={[
          { title: 'Setting goals', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
          { title: 'Developing a prototype', body: 'Sed do eiusmod tempor incididunt ut labore et dolore.' },
          { title: 'Coding and programming', body: 'Ut enim ad minim veniam, quis nostrud exercitation.' },
          { title: 'Testing and optimizing', body: 'Duis aute irure dolor in reprehenderit in voluptate.' },
        ]}
      />
      <BlockCaption name="Paragraphs" type="paragraphsBlock" variant="text, text, empty" />
      <ParagraphsBlock
        items={[
          { _type: 'paragraph', title: 'Lorem ipsum dolor', text: `${BODY}\n\n${BODY}` },
          { _type: 'paragraph', title: 'Sit amet consectetur', text: BODY },
          { _type: 'emptyColumn' },
        ]}
      />
      <BlockCaption name="Paragraphs — 4 columns, H6, inline" type="paragraphsBlock" variant='columns: "4", empty first' />
      <ParagraphsBlock
        columns="4"
        titleSize="h6"
        headingLayout="inline"
        items={[
          { _type: 'emptyColumn' },
          { _type: 'paragraph', title: 'Lorem ipsum dolor.', text: BODY },
          { _type: 'paragraph', title: 'Sit amet consectetur.', text: BODY },
          { _type: 'paragraph', title: 'Adipiscing elit sed.', text: BODY },
        ]}
      />
      <BlockCaption name="Feature Grid" type="featureGridBlock" />
      <FeatureGridBlock
        items={[
          { title: 'Lorem ipsum dolor', description: BODY, ctaLabel: 'Lorem ipsum', ctaHref: '#' },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption
        name="Section Headline + Feature Grid — both Dark, set as one band"
        type="sectionHeadlineBlock + featureGridBlock"
        variant='tone: "inverse" on both (headline: Bottom padding Tight, Section spacing None; below: Top padding None)'
      />
      <SectionHeadlineBlock tone="inverse" paddingBottom="tight" spacing="none" align="left" eyebrow="Eyebrow" headline="Lorem ipsum dolor sit amet" />
      <FeatureGridBlock
        tone="inverse"
        paddingTop="none"
        items={[
          { icon: 'lock', title: 'Lorem ipsum dolor', description: BODY, ctaLabel: 'Lorem ipsum', ctaHref: '#' },
          { title: 'Sit amet consectetur', description: BODY },
          { icon: 'bolt_boost', title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption name="Feature Grid — inline links" type="featureGridBlock" variant='linkStyle: "inline"' />
      <FeatureGridBlock
        linkStyle="inline"
        items={[
          { title: 'Lorem ipsum dolor', description: BODY, ctaLabel: 'Lorem ipsum', ctaHref: '#' },
          { title: 'Sit amet consectetur', description: BODY, ctaLabel: 'Dolor sit amet', ctaHref: '#' },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption name="Feature Grid — 4 Columns" type="featureGridBlock" variant='columns: "4"' />
      <FeatureGridBlock
        columns="4"
        items={[
          { title: 'Lorem ipsum dolor', description: BODY },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
          { title: 'Do eiusmod tempor', description: BODY },
        ]}
      />
      <BlockCaption name="Feature Grid — H3 titles" type="featureGridBlock" variant='titleSize: "h3"' />
      <FeatureGridBlock
        titleSize="h3"
        items={[
          { title: 'Lorem ipsum dolor', description: BODY },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption name="Feature Grid — H5 titles" type="featureGridBlock" variant='titleSize: "h5"' />
      <FeatureGridBlock
        titleSize="h5"
        items={[
          { title: 'Lorem ipsum dolor', description: BODY },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption name="Feature List" type="featureListBlock" />
      <FeatureListBlock
        items={[
          { label: 'Lorem ipsum dolor sit amet', body: BODY },
          { label: 'Consectetur adipiscing elit', body: BODY },
        ]}
      />
      <BlockCaption name="Feature List — H5 body" type="featureListBlock" variant='bodySize: "h5"' />
      <FeatureListBlock
        bodySize="h5"
        items={[
          { label: 'Lorem ipsum dolor sit amet', body: BODY },
          { label: 'Consectetur adipiscing elit', body: BODY },
        ]}
      />
      <BlockCaption name="Feature List — H4 body" type="featureListBlock" variant='bodySize: "h4"' />
      <FeatureListBlock
        bodySize="h4"
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
      <BlockCaption
        name="Section Headline + Card Grid — both Dark, set as one band"
        type="sectionHeadlineBlock + cardGridBlock"
        variant='tone: "inverse" / background: "inverse" (headline: Bottom padding Tight, Section spacing None; below: Top padding None)'
      />
      <SectionHeadlineBlock tone="inverse" paddingBottom="tight" spacing="none" align="left" eyebrow="Eyebrow" headline="Lorem ipsum dolor sit amet" />
      <CardGridBlock
        columns="3"
        background="inverse"
        paddingTop="none"
        items={[
          { eyebrow: '01 — Lorem', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 — Ipsum', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 — Dolor', heading: 'Adipiscing elit sed', body: BODY },
        ]}
      />
      <BlockCaption name="Card Grid — Dark accent gradient background" type="cardGridBlock" variant='background: "accentDark", tone: "dark"' />
      <CardGridBlock
        columns="3"
        background="accentDark"
        tone="dark"
        items={[
          { eyebrow: '01 — Lorem', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 — Ipsum', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 — Dolor', heading: 'Adipiscing elit sed', body: BODY },
        ]}
      />
      <BlockCaption name="Statement + Body Columns" type="statementBlock + bodyColumnsBlock" variant='no background; Statement spacing "medium"' />
      <StatementBlock text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud." spacing="medium" />
      <BodyColumnsBlock items={[{ text: BODY_LONG }, { text: BODY_LONG }]} />
      <BlockCaption
        name="Statement + Body Columns — Dark, as one band"
        type="statementBlock + bodyColumnsBlock"
        variant='tone: "inverse" on both; Statement paddingBottom "medium", spacing "none"; Body Columns paddingTop "none"'
      />
      <StatementBlock text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud." tone="inverse" paddingBottom="medium" spacing="none" />
      <BodyColumnsBlock tone="inverse" paddingTop="none" items={[{ text: BODY_LONG }, { text: BODY_LONG }]} />
      <BlockCaption name="Body Columns — stacked titles" type="bodyColumnsBlock" variant='titles; headingLayout: "stacked", titleSize: "h4"' />
      <BodyColumnsBlock
        items={[
          { title: 'Lorem ipsum dolor', text: BODY_LONG },
          { title: 'Sit amet consectetur', text: BODY_LONG },
        ]}
      />
      <BlockCaption name="Body Columns — inline titles" type="bodyColumnsBlock" variant='titles; headingLayout: "inline"' />
      <BodyColumnsBlock
        headingLayout="inline"
        items={[
          { title: 'Lorem ipsum dolor.', text: BODY_LONG },
          { title: 'Sit amet consectetur.', text: BODY_LONG },
        ]}
      />
      <BlockCaption name="Body Columns — 3 columns" type="bodyColumnsBlock" variant='columns: "3"' />
      <BodyColumnsBlock columns="3" items={[{ text: BODY_LONG }, { text: BODY_LONG }, { text: BODY_LONG }]} />
      <BlockCaption name="Stack Animation" type="stackAnimationBlock" variant="interactive — click a circle or dot, or use ← →" />
      <StackAnimationBlock />
      <BlockCaption name="Image Grid" type="imageGridBlock" variant='columns: "3" — a rounded 7:5 image above each item, the text not in a card' />
      <ImageGridBlock
        columns="3"
        items={[
          { eyebrow: '01 — Lorem', title: 'Lorem ipsum dolor', description: BODY, ctaLabel: 'Lorem ipsum', ctaHref: '#' },
          { eyebrow: '02 — Ipsum', title: 'Sit amet consectetur', description: BODY },
          { eyebrow: '03 — Dolor', title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption name="Image Grid — Dark background" type="imageGridBlock" variant='tone: "inverse"' />
      <ImageGridBlock
        columns="3"
        tone="inverse"
        items={[
          { eyebrow: '01 — Lorem', title: 'Lorem ipsum dolor', description: BODY, ctaLabel: 'Lorem ipsum', ctaHref: '#' },
          { eyebrow: '02 — Ipsum', title: 'Sit amet consectetur', description: BODY },
          { eyebrow: '03 — Dolor', title: 'Adipiscing elit sed', description: BODY },
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
      <BlockCaption name="Card Grid — Dark" type="cardGridBlock" variant='tone: "dark", contentGap: "tight", with button' />
      <CardGridBlock
        columns="3"
        tone="dark"
        items={[
          { eyebrow: '01 — Lorem', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 — Ipsum', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 — Dolor', heading: 'Adipiscing elit sed', body: BODY },
        ]}
      />
      <BlockCaption name="Card Grid — Accent" type="cardGridBlock" variant='tone: "accent"' />
      <CardGridBlock
        columns="3"
        tone="accent"
        items={[
          { eyebrow: '01 — Lorem', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 — Ipsum', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 — Dolor', heading: 'Adipiscing elit sed', body: BODY },
        ]}
      />
      <BlockCaption name="Card Grid — H3 Heading" type="cardGridBlock" variant='headingLevel: "h3"' />
      <CardGridBlock
        columns="3"
        headingLevel="h3"
        items={[
          { eyebrow: '01 — Lorem', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 — Ipsum', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 — Dolor', heading: 'Adipiscing elit sed', body: BODY },
        ]}
      />
      <BlockCaption
        name="Card Grid — Numbered Eyebrow, Dark"
        type="cardGridBlock"
        variant='numberedEyebrow: true, tone: "dark"'
      />
      <CardGridBlock
        columns="3"
        tone="dark"
        numberedEyebrow
        items={[
          { eyebrow: '01 TID', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 KVALITET', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 EGENART', heading: 'Adipiscing elit sed', body: BODY },
        ]}
      />
      <BlockCaption
        name="Card Grid — Merged, Dark"
        type="cardGridBlock"
        variant='numberedEyebrow: true, tone: "dark", layout: "merged"'
      />
      <CardGridBlock
        columns="3"
        tone="dark"
        numberedEyebrow
        layout="merged"
        items={[
          { eyebrow: '01 TID', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 KVALITET', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 EGENART', heading: 'Adipiscing elit sed', body: BODY },
        ]}
      />
      <BlockCaption
        name="Card Grid — Numbered Eyebrow, Default"
        type="cardGridBlock"
        variant='numberedEyebrow: true'
      />
      <CardGridBlock
        columns="3"
        numberedEyebrow
        items={[
          { eyebrow: '01 TID', heading: 'Lorem ipsum dolor', body: BODY },
          { eyebrow: '02 KVALITET', heading: 'Sit amet consectetur', body: BODY },
          { eyebrow: '03 EGENART', heading: 'Adipiscing elit sed', body: BODY },
        ]}
      />

      <GroupHeading>Social Proof</GroupHeading>
      <BlockCaption name="Logo Cloud" type="logoCloudBlock" />
      <LogoCloudBlock logos={clientLogos} />
      <BlockCaption name="Logo Cloud — Accent" type="logoCloudBlock" variant='tone: "accent"' />
      <LogoCloudBlock logos={clientLogos} tone="accent" />
      <BlockCaption name="Testimonial Carousel" type="testimonialCarouselBlock" />
      <TestimonialCarouselBlock
        items={[
          { quote: BODY, authorName: 'Lorem Ipsum', authorRole: 'Lorem, Ipsum' },
          { quote: BODY, authorName: 'Dolor Sit', authorRole: 'Dolor, Sit' },
          { quote: BODY, authorName: 'Amet Consectetur', authorRole: 'Amet, Consectetur' },
        ]}
      />
      <BlockCaption name="Testimonial — Large" type="testimonialLargeBlock" />
      <TestimonialLargeBlock quote={BODY_LONG} authorName="Lorem Ipsum" authorRole="Lorem, Ipsum" />
      <BlockCaption name="Testimonial — Large, Dark accent gradient" type="testimonialLargeBlock" variant='tone: "accentDark"' />
      <TestimonialLargeBlock quote={BODY_LONG} authorName="Lorem Ipsum" authorRole="Lorem, Ipsum" tone="accentDark" />
      <BlockCaption name="Release Cards" type="releaseCardsBlock" />
      <ReleaseCardsBlock cards={RELEASE_CARDS} />

      <BlockCaption name="Releases Timeline" type="releaseTimelineBlock" />
      <ReleaseTimelineBlock releases={TIMELINE_RELEASES} rollingOutBody="Lorem ipsum dolor sit amet." developmentBody="Consectetur adipiscing elit." />
      <BlockCaption name="Media Carousel" type="mediaCarouselBlock" />
      <MediaCarouselBlock eyebrow={EYEBROW} heading={HEADING} body={BODY} slides={CAROUSEL_SLIDES} />
      <BlockCaption name="Media Carousel — Dark" type="mediaCarouselBlock" variant='tone: "dark"' />
      <MediaCarouselBlock tone="dark" eyebrow={EYEBROW} heading={HEADING} body={BODY} slides={CAROUSEL_SLIDES} />
      <BlockCaption name="Case Study Carousel" type="caseStudyGridBlock" variant="stories come from Customer story documents" />
      <CaseStudyGridBlock stories={STORY_CARDS} />
      <BlockCaption name="Case Study Carousel — Dark" type="caseStudyGridBlock" variant='tone: "dark"' />
      <CaseStudyGridBlock tone="dark" stories={STORY_CARDS} />
      <BlockCaption name="Stat Bars" type="statBarsBlock" variant='style: "bars"' />
      <StatBarsBlock paddingTop="medium" paddingBottom="medium" items={[
          { value: '4 av 5', label: 'Lorem ipsum dolor sit amet consectetur' },
          { value: '62 %', label: 'Adipiscing elit sed do eiusmod' },
          { value: '20 %', label: 'Tempor incididunt ut labore' },
        ]} source="Källa: Lorem ipsum 2025" />
      <BlockCaption name="Stat Bars — Dark background" type="statBarsBlock" variant='style: "bars", tone: "inverse"' />
      <StatBarsBlock tone="inverse" items={[
          { value: '4 av 5', label: 'Lorem ipsum dolor sit amet consectetur' },
          { value: '62 %', label: 'Adipiscing elit sed do eiusmod' },
          { value: '20 %', label: 'Tempor incididunt ut labore' },
        ]} />
      <BlockCaption name="Stat Bars — Accent background" type="statBarsBlock" variant='style: "bars", tone: "accent"' />
      <StatBarsBlock tone="accent" items={[
          { value: '4 av 5', label: 'Lorem ipsum dolor sit amet consectetur' },
          { value: '62 %', label: 'Adipiscing elit sed do eiusmod' },
          { value: '20 %', label: 'Tempor incididunt ut labore' },
        ]} />
      <BlockCaption name="Stat Bars — Dots" type="statBarsBlock" variant='style: "dots"' />
      <StatBarsBlock style="dots" paddingTop="medium" paddingBottom="medium" items={[
          { value: '4 av 5', label: 'Lorem ipsum dolor sit amet consectetur' },
          { value: '62 %', label: 'Adipiscing elit sed do eiusmod' },
          { value: '20 %', label: 'Tempor incididunt ut labore' },
        ]} source="Källa: Lorem ipsum 2025" />
      <BlockCaption name="Stat Bars — Dots, dark background" type="statBarsBlock" variant='style: "dots", tone: "inverse"' />
      <StatBarsBlock style="dots" tone="inverse" items={[
          { value: '4 av 5', label: 'Lorem ipsum dolor sit amet consectetur' },
          { value: '62 %', label: 'Adipiscing elit sed do eiusmod' },
          { value: '20 %', label: 'Tempor incididunt ut labore' },
        ]} />
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
      <BlockCaption name="Stats Band — Dark background" type="statsBandBlock" variant='tone: "dark"' />
      <StatsBandBlock
        tone="dark"
        contentGap="tight"
        closingText={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        heading={HEADING}
        items={[
          { value: '00%', label: 'Lorem ipsum dolor' },
          { value: '000+', label: 'Sit amet consectetur' },
          { value: '00%', label: 'Adipiscing elit sed' },
          { value: '00M', label: 'Do eiusmod tempor' },
        ]}
      />
      <BlockCaption name="Stats Band — Accent background" type="statsBandBlock" variant='tone: "accent"' />
      <StatsBandBlock
        tone="accent"
        heading={HEADING}
        items={[
          { value: '00%', label: 'Lorem ipsum dolor' },
          { value: '000+', label: 'Sit amet consectetur' },
          { value: '00%', label: 'Adipiscing elit sed' },
          { value: '00M', label: 'Do eiusmod tempor' },
        ]}
      />
      <BlockCaption name="Stats Band — Image background" type="statsBandBlock" variant='tone: "image" (placeholder, no photo set)' />
      <StatsBandBlock
        tone="image"
        heading={HEADING}
        items={[
          { value: '00%', label: 'Lorem ipsum dolor' },
          { value: '000+', label: 'Sit amet consectetur' },
          { value: '00%', label: 'Adipiscing elit sed' },
          { value: '00M', label: 'Do eiusmod tempor' },
        ]}
      />
      <BlockCaption name="Stats Band — Muted background" type="statsBandBlock" variant='tone: "muted"' />
      <StatsBandBlock
        tone="muted"
        heading={HEADING}
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
      <BlockCaption name="Comparison Table — Open, Accent" type="comparisonTableBlock" variant='style: "open", highlightColor: "accent", showLogo' />
      <ComparisonTableBlock
        style="open"
        columns={[{ label: 'Senseworks', highlighted: true }, { label: 'Generic AI & spreadsheets' }]}
        rows={[
          { label: 'Built on 10+ years of audit experience', cells: [{ type: 'check' }, { type: 'cross' }] },
          { label: 'ISA and ISA for LCE built in', cells: [{ type: 'check' }, { type: 'cross' }] },
          { label: 'Connected to Fortnox, Spiris and the banks', cells: [{ type: 'check' }, { type: 'partial' }] },
          { label: 'Every finding linked to its source', cells: [{ type: 'check' }, { type: 'cross' }] },
        ]}
      />
      <BlockCaption name="Comparison Table — Open, Dark" type="comparisonTableBlock" variant='style: "open", highlightColor: "dark"' />
      <ComparisonTableBlock
        style="open"
        highlightColor="dark"
        columns={[{ label: 'Senseworks', highlighted: true }, { label: 'Generic AI & spreadsheets' }]}
        rows={[
          { label: 'Built on 10+ years of audit experience', cells: [{ type: 'check' }, { type: 'cross' }] },
          { label: 'ISA and ISA for LCE built in', cells: [{ type: 'check' }, { type: 'cross' }] },
          { label: 'Connected to Fortnox, Spiris and the banks', cells: [{ type: 'check' }, { type: 'partial' }] },
          { label: 'Every finding linked to its source', cells: [{ type: 'check' }, { type: 'cross' }] },
        ]}
      />
      <BlockCaption name="Comparison Table — Open, Light grey, no logo" type="comparisonTableBlock" variant='style: "open", highlightColor: "muted", showLogo: false' />
      <ComparisonTableBlock
        style="open"
        highlightColor="muted"
        showLogo={false}
        columns={[{ label: 'Senseworks', highlighted: true }, { label: 'Generic AI & spreadsheets' }]}
        rows={[
          { label: 'Built on 10+ years of audit experience', cells: [{ type: 'check' }, { type: 'cross' }] },
          { label: 'ISA and ISA for LCE built in', cells: [{ type: 'check' }, { type: 'cross' }] },
          { label: 'Connected to Fortnox, Spiris and the banks', cells: [{ type: 'check' }, { type: 'partial' }] },
          { label: 'Every finding linked to its source', cells: [{ type: 'check' }, { type: 'cross' }] },
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
      <BlockCaption name="Full Width Single" type="fullWidthSingleBlock" />
      <FullWidthSingleBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
      />
      <BlockCaption
        name="Full Width Single — Real image (2:1 desktop crop + fade)"
        type="fullWidthSingleBlock"
        variant="media: a real uploaded image"
      />
      <FullWidthSingleBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        media={{
          mediaType: 'image',
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: 'image-514afea5d88ffb013be9c17be09f35668480f249-3240x1818-webp' },
          },
        }}
      />
      <BlockCaption
        name="Full Width Single — Two images, split with a gutter"
        type="fullWidthSingleBlock"
        variant="media + media2: both real images"
      />
      <FullWidthSingleBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        media={{
          mediaType: 'image',
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: 'image-514afea5d88ffb013be9c17be09f35668480f249-3240x1818-webp' },
          },
        }}
        media2={{
          mediaType: 'image',
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: 'image-514afea5d88ffb013be9c17be09f35668480f249-3240x1818-webp' },
          },
        }}
      />
      <BlockCaption
        name="Full Width Single — Media between heading and body"
        type="fullWidthSingleBlock"
        variant='mediaPosition: "afterHeading", align: "left"'
      />
      <FullWidthSingleBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        align="left"
        mediaPosition="afterHeading"
        media={{
          mediaType: 'image',
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: 'image-514afea5d88ffb013be9c17be09f35668480f249-3240x1818-webp' },
          },
        }}
      />
      <BlockCaption
        name="Full Width Single — Left, inverse"
        type="fullWidthSingleBlock"
        variant='align: "left", tone: "inverse"'
      />
      <FullWidthSingleBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        align="left"
        tone="inverse"
      />
      <BlockCaption
        name="Full Width Single — Padding top/bottom: none"
        type="fullWidthSingleBlock"
        variant='tone: "accent", paddingTop: "none", paddingBottom: "none"'
      />
      <FullWidthSingleBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        tone="accent"
        paddingTop="none"
        paddingBottom="none"
      />
      <BlockCaption
        name="Full Width Single — Numbered eyebrow, asymmetric padding"
        type="fullWidthSingleBlock"
        variant='numberedEyebrow: true, paddingTop: "tight", paddingBottom: "loose"'
      />
      <FullWidthSingleBlock
        eyebrow="01 Lorem ipsum"
        numberedEyebrow
        heading={HEADING}
        body={BODY}
        ctaLabel="Lorem ipsum"
        ctaHref="#"
        paddingTop="tight"
        paddingBottom="loose"
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
      <BlockCaption name="Dark Banner — Large icons" type="darkBannerBlock" variant="iconSize: large" />
      <DarkBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        iconSize="large"
        items={[
          { title: 'Lorem ipsum dolor', description: BODY },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption name="Dark Banner — No icons" type="darkBannerBlock" variant="showIcons: false" />
      <DarkBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        showIcons={false}
        items={[
          { title: 'Lorem ipsum dolor', description: BODY },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption name="Dark Banner — Accent" type="darkBannerBlock" variant='tone: "accent"' />
      <DarkBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        tone="accent"
        items={[
          { title: 'Lorem ipsum dolor', description: BODY },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption name="Dark Banner — White" type="darkBannerBlock" variant='tone: "white"' />
      <DarkBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        tone="white"
        items={[
          { title: 'Lorem ipsum dolor', description: BODY },
          { title: 'Sit amet consectetur', description: BODY },
          { title: 'Adipiscing elit sed', description: BODY },
        ]}
      />
      <BlockCaption
        name="Dark Banner — Inline title"
        type="darkBannerBlock"
        variant='tone: "white", headingLayout: "inline"'
      />
      <DarkBannerBlock
        eyebrow={EYEBROW}
        heading={HEADING}
        body={BODY}
        tone="white"
        headingLayout="inline"
        items={[
          { title: 'Lorem ipsum dolor.', description: BODY },
          { title: 'Sit amet consectetur.', description: BODY },
          { title: 'Adipiscing elit sed.', description: BODY },
        ]}
      />

      <BlockCaption
        name="Horizontal Scroll Stack (EXPERIMENTAL)"
        type="horizontalScrollStackBlock"
        variant="keep scrolling — desktop only, stacks normally on mobile"
      />
      <HorizontalScrollStackBlock
        panels={[
          {
            eyebrow: '01 Spara tid',
            heading: 'Tiden tas från insamlingen, inte från granskningen.',
            body: BODY,
            media: {
              mediaType: 'image',
              image: {
                _type: 'image',
                asset: { _type: 'reference', _ref: 'image-514afea5d88ffb013be9c17be09f35668480f249-3240x1818-webp' },
              },
            },
          },
          {
            eyebrow: '02 Kvalitet',
            heading: 'Vyn visar var granskningen står, inte vem som är sämst.',
            body: BODY,
            media: {
              mediaType: 'image',
              image: {
                _type: 'image',
                asset: { _type: 'reference', _ref: 'image-514afea5d88ffb013be9c17be09f35668480f249-3240x1818-webp' },
              },
            },
          },
          {
            eyebrow: '03 Egenart',
            heading: 'Lorem ipsum dolor sit amet consectetur adipiscing.',
            body: BODY,
            media: {
              mediaType: 'image',
              image: {
                _type: 'image',
                asset: { _type: 'reference', _ref: 'image-514afea5d88ffb013be9c17be09f35668480f249-3240x1818-webp' },
              },
            },
          },
        ]}
      />

      <GroupHeading>Media &amp; Content</GroupHeading>
      <BlockCaption name="Bento Grid" type="bentoGridBlock" />
      <BentoGridBlock
        columns="3"
        items={[
          { heading: 'Lorem ipsum', body: BODY, size: 'large' },
          { heading: 'Dolor sit', body: BODY, size: 'normal' },
          { heading: 'Amet consectetur', body: BODY, size: 'tall' },
          { heading: 'Adipiscing elit', body: BODY, size: 'normal' },
        ]}
      />
      <BlockCaption name="Bento Grid — H3 titles" type="bentoGridBlock" variant='titleSize: "h3"' />
      <BentoGridBlock
        columns="3"
        titleSize="h3"
        items={[
          { heading: 'Lorem ipsum', body: BODY, size: 'large' },
          { heading: 'Dolor sit', body: BODY, size: 'normal' },
          { heading: 'Amet consectetur', body: BODY, size: 'tall' },
          { heading: 'Adipiscing elit', body: BODY, size: 'normal' },
        ]}
      />
      <BlockCaption name="Bento Grid — cards open a pop-up" type="bentoGridBlock" variant="expandable: true" />
      <BentoGridBlock
        columns="3"
        expandable
        items={[
          { heading: 'Lorem ipsum', body: BODY, size: 'large' },
          { heading: 'Dolor sit', body: BODY, size: 'normal' },
          { heading: 'Amet consectetur', body: BODY, size: 'tall' },
          { heading: 'Adipiscing elit', body: BODY, size: 'normal' },
        ]}
      />
      <BlockCaption
        name="Section Headline + Bento Grid — both Dark, set as one band"
        type="sectionHeadlineBlock + bentoGridBlock"
        variant='tone: "inverse" on both (headline: Bottom padding Tight, Section spacing None; below: Top padding None)'
      />
      <SectionHeadlineBlock
        tone="inverse"
        paddingBottom="tight"
        spacing="none"
        align="left"
        eyebrow="Eyebrow"
        headline="Lorem ipsum dolor sit amet"
        body={BODY}
        ctaLabel="Book a walkthrough"
        ctaHref="#"
      />
      <BentoGridBlock
        columns="3"
        tone="inverse"
        paddingTop="none"
        expandable
        items={[
          { heading: 'Lorem ipsum', body: BODY, size: 'large' },
          { heading: 'Dolor sit', body: BODY, size: 'normal' },
          { heading: 'Amet consectetur', body: BODY, size: 'tall' },
          { heading: 'Adipiscing elit', body: BODY, size: 'normal' },
        ]}
      />
      <BlockCaption name="Bento Grid — Accent background" type="bentoGridBlock" variant='tone: "accent"' />
      <BentoGridBlock
        columns="3"
        tone="accent"
        items={[
          { heading: 'Lorem ipsum', body: BODY, size: 'large' },
          { heading: 'Dolor sit', body: BODY, size: 'normal' },
          { heading: 'Amet consectetur', body: BODY, size: 'tall' },
          { heading: 'Adipiscing elit', body: BODY, size: 'normal' },
        ]}
      />
      <BlockCaption name="Bento Grid — Dark accent gradient" type="bentoGridBlock" variant='tone: "accentDark"' />
      <BentoGridBlock
        columns="3"
        tone="accentDark"
        items={[
          { heading: 'Lorem ipsum', body: BODY, size: 'large' },
          { heading: 'Dolor sit', body: BODY, size: 'normal' },
          { heading: 'Amet consectetur', body: BODY, size: 'tall' },
          { heading: 'Adipiscing elit', body: BODY, size: 'normal' },
        ]}
      />
      <BlockCaption
        name="Horizontal Scroll Stack Medium — Dark accent gradient"
        type="horizontalScrollStackMediumBlock"
        variant='tone: "accentDark"'
      />
      <HorizontalScrollStackMediumBlock
        tone="accentDark"
        eyebrow="Eyebrow"
        heading="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod"
        body={BODY_LONG}
        slides={[
          { title: 'Lorem ipsum', body: BODY },
          { title: 'Dolor sit', body: BODY },
          { title: 'Amet consectetur', body: BODY },
        ]}
      />
      <BlockCaption name="Media" type="mediaBlock" />
      <MediaBlock />
      <BlockCaption name="Media — 3:1" type="mediaBlock" variant='ratio: "3:1"' />
      <MediaBlock ratio="3:1" />
      <BlockCaption name="Media — full screen width" type="mediaBlock" variant='width: "full"' />
      <MediaBlock width="full" />
      {/* No media set on purpose — a busy React-animation demo (a bright
          white UI card) fights the scrim/text instead of showing it
          off; the gradient placeholder reads closer to a real photo/
          video's brightness for checking legibility here. */}
      <BlockCaption name="Media — Text overlay, left aligned" type="mediaBlock" variant="align: 'left'" />
      <MediaBlock
        eyebrow="Faster reconciliation"
        headline="Every upload, matched automatically"
        body="Drop in bank statements and receipts — the platform matches, flags exceptions, and keeps a full audit trail."
        ctaLabel="See how it works"
        ctaHref="#"
        align="left"
      />
      <BlockCaption name="Media — Text overlay, center aligned" type="mediaBlock" variant="align: 'center'" />
      <MediaBlock
        eyebrow="Faster reconciliation"
        headline="Every upload, matched automatically"
        body="Drop in bank statements and receipts — the platform matches, flags exceptions, and keeps a full audit trail."
        ctaLabel="See how it works"
        ctaHref="#"
        align="center"
      />
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
      <BlockCaption
        name="Media — React Animation (Företag Table)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "foretagTableAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'foretagTableAnimation' }} />
      <BlockCaption
        name="Media — React Animation (Roster Fill)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "rosterFillAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'rosterFillAnimation' }} />
      <BlockCaption
        name="Media — React Animation (Customise)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "customiseAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'customiseAnimation' }} />
      <BlockCaption
        name="Media — React Animation (Integrations Screen)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "integrationsScreenAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'integrationsScreenAnimation' }} />
      <BlockCaption
        name="Media — React Animation (Ally Question)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "allyQuestionAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'allyQuestionAnimation' }} />
      <BlockCaption
        name="Media — React Animation (Ally Citation)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "allyCitationAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'allyCitationAnimation' }} />
      <BlockCaption
        name="Media — React Animation (Ally Open)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "allyOpenAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'allyOpenAnimation' }} />
      <BlockCaption
        name="Media — React Animation (Ally Call)"
        type="mediaBlock"
        variant='mediaType: "reactAnimation", animation: "allyCallAnimation"'
      />
      <MediaBlock media={{ mediaType: 'reactAnimation', animation: 'allyCallAnimation' }} />

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
      <div className="mx-auto w-full max-w-page px-medium-large md:px-gutter pb-medium-large">
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
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-medium-large px-medium-large md:px-gutter py-2xl">
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
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-medium-large px-medium-large md:px-gutter py-2xl">
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
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-medium-large px-medium-large md:px-gutter py-2xl">
        <Button href="#" animated>
          Lorem ipsum
        </Button>
      </div>

      <BlockCaption
        name="Book a meeting (modal)"
        type="@/components/ui/BookMeetingModal"
        variant='any Button / CTA with href: "#book-meeting" opens it'
      />
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-medium-large px-medium-large md:px-gutter py-2xl">
        <Button href="#book-meeting">Book a meeting</Button>
      </div>

      <BlockCaption
        name="Book a webinar (modal)"
        type="@/components/ui/BookWebinarModal"
        variant='any Button / CTA with href: "#book-webinar" opens it'
      />
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-medium-large px-medium-large md:px-gutter py-2xl">
        <Button href="#book-webinar">Book a webinar</Button>
      </div>

      <BlockCaption
        name="Menu"
        type="@/components/ui/Menu"
        variant="leadingIcon / trailingIcon are optional"
      />
      <div className="mx-auto flex w-full max-w-page items-start px-medium-large md:px-gutter py-2xl">
        <MenuShowcase />
      </div>

      <SiteFooter locale={locale} />
    </>
  )
}
