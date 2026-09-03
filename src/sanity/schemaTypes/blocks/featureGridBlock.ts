import { defineType, defineField, defineArrayMember } from 'sanity'

export const featureGridBlock = defineType({
  name: 'featureGridBlock',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
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
    defineField({
      name: 'items',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required().max(60),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.max(200),
            }),
            defineField({ name: 'ctaLabel', title: 'Link label', type: 'string' }),
            defineField({ name: 'ctaHref', title: 'Link href', type: 'string' }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Feature Grid — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} items`,
    }),
  },
})
