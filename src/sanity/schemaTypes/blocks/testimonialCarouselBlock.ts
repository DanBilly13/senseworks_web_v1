import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const testimonialCarouselBlock = defineType({
  name: 'testimonialCarouselBlock',
  title: 'Testimonial Carousel',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'items',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
    }),
    spacingField,
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Testimonial Carousel',
      subtitle: `${items?.length ?? 0} testimonials`,
    }),
  },
})
