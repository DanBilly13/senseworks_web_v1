import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'
import { bodyFontField, cardDesignField, cardLinkFields, cardMarkField, cardNumbersField, linkStyleField, NO_FILL_OPTION } from '../fields/editorialCardFields'

// Deliberately no top-level eyebrow/heading/body — unlike most grid
// blocks, this one is meant to be paired with a separate intro block
// (e.g. Section Headline) when one's needed, not to carry its own.
export const cardGridBlock = defineType({
  name: 'cardGridBlock',
  title: 'Card Grid',
  type: 'object',
  fields: [
    hiddenField,
    cardDesignField,
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
          { title: 'White', value: 'white' },
          { title: 'Dark', value: 'dark' },
          { title: 'Accent', value: 'accent' },
          NO_FILL_OPTION,
        ],
        layout: 'radio',
      },
      initialValue: 'white',
    }),
    defineField({
      name: 'titleSize',
      title: 'Card title size',
      description: 'How big each card’s title is drawn.',
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
      name: 'numberedEyebrow',
      title: 'Numbered eyebrow',
      description:
        'Standard cards: highlights the first word of each card\'s eyebrow (e.g. "01") as a small colored badge, matching the card style above. Turn on only when every eyebrow below actually starts with a number.',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.cardDesign === 'editorial',
    }),
    cardMarkField,
    cardNumbersField,
    bodyFontField,
    linkStyleField,
    defineField({
      name: 'showImage',
      title: 'Show image',
      description:
        'Adds an image above each card\'s eyebrow (7:5 ratio). Only used when a card below has one uploaded.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'layout',
      title: 'Card layout',
      description:
        'Standard cards: each column is its own separately boxed card, with a gap between them. Merged: the card style becomes one shared panel — columns sit flush with no gap, and it goes full screen width on mobile.',
      type: 'string',
      options: {
        list: [
          { title: 'Cards (default)', value: 'cards' },
          { title: 'Merged', value: 'merged' },
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
      hidden: ({ parent }) => parent?.cardDesign === 'editorial',
    }),
    ...bandFields({ withDarkGradient: true, fieldName: 'background' }),
    spacingField,
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              description: '7:5 ratio. Only shown when "Show image" is on above.',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'imageAlt',
              title: 'Image alt text',
              type: 'string',
              hidden: ({ parent }) => !parent?.image,
            }),
            defineField({
              name: 'imageFade',
              title: 'Fade image edges',
              description:
                'Fades the image\'s right and bottom edges to transparent, revealing the card\'s own background behind it.',
              type: 'boolean',
              initialValue: false,
              hidden: ({ parent }) => !parent?.image,
            }),
            defineField({
              name: 'eyebrow',
              title: 'Eyebrow',
              description: 'e.g. "01 — Intelligent".',
              type: 'string',
              validation: (Rule) => Rule.max(60),
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
            ...cardLinkFields,
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
