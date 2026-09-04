import { defineType, defineField } from 'sanity'

export const media = defineType({
  name: 'media',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      title: 'Media type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Lottie animation', value: 'lottie' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video file',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'lottie',
      title: 'Lottie JSON file',
      type: 'file',
      options: { accept: 'application/json,.json' },
      hidden: ({ parent }) => parent?.mediaType !== 'lottie',
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describes the media for accessibility. Optional for a purely decorative Lottie animation.',
    }),
  ],
  preview: {
    select: { mediaType: 'mediaType', image: 'image' },
    prepare: ({ mediaType, image }) => ({
      title: `Media${mediaType ? ` (${mediaType})` : ''}`,
      media: image,
    }),
  },
})
