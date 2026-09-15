import { defineType, defineField } from 'sanity'

// Experimental Hero variant: a flexible full-bleed backdrop (image,
// solid color, or the shared accent gradient) behind text plus a
// separate "showcase" image/video sitting on top of it. Kept as its
// own block (not a heroBlock layout option) so it can be iterated on
// or dropped without touching the stable Hero block.
export const heroBackdropBlock = defineType({
  name: 'heroBackdropBlock',
  title: 'Hero — Backdrop (experimental)',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundType',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Color', value: 'color' },
          { title: 'Gradient', value: 'gradient' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'media',
      hidden: ({ parent }) => parent?.backgroundType !== 'image',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (foreground)', value: 'foreground' },
          { title: 'Accent', value: 'accent' },
          { title: 'Surface', value: 'surface' },
        ],
        layout: 'radio',
      },
      initialValue: 'foreground',
      hidden: ({ parent }) => parent?.backgroundType !== 'color',
    }),
    defineField({
      name: 'textTone',
      title: 'Text Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Light text', value: 'light' },
          { title: 'Dark text', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
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
      validation: (Rule) => Rule.max(350),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({
      name: 'showcaseMedia',
      title: 'Showcase Media',
      description:
        'Sits on top of the backdrop, below the text — starts at 50% of the viewport height while we dial this in.',
      type: 'media',
    }),
  ],
  preview: {
    select: { title: 'headline', backgroundType: 'backgroundType' },
    prepare: ({ title, backgroundType }) => ({
      title: `Hero — Backdrop — ${title || 'Untitled'}`,
      subtitle: `Background: ${backgroundType || 'image'}`,
    }),
  },
})
