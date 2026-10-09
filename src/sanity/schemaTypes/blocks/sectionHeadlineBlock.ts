import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { headlineSizeField } from '../fields/headlineSizeField'

export const sectionHeadlineBlock = defineType({
  name: 'sectionHeadlineBlock',
  title: 'Section Headline',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      // Text, not string, so Enter adds a line break (shown as one on
      // the site, see SectionIntro). Stored the same either way.
      type: 'text',
      rows: 2,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({
      name: 'headingLevel',
      title: 'Heading level',
      description:
        'H1 only when this block IS the page\'s title (e.g. a page with no Hero) — every other section heading stays H2.',
      type: 'string',
      options: {
        list: [
          { title: 'H1', value: 'h1' },
          { title: 'H2 (default)', value: 'h2' },
        ],
        layout: 'radio',
      },
      initialValue: 'h2',
    }),
    headlineSizeField({ value: 'standard', title: 'Standard, per Heading level (default)' }),
    defineField({
      name: 'align',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    spacingField,
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({
      title: `Section Headline — ${title || 'Untitled'}`,
    }),
  },
})
