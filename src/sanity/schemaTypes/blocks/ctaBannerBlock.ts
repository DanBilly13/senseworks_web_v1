import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { paddingField, spacingField } from '../fields/spacingField'

export const ctaBannerBlock = defineType({
  name: 'ctaBannerBlock',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      type: 'string',
      validation: (Rule) => Rule.max(100),
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
    defineField({ name: 'ctaNote', title: 'Button note', description: 'Small line of microcopy under the buttons.', type: 'string' }),
    defineField({
      name: 'buttonVariant',
      title: 'Button color',
      description: 'Leave unset to auto-match the tone below (the page\'s accent colour on Inverse, dark otherwise).',
      type: 'string',
      options: {
        list: [
          { title: 'Dark', value: 'filled-dark' },
          { title: 'Accent', value: 'filled-accent' },
          { title: 'White', value: 'filled-light' },
          { title: 'Ghost (outlined)', value: 'ghost' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      description:
        'Optional — sits behind the text, filling the whole banner edge-to-edge. Use a PNG with a transparent background so the tone color below still shows through it.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'width',
      title: 'Width',
      description:
        'Full screen width runs the background edge to edge with square corners. Content width sits it inside the page margins with 16px rounded corners, like a content-width Media.',
      type: 'string',
      options: {
        list: [
          { title: 'Full screen width (default)', value: 'full' },
          { title: 'Content width', value: 'content' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
    }),
    defineField({
      name: 'tone',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Light grey', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Accent', value: 'accent' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
      validation: (Rule) => Rule.required(),
    }),
    // Inside the banner above/below its content, then the gap after it —
    // defaults are the banner's original look (Tight inside, no gap).
    { ...paddingField('top', 'tight'), description: 'Space above the content, inside the banner.' },
    { ...paddingField('bottom', 'tight'), description: 'Space below the content, inside the banner.' },
    { ...spacingField, initialValue: 'none' },
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: `CTA Banner — ${title || 'Untitled'}` }),
  },
})
