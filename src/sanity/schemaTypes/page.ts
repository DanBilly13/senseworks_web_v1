import { defineType, defineField, defineArrayMember } from 'sanity'
import { BlockListItem } from '../components/BlockListItem'
import { isUniqueInLanguage } from '../lib/isUniqueInLanguage'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      // Unique per language: the en and sv versions share a slug.
      options: { source: 'title', isUnique: isUniqueInLanguage },
      validation: (Rule) => Rule.required(),
    }),
    // Set by @sanity/document-internationalization — not hand-edited.
    defineField({ name: 'language', type: 'string', readOnly: true }),
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
        defineArrayMember({ type: 'cardGridBlock' }),
        defineArrayMember({ type: 'caseStudyGridBlock' }),
        defineArrayMember({ type: 'comparisonTableBlock' }),
        defineArrayMember({ type: 'ctaBannerBlock' }),
        defineArrayMember({ type: 'darkBannerBlock' }),
        defineArrayMember({ type: 'faqAccordionBlock' }),
        defineArrayMember({ type: 'featureGridBlock' }),
        defineArrayMember({ type: 'featureListBlock' }),
        defineArrayMember({ type: 'featureSplitBlock' }),
        defineArrayMember({ type: 'featureSplitDarkBlock' }),
        defineArrayMember({ type: 'footerBlock' }),
        defineArrayMember({ type: 'fullWidthSingleBlock' }),
        defineArrayMember({ type: 'headerBlock' }),
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'heroBackdropBlock' }),
        defineArrayMember({ type: 'heroImageOverlayCardBlock' }),
        defineArrayMember({ type: 'heroTextBlock' }),
        defineArrayMember({ type: 'horizontalScrollStackBlock' }),
        defineArrayMember({ type: 'horizontalScrollStackMediumBlock' }),
        defineArrayMember({ type: 'logoCloudBlock' }),
        defineArrayMember({ type: 'mediaBlock' }),
        defineArrayMember({ type: 'mediaCarouselBlock' }),
        defineArrayMember({ type: 'paragraphsBlock' }),
        defineArrayMember({ type: 'pricingBlock' }),
        defineArrayMember({ type: 'releaseCardsBlock' }),
        defineArrayMember({ type: 'sectionHeadlineBlock' }),
        defineArrayMember({ type: 'statsBandBlock' }),
        defineArrayMember({ type: 'stepsBlock' }),
        defineArrayMember({ type: 'teamGridBlock' }),
        defineArrayMember({ type: 'testimonialCarouselBlock' }),
        defineArrayMember({ type: 'testimonialLargeBlock' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', language: 'language' },
    prepare: ({ title, language }) => ({ title: `${title} (${language})` }),
  },
})
