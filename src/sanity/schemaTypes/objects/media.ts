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
          { title: 'React animation', value: 'reactAnimation' },
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
      name: 'animation',
      title: 'Animation',
      description:
        'A curated, code-built animation — not an upload. Adding a new one is a dev task; this just picks which already-built one runs here.',
      type: 'string',
      options: {
        list: [
          { title: 'Upload Queue Loop', value: 'uploadQueueLoop' },
          { title: 'Integration Card Stack', value: 'integrationCardStack' },
          { title: 'Bevis Sidebar', value: 'bevisSidebarAnimation' },
          { title: 'Settings Form', value: 'settingsFormAnimation' },
        ],
      },
      hidden: ({ parent }) => parent?.mediaType !== 'reactAnimation',
    }),
    defineField({
      name: 'scale',
      title: 'Scale',
      description:
        'How much of the frame this fills. Video always fills the frame edge-to-edge, so this only applies to images and React animations.',
      type: 'number',
      options: {
        list: [
          { title: '100%', value: 100 },
          { title: '80%', value: 80 },
          { title: '60%', value: 60 },
        ],
        layout: 'radio',
      },
      initialValue: 100,
      hidden: ({ parent }) => !['image', 'reactAnimation'].includes(parent?.mediaType),
    }),
    defineField({
      name: 'align',
      title: 'Position',
      description: 'Where it sits within the frame once Scale is below 100%.',
      type: 'string',
      options: {
        list: [
          { title: 'Center', value: 'center' },
          { title: 'Top', value: 'top' },
          { title: 'Bottom', value: 'bottom' },
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'center',
      hidden: ({ parent }) => !['image', 'reactAnimation'].includes(parent?.mediaType) || parent?.scale === 100,
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
