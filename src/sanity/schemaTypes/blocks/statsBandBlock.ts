import { defineType, defineField, defineArrayMember } from 'sanity'

export const statsBandBlock = defineType({
  name: 'statsBandBlock',
  title: 'Stats Band',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'heading', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Stat value',
              type: 'string',
              validation: (Rule) => Rule.required().max(20),
            }),
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Stats Band — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} stats`,
    }),
  },
})
