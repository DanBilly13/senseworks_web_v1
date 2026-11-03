import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'
import { headlineSizeField } from '../fields/headlineSizeField'

// Experimental Hero: a dark or accent screen — the headline top left,
// the body and button bottom right, the Senseworks mark bottom left —
// under a small image/video. Scrolling grows the media over the text to
// the content width; then the page scrolls on as normal.
export const heroScrollZoomBlock = defineType({
  name: 'heroScrollZoomBlock',
  title: 'Hero — Scroll Zoom',
  type: 'object',
  fields: [
    hiddenField,
    defineField({
      name: 'headline',
      // Text, not string, so Enter adds a line break (see SectionIntro).
      type: 'text',
      rows: 2,
      description: 'Press Enter for a line break.',
      validation: (Rule) => Rule.required().max(80),
    }),
    { ...headlineSizeField(), initialValue: 'display' },
    defineField({
      name: 'subhead',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(350),
    }),
    defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'Button link', type: 'string' }),
    defineField({
      name: 'media',
      title: 'Media',
      description: 'The image or video that starts small over the text and grows to cover it, at the content width.',
      type: 'media',
    }),
    defineField({
      name: 'tone',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'Dark', value: 'inverse' },
          { title: 'Accent', value: 'accent' },
        ],
        layout: 'radio',
      },
      initialValue: 'inverse',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({
      title: `Hero — Scroll Zoom — ${typeof title === 'object' ? title?.en || title?.sv : title || 'Untitled'}`,
    }),
  },
})
