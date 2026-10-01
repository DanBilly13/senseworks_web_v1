import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const horizontalScrollStackBlock = defineType({
  name: 'horizontalScrollStackBlock',
  title: 'Horizontal Scroll Stack',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'panels',
      title: 'Slides',
      description:
        'Desktop: pins in place and scrolls horizontally through these, one per "slide" of extra scroll — the first is centered, later ones peek in from the right and dim as they\'re scrolled past. Mobile: a plain vertical stack, in the same order.',
      type: 'array',
      validation: (Rule) => Rule.min(2).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'eyebrow',
              type: 'string',
              description: 'The first word (e.g. "01") renders as a small colored number badge.',
            }),
            defineField({
              name: 'heading',
              type: 'string',
              validation: (Rule) => Rule.required().max(100),
            }),
            defineField({
              name: 'body',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.max(300),
            }),
            defineField({ name: 'media', title: 'Media', type: 'media' }),
          ],
          preview: {
            select: { title: 'heading', media: 'media.image' },
          },
        }),
      ],
    }),
    spacingField,
  ],
  preview: {
    select: { panels: 'panels' },
    prepare: ({ panels }) => ({
      title: 'Horizontal Scroll Stack',
      subtitle: `${panels?.length ?? 0} slides`,
    }),
  },
})
