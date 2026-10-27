import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'

// Large body text in 1–3 columns with a wide gutter, no titles — after
// the Awwwards course page Dan referenced. Pairs with a Statement above.
export const bodyColumnsBlock = defineType({
  name: 'bodyColumnsBlock',
  title: 'Body Columns',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'columns',
      title: 'Columns (desktop)',
      description: 'Below 1024px wide they stack.',
      type: 'string',
      options: {
        list: [
          { title: '1', value: '1' },
          { title: '2 (default)', value: '2' },
          { title: '3', value: '3' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '2',
    }),
    defineField({
      name: 'items',
      title: 'Text',
      description: 'One per column. Press Enter for a new paragraph.',
      type: 'array',
      validation: (Rule) => Rule.min(1).max(3),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [defineField({ name: 'text', type: 'text', rows: 5 })],
          preview: {
            select: { text: 'text' },
            prepare: ({ text }) => ({ title: (typeof text === 'object' ? text?.en || text?.sv : text) || 'Empty' }),
          },
        }),
      ],
    }),
    ...bandFields(),
    spacingField,
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({ title: 'Body Columns', subtitle: `${items?.length ?? 0} columns of text` }),
  },
})
