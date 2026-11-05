import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'

// A square image beside a column of text pieces, 50/50. On desktop the
// image stays put while the text scrolls past it, until the text runs
// out. The text side is a list of pieces in any order: an Intro, Text
// (a smaller title and body), stacked Cards, or a Button on its own.
const [, paddingTopField, paddingBottomField] = bandFields()

const cardFields = [
  defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', description: 'e.g. "01 — Intelligent"' }),
  defineField({ name: 'heading', title: 'Title', type: 'string', validation: (Rule) => Rule.required().max(100) }),
  defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
  defineField({
    name: 'image',
    title: 'Image',
    description: 'Optional, 7:5, under the text.',
    type: 'image',
    options: { hotspot: true },
  }),
  defineField({
    name: 'imageAlt',
    title: 'Image alt text',
    type: 'string',
    hidden: ({ parent }) => !parent?.image,
  }),
]

export const stickySplitBlock = defineType({
  name: 'stickySplitBlock',
  title: 'Sticky Split',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'media',
      title: 'Media',
      description: 'Shown square (1:1). On desktop it stays in place while the text beside it scrolls past.',
      type: 'media',
    }),
    defineField({
      name: 'items',
      title: 'Text side',
      description: 'The pieces beside the image, top to bottom. Drag to reorder.',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          name: 'intro',
          title: 'Intro',
          type: 'object',
          fields: [
            defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
            defineField({ name: 'headline', title: 'Title', type: 'string', validation: (Rule) => Rule.max(100) }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
            defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
            defineField({ name: 'ctaHref', title: 'Button link', type: 'string' }),
          ],
          preview: {
            select: { title: 'headline', subtitle: 'eyebrow' },
            prepare: ({ title, subtitle }) => ({ title: `Intro — ${title || subtitle || 'Untitled'}` }),
          },
        }),
        defineArrayMember({
          name: 'text',
          title: 'Text',
          type: 'object',
          fields: [
            defineField({ name: 'heading', title: 'Title', type: 'string' }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 5,
              description: 'Press Enter for a line break.',
            }),
          ],
          preview: {
            select: { title: 'heading', body: 'body' },
            prepare: ({ title, body }) => {
              const text = typeof body === 'object' ? body?.en : body
              return { title: `Text — ${title || text || 'Untitled'}` }
            },
          },
        }),
        defineArrayMember({
          name: 'cards',
          title: 'Cards',
          type: 'object',
          fields: [
            defineField({
              name: 'tone',
              title: 'Card style',
              type: 'string',
              options: {
                list: [
                  { title: 'White', value: 'white' },
                  { title: 'Dark', value: 'dark' },
                  { title: 'Accent', value: 'accent' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
              initialValue: 'white',
            }),
            defineField({
              name: 'numberedEyebrow',
              title: 'Numbered eyebrow',
              description: 'Highlights the first word of each eyebrow (e.g. "01") as a small badge. Only when every eyebrow starts with a number.',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'items',
              title: 'Cards',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: cardFields,
                  preview: { select: { title: 'heading', subtitle: 'eyebrow' } },
                }),
              ],
            }),
          ],
          preview: {
            select: { items: 'items' },
            prepare: ({ items }) => ({ title: `Cards — ${items?.length ?? 0}` }),
          },
        }),
        defineArrayMember({
          name: 'button',
          title: 'Button',
          type: 'object',
          fields: [
            defineField({ name: 'ctaLabel', title: 'Button label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'ctaHref', title: 'Button link', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: {
            select: { title: 'ctaLabel' },
            prepare: ({ title }) => ({ title: `Button — ${(typeof title === 'object' ? title?.en : title) || 'Untitled'}` }),
          },
        }),
      ],
    }),
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
      initialValue: 'left',
    }),
    defineField({
      name: 'tone',
      title: 'Background',
      description: 'Fills the full screen width behind the block. None sits straight on the page.',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Light grey', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Accent', value: 'accent' },
          { title: 'Accent gradient', value: 'accentGradient' },
          { title: 'Dark accent gradient', value: 'accentDark' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    paddingTopField,
    paddingBottomField,
    spacingField,
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => {
      const intro = items?.find((i: { _type: string }) => i._type === 'intro')?.headline
      const title = typeof intro === 'object' ? intro?.en || intro?.sv : intro
      return { title: `Sticky Split — ${title || 'Untitled'}`, subtitle: `${items?.length ?? 0} pieces` }
    },
  },
})
