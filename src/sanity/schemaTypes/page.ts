import { defineType, defineField, defineArrayMember } from 'sanity'

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
      of: [
        defineArrayMember({ type: 'headerBlock' }),
        defineArrayMember({ type: 'heroBlock' }),
        defineArrayMember({ type: 'featureSplitBlock' }),
        defineArrayMember({ type: 'featureGridBlock' }),
        defineArrayMember({ type: 'logoCloudBlock' }),
        defineArrayMember({ type: 'testimonialCarouselBlock' }),
        defineArrayMember({ type: 'statsBandBlock' }),
        defineArrayMember({ type: 'faqAccordionBlock' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', language: 'language' },
    prepare: ({ title, language }) => ({ title: `${title} (${language})` }),
  },
})
