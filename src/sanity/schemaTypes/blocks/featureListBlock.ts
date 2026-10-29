import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'
import { contentWidthField } from '../fields/contentWidthField'

export const featureListBlock = defineType({
  name: 'featureListBlock',
  title: 'Feature List',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'bodySize',
      title: 'Body size',
      description: 'The size of the text on the right of each row.',
      type: 'string',
      options: {
        list: [
          { title: 'Body (default)', value: 'body' },
          { title: 'H5', value: 'h5' },
          { title: 'H4', value: 'h4' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'body',
    }),
    defineField({
      name: 'highlightLabels',
      title: 'Highlight titles',
      description: 'Puts each row’s title on a highlight that wipes in, one row after another, as the list scrolls into view.',
      type: 'boolean',
      initialValue: false,
    }),
    contentWidthField,
    ...bandFields({ withDarkGradient: true }),
    spacingField,
    defineField({
      name: 'items',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required().max(100),
            }),
            defineField({
              name: 'body',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(600),
            }),
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'items.0.label', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Feature List — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} rows`,
    }),
  },
})
