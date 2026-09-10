import { defineType, defineField } from 'sanity'

export const testimonialLargeBlock = defineType({
  name: 'testimonialLargeBlock',
  title: 'Testimonial — Large',
  type: 'object',
  fields: [
    defineField({
      name: 'testimonial',
      type: 'reference',
      to: [{ type: 'testimonial' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'testimonial.authorName',
      subtitle: 'testimonial.quote',
      media: 'testimonial.media.image',
    },
    prepare: ({ title, subtitle, media }) => ({
      title: `Testimonial — Large — ${title || 'Untitled'}`,
      subtitle,
      media,
    }),
  },
})
