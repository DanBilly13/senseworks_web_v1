import { defineField } from 'sanity'

// The shape of the block's container: Content width is the page column
// (capped at 1920px, like every other block), Full screen width runs
// edge to edge. With a background, that's the background's shape (a
// panel, or a full-width band); the content always fills the container,
// minus its padding.
export const contentWidthField = defineField({
  name: 'width',
  title: 'Width',
  description:
    'The width of the block’s container — with a background, the background’s shape. Content width: a panel the width of the page column (edge to edge on phones). Full screen width: edge to edge. The content fills it, minus the padding.',
  type: 'string',
  options: {
    list: [
      { title: 'Content width (default)', value: 'content' },
      { title: 'Full screen width', value: 'full' },
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
  initialValue: 'content',
})
