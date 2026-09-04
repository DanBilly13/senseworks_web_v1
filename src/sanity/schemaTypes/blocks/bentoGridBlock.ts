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
                  { title: 'Normal (1 wide, 1 tall)', value: 'normal' },
                  { title: 'Large (2 wide, 2 tall)', value: 'large' },
                  { title: 'Tall (1 wide, 2 tall)', value: 'tall' },
                ],
                layout: 'radio',
              },
              initialValue: 'normal',
            }),
            defineField({ name: 'media', title: 'Media', type: 'media' }),
          ],
          preview: {
            select: { title: 'heading', size: 'size', media: 'media.image' },
            prepare: ({ title, size, media }) => ({
              title,
              subtitle:
                size === 'large' ? 'Large (2×2)' : size === 'tall' ? 'Tall (1×2)' : 'Normal',
              media,
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
