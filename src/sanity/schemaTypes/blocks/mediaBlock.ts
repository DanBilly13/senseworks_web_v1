import { defineType, defineField } from 'sanity'
import { hiddenField } from '../fields/hiddenField'

export const mediaBlock = defineType({
  name: 'mediaBlock',
  title: 'Media',
  type: 'object',
  fields: [
    hiddenField,
    // Optional, matching every other block's `media` field (Hero,
    // Feature Split, Bento Grid, Case Study Grid) — the component
    // already renders a placeholder when it's empty, so this was
    // blocking Studio publish for no real reason.
    defineField({ name: 'media', title: 'Media', type: 'media' }),
    // All optional, and all off by default (empty) — an editor using
    // this block for plain media, no text, sees no change. Filling any
    // of these in switches the component into the overlay layout: a
    // scrim over the media with this copy on top, same treatment as
    // Hero's "image overlay" layout.
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({
      name: 'headline',
      type: 'string',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(500),
    }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' }),
    defineField({
      name: 'align',
      title: 'Text alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: { alt: 'media.alt', mediaType: 'media.mediaType', headline: 'headline' },
    prepare: ({ alt, mediaType, headline }) => ({
      title: `Media — ${headline || alt || 'Untitled'}`,
      subtitle: mediaType ? mediaType.charAt(0).toUpperCase() + mediaType.slice(1) : undefined,
    }),
  },
})
