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
    defineField({
      name: 'tone',
      title: 'Background',
      description: 'Dark accent gradient: the accent color fading to black instead of the light grey, with white text.',
      type: 'string',
      options: {
        list: [
          { title: 'Accent gradient (default)', value: 'accent' },
          { title: 'Dark accent gradient', value: 'accentDark' },
        ],
        layout: 'radio',
      },
      initialValue: 'accent',
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
