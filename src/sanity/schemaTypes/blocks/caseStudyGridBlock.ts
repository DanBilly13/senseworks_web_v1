import { defineType, defineField, defineArrayMember } from 'sanity'

export const caseStudyGridBlock = defineType({
  name: 'caseStudyGridBlock',
  title: 'Case Study Card Grid',
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
      name: 'items',
      title: 'Case studies',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'companyName',
              type: 'string',
              validation: (Rule) => Rule.required().max(60),
            }),
            defineField({
              name: 'quote',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.max(220),
            }),
            defineField({ name: 'personName', type: 'string' }),
            defineField({ name: 'personRole', title: 'Person role / company', type: 'string' }),
            defineField({ name: 'ctaLabel', type: 'string' }),
            defineField({ name: 'ctaHref', type: 'string' }),
          ],
          preview: { select: { title: 'companyName', subtitle: 'personName' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Case Study Card Grid — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} case studies`,
    }),
  },
})
