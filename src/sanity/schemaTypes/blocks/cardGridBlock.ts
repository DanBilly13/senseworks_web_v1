import { defineType, defineField, defineArrayMember } from 'sanity'

// Deliberately no top-level eyebrow/heading/body — unlike most grid
// blocks, this one is meant to be paired with a separate intro block
// (e.g. Section Headline) when one's needed, not to carry its own.
export const cardGridBlock = defineType({
  name: 'cardGridBlock',
  title: 'Card Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns (desktop)',
      type: 'string',
      options: {
        list: [
          { title: '1', value: '1' },
          { title: '2', value: '2' },
          { title: '3', value: '3' },
          { title: '4', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '3',
    }),
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
    defineField({
      name: 'headingLevel',
      title: 'Heading level',
      type: 'string',
      options: {
        list: [
          { title: 'H3', value: 'h3' },
          { title: 'H4 (default)', value: 'h4' },
        ],
        layout: 'radio',
      },
      initialValue: 'h4',
    }),
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Eyebrow',
              description: 'e.g. "01 — Intelligent"',
              type: 'string',
              validation: (Rule) => Rule.required().max(60),
            }),
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
          ],
          preview: {
            select: { title: 'heading', subtitle: 'eyebrow' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Card Grid',
      subtitle: `${items?.length ?? 0} cards`,
    }),
  },
})
