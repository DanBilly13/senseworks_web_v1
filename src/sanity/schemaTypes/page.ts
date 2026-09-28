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
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    // Set by @sanity/document-internationalization — not hand-edited.
    defineField({ name: 'language', type: 'string', readOnly: true }),
    defineField({
      name: 'blocks',
      type: 'array',
      components: { item: BlockListItem },
      of: [
        defineArrayMember({ type: 'headerBlock' }),
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'heroBackdropBlock' }),
        defineArrayMember({ type: 'heroImageOverlayCardBlock' }),
        defineArrayMember({ type: 'heroTextBlock' }),
        defineArrayMember({ type: 'sectionHeadlineBlock' }),
        defineArrayMember({ type: 'featureSplitBlock' }),
        defineArrayMember({ type: 'featureSplitDarkBlock' }),
        defineArrayMember({ type: 'fiftyFiftyBannerBlock' }),
        defineArrayMember({ type: 'stepsBlock' }),
        defineArrayMember({ type: 'featureGridBlock' }),
        defineArrayMember({ type: 'featureListBlock' }),
        defineArrayMember({ type: 'cardGridBlock' }),
        defineArrayMember({ type: 'logoCloudBlock' }),
        defineArrayMember({ type: 'testimonialCarouselBlock' }),
        defineArrayMember({ type: 'testimonialLargeBlock' }),
        defineArrayMember({ type: 'statsBandBlock' }),
        defineArrayMember({ type: 'pricingBlock' }),
        defineArrayMember({ type: 'bentoGridBlock' }),
        defineArrayMember({ type: 'mediaBlock' }),
        defineArrayMember({ type: 'faqAccordionBlock' }),
        defineArrayMember({ type: 'comparisonTableBlock' }),
        defineArrayMember({ type: 'caseStudyGridBlock' }),
        defineArrayMember({ type: 'ctaBannerBlock' }),
        defineArrayMember({ type: 'darkBannerBlock' }),
        defineArrayMember({ type: 'footerBlock' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', language: 'language' },
    prepare: ({ title, language }) => ({ title: `${title} (${language})` }),
  },
})
