import { defineType, defineField, defineArrayMember } from 'sanity'
import { BlockListItem } from '../components/BlockListItem'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      // One document per page, both languages inside it, so the slug is
      // simply unique. Generated from the English title (the title is an
      // English/Swedish pair, see localizeSchema.ts).
      options: { source: (doc) => (doc.title as { en?: string } | undefined)?.en ?? '' },
      validation: (Rule) => Rule.required(),
    }),
    // Left over from when each language was its own page document; no
    // longer used, hidden so older pages' value doesn't confuse anyone.
    defineField({ name: 'language', type: 'string', readOnly: true, hidden: true }),
    defineField({
      name: 'theme',
      title: 'Page theme',
      description:
        'Swaps the accent color and the gradient for the whole page, matching the product areas: Default is the yellow marketing look, Revision is purple, Analysis is green.',
      type: 'string',
      options: {
        list: [
          { title: 'Default (yellow)', value: 'default' },
          { title: 'Revision (purple)', value: 'revision' },
          { title: 'Analysis (green)', value: 'analysis' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      description:
        'The header and footer come from "Site navigation" (edited once for every page). A landing page can show a shorter version: the logo and button only, and just the footer\'s bottom row.',
      type: 'string',
      options: {
        list: [
          { title: 'Full', value: 'full' },
          { title: 'Landing page (logo and button, short footer)', value: 'landing' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
    }),
    // Versions: a copy of a page to try something out on, without
    // touching the page itself. The team (team mode: open any page with
    // ?team=1) finds them in a small menu on the logo (Home's versions) or
    // on the page's menu item (Audit's, …). Promoting one to the live page
    // is done together with Claude, not from here.
    defineField({
      name: 'versionOf',
      title: 'Version of',
      description:
        'To try a new take on a page: duplicate the page (⋯ → Duplicate), give the copy its own address under it (e.g. home/bold-hero), then pick the page it\'s a version of here. It then shows in that page\'s versions menu for the team. Leave empty for normal pages.',
      type: 'reference',
      to: [{ type: 'page' }],
      options: { disableNew: true },
    }),
    defineField({
      name: 'versionNotes',
      title: 'Version notes',
      description: 'What this version is trying out. Only for the team; not shown on the site.',
      type: 'text',
      rows: 2,
      options: { localize: false } as object,
      hidden: ({ document }) => !document?.versionOf,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      description: 'The browser tab / search result title. Aim for under about 60 characters. Falls back to the site default if empty.',
      type: 'string',
      validation: (Rule) => Rule.max(70).warning('Search engines usually cut titles off past about 60 characters.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      description: 'The summary shown under the title in search results. Aim for under about 160 characters. Falls back to the site default if empty.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200).warning('Search engines usually cut descriptions off past about 160 characters.'),
    }),
    defineField({
      name: 'blocks',
      type: 'array',
      components: { item: BlockListItem },
      of: [
        // A–Z by each block's Studio title, so the "Add item" menu reads
        // alphabetically. Keep new blocks in that order.
        defineArrayMember({ type: 'fiftyFiftyBannerBlock' }),
        defineArrayMember({ type: 'bentoGridBlock' }),
        defineArrayMember({ type: 'bodyColumnsBlock' }),
        defineArrayMember({ type: 'blogPostsBlock' }),
        defineArrayMember({ type: 'cardGridBlock' }),
        defineArrayMember({ type: 'caseStudyGridBlock' }),
        defineArrayMember({ type: 'comparisonTableBlock' }),
        defineArrayMember({ type: 'customerStoriesListBlock' }),
        defineArrayMember({ type: 'ctaBannerBlock' }),
        defineArrayMember({ type: 'darkBannerBlock' }),
        defineArrayMember({ type: 'faqAccordionBlock' }),
        defineArrayMember({ type: 'featureGridBlock' }),
        defineArrayMember({ type: 'featureListBlock' }),
        defineArrayMember({ type: 'featureSplitBlock' }),
        defineArrayMember({ type: 'featureSplitDarkBlock' }),
        defineArrayMember({ type: 'fullWidthSingleBlock' }),
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'heroBackdropBlock' }),
        defineArrayMember({ type: 'heroImageOverlayCardBlock' }),
        defineArrayMember({ type: 'heroTextBlock' }),
        defineArrayMember({ type: 'horizontalScrollStackBlock' }),
        defineArrayMember({ type: 'horizontalScrollStackMediumBlock' }),
        defineArrayMember({ type: 'imageGridBlock' }),
        defineArrayMember({ type: 'knowledgeBankBlock' }),
        defineArrayMember({ type: 'logoCloudBlock' }),
        defineArrayMember({ type: 'mediaBlock' }),
        defineArrayMember({ type: 'mediaCarouselBlock' }),
        defineArrayMember({ type: 'paragraphsBlock' }),
        defineArrayMember({ type: 'pricingBlock' }),
        defineArrayMember({ type: 'releaseCardsBlock' }),
        defineArrayMember({ type: 'releaseTimelineBlock' }),
        defineArrayMember({ type: 'sectionHeadlineBlock' }),
        defineArrayMember({ type: 'statsBandBlock' }),
        defineArrayMember({ type: 'stackAnimationBlock' }),
        defineArrayMember({ type: 'statementBlock' }),
        defineArrayMember({ type: 'stepsBlock' }),
        defineArrayMember({ type: 'teamGridBlock' }),
        defineArrayMember({ type: 'testimonialCarouselBlock' }),
        defineArrayMember({ type: 'testimonialLargeBlock' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current', versionOf: 'versionOf.title.en' },
    prepare: ({ title, slug, versionOf }) => ({
      title,
      subtitle: [versionOf ? `Version of ${versionOf}` : null, slug ? `/${slug}` : null].filter(Boolean).join(' · '),
    }),
  },
})
