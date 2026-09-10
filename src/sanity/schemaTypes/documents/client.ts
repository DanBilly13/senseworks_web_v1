import { defineType, defineField } from 'sanity'

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({ name: 'logo', type: 'media' }),
  ],
  preview: {
    select: { title: 'name', media: 'logo.image' },
  },
})
