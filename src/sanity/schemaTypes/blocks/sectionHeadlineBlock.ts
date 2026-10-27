import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'
import { contentWidthField } from '../fields/contentWidthField'

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
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          { title: 'Display', value: 'display' },
          { title: 'H1', value: 'h1' },
          { title: 'H2 (default)', value: 'h2' },
          { title: 'H3', value: 'h3' },
        ],
        layout: 'radio',
        direction: 'horizontal',
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
      name: 'anchor',
      title: 'Anchor',
      description:
        'Optional. Lets a link jump to this headline: an anchor of "pricing" is reached by a link to "#pricing" (the menu\'s Pricing link uses this on Home). Lowercase letters, numbers and dashes.',
      type: 'string',
      validation: (Rule) =>
        Rule.regex(/^[a-z0-9-]+$/, { name: 'lowercase letters, numbers and dashes' }),
    }),
    contentWidthField,
    ...bandFields(),
    spacingField,
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({
      title: `Section Headline — ${title || 'Untitled'}`,
    }),
  },
})
