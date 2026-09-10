import { defineType, defineField, defineArrayMember } from 'sanity'

export const testimonialCarouselBlock = defineType({
  name: 'testimonialCarouselBlock',
  title: 'Testimonial Carousel',
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
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Testimonials',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Testimonial Carousel — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} testimonials`,
    }),
  },
})
