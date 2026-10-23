import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const featureSplitBlock = defineType({
  name: 'featureSplitBlock',
  title: 'Feature Split',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
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
      rows: 3,
      validation: (Rule) => Rule.max(600),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right (mirrored)', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingLevel',
      title: 'Heading size',
      description: 'H2 draws the heading larger; the text under it stays the same.',
      type: 'string',
      options: {
        list: [
          { title: 'H2 (larger)', value: 'h2' },
          { title: 'H3 (default)', value: 'h3' },
        ],
        layout: 'radio',
      },
      initialValue: 'h3',
    }),
    defineField({ name: 'media', title: 'Media', type: 'media' }),
    spacingField,
  ],
  preview: {
    select: { title: 'heading', position: 'imagePosition' },
    prepare: ({ title, position }) => ({
      title: `Feature Split — ${title || 'Untitled'}`,
      subtitle: `Image ${position || 'left'}`,
    }),
  },
})
