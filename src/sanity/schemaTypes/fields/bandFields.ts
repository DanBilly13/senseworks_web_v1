import { defineField } from 'sanity'
import { paddingField } from './spacingField'

// The optional full screen width background shared by Section Headline
// and Bento Grid (components/ui/BandFill): the Background choice, plus
// Top/Bottom padding inside the color, shown only once there is one.
const hiddenWithoutBackground = ({ parent }: { parent?: { tone?: string } }) => !parent?.tone || parent.tone === 'none'

// withDarkGradient adds the Dark accent gradient (Bento Grid).
export const bandFields = ({ withDarkGradient = false } = {}) => [
  defineField({
    name: 'tone',
    title: 'Background',
    description:
      'None sits straight on the page. Dark or Accent fills the full screen width, with its own top and bottom padding below. Next to a Section Headline or Bento Grid with the same background, the two join into one band.',
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
