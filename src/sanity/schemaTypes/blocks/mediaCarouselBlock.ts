import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const mediaCarouselBlock = defineType({
  name: 'mediaCarouselBlock',
  title: 'Media Carousel',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'tone',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default (light)', value: 'default' },
          { title: 'Dark (black band, white text)', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'slides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'media',
              title: 'Image or video',
              description: 'Shown at the same size as the image in a Feature Split block.',
              type: 'media',
            }),
            defineField({
              name: 'title',
              description: 'The bold opening words of the caption, e.g. "Pro controls."',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'body',
              description: 'Continues straight on after the title.',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.max(400),
            }),
            defineField({
              name: 'note',
              title: 'Small print',
              description: 'Optional fine print under the caption.',
              type: 'string',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        }),
      ],
    }),
    spacingField,
  ],
  preview: {
    select: { slides: 'slides' },
    prepare: ({ slides }) => ({
      title: 'Media Carousel',
      subtitle: `${slides?.length ?? 0} slides`,
    }),
  },
})
