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
              description: 'Audit is purple, Analysis green, Customer Service yellow.',
              type: 'string',
              options: {
                list: [
                  { title: 'Audit (purple)', value: 'audit' },
                  { title: 'Analysis (green)', value: 'analysis' },
                  { title: 'Customer Service (yellow)', value: 'customerService' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'area',
              description: 'Where in the product it landed, top right of the card. e.g. "Integrations".',
              type: 'string',
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
            defineField({
              name: 'status',
              description: 'The progress bar\'s label. Leave empty for "Shipped".',
              type: 'string',
            }),
            defineField({
              name: 'progress',
              title: 'Progress (%)',
              description: 'How full the bar is. Leave at 100 for something shipped.',
              type: 'number',
              initialValue: 100,
              validation: (Rule) => Rule.min(0).max(100),
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
