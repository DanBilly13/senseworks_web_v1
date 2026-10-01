import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'

// Split out of heroBlock's `layout` options (was "imageOverlayCard")
// once it grew its own scroll-driven pin/morph interaction and two
// layout-specific fields — kept as its own block, same reasoning as
// heroBackdropBlock, so it can keep evolving without touching the
// stable Hero block or its simpler layout switch.
export const heroImageOverlayCardBlock = defineType({
  name: 'heroImageOverlayCardBlock',
  title: 'Hero — Image Overlay Card (experimental)',
  type: 'object',
  fields: [
    hiddenField,
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
    defineField({ name: 'media', title: 'Media', type: 'media' }),
    defineField({
      name: 'cardBackground',
      title: 'Card background',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (light text)', value: 'dark' },
          { title: 'Gradient (dark text)', value: 'gradient' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'cardWidth',
      title: 'Card width',
      description:
        'A fraction of the hero\'s own content width (capped at the page width), not the full screen.',
      type: 'string',
      options: {
        list: [
          { title: '50%', value: '50' },
          { title: '100%', value: '100' },
        ],
        layout: 'radio',
      },
      initialValue: '50',
    }),
    defineField({
      name: 'tone',
      title: 'Area around video',
      description:
        'Background color for the space around the video — to its sides once it narrows on desktop, the gutter beside it on mobile. Not the card overlay itself (Card background, above).',
      type: 'string',
      options: {
        list: [
          { title: 'Default (muted background)', value: 'default' },
          { title: 'Inverse (dark background)', value: 'inverse' },
          { title: 'Accent (accent background)', value: 'accent' },
          { title: 'Gradient (same as the gradient card background)', value: 'gradient' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
    spacingField,
  ],
  preview: {
    select: { title: 'headline', cardBackground: 'cardBackground' },
    prepare: ({ title, cardBackground }) => ({
      title: `Hero — Image Overlay Card — ${title || 'Untitled'}`,
      subtitle: `Card background: ${cardBackground || 'dark'}`,
    }),
  },
})
