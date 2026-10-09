import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { titleSizeField } from '../fields/titleSizeField'
import { headingLayoutField } from '../fields/headingLayoutField'

export const paragraphsBlock = defineType({
  name: 'paragraphsBlock',
  title: 'Paragraphs',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'columns',
      title: 'Columns (desktop)',
      description: 'Mobile is one column, tablet two, whatever you pick here.',
      type: 'string',
      options: {
        list: [
          { title: '3', value: '3' },
          { title: '4', value: '4' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: '3',
    }),
    titleSizeField('h5', ['h4', 'h5', 'h6']),
    headingLayoutField,
    spacingField,
    defineField({
      name: 'items',
      title: 'Columns',
      description:
        'One item per column, in order. Add an "Empty column" to leave a column blank on desktop (e.g. text, text, empty), it disappears on mobile and tablet.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'paragraph',
          title: 'Paragraph',
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({
              name: 'text',
              type: 'text',
              rows: 5,
              description: 'Leave a blank line between paragraphs.',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'text' },
            prepare: ({ title, subtitle }) => ({ title: title || subtitle || 'Paragraph', subtitle: title ? subtitle : undefined }),
          },
        }),
        defineArrayMember({
          name: 'emptyColumn',
          title: 'Empty column',
          type: 'object',
          // Sanity needs at least one field on an object type; this one
          // is only a label so editors can tell spacers apart.
          fields: [
            defineField({
              name: 'note',
              title: 'Note (not shown on the site)',
              type: 'string',
            }),
          ],
          preview: {
            select: { note: 'note' },
            prepare: ({ note }) => ({ title: 'Empty column', subtitle: note || 'Desktop only' }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items', columns: 'columns' },
    prepare: ({ items, columns }) => ({
      title: 'Paragraphs',
      subtitle: `${items?.length ?? 0} items, ${columns ?? '3'} columns`,
    }),
  },
})
