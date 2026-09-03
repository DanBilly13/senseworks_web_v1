import { defineType, defineField, defineArrayMember } from 'sanity'

export const comparisonTableBlock = defineType({
  name: 'comparisonTableBlock',
  title: 'Comparison Table',
  type: 'object',
  fields: [
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
      name: 'columns',
      title: 'Columns',
      description: 'One per thing being compared — first one is usually us.',
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
              name: 'label',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'cells',
              title: 'Cells',
              description: 'One per column, in the same order as the columns above.',
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
                      name: 'text',
                      title: 'Text (only used when type is Text)',
                      type: 'string',
                    }),
                  ],
                  preview: {
                    select: { type: 'type', text: 'text' },
                    prepare: ({ type, text }) => ({ title: type === 'text' ? text || 'Text' : type }),
                  },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'label' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', rows: 'rows' },
    prepare: ({ title, rows }) => ({
      title: `Comparison Table — ${title || 'Untitled'}`,
      subtitle: `${rows?.length ?? 0} rows`,
    }),
  },
})
