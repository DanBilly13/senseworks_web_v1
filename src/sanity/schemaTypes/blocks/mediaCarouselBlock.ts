import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { headingLayoutField } from '../fields/headingLayoutField'
import { titleSizeField } from '../fields/titleSizeField'

export const mediaCarouselBlock = defineType({
  name: 'mediaCarouselBlock',
  title: 'Media Carousel',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      description: 'Optional. Sits above the slides, left-aligned, and stays put as they scroll.',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'body',
      title: 'Text under the heading',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
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
    { ...headingLayoutField, initialValue: 'inline' },
    titleSizeField('h5'),
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
              description: 'The slide\'s title. In the Inline title style it opens the caption in bold, e.g. "Pro controls."',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'body',
              description: 'Runs on after the title (Inline) or sits under it (Stacked).',
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
    select: { heading: 'heading', slides: 'slides' },
    prepare: ({ heading, slides }) => ({
      title: heading ? `Media Carousel — ${heading}` : 'Media Carousel',
      subtitle: `${slides?.length ?? 0} slides`,
    }),
  },
})
