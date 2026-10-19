import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const releaseCardsBlock = defineType({
  name: 'releaseCardsBlock',
  title: 'Release Cards',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'columns',
      type: 'string',
      options: {
        list: [
          { title: '2 (default)', value: '2' },
          { title: '3', value: '3' },
          { title: '4', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '2',
    }),
    spacingField,
    defineField({
      name: 'cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'tag',
              title: 'Category chip',
              description: 'Audit is purple, Analytics green, Support yellow.',
              type: 'string',
              options: {
                list: [
                  { title: 'Audit (purple)', value: 'audit' },
                  { title: 'Analytics (green)', value: 'analysis' },
                  { title: 'Support (yellow)', value: 'customerService' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required().max(100),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.max(300),
            }),
            defineField({
              name: 'media',
              title: 'Image',
              description: 'Optional — a screenshot of what was released.',
              type: 'media',
            }),
            // A stage rather than a percentage: "Rolling out 70%" read as a
            // precise measure and a hidden date ("so, December?"). The bar
            // shows three steps, filled up to this one.
            defineField({
              name: 'stage',
              description: 'Where it is. The bar shows three steps, filled up to this one — no percentage, so no implied date.',
              type: 'string',
              options: {
                list: [
                  { title: 'In development', value: 'development' },
                  { title: 'Rolling out', value: 'rollingOut' },
                  { title: 'Shipped', value: 'shipped' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'shipped',
            }),
            defineField({
              name: 'team',
              title: 'Team',
              description: 'Up to 6 people who worked on it, shown as small overlapping round photos.',
              type: 'array',
              of: [defineArrayMember({ type: 'reference', to: [{ type: 'teamMember' }] })],
              validation: (Rule) => Rule.max(6).unique(),
            }),
            defineField({
              name: 'date',
              description: 'Shown with a calendar icon, as typed. e.g. "1 Oct 2026".',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'date', media: 'media.image' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { cards: 'cards' },
    prepare: ({ cards }) => ({
      title: 'Release Cards',
      subtitle: `${cards?.length ?? 0} cards`,
    }),
  },
})
