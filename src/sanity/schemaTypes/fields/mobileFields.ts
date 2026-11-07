import { defineField } from 'sanity'

// Fields for a block's Mobile tab (group: 'mobile', see
// blockConventions): phone versions of its settings, each starting as
// "Same as desktop". Used by the heroes; Media has its own.

const SAME = { title: 'Same as desktop', value: 'inherit' }

export const phoneHeadlineSizeField = () =>
  defineField({
    name: 'mobileHeadlineSize',
    title: 'Headline size',
    description: 'On phones: Headline is 36px, Display 56px.',
    type: 'string',
    options: {
      list: [SAME, { title: 'Headline', value: 'h1' }, { title: 'Display', value: 'display' }],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'inherit',
    group: 'mobile',
  })

export const phoneMediaField = (
  name = 'mobileMedia',
  title = 'Phone media',
  description = 'Optional: a different image or video just for phones, e.g. a portrait crop. Empty shows the desktop media.',
) => defineField({ name, title, description, type: 'media', group: 'mobile' })

export const phoneAlignField = (description = 'On phones: how the text lines up.') =>
  defineField({
    name: 'mobileAlign',
    title: 'Text alignment',
    description,
    type: 'string',
    options: {
      list: [SAME, { title: 'Left', value: 'left' }, { title: 'Center', value: 'center' }],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'inherit',
    group: 'mobile',
  })

export const phoneSpacingField = (withNone = true) =>
  defineField({
    name: 'mobileSpacing',
    title: 'Section spacing',
    description: 'On phones: the gap after this block.',
    type: 'string',
    options: {
      list: [
        SAME,
        { title: 'Loose', value: 'loose' },
        { title: 'Medium', value: 'medium' },
        { title: 'Tight', value: 'tight' },
        ...(withNone ? [{ title: 'None', value: 'none' }] : []),
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'inherit',
    group: 'mobile',
  })

export const phoneRatioField = (hidden?: (ctx: { parent?: Record<string, unknown> }) => boolean) =>
  defineField({
    name: 'mobileRatio',
    title: 'Image ratio',
    description: 'The image’s shape on phones. Square and portrait (4:5) suit phones well.',
    type: 'string',
    options: {
      list: [
        SAME,
        { title: '7:5', value: '7:5' },
        { title: '7:4', value: '7:4' },
        { title: '1:1', value: '1:1' },
        { title: '4:5', value: '4:5' },
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'inherit',
    group: 'mobile',
    hidden,
  })
