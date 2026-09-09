import { defineType, defineField } from 'sanity'

export const mediaBlock = defineType({
  name: 'mediaBlock',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'media',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { alt: 'media.alt', mediaType: 'media.mediaType' },
    prepare: ({ alt, mediaType }) => ({
      title: `Media — ${alt || 'Untitled'}`,
      subtitle: mediaType ? mediaType.charAt(0).toUpperCase() + mediaType.slice(1) : undefined,
    }),
  },
})
