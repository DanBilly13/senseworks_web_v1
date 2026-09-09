import { defineType, defineField } from 'sanity'

export const featureSplitDarkBlock = defineType({
  name: 'featureSplitDarkBlock',
  title: 'Feature Split — Dark',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Header',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'subhead',
      title: 'Sub text',
      type: 'string',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
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
      type: 'media',
      description: 'Sits directly on the dark background — a transparent PNG works best.',
    }),
  ],
  preview: {
    select: { title: 'heading', position: 'imagePosition' },
    prepare: ({ title, position }) => ({
      title: `Feature Split — Dark — ${title || 'Untitled'}`,
      subtitle: `Image ${position || 'right'}`,
    }),
  },
})
