import { defineField } from 'sanity'
import { paddingField } from './spacingField'

// The optional full screen width background shared by Section Headline,
// Bento Grid and Card Grid (components/ui/BandFill): the Background
// choice, plus Top/Bottom padding inside the color, shown only once
// there is one.
// withDarkGradient adds the Dark accent gradient (Bento Grid, Card Grid).
// fieldName: 'tone' unless the block already uses that for something
// else (Card Grid's card style), see BAND_TONE_FIELD in ui/BandFill.
export const bandFields = ({ withDarkGradient = false, fieldName = 'tone' } = {}) => {
  const hiddenWithoutBackground = ({ parent }: { parent?: Record<string, unknown> }) =>
    !parent?.[fieldName] || parent[fieldName] === 'none'
  return [
    defineField({
      name: fieldName,
      title: 'Background',
      description:
        'None sits straight on the page. Dark or Accent fills the full screen width, with its own top and bottom padding below. Next to a Section Headline, Bento Grid, Card Grid or Feature Grid with the same background, the two join into one band: the Bottom padding of the first is the space between them.',
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
    { ...paddingField('top', 'medium'), hidden: hiddenWithoutBackground },
    { ...paddingField('bottom', 'medium'), hidden: hiddenWithoutBackground },
  ]
}
