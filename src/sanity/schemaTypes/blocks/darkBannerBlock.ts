import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headingLayoutField } from '../fields/headingLayoutField'
import { titleSizeField } from '../fields/titleSizeField'

export const darkBannerBlock = defineType({
  name: 'darkBannerBlock',
  title: 'Dark Banner',
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
    defineField({
      name: 'tone',
      title: 'Panel style',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (black background, light text)', value: 'dark' },
          { title: 'Accent (accent background, dark text)', value: 'accent' },
          { title: 'White (white background, dark text)', value: 'white' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'leftImage',
      title: 'Left column image',
      description:
        'Optional — sits behind the heading text, filling the left column edge-to-edge. Use a PNG with a transparent background so the panel\'s own background still shows through.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'showIcons',
      title: 'Show icons',
      description:
        'Icon color follows the panel style automatically — accent on Dark, dark foreground on Accent/White.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'iconSize',
      title: 'Icon size',
      description: 'Large: 64px desktop / 56px mobile. Small: 32px desktop / 24px mobile.',
      type: 'string',
      options: {
        list: [
          { title: 'Large', value: 'large' },
          { title: 'Small (default)', value: 'small' },
        ],
        layout: 'radio',
      },
      initialValue: 'small',
    }),
    headingLayoutField,
    titleSizeField(),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              description:
                'Optional — upload an SVG to replace the default checkmark. Only used when "Show icons" is on above.',
              type: 'image',
              options: { accept: 'image/svg+xml' },
            }),
            defineField({
              name: 'title',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'description',
              type: 'text',
              rows: 2,
              validation: (Rule) => Rule.max(600),
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: `Dark Banner — ${title || 'Untitled'}`,
      subtitle: `${items?.length ?? 0} items`,
    }),
  },
})
