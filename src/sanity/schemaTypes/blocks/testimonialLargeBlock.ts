import { defineType, defineField } from 'sanity'

export const testimonialLargeBlock = defineType({
  name: 'testimonialLargeBlock',
  title: 'Testimonial — Large',
  type: 'object',
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
    prepare: ({ title, subtitle, media }) => ({
      title: `Testimonial — Large — ${title || 'Untitled'}`,
      subtitle,
      media,
    }),
  },
})
