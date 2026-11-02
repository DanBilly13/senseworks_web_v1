import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

// Ruled rows of contact details, like an architect's contact page: a
// big title on the left (a city, or what you're getting in touch
// about), labelled details in the middle, a person to ask on the right.
export const contactRowsBlock = defineType({
  name: 'contactRowsBlock',
  title: 'Contact Rows',
  type: 'object',
  fields: [
    hiddenField,
    spacingField,
    defineField({
      name: 'eyebrow',
      title: 'Label',
      description: 'Small label above the rows, e.g. "How to talk to us".',
      type: 'string',
    }),
    defineField({
      name: 'rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required().max(40) }),
            defineField({
              name: 'details',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', type: 'string', description: 'e.g. Email, Phone, Address.' }),
                    defineField({
                      name: 'value',
                      type: 'text',
                      rows: 3,
                      description: 'Press Enter for a new line (an address).',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'href',
                      title: 'Link',
                      description: 'Optional: mailto:…, tel:…, a page, or #book-meeting for the booking popup.',
                      type: 'string',
                    }),
                  ],
                  preview: { select: { title: 'value', subtitle: 'label' } },
                }),
              ],
            }),
            defineField({
              name: 'sideTitle',
              title: 'Side title',
              description: 'Optional, on the right, e.g. "New business".',
              type: 'string',
            }),
            defineField({
              name: 'sideText',
              title: 'Side text',
              description: 'Under the side title, one line per row, e.g. a name, role and email.',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'sideTitle' } },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: { title: 'eyebrow', rows: 'rows' },
    prepare: ({ title, rows }) => ({
      title: `Contact Rows — ${typeof title === 'object' ? title?.en || title?.sv : title || 'Untitled'}`,
      subtitle: `${rows?.length ?? 0} rows`,
    }),
  },
})
