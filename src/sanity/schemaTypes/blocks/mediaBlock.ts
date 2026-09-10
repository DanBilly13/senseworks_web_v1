import { defineType, defineField } from 'sanity'

export const mediaBlock = defineType({
  name: 'mediaBlock',
  title: 'Media',
  type: 'object',
  fields: [
    // Optional, matching every other block's `media` field (Hero,
    // Feature Split, Bento Grid, Case Study Grid) — the component
    // already renders a placeholder when it's empty, so this was
    // blocking Studio publish for no real reason.
    defineField({ name: 'media', title: 'Media', type: 'media' }),
  ],
  preview: {
    select: { alt: 'media.alt', mediaType: 'media.mediaType' },
    prepare: ({ alt, mediaType }) => ({
      title: `Media — ${alt || 'Untitled'}`,
      subtitle: mediaType ? mediaType.charAt(0).toUpperCase() + mediaType.slice(1) : undefined,
    }),
  },
})
