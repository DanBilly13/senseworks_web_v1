import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField, paddingField } from '../fields/spacingField'

export const fullWidthSingleBlock = defineType({
  name: 'fullWidthSingleBlock',
  title: 'Full Width Single',
  type: 'object',
  fields: [
    hiddenField,
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'numberedEyebrow',
      title: 'Numbered eyebrow',
      description:
        'Highlights the first word of the eyebrow (e.g. "01") as a small colored badge, matching the panel style above.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'heading',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'Button link', type: 'string' }),
    defineField({
      name: 'tone',
      title: 'Panel style',
      type: 'string',
      options: {
        list: [
          { title: 'Default (muted background, dark text)', value: 'default' },
          { title: 'Inverse (dark background, light text)', value: 'inverse' },
          { title: 'Accent (accent background, dark text)', value: 'accent' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'align',
      title: 'Text alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Center', value: 'center' },
          { title: 'Left', value: 'left' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),
    defineField({ name: 'media', title: 'Media', type: 'media' }),
    defineField({
      name: 'media2',
      title: 'Second image (optional)',
      description:
        'Fill this in alongside Media above to show two images side by side with a gutter, instead of one. Only takes effect when both are images — a video/lottie/animation in either slot falls back to the single-media treatment.',
      type: 'media',
    }),
    spacingField,
    paddingField('top'),
    paddingField('bottom'),
  ],
  preview: {
    select: { title: 'heading', media: 'media.image' },
    prepare: ({ title, media }) => ({
      title: `Full Width Single — ${title || 'Untitled'}`,
      media,
    }),
  },
})
