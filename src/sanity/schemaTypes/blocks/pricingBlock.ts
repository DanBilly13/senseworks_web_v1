import { defineType, defineField, defineArrayMember } from 'sanity'

export const pricingBlock = defineType({
  name: 'pricingBlock',
  title: 'Pricing Cards',
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
      name: 'plans',
      title: 'Plans',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.max(200),
            }),
            defineField({
              name: 'features',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
            }),
            defineField({ name: 'ctaLabel', type: 'string' }),
            defineField({ name: 'ctaHref', type: 'string' }),
            defineField({
              name: 'featured',
              title: 'Featured (dark/accent card)',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'name', featured: 'featured' },
            prepare: ({ title, featured }) => ({
              title,
              subtitle: featured ? 'Featured' : undefined,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', plans: 'plans' },
    prepare: ({ title, plans }) => ({
      title: `Pricing Cards — ${title || 'Untitled'}`,
      subtitle: `${plans?.length ?? 0} plans`,
    }),
  },
})
