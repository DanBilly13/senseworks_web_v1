import { defineType, defineField, defineArrayMember } from 'sanity'

export const headerBlock = defineType({
  name: 'headerBlock',
  title: 'Header',
  type: 'object',
  fields: [
    defineField({
      name: 'logoText',
      type: 'string',
      initialValue: 'senseworks',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navLinks',
      title: 'Nav links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', type: 'string', validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
  ],
  preview: {
    select: { title: 'logoText' },
    prepare: ({ title }) => ({ title: `Header — ${title || 'Untitled'}` }),
  },
})
