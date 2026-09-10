import { defineType, defineField } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(320),
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({ name: 'authorRole', title: 'Author role / company', type: 'string' }),
    defineField({ name: 'media', title: 'Avatar', type: 'media' }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'quote', media: 'media.image' },
  },
})
