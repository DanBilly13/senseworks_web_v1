import { defineField } from 'sanity'
import { paddingField } from './spacingField'

// The optional full screen width background shared by Section Headline,
// Bento Grid, Card Grid and Feature Grid (components/ui/BandFill), plus
// the block's Top/Bottom padding — always shown and always used exactly
// as set, whatever the background (no automatic rules, see BandFill).
// withDarkGradient adds the Dark accent gradient.
// fieldName: 'tone' unless the block already uses that for something
// else (Card Grid's card style).
const PADDING_DESCRIPTION: Record<'top' | 'bottom', string> = {
  top: 'Space above the content, inside the background when there is one. Left unset: none without a background, Medium with one.',
  bottom:
    'Space below the content, inside the background when there is one. Left unset: none without a background, Medium with one. Section spacing (below) is the gap after the block, outside the background.',
}

export const bandFields = ({ withDarkGradient = false, fieldName = 'tone' } = {}) => [
  defineField({
    name: fieldName,
    title: 'Background',
    description:
      'None sits straight on the page. Dark or Accent fills the full screen width. For two blocks to read as one band, give both the same background and set the padding and spacing between them.',
    type: 'string',
    options: {
      list: [
        { title: 'None (the page background)', value: 'none' },
        { title: 'Dark', value: 'inverse' },
        { title: 'Accent', value: 'accent' },
        ...(withDarkGradient ? [{ title: 'Dark accent gradient (the accent fading to black)', value: 'accentDark' }] : []),
      ],
      layout: 'radio',
    },
    initialValue: 'none',
  }),
  // No pre-filled value: unset keeps the defaults above.
  { ...paddingField('top'), initialValue: undefined, description: PADDING_DESCRIPTION.top },
  { ...paddingField('bottom'), initialValue: undefined, description: PADDING_DESCRIPTION.bottom },
]
