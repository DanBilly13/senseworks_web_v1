import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const fiftyFiftyBannerBlock = defineType({
  name: 'fiftyFiftyBannerBlock',
  title: '50/50 Banner',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'Button link', type: 'string' }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'media',
      title: 'Media',
      description: 'Sized for a 700x500 image on desktop — fills its half edge-to-edge (cropped to fit, not letterboxed).',
      type: 'media',
    }),
    spacingField,
  ],
  preview: {
    select: { title: 'heading', position: 'imagePosition' },
    prepare: ({ title, position }) => ({
      title: `50/50 Banner — ${title || 'Untitled'}`,
      subtitle: `Image ${position || 'right'}`,
    }),
  },
})
