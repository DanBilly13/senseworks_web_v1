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
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(220),
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
        }),
      ],
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
