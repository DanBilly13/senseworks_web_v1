import { defineType, defineField, defineArrayMember } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headingLayoutField } from '../fields/headingLayoutField'
import { titleSizeField } from '../fields/titleSizeField'
import { spacingField } from '../fields/spacingField'
import { bandFields } from '../fields/bandFields'

// Like Card Grid, but each item is a rounded 7:5 image with its text
// underneath, straight on the page — no card around the text. No intro
// of its own; pair it with a Section Headline above it.
export const imageGridBlock = defineType({
  name: 'imageGridBlock',
  title: 'Image Grid',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'columns',
      title: 'Columns (desktop)',
      description: 'Tablet shows 2 regardless — this only sets the desktop layout.',
      type: 'string',
      options: {
        list: [
          { title: '2', value: '2' },
          { title: '3 (default)', value: '3' },
          { title: '4', value: '4' },
        ],
        layout: 'radio',
      },
      initialValue: '3',
    }),
    headingLayoutField,
    titleSizeField('h4'),
    ...bandFields({ withDarkGradient: true }),
    spacingField,
    defineField({
      name: 'items',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'media', title: 'Image', description: 'Shown 7:5, with rounded corners.', type: 'media' }),
            defineField({ name: 'eyebrow', type: 'string', description: 'Optional small label above the title.' }),
            defineField({ name: 'title', type: 'text', rows: 2, description: 'Press Enter for a line break.', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', type: 'text', rows: 3 }),
            defineField({ name: 'ctaLabel', title: 'Link label', type: 'string', description: 'Optional link under the text.' }),
            defineField({ name: 'ctaHref', title: 'Link href', type: 'string' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'eyebrow', media: 'media.image' },
            prepare: ({ title, subtitle, media }) => ({
              // Localized fields arrive as { en, sv } pairs here.
              title: (typeof title === 'object' ? title?.en || title?.sv : title) || 'Untitled',
              subtitle: typeof subtitle === 'object' ? subtitle?.en || subtitle?.sv : subtitle,
              media,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({ title: 'Image Grid', subtitle: `${items?.length ?? 0} items` }),
  },
})
