import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headlineSizeField } from '../fields/headlineSizeField'

export const heroTextBlock = defineType({
  name: 'heroTextBlock',
  title: 'Hero — Text Only',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      // Text, not string, so Enter adds a line break (see SectionIntro).
      type: 'text',
      rows: 2,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required().max(80),
    }),
    headlineSizeField(),
    defineField({
      name: 'subhead',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(350),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({
      name: 'boundary',
      title: 'Page-top hero',
      description:
        'On for the actual page-top hero (extra page-boundary padding). Turn off when this block is reused as a hero-style moment further down the page — it then uses the standard section spacing instead.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({
      title: `Hero — Text Only — ${title || 'Untitled'}`,
    }),
  },
})
