import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'

export const sectionHeadlineBlock = defineType({
  name: 'sectionHeadlineBlock',
  title: 'Section Headline',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      type: 'string',
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
    defineField({
      name: 'spacing',
      title: 'Section spacing',
      description: 'The gap below this block, before the next one. Loose unless a page needs tighter rhythm here.',
      type: 'string',
      options: {
        list: [
          { title: 'Loose (200px)', value: 'loose' },
          { title: 'Medium (120px)', value: 'medium' },
          { title: 'Tight (60px)', value: 'tight' },
        ],
        layout: 'radio',
      },
      initialValue: 'loose',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({
      title: `Section Headline — ${title || 'Untitled'}`,
    }),
  },
})
