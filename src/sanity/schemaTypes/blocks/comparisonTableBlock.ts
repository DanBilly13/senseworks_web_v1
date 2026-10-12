import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const comparisonTableBlock = defineType({
  name: 'comparisonTableBlock',
  title: 'Comparison Table',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'rowHeader',
      title: 'Left column heading',
      description:
        'Heading over the left column, e.g. "What it looks like today". Each row\'s left cell is its "Left cell" below. Left blank, this header cell is empty.',
      type: 'string',
    }),
    defineField({
      name: 'columns',
      title: 'Right-hand columns',
      description:
        'The columns to the right of the left column, e.g. just "In Senseworks Analytics" for a before/after table. Each row fills these in under "Right-hand cells".',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'highlighted',
              title: 'Highlighted (our product)',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: { select: { title: 'label', highlighted: 'highlighted' } },
        }),
      ],
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'labelLead',
              title: 'Left cell, bold lead-in',
              description: 'Optional, e.g. "Start from scratch."',
              type: 'string',
            }),
            defineField({
              name: 'label',
              title: 'Left cell',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'cells',
              title: 'Right-hand cells',
              description: 'One per right-hand column, in the same order as those columns.',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'type',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Yes', value: 'check' },
                          { title: 'No', value: 'cross' },
                          { title: 'Partial', value: 'partial' },
                          { title: 'Text', value: 'text' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'check',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'lead',
                      title: 'Bold lead-in (only used when type is Text)',
                      description: 'Optional, e.g. "Rolls forward."',
                      type: 'string',
                    }),
                    defineField({
                      name: 'text',
                      title: 'Text (only used when type is Text)',
                      type: 'string',
                    }),
                  ],
                  preview: {
                    select: { type: 'type', lead: 'lead', text: 'text' },
                    prepare: ({ type, lead, text }) => ({
                      title: type === 'text' ? [lead, text].filter(Boolean).join(' ') || 'Text' : type,
                    }),
                  },
                }),
              ],
            }),
          ],
          // Reads as the row does on the site: left cell → first right cell.
          preview: {
            select: { labelLead: 'labelLead', label: 'label', cells: 'cells' },
            prepare: ({ labelLead, label, cells }) => {
              const first = cells?.[0]
              return {
                title: [labelLead, label].filter(Boolean).join(' '),
                subtitle: first?.type === 'text' ? `→ ${[first.lead, first.text].filter(Boolean).join(' ')}` : undefined,
              }
            },
          },
        }),
      ],
    }),
    spacingField,
  ],
  preview: {
    select: { title: 'heading', rows: 'rows' },
    prepare: ({ title, rows }) => ({
      title: `Comparison Table — ${title || 'Untitled'}`,
      subtitle: `${rows?.length ?? 0} rows`,
    }),
  },
})
