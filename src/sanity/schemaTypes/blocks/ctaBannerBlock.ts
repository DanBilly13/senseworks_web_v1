import { defineType, defineField } from 'sanity'

export const ctaBannerBlock = defineType({
  name: 'ctaBannerBlock',
  title: 'CTA Banner',
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
    defineField({
      name: 'ctaLabel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaHref',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'secondaryCtaLabel', type: 'string' }),
    defineField({ name: 'secondaryCtaHref', type: 'string' }),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Inverse (dark)', value: 'inverse' },
          { title: 'Default (light)', value: 'default' },
        ],
        layout: 'radio',
      },
      initialValue: 'inverse',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: `CTA Banner — ${title || 'Untitled'}` }),
  },
})
