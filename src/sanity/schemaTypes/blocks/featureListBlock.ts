import { defineType, defineField, defineArrayMember } from 'sanity'

export const featureListBlock = defineType({
  name: 'featureListBlock',
  title: 'Feature List',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      type: 'string',
      description:
        'Optional — leave empty when preceded by a separate Section Headline block instead.',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'items',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required().max(100),
            }),
            defineField({
              name: 'body',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(600),
            }),
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Feature List — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} rows`,
    }),
  },
})
