import { defineField } from 'sanity'

// Content width keeps the block's content in the page column (capped at
// 1920px, like every other block); Full screen width lets it run to the
// screen edges on wide monitors, still inside the side padding. The
// background (if any) always fills the screen width either way.
export const contentWidthField = defineField({
  name: 'width',
  title: 'Width',
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
