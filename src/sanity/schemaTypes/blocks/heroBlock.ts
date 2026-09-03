import { defineType, defineField } from 'sanity'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Side-by-side (headline left, subtext right)', value: 'split' },
          { title: 'Full-bleed image, text overlay bottom-left', value: 'imageOverlay' },
        ],
        layout: 'radio',
      },
      initialValue: 'split',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'subhead',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
  ],
  preview: {
    select: { title: 'headline', layout: 'layout' },
    prepare: ({ title, layout }) => ({
      title: `Hero — ${title || 'Untitled'}`,
      subtitle: layout === 'imageOverlay' ? 'Full-bleed image overlay' : 'Side-by-side',
    }),
  },
})
