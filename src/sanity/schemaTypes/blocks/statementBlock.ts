import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'

// A big lead statement across the full content width — one long line of
// regular-weight text, after the Awwwards course page Dan referenced.
// Pairs with Body Columns below it.
export const statementBlock = defineType({
  name: 'statementBlock',
  title: 'Statement',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'text',
      type: 'text',
      rows: 3,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required(),
    }),
    ...bandFields(),
    spacingField,
  ],
  preview: {
    select: { text: 'text' },
    prepare: ({ text }) => {
      const value = typeof text === 'object' ? text?.en || text?.sv : text
      return { title: `Statement — ${value || 'Untitled'}` }
    },
  },
})
