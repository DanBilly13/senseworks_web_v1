import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

export const caseStudyGridBlock = defineType({
  name: 'caseStudyGridBlock',
  title: 'Case Study Carousel',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'eyebrow',
      type: 'string',
      description: 'Optional. With a heading here, it sits left of the carousel buttons, like Testimonial Carousel.',
    }),
    defineField({ name: 'heading', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'body', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({
      name: 'tone',
      title: 'Card style',
      type: 'string',
      options: {
        list: [
          { title: 'Default (light)', value: 'default' },
          { title: 'Dark (black background, white text)', value: 'dark' },
          { title: 'Accent (accent background, black text)', value: 'accent' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    spacingField,
    defineField({
      name: 'items',
      title: 'Case studies',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'companyName',
              type: 'string',
              validation: (Rule) => Rule.required().max(60),
            }),
            defineField({ name: 'facts', type: 'string', description: 'e.g. "25 staff, six offices".' }),
            defineField({ name: 'products', type: 'string', description: 'Which Senseworks products they use, e.g. "Audit".' }),
            defineField({
              name: 'quote',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.max(220),
            }),
            defineField({ name: 'personName', type: 'string' }),
            defineField({ name: 'personRole', title: 'Person role / company', type: 'string' }),
            defineField({ name: 'ctaLabel', type: 'string' }),
            defineField({ name: 'ctaHref', type: 'string' }),
            defineField({ name: 'media', title: 'Logo', type: 'media' }),
          ],
          preview: {
            select: { title: 'companyName', subtitle: 'personName', media: 'media.image' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items', heading: 'heading' },
    prepare: ({ items, heading }) => ({
      title: `Case Study Carousel${heading ? ` — ${heading}` : ''}`,
      subtitle: `${items?.length ?? 0} case studies`,
    }),
  },
})
