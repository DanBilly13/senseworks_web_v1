import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'

// Unlike Feature Grid/Bento Grid (deliberately no intro of their own,
// meant to pair with a separate Section Headline above), Steps carries
// an optional eyebrow/heading/body directly — a numbered sequence
// reads better with its own short lead-in ("How it works") attached.
export const stepsBlock = defineType({
  name: 'stepsBlock',
  title: 'Steps',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'items',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            // No number field — steps are numbered automatically from
            // their position in this list (01, 02, ...), so reordering
            // items here always keeps the numbers in sync instead of
            // risking a typo'd or out-of-sequence manual number.
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'body',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.max(200),
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Steps — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} steps`,
    }),
  },
})
