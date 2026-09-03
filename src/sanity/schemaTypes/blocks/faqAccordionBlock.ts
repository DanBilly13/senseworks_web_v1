import { defineType, defineField, defineArrayMember } from 'sanity'

export const faqAccordionBlock = defineType({
  name: 'faqAccordionBlock',
  title: 'FAQ Accordion',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      initialValue: 'Frequently asked questions',
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'answer',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(400),
            }),
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({ title: `FAQ Accordion — ${items?.length ?? 0} items` }),
  },
})
