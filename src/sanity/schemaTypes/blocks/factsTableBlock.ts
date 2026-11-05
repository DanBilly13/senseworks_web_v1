import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'
import { titleSizeField } from '../fields/titleSizeField'

// A ruled table of 2–4 equal columns: an eyebrow in the top row, a title
// and optional body in the row under it (e.g. Date / Country / Type).
const [, paddingTopField, paddingBottomField] = bandFields()

export const factsTableBlock = defineType({
  name: 'factsTableBlock',
  title: 'Facts Table',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'items',
      title: 'Columns',
      description: '2 to 4, shown as equal-width columns on desktop. On mobile they stack.',
      type: 'array',
      validation: (Rule) => Rule.min(2).max(4),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', description: 'The top row, e.g. "Date".' }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'text',
              rows: 2,
              description: 'Press Enter for a line break.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, description: 'Optional, under the title.' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'eyebrow' },
            prepare: ({ title, subtitle }) => ({
              title: (typeof title === 'object' ? title?.en || title?.sv : title) || 'Untitled',
              subtitle: typeof subtitle === 'object' ? subtitle?.en || subtitle?.sv : subtitle,
            }),
          },
        }),
      ],
    }),
    { ...titleSizeField('h4'), description: 'How big each column’s title is.' },
    defineField({
      name: 'tone',
      title: 'Background',
      description: 'Fills the full screen width behind the table, which stays at content width. None sits straight on the page.',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Light grey', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Accent', value: 'accent' },
          { title: 'Accent gradient', value: 'accentGradient' },
          { title: 'Dark accent gradient', value: 'accentDark' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    paddingTopField,
    paddingBottomField,
    spacingField,
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => {
      const first = items?.[0]?.eyebrow
      const label = typeof first === 'object' ? first?.en || first?.sv : first
      return { title: `Facts Table — ${items?.length ?? 0} columns`, subtitle: label }
    },
  },
})
