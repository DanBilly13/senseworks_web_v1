import { defineField } from 'sanity'

// The shape of the block's background: Content width is a panel the
// width of the page column, Full screen width runs edge to edge. The
// content always sits in the page column (capped at 1920px, like every
// other block). Without a background the two look the same.
export const contentWidthField = defineField({
  name: 'width',
  title: 'Width',
  description:
    'The shape of the background. Content width: a panel the width of the page column (edge to edge on phones). Full screen width: edge to edge. The content stays in the page column either way. No effect without a background.',
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
