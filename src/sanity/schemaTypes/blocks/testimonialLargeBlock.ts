import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const testimonialLargeBlock = defineType({
  name: 'testimonialLargeBlock',
  title: 'Testimonial — Large',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'testimonial',
      type: 'reference',
      to: [{ type: 'testimonial' }],
      validation: (Rule) => Rule.required(),
    }),
    spacingField,
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
