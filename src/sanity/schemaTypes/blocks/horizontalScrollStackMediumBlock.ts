import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { headingLayoutField } from '../fields/headingLayoutField'
import { titleSizeField } from '../fields/titleSizeField'

export const horizontalScrollStackMediumBlock = defineType({
  name: 'horizontalScrollStackMediumBlock',
  title: 'Horizontal Scroll Stack Medium',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      description: 'Sits above the slides, left-aligned, and stays put while they move.',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'headingLevel',
      title: 'Heading level',
      description: 'H2 for a main section title, H3 for a smaller one under another heading.',
      type: 'string',
      options: {
        list: [
          { title: 'H2 (default)', value: 'h2' },
          { title: 'H3', value: 'h3' },
        ],
        layout: 'radio',
      },
      initialValue: 'h2',
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
      description:
        'Desktop: the section pins in place and the slides scroll sideways as the page scrolls down. Mobile: a plain vertical stack, in the same order.',
      type: 'array',
      validation: (Rule) => Rule.min(2).max(8),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'media',
              title: 'Image or video',
              description: 'Shown at about the size of a Feature Split image.',
              type: 'media',
            }),
            defineField({
              name: 'title',
              description: 'The slide\'s title. In the Inline title style it opens the caption in bold.',
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
      title: heading ? `Horizontal Scroll Stack Medium — ${heading}` : 'Horizontal Scroll Stack Medium',
      subtitle: `${slides?.length ?? 0} slides`,
    }),
  },
})
