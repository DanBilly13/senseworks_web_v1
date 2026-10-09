import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { spacingField } from '../fields/spacingField'
import { headlineSizeField } from '../fields/headlineSizeField'

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
    headlineSizeField(),
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
      title: 'Text card background — desktop',
      description:
        'The fill behind the eyebrow/headline/body/button card itself, desktop only — not the backdrop around it or the video (see Backdrop color, below), and not mobile (see Text card background — mobile, below) — desktop and mobile can each have their own fill.',
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
      name: 'cardBackgroundMobile',
      title: 'Text card background — mobile',
      description:
        'Same fill, mobile only — independent of the desktop option above (e.g. dark on desktop, gradient on mobile, or any other combination).',
      type: 'string',
      options: {
        list: [
          { title: 'Light (dark text) — the original mobile default', value: 'light' },
          { title: 'Dark (light text)', value: 'dark' },
          { title: 'Gradient (dark text)', value: 'gradient' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
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
      title: 'Backdrop color',
      description:
        'The page background showing around the video and (at Card width 50%) beside the text card — NOT the text card’s own fill (see Text card background, above). Only visible where the card doesn’t fully cover the row, e.g. has little effect at Card width 100%.',
      type: 'string',
      options: {
        list: [
          { title: 'Default (muted background)', value: 'default' },
          { title: 'Inverse (dark background)', value: 'inverse' },
          { title: 'Accent (accent background)', value: 'accent' },
          { title: 'Gradient (same accent gradient as the card option)', value: 'gradient' },
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
