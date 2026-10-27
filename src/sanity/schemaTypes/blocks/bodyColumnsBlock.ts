import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'
import { headingLayoutField } from '../fields/headingLayoutField'
import { titleSizeField } from '../fields/titleSizeField'

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
    // Optional titles (per column, below): stacked above the text, or
    // inline — run into the start of the first paragraph, in bold.
    {
      ...headingLayoutField,
      description:
        'For columns with a title. Stacked: the title above the text. Inline: the title runs into the start of the text, in bold, at the text size.',
    },
    { ...titleSizeField('h4'), hidden: ({ parent }: { parent?: { headingLayout?: string } }) => parent?.headingLayout === 'inline' },
    defineField({
      name: 'items',
      title: 'Text',
      description: 'One per column. Press Enter for a new paragraph.',
      type: 'array',
      validation: (Rule) => Rule.min(1).max(3),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', description: 'Optional.' }),
            defineField({ name: 'text', type: 'text', rows: 5 }),
          ],
          preview: {
            select: { title: 'title', text: 'text' },
            prepare: ({ title, text }) => {
              const pick = (value: unknown) => (typeof value === 'object' && value ? (value as { en?: string; sv?: string }).en || (value as { sv?: string }).sv : (value as string | undefined))
              return { title: pick(title) || pick(text) || 'Empty', subtitle: pick(title) ? pick(text) : undefined }
            },
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
