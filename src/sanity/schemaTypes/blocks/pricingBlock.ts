import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const pricingBlock = defineType({
  name: 'pricingBlock',
  title: 'Pricing Cards',
  type: 'object',
  fields: [
    hiddenField,
    spacingField,
    defineField({
      name: 'plans',
      title: 'Plans',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'tag',
              title: 'Product chip',
              description: 'Optional — a colored chip above the name: Audit purple, Analytics green.',
              type: 'string',
              options: {
                list: [
                  { title: 'Audit (purple)', value: 'audit' },
                  { title: 'Analytics (green)', value: 'analysis' },
                ],
                layout: 'radio',
              },
            }),
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
              name: 'price',
              description: 'Optional, shown large, as typed — e.g. "899 kr", "SEK 899", "Quote".',
              type: 'string',
              validation: (Rule) => Rule.max(30),
            }),
            defineField({
              name: 'pricePeriod',
              title: 'Price period',
              description: 'Next to the price, smaller — e.g. "per month".',
              type: 'string',
              validation: (Rule) => Rule.max(40),
            }),
            defineField({
              name: 'priceNote',
              title: 'Price note',
              description: 'A small line under the price — e.g. "Billed annually, per user".',
              type: 'string',
              validation: (Rule) => Rule.max(80),
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
    select: { title: 'plans.0.name', plans: 'plans' },
    prepare: ({ title, plans }) => ({
      title: `Pricing Cards — ${title || 'Untitled'}`,
      subtitle: `${plans?.length ?? 0} plans`,
    }),
  },
})
