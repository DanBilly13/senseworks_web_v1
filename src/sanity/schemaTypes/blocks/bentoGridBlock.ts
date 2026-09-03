import { defineType, defineField, defineArrayMember } from 'sanity'

export const bentoGridBlock = defineType({
  name: 'bentoGridBlock',
  title: 'Bento Grid',
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
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'body',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.max(200),
            }),
            defineField({
              name: 'size',
              title: 'Card size',
              type: 'string',
              options: {
                list: [
                  { title: 'Normal (1 column)', value: 'normal' },
                  { title: 'Large (2 columns)', value: 'large' },
                ],
                layout: 'radio',
              },
              initialValue: 'normal',
            }),
          ],
          preview: {
            select: { title: 'heading', size: 'size' },
            prepare: ({ title, size }) => ({
              title,
              subtitle: size === 'large' ? 'Large (2 columns)' : 'Normal',
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Bento Grid — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} cards`,
    }),
  },
})
