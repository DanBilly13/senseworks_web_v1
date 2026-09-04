import { defineType, defineField } from 'sanity'

export const featureSplitBlock = defineType({
  name: 'featureSplitBlock',
  title: 'Feature Split',
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
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right (mirrored)', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'media', title: 'Media', type: 'media' }),
  ],
  preview: {
    select: { title: 'heading', position: 'imagePosition' },
    prepare: ({ title, position }) => ({
      title: `Feature Split — ${title || 'Untitled'}`,
      subtitle: `Image ${position || 'left'}`,
    }),
  },
})
